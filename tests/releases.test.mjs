import test from "node:test";
import assert from "node:assert/strict";
import {
  parseRelease,
  parseReleaseHistory,
  fallbackRelease,
} from "../lib/site-config.ts";

const version = "1.2.3";
const tag = `v${version}`;
const prefix =
  `https://github.com/Benfic4rthur/Allm4-Releases/releases/download/${tag}/`;
const trustedUser = { login: "Benfic4rthur" };
const digest = `sha256:${"a".repeat(64)}`;

const asset = (name, url = prefix + name, extra = {}) => ({
  name,
  state: "uploaded",
  uploader: trustedUser,
  digest,
  browser_download_url: url,
  download_count: 1,
  ...extra,
});

const release = (assets, extra = {}) => ({
  draft: false,
  prerelease: false,
  author: trustedUser,
  tag_name: tag,
  assets,
  ...extra,
});

function releaseFor(releaseVersion, macDownloads, windowsDownloads) {
  const releaseTag = `v${releaseVersion}`;
  const releasePrefix =
    `https://github.com/Benfic4rthur/Allm4-Releases/releases/download/${releaseTag}/`;
  const releaseAsset = (name, downloadCount) => ({
    name,
    state: "uploaded",
    uploader: trustedUser,
    digest,
    browser_download_url: releasePrefix + name,
    download_count: downloadCount,
  });

  return {
    draft: false,
    prerelease: false,
    author: trustedUser,
    tag_name: releaseTag,
    assets: [
      releaseAsset(`Allm4-${releaseVersion}.dmg`, macDownloads),
      releaseAsset(`Allm4-Setup-${releaseVersion}.exe`, windowsDownloads),
    ],
  };
}

test("selects only the exact official installers", () => {
  const macName = `Allm4-${version}.dmg`;
  const windowsName = `Allm4-Setup-${version}.exe`;
  const result = parseRelease(
    release([
      asset(`${macName}.blockmap`),
      asset(macName),
      asset(`Allm4-${version}.zip`),
      asset(windowsName),
    ]),
  );

  assert.equal(result.version, version);
  assert.equal(result.mac, prefix + macName);
  assert.equal(result.windows, prefix + windowsName);
});

test("uses the exact download counters reported by GitHub", () => {
  const result = parseRelease(
    release([
      asset(`Allm4-${version}.dmg`, undefined, { download_count: 1 }),
      asset(`Allm4-Setup-${version}.exe`, undefined, { download_count: 8 }),
    ]),
  );

  assert.equal(result.macDownloads, 1);
  assert.equal(result.windowsDownloads, 8);
});

test("uses zero when GitHub count is unavailable or invalid", () => {
  const result = parseRelease(
    release([
      asset(`Allm4-${version}.dmg`, undefined, { download_count: null }),
      asset(`Allm4-Setup-${version}.exe`, undefined, { download_count: -1 }),
    ]),
  );

  assert.equal(result.macDownloads, 0);
  assert.equal(result.windowsDownloads, 0);
});

test("a partial release does not claim an unavailable installer exists", () => {
  const result = parseRelease(release([asset(`Allm4-${version}.dmg`)]));
  assert.equal(result.windows, null);
  assert.equal(result.windowsDownloads, 0);
});

test("sums installer downloads across release history and keeps the newest links", () => {
  const result = parseReleaseHistory([
    releaseFor("1.2.3", 4, 7),
    releaseFor("1.2.5", 2, 3),
    releaseFor("1.2.4", 5, 1),
  ]);

  assert.equal(result.version, "1.2.5");
  assert.match(result.mac, /\/v1\.2\.5\/Allm4-1\.2\.5\.dmg$/);
  assert.match(result.windows, /\/v1\.2\.5\/Allm4-Setup-1\.2\.5\.exe$/);
  assert.equal(result.macDownloads, 11);
  assert.equal(result.windowsDownloads, 11);
});

test("release history ignores invalid entries without losing valid totals", () => {
  const filtered = parseReleaseHistory([
    null,
    releaseFor("1.2.2", 3, 4),
    { ...releaseFor("9.9.9", 100, 100), author: { login: "someone-else" } },
  ]);

  assert.equal(filtered.version, "1.2.2");
  assert.equal(filtered.macDownloads, 3);
  assert.equal(filtered.windowsDownloads, 4);
});

test("rejects malformed, untrusted or foreign release data", () => {
  const macName = `Allm4-${version}.dmg`;
  const invalidCases = [
    null,
    {},
    [],
    release([null, 3, {}, asset(macName, "https://example.com/fake.dmg")]),
    release([asset(macName)], { draft: true }),
    release([asset(macName)], { prerelease: true }),
    release([asset(macName)], { tag_name: "../../other" }),
    release([asset(macName)], { author: { login: "someone-else" } }),
    release([asset(macName, prefix + macName, { uploader: { login: "other" } })]),
    release([asset(macName, prefix + macName, { digest: null })]),
    release([asset("something-else.dmg")]),
  ];

  for (const data of invalidCases) assert.equal(parseRelease(data), null);
});

test("the fallback contains separate official Mac and Windows installers", () => {
  assert.equal(
    fallbackRelease.mac,
    `https://github.com/Benfic4rthur/Allm4-Releases/releases/download/v${fallbackRelease.version}/Allm4-${fallbackRelease.version}.dmg`,
  );
  assert.equal(
    fallbackRelease.windows,
    `https://github.com/Benfic4rthur/Allm4-Releases/releases/download/v${fallbackRelease.version}/Allm4-Setup-${fallbackRelease.version}.exe`,
  );
  assert.ok(Number.isSafeInteger(fallbackRelease.macDownloads));
  assert.ok(Number.isSafeInteger(fallbackRelease.windowsDownloads));
  assert.ok(fallbackRelease.macDownloads >= 0);
  assert.ok(fallbackRelease.windowsDownloads >= 0);
});
