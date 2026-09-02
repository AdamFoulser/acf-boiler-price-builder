(function(){
  const items = Array.isArray(window.WILLIAMS_CATALOGUE_ITEMS) ? window.WILLIAMS_CATALOGUE_ITEMS : [];
  const $ = id => document.getElementById(id);
  const gbp = n => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(Number(n||0));
  const basket=[];
  const section=$('generalSection'), item=$('generalItem'), qty=$('generalQty'), add=$('generalAddItem'), search=$('generalSearch');
  if(!section||!item||!qty||!add) return;
  const sections=[...new Set(items.map(x=>x.section).filter(Boolean))].sort();
  section.innerHTML='<option value="">Select catalogue section</option>'+sections.map(x=>'<option></option>').join('');
  [...section.options].slice(1).forEach((o,i)=>{o.value=sections[i];o.textContent=sections[i]});
  const status=document.querySelector('#page-general .using-label'); if(status) status.textContent='Williams Issue 179 • '+items.length+' priced items';
  const help=document.querySelector('#page-general .supplier-help'); if(help) help.textContent='Build a materials list from Williams Pricebusters Issue 179 (September 2026). Catalogue prices are ex VAT.';
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function candidates(){
    const sec=section.value, term=(search?.value||'').trim().toLowerCase();
    let rows=items.filter(x=>!sec||x.section===sec);
    if(term) rows=rows.filter(x=>(x.code+' '+x.description).toLowerCase().includes(term));
    return rows.slice(0,500);
  }
  function fillItems(){
    const rows=candidates(); item.disabled=!rows.length; add.disabled=!rows.length;
    item.innerHTML=rows.length?'<option value="">Select item</option>':'<option value="">No matching items</option>';
    rows.forEach(x=>{const o=document.createElement('option');o.value=items.indexOf(x);o.textContent=`${x.code} — ${x.description} — ${gbp(x.price)} ex VAT`;item.appendChild(o)});
  }
  section.addEventListener('change',fillItems); search?.addEventListener('input',fillItems);
  add.addEventListener('click',()=>{const idx=Number(item.value);if(!Number.isInteger(idx)||!items[idx])return;const n=Math.max(1,parseInt(qty.value||'1',10)||1);const x=items[idx];const existing=basket.find(r=>r.code===x.code&&r.price===x.price);if(existing)existing.qty+=n;else basket.push({...x,qty:n});render();});
  function render(){
    const box=$('generalItems');
    if(!basket.length) box.innerHTML='<div class="meta">No items added yet.</div>';
    else box.innerHTML=basket.map((x,i)=>`<div style="padding:10px 0;border-bottom:1px solid #e1e7ec"><strong>${esc(x.description)}</strong><div class="meta">${esc(x.code)} • Williams p.${x.page} • ${gbp(x.price)} each ex VAT</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px"><span>Qty ${x.qty} — <strong>${gbp(x.price*x.qty)}</strong></span><button type="button" class="small-action" data-wremove="${i}">Remove</button></div></div>`).join('');
    const ex=basket.reduce((s,x)=>s+x.price*x.qty,0), vat=ex*.2, inc=ex+vat;
    $('generalExVat').textContent=gbp(ex); $('generalVat').textContent=gbp(vat); $('generalIncVat').textContent=gbp(inc);
    localStorage.setItem('acf_general_job_v143',JSON.stringify({address:$('generalAddress')?.value||'',description:$('generalDescription')?.value||'',basket}));
  }
  $('generalItems').addEventListener('click',e=>{const b=e.target.closest('[data-wremove]');if(!b)return;basket.splice(Number(b.dataset.wremove),1);render()});
  $('generalClear')?.addEventListener('click',()=>{if(!basket.length||confirm('Clear all materials from this job?')){basket.length=0;render()}});
  $('generalCopy')?.addEventListener('click',async()=>{const address=$('generalAddress')?.value.trim()||'No address',desc=$('generalDescription')?.value.trim()||'General job';const ex=basket.reduce((s,x)=>s+x.price*x.qty,0);const lines=[address,desc,'',...basket.map(x=>`${x.qty} x ${x.description} (${x.code}) @ ${gbp(x.price)} = ${gbp(x.qty*x.price)}`),'',`Materials ex VAT: ${gbp(ex)}`,`VAT: ${gbp(ex*.2)}`,`Materials inc VAT: ${gbp(ex*1.2)}`];const t=lines.join('\n');try{await navigator.clipboard.writeText(t);$('generalCopy').textContent='Copied ✓';setTimeout(()=>$('generalCopy').textContent='Copy job',1400)}catch(_){prompt('Copy job:',t)}});
  try{const saved=JSON.parse(localStorage.getItem('acf_general_job_v143')||'null');if(saved){if($('generalAddress'))$('generalAddress').value=saved.address||'';if($('generalDescription'))$('generalDescription').value=saved.description||'';(saved.basket||[]).forEach(x=>basket.push(x));render()}}catch(_){ }
  fillItems(); render();
})();
