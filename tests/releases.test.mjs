import test from "node:test";
import assert from "node:assert/strict";
import { parseRelease, fallbackRelease } from "../lib/site-config.ts";
const prefix =
  "https://github.com/Benfic4rthur/Allm4-Releases/releases/download/v1.2.3/";
const asset = (name, url = prefix + name) => ({
  name,
  state: "uploaded",
  browser_download_url: url,
});
const release = (assets, extra = {}) => ({
  draft: false,
  prerelease: false,
  tag_name: "v1.2.3",
  assets,
  ...extra,
});
test("selects official installers, not blockmaps or source archives", () => {
  const result = parseRelease(
    release([
      asset("Allm4.dmg.blockmap"),
      asset("Allm4.dmg"),
      asset("Allm4.zip"),
      asset("Allm4-Setup.exe"),
    ]),
  );
  assert.equal(result.version, "1.2.3");
  assert.equal(result.mac, prefix + "Allm4.dmg");
  assert.equal(result.windows, prefix + "Allm4-Setup.exe");
});
test("a partial release does not claim an unavailable installer exists", () => {
  assert.equal(parseRelease(release([asset("Allm4.dmg")])).windows, null);
});
test("rejects malformed, draft, prerelease and foreign asset data", () => {
  for (const data of [
    null,
    {},
    [],
    release([null, 3, {}, asset("Allm4.dmg", "https://example.com/fake.dmg")]),
    release([asset("Allm4.dmg")], { draft: true }),
    release([asset("Allm4.dmg")], { prerelease: true }),
    release([asset("Allm4.dmg")], { tag_name: "../../other" }),
  ])
    assert.equal(parseRelease(data), null);
});
test("the verified fallback contains separate official Mac and Windows installers", () => {
  assert.match(fallbackRelease.mac, /\/v0\.1\.12\/Allm4-0\.1\.12\.dmg$/);
  assert.match(
    fallbackRelease.windows,
    /\/v0\.1\.12\/Allm4-Setup-0\.1\.12\.exe$/,
  );
});
