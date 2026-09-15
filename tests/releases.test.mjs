import test from "node:test";
import assert from "node:assert/strict";
import { parseRelease, fallbackRelease } from "../lib/site-config.ts";

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

test("starts visible counters at two and follows GitHub counts", () => {
  const result = parseRelease(
    release([
      asset(`Allm4-${version}.dmg`, undefined, { download_count: 1 }),
      asset(`Allm4-Setup-${version}.exe`, undefined, { download_count: 8 }),
    ]),
  );

  assert.equal(result.macDownloads, 2);
  assert.equal(result.windowsDownloads, 9);
});

test("falls back to two when GitHub count is unavailable or invalid", () => {
  const result = parseRelease(
    release([
      asset(`Allm4-${version}.dmg`, undefined, { download_count: null }),
      asset(`Allm4-Setup-${version}.exe`, undefined, { download_count: -1 }),
    ]),
  );

  assert.equal(result.macDownloads, 2);
  assert.equal(result.windowsDownloads, 2);
});

test("a partial release does not claim an unavailable installer exists", () => {
  const result = parseRelease(release([asset(`Allm4-${version}.dmg`)]));
  assert.equal(result.windows, null);
  assert.equal(result.windowsDownloads, 2);
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
  assert.match(fallbackRelease.mac, /\/v0\.1\.13\/Allm4-0\.1\.13\.dmg$/);
  assert.match(
    fallbackRelease.windows,
    /\/v0\.1\.13\/Allm4-Setup-0\.1\.13\.exe$/,
  );
  assert.equal(fallbackRelease.macDownloads, 2);
  assert.equal(fallbackRelease.windowsDownloads, 2);
});
