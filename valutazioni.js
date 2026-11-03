(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const { parseFactor, evaluateFactor, chartLimit, factorAtIncrease } = window.ANTEvaluation;
  const number = (value, digits = 2) => new Intl.NumberFormat('it-IT', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: true }).format(value);
  const ns = 'http://www.w3.org/2000/svg';
  const svg = $('loss-chart');
  let current = evaluateFactor(0.8);
  let valid = true;
  function node(tag, attributes, text) {
    const item = document.createElementNS(ns, tag);
    Object.entries(attributes || {}).forEach(([key, value]) => item.setAttribute(key, value));
    if (text !== undefined) item.textContent = text;
    return item;
  }
  function tick(value, compact) {
    if (compact && value >= 1000000) return number(value / 1000000, 0) + 'M';
    if (compact && value >= 1000) return number(value / 1000, value % 1000 ? 1 : 0) + 'k';
    return number(value, 0);
  }
  function draw() {
    const width = Math.max(280, Math.round(svg.parentElement.clientWidth));
    const mobile = width < 600;
    const height = mobile ? 330 : 430;
    const left = mobile ? 45 : 58, right = width - (mobile ? 19 : 27);
    const top = 35, bottom = height - 65;
    const limit = chartLimit(valid ? current.increase : null);
    const x = percent => left + percent / limit * (right - left);
    const y = factor => top + (1 - factor) * (bottom - top);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const grid = $('chart-grid'), curves = $('chart-curves'), marker = $('chart-marker');
    grid.replaceChildren(); curves.replaceChildren(); marker.replaceChildren();
    for (let index = 0; index <= 5; index++) {
      const factor = 1 - index / 5;
      const percent = limit * index / 5;
      grid.append(node('line', { x1: left, x2: right, y1: y(factor), y2: y(factor), stroke: '#e2e7eb' }));
      grid.append(node('line', { x1: x(percent), x2: x(percent), y1: top, y2: bottom, stroke: '#edf0f2' }));
      grid.append(node('text', { x: left - 10, y: y(factor) + 4, 'text-anchor': 'end' }, number(factor, 1)));
      grid.append(node('text', { x: x(percent), y: bottom + 23, 'text-anchor': 'middle' }, tick(percent, mobile) + '%'));
    }
    grid.append(node('path', { d: `M${left},${top}V${bottom}H${right}`, fill: 'none', stroke: '#9ca9b2', 'stroke-width': 1.2 }));
    grid.append(node('text', { x: left, y: 15, class: 'axis-label' }, 'FP / cos φ'));
    grid.append(node('text', { x: (left + right) / 2, y: height - 13, class: 'axis-label', 'text-anchor': 'middle' }, 'Aumento delle perdite (%)'));
    // Campionamento in f: mantiene leggibile la curva anche a scale molto ampie.
    const minimumFactor = factorAtIncrease(limit);
    const points = [];
    for (let i = 0; i <= 500; i++) {
      const factor = 1 - i / 500 * (1 - minimumFactor);
      const percent = Math.max(0, (1 / (factor * factor) - 1) * 100);
      points.push(`${i ? 'L' : 'M'}${x(percent).toFixed(2)},${y(factor).toFixed(2)}`);
    }
    const path = points.join(' ');
    curves.append(node('path', { d: path, fill: 'none', stroke: '#176cc1', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8, 'data-series': 'fp' }));
    curves.append(node('path', { d: path, fill: 'none', stroke: '#d5463e', 'stroke-width': 2, 'stroke-dasharray': '8 6', 'stroke-linecap': 'round', 'data-series': 'cos' }));
    if (valid && current.increase !== null) {
      const px = x(current.increase), py = y(current.factor);
      const color = $('factor-type').value === 'fp' ? '#176cc1' : '#d5463e';
      marker.append(node('path', { d: `M${left},${py}H${px}V${bottom}`, fill: 'none', stroke: '#596670', 'stroke-width': 1, 'stroke-dasharray': '4 4', opacity: 0.65 }));
      marker.append(node('circle', { cx: px, cy: py, r: 9, fill: '#fff', stroke: '#182127', 'stroke-width': 1.2 }));
      marker.append(node('circle', { cx: px, cy: py, r: 5.5, fill: color, 'data-factor': current.factor, 'data-increase': current.increase }));
      const label = `${number(current.factor)} · +${number(current.increase)}%`;
      const labelWidth = Math.min(right - left, label.length * 7 + 18);
      let labelX = px + 14;
      if (labelX + labelWidth > right) labelX = px - labelWidth - 14;
      labelX = Math.max(left, Math.min(right - labelWidth, labelX));
      const labelY = py - 37 < top ? py + 15 : py - 37;
      marker.append(node('rect', { x: labelX, y: labelY, width: labelWidth, height: 27, rx: 4, fill: '#fff', stroke: '#d4dde3' }));
      marker.append(node('text', { x: labelX + 9, y: labelY + 18, class: 'marker-label' }, label));
    }
    $('chart-scale').textContent = `Asse X: aumento delle perdite da 0 a ${number(limit, 0)}%.${limit > 100 ? ' Scala ampliata per includere il risultato.' : ''}`;
  }
  function render() {
    const value = parseFactor($('factor').value);
    const isFP = $('factor-type').value === 'fp';
    const label = isFP ? 'FP' : 'cos φ';
    $('evaluation-result').style.setProperty('--result-color', isFP ? '#176cc1' : '#d5463e');
    valid = value !== null;
    $('factor').setAttribute('aria-invalid', String(!valid));
    $('factor-error').hidden = valid;
    if (!valid) {
      $('factor-error').textContent = 'Inserisci un valore da 0 a 1 con al massimo due decimali.';
      $('loss-result').textContent = '—';
      $('result-reference').textContent = 'Il risultato compare quando il valore è valido.';
      $('result-multiplier').textContent = '';
      $('chart-reading').textContent = 'Inserisci un valore valido per collocare il punto sul grafico.';
    } else {
      current = evaluateFactor(value);
      if (current.increase === null) {
        $('loss-result').textContent = 'Non finito';
        $('result-reference').textContent = 'Con un fattore pari a 0, il modello non dà un aumento finito.';
        $('result-multiplier').textContent = 'Il punto non è rappresentabile sul grafico.';
        $('chart-reading').textContent = `${label} = 0: nessuna coordinata percentuale finita.`;
      } else {
        $('loss-result').replaceChildren(document.createTextNode('+' + number(current.increase)));
        const unit = document.createElement('span'); unit.textContent = '%'; $('loss-result').append(unit);
        $('result-reference').textContent = `Rispetto al riferimento con ${label} = 1.${!isFP ? ' Confronto senza distorsione.' : ''}`;
        $('result-multiplier').textContent = `${number(current.multiplier)} ${Math.abs(current.multiplier - 1) < 1e-10 ? 'volta' : 'volte'} le perdite del riferimento.`;
        $('chart-reading').textContent = `${label} ${number(value)} → aumento delle perdite +${number(current.increase)}%.`;
      }
    }
    $('svg-description').textContent = `Asse X: aumento delle perdite in percentuale, con scala automatica. Asse Y: fattore da 1 a 0. FP in blu e cos φ in rosso coincidono nel confronto senza distorsione. ${$('chart-reading').textContent}`;
    draw();
  }
  $('evaluation-form').addEventListener('submit', event => event.preventDefault());
  $('evaluation-form').addEventListener('input', render);
  $('evaluation-form').addEventListener('change', render);
  $('factor').addEventListener('blur', () => {
    const value = parseFactor($('factor').value);
    if (value !== null) $('factor').value = number(value);
  });
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(draw).observe(svg.parentElement);
  else window.addEventListener('resize', draw);
  render();
})();
