import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import postcss from "postcss";
import { parseTubeOrderRelease, fetchTubeOrderRelease, tubeOrderLinks, tubeOrderPackageSize } from "../lib/tubeorder.ts";

function release(version="1.4.4",filename=`tubeorder-${version}.zip`,size=52332){
  return {draft:false,prerelease:false,tag_name:`v${version}`,assets:[{name:filename,state:"uploaded",size,browser_download_url:`https://github.com/Benfic4rthur/TubeOrder/releases/download/v${version}/${filename}`}]};
}
test("versão, tamanho e ZIP são retirados da mesma release",()=>{
  for(const [index,version] of ["1.4.4","1.4.5","2.0.0","2.0.0.1"].entries()){
    const size=52332+index*1000;
    const parsed=parseTubeOrderRelease(release(version,`tubeorder-${version}.zip`,size));
    assert.equal(parsed.version,version);assert.equal(parsed.size,size);
    assert.equal(parsed.filename,`tubeorder-${version}.zip`);
    assert.equal(parsed.download,`https://github.com/Benfic4rthur/TubeOrder/releases/download/v${version}/tubeorder-${version}.zip`);
  }
});
test("prefere o pacote versionado e aceita o nome estável na mesma release",()=>{
  const data=release("1.4.5");data.assets.unshift(...release("1.4.5","tubeorder.zip").assets);
  assert.equal(parseTubeOrderRelease(data).filename,"tubeorder-1.4.5.zip");
  assert.equal(parseTubeOrderRelease(release("1.4.5","tubeorder.zip")).version,"1.4.5");
});
test("recusa rascunhos, pré-releases e arquivos de outra tag, sem voltar ao ZIP antigo",()=>{
  for(const data of [{...release(),draft:true},{...release(),prerelease:true},{...release(),assets:release("1.4.3").assets},{...release(),assets:[]},null,{},"erro"]){assert.equal(parseTubeOrderRelease(data),null);}
});
test("só permite assets completos do repositório público real do TubeOrder",()=>{
  for(const patch of [{size:0},{size:NaN},{size:1.2},{state:"new"},{browser_download_url:"https://example.com/tubeorder.zip"},{browser_download_url:"https://github.com/Benfic4rthur/CanalNonGrato/releases/download/v1.4.4/tubeorder-1.4.4.zip"},{browser_download_url:release().assets[0].browser_download_url+"?redirect=other"}]){
    const data=release();Object.assign(data.assets[0],patch);assert.equal(parseTubeOrderRelease(data),null);
  }
});
test("uma nova consulta troca a release inteira sem republicar o site",async()=>{
  let current=release();
  const fetcher=async(url,options)=>{assert.equal(url,tubeOrderLinks.releaseApi);assert.equal(options.cache,"no-store");assert.equal(options.credentials,"omit");return Response.json(current);};
  assert.equal((await fetchTubeOrderRelease(fetcher)).version,"1.4.4");
  current=release("1.4.5","tubeorder-1.4.5.zip",61234);
  assert.deepEqual(await fetchTubeOrderRelease(fetcher),{version:"1.4.5",filename:"tubeorder-1.4.5.zip",size:61234,download:current.assets[0].browser_download_url});
});
test("falhas de rede, cota ou JSON devolvem null para o link da última release",async()=>{
  for(const fetcher of [async()=>new Response(null,{status:403}),async()=>{throw new Error("offline")},async()=>new Response("inválido",{status:200})])assert.equal(await fetchTubeOrderRelease(fetcher),null);
  assert.equal(tubeOrderLinks.releases,"https://github.com/Benfic4rthur/TubeOrder/releases/latest");
  assert.deepEqual(tubeOrderPackageSize(52332),{value:"52,3",unit:"KB"});
});
test("os estilos da página ficam limitados ao TubeOrder",()=>{
  const css=postcss.parse(readFileSync(new URL("../app/tubeorder/tubeorder.css",import.meta.url),"utf8"));
  css.walkRules(rule=>{
    if(rule.parent?.type==="atrule"&&/keyframes$/.test(rule.parent.name))return;
    for(const selector of rule.selectors)assert.ok(selector.startsWith(".tubeorder-site")||selector.startsWith("html:has(.tubeorder-site)"),`Seletor global: ${selector}`);
  });
});
