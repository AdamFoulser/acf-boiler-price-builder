const D = window.ACF_DATA;
const gbp = n => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(Number(n || 0));
const el = id => document.getElementById(id);
const val = id => el(id).value;
const manufacturers = [...new Set(D.boilers.map(x => x.manufacturer))];
const PRICE_CHECKED = '28 Aug 2026';

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

const screwfixBoilerOffers = [
  // Screwfix is shown only where the exact Williams master-list boiler has been verified.
];

function selectedSupplierItemPrice(kind, itemName, williamsPriceValue, manufacturer='') {
  const supplier = val('quoteSupplier');
  if (!itemName || itemName === 'None') return {available:true, price:0, supplier};
  if (supplier === 'Williams') return {available:true, price:Number(williamsPriceValue||0), supplier};
  const match = itemOffers.find(o => o.kind===kind && o.supplier===supplier &&
    (!o.manufacturer || o.manufacturer===manufacturer) &&
    itemName.toLowerCase().includes(o.match.toLowerCase()));
  return match ? {available:true, price:Number(match.priceExVat||0), supplier, note:match.note} :
                 {available:false, price:0, supplier};
}

function merchantOffers(kind, itemName, williamsPriceValue, manufacturer='') {
  if (!itemName || itemName === 'None') return [];
  const offers=[{supplier:'Williams',priceExVat:Number(williamsPriceValue||0),note:'Issue 179 catalogue'}];
  itemOffers.filter(o => o.kind===kind && (!o.manufacturer || o.manufacturer===manufacturer) &&
    itemName.toLowerCase().includes(o.match.toLowerCase())).forEach(o=>offers.push(o));
  return offers;
}
function bestOffer(offers) { return offers.length ? [...offers].sort((a,b)=>a.priceExVat-b.priceExVat)[0] : null; }
function comparisonText(offers) {
  if (offers.length < 2) return '';
  const best=bestOffer(offers);
  return '<div class="item-compare">'+offers.map(o=>`<span class="${o===best?'best':''}">${o.supplier}: ${gbp(o.priceExVat)}</span>`).join(' · ')+'</div>';
}

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

function supplierOffers(b) {
  const offers = [{
    supplier:'Williams', priceExVat:williamsPrice(b), note:`Pricebusters ${val('priceBasis')} price`, checked:'Issue 179 physical catalogue', url:''
  }];
  cityOffers.filter(x => x.manufacturer === b.manufacturer && x.model === b.model).forEach(x => offers.push(x));
  screwfixBoilerOffers.filter(x => x.manufacturer === b.manufacturer && x.model === b.model).forEach(x => offers.push(x));
  return offers;
}

function offerBySupplier(b, supplier) {
  return supplierOffers(b).find(x => x.supplier === supplier) || supplierOffers(b)[0];
}

function refreshSuppliers() {
  const b = currentBoiler();
  if (!b) return;
  const offers = supplierOffers(b);
  const oldQuote = el('quoteSupplier').value;
  const oldBuy = el('buySupplier').value;
  fill(el('quoteSupplier'), offers, x => ({text:`${x.supplier} — ${gbp(x.priceExVat)} ex VAT`, value:x.supplier}));
  fill(el('buySupplier'), offers, x => ({text:`${x.supplier} — ${gbp(x.priceExVat)} ex VAT`, value:x.supplier}));

  const highest = [...offers].sort((a,b) => b.priceExVat-a.priceExVat)[0];
  const cheapest = [...offers].sort((a,b) => a.priceExVat-b.priceExVat)[0];
  el('quoteSupplier').value = offers.some(x=>x.supplier===oldQuote) ? oldQuote : highest.supplier;
  el('buySupplier').value = offers.some(x=>x.supplier===oldBuy) ? oldBuy : cheapest.supplier;

  const tiles = offers.map(o => {
    const isCheapest = o.supplier === cheapest.supplier && offers.length > 1;
    const isHighest = o.supplier === highest.supplier && offers.length > 1;
    const link = o.url ? `<a class="supplier-link" href="${o.url}" target="_blank" rel="noopener">View price</a>` : '';
    return `<div class="supplier-tile ${isCheapest?'cheapest':''} ${isHighest?'highest':''}">
      <div class="supplier-name">${o.supplier}</div>
      <strong>${gbp(o.priceExVat)}</strong>
      <div class="tile-sub">ex VAT</div>
      ${isHighest?'<span class="tile-badge high">Highest quote basis</span>':''}
      ${isCheapest?'<span class="tile-badge">Cheapest</span>':''}
      ${link}
    </div>`;
  });
  tiles.push(`<div class="supplier-tile best-tile"><div class="supplier-name">Best Price</div><strong>${gbp(cheapest.priceExVat)}</strong><div class="tile-sub">${cheapest.supplier}</div></div>`);
  el('supplierPrices').innerHTML = tiles.join('');
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
  fill(el('labour'), D.settings.labourOptions, x => ({text:gbp(x), value:x}));
  fill(el('materials'), D.settings.materialsOptions, x => ({text:gbp(x), value:x}));
  fill(el('thermostat'), D.settings.thermostats, x => ({text:`${x.name}${x.price ? ' — '+gbp(x.price) : ''}`, value:x.name}));
  fill(el('limescale'), D.settings.limescaleReducers, x => ({text:`${x.name}${x.price ? ' — '+gbp(x.price) : ''}`, value:x.name}));
  fill(el('filter'), D.settings.magneticFilters, x => ({text:`${x.name}${x.price ? ' — '+gbp(x.price) : ''}`, value:x.name}));
  el('labour').value = '1200';
  el('materials').value = '100';
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

const warrantyRules = {
  "Baxi":[{label:"Manufacturer warranty",restriction:"Warranty length/rules to be populated by range"}],
  "Baxi Main":[{label:"Manufacturer warranty",restriction:"Warranty length/rules to be populated by range"}],
  "Worcester Bosch":[
    {label:"Standard warranty",restriction:"Any compatible filter"},
    {label:"Extended warranty",restriction:"Worcester-approved filter / pack required where applicable"}
  ],
  "Vaillant":[
    {label:"Standard warranty",restriction:"Any compatible filter"},
    {label:"Extended warranty",restriction:"Vaillant-approved filter / controls required where applicable"}
  ],
  "Ideal":[{label:"Manufacturer warranty",restriction:"Warranty length/rules to be populated by range"}],
  "Glow-worm":[{label:"Manufacturer warranty",restriction:"Warranty length/rules to be populated by range"}]
};

function normalizeBoilerType(t){
  const s=String(t||'').toLowerCase();
  if(s.includes('combi')) return 'Combi';
  if(s.includes('system')) return 'System';
  return 'Heat Only';
}

function updateWarrantyOptions(){
  const b=currentBoiler();
  const s=el('warranty');
  if(!b || !s) return;
  const old=s.value;
  const rules=warrantyRules[b.manufacturer] || [{label:'Manufacturer warranty',restriction:''}];
  s.innerHTML=rules.map((r,i)=>`<option value="${i}">${r.label}</option>`).join('');
  if([...s.options].some(o=>o.value===old)) s.value=old;
  updateWarrantyRule();
}
function updateWarrantyRule(){
  const b=currentBoiler(), box=el('warrantyRule');
  if(!b || !box) return;
  const rules=warrantyRules[b.manufacturer] || [];
  box.textContent=rules[Number(val('warranty')||0)]?.restriction || '';
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
    const x=D.settings.magneticFilters.find(x=>x.name===f);
    if(x) items.push({kind:'filter',manufacturer:'',name:x.name,williams:Number(x.price||0)});
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
  const filter=Number(D.settings.magneticFilters.find(x=>x.name===val('filter'))?.price||0);
  if(el('thermostatCompare')) el('thermostatCompare').textContent=val('thermostat')==='None'?'':`Williams: ${gbp(thermostat)}`;
  if(el('filterCompare')) el('filterCompare').textContent=val('filter')==='None'?'':`Williams: ${gbp(filter)}`;

  let heatExtras=0;
  if(isHeatOnly) document.querySelectorAll('.heatCheck:checked').forEach(x=>heatExtras+=Number(x.dataset.price||0));
  const extras=Number(val('labour'))+Number(val('materials'))+thermostat+limescale+filter+heatExtras;
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

function refreshSupplierAndCalc() { calc(); }

function init() {
  buildAccessories();
  buildHeat();
  makeSelectOptions();
  refreshModels();

  el('boilerType').onchange=()=>{ refreshManufacturers(); refreshModels(); };
  el('manufacturer').onchange=refreshModels;
  el('boilerModel').onchange=()=>{ refreshAccessories(); updateWarrantyOptions(); calc(); };
  el('priceBasis').onchange=calc;
  el('warranty').onchange=()=>{ updateWarrantyRule(); calc(); };
  ['labour','materials','thermostat','limescale','filter','commission'].forEach(id=>el(id).onchange=calc);

  el('copyQuote').onclick=async()=>{
    const b=currentBoiler(); if(!b) return;
    const text=`ACF Boiler Quote\n${b.model}\nCustomer price ex VAT: ${el('exvat').textContent}\nVAT: ${el('vat').textContent}\nTotal inc VAT: ${el('incvat').textContent}`;
    try{ await navigator.clipboard.writeText(text); el('copyQuote').textContent='Copied'; setTimeout(()=>el('copyQuote').textContent='Copy quote summary',1200); }catch(e){}
  };
  calc();
}

init();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
