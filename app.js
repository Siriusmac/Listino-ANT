(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const catalogue = window.ANT_CATALOGUE;
  const money = cents => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', useGrouping: true }).format(cents / 100);
  const form = $('config');
  let powerInput = $('power');
  if (catalogue.verified && catalogue.products.length) {
    // Solo tagli presenti nei PDF; le due linee condividono il selettore.
    powerInput.replaceChildren();
    for (const line of ['Lite', 'Industry']) {
      const group = document.createElement('optgroup'); group.label = `ANT ${line}`;
      catalogue.products.filter(p => p.line === line).sort((a, b) => a.power - b.power).forEach(p => {
        group.append(new Option(`${p.power.toLocaleString('it-IT', { useGrouping: true })} kVA`, p.power, p.power === 150, p.power === 150));
      });
      powerInput.append(group);
    }
    $('source-alert').hidden = true;
    $('power-help').textContent = '25 tagli disponibili · Lite e Industry/PRO.';
    $('footer-status').textContent = 'Listini 2026 Rev. 1 · importi IVA esclusa';
  }
  function render() {
    if (!powerInput.checkValidity() || powerInput.value === '') {
      $('pricing').hidden = true; $('print').disabled = true;
      $('power-summary').textContent = 'Potenza non valida';
      $('line-note').textContent = 'Seleziona un taglio di potenza dal menu.';
      $('pro').disabled = true; $('pro').checked = false;
      $('meter').disabled = true; $('meter').checked = false;
      return;
    }
    $('pricing').hidden = false; $('print').disabled = false;
    const power = Number(powerInput.value);
    const hasPro = !catalogue.verified || catalogue.products.some(p => p.power === power && p.line === 'PRO');
    $('pro').disabled = power < 150 || !hasPro;
    if ($('pro').disabled) $('pro').checked = false;
    $('pro-help').textContent = power < 150 ? 'PRO non disponibile sotto 150 kVA.' : !hasPro ? 'PRO non disponibile per questo taglio.' : catalogue.verified ? 'Versione PRO disponibile per questo taglio.' : 'Disponibile da 150 kVA, previa verifica del taglio.';
    const result = window.ANTCalculator.calculate({ power, pro: $('pro').checked, meter: $('meter').checked, cabinet: $('cabinet').value, years: Number($('years').value) }, catalogue);
    $('meter').disabled = !result.meterAvailable;
    $('meter').checked = result.meter;
    $('meter-help').textContent = result.pro ? 'Meter incluso in PRO. Opzione aggiuntiva disabilitata.' : result.meterAvailable ? 'Accessorio disponibile per questo taglio.' : result.product?.meter === false ? 'Meter MID non disponibile per questo taglio.' : 'Disponibilità da verificare sul listino.';
    document.documentElement.style.setProperty('--accent', { Lite: '#b48a00', Industry: '#009b9c', PRO: '#0078ce' }[result.line]);
    $('line-name').textContent = result.line;
    const photo = $('product-photo');
    const photoSource = result.pro ? 'assets/ant-pro.png' : 'assets/ant-standard.png';
    if (photo.getAttribute('src') !== photoSource) photo.src = photoSource;
    photo.alt = `ANT ${result.line}, foto dal listino`;
    photo.width = result.pro ? 557 : 519;
    photo.height = result.pro ? 929 : 863;
    $('power-summary').replaceChildren(document.createTextNode(`${power.toLocaleString('it-IT')} `));
    const unit = document.createElement('span'); unit.textContent = 'kVA'; $('power-summary').append(unit);
    $('line-note').textContent = catalogue.verified ? 'Listini 2026 · Rev. 1' : 'Linea indicativa · taglio da verificare';
    $('total-label').textContent = result.total === null ? 'Importo parziale' : 'Totale configurazione';
    $('total').textContent = money(result.subtotal);
    $('total-caption').textContent = result.total === null ? 'Somma delle sole voci con prezzo noto. IVA esclusa.' : 'ANT, accessori, cloud e trasporto. IVA esclusa.';
    $('breakdown').replaceChildren();
    result.rows.forEach(row => {
      const div = document.createElement('div'); div.className = 'cost-row';
      const dt = document.createElement('dt'); dt.textContent = row.label;
      if (row.note && row.cents !== 0) { const note = document.createElement('small'); note.textContent = row.note; dt.append(note); }
      const dd = document.createElement('dd');
      dd.textContent = row.cents === null ? 'Da quotare' : row.cents === 0 && row.note ? row.note : money(row.cents);
      if (row.cents === null) dd.className = 'unknown';
      if (row.cents === 0 && ['Incluso', 'Incluso in PRO'].includes(row.note)) dd.className = 'included';
      div.append(dt, dd); $('breakdown').append(div);
    });
    $('quote-warning').hidden = result.total !== null;
    $('missing').textContent = `Da quotare: ${result.missing.join('; ')}.${power > 1000 ? ' Trasporto oltre 1.000 kVA non quotato a listino.' : ''}${!catalogue.verified ? ' Listini mancanti: importi non verificati.' : ''}`;
    const cabinet = $('cabinet').value;
    $('cabinet-help').textContent = cabinet === 'IP21' ? 'IP21 compreso nel prezzo base.' : result.line === 'Lite' ? 'Cabinet IP54/IP65 non quotati per Lite.' : result.rows.find(r => r.key === 'cabinet').cents === null ? 'Sovrapprezzo da verificare sul listino.' : `Sovrapprezzo ${money(result.rows.find(r => r.key === 'cabinet').cents)}.`;
    [...$('cabinet').options].forEach(option => {
      if (option.value === 'IP21') return;
      const price = result.line === 'Lite' ? null : result.product?.[option.value];
      option.textContent = `${option.value} · ${Number.isSafeInteger(price) && price >= 0 ? '+' + money(price) : 'da quotare'}`;
    });
  }
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('reset', () => setTimeout(render, 0));
  $('print').addEventListener('click', () => window.print());
  render();
})();
