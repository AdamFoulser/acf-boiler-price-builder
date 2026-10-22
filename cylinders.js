(()=>{
 const $=id=>document.getElementById(id); if(!$('cyType'))return;
 const catalog=(window.WILLIAMS_CATALOGUE_ITEMS||[]).filter(x=>/cylinder/i.test(x.section)&&/cylinder|flowcyl|gledhill|indirect|direct|megaflo/i.test(x.description)&&Number(x.price)>0);
 const money=n=>'£'+Number(n).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
 const choices=(el,arr,placeholder)=>{el.innerHTML='';el.add(new Option(placeholder,''));arr.forEach(x=>el.add(new Option(x.label,x.value)));el.disabled=!arr.length;};
 for(let n=50;n<=500;n+=50)$('cyMaterials').add(new Option(money(n),n));
 for(let n=500;n<=1500;n+=50)$('cyLabour').add(new Option(money(n),n));
 const size=x=>{const d=x.description;const m=d.match(/(?:^|\s)(\d{2,3})\s*(?:l(?:itres?)?|ltr)\b/i);return m?Number(m[1]):null};
 const band=n=>n>=165&&n<=185?'170–180L':n+'L';
 function matches(x){let d=x.description.toLowerCase(),section=x.section.toLowerCase(),type=$('cyType').value,config=$('cyConfig').value;if(!type||!config)return false;
 // A model is only offered when its catalogue listing explicitly identifies the chosen type and configuration.
 if(type==='unvented'&&!(/unvented|megaflo|flowcyl/i.test(d+' '+section)))return false;
 if(type==='vented'&&!(/vented/i.test(d+' '+section))||type==='vented'&&/unvented/i.test(d+' '+section))return false;
 if(!new RegExp('\\b'+config+'\\b','i').test(d+' '+section))return false;
 return size(x)!==null;
 }
 let candidates=[];
 function updateSizes(){candidates=catalog.filter(matches);const sizes=[...new Set(candidates.map(x=>band(size(x))))].sort((a,b)=>parseInt(a)-parseInt(b));choices($('cyCapacity'),sizes.map(x=>({value:x,label:x})),'Select capacity');updateModels();}
 function updateModels(){const cap=$('cyCapacity').value;const models=candidates.filter(x=>band(size(x))===cap);choices($('cyModel'),models.map(x=>({value:x.code,label:x.description+' — '+money(x.price)})),'Select manufacturer / model');calculate();}
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
 $('cyType').addEventListener('change',()=>{choices($('cyConfig'),$('cyType').value?['indirect','direct'].map(x=>({value:x,label:x[0].toUpperCase()+x.slice(1)})):[],'Select configuration');updateSizes()});
 $('cyConfig').addEventListener('change',updateSizes);$('cyCapacity').addEventListener('change',updateModels);
 ['cyModel','cyMaterials','cyLabour','cyPump','cyTwoPort','cyThreePort','cy28Port'].forEach(id=>$(id).addEventListener('change',calculate));
 $('cyCopy').addEventListener('click',async()=>{if(!$('cyQuote').value)return;try{await navigator.clipboard.writeText($('cyQuote').value);$('cyStatus').textContent='Quotation copied.'}catch(_){$('cyQuote').select();$('cyStatus').textContent='Select and copy the quotation above.'}});
 calculate();
})();
