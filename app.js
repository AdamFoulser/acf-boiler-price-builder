const D = window.ACF_DATA;
const gbp = n => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(Number(n || 0));
const el = id => document.getElementById(id);
const val = id => el(id).value;
const manufacturers = [...new Set(D.boilers.map(x => x.manufacturer))];
const PRICE_CHECKED = '28 Aug 2026';

const cityOffers = [
  {
    manufacturer:'Worcester Bosch', model:'Worcester 4000 30kW Combi NG', supplier:'City Plumbing',
    priceExVat:1247.00, note:'Public boiler-only price', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/worcester-bosch-greenstar-4000-combi-boiler-white-30-kw-7733600373/p/550559'
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 4000 25kW Combi NG', supplier:'City Plumbing',
    priceExVat:1107.00, note:'Public boiler-only price', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/worcester-bosch-greenstar-4000-combi-boiler-white-25-kw/p/550572'
  },
  {
    manufacturer:'Worcester Bosch', model:'Worcester 1000 30kW Combi NG', supplier:'City Plumbing',
    priceExVat:670.00, note:'Public boiler-only price', checked:PRICE_CHECKED,
    url:'https://www.cityplumbing.co.uk/p/worcester-bosch-greenstar-1000-30kw-combi-7736902179/p/668700'
  }
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

function supplierOffers(b) {
  const offers = [{
    supplier:'Williams', priceExVat:williamsPrice(b), note:`Pricebusters ${val('priceBasis')} price`, checked:'Issue 179 physical catalogue', url:''
  }];
  cityOffers.filter(x => x.manufacturer === b.manufacturer && x.model === b.model).forEach(x => offers.push(x));
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

  el('supplierPrices').innerHTML = offers.map(o => {
    const isCheapest = o.supplier === cheapest.supplier && offers.length > 1;
    const isHighest = o.supplier === highest.supplier && offers.length > 1;
    const link = o.url ? `<a class="supplier-link" href="${o.url}" target="_blank" rel="noopener">View public price</a>` : '';
    return `<div class="supplier-price ${isCheapest?'cheapest':''}">`+
      `<div><div class="supplier-name">${o.supplier}`+
      `${isCheapest?'<span class="badge">Cheapest</span>':''}`+
      `${isHighest?'<span class="badge high">Highest quote basis</span>':''}</div>`+
      `<div class="supplier-note">${o.note} · checked ${o.checked}</div>${link}</div>`+
      `<strong>${gbp(o.priceExVat)}</strong></div>`;
  }).join('');
}

function refreshModels() {
  const brand = val('manufacturer');
  const models = D.boilers.filter(x => x.manufacturer === brand);
  fill(el('boilerModel'), models, x => ({text:x.model, value:x.model}));
  refreshAccessories();
  refreshSuppliers();
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
  fill(el('manufacturer'), manufacturers);
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

function calc() {
  const b = currentBoiler();
  if (!b) return;
  const quoteOffer = offerBySupplier(b, val('quoteSupplier'));
  const buyOffer = offerBySupplier(b, val('buySupplier'));
  const boilerPrice = Number(quoteOffer.priceExVat || 0);
  const purchasePrice = Number(buyOffer.priceExVat || 0);
  const purchaseMargin = boilerPrice - purchasePrice;

  el('boilerMeta').innerHTML =
    `<b>${b.type}</b>${b.output ? ' · '+b.output+'kW' : ''}<br>` +
    `Part code: ${b.partCode || '—'}<br>` +
    `Williams ${val('priceBasis')} price: <b>${gbp(williamsPrice(b))}</b>`;

  const isHeatOnly = String(b.type || '').toLowerCase().includes('heat');
  el('heatOnlyCard').style.display = isHeatOnly ? 'block' : 'none';

  let accessoriesTotal = 0;
  const priceEls = document.querySelectorAll('.accPrice');
  document.querySelectorAll('.accSel').forEach((s,i) => {
    const a = D.accessories.find(x => x.manufacturer === b.manufacturer && x.description === s.value);
    const p = a ? Number(a.price || 0) : 0;
    accessoriesTotal += p;
    priceEls[i].textContent = gbp(p);
  });

  const thermostat = Number(D.settings.thermostats.find(x => x.name === val('thermostat'))?.price || 0);
  const limescale = Number(D.settings.limescaleReducers.find(x => x.name === val('limescale'))?.price || 0);
  const filter = Number(D.settings.magneticFilters.find(x => x.name === val('filter'))?.price || 0);

  let heatExtras = 0;
  if (isHeatOnly) document.querySelectorAll('.heatCheck:checked').forEach(x => heatExtras += Number(x.dataset.price || 0));

  const extras = Number(val('labour')) + Number(val('materials')) + thermostat + limescale + filter + heatExtras;
  const subtotal = boilerPrice + accessoriesTotal + extras;
  const commission = subtotal * Number(val('commission'));
  const rawExVat = subtotal + commission;
  const roundTo = Number(D.settings.roundUpTo || 5);
  const exVat = Math.ceil(rawExVat / roundTo) * roundTo;
  const vat = exVat * Number(D.settings.vat || 0.2);
  const incVat = exVat + vat;

  el('purchaseMargin').textContent = gbp(purchaseMargin);
  el('sumBoiler').textContent = gbp(boilerPrice);
  el('sumPurchase').textContent = gbp(purchasePrice);
  el('sumMargin').textContent = gbp(purchaseMargin);
  el('sumAccessories').textContent = gbp(accessoriesTotal);
  el('sumExtras').textContent = gbp(extras);
  el('subtotal').textContent = gbp(subtotal);
  el('sumCommission').textContent = gbp(commission);
  el('exvat').textContent = gbp(exVat);
  el('vat').textContent = gbp(vat);
  el('incvat').textContent = gbp(incVat);
}

function refreshSupplierAndCalc() { refreshSuppliers(); calc(); }

function init() {
  makeSelectOptions();
  buildAccessories();
  buildHeat();
  refreshModels();

  ['labour','materials','thermostat','limescale','filter','commission','quoteSupplier','buySupplier'].forEach(id => el(id).onchange = calc);
  el('priceBasis').onchange = refreshSupplierAndCalc;
  el('manufacturer').onchange = refreshModels;
  el('boilerModel').onchange = refreshSupplierAndCalc;

  el('copyQuote').onclick = async () => {
    const b = currentBoiler();
    const text =
      `ACF Boiler Quote\n` +
      `${b?.manufacturer || ''} ${b?.model || ''}\n` +
      `Price ex VAT: ${el('exvat').textContent}\n` +
      `VAT: ${el('vat').textContent}\n` +
      `Total inc VAT: ${el('incvat').textContent}`;
    try {
      await navigator.clipboard.writeText(text);
      el('copyQuote').textContent = 'Copied ✓';
      setTimeout(() => el('copyQuote').textContent = 'Copy quote summary', 1200);
    } catch { alert(text); }
  };
}

init();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
