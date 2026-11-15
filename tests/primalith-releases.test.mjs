import test from 'node:test';
import assert from 'node:assert/strict';
import {selectReleaseAssets,validRelease,loadRelease,formatBytes,RELEASE_API_URL} from '../sites/primalith/source/releases.js';
const asset=(name,version='1.2.28')=>({name,browser_download_url:`https://github.com/Benfic4rthur/Primalith-Releases/releases/download/v${version}/${name}`,size:80_000_000});
const release=(assets)=>({tag_name:'v1.2.28',published_at:'2026-11-15T20:52:05Z',assets,draft:false,prerelease:false});
test('real v28-style release offers Mac ZIP and excludes all updater payloads',()=>{
 const mac=asset('Primalith-macOS.zip');
 const selected=selectReleaseAssets(release([asset('arkcraft-web-update.zip'),asset('primalith-web-update.zip'),asset('primalith-desktop-update.zip'),mac]));
 assert.equal(selected.mac,mac);assert.equal(selected.windows,null);
});
test('desktop release offers actual Windows installer and prefers Mac DMG over ZIP',()=>{
 const dmg=asset('Primalith-1.3.0-mac-universal.dmg','1.3.0'),win=asset('Primalith-1.3.0-win-x64.exe','1.3.0');
 const selected=selectReleaseAssets(release([asset('Primalith-1.3.0-mac-universal.zip','1.3.0'),win,dmg]));
 assert.equal(selected.mac,dmg);assert.equal(selected.windows,win);
});
test('ignores external, disguised and credential-bearing download URLs',()=>{
 const malicious=[{...asset('Primalith-macOS.dmg'),browser_download_url:'https://github.com.evil.test/Benfic4rthur/Primalith-Releases/releases/download/v1/a.dmg'},
 {...asset('Primalith-win-x64.exe'),browser_download_url:'javascript:alert(1)'},
 {...asset('Primalith-win-x64.exe'),browser_download_url:'https://other:secret@github.com/Benfic4rthur/Primalith-Releases/releases/download/v1/a.exe'},
 {...asset('Primalith-win-x64.exe'),browser_download_url:'https://github.com/Benfic4rthur/Primalith-Releases/releases/download/v1/a.exe?redirect=evil'},
 asset('Primalith-desktop-update-mac.zip')];
 assert.deepEqual(selectReleaseAssets(release(malicious)),{mac:null,windows:null});
});
test('rejects draft, prerelease and malformed API payloads',()=>{
 assert.equal(validRelease(release([])),true);assert.equal(validRelease({...release([]),draft:true}),false);
 assert.equal(validRelease({...release([]),prerelease:true}),false);assert.equal(validRelease({tag_name:'<img onerror=alert(1)>',assets:[]}),false);assert.equal(validRelease({tag_name:'v1.2.28'}),false);
});
test('uses live release and caches verified data despite denied local storage',async()=>{
 const current=release([asset('Primalith-macOS.zip')]);let calls=0;
 const result=await loadRelease({storage:{setItem(){throw Error('denied')}},fetcher:async url=>{calls++;assert.equal(url,RELEASE_API_URL);return{ok:true,json:async()=>current}}});
 assert.equal(result.source,'live');assert.equal(result.release,current);assert.equal(calls,1);
});
test('GitHub outage uses verified cache and clearly distinguishes its source',async()=>{
 const cached={release:release([asset('Primalith-macOS.zip')]),checkedAt:'2026-11-15T20:52:05Z'};
 const result=await loadRelease({fetcher:async()=>{throw Error('offline')},storage:{getItem:()=>JSON.stringify(cached)}});
 assert.equal(result.source,'cache');assert.equal(result.release.tag_name,'v1.2.28');
});
test('rate limited API plus corrupt cache falls back to shipped verified snapshot',async()=>{
 const current=release([asset('Primalith-macOS.zip')]);const result=await loadRelease({storage:{getItem:()=>'{bad json'},fetcher:async url=>url===RELEASE_API_URL?{ok:false,status:403}:{ok:true,json:async()=>({release:current,checkedAt:'2026-11-15'})}});
 assert.equal(result.source,'snapshot');assert.equal(result.release,current);
});
test('unavailable API/cache/snapshot yields official-page fallback without fabricated platform',async()=>{
 const result=await loadRelease({fetcher:async()=>{throw Error('offline')},storage:{getItem(){throw Error('denied')}}});
 assert.equal(result.source,'unavailable');assert.equal(result.release,null);assert.deepEqual(selectReleaseAssets(result.release),{mac:null,windows:null});
});
test('hung API is aborted and does not leave version status loading indefinitely',async()=>{
 const result=await loadRelease({timeoutMs:10,fetcher:async(url,{signal}={})=>{
  if(url!==RELEASE_API_URL)throw Error('No snapshot');return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('timeout')),{once:true}));
 }});assert.equal(result.source,'unavailable');
});
test('formats package sizes without advertising unknown values',()=>{assert.equal(formatBytes(90_000_000),'90 MB');assert.equal(formatBytes(1_500_000_000),'1,5 GB');assert.equal(formatBytes(undefined),'');});
test('hung snapshot also times out instead of leaving the site stuck',async()=>{
 const result=await loadRelease({timeoutMs:10,fetcher:async(url,{signal}={})=>{
  if(url===RELEASE_API_URL)throw Error('offline');return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('snapshot timeout')),{once:true}));
 }});assert.equal(result.source,'unavailable');
});

const snapshotOf=(version,checkedAt,windows=false)=>({
 checkedAt,
 release:{...release([asset(`Primalith-${version}-mac-universal.dmg`,version),...(windows?[asset(`Primalith-${version}-win-x64.exe`,version)]:[])]),tag_name:'v'+version},
});
const offlineWithSnapshot=snapshot=>async url=>url===RELEASE_API_URL?{ok:false,status:403}:{ok:true,json:async()=>snapshot};

test('rate-limited GitHub with cached v28 chooses shipped v1.3 Mac+Windows and refreshes cache',async()=>{
 const older=snapshotOf('1.2.28','2026-11-16T00:00:00Z');
 const deployed=snapshotOf('1.3.0','2026-11-15T23:00:00Z',true);
 let stored=JSON.stringify(older);
 const result=await loadRelease({fetcher:offlineWithSnapshot(deployed),storage:{getItem:()=>stored,setItem:(_key,value)=>{stored=value;}}});
 assert.equal(result.source,'snapshot');assert.equal(result.release.tag_name,'v1.3.0');
 assert.match(selectReleaseAssets(result.release).mac.browser_download_url,/v1\.3\.0/);
 assert.match(selectReleaseAssets(result.release).windows.browser_download_url,/v1\.3\.0/);
 assert.equal(JSON.parse(stored).release.tag_name,'v1.3.0');
});

test('a newer cached stable release is preserved despite a more recently checked older snapshot',async()=>{
 for(const [newer,older]of [['1.3.1','1.3.0'],['1.10.0','1.9.0'],['2.0.0','1.99.99']]){
  const cache=snapshotOf(newer,'2026-01-01T00:00:00Z',true),snapshot=snapshotOf(older,'2026-12-01T00:00:00Z');
  const result=await loadRelease({fetcher:offlineWithSnapshot(snapshot),storage:{getItem:()=>JSON.stringify(cache)}});
  assert.equal(result.source,'cache');assert.equal(result.release.tag_name,'v'+newer);
  assert.ok(selectReleaseAssets(result.release).windows);
 }
});

test('same stable version uses newer check date, including newly attached Windows installer',async()=>{
 const cache=snapshotOf('1.3.0','2026-11-15T22:00:00Z'),snapshot=snapshotOf('1.3.0','2026-11-15T23:00:00Z',true);
 const result=await loadRelease({fetcher:offlineWithSnapshot(snapshot),storage:{getItem:()=>JSON.stringify(cache)}});
 assert.equal(result.source,'snapshot');assert.ok(selectReleaseAssets(result.release).windows);
 const reversed=await loadRelease({fetcher:offlineWithSnapshot(cache),storage:{getItem:()=>JSON.stringify(snapshot)}});
 assert.equal(reversed.source,'cache');assert.ok(selectReleaseAssets(reversed.release).windows);
});

test('equal version/date prefers the deployment snapshot and handles absent check dates',async()=>{
 const cache=snapshotOf('1.3.0','2026-11-15T23:00:00Z'),snapshot=snapshotOf('1.3.0','2026-11-15T23:00:00Z',true);
 const result=await loadRelease({fetcher:offlineWithSnapshot(snapshot),storage:{getItem:()=>JSON.stringify(cache)}});
 assert.equal(result.source,'snapshot');assert.ok(selectReleaseAssets(result.release).windows);
 delete cache.checkedAt;
 const missingDate=await loadRelease({fetcher:offlineWithSnapshot(snapshot),storage:{getItem:()=>JSON.stringify(cache)}});
 assert.equal(missingDate.source,'snapshot');
});

test('cached fallback still resolves when the deployed snapshot times out',async()=>{
 const cache=snapshotOf('1.3.1','2026-11-15T23:00:00Z',true);
 const result=await loadRelease({timeoutMs:10,storage:{getItem:()=>JSON.stringify(cache)},fetcher:async(url,{signal}={})=>{
  if(url===RELEASE_API_URL)throw Error('offline');
  return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('snapshot timeout')),{once:true}));
 }});
 assert.equal(result.source,'cache');assert.equal(result.release.tag_name,'v1.3.1');
});

test('prerelease tags do not supersede a stable deployment even with an incorrect GitHub flag',async()=>{
 const prerelease=snapshotOf('9.0.0-rc.1','2026-12-01T00:00:00Z',true),snapshot=snapshotOf('1.3.0','2026-11-15T23:00:00Z',true);
 assert.equal(validRelease(prerelease.release),false);
 const result=await loadRelease({fetcher:offlineWithSnapshot(snapshot),storage:{getItem:()=>JSON.stringify(prerelease)}});
 assert.equal(result.source,'snapshot');assert.equal(result.release.tag_name,'v1.3.0');
});
