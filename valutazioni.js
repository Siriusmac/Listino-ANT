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
  function drawConcepts() {
    const phase = $('phase-content'), power = $('power-content');
    if (!phase || !power) return;
    // Schemi didattici fissi: cosphi 0,80 e triangolo 80/60/100.
    const phi = Math.acos(0.8), start = 36, length = 448, baseline = 150, amplitude = 60;
    phase.append(node('line', { x1: start, y1: baseline, x2: 490, y2: baseline, stroke: '#a9b3bb' }));
    phase.append(node('line', { x1: start, y1: 76, x2: start, y2: 225, stroke: '#d8dfe4' }));
    for (const [lag, color, label, labelX] of [[0, '#176cc1', 'Tensione U', 50], [phi, '#cc7b00', 'Corrente I', 255]]) {
      const points = [];
      for (let i = 0; i <= 240; i++) {
        const x = start + length * i / 240;
        const y = baseline - amplitude * Math.sin(2 * Math.PI * i / 240 - lag);
        points.push(`${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`);
      }
      phase.append(node('path', { d: points.join(' '), fill: 'none', stroke: color, 'stroke-width': 3.5 }));
      phase.append(node('line', { x1: labelX, x2: labelX + 25, y1: 24, y2: 24, stroke: color, 'stroke-width': 3.5 }));
      phase.append(node('text', { x: labelX + 34, y: 30, class: 'concept-label' }, label));
    }
    const peakU = start + length / 4, peakI = peakU + length * phi / (2 * Math.PI);
    for (const x of [peakU, peakI]) phase.append(node('line', { x1: x, x2: x, y1: 68, y2: 99, stroke: '#69737c', 'stroke-dasharray': '3 3' }));
    phase.append(node('path', { d: `M${peakU},77V65H${peakI}V77`, fill: 'none', stroke: '#182127', 'stroke-width': 1.3 }));
    phase.append(node('text', { x: (peakU + peakI) / 2, y: 54, 'text-anchor': 'middle', class: 'concept-label' }, 'φ ≈ 36,9°'));
    for (let i = 0; i <= 4; i++) {
      const x = start + i / 4 * length;
      phase.append(node('line', { x1: x, x2: x, y1: baseline - 4, y2: baseline + 4, stroke: '#9da9b2' }));
      phase.append(node('text', { x, y: 242, 'text-anchor': 'middle', class: 'concept-small' }, ['0', 'T/4', 'T/2', '3T/4', 'T'][i]));
    }
    phase.append(node('text', { x: 260, y: 279, 'text-anchor': 'middle', class: 'concept-small' }, 'Tempo → · ampiezze normalizzate'));
    power.append(node('path', { d: 'M60 236H284V68Z', fill: '#176cc10c' }));
    for (const [x1,y1,x2,y2,color] of [[60,236,284,236,'#137e60'],[284,236,284,68,'#cc7b00'],[60,236,284,68,'#176cc1']]) {
      power.append(node('line', { x1,y1,x2,y2,stroke:color,'stroke-width':3.5 }));
    }
    power.append(node('path', { d:'M272 236V224H284',fill:'none',stroke:'#69737c','stroke-width':1.4 }));
    power.append(node('path', { d:'M104 236 A44 44 0 0 0 95.2 209.6',fill:'none',stroke:'#69737c','stroke-width':1.4 }));
    power.append(node('text', { x:111,y:221,class:'concept-label' }, 'φ'));
    power.append(node('text', { x:172,y:265,'text-anchor':'middle',class:'concept-label',fill:'#137e60' }, 'P = 80 kW'));
    power.append(node('text', { x:305,y:145,class:'concept-label',fill:'#cc7b00' }, 'Q = 60 kvar'));
    power.append(node('text', { transform:'translate(164 140) rotate(-36.87)','text-anchor':'middle',class:'concept-label',fill:'#176cc1' }, 'S = 100 kVA'));
    power.append(node('text', { x:322,y:201,class:'concept-small' }, 'cosphi = P / S'));
    power.append(node('text', { x:322,y:227,class:'concept-small' }, '80 / 100 = 0,80'));
    power.append(node('text', { x:322,y:265,class:'concept-small' }, 'S² = P² + Q²'));
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
    grid.append(node('text', { x: left, y: 15, class: 'axis-label' }, 'Cosphi'));
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
    curves.append(node('path', { d: path, fill: 'none', stroke: '#176cc1', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'data-series': 'cosphi' }));
    if (valid && current.increase !== null) {
      const px = x(current.increase), py = y(current.factor);
      const color = '#176cc1';
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
    const label = 'Cosphi';
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
        $('result-reference').textContent = 'Rispetto al riferimento con cosphi = 1.';
        $('result-multiplier').textContent = `${number(current.multiplier)} ${Math.abs(current.multiplier - 1) < 1e-10 ? 'volta' : 'volte'} le perdite del riferimento.`;
        $('chart-reading').textContent = `${label} ${number(value)} → aumento delle perdite +${number(current.increase)}%.`;
      }
    }
    $('svg-description').textContent = `Asse X: aumento delle perdite in percentuale, con scala automatica. Asse Y: cosphi da 1 a 0. Una sola curva blu; non consideriamo il THD. ${$('chart-reading').textContent}`;
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
  drawConcepts();
  render();
})();
