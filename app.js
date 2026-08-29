const D = window.ACF_DATA;
const gbp = n => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(Number(n || 0));
const gbpQuote = n => { const v=Number(n||0); return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',minimumFractionDigits:Number.isInteger(v)?0:2,maximumFractionDigits:2}).format(v); };
const el = id => document.getElementById(id);
const val = id => el(id).value;
const manufacturers = [...new Set(D.boilers.map(x => x.manufacturer))];
const PRICE_CHECKED = '28 Aug 2026';

function normalizeBoilerType(type) {
  const t = String(type || '').trim().toLowerCase();
  if (t.includes('combi')) return 'Combi';
  if (t.includes('system')) return 'System';
  if (t.includes('heat') || t.includes('regular') || t.includes('open vent')) return 'Heat Only';
  return String(type || '').trim();
}

const cityOffers = [
  {
    manufacturer:'Baxi', model:'Baxi 424 Combi 2.1 24kW Boiler', supplier:'City Plumbing',
    priceExVat:695.46, note:'Public boiler-only price', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/baxi-424-combi-21-24kw-boiler-7872835/p/152145'
  },
  {
    manufacturer:'Baxi', model:'Baxi 430 Combi 2.1 30kW Boiler', supplier:'City Plumbing',
    priceExVat:756.77, note:'Public boiler-only price', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/baxi-430-combi-21-30kw-boiler-7872836/p/152146'
  },
  {
    manufacturer:'Baxi', model:'Baxi 436 Combi 2.1 36kW Boiler', supplier:'City Plumbing',
    priceExVat:847.22, note:'Public boiler-only price', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/baxi-436-combi-21-36kw-boiler-7872837/p/152147'
  },
  {
    manufacturer:'Baxi', model:'Baxi 824 24kW Gas Combi 2 Boiler', supplier:'City Plumbing',
    priceExVat:1140.00, note:'Public price — boiler with included Adey Micro2 filter', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/baxi-824-combi-2-24kw-boiler-7814304/p/837964'
  },
  {
    manufacturer:'Baxi', model:'Baxi 830 30kW Gas Combi 2 Boiler', supplier:'City Plumbing',
    priceExVat:1260.00, note:'Public price — boiler with included Adey Micro2 filter', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/baxi-830-combi-2-30kw-boiler-adey-micro2-system-filter-7814305/p/837972'
  },
  {
    manufacturer:'Baxi', model:'Baxi 836 36kW Gas Combi 2 Boiler', supplier:'City Plumbing',
    priceExVat:1360.00, note:'Public price — boiler with included Adey Micro2 filter', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/baxi-836-combi-2-36kw-boiler-7814306/p/837949'
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 4000 30kW Combi NG', supplier:'City Plumbing',
    priceExVat:1247.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/worcester-bosch-greenstar-4000-combi-boiler-white-30-kw-7733600373/p/550559'
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 4000 25kW Combi NG', supplier:'City Plumbing',
    priceExVat:1107.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/worcester-bosch-greenstar-4000-combi-boiler-white-25-kw/p/550572'
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 1000 30kW Combi NG', supplier:'City Plumbing',
    priceExVat:670.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/worcester-bosch-greenstar-1000-30kw-combi-7736902179/p/668700'
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 2000 Combi 30kW NG', supplier:'City Plumbing',
    priceExVat:929.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 36CDi Compact Combi NG', supplier:'City Plumbing',
    priceExVat:1571.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 4000 12kW System NG', supplier:'City Plumbing',
    priceExVat:1136.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 4000 15kW System NG', supplier:'City Plumbing',
    priceExVat:1196.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 4000 18kW System NG', supplier:'City Plumbing',
    priceExVat:1249.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 4000 21kW System NG', supplier:'City Plumbing',
    priceExVat:1318.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 4000 24kW System NG', supplier:'City Plumbing',
    priceExVat:1360.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 8000+ 30kW System NG', supplier:'City Plumbing',
    priceExVat:1653.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 8000+ 35kW System NG', supplier:'City Plumbing',
    priceExVat:1828.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 27i Compact System NG', supplier:'City Plumbing',
    priceExVat:1416.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 12Ri Heat Only NG', supplier:'City Plumbing',
    priceExVat:996.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Vaillant', model:'Vaillant ecoTEC Pro 24kW Combi Boiler', supplier:'City Plumbing',
    priceExVat:1008.02, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Vaillant', model:'Vaillant ecoTEC Pro 30kW Combi Boiler ErP', supplier:'City Plumbing',
    priceExVat:1127.61, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Vaillant', model:'Vaillant 2023 ecoTEC Plus 832 32kW Combi Boiler', supplier:'City Plumbing',
    priceExVat:1651.22, note:'Public boiler price', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/vaillant-ecotec-plus-832-32kw-combi-boiler-0010036016/p/839283'
  },
  {
    manufacturer:'Vaillant', model:'Vaillant ecoFIT Pure 618 18kW System Boiler', supplier:'City Plumbing',
    priceExVat:1305.50, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Vaillant', model:'Vaillant ecoFIT Pure 625 25kW System Boiler', supplier:'City Plumbing',
    priceExVat:1481.37, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Vaillant', model:'Vaillant 2023 ecoTEC Plus 620 20kW System Boiler', supplier:'City Plumbing',
    priceExVat:1447.20, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Ideal', model:'Ideal Logic+ 24kW Combi2 Boiler', supplier:'City Plumbing',
    priceExVat:926.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Ideal', model:'Ideal Logic MAX 24kW Combi2 Boiler', supplier:'City Plumbing',
    priceExVat:1091.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Ideal', model:'Ideal Logic MAX 30kW Combi2 Boiler', supplier:'City Plumbing',
    priceExVat:1200.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/ideal-heating-ideal-logic-max-c30-30kw-combi-boiler-228335/p/635747'
  },
  {
    manufacturer:'Ideal', model:'Ideal Logic MAX 35kW Combi2 Boiler', supplier:'City Plumbing',
    priceExVat:1370.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Ideal', model:'Ideal Vogue MAX 26kW Combi Boiler', supplier:'City Plumbing',
    priceExVat:1360.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Ideal', model:'Ideal Vogue MAX 40kW Combi Boiler', supplier:'City Plumbing',
    priceExVat:1635.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Ideal', model:'Ideal Logic MAX 24kW System2 Boiler', supplier:'City Plumbing',
    priceExVat:1220.00, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Glow-worm', model:'Glow-worm Energy 25kW Combi ErP Boiler', supplier:'City Plumbing',
    priceExVat:896.46, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Glow-worm', model:'Glow-worm Energy 30kW Combi ErP Boiler', supplier:'City Plumbing',
    priceExVat:974.85, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Glow-worm', model:'Glow-worm Energy 18kW System ErP Boiler', supplier:'City Plumbing',
    priceExVat:1043.19, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Glow-worm', model:'Glow-worm Energy 25kW System ErP Boiler', supplier:'City Plumbing',
    priceExVat:1113.54, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Glow-worm', model:'Glow-worm Energy 30kW System ErP Boiler', supplier:'City Plumbing',
    priceExVat:1163.79, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Glow-worm', model:'Glow-worm Energy 12kW Heat Only ErP Boiler', supplier:'City Plumbing',
    priceExVat:937.67, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Glow-worm', model:'Glow-worm Energy 15kW Heat Only ErP Boiler', supplier:'City Plumbing',
    priceExVat:983.90, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Glow-worm', model:'Glow-worm Energy 18kW Heat Only ErP Boiler', supplier:'City Plumbing',
    priceExVat:1037.16, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Glow-worm', model:'Glow-worm Energy 25kW Heat Only ErP Boiler', supplier:'City Plumbing',
    priceExVat:1079.37, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
  {
    manufacturer:'Glow-worm', model:'Glow-worm Energy 30kW Heat Only ErP Boiler', supplier:'City Plumbing',
    priceExVat:1127.61, note:'Public boiler price', checked:PRICE_CHECKED,
    url:''
  },
];


const itemOffers = [
  {kind:'accessory', manufacturer:'Baxi', match:'Standard Horizontal', supplier:'City Plumbing', priceExVat:105.00, note:'Baxi Multifit standard horizontal flue', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Baxi', match:'Telescopic', supplier:'City Plumbing', priceExVat:118.00, note:'Baxi standard telescopic flue', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Baxi', match:'Vertical', supplier:'City Plumbing', priceExVat:122.88, note:'Baxi vertical flue terminal', checked:PRICE_CHECKED},

  {kind:'accessory', manufacturer:'Worcester Bosch', match:'Telescopic', supplier:'City Plumbing', priceExVat:105.65, note:'Worcester 7716191082 telescopic flue', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Worcester Bosch', match:'Long Telescopic', supplier:'City Plumbing', priceExVat:118.71, note:'Worcester 7716191171 long telescopic flue', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Worcester Bosch', match:'Vertical Flue', supplier:'City Plumbing', priceExVat:147.20, note:'Worcester 7719002430 vertical flue', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Worcester Bosch', match:'960mm', supplier:'City Plumbing', priceExVat:59.35, note:'Worcester 1m flue extension', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Worcester Bosch', match:'45', supplier:'City Plumbing', priceExVat:86.65, note:'Worcester 45° bend pair', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Worcester Bosch', match:'90', supplier:'City Plumbing', priceExVat:47.47, note:'Worcester 90° elbow', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Worcester Bosch', match:'Plume', supplier:'City Plumbing', priceExVat:91.42, note:'Worcester plume management kit', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Worcester Bosch', match:'Bracket', supplier:'City Plumbing', priceExVat:24.93, note:'Worcester support bracket kit', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Worcester Bosch', match:'Keyless', supplier:'City Plumbing', priceExVat:30.84, note:'Worcester keyless filling link', checked:PRICE_CHECKED},

  {kind:'accessory', manufacturer:'Vaillant', match:'Horizontal', supplier:'City Plumbing', priceExVat:119.72, note:'Vaillant 60/100 horizontal terminal', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Vaillant', match:'Vertical', supplier:'City Plumbing', priceExVat:146.66, note:'Vaillant vertical flue kit', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Vaillant', match:'970', supplier:'City Plumbing', priceExVat:56.97, note:'Vaillant 970mm flue extension', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Vaillant', match:'90', supplier:'City Plumbing', priceExVat:55.99, note:'Vaillant 90° flue elbow', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Vaillant', match:'45', supplier:'City Plumbing', priceExVat:86.54, note:'Vaillant 45° flue elbows', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Vaillant', match:'Plume', supplier:'City Plumbing', priceExVat:87.86, note:'Vaillant plume management kit', checked:PRICE_CHECKED},

  {kind:'accessory', manufacturer:'Ideal', match:'Horizontal Flue', supplier:'City Plumbing', priceExVat:98.30, note:'Ideal horizontal flue kit 208171', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Ideal', match:'Vertical', supplier:'City Plumbing', priceExVat:157.04, note:'Ideal vertical flue roof kit', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Ideal', match:'1m', supplier:'City Plumbing', priceExVat:59.00, note:'Ideal 1m flue extension', checked:PRICE_CHECKED},

  {kind:'accessory', manufacturer:'Glow-worm', match:'Horizontal', supplier:'City Plumbing', priceExVat:99.72, note:'Glow-worm standard horizontal flue', checked:PRICE_CHECKED},
  {kind:'accessory', manufacturer:'Glow-worm', match:'1000', supplier:'City Plumbing', priceExVat:52.22, note:'Glow-worm 1m extension', checked:PRICE_CHECKED},

  {kind:'thermostat', match:'T3R Wireless', supplier:'City Plumbing', priceExVat:64.98, note:'Honeywell Home Y3H710RF0053', checked:PRICE_CHECKED},
  {kind:'thermostat', match:'T3R Wired', supplier:'City Plumbing', priceExVat:47.00, note:'Honeywell Home T3 wired T3H110A0066', checked:PRICE_CHECKED},

  {kind:'filter', match:'Micro2 22mm', supplier:'City Plumbing', priceExVat:144.29, note:'Adey MagnaClean Micro2 FL1-03-01274', checked:PRICE_CHECKED},
  {kind:'filter', match:'Professional 2 22mm', supplier:'City Plumbing', priceExVat:162.75, note:'Adey MagnaClean Pro2 22mm', checked:PRICE_CHECKED},
  {kind:'filter', match:'Atom', supplier:'City Plumbing', priceExVat:127.96, note:'Adey MagnaClean Atom 22mm', checked:PRICE_CHECKED}
];



function fill(sel, items, map = x => ({text:x, value:x})) {
  sel.innerHTML = '';
  items.forEach(x => {
    const m = map(x);
    const o = document.createElement('option');
    o.textContent = m.text;
    o.value = m.value;
    if (m.disabled) o.disabled = true;
    sel.appendChild(o);
  });
}

function currentBoiler() {
  return D.boilers.find(x => x.manufacturer === val('manufacturer') && x.model === val('boilerModel'));
}

function williamsPrice(b) {
  return val('priceBasis') === 'Flexi-Pack' ? Number(b.flexiPrice || b.standardPrice) : Number(b.standardPrice || 0);
}


function refreshManufacturers() {
  const type = val('boilerType');
  const brands = [...new Set(D.boilers.filter(x => normalizeBoilerType(x.type) === type).map(x => x.manufacturer))];
  const old = el('manufacturer').value;
  fill(el('manufacturer'), brands);
  if (brands.includes(old)) el('manufacturer').value = old;
}

function refreshModels() {
  const brand = val('manufacturer');
  const type = val('boilerType');
  const models = D.boilers.filter(x => x.manufacturer === brand && normalizeBoilerType(x.type) === type);
  fill(el('boilerModel'), models, x => ({text:x.model, value:x.model}));
  refreshAccessories();
  updateWarrantyOptions();
  calc();
}

function refreshAccessories() {
  const brand = val('manufacturer');
  const opts = [{description:'None',price:0}, ...D.accessories.filter(x => x.manufacturer === brand)];
  document.querySelectorAll('.accSel').forEach(s => {
    fill(s, opts, x => ({text:x.description, value:x.description}));
    s.onchange = calc;
  });
}

function makeSelectOptions() {
  refreshManufacturers();
  fill(el('labour'), [0, ...D.settings.labourOptions.filter(x=>Number(x)!==0)], x => ({text:Number(x)===0?'None — £0.00':gbp(x), value:x}));
  fill(el('materials'), [0, ...D.settings.materialsOptions.filter(x=>Number(x)!==0)], x => ({text:Number(x)===0?'None — £0.00':gbp(x), value:x}));
  fill(el('thermostat'), D.settings.thermostats, x => ({text:`${x.name}${x.price ? ' — '+gbp(x.price) : ''}`, value:x.name}));
  fill(el('limescale'), D.settings.limescaleReducers, x => ({text:`${x.name}${x.price ? ' — '+gbp(x.price) : ''}`, value:x.name}));
  fill(el('filter'), D.settings.magneticFilters, x => ({text:`${x.name}${x.price ? ' — '+gbp(x.price) : ''}`, value:x.name}));
  el('labour').value = '0';
  el('materials').value = '0';
}

function buildAccessories() {
  const box = el('accessorySlots');
  box.innerHTML = '';
  for (let i=0; i<7; i++) {
    const d = document.createElement('div');
    d.className = 'accessory';
    d.innerHTML = '<select class="accSel"></select><div class="price accPrice">£0.00</div>';
    box.appendChild(d);
  }
}

function buildHeat() {
  const box = el('heatOnlyExtras');
  box.innerHTML = '';
  D.settings.heatOnlyExtras.forEach(x => {
    const d = document.createElement('div');
    d.className = 'checkrow';
    d.innerHTML = `<label><input type="checkbox" class="heatCheck" data-price="${x.price}"/>${x.name}</label><strong>${gbp(x.price)}</strong>`;
    box.appendChild(d);
  });
  document.querySelectorAll('.heatCheck').forEach(x => x.onchange = calc);
}

const wolseleyBoilerOffers = [];
const wolseleyItemOffers = [];

const warrantySourcesChecked = '29 Aug 2026';

function warrantyOptionsForBoiler(b){
  const m=String(b?.model||'');
  const make=String(b?.manufacturer||'');

  if(make==='Baxi'){
    if(/Baxi 8\d\d|Baxi 800 Heat/i.test(m)) return [{years:10,label:'10 years',restriction:'The magnetic filter supplied with the Baxi 800 must be fitted and maintained for the full 10-year warranty.',filterRule:'baxi800'}];
    if(/Baxi 6\d\d/i.test(m)) return [{years:7,label:'7 years',restriction:'Baxi 600 range: 7-year parts and labour warranty, subject to registration, Benchmark completion and annual servicing.',filterRule:'any'}];
    if(/Baxi 4\d\d/i.test(m)) return [{years:5,label:'5 years',restriction:'Baxi 400 range: 5-year parts and labour warranty, subject to registration, Benchmark completion and annual servicing.',filterRule:'any'}];
    if(/Baxi 2\d\d/i.test(m)) return [{years:2,label:'2 years',restriction:'Baxi 200 range: 2-year parts and labour warranty, subject to registration, Benchmark completion and annual servicing.',filterRule:'any'}];
  }
  if(make==='Baxi Main'){
    if(/Eco Compact/i.test(m)) return [{years:5,label:'5 years',restriction:'Main Eco Compact: 5-year warranty, subject to registration and annual servicing.',filterRule:'any'}];
  }
  if(make==='Worcester Bosch'){
    if(/8000\+/i.test(m)) return [
      {years:8,label:'8 years — standard',restriction:'Standard Worcester guarantee. Any compatible system filter can be selected.',filterRule:'any'},
      {years:10,label:'10 years — with Greenstar System Filter',restriction:'10-year guarantee requires a qualifying Worcester Greenstar System Filter. The System Filter Micro does not qualify for the 10-year 8000+ guarantee.',filterRule:'worcester'}
    ];
    if(/4000|CDi Compact|Ri Compact|\bRi\b/i.test(m)) return [
      {years:7,label:'7 years — standard',restriction:'Standard Worcester guarantee.',filterRule:'any'},
      {years:8,label:'8 years — with Greenstar System Filter',restriction:'8-year guarantee requires a qualifying Worcester Greenstar System Filter.',filterRule:'worcester'}
    ];
    if(/2000/i.test(m)) return [{years:7,label:'7 years',restriction:'7-year guarantee subject to fitting a Worcester Bosch or third-party system filter.',filterRule:'any-required'}];
    if(/1000/i.test(m)) return [{years:5,label:'5 years',restriction:'5-year guarantee subject to fitting a Worcester Bosch or third-party system filter.',filterRule:'any-required'}];
    if(/8000 F/i.test(m)) return [
      {years:7,label:'7 years — standard',restriction:'Standard Worcester guarantee.',filterRule:'any'},
      {years:8,label:'8 years — with Greenstar System Filter',restriction:'8-year guarantee requires a qualifying Worcester Greenstar System Filter.',filterRule:'worcester'}
    ];
  }
  if(make==='Vaillant'){
    if(/ecoTEC Plus/i.test(m)) return [
      {years:5,label:'5 years — standard',restriction:'5-year out-of-the-box guarantee.',filterRule:'any'},
      {years:10,label:'10 years — with Vaillant Boiler Protection Kit',restriction:'10-year guarantee requires a qualifying Vaillant Boiler Protection Kit and eligible installer registration.',filterRule:'vaillant'}
    ];
    if(/ecoFIT Pure/i.test(m)) return [
      {years:2,label:'2 years — standard',restriction:'2-year out-of-the-box guarantee.',filterRule:'any'},
      {years:10,label:'10 years — with Vaillant Protection Kit',restriction:'10-year guarantee requires a qualifying Vaillant Boiler Protection Kit / Advance Boiler Protection Kit and eligible installer registration.',filterRule:'vaillant'}
    ];
    if(/ecoTEC Pro/i.test(m)) return [
      {years:2,label:'2 years — standard',restriction:'2-year out-of-the-box guarantee.',filterRule:'any'},
      {years:7,label:'7 years — eligible installer registration',restriction:'7-year guarantee available through the Vaillant installer rewards scheme. Check current registration eligibility.',filterRule:'any'}
    ];
  }
  if(make==='Ideal'){
    if(/Vogue MAX/i.test(m)) return [
      {years:10,label:'10 years — standard',restriction:'10-year parts and labour warranty when registered within 30 days and serviced annually.',filterRule:'any'},
      {years:12,label:'12 years — MAX Accredited Installer',restriction:'12-year warranty is available when installed by an Ideal Heating MAX Accredited Installer. Terms apply.',filterRule:'any'}
    ];
    if(/Logic MAX/i.test(m)) return [{years:10,label:'10 years',restriction:'Logic MAX: 10-year warranty as standard, subject to registration and annual servicing.',filterRule:'any'}];
    if(/Logic\+/i.test(m)) return [{years:7,label:'7 years',restriction:'Logic+: 7-year warranty as standard. Terms and registration requirements apply.',filterRule:'any'}];
  }
  if(make==='Glow-worm'){
    if(/Energy/i.test(m)) return [
      {years:7,label:'7 years — standard',restriction:'Energy range: 7-year guarantee as standard.',filterRule:'any'},
      {years:10,label:'10 years — with Glow-worm Power System Filter',restriction:'10-year extended guarantee requires a Glow-worm Power System Filter and eligible myREWARDS registration.',filterRule:'glowworm'}
    ];
    if(/Easicom/i.test(m)) return [
      {years:3,label:'3 years — standard',restriction:'Easicom: 3-year standard guarantee.',filterRule:'any'},
      {years:5,label:'5 years — eligible installer registration',restriction:'Up to 5 years when registered by an eligible Glow-worm installer.',filterRule:'any'}
    ];
    if(/Compact/i.test(m)) return [{years:5,label:'5 years',restriction:'Glow-worm Compact: 5-year guarantee.',filterRule:'any'}];
  }
  return [{years:null,label:'Check manufacturer warranty',restriction:'Warranty rule for this older/specialist range has not yet been verified. Do not quote a warranty length until checked.',filterRule:'any'}];
}

function selectedWarranty(){
  const b=currentBoiler();
  const rules=warrantyOptionsForBoiler(b);
  return rules[Number(val('warranty')||0)] || rules[0];
}

function qualifyingManufacturerFilters(b, rule){
  const allAcc=(D.accessories||[]).filter(x=>x.manufacturer===b.manufacturer && /filter/i.test(x.description||''));
  if(rule==='worcester') return allAcc.filter(x=>/system filter/i.test(x.description||'') && !/micro/i.test(x.description||''));
  if(rule==='vaillant') return allAcc.filter(x=>/filter|protection/i.test(x.description||''));
  if(rule==='glowworm') return allAcc.filter(x=>/power system filter/i.test(x.description||''));
  return allAcc;
}

function filterPrice(name){
  if(!name || name==='None' || /included/i.test(name)) return 0;
  const s=(D.settings.magneticFilters||[]).find(x=>x.name===name);
  if(s) return Number(s.price||0);
  const a=(D.accessories||[]).find(x=>x.description===name);
  return Number(a?.price||0);
}

function refreshFilterOptions(){
  const b=currentBoiler(), sel=el('filter');
  if(!b || !sel) return;
  const old=sel.value;
  const w=selectedWarranty();
  let opts=[];
  if(w.filterRule==='baxi800'){
    opts=[{name:'Baxi supplied Adey Micro2 filter (included)',price:0}];
  } else if(['worcester','vaillant','glowworm'].includes(w.filterRule)){
    opts=qualifyingManufacturerFilters(b,w.filterRule).map(x=>({name:x.description,price:Number(x.price||0)}));
    if(!opts.length) opts=[{name:'Required manufacturer filter — price to confirm',price:0}];
  } else {
    opts=(D.settings.magneticFilters||[]).map(x=>({name:x.name,price:Number(x.price||0)}));
    const extra=qualifyingManufacturerFilters(b,'any').map(x=>({name:x.description,price:Number(x.price||0)}));
    const seen=new Set(opts.map(x=>x.name));
    extra.forEach(x=>{ if(!seen.has(x.name)){ opts.push(x); seen.add(x.name); } });
    if(w.filterRule==='any-required') opts=opts.filter(x=>x.name!=='None');
  }
  sel.innerHTML=opts.map(x=>`<option value="${x.name.replace(/"/g,'&quot;')}">${x.name}${x.price?` — ${gbp(x.price)}`:''}</option>`).join('');
  if([...sel.options].some(o=>o.value===old)) sel.value=old;
}

function updateWarrantyOptions(){
  const b=currentBoiler();
  const s=el('warranty');
  if(!b || !s) return;
  const old=s.value;
  const rules=warrantyOptionsForBoiler(b);
  s.innerHTML=rules.map((r,i)=>`<option value="${i}">${r.label}</option>`).join('');
  if([...s.options].some(o=>o.value===old)) s.value=old; else s.value='0';
  updateWarrantyRule();
  refreshFilterOptions();
}
function updateWarrantyRule(){
  const b=currentBoiler(), box=el('warrantyRule');
  if(!b || !box) return;
  const r=selectedWarranty();
  box.innerHTML=`<strong>${r.years ? r.years+' year warranty' : r.label}</strong><br>${r.restriction}<br><small>Warranty data checked ${warrantySourcesChecked}. Manufacturer terms apply.</small>`;
  if(el('sumWarranty')) el('sumWarranty').textContent=r.years ? `${r.years} years` : 'Check manufacturer';
}

function selectedWilliamsBasket(){
  const b=currentBoiler();
  if(!b) return {items:[],total:0};
  const items=[{kind:'boiler',manufacturer:b.manufacturer,model:b.model,name:b.model,williams:williamsPrice(b)}];
  document.querySelectorAll('.accSel').forEach(s=>{
    if(!s.value || s.value==='None') return;
    const a=D.accessories.find(x=>x.manufacturer===b.manufacturer && x.description===s.value);
    if(a) items.push({kind:'accessory',manufacturer:b.manufacturer,name:a.description,williams:Number(a.price||0)});
  });
  const t=val('thermostat');
  if(t && t!=='None'){
    const x=D.settings.thermostats.find(x=>x.name===t);
    if(x) items.push({kind:'thermostat',manufacturer:'',name:x.name,williams:Number(x.price||0)});
  }
  const f=val('filter');
  if(f && f!=='None'){
    const p=filterPrice(f);
    items.push({kind:'filter',manufacturer:b.manufacturer,name:f,williams:p});
  }
  return {items,total:items.reduce((s,x)=>s+x.williams,0)};
}

function merchantBasketComparison(merchant){
  const basket=selectedWilliamsBasket();
  let total=0; const missing=[];
  basket.items.forEach(item=>{
    let match=null;
    if(merchant==='City Plumbing'){
      if(item.kind==='boiler') match=cityOffers.find(x=>x.manufacturer===item.manufacturer && x.model===item.model);
      else match=itemOffers.find(x=>x.supplier==='City Plumbing' && x.kind===item.kind && (item.kind==='accessory' ? x.manufacturer===item.manufacturer && item.name.toLowerCase().includes(x.match.toLowerCase()) : item.name.toLowerCase().includes(x.match.toLowerCase())));
    } else {
      if(item.kind==='boiler') match=wolseleyBoilerOffers.find(x=>x.manufacturer===item.manufacturer && x.model===item.model);
      else match=wolseleyItemOffers.find(x=>x.kind===item.kind && (item.kind==='accessory' ? x.manufacturer===item.manufacturer && item.name.toLowerCase().includes(x.match.toLowerCase()) : item.name.toLowerCase().includes(x.match.toLowerCase())));
    }
    if(match) total+=Number(match.priceExVat||0); else missing.push(item.name);
  });
  return {total,missing,count:basket.items.length};
}
function updateSupplierComparison(){
  const basket=selectedWilliamsBasket();
  if(el('compareWilliams')) el('compareWilliams').textContent=gbp(basket.total);
  [['City Plumbing','compareCity','cityCompareStatus','cityMissing'],['Wolseley','compareWolseley','wolseleyCompareStatus','wolseleyMissing']].forEach(([merchant,pid,sid,mid])=>{
    const r=merchantBasketComparison(merchant), p=el(pid), s=el(sid), miss=el(mid);
    if(!p||!s||!miss) return;
    if(r.count && r.missing.length===0){
      p.textContent=gbp(r.total);
      const diff=r.total-basket.total;
      s.textContent=Math.abs(diff)<0.01?'Same price as Williams':diff<0?`${gbp(-diff)} cheaper than Williams`:`${gbp(diff)} more expensive than Williams`;
      miss.textContent='';
    } else {
      p.textContent=r.total?gbp(r.total):'Not available';
      s.textContent=r.count?`${r.count-r.missing.length} of ${r.count} items matched`:'No equipment selected';
      miss.textContent=r.missing.length?`Missing: ${r.missing.join(', ')}`:'';
    }
  });
}

function calc() {
  const b=currentBoiler();
  if(!b) return;
  const boilerPrice=williamsPrice(b);
  if(el('williamsBoilerBasis')) el('williamsBoilerBasis').textContent=gbp(boilerPrice);
  updateWarrantyRule();

  el('boilerMeta').innerHTML = `<b>${b.type}</b>${b.output ? ' · '+b.output+'kW' : ''}<br>Part code: ${b.partCode || '—'}<br>Williams ${val('priceBasis')} price: <b>${gbp(boilerPrice)}</b>`;
  const isHeatOnly=normalizeBoilerType(b.type)==='Heat Only';
  el('heatOnlyCard').style.display=isHeatOnly?'block':'none';

  let accessoriesTotal=0;
  const priceEls=document.querySelectorAll('.accPrice');
  document.querySelectorAll('.accSel').forEach((s,i)=>{
    const a=D.accessories.find(x=>x.manufacturer===b.manufacturer && x.description===s.value);
    const p=a?Number(a.price||0):0;
    accessoriesTotal+=p;
    priceEls[i].textContent=gbp(p);
    priceEls[i].classList.remove('unavailable');
  });
  const matchNote=el('accessoryMatchNote'); if(matchNote) matchNote.textContent='';

  const thermostat=Number(D.settings.thermostats.find(x=>x.name===val('thermostat'))?.price||0);
  const limescale=Number(D.settings.limescaleReducers.find(x=>x.name===val('limescale'))?.price||0);
  const shockArrestor=Number(val('shockArrestor')||0);
  const trvQty=Number(val('trvQty')||0);
  const trvUnit=Number(val('trvType')||0);
  const trvParts=trvQty*trvUnit;
  const trvLabour=trvQty*30;
  const trvTotal=trvParts+trvLabour;
  const powerflushOn=val('powerflush')==='1';
  const powerflushRads=Number(val('powerflushRads')||0);
  const powerflushTotal=powerflushOn ? 450 + Math.max(0,powerflushRads-8)*30 : 0;
  if(el('trvBreakdown')) el('trvBreakdown').textContent=trvQty ? `${trvQty} TRV${trvQty===1?'':'s'}: ${gbp(trvParts)} parts + ${gbp(trvLabour)} labour = ${gbp(trvTotal)} ex VAT` : 'No TRVs selected';
  if(el('powerflushRadLabel')) el('powerflushRadLabel').style.display=powerflushOn?'block':'none';
  if(el('powerflushBreakdown')) { el('powerflushBreakdown').style.display=powerflushOn?'block':'none'; el('powerflushBreakdown').textContent=powerflushOn ? `Powerflush: ${gbp(powerflushTotal)} ex VAT${powerflushRads>8?` (${powerflushRads-8} additional radiator${powerflushRads-8===1?'':'s'})`: ' — includes up to 8 radiators'}` : ''; }
  const filter=filterPrice(val('filter'));
  if(el('thermostatCompare')) el('thermostatCompare').textContent=val('thermostat')==='None'?'':`Williams: ${gbp(thermostat)}`;
  if(el('filterCompare')) el('filterCompare').textContent=val('filter')==='None'?'':`Williams: ${gbp(filter)}`;

  let heatExtras=0;
  if(isHeatOnly) document.querySelectorAll('.heatCheck:checked').forEach(x=>heatExtras+=Number(x.dataset.price||0));
  const extras=Number(val('labour'))+Number(val('materials'))+thermostat+limescale+shockArrestor+filter+trvTotal+powerflushTotal+heatExtras;
  const subtotal=boilerPrice+accessoriesTotal+extras;
  const commission=subtotal*Number(val('commission'));
  const rawExVat=subtotal+commission;
  const roundTo=Number(D.settings.roundUpTo||5);
  const exVat=Math.ceil(rawExVat/roundTo)*roundTo;
  const vat=exVat*Number(D.settings.vat||0.2);
  const incVat=exVat+vat;

  el('sumBoiler').textContent=gbp(boilerPrice);
  el('sumAccessories').textContent=gbp(accessoriesTotal);
  el('sumExtras').textContent=gbp(extras);
  el('subtotal').textContent=gbp(subtotal);
  el('sumCommission').textContent=gbp(commission);
  el('exvat').textContent=gbp(exVat);
  el('vat').textContent=gbp(vat);
  el('incvat').textContent=gbp(incVat);
  updateSupplierComparison();
}


function quoteModelName(b){
  let name=String(b?.model||'').trim();
  name=name.replace(/\s+Gas\s+/gi,' ')
           .replace(/\s+NG\b/gi,'')
           .replace(/\s+ErP\b/gi,'')
           .replace(/\s+Boiler\b/gi,'')
           .replace(/\s{2,}/g,' ')
           .trim();
  return name;
}

function warrantyQuoteText(b,w){
  if(!w?.years) return 'warranty to be confirmed';
  const make=String(b?.manufacturer||'');
  const years=`${w.years}-year`;
  if(make==='Worcester Bosch'){
    if(w.filterRule==='worcester') return `${years} guarantee with Worcester Greenstar system filter`;
    return `${years} guarantee`;
  }
  if(make==='Vaillant'){
    if(w.filterRule==='vaillant') return `${years} guarantee with Vaillant Boiler Protection Kit`;
    return `${years} guarantee`;
  }
  if(make==='Glow-worm'){
    if(w.filterRule==='glowworm') return `${years} guarantee with Glow-worm Power System Filter`;
    return `${years} guarantee`;
  }
  if(make==='Ideal'){
    if(/MAX Accredited Installer/i.test(w.label||'')) return `${years} parts & labour warranty — MAX Accredited Installer`;
    return `${years} parts & labour warranty`;
  }
  if(make==='Baxi' || make==='Baxi Main') return `${years} parts & labour warranty`;
  return `${years} warranty`;
}


function resetFreshQuote() {
  // Always start a new quote when the app is opened/reloaded.
  el('boilerType').value = 'Combi';
  refreshManufacturers();
  el('manufacturer').selectedIndex = 0;
  refreshModels();

  el('boilerModel').selectedIndex = 0;
  el('priceBasis').value = 'Standard';
  el('warranty').value = '0';
  el('labour').value = '0';
  el('materials').value = '0';
  el('thermostat').selectedIndex = 0;
  el('limescale').selectedIndex = 0;
  el('shockArrestor').value = '0';
  el('trvQty').value = '0';
  el('trvType').value = '0';
  el('powerflush').value = '0';
  el('powerflushRads').value = '8';
  el('commission').value = '0';
  document.querySelectorAll('.accSel').forEach(s => s.selectedIndex = 0);
  document.querySelectorAll('.heatCheck').forEach(c => c.checked = false);
  updateWarrantyOptions();
  refreshFilterOptions();
  if (el('filter')) el('filter').selectedIndex = 0;
  calc();
}


function setupPages(){
  const buttons=[...document.querySelectorAll('.bottom-nav button[data-page]')];
  const show=page=>{
    document.querySelectorAll('.app-page').forEach(x=>x.classList.toggle('active-page',x.id===`page-${page}`));
    buttons.forEach(x=>x.classList.toggle('active',x.dataset.page===page));
    window.scrollTo({top:0,behavior:'instant'});
  };
  buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.page)));
  document.querySelectorAll('[data-open-page]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.openPage)));
  show('home');
}

function setupRadiatorCalculator(){
  const btn=el('calcRadiator'); if(!btn) return;

  // Williams K-Rad Kompact catalogue supplied by ACF. Outputs are ΔT50.
  const catalogue=[
    // Type 11 Single Convector
    {type:'Type 11',code:'RK3A05',h:300,l:500,w:262,btu:892,price:18.99},{type:'Type 11',code:'RK3A08',h:300,l:800,w:366,btu:1249,price:29.99},{type:'Type 11',code:'RK3A10',h:300,l:1000,w:523,btu:1784,price:39.99},{type:'Type 11',code:'RK3A14',h:300,l:1400,w:732,btu:2498,price:59.99},{type:'Type 11',code:'RK3A20',h:300,l:2000,w:1046,btu:3569,price:89.99},
    {type:'Type 11',code:'RK4A04',h:400,l:400,w:270,btu:921,price:19.99},{type:'Type 11',code:'RK4A05',h:400,l:500,w:337,btu:1151,price:22.99},{type:'Type 11',code:'RK4A06',h:400,l:600,w:405,btu:1381,price:25.99},{type:'Type 11',code:'RK4A07',h:400,l:700,w:472,btu:1611,price:29.99},{type:'Type 11',code:'RK4A08',h:400,l:800,w:540,btu:1842,price:32.99},{type:'Type 11',code:'RK4A09',h:400,l:900,w:607,btu:2072,price:39.99},{type:'Type 11',code:'RK4A10',h:400,l:1000,w:675,btu:2302,price:44.99},{type:'Type 11',code:'RK4A11',h:400,l:1100,w:742,btu:2532,price:45.99},{type:'Type 11',code:'RK4A12',h:400,l:1200,w:810,btu:2762,price:49.99},{type:'Type 11',code:'RK4A14',h:400,l:1400,w:945,btu:3223,price:55.99},{type:'Type 11',code:'RK4A16',h:400,l:1600,w:1079,btu:3683,price:79.99},{type:'Type 11',code:'RK4A18',h:400,l:1800,w:1214,btu:4144,price:89.99},{type:'Type 11',code:'RK4A20',h:400,l:2000,w:1349,btu:4604,price:99.99},
    {type:'Type 11',code:'RK5A04',h:500,l:400,w:326,btu:1114,price:19.99},{type:'Type 11',code:'RK5A05',h:500,l:500,w:408,btu:1392,price:24.99},{type:'Type 11',code:'RK5A06',h:500,l:600,w:490,btu:1670,price:29.99},{type:'Type 11',code:'RK5A07',h:500,l:700,w:571,btu:1949,price:34.99},{type:'Type 11',code:'RK5A08',h:500,l:800,w:653,btu:2227,price:39.99},{type:'Type 11',code:'RK5A09',h:500,l:900,w:734,btu:2505,price:41.99},{type:'Type 11',code:'RK5A10',h:500,l:1000,w:816,btu:2784,price:44.99},{type:'Type 11',code:'RK5A11',h:500,l:1100,w:897,btu:3062,price:53.99},{type:'Type 11',code:'RK5A12',h:500,l:1200,w:979,btu:3341,price:55.99},{type:'Type 11',code:'RK5A13',h:500,l:1300,w:1061,btu:3619,price:69.99},{type:'Type 11',code:'RK5A14',h:500,l:1400,w:1142,btu:3897,price:74.99},{type:'Type 11',code:'RK5A15',h:500,l:1500,w:1224,btu:4176,price:89.99},{type:'Type 11',code:'RK5A16',h:500,l:1600,w:1305,btu:4454,price:79.99},{type:'Type 11',code:'RK5A18',h:500,l:1800,w:1469,btu:5011,price:84.99},{type:'Type 11',code:'RK5A20',h:500,l:2000,w:1632,btu:5568,price:99.99},
    {type:'Type 11',code:'RK6A04',h:600,l:400,w:380,btu:1296,price:19.99},{type:'Type 11',code:'RK6A05',h:600,l:500,w:475,btu:1620,price:24.99},{type:'Type 11',code:'RK6A06',h:600,l:600,w:570,btu:1944,price:25.99},{type:'Type 11',code:'RK6A07',h:600,l:700,w:665,btu:2268,price:39.99},{type:'Type 11',code:'RK6A08',h:600,l:800,w:760,btu:2592,price:39.99},{type:'Type 11',code:'RK6A09',h:600,l:900,w:855,btu:2917,price:45.99},{type:'Type 11',code:'RK6A10',h:600,l:1000,w:950,btu:3241,price:39.99},{type:'Type 11',code:'RK6A11',h:600,l:1100,w:1045,btu:3565,price:59.99},{type:'Type 11',code:'RK6A12',h:600,l:1200,w:1140,btu:3889,price:49.99},{type:'Type 11',code:'RK6A13',h:600,l:1300,w:1235,btu:4213,price:69.99},{type:'Type 11',code:'RK6A14',h:600,l:1400,w:1330,btu:4537,price:72.99},{type:'Type 11',code:'RK6A15',h:600,l:1500,w:1425,btu:4861,price:89.99},{type:'Type 11',code:'RK6A16',h:600,l:1600,w:1520,btu:5185,price:79.99},{type:'Type 11',code:'RK6A18',h:600,l:1800,w:1710,btu:5833,price:109.99},{type:'Type 11',code:'RK6A20',h:600,l:2000,w:1900,btu:6481,price:119.99},{type:'Type 11',code:'RK6A22',h:600,l:2200,w:2089,btu:7129,price:149.99},{type:'Type 11',code:'RK6A24',h:600,l:2400,w:2280,btu:7778,price:159.99},
    {type:'Type 11',code:'RK7A04',h:750,l:400,w:430,btu:1468,price:34.99},{type:'Type 11',code:'RK7A05',h:750,l:500,w:538,btu:1834,price:39.99},{type:'Type 11',code:'RK7A06',h:750,l:600,w:645,btu:2201,price:42.99},{type:'Type 11',code:'RK7A08',h:750,l:800,w:860,btu:2935,price:54.99},{type:'Type 11',code:'RK7A10',h:750,l:1000,w:1075,btu:3669,price:59.99},{type:'Type 11',code:'RK7A12',h:750,l:1200,w:1290,btu:4403,price:74.99},{type:'Type 11',code:'RK7A16',h:750,l:1600,w:1720,btu:5870,price:129.99},

    // Type 21 Slimline Double
    {type:'Type 21',code:'RK4006',h:400,l:600,w:619,btu:2111,price:39.99},{type:'Type 21',code:'RK4007',h:400,l:700,w:722,btu:2463,price:44.99},{type:'Type 21',code:'RK4008',h:400,l:800,w:825,btu:2815,price:52.99},{type:'Type 21',code:'RK4009',h:400,l:900,w:928,btu:3167,price:59.99},{type:'Type 21',code:'RK4010',h:400,l:1000,w:1031,btu:3519,price:69.99},{type:'Type 21',code:'RK4011',h:400,l:1100,w:1134,btu:3871,price:64.99},{type:'Type 21',code:'RK4012',h:400,l:1200,w:1238,btu:4223,price:69.99},{type:'Type 21',code:'RK4014',h:400,l:1400,w:1444,btu:4927,price:99.99},
    {type:'Type 21',code:'RK5004',h:500,l:400,w:493,btu:1682,price:33.99},{type:'Type 21',code:'RK5005',h:500,l:500,w:616,btu:2102,price:35.99},{type:'Type 21',code:'RK5006',h:500,l:600,w:739,btu:2523,price:41.99},{type:'Type 21',code:'RK5007',h:500,l:700,w:863,btu:2943,price:49.99},{type:'Type 21',code:'RK5008',h:500,l:800,w:986,btu:3363,price:54.99},{type:'Type 21',code:'RK5009',h:500,l:900,w:1109,btu:3784,price:59.99},{type:'Type 21',code:'RK5010',h:500,l:1000,w:1232,btu:4204,price:69.99},{type:'Type 21',code:'RK5011',h:500,l:1100,w:1355,btu:4625,price:72.99},{type:'Type 21',code:'RK5012',h:500,l:1200,w:1479,btu:5045,price:79.99},{type:'Type 21',code:'RK5014',h:500,l:1400,w:1725,btu:5886,price:94.99},{type:'Type 21',code:'RK5016',h:500,l:1600,w:1972,btu:6727,price:109.99},{type:'Type 21',code:'RK5018',h:500,l:1800,w:2218,btu:7568,price:159.99},{type:'Type 21',code:'RK5020',h:500,l:2000,w:2464,btu:8408,price:199.99},
    {type:'Type 21',code:'RK6004',h:600,l:400,w:566,btu:1932,price:35.99},{type:'Type 21',code:'RK6005',h:600,l:500,w:708,btu:2414,price:34.99},{type:'Type 21',code:'RK6006',h:600,l:600,w:849,btu:2897,price:39.99},{type:'Type 21',code:'RK6007',h:600,l:700,w:991,btu:3380,price:54.99},{type:'Type 21',code:'RK6008',h:600,l:800,w:1132,btu:3863,price:44.99},{type:'Type 21',code:'RK6009',h:600,l:900,w:1274,btu:4346,price:59.99},{type:'Type 21',code:'RK6010',h:600,l:1000,w:1415,btu:4829,price:49.99},{type:'Type 21',code:'RK6011',h:600,l:1100,w:1557,btu:5312,price:79.99},{type:'Type 21',code:'RK6012',h:600,l:1200,w:1698,btu:5795,price:69.99},{type:'Type 21',code:'RK6014',h:600,l:1400,w:1981,btu:6760,price:99.99},{type:'Type 21',code:'RK6016',h:600,l:1600,w:2264,btu:7726,price:129.99},{type:'Type 21',code:'RK6018',h:600,l:1800,w:2547,btu:8692,price:139.99},{type:'Type 21',code:'RK6020',h:600,l:2000,w:2830,btu:9658,price:149.99},
    {type:'Type 21',code:'RK7004',h:750,l:400,w:650,btu:2216,price:47.99},{type:'Type 21',code:'RK7005',h:750,l:500,w:812,btu:2771,price:59.99},{type:'Type 21',code:'RK7006',h:750,l:600,w:974,btu:3325,price:64.99},{type:'Type 21',code:'RK7007',h:750,l:700,w:1137,btu:3879,price:69.99},{type:'Type 21',code:'RK7008',h:750,l:800,w:1299,btu:4433,price:74.99},{type:'Type 21',code:'RK7009',h:750,l:900,w:1462,btu:4987,price:124.99},{type:'Type 21',code:'RK7010',h:750,l:1000,w:1624,btu:5541,price:99.99},

    // Type 22 Double Convector
    {type:'Type 22',code:'RK3B08',h:300,l:800,w:839,btu:2864,price:49.99},{type:'Type 22',code:'RK3B10',h:300,l:1000,w:1049,btu:3580,price:59.99},{type:'Type 22',code:'RK3B14',h:300,l:1400,w:1469,btu:5012,price:79.99},{type:'Type 22',code:'RK3B20',h:300,l:2000,w:2098,btu:7159,price:119.99},
    {type:'Type 22',code:'RK4B04',h:400,l:400,w:533,btu:1819,price:39.99},{type:'Type 22',code:'RK4B05',h:400,l:500,w:666,btu:2273,price:44.99},{type:'Type 22',code:'RK4B06',h:400,l:600,w:800,btu:2728,price:49.99},{type:'Type 22',code:'RK4B07',h:400,l:700,w:933,btu:3183,price:54.99},{type:'Type 22',code:'RK4B08',h:400,l:800,w:1066,btu:3637,price:59.99},{type:'Type 22',code:'RK4B09',h:400,l:900,w:1199,btu:4092,price:69.99},{type:'Type 22',code:'RK4B10',h:400,l:1000,w:1333,btu:4547,price:74.99},{type:'Type 22',code:'RK4B11',h:400,l:1100,w:1466,btu:5002,price:79.99},{type:'Type 22',code:'RK4B12',h:400,l:1200,w:1599,btu:5456,price:84.99},{type:'Type 22',code:'RK4B14',h:400,l:1400,w:1866,btu:6366,price:119.99},{type:'Type 22',code:'RK4B16',h:400,l:1600,w:2132,btu:7275,price:129.99},{type:'Type 22',code:'RK4B18',h:400,l:1800,w:2399,btu:8184,price:149.99},{type:'Type 22',code:'RK4B20',h:400,l:2000,w:2665,btu:9094,price:189.99},
    {type:'Type 22',code:'RK5B04',h:500,l:400,w:638,btu:2176,price:37.99},{type:'Type 22',code:'RK5B05',h:500,l:500,w:797,btu:2720,price:42.99},{type:'Type 22',code:'RK5B06',h:500,l:600,w:956,btu:3263,price:48.99},{type:'Type 22',code:'RK5B07',h:500,l:700,w:1116,btu:3807,price:56.99},{type:'Type 22',code:'RK5B08',h:500,l:800,w:1275,btu:4351,price:65.99},{type:'Type 22',code:'RK5B09',h:500,l:900,w:1435,btu:4895,price:72.99},{type:'Type 22',code:'RK5B10',h:500,l:1000,w:1594,btu:5439,price:79.99},{type:'Type 22',code:'RK5B11',h:500,l:1100,w:1754,btu:5983,price:89.99},{type:'Type 22',code:'RK5B12',h:500,l:1200,w:1913,btu:6527,price:109.99},{type:'Type 22',code:'RK5B13',h:500,l:1300,w:2072,btu:7071,price:119.99},{type:'Type 22',code:'RK5B14',h:500,l:1400,w:2232,btu:7615,price:124.99},{type:'Type 22',code:'RK5B15',h:500,l:1500,w:2391,btu:8159,price:139.99},{type:'Type 22',code:'RK5B16',h:500,l:1600,w:2551,btu:8703,price:139.99},{type:'Type 22',code:'RK5B18',h:500,l:1800,w:2869,btu:9790,price:164.99},{type:'Type 22',code:'RK5B20',h:500,l:2000,w:3188,btu:10878,price:199.99},
    {type:'Type 22',code:'RK6B04',h:600,l:400,w:734,btu:2504,price:39.99},{type:'Type 22',code:'RK6B05',h:600,l:500,w:917,btu:3130,price:45.99},{type:'Type 22',code:'RK6B06',h:600,l:600,w:1101,btu:3756,price:37.99},{type:'Type 22',code:'RK6B07',h:600,l:700,w:1284,btu:4382,price:65.99},{type:'Type 22',code:'RK6B08',h:600,l:800,w:1468,btu:5008,price:49.99},{type:'Type 22',code:'RK6B09',h:600,l:900,w:1651,btu:5634,price:69.99},{type:'Type 22',code:'RK6B10',h:600,l:1000,w:1835,btu:6260,price:59.99},{type:'Type 22',code:'RK6B11',h:600,l:1100,w:2018,btu:6886,price:84.99},{type:'Type 22',code:'RK6B12',h:600,l:1200,w:2202,btu:7512,price:69.99},{type:'Type 22',code:'RK6B13',h:600,l:1300,w:2385,btu:8138,price:149.99},{type:'Type 22',code:'RK6B14',h:600,l:1400,w:2569,btu:8764,price:139.99},{type:'Type 22',code:'RK6B15',h:600,l:1500,w:2752,btu:9390,price:159.99},{type:'Type 22',code:'RK6B16',h:600,l:1600,w:2935,btu:10016,price:149.99},{type:'Type 22',code:'RK6B18',h:600,l:1800,w:3302,btu:11268,price:169.99},{type:'Type 22',code:'RK6B20',h:600,l:2000,w:3669,btu:12520,price:199.99},{type:'Type 22',code:'RK6B22',h:600,l:2200,w:4036,btu:13772,price:259.99},{type:'Type 22',code:'RK6B24',h:600,l:2400,w:4404,btu:15240,price:299.99},
    {type:'Type 22',code:'RK7B04',h:750,l:400,w:830,btu:2832,price:51.99},{type:'Type 22',code:'RK7B05',h:750,l:500,w:1038,btu:3540,price:69.99},{type:'Type 22',code:'RK7B06',h:750,l:600,w:1245,btu:4248,price:79.99},{type:'Type 22',code:'RK7B07',h:750,l:700,w:1453,btu:4957,price:89.99},{type:'Type 22',code:'RK7B08',h:750,l:800,w:1660,btu:5665,price:99.99},{type:'Type 22',code:'RK7B09',h:750,l:900,w:1868,btu:6373,price:109.99},{type:'Type 22',code:'RK7B10',h:750,l:1000,w:2075,btu:7081,price:119.99},{type:'Type 22',code:'RK7B11',h:750,l:1100,w:2283,btu:7789,price:129.99},{type:'Type 22',code:'RK7B12',h:750,l:1200,w:2490,btu:8497,price:139.99},{type:'Type 22',code:'RK7B14',h:750,l:1400,w:2905,btu:9913,price:189.99},{type:'Type 22',code:'RK7B16',h:750,l:1600,w:3320,btu:11329,price:199.99},

    // Type 33 Triple
    {type:'Type 33',code:'RK4T08',h:400,l:800,w:1453,btu:4957,price:134.99},{type:'Type 33',code:'RK4T10',h:400,l:1000,w:1816,btu:6196,price:164.99},{type:'Type 33',code:'RK4T12',h:400,l:1200,w:2179,btu:7435,price:199.99},{type:'Type 33',code:'RK4T14',h:400,l:1400,w:2542,btu:8675,price:234.99},
    {type:'Type 33',code:'RK5T08',h:500,l:800,w:1741,btu:5940,price:149.99},{type:'Type 33',code:'RK5T10',h:500,l:1000,w:2176,btu:7425,price:189.99},{type:'Type 33',code:'RK5T12',h:500,l:1200,w:2611,btu:8909,price:224.99},{type:'Type 33',code:'RK5T14',h:500,l:1400,w:3046,btu:10394,price:264.99},{type:'Type 33',code:'RK5T16',h:500,l:1600,w:3482,btu:11879,price:299.99},
    {type:'Type 33',code:'RK6T04',h:600,l:400,w:1006,btu:3431,price:84.99},{type:'Type 33',code:'RK6T05',h:600,l:500,w:1257,btu:4289,price:109.99},{type:'Type 33',code:'RK6T06',h:600,l:600,w:1508,btu:5147,price:119.99},{type:'Type 33',code:'RK6T07',h:600,l:700,w:1760,btu:6005,price:154.99},{type:'Type 33',code:'RK6T08',h:600,l:800,w:2011,btu:6862,price:149.99},{type:'Type 33',code:'RK6T09',h:600,l:900,w:2263,btu:7720,price:199.99},{type:'Type 33',code:'RK6T10',h:600,l:1000,w:2514,btu:8578,price:169.99},{type:'Type 33',code:'RK6T11',h:600,l:1100,w:2765,btu:9436,price:244.99},{type:'Type 33',code:'RK6T12',h:600,l:1200,w:3017,btu:10293,price:199.99},{type:'Type 33',code:'RK6T14',h:600,l:1400,w:3520,btu:12009,price:259.99},{type:'Type 33',code:'RK6T16',h:600,l:1600,w:4022,btu:13724,price:299.99},{type:'Type 33',code:'RK6T18',h:600,l:1800,w:4525,btu:15440,price:349.99},{type:'Type 33',code:'RK6T20',h:600,l:2000,w:5028,btu:17156,price:389.99},
    {type:'Type 33',code:'RK7T08',h:700,l:800,w:2387,btu:8145,price:199.99},{type:'Type 33',code:'RK7T10',h:700,l:1000,w:2984,btu:10181,price:249.99},{type:'Type 33',code:'RK7T12',h:700,l:1200,w:3581,btu:12218,price:299.99},{type:'Type 33',code:'RK7T14',h:700,l:1400,w:4178,btu:14254,price:349.99}
  ];

  const typePenalty={'Type 22':0,'Type 21':60,'Type 11':180,'Type 33':220};
  const score=(r,required)=>(r.w-required)+(typePenalty[r.type]||0)+(r.l>1600?120:0);
  const radiatorQuote=[];

  const renderRadiatorQuote=()=>{
    const items=el('radQuoteItems'), empty=el('radQuoteEmpty'), totals=el('radQuoteTotals');
    if(!items||!empty||!totals) return;
    if(!radiatorQuote.length){
      items.innerHTML=''; empty.style.display='block'; totals.style.display='none'; return;
    }
    empty.style.display='none'; totals.style.display='block';
    items.innerHTML=radiatorQuote.map((x,i)=>`<div class="rad-quote-item"><div class="rad-quote-line"><div><strong>${x.room}</strong><div class="rad-quote-meta">${x.type} · ${x.h} × ${x.l} mm · ${x.code} · ${x.w.toLocaleString()} W</div></div><strong>${gbp(x.price)} + VAT</strong></div><button type="button" class="rad-remove" data-remove-rad="${i}">Remove</button></div>`).join('');
    const ex=radiatorQuote.reduce((t,x)=>t+Number(x.price||0),0);
    el('radQuoteExVat').textContent=gbp(ex);
    el('radQuoteVat').textContent=gbp(ex*0.2);
    el('radQuoteIncVat').textContent=gbp(ex*1.2);
    items.querySelectorAll('[data-remove-rad]').forEach(b=>b.onclick=()=>{radiatorQuote.splice(Number(b.dataset.removeRad),1);renderRadiatorQuote();});
  };

  if(el('clearRadQuote')) el('clearRadQuote').onclick=()=>{radiatorQuote.length=0;renderRadiatorQuote();};
  el('radResult').addEventListener('click',e=>{
    const b=e.target.closest('[data-add-rad]'); if(!b) return;
    const r=catalogue.find(x=>x.code===b.dataset.addRad); if(!r) return;
    const room=(el('radRoomName').value||el('radRoom').options[el('radRoom').selectedIndex]?.text||'Room').trim();
    radiatorQuote.push({...r,room});
    renderRadiatorQuote();
    b.textContent='Added ✓'; setTimeout(()=>b.textContent='Add to quote',900);
  });

  btn.onclick=()=>{
    const L=Number(el('radLength').value), W=Number(el('radWidth').value), H=Number(el('radHeight').value);
    if(!L||!W||!H){ el('radResult').innerHTML='<strong>Please enter the room length, width and height.</strong>'; return; }
    const target=Number(el('radRoom').value), walls=Number(el('radWalls').value), windows=Number(el('radWindows').value), insulation=Number(el('radInsulation').value);
    const volume=L*W*H;
    const watts=Math.ceil((volume*2.1*(target+3)*walls*windows*insulation)/50)*50;
    const btu=Math.ceil(watts*3.412/50)*50;
    const suitable=catalogue.filter(r=>r.w>=watts).sort((a,b)=>score(a,watts)-score(b,watts) || a.price-b.price).slice(0,3);
    const best=suitable[0];
    const result=suitable.length ? suitable.map((r,i)=>`<div class="rad-option"><div class="rad-option-copy"><strong>${i===0?'Recommended: ':''}${r.type} · ${r.h} × ${r.l} mm</strong><br><small>${r.code} · ${r.w.toLocaleString()} W · ${r.btu.toLocaleString()} BTU/h</small><br><button type="button" class="rad-select" data-add-rad="${r.code}">Add to quote</button></div><div class="rad-option-price">${gbp(r.price)} + VAT</div></div>`).join('') : '<p>Requirement is above the largest single radiator in the catalogue. Use multiple radiators or split the load.</p>';
    el('radResult').innerHTML=`<div>Estimated heat requirement</div><div class="heat-number">${watts.toLocaleString()} W</div><strong>${btu.toLocaleString()} BTU/h</strong><div style="margin-top:12px;font-weight:800">Williams K-Rad options</div>${result}${best?`<p class="hint">Recommended radiator exceeds the estimated requirement by ${(best.w-watts).toLocaleString()} W. Prices shown are ex VAT.</p>`:''}`;
  };
}

function init() {
  buildAccessories();
  buildHeat();
  makeSelectOptions();
  fill(el('trvQty'), Array.from({length:21},(_,i)=>i), x=>({text:x===0?'None':String(x),value:x}));
  fill(el('powerflushRads'), Array.from({length:21},(_,i)=>i+1), x=>({text:String(x),value:x}));
  el('powerflushRads').value='8';
  refreshModels();
  resetFreshQuote();

  el('boilerType').onchange=()=>{ refreshManufacturers(); refreshModels(); };
  el('manufacturer').onchange=refreshModels;
  el('boilerModel').onchange=()=>{ refreshAccessories(); updateWarrantyOptions(); calc(); };
  el('priceBasis').onchange=calc;
  el('warranty').onchange=()=>{ updateWarrantyRule(); refreshFilterOptions(); calc(); };
  ['labour','materials','thermostat','limescale','shockArrestor','filter','trvQty','trvType','powerflush','powerflushRads','commission'].forEach(id=>el(id).onchange=calc);

  el('copyQuote').onclick=async()=>{
    const b=currentBoiler(); if(!b) return;
    const w=selectedWarranty();
    const exVatValue=Number(String(el('exvat').textContent).replace(/[^0-9.]/g,''));
    const text=`${quoteModelName(b)} ${gbpQuote(exVatValue)} + VAT (${warrantyQuoteText(b,w)})`;
    try{ await navigator.clipboard.writeText(text); el('copyQuote').textContent='Copied'; setTimeout(()=>el('copyQuote').textContent='Copy quote line',1200); }catch(e){}
  };
  calc();
  setupPages();
  setupRadiatorCalculator();
}

init();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
