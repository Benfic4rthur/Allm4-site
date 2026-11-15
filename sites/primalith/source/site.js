import {loadRelease, selectReleaseAssets, formatBytes, LATEST_RELEASE_URL} from './releases.js';

const $ = selector => document.querySelector(selector);
const localAsset = relativePath => new URL(relativePath, import.meta.url).href;
let storage = null;
try {storage = window.localStorage;} catch {}
$('#year').textContent = new Date().getFullYear();

// JavaScript enhances a complete static page. No content depends on animation.
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-ready');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible'); observer.unobserve(entry.target);
    }
  }, {threshold:.05, rootMargin:'0px 0px 25px 0px'});
  revealElements.forEach(element => observer.observe(element));
}

const menu = $('#main-nav'), menuToggle = $('#menu-toggle');
function closeMenu() {menu.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Abrir navegação');}
menuToggle.addEventListener('click', () => {
  const open = !menu.classList.contains('is-open');menu.classList.toggle('is-open',open);
  menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Fechar navegação':'Abrir navegação');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});

const biomes = {
  beach:{title:'Praia Serena do Sul',type:'ENSEADA DO SUL',description:'A sua primeira fogueira pode nascer aqui. Areia, água rasa e fauna costeira ajudam no começo, mas continue atento aos predadores.',condition:'Clima ameno · Dificuldade fácil',alt:'Praia Serena do Sul com enseada, areia e mar, capturada no jogo'},
  jungle:{title:'Selva Esmeralda',type:'TERRITÓRIO TROPICAL',description:'Vegetação densa, águas escondidas e criaturas que conhecem cada sombra. Entre preparado.',condition:'Calor e umidade · Dificuldade média',alt:'Selva Esmeralda com vegetação e terreno voxel, capturada no jogo'},
  glacier:{title:'Fronteira Glacial',type:'FRONTEIRA CONGELADA',description:'Florestas de coníferas e um rio congelado entre encostas cobertas de neve. Prepare-se para o frio.',condition:'Frio extremo · Dificuldade alta',alt:'Fronteira Glacial com coníferas, neve e rio congelado, capturada no jogo'},
  desert:{title:'Deserto da Pirâmide Preta',type:'TERRITÓRIO ÁRIDO',description:'Dunas, calor e ruínas antigas. Planeje a água que vai levar antes de seguir pelo deserto.',condition:'Calor intenso · Dificuldade alta',alt:'Dunas e areia do Deserto da Pirâmide Preta, capturadas no jogo'},
  volcano:{title:'Caldeira do Vulcão',type:'TERRA EM BRASA',description:'A paisagem muda. O chão aquece. Aproximar-se da caldeira exige proteção e uma rota de volta.',condition:'Calor extremo · Dificuldade alta',alt:'Caldeira e encostas do vulcão, capturadas no jogo'},
};
const tabs=[...document.querySelectorAll('[data-biome]')];
function selectBiome(tab,{focus=false}={}) {
  const id=tab.dataset.biome,biome=biomes[id];if(!biome)return;
  tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;});
  const image=$('#biome-image');image.src=localAsset(`./assets/biome-${id}.jpg?v=biomes6`);image.alt=biome.alt;
  $('#biome-panel').setAttribute('aria-labelledby',tab.id);
  $('#biome-type').textContent=biome.type;$('#biome-title').textContent=biome.title;
  $('#biome-description').textContent=biome.description;$('#biome-condition').textContent=biome.condition;
  if(focus)tab.focus();
}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectBiome(tab));
  tab.addEventListener('keydown',event=>{
    const offsets={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};let target;
    if(event.key in offsets)target=(index+offsets[event.key]+tabs.length)%tabs.length;
    else if(event.key==='Home')target=0;else if(event.key==='End')target=tabs.length-1;else return;
    event.preventDefault();selectBiome(tabs[target],{focus:true});
  });
});

const video=$('#island-video'), videoToggle=$('#video-toggle');
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
let userPaused=false,loadedVideo=false;
function updateVideoButton(playing) {
  videoToggle.setAttribute('aria-label',playing?'Pausar vídeo de fundo':'Reproduzir vídeo de fundo');
  videoToggle.setAttribute('aria-pressed',String(playing));
  videoToggle.querySelector('.video-toggle-icon').textContent=playing?'Ⅱ':'▶';
  videoToggle.querySelector('.video-toggle-label').textContent=playing?'Pausar paisagem':'Explorar em movimento';
  video.classList.toggle('is-playing',playing);
}
async function playVideo() {
  if(!loadedVideo){const source=video.querySelector('source');source.src=localAsset(source.dataset.src);video.load();loadedVideo=true;}
  video.muted=true;
  try {await video.play();updateVideoButton(true);} catch {updateVideoButton(false);}
}
function pauseVideo() {video.pause();updateVideoButton(false);}
videoToggle.addEventListener('click',()=>{if(video.paused){userPaused=false;void playVideo();}else{userPaused=true;pauseVideo();}});
video.addEventListener('error',()=>updateVideoButton(false));
if(!motion.matches&&!navigator.connection?.saveData) void playVideo();
motion.addEventListener?.('change',event=>{if(event.matches)pauseVideo();else if(!userPaused)void playVideo();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(!motion.matches&&!userPaused&&loadedVideo)void playVideo();});
if('IntersectionObserver' in window){new IntersectionObserver(entries=>{
  if(!entries[0].isIntersecting)video.pause();else if(!motion.matches&&!userPaused&&loadedVideo&&!document.hidden)void playVideo();
},{threshold:.05}).observe($('.hero'));}

const filmDialog=$('#island-film'),tourVideo=$('#island-tour-video');
$('#open-island-film').addEventListener('click',event=>{
  if(typeof filmDialog.showModal!=='function')return;
  event.preventDefault();
  const source=tourVideo.querySelector('source');if(!source.src){source.src=localAsset(source.dataset.src);tourVideo.load();}
  filmDialog.showModal();tourVideo.muted=true;void tourVideo.play().catch(()=>{});
});
function closeFilm(){tourVideo.pause();filmDialog.close();}
$('#close-island-film').addEventListener('click',closeFilm);
filmDialog.addEventListener('cancel',()=>tourVideo.pause());
filmDialog.addEventListener('close',()=>tourVideo.pause());
filmDialog.addEventListener('click',event=>{if(event.target===filmDialog){const rect=filmDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeFilm();}});

const result=await loadRelease({storage});
const {release,source}=result;
if(release){
  const {mac,windows}=selectReleaseAssets(release);
  $('#release-version').textContent=release.tag_name;
  $('#release-status').textContent=source==='live'?'VERSÃO OFICIAL DISPONÍVEL':'VERSÃO CONSULTADA';
  if(mac){
    const link=$('#mac-download-link');link.href=mac.browser_download_url;link.firstChild.textContent='Baixar para Mac ';
    const desktop=/^v?1\.(?:[3-9]|\d{2,})\./.test(release.tag_name)||/^v?[2-9]\./.test(release.tag_name);
    $('#mac-description').textContent=`${desktop?'Universal · Intel e Apple Silicon · macOS 13+':'Pacote para macOS'}${formatBytes(mac.size)?' · '+formatBytes(mac.size):''}`;
  }else{$('#mac-description').textContent='Consulte os pacotes da versão oficial.';$('#mac-download-link').href=LATEST_RELEASE_URL;}
  if(windows){
    $('#download-windows').hidden=false;$('#download-windows').classList.remove('platform-pending');$('#windows-pending').hidden=true;
    $('#windows-download-link').href=windows.browser_download_url;$('#windows-description').textContent=`Instalador · Windows x64${formatBytes(windows.size)?' · '+formatBytes(windows.size):''}`;
  }
  const published=new Date(release.published_at);
  const date=Number.isNaN(published.valueOf())?'':new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'long',year:'numeric'}).format(published);
  $('#release-detail').textContent=source==='live'?`Conferido agora no GitHub${date?'. Publicado em '+date:'.'}`:'Não foi possível consultar o GitHub agora. Exibindo a última versão verificada; veja a página oficial para confirmar novidades.';
}else{
  $('#release-status').textContent='DOWNLOAD OFICIAL';$('#release-version').textContent='PRIMALITH';
  $('#release-detail').innerHTML='A consulta está indisponível no momento. <a href="https://github.com/Benfic4rthur/Primalith-Releases/releases/latest" target="_blank" rel="noopener noreferrer">Abra os arquivos oficiais no GitHub.</a>';
}
