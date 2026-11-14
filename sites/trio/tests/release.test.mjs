import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { ASSET_NAME, GITHUB_API_URL, PUBLIC_DISTRIBUTION_URL, PUBLIC_DOWNLOAD_URL,
  parseRelease, parseBundledRelease, parseDistribution, getLatestRelease, resolveRelease } from "../src/release.mjs";

const digest = "a".repeat(64);
const fallback = {
  bundleIdentifier: "com.allm4.Trio", version: "0.1.0", build: "7", minOS: "13.0",
  architectures: ["arm64", "x86_64"], assetName: ASSET_NAME, sha256: digest, size: 1842612,
  distribution: "local-preview", publicRelease: false, notarized: false
};
function github(overrides = {}) {
  return {
    draft: false, prerelease: false, tag_name: "v0.2.0",
    assets: [{ name: ASSET_NAME, state: "uploaded", size: 2000000, digest: `sha256:${digest}`,
      browser_download_url: `https://github.com/Benfic4rthur/Trio/releases/download/v0.2.0/${ASSET_NAME}` }], ...overrides
  };
}

test("GitHub release produces only repository-owned download links", () => {
  const result = parseRelease(github());
  assert.equal(result.version, "0.2.0");
  assert.equal(result.url, `https://github.com/Benfic4rthur/Trio/releases/latest/download/${ASSET_NAME}`);
  assert.equal(result.source, "github");
  assert.equal(result.notarized, null);
  assert.equal(result.build, null);
});

test("draft, prerelease, missing and invalid semantic tags are rejected", () => {
  for (const data of [github({ draft: true }), github({ prerelease: true }), github({ tag_name: "latest" }),
    github({ tag_name: "v1.2" }), github({ tag_name: "v01.2.0" }), github({ tag_name: "v1.2.0/../../evil" }),
    github({ tag_name: "v1.2.0-01" })]) assert.throws(() => parseRelease(data));
});

test("a missing, duplicate or incomplete Universal asset cannot become a download", () => {
  assert.throws(() => parseRelease(github({ assets: [] })));
  assert.throws(() => parseRelease(github({ assets: [github().assets[0], github().assets[0]] })));
  for (const update of [{ state: "new" }, { size: -1 }, { size: Infinity }, { digest: "sha256:invalid" }]) {
    assert.throws(() => parseRelease(github({ assets: [{ ...github().assets[0], ...update }] })));
  }
});

test("asset URL injection through host, userinfo, repo, query or fragment is rejected", () => {
  const real = github().assets[0].browser_download_url;
  for (const url of [real.replace("github.com", "github.com.evil.test"), real.replace("https://", "http://"),
    real.replace("github.com", "attacker@github.com"), real.replace("Benfic4rthur", "attacker"),
    `${real}?redirect=https://evil.test`, `${real}#untrusted`, "javascript:alert(1)"]) {
    assert.throws(() => parseRelease(github({ assets: [{ ...github().assets[0], browser_download_url: url }] })));
  }
});

test("a checksum URL is available only for an actual validated checksum asset", () => {
  assert.equal(parseRelease(github()).checksumUrl, null);
  const data = github();
  data.assets.push({ name: `${ASSET_NAME}.sha256`, state: "uploaded", size: 91,
    browser_download_url: `${data.assets[0].browser_download_url}.sha256` });
  assert.equal(parseRelease(data).checksumUrl, `${data.assets[0].browser_download_url}.sha256`);
});

test("missing GitHub and repository releases return the exact bundled release", async () => {
  const result = await resolveRelease({ fallback, base: "..", fetcher: async () => ({ ok: false, status: 404 }) });
  assert.equal(result.version, fallback.version);
  assert.equal(result.build, fallback.build);
  assert.equal(result.sha256, fallback.sha256);
  assert.equal(result.url, `../downloads/${ASSET_NAME}`);
  assert.equal(result.source, "bundled");
  assert.equal(result.publicRelease, false);
  assert.equal(result.notarized, false);
});

test("network errors and malformed public responses use the bundled artifact", async () => {
  for (const fetcher of [async () => { throw new Error("offline"); }, async () => ({ ok: true, json: async () => ({}) })]) {
    const result = await resolveRelease({ fallback, base: ".", fetcher });
    assert.equal(result.url, `./downloads/${ASSET_NAME}`);
    assert.equal(result.version, "0.1.0");
  }
});

test("a stalled fetch cannot prevent the local fallback indefinitely", async () => {
  const started = performance.now();
  const result = await resolveRelease({ fallback, base: ".", timeoutMs: 12, fetcher: () => new Promise(() => {}) });
  assert.equal(result.source, "bundled");
  assert.ok(performance.now() - started < 1000);
});

test("an abort signal cancels even a fetch implementation that ignores its signal", async () => {
  const controller = new AbortController();
  const pending = resolveRelease({ fallback, base: ".", signal: controller.signal, timeoutMs: 1000,
    fetcher: () => new Promise(() => {}) });
  controller.abort();
  const started = performance.now();
  assert.equal((await pending).source, "bundled");
  assert.ok(performance.now() - started < 500);
});

test("latest-release requests use the fixed API and omit credentials", async () => {
  const calls = [];
  const result = await getLatestRelease(async (url, options) => {
    calls.push({ url, options }); return { ok: true, json: async () => github() };
  }, { fallback });
  assert.equal(result.source, "github");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, GITHUB_API_URL);
  assert.equal(calls[0].options.credentials, "omit");
  assert.equal(calls[0].options.headers.Authorization, undefined);
});

test("bundled links ignore untrusted metadata URLs and reject invalid integrity metadata", () => {
  assert.equal(parseBundledRelease({ ...fallback, url: "https://evil.test/install.zip" }, { base: "." }).url, `./downloads/${ASSET_NAME}`);
  assert.throws(() => parseBundledRelease({ ...fallback, sha256: "invalid" }));
  assert.throws(() => parseBundledRelease({ ...fallback, build: "" }));
  assert.throws(() => parseBundledRelease(fallback, { base: "https://evil.test" }));
});

test("automatic fallback loads the local release metadata without an invented version", async () => {
  const calls = [];
  const result = await getLatestRelease(async url => {
    calls.push(url);
    return url === GITHUB_API_URL ? { ok: false, status: 404 } : { ok: true, json: async () => fallback };
  }, { base: "." });
  assert.equal(result.build, "7");
  assert.equal(calls.length, 3);
  assert.equal(calls[1], PUBLIC_DISTRIBUTION_URL);
  assert.ok(calls[2].endsWith("/downloads/release.json"));
});

test("a missing GitHub Release uses the validated public repository distribution", async () => {
  const calls = [];
  const publicMetadata = { ...fallback, url: PUBLIC_DOWNLOAD_URL, distribution: "repository-distribution", publicDownload: true };
  const result = await resolveRelease({ fallback, base: ".", fetcher: async url => {
    calls.push(url);
    return url === GITHUB_API_URL ? { ok: false, status: 404 } : { ok: true, json: async () => publicMetadata };
  } });
  assert.deepEqual(calls, [GITHUB_API_URL, PUBLIC_DISTRIBUTION_URL]);
  assert.equal(result.source, "repository");
  assert.equal(result.publicRelease, false);
  assert.equal(result.publicDownload, true);
  assert.equal(result.url, PUBLIC_DOWNLOAD_URL);
  assert.equal(result.checksumUrl, `${PUBLIC_DOWNLOAD_URL}.sha256`);
  assert.equal(result.version, fallback.version);
  assert.equal(result.build, fallback.build);
});

test("public metadata cannot redirect to an arbitrary asset or claim a GitHub Release", () => {
  const actual = { ...fallback, url: PUBLIC_DOWNLOAD_URL, distribution: "repository-distribution", publicDownload: true };
  assert.equal(parseDistribution(actual).source, "repository");
  for (const update of [{ url: "https://evil.test/Trio.zip" }, { url: `${PUBLIC_DOWNLOAD_URL}?redirect=1` },
    { url: PUBLIC_DOWNLOAD_URL.replace("main/distribution", "other/distribution") },
    { publicRelease: true }, { sha256: "invalid" }, { version: "latest" }, { publicDownload: false }]) {
    assert.throws(() => parseDistribution({ ...actual, ...update }));
  }
});

test("actual package metadata retains its real version and build on API failure", async () => {
  const actual = JSON.parse(await readFile(new URL("../distribution/release.json", import.meta.url), "utf8"));
  const result = await resolveRelease({ fallback: actual, base: ".", fetcher: async () => ({ ok: false }) });
  assert.equal(result.version, actual.version);
  assert.equal(result.build, String(actual.build));
  assert.equal(result.sha256, actual.sha256);
});
