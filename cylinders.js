(()=>{
 const $=id=>document.getElementById(id); if(!$('cyType'))return;
 const catalog=(window.WILLIAMS_CATALOGUE_ITEMS||[]).filter(x=>x.section==='Heating - Cylinders' && Number(x.price)>0 && !/immersion heater|thermostat|coffin/i.test(x.description) && !/^(HCTIH|HCTS|HCPT)/i.test(x.code));
 const isVented=x=>/^HCC(?:IBIND|DBDIR)/i.test(x.code);
 const configOf=x=>{
  const d=x.description,c=x.code;
  if(/indirect|\bind\b/i.test(d)||/^(HCUIN\d+I|HCUINPPSR|HCPLTIN|HCUPROIN|HCUESIN|HCUFCIND|HCUFCNIN|HCSU\d+IC|HCCIBIND)/i.test(c))return 'indirect';
  if(/direct|\bdir\b/i.test(d)||/^(HCUIN\d+D|HCPLTDR|HCUPRODR|HCUFCDIR|HCSU\d+DC|HCCDBDIR)/i.test(c))return 'direct';
  return null;
 };
 const rangeName=x=>{
  const c=x.code,d=x.description;
  if(/^HCC/.test(c))return 'Gledhill';
  if(/Flowcyl/i.test(d))return 'Flowcyl';
  if(/Platinum/i.test(d))return 'Platinum';
  if(/\bPro\b/i.test(d))return 'Pro';
  if(/Smart/i.test(d))return 'Smart';
  if(/ES Indirect/i.test(d))return 'ES';
  return 'Williams catalogue';
 };
 const money=n=>'£'+Number(n).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
 const choices=(el,arr,placeholder)=>{el.innerHTML='';el.add(new Option(placeholder,''));arr.forEach(x=>el.add(new Option(x.label,x.value)));el.disabled=!arr.length;};
 for(let n=50;n<=500;n+=50)$('cyMaterials').add(new Option(money(n),n));
 for(let n=500;n<=1500;n+=50)$('cyLabour').add(new Option(money(n),n));
 const size=x=>{
   const d=x.description;
   const m=d.match(/\b(\d{2,3})\s*(?:litres?|ltr|l)\b/i);
   return m?Number(m[1]):null;
 };
 const orientationOf=x=>/horizontal|\bhoriz\b/i.test(x.description)?'horizontal':'vertical';
 const profileOf=x=>/slimline|\bslim\b|DCSL|ICSL|HCUFCNIN/i.test(x.description+' '+x.code)||/Gledhill 1500 x 300/i.test(x.description)?'slimline':'standard';
 const band=n=>n>=165&&n<=185?'165–185L':n+'L';
 function matches(x){
   const type=$('cyType').value,config=$('cyConfig').value;
   if(!type||!config)return false;
   if(type==='vented'&&!isVented(x))return false;
   if(type==='unvented'&&isVented(x))return false;
   return configOf(x)===config&&size(x)!==null&&orientationOf(x)===$('cyOrientation').value&&profileOf(x)===$('cyProfile').value;
 }
 let candidates=[];
 function updateSizes(){candidates=catalog.filter(matches);const sizes=[...new Set(candidates.map(x=>band(size(x))))].sort((a,b)=>parseInt(a)-parseInt(b));choices($('cyCapacity'),sizes.map(x=>({value:x,label:x})),'Select capacity');updateModels();}
 function updateModels(){const cap=$('cyCapacity').value;const models=candidates.filter(x=>band(size(x))===cap);choices($('cyModel'),models.sort((a,b)=>rangeName(a).localeCompare(rangeName(b))||size(a)-size(b)).map(x=>({value:x.code,label:rangeName(x)+' · '+x.description+' · '+x.code+' — '+money(x.price)})),models.length?'Select manufacturer / model ('+models.length+' available)':'No matching cylinders in Williams Issue 179');$('cyStatus').textContent=models.length?models.length+' matching cylinder model(s) found.':'No matching models for these filters. Try another capacity or profile.';calculate();}
 function extrasPrices(){let s={};try{s=JSON.parse(localStorage.getItem('acf_extra_prices_v170')||'{}')}catch(_){}return s;}
 function extraPrice(key,def){const s=extrasPrices();return Number(s[key]??def);}
 function calculate(){const item=candidates.find(x=>x.code===$('cyModel').value),materials=Number($('cyMaterials').value),labour=Number($('cyLabour').value),indirect=$('cyConfig').value==='indirect';$('cyIndirectExtras').hidden=!indirect;
 const extras=[['cyPump','Central Heating Pump',150],['cyTwoPort','22mm 2-Port Motorised Valve',120],['cyThreePort','22mm 3-Port Motorised Valve',150],['cy28Port','28mm 2-Port Motorised Valve',150]].filter(([id])=>indirect&&$(id).value==='1').map(([id,label,price])=>({label,price:extraPrice(label,price)}));
 const total=(item?Number(item.price):0)+materials+labour+extras.reduce((s,x)=>s+x.price,0);
 $('cyTotal').textContent=item?money(total)+' + VAT':'Select a cylinder';$('cyProductInfo').textContent=item?'Williams '+item.code+' · '+money(item.price)+' ex VAT':'';
 $('cyKitNote').textContent=$('cyType').value==='unvented'?'Unvented cylinder kits may include an expansion vessel and inlet control group. Verify the exact model kit contents; do not automatically add these accessories.':'';
 $('cyBreakdown').textContent=item?`Cylinder ${money(item.price)} · Materials ${money(materials)} · Labour ${money(labour)}${extras.map(x=>' · '+x.label+' '+money(x.price)).join('')}`:'';
 $('cyQuote').value=item?`Supply and fit ${item.description}.\nInclude associated pipework and fittings${indirect&&extras.length?', '+extras.map(x=>x.label.toLowerCase()).join(', '):''}.\nRemove and dispose of existing cylinder where applicable. Test and commission on completion.\n\nEstimate: ${money(total)} + VAT.\nSubject to survey and confirmation of cylinder specification and included accessories.`:'';
 }
 $('cyType').addEventListener('change',()=>{choices($('cyConfig'),$('cyType').value?['indirect','direct'].map(x=>({value:x,label:x[0].toUpperCase()+x.slice(1)})):[],'Select configuration');$('cyConfig').dispatchEvent(new Event('change'))});
 $('cyConfig').addEventListener('change',()=>{choices($('cyOrientation'),$('cyConfig').value?['vertical','horizontal'].map(x=>({value:x,label:x==='vertical'?'Vertical / upright':'Horizontal'})):[],'Select orientation');$('cyOrientation').dispatchEvent(new Event('change'))});
 $('cyOrientation').addEventListener('change',()=>{choices($('cyProfile'),$('cyOrientation').value?['standard','slimline'].map(x=>({value:x,label:x==='standard'?'Standard':'Slimline'})):[],'Select profile');updateSizes()});
 $('cyProfile').addEventListener('change',updateSizes);$('cyCapacity').addEventListener('change',updateModels);
 ['cyModel','cyMaterials','cyLabour','cyPump','cyTwoPort','cyThreePort','cy28Port'].forEach(id=>$(id).addEventListener('change',calculate));
 $('cyCopy').addEventListener('click',async()=>{if(!$('cyQuote').value)return;try{await navigator.clipboard.writeText($('cyQuote').value);$('cyStatus').textContent='Quotation copied.'}catch(_){$('cyQuote').select();$('cyStatus').textContent='Select and copy the quotation above.'}});
 calculate();
})();
