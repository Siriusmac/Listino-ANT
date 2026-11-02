(function (root) {
  'use strict';
  const isPrice = v => Number.isSafeInteger(v) && v >= 0;
  function calculate(config, catalogue) {
    const { power, cabinet, years } = config;
    if (!Number.isInteger(power) || power < 15 || power > 4000 ||
        !['IP21', 'IP54', 'IP65'].includes(cabinet) ||
        !Number.isInteger(years) || years < 1 || years > 5) {
      throw new RangeError('Configurazione non valida');
    }
    const pro = Boolean(config.pro) && power >= 150;
    const line = pro ? 'PRO' : power < 150 ? 'Lite' : 'Industry';
    // Un catalogo non verificato non può produrre un preventivo definitivo.
    const product = catalogue.verified ? catalogue.products.find(p => p.power === power && p.line === line) : undefined;
    const meterAvailable = !pro && isPrice(product?.meter);
    const meter = Boolean(config.meter) && meterAvailable;
    const rows = [
      { key: 'ant', label: `ANT ${line} · ${power.toLocaleString('it-IT')} kVA`, cents: product?.base ?? null },
      { key: 'meter', label: 'Meter MID', cents: meter ? product.meter : 0,
        note: pro ? 'Incluso in PRO' : meter ? '' : 'Non selezionato' },
      { key: 'cabinet', label: `Cabinet ${cabinet}`, cents: cabinet === 'IP21' ? 0 : line === 'Lite' ? null : product?.[cabinet] ?? null,
        note: cabinet === 'IP21' ? 'Incluso' : '' },
      { key: 'cloud', label: `Cloud · ${years} ${years === 1 ? 'anno' : 'anni'}`, cents: (years - 1) * 150000,
        note: years === 1 ? 'Incluso' : 'Primo anno incluso' },
      { key: 'transport', label: 'Trasporto', cents: power <= 1000 && catalogue.verified ? catalogue.transport[power] ?? null : null }
    ];
    // Un dato assente, non numerico o negativo non equivale mai a costo zero.
    rows.forEach(row => { if (!isPrice(row.cents)) row.cents = null; });
    const missing = rows.filter(row => row.cents === null).map(row => row.label);
    const subtotal = rows.reduce((sum, row) => sum + (row.cents ?? 0), 0);
    return { power, line, pro, meter, meterAvailable, product, rows, missing, subtotal,
      total: missing.length || !catalogue.verified ? null : subtotal };
  }
  const api = { calculate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ANTCalculator = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
