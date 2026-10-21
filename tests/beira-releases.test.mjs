import { test } from "node:test";
import assert from "node:assert/strict";
import { parseBeiraRelease } from "../lib/beira.ts";

function release(version = "0.1.1") {
  return {
    draft: false,
    prerelease: false,
    tag_name: `v${version}`,
    assets: ["Beira-AppleSilicon.zip", "Beira-Intel.zip"].map(name => ({
      name, state: "uploaded",
      browser_download_url: `https://github.com/Benfic4rthur/Beira/releases/download/v${version}/${name}`,
    })),
  };
}

test("a versão exibida e os dois downloads vêm da mesma release", () => {
  for (const version of ["0.1.1", "0.2.0", "1.1.0"]) {
    const result = parseBeiraRelease(release(version));
    assert.equal(result.version, version);
    assert.ok(result.appleSilicon.includes(`/v${version}/`));
    assert.ok(result.intel.includes(`/v${version}/`));
  }
});

test("rascunhos e pré-lançamentos não substituem a versão estável", () => {
  assert.equal(parseBeiraRelease({ ...release(), draft: true }), null);
  assert.equal(parseBeiraRelease({ ...release(), prerelease: true }), null);
});

test("uma publicação incompleta não mistura downloads de versões diferentes", () => {
  const data = release();
  data.assets.pop();
  assert.equal(parseBeiraRelease(data), null);
  assert.equal(parseBeiraRelease({ ...release(), assets: release("0.1.0").assets }), null);
});

test("somente ZIPs enviados no repositório oficial são aceitos", () => {
  for (const url of ["https://example.org/Beira.zip", "http://github.com/Benfic4rthur/Beira/releases/download/v0.1.1/Beira-Intel.zip"]) {
    const data = release();
    data.assets[1].browser_download_url = url;
    assert.equal(parseBeiraRelease(data), null);
  }
  const data = release();
  data.assets[1].state = "starter";
  assert.equal(parseBeiraRelease(data), null);
});

test("respostas ausentes ou malformadas mantêm os links de fallback", () => {
  for (const data of [null, undefined, {}, [], "erro", { ...release(), tag_name: "latest" }, { ...release(), assets: [null] }]) {
    assert.equal(parseBeiraRelease(data), null);
  }
});
