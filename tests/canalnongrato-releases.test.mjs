import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCanalNonGratoRelease } from "../lib/canalnongrato.ts";

function release(version = "1.0.3", filename = `CanalNonGrato-${version}.zip`) {
  return { draft: false, prerelease: false, tag_name: `v${version}`, assets: [{ name: filename, state: "uploaded", size: 35301, browser_download_url: `https://github.com/Benfic4rthur/CanalNonGrato/releases/download/v${version}/${filename}` }] };
}

test("novas releases atualizam versão e ZIP juntos, sem versão fixa no site", () => {
  for (const version of ["1.0.3", "1.1.0", "2.0.0", "2.0.0.1"]) {
    const result = parseCanalNonGratoRelease(release(version));
    assert.equal(result.version, version);
    assert.ok(result.download.endsWith(`/v${version}/CanalNonGrato-${version}.zip`));
    assert.equal(result.size, 35301);
  }
});

test("aceita nome estável do pacote na mesma release e prefere o ZIP versionado", () => {
  assert.equal(parseCanalNonGratoRelease(release("1.1.0", "CanalNonGrato.zip")).filename, "CanalNonGrato.zip");
  const data = release("1.1.0");
  data.assets.unshift(...release("1.1.0", "CanalNonGrato.zip").assets);
  assert.equal(parseCanalNonGratoRelease(data).filename, "CanalNonGrato-1.1.0.zip");
});

test("não oferece rascunhos, pré-lançamentos nem pacotes de outra versão", () => {
  for (const data of [{ ...release(), draft: true }, { ...release(), prerelease: true }, { ...release(), assets: release("1.0.2").assets }, { ...release(), assets: [] }]) assert.equal(parseCanalNonGratoRelease(data), null);
});

test("só aceita arquivos completos do repositório oficial", () => {
  for (const url of ["https://example.org/CanalNonGrato.zip", "https://github.com/outra-conta/CanalNonGrato/releases/download/v1.0.3/CanalNonGrato-1.0.3.zip", "http://github.com/Benfic4rthur/CanalNonGrato/releases/download/v1.0.3/CanalNonGrato-1.0.3.zip"]) {
    const data = release(); data.assets[0].browser_download_url = url;
    assert.equal(parseCanalNonGratoRelease(data), null);
  }
  for (const patch of [{ state: "starter" }, { size: 0 }, { size: NaN }]) {
    const data = release(); Object.assign(data.assets[0], patch);
    assert.equal(parseCanalNonGratoRelease(data), null);
  }
});

test("dados ausentes ou inválidos mantêm o destino da última release, sem ZIP antigo", () => {
  for (const data of [null, undefined, {}, [], "erro", { ...release(), tag_name: "latest" }, { ...release(), assets: [null] }]) assert.equal(parseCanalNonGratoRelease(data), null);
});
