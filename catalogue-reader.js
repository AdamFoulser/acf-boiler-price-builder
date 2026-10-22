(()=>{
 const TOTAL=218, FILE='williams-pricebusters-179.pdf';
 const $=id=>document.getElementById(id);
 let doc=null, page=1, scale=1, busy=false, pending=null, loading=null;
 const status=t=>{if($('acfBookMessage'))$('acfBookMessage').textContent=t};
 const pageInput=$('acfBookPage');
 const clamp=n=>Math.max(1,Math.min(TOTAL,Math.round(Number(n)||1)));
 function loadScript(url){return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=url;el.onload=resolve;el.onerror=reject;document.head.appendChild(el)})}
 async function ensureDoc(){
  if(doc)return doc;
  if(loading)return loading;
  loading=(async()=>{
   status('Loading Williams catalogue…');
   if(!window.pdfjsLib)await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
   window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
   doc=await window.pdfjsLib.getDocument({url:FILE,withCredentials:true}).promise;
   $('acfBookPlaceholder').style.display='none';$('acfBookCanvas').style.display='block';
   return doc;
  })().catch(e=>{loading=null;status('Could not load the in-app reader. Use “Open full PDF” below.');throw e});
  return loading;
 }
 async function render(){
  if(busy){pending=page;return}
  busy=true;
  try{
   const pdf=await ensureDoc();const pg=await pdf.getPage(page);
   const canvas=$('acfBookCanvas');const ctx=canvas.getContext('2d');
   const base=pg.getViewport({scale:1});
   const width=Math.max(280,$('acfBookSurface').clientWidth-6);
   const target=Math.min(2.2,width/base.width*scale);
   const vp=pg.getViewport({scale:target});
   const pixelRatio=Math.min(window.devicePixelRatio||1,2);
   canvas.width=Math.round(vp.width*pixelRatio);canvas.height=Math.round(vp.height*pixelRatio);
   canvas.style.width=Math.round(vp.width)+'px';canvas.style.maxWidth='none';
   canvas.style.height=Math.round(vp.height)+'px';
   await pg.render({canvasContext:ctx,viewport:pg.getViewport({scale:target*pixelRatio})}).promise;
   pageInput.value=page;status('Page '+page+' of '+TOTAL);
  }catch(e){status('Reader unavailable. Tap “Open full PDF” to view the catalogue.');console.error('Catalogue viewer:',e)}
  finally{busy=false;if(pending!==null){const next=pending;pending=null;page=next;render()}}
 }
 function go(n){page=clamp(n);pageInput.value=page;render()}
 $('acfBookLoad')?.addEventListener('click',()=>render());
 $('acfBookPrev')?.addEventListener('click',()=>go(page-1));
 $('acfBookNext')?.addEventListener('click',()=>go(page+1));
 pageInput?.addEventListener('change',()=>go(pageInput.value));
 $('acfBookZoomIn')?.addEventListener('click',()=>{scale=Math.min(2.5,scale+0.25);render()});
 $('acfBookZoomOut')?.addEventListener('click',()=>{scale=Math.max(0.75,scale-0.25);render()});
 document.querySelectorAll('[data-catalog-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.catalogPage)));
 let startX=null,startY=null;
 const surf=$('acfBookSurface');
 surf?.addEventListener('touchstart',e=>{if(e.touches.length===1){startX=e.touches[0].clientX;startY=e.touches[0].clientY}},{passive:true});
 surf?.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;startX=null;startY=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)go(page+(dx<0?1:-1))},{passive:true});
 document.addEventListener('click',e=>{if(e.target.closest('[data-open-page="catalogue"]')&&!doc&&!loading)render()});
})();