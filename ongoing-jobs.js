(function(){
  const KEY='acf_ongoing_jobs_v144';
  const catalogue=Array.isArray(window.WILLIAMS_CATALOGUE_ITEMS)?window.WILLIAMS_CATALOGUE_ITEMS:[];
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const gbp=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(Number(n||0));
  const today=()=>new Date().toISOString().slice(0,10);
  let jobs=load(), activeId=null, visitMaterials=[];
  function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
  function save(){localStorage.setItem(KEY,JSON.stringify(jobs))}
  function job(){return jobs.find(x=>x.id===activeId)||null}
  function fmtDate(s){if(!s)return'';const d=new Date(s+'T12:00:00');return Number.isNaN(d.getTime())?s:d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
  function statusClass(s){return 'oj-status '+String(s||'ongoing').toLowerCase().replace(/[^a-z]+/g,'-')}
  function renderList(){
    const box=$('ojJobList'); if(!box)return;
    const filter=$('ojFilter')?.value||'active';
    const rows=jobs.filter(j=>filter==='all'||(filter==='complete'?j.status==='Complete':j.status!=='Complete'));
    if(!rows.length){box.innerHTML='<div class="meta">No '+(filter==='complete'?'completed':'ongoing')+' jobs yet.</div>';return}
    rows.sort((a,b)=>(b.updated||b.created||'').localeCompare(a.updated||a.created||''));
    box.innerHTML=rows.map(j=>{
      const visits=j.visits||[], mat=visits.flatMap(v=>v.materials||[]).reduce((n,m)=>n+Number(m.price||0)*Number(m.qty||0),0);
      const hours=visits.reduce((n,v)=>n+(v.labourUnit==='hours'?Number(v.labour||0):0),0);
      const days=visits.reduce((n,v)=>n+(v.labourUnit==='days'?Number(v.labour||0):0),0);
      return `<button type="button" class="oj-job-card ${activeId===j.id?'selected':''}" data-oj-open="${j.id}"><span><strong>${esc(j.address||'Untitled job')}</strong><small>${esc(j.description||'No description')}</small></span><span class="${statusClass(j.status)}">${esc(j.status||'Ongoing')}</span><span class="oj-job-meta">${visits.length} visit${visits.length===1?'':'s'} · ${hours?hours+'h ':''}${days?days+'d ':''}· ${gbp(mat)} materials</span></button>`;
    }).join('');
  }
  function renderJob(){
    const j=job(), empty=$('ojNoJob'), panel=$('ojJobPanel'); if(!empty||!panel)return;
    if(!j){empty.hidden=false;panel.hidden=true;return}
    empty.hidden=true; panel.hidden=false;
    $('ojEditAddress').value=j.address||''; $('ojEditDescription').value=j.description||''; $('ojStatus').value=j.status||'Ongoing';
    const visits=j.visits||[];
    const matTotal=visits.flatMap(v=>v.materials||[]).reduce((n,m)=>n+Number(m.price||0)*Number(m.qty||0),0);
    const hours=visits.reduce((n,v)=>n+(v.labourUnit==='hours'?Number(v.labour||0):0),0);
    const days=visits.reduce((n,v)=>n+(v.labourUnit==='days'?Number(v.labour||0):0),0);
    $('ojSummary').innerHTML=`<div><span>Visits</span><strong>${visits.length}</strong></div><div><span>Labour</span><strong>${hours?hours+' hours':''}${hours&&days?' + ':''}${days?days+' days':''}${!hours&&!days?'0 hours':''}</strong></div><div><span>Materials ex VAT</span><strong>${gbp(matTotal)}</strong></div><div><span>Materials inc VAT</span><strong>${gbp(matTotal*1.2)}</strong></div>`;
    const vb=$('ojVisits');
    if(!visits.length) vb.innerHTML='<div class="meta">No visits recorded yet.</div>';
    else vb.innerHTML=[...visits].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(v=>{
      const mats=v.materials||[], mt=mats.reduce((n,m)=>n+Number(m.price||0)*Number(m.qty||0),0);
      return `<div class="oj-visit"><div class="oj-visit-head"><strong>${esc(fmtDate(v.date))}</strong><button type="button" class="small-action" data-oj-delvisit="${v.id}">Delete</button></div><div class="meta">Labour: ${esc(v.labour||0)} ${esc(v.labourUnit||'hours')}</div>${v.notes?`<p>${esc(v.notes)}</p>`:''}${mats.length?`<div class="oj-material-lines">${mats.map(m=>`<div><span>${esc(m.description)}${m.code?' <small>('+esc(m.code)+')</small>':''} × ${m.qty}</span><strong>${gbp(Number(m.price)*Number(m.qty))}</strong></div>`).join('')}</div><div class="oj-visit-total">Materials ex VAT <strong>${gbp(mt)}</strong></div>`:'<div class="meta">No materials recorded.</div>'}</div>`;
    }).join('');
  }
  function refresh(){renderList();renderJob()}
  function resetVisit(){visitMaterials=[];$('ojVisitDate').value=today();$('ojLabour').value='';$('ojLabourUnit').value='hours';$('ojVisitNotes').value='';$('ojCustomDesc').value='';$('ojCustomPrice').value='';$('ojCustomQty').value='1';$('ojWilliamsQty').value='1';renderVisitMaterials()}
  function renderVisitMaterials(){
    const box=$('ojVisitMaterials'); if(!box)return;
    if(!visitMaterials.length){box.innerHTML='<div class="meta">No materials added to this visit yet.</div>';return}
    box.innerHTML=visitMaterials.map((m,i)=>`<div class="oj-material-row"><span><strong>${esc(m.description)}</strong><small>${m.code?esc(m.code)+' · ':''}${gbp(m.price)} each · Qty ${m.qty}</small></span><strong>${gbp(Number(m.price)*Number(m.qty))}</strong><button type="button" class="small-action" data-oj-rmmat="${i}">Remove</button></div>`).join('');
  }
  function setupCatalogue(){
    const sec=$('ojWilliamsSection'), item=$('ojWilliamsItem'), search=$('ojWilliamsSearch'); if(!sec||!item)return;
    const sections=[...new Set(catalogue.map(x=>x.section).filter(Boolean))].sort();
    sec.innerHTML='<option value="">All Williams sections</option>'+sections.map(s=>`<option>${esc(s)}</option>`).join('');
    function fill(){const term=(search.value||'').trim().toLowerCase(), sv=sec.value;let rows=catalogue.filter(x=>(!sv||x.section===sv)&&(!term||(x.code+' '+x.description).toLowerCase().includes(term))).slice(0,500);item.innerHTML=rows.length?'<option value="">Select Williams item</option>':'<option value="">No matches</option>';rows.forEach(x=>{const o=document.createElement('option');o.value=catalogue.indexOf(x);o.textContent=`${x.code} — ${x.description} — ${gbp(x.price)} ex VAT`;item.appendChild(o)});item.disabled=!rows.length;$('ojAddWilliams').disabled=!rows.length}
    sec.addEventListener('change',fill);search.addEventListener('input',fill);fill();
  }
  $('ojCreate')?.addEventListener('click',()=>{const address=$('ojNewAddress').value.trim(),desc=$('ojNewDescription').value.trim();if(!address){$('ojNewStatus').textContent='Enter the property address first.';return}const j={id:String(Date.now()),address,description:desc,status:'Ongoing',created:new Date().toISOString(),updated:new Date().toISOString(),visits:[]};jobs.unshift(j);activeId=j.id;save();$('ojNewAddress').value='';$('ojNewDescription').value='';$('ojNewStatus').textContent='Ongoing job created.';resetVisit();refresh();});
  $('ojSaveJob')?.addEventListener('click',()=>{const j=job();if(!j)return;j.address=$('ojEditAddress').value.trim();j.description=$('ojEditDescription').value.trim();j.status=$('ojStatus').value;j.updated=new Date().toISOString();save();refresh();});
  $('ojDeleteJob')?.addEventListener('click',()=>{const j=job();if(!j||!confirm('Delete this ongoing job and all visit history?'))return;jobs=jobs.filter(x=>x.id!==j.id);activeId=null;save();refresh();});
  $('ojFilter')?.addEventListener('change',renderList);
  $('ojAddWilliams')?.addEventListener('click',()=>{const idx=Number($('ojWilliamsItem').value),x=catalogue[idx];if(!x)return;const qty=Math.max(1,Number($('ojWilliamsQty').value)||1);visitMaterials.push({source:'Williams',code:x.code,description:x.description,price:Number(x.price)||0,qty,page:x.page});renderVisitMaterials();});
  $('ojAddCustom')?.addEventListener('click',()=>{const d=$('ojCustomDesc').value.trim(),p=Number($('ojCustomPrice').value),q=Math.max(1,Number($('ojCustomQty').value)||1);if(!d||!Number.isFinite(p)||p<0){$('ojVisitSaveStatus').textContent='Enter the other material description and ex-VAT cost.';return}visitMaterials.push({source:'Other',code:'',description:d,price:p,qty:q});$('ojCustomDesc').value='';$('ojCustomPrice').value='';$('ojCustomQty').value='1';renderVisitMaterials();});
  $('ojSaveVisit')?.addEventListener('click',()=>{const j=job();if(!j)return;const date=$('ojVisitDate').value;if(!date){$('ojVisitSaveStatus').textContent='Choose the visit date.';return}const labour=Math.max(0,Number($('ojLabour').value)||0);j.visits=j.visits||[];j.visits.push({id:String(Date.now()),date,labour,labourUnit:$('ojLabourUnit').value,notes:$('ojVisitNotes').value.trim(),materials:visitMaterials.map(x=>({...x}))});j.updated=new Date().toISOString();save();$('ojVisitSaveStatus').textContent='Visit saved.';resetVisit();refresh();});
  $('ojCopyJob')?.addEventListener('click',async()=>{const j=job();if(!j)return;const visits=[...(j.visits||[])].sort((a,b)=>(a.date||'').localeCompare(b.date||''));let text=`${j.address}\n${j.description||''}\nStatus: ${j.status}\n`;visits.forEach(v=>{text+=`\n${fmtDate(v.date)} — Labour: ${v.labour||0} ${v.labourUnit||'hours'}`+(v.notes?`\n${v.notes}`:'')+'\n';(v.materials||[]).forEach(m=>text+=`• ${m.description}${m.code?' ('+m.code+')':''} × ${m.qty} — ${gbp(Number(m.price)*Number(m.qty))} ex VAT\n`)});const mt=visits.flatMap(v=>v.materials||[]).reduce((n,m)=>n+Number(m.price||0)*Number(m.qty||0),0);text+=`\nMaterials total: ${gbp(mt)} ex VAT / ${gbp(mt*1.2)} inc VAT`;try{await navigator.clipboard.writeText(text);$('ojCopyJob').textContent='Copied ✓';setTimeout(()=>$('ojCopyJob').textContent='Copy job history',1400)}catch(e){prompt('Copy job history:',text)}});
  document.addEventListener('click',e=>{const open=e.target.closest('[data-oj-open]');if(open){activeId=open.dataset.ojOpen;resetVisit();refresh();window.scrollTo({top:$('ojJobPanel').offsetTop-80,behavior:'smooth'})}const rm=e.target.closest('[data-oj-rmmat]');if(rm){visitMaterials.splice(Number(rm.dataset.ojRmmat),1);renderVisitMaterials()}const dv=e.target.closest('[data-oj-delvisit]');if(dv){const j=job();if(!j||!confirm('Delete this visit?'))return;j.visits=(j.visits||[]).filter(v=>v.id!==dv.dataset.ojDelvisit);j.updated=new Date().toISOString();save();refresh()}});
  setupCatalogue(); resetVisit(); refresh();
})();
