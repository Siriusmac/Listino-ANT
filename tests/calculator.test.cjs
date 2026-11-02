const test = require('node:test');
const assert = require('node:assert/strict');
const { calculate } = require('../calculator.js');
const empty = { verified: false, sources: [], products: [], transport: {} };
// Valori esclusivamente sintetici per testare l'aritmetica, NON prezzi ANT.
const fixture = {
  verified: true,
  products: [
    { power: 100, line: 'Lite', base: 100000, meter: 12345, IP54: 100, IP65: 200 },
    { power: 150, line: 'Industry', base: 200000, meter: 12345, IP54: 20000, IP65: 30000 },
    { power: 150, line: 'PRO', base: 300000, meter: false, IP54: 40000, IP65: 50000 },
    { power: 1000, line: 'Industry', base: 400000, meter: false, IP54: 60000, IP65: 70000 },
    { power: 4000, line: 'Industry', base: 500000, meter: null, IP54: 80000, IP65: 90000 }
  ], transport: { 100: 10000, 150: 20000, 1000: 30000, 4000: 99999 }
};
const config = { power: 150, pro: false, meter: false, cabinet: 'IP21', years: 1 };
test('nessun listino: totale nullo, mai preventivo a zero', () => {
  const r = calculate(config, empty);
  assert.equal(r.total, null); assert.equal(r.subtotal, 0); assert.equal(r.missing.length, 2);
});
test('cloud da uno a cinque anni, incremento 1500 euro', () => {
  for (let years = 1; years <= 5; years++) {
    const r = calculate({ ...config, years }, fixture);
    assert.equal(r.total, 220000 + (years - 1) * 150000);
  }
});
test('meter e cabinet vengono sommati esattamente in centesimi', () => {
  assert.equal(calculate({ ...config, meter: true, cabinet: 'IP54', years: 3 }, fixture).total, 552345);
});
test('PRO disabilitato sotto 150 kVA, abilitato alla soglia', () => {
  for (const power of [15, 100, 149]) assert.equal(calculate({ ...config, power, pro: true }, fixture).pro, false);
  assert.equal(calculate({ ...config, pro: true }, fixture).pro, true);
});
test('PRO sostituisce il prezzo e non somma il meter', () => {
  const r = calculate({ ...config, pro: true, meter: true }, fixture);
  assert.equal(r.line, 'PRO'); assert.equal(r.total, 320000); assert.equal(r.meter, false); assert.equal(r.meterAvailable, false);
});
test('meter non disponibile o sconosciuto rimane spento', () => {
  for (const power of [1000, 4000]) {
    const r = calculate({ ...config, power, meter: true }, fixture);
    assert.equal(r.meter, false); assert.equal(r.meterAvailable, false);
  }
});
test('cabinet Lite non quotati anche se ricevessero un valore errato', () => {
  for (const cabinet of ['IP54', 'IP65']) {
    const r = calculate({ ...config, power: 100, cabinet }, fixture);
    assert.equal(r.total, null); assert.ok(r.missing.includes('Cabinet ' + cabinet));
  }
});
test('trasporto quotato a 1000, da quotare oltre 1000 anche se presente un dato', () => {
  assert.equal(calculate({ ...config, power: 1000 }, fixture).total, 430000);
  for (const power of [1001, 4000]) {
    const r = calculate({ ...config, power }, fixture);
    assert.equal(r.total, null); assert.ok(r.missing.includes('Trasporto'));
  }
});
test('taglio non presente nel catalogo non può produrre un totale', () => {
  assert.equal(calculate({ ...config, power: 151 }, fixture).total, null);
});
test('catalogo non verificato non viene usato per prezzi e disponibilità', () => {
  const r = calculate({ ...config, meter: true }, { ...fixture, verified: false });
  assert.equal(r.total, null); assert.equal(r.meterAvailable, false); assert.equal(r.subtotal, 0);
});
test('prezzi non validi diventano costi da quotare', () => {
  for (const base of [-1, NaN, Infinity, '123', 1.1]) {
    const bad = { ...fixture, products: [{ ...fixture.products[1], base }] };
    assert.equal(calculate(config, bad).total, null);
  }
});
test('prezzo esplicitamente zero è noto, prezzo null è sconosciuto', () => {
  assert.equal(calculate(config, { verified: true, products: [{ power: 150, line: 'Industry', base: 0 }], transport: { 150: 0 } }).total, 0);
});
test('rifiuta potenze, cabinet e durate fuori specifica', () => {
  for (const power of [NaN, 0, 14, 4001, 15.5]) assert.throws(() => calculate({ ...config, power }, fixture), RangeError);
  for (const years of [0, 6, 1.5, '2']) assert.throws(() => calculate({ ...config, years }, fixture), RangeError);
  assert.throws(() => calculate({ ...config, cabinet: 'IP99' }, fixture), RangeError);
});
const live = require('../catalogue.js');
test('catalogo reale: tutti e soli i 25 tagli dei PDF, senza duplicati per linea', () => {
  assert.equal(live.verified, true);
  assert.deepEqual([...new Set(live.products.map(p => p.power))].sort((a,b) => a-b),
    [15,22,30,45,60,75,100,120,150,200,300,400,500,600,700,800,1000,1200,1500,1700,2000,2500,3000,3500,4000]);
  assert.equal(live.products.length, 42);
  assert.equal(new Set(live.products.map(p => `${p.line}:${p.power}`)).size, 42);
  assert.equal(live.products.filter(p => p.line === 'PRO').length, 17);
});
test('catalogo reale: Lite 15 kVA totale 9700 euro e meter non disponibile', () => {
  const r = calculate({ ...config, power:15, meter:true }, live);
  assert.equal(r.total,970000); assert.equal(r.meter,false);
});
test('catalogo reale: Industry 150 kVA con meter, IP54 e cloud 5 anni', () => {
  assert.equal(calculate({...config,meter:true,cabinet:'IP54',years:5},live).total,5398000);
});
test('catalogo reale: PRO 150 kVA con IP65 e cloud 5 anni', () => {
  const r = calculate({...config,pro:true,meter:true,cabinet:'IP65',years:5},live);
  assert.equal(r.total,6130000); assert.equal(r.meter,false);
});
test('catalogo reale: tagli superiori a 1000 mantengono il trasporto ignoto', () => {
  for (const power of [1200,1500,1700,2000,2500,3000,3500,4000]) {
    const r = calculate({...config,power},live);
    assert.equal(r.total,null); assert.deepEqual(r.missing,['Trasporto']);
  }
});
