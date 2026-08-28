const D = window.ACF_DATA;
const gbp = n => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(Number(n || 0));
const el = id => document.getElementById(id);
const val = id => el(id).value;
const manufacturers = [...new Set(D.boilers.map(x => x.manufacturer))];

function fill(sel, items, map = x => ({text:x, value:x})) {
  sel.innerHTML = '';
  items.forEach(x => {
    const m = map(x);
    const o = document.createElement('option');
    o.textContent = m.text;
    o.value = m.value;
    sel.appendChild(o);
  });
}

function currentBoiler() {
  return D.boilers.find(x => x.manufacturer === val('manufacturer') && x.model === val('boilerModel'));
}

function refreshModels() {
  const brand = val('manufacturer');
  const models = D.boilers.filter(x => x.manufacturer === brand);
  fill(el('boilerModel'), models, x => ({text:x.model, value:x.model}));
  refreshAccessories();
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

  const boilerPrice = val('priceBasis') === 'Flexi-Pack' ? Number(b.flexiPrice || b.standardPrice) : Number(b.standardPrice || 0);

  el('boilerMeta').innerHTML =
    `<b>${b.type}</b>${b.output ? ' · '+b.output+'kW' : ''}<br>` +
    `Part code: ${b.partCode || '—'}<br>` +
    `Boiler cost: <b>${gbp(boilerPrice)}</b>`;

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
  if (isHeatOnly) {
    document.querySelectorAll('.heatCheck:checked').forEach(x => heatExtras += Number(x.dataset.price || 0));
  }

  const extras = Number(val('labour')) + Number(val('materials')) + thermostat + limescale + filter + heatExtras;
  const subtotal = boilerPrice + accessoriesTotal + extras;
  const commissionRate = Number(val('commission'));
  const commission = subtotal * commissionRate;
  const rawExVat = subtotal + commission;
  const exVat = Math.ceil(rawExVat / Number(D.settings.roundUpTo || 5)) * Number(D.settings.roundUpTo || 5);
  const vat = exVat * Number(D.settings.vat || 0.2);
  const incVat = exVat + vat;

  el('sumBoiler').textContent = gbp(boilerPrice);
  el('sumAccessories').textContent = gbp(accessoriesTotal);
  el('sumExtras').textContent = gbp(extras);
  el('subtotal').textContent = gbp(subtotal);
  el('sumCommission').textContent = gbp(commission);
  el('exvat').textContent = gbp(exVat);
  el('vat').textContent = gbp(vat);
  el('incvat').textContent = gbp(incVat);
}

function init() {
  makeSelectOptions();
  buildAccessories();
  buildHeat();
  refreshModels();

  ['priceBasis','labour','materials','thermostat','limescale','filter','commission'].forEach(id => el(id).onchange = calc);
  el('manufacturer').onchange = refreshModels;
  el('boilerModel').onchange = calc;

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
    } catch {
      alert(text);
    }
  };
}

init();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
