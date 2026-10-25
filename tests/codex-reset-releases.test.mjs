import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCodexResetRelease } from "../lib/codex-reset.ts";

function release(version = "0.1.18") {
  return {
    draft: false,
    prerelease: false,
    tag_name: `v${version}`,
    assets: ["Codex-Reset-Apple-Silicon.dmg", "Codex-Reset-Intel.dmg"].map((name) => ({
      name,
      state: "uploaded",
      browser_download_url: `https://github.com/Benfic4rthur/codex-reset/releases/download/v${version}/${name}`,
    })),
  };
}

test("a versão e os dois DMGs vêm da mesma release estável", () => {
  for (const version of ["0.1.18", "0.2.0", "1.1.0"]) {
    const result = parseCodexResetRelease(release(version));
    assert.ok(result);
    assert.equal(result.version, version);
    assert.equal(result.appleSilicon, release(version).assets[0].browser_download_url);
    assert.equal(result.intel, release(version).assets[1].browser_download_url);
  }
});

test("rascunhos e pré-lançamentos não substituem os downloads estáveis", () => {
  assert.equal(parseCodexResetRelease({ ...release(), draft: true }), null);
  assert.equal(parseCodexResetRelease({ ...release(), prerelease: true }), null);
  assert.equal(parseCodexResetRelease({ ...release(), tag_name: "v0.1.19-beta.1" }), null);
});

test("release incompleta ou com arquiteturas de versões distintas mantém o fallback", () => {
  for (const omittedIndex of [0, 1]) {
    const data = release();
    data.assets.splice(omittedIndex, 1);
    assert.equal(parseCodexResetRelease(data), null);
  }

  const mixed = release();
  mixed.assets[1] = release("0.1.17").assets[1];
  assert.equal(parseCodexResetRelease(mixed), null);
});

test("somente arquivos enviados no repositório oficial são aceitos", () => {
  const official = release().assets[1].browser_download_url;
  for (const url of [
    official.replace("https:", "http:"),
    official.replace("github.com", "example.org"),
    official.replace("github.com", "github.com.example.org"),
    official.replace("github.com", "github.com:8443"),
    official.replace("Benfic4rthur/codex-reset", "other/codex-reset"),
    official.replace("codex-reset", "another-product"),
    official.replace("https://", "https://user@"),
    `${official}?download=other`,
    `${official}#other`,
  ]) {
    const data = release();
    data.assets[1].browser_download_url = url;
    assert.equal(parseCodexResetRelease(data), null, url);
  }

  const pending = release();
  pending.assets[1].state = "starter";
  assert.equal(parseCodexResetRelease(pending), null);
});

test("respostas ausentes ou malformadas não produzem uma versão inventada", () => {
  for (const data of [
    null, undefined, {}, [], "erro", 123,
    { ...release(), tag_name: "latest" },
    { ...release(), assets: null },
    { ...release(), assets: [null, 12, "arquivo", []] },
  ]) {
    assert.equal(parseCodexResetRelease(data), null);
  }
});

test("assets alheios ou inválidos não escondem o par de instaladores válido", () => {
  const data = release();
  data.assets.unshift(null, {}, { name: "SHA256SUMS.txt" });
  assert.equal(parseCodexResetRelease(data)?.version, "0.1.18");
});
