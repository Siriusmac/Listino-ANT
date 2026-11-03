const test = require('node:test');
const assert = require('node:assert/strict');
const { parseFactor, evaluateFactor, chartLimit, factorAtIncrease } = require('../evaluation-math.js');
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
test('input italiano e internazionale: due decimali al massimo', () => {
  for (const [raw, value] of [['0,80',.8],['0.8',.8],['1',1],['1,00',1],['0',0],['.01',.01],[',5',.5],[' 0,90 ',.9]]) assert.equal(parseFactor(raw),value);
  for (const raw of ['', 'abc', '-0.2', '1.01', '0,801', '0.800', '2', '0,', '1e-1', '0.8.0']) assert.equal(parseFactor(raw),null);
});
test('riferimento unitario: nessun aumento', () => {
  assert.deepEqual(evaluateFactor(1), {factor:1,increase:0,multiplier:1});
});
test('FP 0,8: +56,25%, non il 20% o il 36%', () => {
  const result = evaluateFactor(.8); near(result.increase,56.25); near(result.multiplier,1.5625);
});
test('risultati superiori al 100% non vengono troncati', () => {
  near(evaluateFactor(.5).increase,300); near(evaluateFactor(.1).increase,9900); near(evaluateFactor(.01).increase,999900);
});
test('fattore zero: risultato non finito, senza falso 100%', () => {
  assert.equal(evaluateFactor(0).increase,null); assert.equal(evaluateFactor(0).multiplier,null);
});
test('scala automatica include sempre il risultato fino a 0,01', () => {
  for (let i=1;i<=100;i++) {
    const r=evaluateFactor(i/100), limit=chartLimit(r.increase);
    assert.ok(limit>=100); assert.ok(limit>=r.increase-1e-8);
    near(factorAtIncrease(r.increase),i/100);
  }
  assert.equal(chartLimit(56.25),100); assert.equal(chartLimit(300),500); assert.equal(chartLimit(null),100);
});
test('il modello rifiuta valori fisicamente fuori intervallo', () => {
  for (const v of [-.1,1.1,NaN,Infinity,'0.8',null]) assert.throws(()=>evaluateFactor(v),RangeError);
  assert.throws(()=>factorAtIncrease(-1),RangeError);
});
