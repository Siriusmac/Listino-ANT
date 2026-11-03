(function (root) {
  'use strict';
  function parseFactor(text) {
    const raw = String(text).trim();
    if (!/^(?:[01]|0[.,]\d{1,2}|1[.,]0{1,2}|[.,]\d{1,2})$/.test(raw)) return null;
    return Number(raw.replace(',', '.'));
  }
  function evaluateFactor(value) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
      throw new RangeError('Il fattore deve essere compreso tra 0 e 1.');
    }
    // A parità di P utile, V e R: I/I_ref = 1/f e P_loss/P_loss_ref = 1/f².
    // Per cos φ è un confronto sinusoidale: nessuna distorsione viene stimata.
    if (value === 0) return { factor: value, increase: null, multiplier: null };
    const multiplier = 1 / (value * value);
    return { factor: value, increase: Math.max(0, (multiplier - 1) * 100), multiplier };
  }
  function chartLimit(increase) {
    if (increase === null || increase <= 100) return 100;
    const magnitude = 10 ** Math.floor(Math.log10(increase));
    const scaled = increase / magnitude;
    return (scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10) * magnitude;
  }
  function factorAtIncrease(percent) {
    if (!Number.isFinite(percent) || percent < 0) throw new RangeError('Percentuale non valida.');
    return 1 / Math.sqrt(1 + percent / 100);
  }
  const api = { parseFactor, evaluateFactor, chartLimit, factorAtIncrease };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ANTEvaluation = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
