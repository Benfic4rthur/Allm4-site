import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { products } from "../lib/products.ts";
import { extensions } from "../lib/extensions.ts";
import { bundledRelease, parseGelaMacRelease, fetchGelaMacRelease } from "../sites/gelamac/lib/release-config.ts";

const release = (version = "1.4.0") => ({ draft: false, prerelease: false, tag_name: `v${version}`, assets: [{ name: "GelaMac-macOS-arm64.zip" }] });
test("GelaMac acompanha a última versão sem alterar o endereço estável do pacote", async () => {
  let current = release();
  const fetcher = async (url, options) => {
    assert.equal(url, "https://api.github.com/repos/Benfic4rthur/GelaMac/releases/latest");
    assert.equal(options.credentials, "omit");
    assert.equal(options.cache, "no-store");
    return Response.json(current);
  };
  assert.equal((await fetchGelaMacRelease(fetcher)).version, "1.4.0");
  current = release("1.5.0");
  const next = await fetchGelaMacRelease(fetcher);
  assert.equal(next.version, "1.5.0");
  assert.equal(next.url, "https://github.com/Benfic4rthur/GelaMac/releases/latest/download/GelaMac-macOS-arm64.zip");
  assert.equal(next.page, "https://github.com/Benfic4rthur/GelaMac/releases/tag/v1.5.0");
});
test("rascunhos, pré-releases, versões e pacotes incompatíveis não substituem a prévia", () => {
  for (const data of [null, {}, { ...release(), draft: true }, { ...release(), prerelease: true }, { ...release(), tag_name: "latest" }, { ...release(), assets: [{ name: "Intel.zip" }] }, { ...release(), assets: null }]) assert.equal(parseGelaMacRelease(data), null);
});
test("falhas da API preservam o fallback local sob /gelamac/", async () => {
  for (const fetcher of [async () => new Response(null, { status: 403 }), async () => new Response("invalid"), async () => { throw new Error("offline"); }]) assert.deepEqual(await fetchGelaMacRelease(fetcher), bundledRelease);
  assert.equal(bundledRelease.url, "/gelamac/downloads/GelaMac-macOS-arm64.zip");
});
test("GelaMac é um aplicativo após Codex Reset, com compatibilidade real e rota interna", () => {
  assert.equal(products.at(-2).slug, "codex-reset");
  const app = products.at(-1);
  assert.equal(app.slug, "gelamac");
  assert.equal(app.url, "/gelamac/");
  assert.ok(app.platforms.includes("Com ventoinhas"));
  assert.ok(!app.platforms.includes("Intel"));
  assert.ok(!extensions.some(e => e.slug === "gelamac"));
});
test("a órbita e o rodapé continuam derivados do catálogo, sem posição fixa para GelaMac", () => {
  const orbit = readFileSync(new URL("../components/brand/brand-orbit.tsx", import.meta.url), "utf8");
  assert.ok(orbit.includes("360 / orbitProducts.length"));
  assert.ok(orbit.includes("[...products, ...extensions]"));
});
