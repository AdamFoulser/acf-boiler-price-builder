
(function(){
'use strict';
const $=id=>document.getElementById(id);
const runBox=$('igRuns'); if(!runBox)return;
let last='';
function addRun(){
 const el=document.createElement('div');el.className='ig-run';
 el.style='display:grid;grid-template-columns:1fr 1fr auto;gap:6px;margin:8px 0';
 el.innerHTML='<label>Length (m)<input type="number" min="0" step="any" class="ig-length" placeholder="e.g. 6"></label><label>Internal L/m<input type="number" min="0" step="any" class="ig-rate" placeholder="verified L/m"></label><button type="button" class="secondary" aria-label="Remove run">×</button>';
 el.querySelector('button').onclick=()=>el.remove();runBox.appendChild(el);
}
$('igAddRun').onclick=addRun;addRun();
$('igMeter').onchange=()=>{$('igMeterOther').hidden=$('igMeter').value!=='custom'};
$('igFittings').onchange=()=>{$('igFittingsActual').hidden=$('igFittings').value!=='actual'};
const fmt=n=>Number(n).toFixed(4);
function limit(gas,iv){
 if(gas==='ng')return iv<=.005?8:iv<=.010?4:iv<=.015?2.5:1;
 if(gas==='air')return iv<=.025?1.5:.5;
 return iv<=.0025?2:iv<=.005?1:iv<=.01?0.5:0;
}
function value(id){const s=$(id).value;return s===''?NaN:Number(s)}
$('igCalculate').onclick=()=>{
 let total=0,invalid=false,any=false;
 for(const r of runBox.querySelectorAll('.ig-run')){
  const l=r.querySelector('.ig-length').value, rate=r.querySelector('.ig-rate').value;
  if(!l&&!rate)continue;
  any=true;
  if(l===''||rate===''||!Number.isFinite(+l)||!Number.isFinite(+rate)||+l<0||+rate<=0){invalid=true;break;}
  total+=Number(l)*Number(rate);
 }
 const meter=$('igMeter').value==='custom'?value('igMeterOther'):Number($('igMeter').value);
 const fittings=$('igFittings').value==='actual'?value('igFittingsActual'):total*.1;
 const drop=value('igDrop');
 const result=$('igResult');
 if(invalid||!Number.isFinite(meter)||meter<0||!Number.isFinite(fittings)||fittings<0||!Number.isFinite(drop)||drop<0||(!any&&meter===0)){
  result.textContent='Complete valid pipe, meter, fittings and observed pressure-loss values before calculating.';$('igCopy').disabled=true;return;
 }
 const ivL=total+fittings+meter,iv=ivL/1000,purge=ivL*1.5;
 const gas=$('igFuel').value,context=$('igContext').value,smell=$('igSmell').value==='yes',proven=$('igPipeProven').value;
 const permitted=iv<=.035?limit(gas,iv):null;
 let note='';
 if(iv>.035)note='OUTSIDE UP/1B VOLUME SCOPE — use appropriate standard; no permissible loss determined.';
 else if(smell)note='GAS SMELL REPORTED — do not accept the test; investigate and make safe.';
 else if(context!=='existing')note='NO PERCEPTIBLE MOVEMENT required for this test arrangement. Confirm using the applicable gauge and procedure.';
 else if(drop>0&&proven!=='yes')note='DO NOT ACCEPT: observed movement requires isolation/retest to prove pipework gas tight. Confirm no perceptible movement on pipework.';
 else if(drop>permitted)note='Observed loss exceeds the tabulated maximum. Investigate and make safe.';
 else note='Numerical comparison within tabulated maximum, subject to all IGEM testing conditions, pipework verification and engineer assessment.';
 last=`ACF IGEM/UP/1B Edition 4 worksheet\nGas: ${gas.toUpperCase()}\nPipe volume: ${fmt(total)} L\nFittings: ${fmt(fittings)} L\nMeter: ${fmt(meter)} L\nInstallation volume: ${fmt(ivL)} L (${fmt(iv)} m3)\nPurge volume: ${fmt(purge)} L (1.5 x IV)\nMaximum table loss: ${permitted===null?'Out of scope':permitted===0?'No perceptible movement':permitted+' mbar'}\nObserved loss: ${drop} mbar\nTest: ${$('igContext').selectedOptions[0].text}\nPipework separately proven: ${proven}\nGas smell: ${smell?'Yes':'No'}\nAssessment: ${note}\nEngineer must verify against current standard.`;
 result.textContent=last;result.style='white-space:pre-wrap;padding:12px;background:#eef3f8;border-radius:10px';
 $('igCopy').disabled=false;
};
$('igCopy').onclick=async()=>{if(!last)return;try{await navigator.clipboard.writeText(last);$('igCopy').textContent='Copied';}catch(e){$('igCopy').textContent='Select and copy results above';}};
})();
