/* ACF On the Go v1.74 — boiler age checker; all decoding happens locally. */
(()=>{'use strict';
const el=id=>document.getElementById(id), brand=el('ageBrand'), mode=el('ageMode'), field=el('ageSerial'), out=el('ageResult');
if(!brand||!field)return;
const names={worcester:'Worcester Bosch',baxi:'Baxi',vaillant:'Vaillant','ideal-logic':'Ideal Logic','ideal-classic':'Ideal Classic','ideal-mini':'Ideal Mini'};
const help={worcester:['3-digit FD code','Worcester FD code (e.g. 684). Older serials contain the code after the first 10 digits; newer serials have it as the second hyphen-separated group.'],baxi:['4 digits: YYWW','Baxi after 2003: serial digits 4–5 = year, 6–7 = week.'],vaillant:['2 digits: YY','Vaillant: serial digits 3–4 indicate the year.'], 'ideal-logic':['6 digits: date','Ideal Logic: last six digits encode date. Older models use YYMMDD; newer models DDMMYY.'], 'ideal-classic':['4 digits: YYWW','Ideal Classic: third four-digit group encodes year and week.'],'ideal-mini':['4 digits: MMYY','Ideal Mini: last four digits encode month and year.']};
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
const fdMap=new Map();
for(let y=1997;y<=2022;y++)for(let m=1;m<=12;m++){
 if(y===2022&&m>4)continue;
 let n;
 if(y<=1999)n=(y-1990)*100+80+m;
 else if(y<=2009)n=(y-2000)*100+80+m;
 else if(y===2010)n=m;
 else if(y<=2013)n=(y-2010)*100+m;
 else if(y<=2019)n=(y-2010)*100+(m<=4?16+m:48+m);
 else n=(y-2020)*100+(m<=4?36+m:68+m);
 fdMap.set(String(n).padStart(3,'0'),{year:y,month:m});
}
// Worcester document lists 2022 Jan-Apr only; avoid extrapolating beyond its table.
function update(){el('ageCodeLabel').firstChild.textContent=mode.value==='full'?'Complete serial number':'Date code';field.placeholder=mode.value==='full'?'Enter full serial number':help[brand.value][0];el('ageHelp').textContent=help[brand.value][1];out.hidden=true;}
brand.addEventListener('change',()=>{field.value='';update()});mode.addEventListener('change',()=>{field.value='';update()});field.addEventListener('input',()=>{out.hidden=true;});update();
function decode(){let raw=field.value.trim().toUpperCase(),s=raw.replace(/[^0-9]/g,''),code=s,b=brand.value;
 if(!raw)return {error:'Enter the serial number or date code first.'};
 if(mode.value==='full'){
  if(b==='worcester'){
   const modern=raw.match(/^\s*\d{4}\s*[-\s]\s*(\d{3})\s*[-\s]/);
   if(modern)code=modern[1];
   else if(/^\d{20}$/.test(s))code=s.slice(10,13);
   else return {error:'Worcester serial format not recognised. Try entering its 3-digit FD code directly.'};
  }else if(b==='baxi'){if(s.length<7)return {error:'Baxi serial must contain at least seven digits.'};code=s.slice(3,7);}
  else if(b==='vaillant'){if(s.length<4)return {error:'Vaillant serial must contain at least four digits.'};code=s.slice(2,4);}
  else if(b==='ideal-logic'){if(s.length<6)return {error:'Ideal Logic serial is too short.'};code=s.slice(-6);}
  else if(b==='ideal-mini'){if(s.length<4)return {error:'Ideal Mini serial is too short.'};code=s.slice(-4);}
  else if(b==='ideal-classic'){
   const groups=raw.match(/\d+/g)||[];
   if(groups.length<3||groups[2].length!==4)return {error:'Enter the Ideal Classic third four-digit group directly, or a serial containing clearly separated groups.'};
   code=groups[2];
  }
 }
 const now=new Date(), thisYear=now.getFullYear();
 if(b==='worcester'){
  if(!/^\d{3}$/.test(code))return {error:'Enter exactly three FD digits.'};
  const date=fdMap.get(code);return date?{...date,source:'Worcester Bosch FD chart (1997–April 2022)',code}:{error:'FD code not covered by the supplied Worcester chart. For boilers after April 2022, check with Worcester Bosch.'};
 }
 if(b==='baxi'||b==='ideal-classic'){
  if(!/^\d{4}$/.test(code))return {error:'Enter four digits (YYWW).'};
  const year=2000+Number(code.slice(0,2)),week=Number(code.slice(2));
  if(year>thisYear||week<1||week>53||(b==='baxi'&&year<2004))return {error:'Year/week is outside the supported range. Confirm with the manufacturer.'};
  return {year,week,source:b==='baxi'?'Baxi post-2003 serial date convention':'Ideal Classic serial date convention',code};
 }
 if(b==='vaillant'){
  if(!/^\d{2}$/.test(code))return {error:'Enter two year digits.'};
  const yy=Number(code),y=2000+yy;
  if(y>thisYear)return {error:'This code could represent an older century. Confirm with Vaillant.'};
  return {year:y,source:'Vaillant serial year convention; century assumed 2000s',code};
 }
 if(b==='ideal-mini'){
  if(!/^\d{4}$/.test(code))return {error:'Enter four digits (MMYY).'};
  const month=Number(code.slice(0,2)),year=2000+Number(code.slice(2));
  if(month<1||month>12||year>thisYear)return {error:'Invalid month or year; check the serial number.'};
  return {year,month,source:'Ideal Mini serial date convention',code};
 }
 if(b==='ideal-logic'){
  if(!/^\d{6}$/.test(code))return {error:'Enter six digits.'};
  const valid=(y,m,d)=>y<=thisYear&&m>=1&&m<=12&&d>=1&&new Date(y,m-1,d).getMonth()===m-1&&new Date(y,m-1,d).getDate()===d;
  const a={year:2000+Number(code.slice(0,2)),month:Number(code.slice(2,4)),day:Number(code.slice(4,6))};
  const z={day:Number(code.slice(0,2)),month:Number(code.slice(2,4)),year:2000+Number(code.slice(4,6))};
  const old=a.year<2015&&valid(a.year,a.month,a.day),newer=z.year>=2015&&valid(z.year,z.month,z.day);
  if(old&&newer)return {error:'This code matches both date formats. Confirm the model/manufacture era before using it.'};
  if(old)return {...a,source:'Ideal Logic pre-2015 YYMMDD convention',code};
  if(newer)return {...z,source:'Ideal Logic post-2015 DDMMYY convention',code};
  return {error:'Date does not match a valid Ideal Logic manufacture-date format.'};
 }
 return {error:'Unrecognised manufacturer.'};
}
let last=null;
function show(){const r=decode();last=r.error?null:r;out.hidden=false;out.replaceChildren();const h=document.createElement('h3');h.textContent=r.error?'Date not confirmed':'Manufacture date identified';out.append(h);const p=document.createElement('p');if(r.error){p.textContent=r.error;out.append(p);return;}
 const date=[r.day||'',r.month?months[r.month-1]:'',r.year].filter(Boolean).join(' ');p.textContent=date+(r.week?' · production week '+r.week:'');p.style.fontSize='1.25rem';p.style.fontWeight='800';out.append(p);
 const now=new Date();let age=now.getFullYear()-r.year;if(r.month&&now.getMonth()+1<r.month)age--;age=Math.max(0,age);
 const ageP=document.createElement('p');ageP.textContent='Approximately '+age+' years old'+(!r.month?' (year only)':'');out.append(ageP);
 const note=document.createElement('p');note.className='meta';note.textContent=r.source+'. Estimated manufacture date, not installation date. Check against manufacturer records if required.';out.append(note);
 const copy=document.createElement('button');copy.type='button';copy.className='secondary-action';copy.textContent='Copy to Job Notes';copy.onclick=async()=>{const t=names[brand.value]+' boiler. Estimated manufacture date: '+date+(r.week?' (week '+r.week+')':'')+'. Approximate age: '+age+' years. Based on serial/date code '+r.code+'.';try{await navigator.clipboard.writeText(t);copy.textContent='Copied ✓';}catch(e){const ta=document.createElement('textarea');ta.value=t;document.body.append(ta);ta.select();document.execCommand('copy');ta.remove();copy.textContent='Copied ✓';}};out.append(copy);
}
el('ageCheck').addEventListener('click',show);
let photo=null;el('agePhoto').addEventListener('change',e=>{photo=e.target.files?.[0]||null;const img=el('agePreview');if(photo){img.src=URL.createObjectURL(photo);img.hidden=false;}else img.hidden=true;el('ageOcrStatus').textContent='';});
el('ageReadPhoto').addEventListener('click',async()=>{const status=el('ageOcrStatus');if(!photo){status.textContent='Take or select a photo first.';return;}if(!window.Tesseract){status.textContent='Photo reader requires internet access. Enter the code manually.';return;}
 const btn=el('ageReadPhoto');btn.disabled=true;status.textContent='Reading photo… this may take a moment.';
 try{const res=await window.Tesseract.recognize(photo,'eng');const text=res.data.text||'';let value='';
  if(brand.value==='worcester'){
   const modern=text.match(/\b\d{4}\s*[- ]\s*(\d{3})\s*[- ]\s*\d{3,}/);
   const old=text.replace(/[^\d]/g,'').match(/\d{20}/);
   if(modern)value=mode.value==='full'?modern[0].replace(/\s+/g,'-'):modern[1];
   else if(old)value=mode.value==='full'?old[0]:old[0].slice(10,13);
  }
  if(!value){const lines=text.split(/\n+/);const candidates=lines.flatMap(line=>line.match(/[A-Z0-9][A-Z0-9\-\s]{7,}/gi)||[]).map(x=>x.trim()).filter(x=>/\d{6,}/.test(x.replace(/\D/g,'')));candidates.sort((a,b)=>b.replace(/\D/g,'').length-a.replace(/\D/g,'').length);if(candidates[0]){value=candidates[0].replace(/\s+/g,'');mode.value='full';}}
  if(value){field.value=value;update();status.textContent='Number detected. Check it matches the photo before pressing Identify Boiler Age.';}else status.textContent='Could not reliably read the serial number. Enter the date code manually.';
 }catch(e){status.textContent='Photo reading failed. Enter the date code manually.';}finally{btn.disabled=false;}
});
})();
