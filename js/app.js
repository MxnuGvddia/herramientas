const $ = id => document.getElementById(id);
const page = $("page-content");

function homePage() {
  document.title = "Herramientas Gratis — Calculadoras, Conversores y Utilidades";
  const layout = getLayout();
  const tools = layout ? layout.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) : TOOLS;
  const isEdit = window._layoutEditing || false;
  const editBar = isEdit ? `
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:16px;padding:12px 16px;background:rgba(0,243,255,.04);border:1px solid rgba(0,243,255,.1);border-radius:10px">
      <span style="font-size:.8rem;color:var(--muted)">Arrastra las tarjetas para reordenar</span>
      <button class="btn" onclick="saveLayout()" style="font-size:.8rem;padding:6px 14px;margin-left:auto">💾 Guardar layout</button>
    </div>` : '';
  page.innerHTML = `
    ${editBar}
    <div class="tool-grid ${isEdit ? 'editing' : ''}" id="tool-grid">
      ${tools.map(t => `
        <div class="tool-card" draggable="${isEdit}" data-tool-id="${t.id}"${isEdit ? '' : ` onclick="navigate('${t.id}')"`}>
          ${isEdit ? '<span class="drag-handle">⠿</span>' : ''}
          <div class="icon">${t.icon}</div>
          <h3>${t.name}</h3>
          <p>${t.desc}</p>
        </div>
      `).join('')}
    </div>
    
  `;
  if (isEdit) {
    const grid = $("tool-grid");
    if (grid) {
      grid.addEventListener('dragstart', dragStart);
      grid.addEventListener('dragover', dragOver);
      grid.addEventListener('drop', drop);
      grid.addEventListener('dragend', dragEnd);
    }
  }
}

function toolPage(id) {
  const t = TOOLS.find(x => x.id === id);
  if (!t) return homePage();
  document.title = `${t.name} — Herramientas Gratis`;
  page.innerHTML = `
    <div class="tool-page">
      <a class="back" onclick="navigate('')">← Todas las herramientas</a>
      <h1>${t.icon} ${t.name}</h1>
      <p class="desc">${t.desc}</p>
      
      <div class="tool-box" id="tool-content">${t.render()}</div>
      
    </div>
  `;
  if (t.init) setTimeout(t.init, 50);
}

function navigate(hash) {
  window.location.hash = hash || "";
}

window.addEventListener("hashchange", () => {
  const id = window.location.hash.replace("#", "");
  id ? toolPage(id) : homePage();
});

homePage();


function calcTab(tab) {
  const c = $("calc-engine-content");
  const t = {
    basic: ` 
      <input type="text" id="calc-expr" placeholder="Ej: 2 + 2 * 5" value="2+2" onkeydown="if(event.key==='Enter')calcEval()" style="font-family:monospace;font-size:1.1rem">
      <div class="calc-grid">
        <button class="btn calc-key" onclick="calcInsert('(')">(</button>
        <button class="btn calc-key" onclick="calcInsert(')')">)</button>
        <button class="btn calc-key calc-op" onclick="calcClear()">C</button>
        <button class="btn calc-key calc-op" onclick="calcBack()">⌫</button>
        <button class="btn calc-key" onclick="calcInsert('7')">7</button>
        <button class="btn calc-key" onclick="calcInsert('8')">8</button>
        <button class="btn calc-key" onclick="calcInsert('9')">9</button>
        <button class="btn calc-key calc-op" onclick="calcInsert('/')">÷</button>
        <button class="btn calc-key" onclick="calcInsert('4')">4</button>
        <button class="btn calc-key" onclick="calcInsert('5')">5</button>
        <button class="btn calc-key" onclick="calcInsert('6')">6</button>
        <button class="btn calc-key calc-op" onclick="calcInsert('*')">×</button>
        <button class="btn calc-key" onclick="calcInsert('1')">1</button>
        <button class="btn calc-key" onclick="calcInsert('2')">2</button>
        <button class="btn calc-key" onclick="calcInsert('3')">3</button>
        <button class="btn calc-key calc-op" onclick="calcInsert('-')">−</button>
        <button class="btn calc-key" onclick="calcInsert('0')">0</button>
        <button class="btn calc-key" onclick="calcInsert('.')">.</button>
        <button class="btn calc-key calc-op" onclick="calcInsert('Math.PI')">π</button>
        <button class="btn calc-key calc-op" onclick="calcInsert('+')">+</button>
        <button class="calc-eq" onclick="calcEval()">= Calcular</button>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin:8px 0;font-size:.8rem">
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="calcInsert('Math.sin(')">sin</button>
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="calcInsert('Math.cos(')">cos</button>
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="calcInsert('Math.tan(')">tan</button>
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="calcInsert('Math.log(')">ln</button>
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="calcInsert('Math.log10(')">log</button>
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="calcInsert('Math.sqrt(')">√</button>
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="calcInsert('Math.abs(')">|x|</button>
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="calcInsert('**')">xⁿ</button>
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="calcInsert('Math.E')">e</button>
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="calcInsert('%')">%</button>
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="calcInsert('!')">!</button>
      </div>
      <div class="result" id="calc-result"></div>
    `,
    graph: `
      <div class="calc-canvas-wrap">
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
          <input type="text" id="graph-fx" value="Math.sin(x)" style="flex:1;font-family:monospace" placeholder="f(x) = " onkeydown="if(event.key==='Enter')graphPlot()">
          <button class="btn" onclick="graphPlot()">📈 Graficar</button>
          <span style="font-size:.7rem;color:var(--muted);align-self:center">🖱 Arrastra para mover · Rueda para zoom</span>
        </div>
        <div style="display:flex;gap:6px;margin-bottom:6px;font-size:.8rem;flex-wrap:wrap;align-items:center">
          <label>X: <input type="number" id="graph-xmin" value="-10" style="width:65px;padding:2px" onchange="graphPlot()">
          <input type="number" id="graph-xmax" value="10" style="width:65px;padding:2px" onchange="graphPlot()"></label>
          <label>Y: <input type="number" id="graph-ymin" value="-5" style="width:65px;padding:2px" onchange="graphPlot()">
          <input type="number" id="graph-ymax" value="5" style="width:65px;padding:2px" onchange="graphPlot()"></label>
          <button class="btn btn-secondary" style="padding:2px 8px;font-size:.75rem" onclick="zoomGraphIn()">🔍+</button>
          <button class="btn btn-secondary" style="padding:2px 8px;font-size:.75rem" onclick="zoomGraphOut()">🔍−</button>
          <button class="btn btn-secondary" style="padding:2px 8px;font-size:.75rem" onclick="resetGraphView()">⟲</button>
        </div>
        <div style="display:flex;gap:4px;margin-bottom:6px;flex-wrap:wrap;font-size:.75rem">
          <span style="padding:2px 6px;font-weight:600;color:var(--primary)">Tipo:</span>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('2*x+1')">Lineal</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('x*x-4*x+3')">Cuadrática</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('Math.pow(2,x)')">Exponencial</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('1/x')">Prop. inversa</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('x<0 ? -x : x*x')">Seccionada</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('Math.log(x)')">Logarítmica</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('Math.abs(x)')">Absoluto</button>
          <span style="padding:2px 6px;font-weight:600;color:var(--muted)">·</span>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('Math.sin(x)')">sin(x)</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('Math.cos(x)')">cos(x)</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('Math.tan(x)')">tan(x)</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('Math.asin(x)')">sin⁻¹(x)</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('Math.acos(x)')">cos⁻¹(x)</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('Math.atan(x)')">tan⁻¹(x)</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('x*x*x')">x³</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('Math.sqrt(x)')">√x</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="setGraphFx('Math.exp(x)')">eˣ</button>
        </div>
        <canvas id="graph-canvas" width="500" height="350"></canvas>
      </div>
    `,
    calc: `
      <div style="margin-bottom:12px">
        <b style="font-size:.9rem">Derivada numérica</b>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin:6px 0">
          <input type="text" id="calc-deriv-fx" value="x*x" style="flex:1;font-family:monospace" placeholder="f(x)">
          <label style="font-size:.8rem">x = <input type="number" id="calc-deriv-x" value="2" style="width:60px;padding:4px"></label>
          <button class="btn" style="padding:6px 14px;font-size:.85rem" onclick="calcDeriv()">f'(x)</button>
          <span class="result-box" id="calc-deriv-result" style="padding:6px 12px;font-size:.9rem">—</span>
        </div>
      </div>
      <div style="margin-bottom:12px">
        <b style="font-size:.9rem">Integral definida</b>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin:6px 0">
          <input type="text" id="calc-int-fx" value="x*x" style="flex:1;font-family:monospace" placeholder="f(x)">
          <label style="font-size:.8rem">a = <input type="number" id="calc-int-a" value="0" style="width:60px;padding:4px"></label>
          <label style="font-size:.8rem">b = <input type="number" id="calc-int-b" value="1" style="width:60px;padding:4px"></label>
          <button class="btn" style="padding:6px 14px;font-size:.85rem" onclick="calcInt()">∫ f(x)dx</button>
          <span class="result-box" id="calc-int-result" style="padding:6px 12px;font-size:.9rem">—</span>
        </div>
      </div>
      <div style="margin-bottom:12px">
        <b style="font-size:.9rem">Límite</b>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin:6px 0">
          <input type="text" id="calc-lim-fx" value="1/x" style="flex:1;font-family:monospace" placeholder="f(x)">
          <label style="font-size:.8rem">x → <input type="number" id="calc-lim-x" value="0" style="width:60px;padding:4px"></label>
          <button class="btn" style="padding:6px 14px;font-size:.85rem" onclick="calcLim()">lim f(x)</button>
          <span class="result-box" id="calc-lim-result" style="padding:6px 12px;font-size:.9rem">—</span>
        </div>
      </div>
      <div style="margin-bottom:12px">
        <b style="font-size:.9rem">Sumatoria</b>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin:6px 0">
          <input type="text" id="calc-sum-fx" value="i*i" style="flex:1;font-family:monospace" placeholder="f(i)">
          <label style="font-size:.8rem">i = <input type="number" id="calc-sum-from" value="1" style="width:60px;padding:4px"></label>
          <label style="font-size:.8rem">hasta <input type="number" id="calc-sum-to" value="10" style="width:60px;padding:4px"></label>
          <button class="btn" style="padding:6px 14px;font-size:.85rem" onclick="calcSum()">∑ f(i)</button>
          <span class="result-box" id="calc-sum-result" style="padding:6px 12px;font-size:.9rem">—</span>
        </div>
      </div>
      <div style="font-size:.8rem;color:var(--muted)">Usa x como variable, ejemplo: x*x, Math.sin(x), 1/x, Math.exp(x)</div>
    `,
    phys: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>Cinemática — MRU / MRUV / MRUA</b></p>
      <div class="calc-phys-grid">
        <div class="result-box" style="padding:12px">
          <b>MRU</b> (v=cte)
          <div style="margin-top:6px;font-size:.8rem">
            <label>d (m): <input type="number" id="phys-mru-d" value="100" style="padding:4px" oninput="physMRU()"></label>
            <label>t (s): <input type="number" id="phys-mru-t" value="10" style="padding:4px" oninput="physMRU()"></label>
            <label>v (m/s): <input type="number" id="phys-mru-v" value="10" style="padding:4px" readonly></label>
          </div>
        </div>
        <div class="result-box" style="padding:12px">
          <b>MRUV</b> (a=cte)
          <div style="margin-top:6px;font-size:.8rem">
            <label>v₀ (m/s): <input type="number" id="phys-mruv-v0" value="0" style="padding:4px" oninput="physMRUV()"></label>
            <label>a (m/s²): <input type="number" id="phys-mruv-a" value="9.8" style="padding:4px" oninput="physMRUV()"></label>
            <label>t (s): <input type="number" id="phys-mruv-t" value="5" style="padding:4px" oninput="physMRUV()"></label>
            <label>v<sub>f</sub> (m/s): <input type="number" id="phys-mruv-vf" style="padding:4px" readonly></label>
            <label>d (m): <input type="number" id="phys-mruv-d" style="padding:4px" readonly></label>
          </div>
        </div>
        <div class="result-box" style="padding:12px">
          <b>MRUA</b> (v²)
          <div style="margin-top:6px;font-size:.8rem">
            <label>v₀ (m/s): <input type="number" id="phys-mrua-v0" value="0" style="padding:4px" oninput="physMRUA()"></label>
            <label>v<sub>f</sub> (m/s): <input type="number" id="phys-mrua-vf" value="20" style="padding:4px" oninput="physMRUA()"></label>
            <label>a (m/s²): <input type="number" id="phys-mrua-a" value="9.8" style="padding:4px" oninput="physMRUA()"></label>
            <label>d (m): <input type="number" id="phys-mrua-d" style="padding:4px" readonly></label>
          </div>
        </div>
      </div>
      <div style="margin-top:12px;font-size:.8rem;color:var(--muted)">
        MRU: v = d/t &nbsp;|&nbsp; MRUV: v<sub>f</sub> = v₀ + at, d = v₀t + ½at² &nbsp;|&nbsp; MRUA: v<sub>f</sub>² = v₀² + 2ad
      </div>
    `,
    complex: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>Números complejos (a + bi)</b></p>
      <div class="split" style="margin-bottom:8px">
        <div><label>z₁ = <input type="text" id="comp-z1" value="3+4i" style="font-family:monospace" placeholder="a+bi"></label></div>
        <div><label>z₂ = <input type="text" id="comp-z2" value="1-2i" style="font-family:monospace" placeholder="a+bi"></label></div>
      </div>
      <div class="calc-comp-grid">
        <button class="btn btn-secondary" onclick="compOp('+')">z₁+z₂</button>
        <button class="btn btn-secondary" onclick="compOp('-')">z₁−z₂</button>
        <button class="btn btn-secondary" onclick="compOp('*')">z₁·z₂</button>
        <button class="btn btn-secondary" onclick="compOp('/')">z₁÷z₂</button>
      </div>
      <div id="comp-result" style="margin-top:8px"></div>
      <div style="margin-top:8px;font-size:.8rem">
        <button class="btn btn-secondary" style="padding:4px 10px;font-size:.75rem" onclick="compUnary('conj')">Conjugar z₁</button>
        <button class="btn btn-secondary" style="padding:4px 10px;font-size:.75rem" onclick="compUnary('mod')">|z₁|</button>
        <button class="btn btn-secondary" style="padding:4px 10px;font-size:.75rem" onclick="compUnary('arg')">arg(z₁)</button>
      </div>
    `,
    bases: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>Conversor entre bases numéricas</b></p>
      <div class="calc-bases-grid">
        <div><label>Binario (2)</label><input type="text" id="base-bin" value="1010" oninput="baseConvert(2)" placeholder="1010"></div>
        <div><label>Octal (8)</label><input type="text" id="base-oct" value="12" oninput="baseConvert(8)" placeholder="12"></div>
        <div><label>Decimal (10)</label><input type="text" id="base-dec" value="10" oninput="baseConvert(10)" placeholder="10"></div>
        <div><label>Hexadecimal (16)</label><input type="text" id="base-hex" value="A" oninput="baseConvert(16)" placeholder="A"></div>
      </div>
      <div id="base-result" class="result-box" style="margin-top:8px;font-size:.85rem">10<sub>10</sub> = 1010<sub>2</sub> = 12<sub>8</sub> = A<sub>16</sub></div>
      <div style="margin-top:8px;font-size:.8rem;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-secondary" style="padding:4px 10px;font-size:.75rem" onclick="baseExamples()">Ejemplos</button>
        <span style="color:var(--muted);line-height:2">Decimal → cualquier base</span>
      </div>
    `,
    elec: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>Ley de Ohm y Resistencias</b></p>
      <div class="calc-elec-grid" style="margin-bottom:12px">
        <div class="result-box" style="padding:12px">
          <b>Ley de Ohm</b>
          <div style="margin-top:6px;font-size:.8rem">
            <label>V (voltios): <input type="number" id="elec-v" value="12" style="padding:4px" oninput="elecOhm()"></label>
            <label>I (amperios): <input type="number" id="elec-i" value="2" style="padding:4px" oninput="elecOhm()"></label>
            <label>R (Ω): <input type="number" id="elec-r" style="padding:4px" readonly></label>
          </div>
        </div>
        <div class="result-box" style="padding:12px">
          <b>Resistencias en serie</b>
          <div style="margin-top:6px;font-size:.8rem">
            <label>R₁ (Ω): <input type="number" id="elec-rs1" value="100" style="padding:4px" oninput="elecSeries()"></label>
            <label>R₂ (Ω): <input type="number" id="elec-rs2" value="200" style="padding:4px" oninput="elecSeries()"></label>
            <label>R<sub>total</sub> (Ω): <input type="number" id="elec-rs-total" style="padding:4px" readonly></label>
          </div>
        </div>
        <div class="result-box" style="padding:12px">
          <b>Resistencias en paralelo</b>
          <div style="margin-top:6px;font-size:.8rem">
            <label>R₁ (Ω): <input type="number" id="elec-rp1" value="100" style="padding:4px" oninput="elecParalelo()"></label>
            <label>R₂ (Ω): <input type="number" id="elec-rp2" value="100" style="padding:4px" oninput="elecParalelo()"></label>
            <label>R<sub>total</sub> (Ω): <input type="number" id="elec-rp-total" style="padding:4px" readonly></label>
          </div>
        </div>
      </div>
      <div style="font-size:.8rem;color:var(--muted)">
        V = I·R &nbsp;|&nbsp; Serie: R<sub>T</sub> = R₁ + R₂ + ... &nbsp;|&nbsp; Paralelo: 1/R<sub>T</sub> = 1/R₁ + 1/R₂ + ...
      </div>
      <div style="margin-top:16px;border-top:1px solid var(--border);padding-top:12px">
        <p style="font-size:.9rem"><b>Código de colores — resistencia de 4 bandas</b></p>
        <div class="split" style="gap:4px;margin-bottom:8px">
          <div><label style="font-size:.7rem">1ª banda</label>
            <select id="resistor-b1" onchange="resistorCalc()" style="width:100%;padding:4px">
              <option value="0">Negro</option><option value="1" selected>Marrón</option><option value="2">Rojo</option><option value="3">Naranja</option><option value="4">Amarillo</option><option value="5">Verde</option><option value="6">Azul</option><option value="7">Violeta</option><option value="8">Gris</option><option value="9">Blanco</option>
            </select></div>
          <div><label style="font-size:.7rem">2ª banda</label>
            <select id="resistor-b2" onchange="resistorCalc()" style="width:100%;padding:4px">
              <option value="0">Negro</option><option value="1">Marrón</option><option value="2" selected>Rojo</option><option value="3">Naranja</option><option value="4">Amarillo</option><option value="5">Verde</option><option value="6">Azul</option><option value="7">Violeta</option><option value="8">Gris</option><option value="9">Blanco</option>
            </select></div>
          <div><label style="font-size:.7rem">Multiplicador</label>
            <select id="resistor-mult" onchange="resistorCalc()" style="width:100%;padding:4px">
              <option value="1">×1 (Negro)</option><option value="10">×10 (Marrón)</option><option value="100" selected>×100 (Rojo)</option><option value="1000">×1K (Naranja)</option><option value="10000">×10K (Amarillo)</option><option value="100000">×100K (Verde)</option><option value="1000000">×1M (Azul)</option><option value="10000000">×10M (Violeta)</option><option value="0.1">×0.1 (Dorado)</option><option value="0.01">×0.01 (Plateado)</option>
            </select></div>
          <div><label style="font-size:.7rem">Tolerancia</label>
            <select id="resistor-tol" onchange="resistorCalc()" style="width:100%;padding:4px">
              <option value="1">±1% (Marrón)</option><option value="2">±2% (Rojo)</option><option value="5" selected>±5% (Dorado)</option><option value="10">±10% (Plateado)</option><option value="20">±20% (Sin color)</option>
            </select></div>
        </div>
        <div id="resistor-display" style="display:flex;gap:6px;justify-content:center;margin:12px 0;height:44px"></div>
        <div id="resistor-result" class="result-box" style="text-align:center;font-size:1.2rem;font-weight:700">220 Ω ±5%</div>
      </div>
    `,
    chem: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>Química — Masa molar y estequiometría</b></p>
      <div style="margin-bottom:12px">
        <label style="font-size:.85rem">Fórmula química (ej: H2O, CO2, NaCl, C6H12O6):</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin:6px 0">
          <input type="text" id="chem-formula" value="H2O" style="flex:1;font-family:monospace" placeholder="H2O">
          <button class="btn" style="padding:6px 14px;font-size:.85rem" onclick="chemMolarMass()">Calcular masa molar</button>
        </div>
        <div id="chem-result" style="margin-top:6px"></div>
      </div>
      <div style="margin-bottom:12px">
        <b style="font-size:.85rem">Cálculo de moles</b>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin:6px 0;font-size:.8rem">
          <label>Masa (g): <input type="number" id="chem-mass" value="18" style="width:80px;padding:4px"></label>
          <label>Masa molar (g/mol): <input type="number" id="chem-molar" value="18" style="width:80px;padding:4px"></label>
          <button class="btn btn-secondary" style="padding:4px 10px;font-size:.75rem" onclick="chemMoles()">Calcular moles</button>
          <span class="result-box" id="chem-moles-result" style="padding:4px 10px;font-size:.85rem">1.000 mol</span>
        </div>
      </div>
      <p style="font-size:.8rem;margin-top:8px;color:var(--muted)">
        n = m / M &nbsp;|&nbsp; Masas atómicas: H=1, C=12, N=14, O=16, Na=23, Cl=35.5, etc.
      </p>
    `,
    stat: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>Estadística descriptiva</b></p>
      <label>Datos (separados por coma):</label>
      <input type="text" id="stat-data" value="23,45,67,12,89,34,56,78" style="font-family:monospace" onkeydown="if(event.key==='Enter')calcStat()">
      <div class="btn-group">
        <button class="btn" onclick="calcStat()">📊 Calcular</button>
        <button class="btn btn-secondary" onclick="document.getElementById('stat-data').value='1,2,3,4,5,6,7,8,9,10';calcStat()">1-10</button>
        <button class="btn btn-secondary" onclick="document.getElementById('stat-data').value='10,20,30,40,50';calcStat()">10-50</button>
      </div>
      <div id="stat-result" style="margin-top:8px">
        <div class="calc-stat-grid"></div>
      </div>
    `,
    rule3: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>Regla de tres simple</b></p>
      <p style="font-size:.85rem;color:var(--muted);margin-bottom:12px">Si <b>A</b> corresponde a <b>B</b>, entonces <b>C</b> corresponde a <b>X</b></p>
      <div style="display:flex;gap:12px;justify-content:center;align-items:end;flex-wrap:wrap;font-size:1.1rem">
        <div style="text-align:center">
          <label style="font-size:.85rem">A</label>
          <input type="number" id="rule3-a" value="2" style="width:100px;padding:8px;text-align:center;font-size:1.2rem">
        </div>
        <div style="font-size:1.5rem;padding-bottom:8px">→</div>
        <div style="text-align:center">
          <label style="font-size:.85rem">B</label>
          <input type="number" id="rule3-b" value="4" style="width:100px;padding:8px;text-align:center;font-size:1.2rem">
        </div>
        <div style="font-size:1.5rem;padding-bottom:8px">→</div>
        <div style="text-align:center">
          <label style="font-size:.85rem">C</label>
          <input type="number" id="rule3-c" value="6" style="width:100px;padding:8px;text-align:center;font-size:1.2rem">
        </div>
        <div style="font-size:1.5rem;padding-bottom:8px">→</div>
        <div style="text-align:center">
          <label style="font-size:.85rem">X = ?</label>
          <div class="result-box" id="rule3-result" style="width:100px;padding:8px;text-align:center;font-size:1.2rem;font-weight:700">12</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:12px">
        <button class="btn" onclick="rule3Calc()">Calcular X</button>
        <button class="btn btn-secondary" onclick="rule3Inverse()">🔄 Invertir (directa ↔ inversa)</button>
      </div>
      <div id="rule3-mode" style="text-align:center;margin-top:8px;font-size:.85rem;color:var(--muted)">Regla de tres <b>directa</b>: X = (B·C)/A</div>
    `,
  };
  c.innerHTML = (t[tab] || t.basic) ;
  if (tab === 'basic') { setTimeout(() => { calcEval(); }, 50); }
  if (tab === 'graph') { setTimeout(() => { graphPlot(); }, 100); }
  if (tab === 'stat') { setTimeout(() => { calcStat(); }, 50); }
  if (tab === 'phys') { setTimeout(() => { physMRU(); physMRUV(); physMRUA(); }, 50); }
  if (tab === 'elec') { setTimeout(() => { elecOhm(); elecSeries(); elecParalelo(); resistorCalc(); }, 50); }
  if (tab === 'bases') { setTimeout(() => { baseConvert(10); }, 50); }
}


function calcInsert(ch) {
  const inp = $("calc-expr");
  if (!inp) return;
  const start = inp.selectionStart, end = inp.selectionEnd;
  inp.value = inp.value.substring(0, start) + ch + inp.value.substring(end);
  inp.selectionStart = inp.selectionEnd = start + ch.length;
  inp.focus(); calcEval();
}
function calcClear() { const inp = $("calc-expr"); if (inp) { inp.value = ""; inp.focus(); calcEval(); } }
function calcBack() {
  const inp = $("calc-expr");
  if (!inp) return;
  const start = inp.selectionStart;
  if (start > 0) {
    inp.value = inp.value.substring(0, start-1) + inp.value.substring(inp.selectionEnd);
    inp.selectionStart = inp.selectionEnd = start - 1;
  }
  inp.focus(); calcEval();
}
function calcPi() { calcInsert('(' + Math.PI + ')'); }
function calcEval() {
  const expr = $("calc-expr")?.value.trim();
  if (!expr) return;
  try {
    const result = Function(`"use strict"; return (${expr})`)();
    $("calc-result").innerHTML = `<div class="result-box">${expr} = <strong>${result}</strong></div>`;
  } catch (e) {
    $("calc-result").innerHTML = `<div class="result-box error">Error: expresión inválida</div>`;
  }
}


function graphPlot() {
  const canvas = $("graph-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const fx = $("graph-fx").value.trim();
  const xmin = parseFloat($("graph-xmin").value), xmax = parseFloat($("graph-xmax").value);
  const ymin = parseFloat($("graph-ymin").value), ymax = parseFloat($("graph-ymax").value);
  ctx.clearRect(0, 0, W, H);
  const px = x => (x - xmin) / (xmax - xmin) * W;
  const py = y => H - (y - ymin) / (ymax - ymin) * H;
  ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 0.5;
  for (let i = Math.ceil(xmin); i <= Math.floor(xmax); i++) {
    if (i === 0) continue;
    ctx.beginPath(); ctx.moveTo(px(i), 0); ctx.lineTo(px(i), H); ctx.stroke();
  }
  for (let i = Math.ceil(ymin); i <= Math.floor(ymax); i++) {
    if (i === 0) continue;
    ctx.beginPath(); ctx.moveTo(0, py(i)); ctx.lineTo(W, py(i)); ctx.stroke();
  }
  ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(px(0), 0); ctx.lineTo(px(0), H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, py(0)); ctx.lineTo(W, py(0)); ctx.stroke();
  const steps = W;
  ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= steps; i++) {
    const x = xmin + (xmax - xmin) * i / steps;
    try {
      const y = Function("x", `return (${fx})`)(x);
      if (typeof y !== 'number' || !isFinite(y) || y < ymin || y > ymax) { started = false; continue; }
      if (!started) { ctx.moveTo(px(x), py(y)); started = true; } else ctx.lineTo(px(x), py(y));
    } catch(e) { started = false; }
  }
  ctx.stroke();
  ctx.fillStyle = "#1a1a2e"; ctx.font = "12px monospace"; ctx.textAlign = "center";
  ctx.fillText(`f(x) = ${fx}`, W/2, 20);
  ctx.fillStyle = "#6b7280"; ctx.font = "10px monospace";
  ctx.textAlign = "center"; ctx.fillText(`X: [${xmin.toFixed(2)}, ${xmax.toFixed(2)}]  Y: [${ymin.toFixed(2)}, ${ymax.toFixed(2)}]`, W/2, H-8);
  if (!canvas._graphInited) {
    canvas._graphInited = true;
    makeGraphInteractive('graph-canvas', {
      xmin: () => { const e = $("graph-xmin"); return e ? e.value : -10; },
      xmax: () => { const e = $("graph-xmax"); return e ? e.value : 10; },
      ymin: () => { const e = $("graph-ymin"); return e ? e.value : -5; },
      ymax: () => { const e = $("graph-ymax"); return e ? e.value : 5; },
      xmin_set: (v) => { const e = $("graph-xmin"); if (e) e.value = v.toFixed(4); },
      xmax_set: (v) => { const e = $("graph-xmax"); if (e) e.value = v.toFixed(4); },
      ymin_set: (v) => { const e = $("graph-ymin"); if (e) e.value = v.toFixed(4); },
      ymax_set: (v) => { const e = $("graph-ymax"); if (e) e.value = v.toFixed(4); },
    }, graphPlot);
  }
}
function setGraphFx(fx) { $("graph-fx").value = fx; graphPlot(); }
function zoomGraphIn() {
  const xmin = parseFloat($("graph-xmin").value), xmax = parseFloat($("graph-xmax").value);
  const ymin = parseFloat($("graph-ymin").value), ymax = parseFloat($("graph-ymax").value);
  const cx = (xmin + xmax) / 2, cy = (ymin + ymax) / 2;
  const sx = (xmax - xmin) * 0.85 / 2, sy = (ymax - ymin) * 0.85 / 2;
  $("graph-xmin").value = (cx - sx).toFixed(4); $("graph-xmax").value = (cx + sx).toFixed(4);
  $("graph-ymin").value = (cy - sy).toFixed(4); $("graph-ymax").value = (cy + sy).toFixed(4);
  graphPlot();
}
function zoomGraphOut() {
  const xmin = parseFloat($("graph-xmin").value), xmax = parseFloat($("graph-xmax").value);
  const ymin = parseFloat($("graph-ymin").value), ymax = parseFloat($("graph-ymax").value);
  const cx = (xmin + xmax) / 2, cy = (ymin + ymax) / 2;
  const sx = (xmax - xmin) * 1.15 / 2, sy = (ymax - ymin) * 1.15 / 2;
  $("graph-xmin").value = (cx - sx).toFixed(4); $("graph-xmax").value = (cx + sx).toFixed(4);
  $("graph-ymin").value = (cy - sy).toFixed(4); $("graph-ymax").value = (cy + sy).toFixed(4);
  graphPlot();
}
function resetGraphView() {
  $("graph-xmin").value = "-10"; $("graph-xmax").value = "10";
  $("graph-ymin").value = "-5"; $("graph-ymax").value = "5";
  graphPlot();
}


function calcDeriv() {
  const fx = $("calc-deriv-fx")?.value;
  const x = parseFloat($("calc-deriv-x")?.value);
  if (!fx || isNaN(x)) return;
  const h = 1e-8;
  try {
    const f = (v) => Function("x", `return (${fx})`)(v);
    const d = (f(x + h) - f(x - h)) / (2 * h);
    $("calc-deriv-result").textContent = isFinite(d) ? d.toFixed(6) : "∞ / no definido";
  } catch(e) { $("calc-deriv-result").textContent = "Error"; }
}
function calcInt() {
  const fx = $("calc-int-fx")?.value;
  const a = parseFloat($("calc-int-a")?.value), b = parseFloat($("calc-int-b")?.value);
  if (!fx || isNaN(a) || isNaN(b)) return;
  const n = 1000; const h = (b - a) / n;
  try {
    const f = (v) => Function("x", `return (${fx})`)(v);
    let sum = f(a) + f(b);
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      sum += i % 2 === 0 ? 2 * f(x) : 4 * f(x);
    }
    $("calc-int-result").textContent = (sum * h / 3).toFixed(6);
  } catch(e) { $("calc-int-result").textContent = "Error"; }
}
function calcLim() {
  const fx = $("calc-lim-fx")?.value;
  const target = parseFloat($("calc-lim-x")?.value);
  if (!fx || isNaN(target)) return;
  try {
    const f = (v) => Function("x", `return (${fx})`)(v);
    const h = 1e-10;
    const left = f(target - h), right = f(target + h);
    if (isFinite(left) && isFinite(right) && Math.abs(left - right) < 1e-6) {
      $("calc-lim-result").textContent = left.toFixed(6);
    } else if (isFinite(left) && isFinite(right)) {
      $("calc-lim-result").textContent = `Izq: ${left.toFixed(4)}, Der: ${right.toFixed(4)} (no existe)`;
    } else {
      $("calc-lim-result").textContent = "∞ / no existe";
    }
  } catch(e) { $("calc-lim-result").textContent = "Error"; }
}
function calcSum() {
  const fx = $("calc-sum-fx")?.value;
  const from = parseInt($("calc-sum-from")?.value), to = parseInt($("calc-sum-to")?.value);
  if (!fx || isNaN(from) || isNaN(to)) return;
  try {
    const f = (v) => Function("i", `return (${fx})`)(v);
    let sum = 0;
    for (let i = from; i <= to; i++) sum += f(i);
    $("calc-sum-result").textContent = sum.toFixed(4);
  } catch(e) { $("calc-sum-result").textContent = "Error"; }
}


function physMRU() {
  const d = parseFloat($("phys-mru-d")?.value), t = parseFloat($("phys-mru-t")?.value);
  if (!isNaN(d) && !isNaN(t) && t !== 0) $("phys-mru-v").value = (d / t).toFixed(4);
}
function physMRUV() {
  const v0 = parseFloat($("phys-mruv-v0")?.value), a = parseFloat($("phys-mruv-a")?.value), t = parseFloat($("phys-mruv-t")?.value);
  if (!isNaN(v0) && !isNaN(a) && !isNaN(t)) {
    $("phys-mruv-vf").value = (v0 + a * t).toFixed(4);
    $("phys-mruv-d").value = (v0 * t + 0.5 * a * t * t).toFixed(4);
  }
}
function physMRUA() {
  const v0 = parseFloat($("phys-mrua-v0")?.value), vf = parseFloat($("phys-mrua-vf")?.value), a = parseFloat($("phys-mrua-a")?.value);
  if (!isNaN(v0) && !isNaN(vf) && !isNaN(a) && a !== 0) {
    $("phys-mrua-d").value = ((vf*vf - v0*v0) / (2*a)).toFixed(4);
  }
}


function compParse(s) {
  s = s.replace(/\s/g, '').replace(/i/g, 'j');
  const re = s.match(/^([+-]?\d*\.?\d*)/);
  const im = s.match(/([+-]?\d*\.?\d*)j$/);
  return {
    r: parseFloat(re?.[1] || 0),
    i: parseFloat(im?.[1] || 0) || (s.includes('j') && !im ? 1 : im && im[1] === '' ? 1 : im && im[1] === '-' ? -1 : 0)
  };
}
function compOp(op) {
  const z1 = compParse($("comp-z1")?.value || "0"), z2 = compParse($("comp-z2")?.value || "0");
  let r, i;
  switch(op) {
    case '+': r = z1.r + z2.r; i = z1.i + z2.i; break;
    case '-': r = z1.r - z2.r; i = z1.i - z2.i; break;
    case '*': r = z1.r*z2.r - z1.i*z2.i; i = z1.r*z2.i + z1.i*z2.r; break;
    case '/': const d = z2.r*z2.r + z2.i*z2.i; r = (z1.r*z2.r + z1.i*z2.i)/d; i = (z1.i*z2.r - z1.r*z2.i)/d; break;
  }
  const sign = i >= 0 ? '+' : '';
  $("comp-result").innerHTML = `<div class="result-box" style="font-size:1.1rem;text-align:center">${r.toFixed(4)} ${sign}${i.toFixed(4)}i</div>`;
}
function compUnary(op) {
  const z = compParse($("comp-z1")?.value || "0");
  let val;
  switch(op) {
    case 'conj': val = `${z.r.toFixed(4)} ${-z.i >= 0 ? '+' : ''}${(-z.i).toFixed(4)}i`; break;
    case 'mod': val = Math.sqrt(z.r*z.r + z.i*z.i).toFixed(6); break;
    case 'arg': val = Math.atan2(z.i, z.r).toFixed(6) + ' rad'; break;
  }
  $("comp-result").innerHTML = `<div class="result-box" style="font-size:1.1rem;text-align:center">${val}</div>`;
}


let baseUpdating = false;
function baseConvert(fromBase) {
  if (baseUpdating) return;
  baseUpdating = true;
  const ids = {2:'base-bin', 8:'base-oct', 10:'base-dec', 16:'base-hex'};
  const val = parseInt(document.getElementById(ids[fromBase])?.value, fromBase);
  const label = document.getElementById(ids[fromBase])?.value;
  if (isNaN(val)) { baseUpdating = false; return; }
  for (const [base, id] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el && parseInt(base) !== fromBase) {
      el.value = parseInt(base) === 16 ? val.toString(16).toUpperCase() : val.toString(parseInt(base));
    }
  }
  $("base-result").innerHTML = `${val}<sub>10</sub> = ${val.toString(2)}<sub>2</sub> = ${val.toString(8)}<sub>8</sub> = ${val.toString(16).toUpperCase()}<sub>16</sub>`;
  baseUpdating = false;
}
function baseExamples() {
  baseUpdating = true;
  const example = Math.floor(Math.random() * 255) + 1;
  $("base-bin").value = example.toString(2);
  $("base-oct").value = example.toString(8);
  $("base-dec").value = example.toString(10);
  $("base-hex").value = example.toString(16).toUpperCase();
  $("base-result").innerHTML = `${example}<sub>10</sub> = ${example.toString(2)}<sub>2</sub> = ${example.toString(8)}<sub>8</sub> = ${example.toString(16).toUpperCase()}<sub>16</sub>`;
  baseUpdating = false;
}


function elecOhm() {
  const v = parseFloat($("elec-v")?.value), i = parseFloat($("elec-i")?.value);
  if (!isNaN(v) && !isNaN(i) && i !== 0) $("elec-r").value = (v / i).toFixed(4);
}
function elecSeries() {
  const r1 = parseFloat($("elec-rs1")?.value), r2 = parseFloat($("elec-rs2")?.value);
  if (!isNaN(r1) && !isNaN(r2)) $("elec-rs-total").value = (r1 + r2).toFixed(4);
}
function elecParalelo() {
  const r1 = parseFloat($("elec-rp1")?.value), r2 = parseFloat($("elec-rp2")?.value);
  if (!isNaN(r1) && !isNaN(r2) && (r1 !== 0 || r2 !== 0)) $("elec-rp-total").value = ((1/r1 + 1/r2) > 0 ? 1 / (1/r1 + 1/r2) : 0).toFixed(4);
}


const RES_COLORS = ['#000','#8B4513','#d00','#FF8C00','#FFD700','#228B22','#06f','#8B008B','#808080','#eee'];
const RES_MULT_COLORS = {1:'#000',10:'#8B4513',100:'#d00',1000:'#FF8C00',10000:'#FFD700',100000:'#228B22',1000000:'#06f',10000000:'#8B008B',0.1:'#DAA520',0.01:'#C0C0C0'};
const RES_TOL_COLORS = {1:'#8B4513',2:'#d00',5:'#DAA520',10:'#C0C0C0',20:'transparent'};
function resistorCalc() {
  const b1 = parseInt($("resistor-b1")?.value || 0);
  const b2 = parseInt($("resistor-b2")?.value || 0);
  const mult = parseFloat($("resistor-mult")?.value || 1);
  const tol = parseFloat($("resistor-tol")?.value || 20);
  const value = (b1 * 10 + b2) * mult;
  let display;
  if (value >= 1e6) display = (value / 1e6).toFixed(value >= 1e7 ? 0 : 1) + ' MΩ';
  else if (value >= 1e3) display = (value / 1e3).toFixed(value >= 1e4 ? 0 : 1) + ' KΩ';
  else if (value >= 1) display = value.toFixed(0) + ' Ω';
  else display = (value * 1000).toFixed(0) + ' mΩ';
  $("resistor-result").innerHTML = `<strong>${display}</strong> ±${tol}%`;
  const disp = $("resistor-display");
  disp.innerHTML = `
    <div style="width:56px;height:44px;border-radius:4px;background:${RES_COLORS[b1]};border:1px solid #555"></div>
    <div style="width:56px;height:44px;border-radius:4px;background:${RES_COLORS[b2]};border:1px solid #555"></div>
    <div style="width:56px;height:44px;border-radius:4px;background:${RES_MULT_COLORS[mult]};border:1px solid #555"></div>
    <div style="width:56px;height:44px;border-radius:4px;background:${RES_TOL_COLORS[tol]};border:1px solid #555"></div>
  `;
}


const ATOMIC = {
  H:1, He:4, Li:7, Be:9, B:11, C:12, N:14, O:16, F:19, Ne:20,
  Na:23, Mg:24, Al:27, Si:28, P:31, S:32, Cl:35.5, Ar:40,
  K:39, Ca:40, Sc:45, Ti:48, V:51, Cr:52, Mn:55, Fe:56, Co:59, Ni:59, Cu:64, Zn:65,
  Ga:70, Ge:73, As:75, Se:79, Br:80, Kr:84,
  Rb:85, Sr:88, Y:89, Zr:91, Nb:93, Mo:96, Tc:99, Ru:101, Rh:103, Pd:106,
  Ag:108, Cd:112, In:115, Sn:119, Sb:122, Te:128, I:127, Xe:131,
  Cs:133, Ba:137, La:139, Ce:140, Pr:141, Nd:144, Pm:145, Sm:150, Eu:152, Gd:157, Tb:159, Dy:163, Ho:165, Er:167, Tm:169, Yb:173, Lu:175,
  Hf:178, Ta:181, W:184, Re:186, Os:190, Ir:192, Pt:195, Au:197, Hg:201, Tl:204, Pb:207, Bi:209, Po:210, At:210, Rn:222,
  Fr:223, Ra:226, Ac:227, Th:232, Pa:231, U:238
};
function chemMolarMass() {
  const formula = $("chem-formula")?.value.trim();
  if (!formula) return;
  let mass = 0, i = 0;
  const parts = formula.match(/([A-Z][a-z]?)(\d*)/g) || [];
  let detail = [];
  for (const p of parts) {
    const el = p.match(/([A-Z][a-z]?)/)[1];
    const cnt = parseInt(p.match(/\d+/)?.[0] || 1);
    const am = ATOMIC[el];
    if (am) { mass += am * cnt; detail.push(`${el}=${am}×${cnt}`); }
    else { $("chem-result").innerHTML = `<div class="result-box error">Elemento desconocido: ${el}</div>`; return; }
  }
  $("chem-result").innerHTML = `<div class="result-box" style="font-size:1rem"><b>${formula}</b> = ${mass.toFixed(2)} g/mol<br><span style="font-size:.8rem;color:var(--muted)">${detail.join(', ')}</span></div>`;
}
function chemMoles() {
  const m = parseFloat($("chem-mass")?.value), M = parseFloat($("chem-molar")?.value);
  if (!isNaN(m) && !isNaN(M) && M !== 0) $("chem-moles-result").textContent = (m / M).toFixed(4) + ' mol';
}


function calcStat() {
  const data = $("stat-data")?.value.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
  if (!data || data.length === 0) return;
  const n = data.length;
  const sum = data.reduce((a,b) => a+b, 0);
  const mean = sum / n;
  const sorted = [...data].sort((a,b) => a-b);
  const median = n % 2 === 0 ? (sorted[n/2-1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
  const modeMap = {}; let maxCnt = 0; let mode = [];
  data.forEach(v => { modeMap[v] = (modeMap[v] || 0) + 1; if (modeMap[v] > maxCnt) maxCnt = modeMap[v]; });
  if (maxCnt > 1) Object.entries(modeMap).forEach(([k,v]) => { if (v === maxCnt) mode.push(k); });
  const variance = data.reduce((s,v) => s + (v-mean)**2, 0) / (n-1);
  const std = Math.sqrt(variance);
  const min = sorted[0], max = sorted[n-1];
  const range = max - min;
  $("stat-result").innerHTML = `
    <div class="calc-stat-grid">
      <div class="result-box"><small>n</small><br><strong>${n}</strong></div>
      <div class="result-box"><small>Suma</small><br><strong>${sum.toFixed(4)}</strong></div>
      <div class="result-box"><small>Media</small><br><strong>${mean.toFixed(4)}</strong></div>
      <div class="result-box"><small>Mediana</small><br><strong>${median.toFixed(4)}</strong></div>
      <div class="result-box"><small>Moda</small><br><strong>${mode.length ? mode.join(', ') : '—'}</strong></div>
      <div class="result-box"><small>Min / Max</small><br><strong>${min} / ${max}</strong></div>
      <div class="result-box"><small>Rango</small><br><strong>${range.toFixed(4)}</strong></div>
      <div class="result-box"><small>Varianza</small><br><strong>${variance.toFixed(4)}</strong></div>
      <div class="result-box"><small>Desv. Est.</small><br><strong>${std.toFixed(4)}</strong></div>
    </div>
  `;
}


let rule3Direct = true;
function rule3Calc() {
  const a = parseFloat($("rule3-a")?.value), b = parseFloat($("rule3-b")?.value), c = parseFloat($("rule3-c")?.value);
  if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) return;
  const x = rule3Direct ? (b * c) / a : (a * b) / c;
  $("rule3-result").textContent = x.toFixed(4);
}
function rule3Inverse() {
  rule3Direct = !rule3Direct;
  const mode = $("rule3-mode");
  if (mode) {
    mode.innerHTML = rule3Direct
      ? 'Regla de tres <b>directa</b>: X = (B·C)/A'
      : 'Regla de tres <b>inversa</b>: X = (A·B)/C';
  }
  rule3Calc();
}

function md1Insert(id, ch) {
  const inp = document.getElementById(id);
  if (!inp) return;
  const start = inp.selectionStart, end = inp.selectionEnd;
  inp.value = inp.value.substring(0, start) + ch + inp.value.substring(end);
  inp.selectionStart = inp.selectionEnd = start + ch.length;
  inp.focus();
}
function md1Clear(id) { const inp = document.getElementById(id); if (inp) { inp.value = ""; inp.focus(); } }
function md1Back(id) {
  const inp = document.getElementById(id);
  if (!inp) return;
  const start = inp.selectionStart;
  if (start > 0) {
    inp.value = inp.value.substring(0, start-1) + inp.value.substring(inp.selectionEnd);
    inp.selectionStart = inp.selectionEnd = start - 1;
  }
  inp.focus();
}

function calcEval() {
  const expr = $("calc-expr").value.trim();
  try {
    const result = Function(`"use strict"; return (${expr})`)();
    $("calc-result").innerHTML = `<div class="result-box">${expr} = <strong>${result}</strong></div>`;
  } catch (e) {
    $("calc-result").innerHTML = `<div class="result-box error">Error: expresión inválida</div>`;
  }
}

function convUpdate() {
  const cat = $("conv-cat").value;
  const val = parseFloat($("conv-val").value) || 0;
  const data = CONV[cat];
  if (!data) return;
  const fromSel = $("conv-from");
  const toSel = $("conv-to");
  fromSel.innerHTML = data.units.map(u => `<option value="${u}">${u}</option>`).join("");
  toSel.innerHTML = data.units.map(u => `<option value="${u}">${u}</option>`).join("");
  toSel.value = data.units[1] || data.units[0];
  convCalc(cat, val);
}

function convCalc(cat, val) {
  const from = $("conv-from").value;
  const to = $("conv-to").value;
  const data = CONV[cat];
  let result;
  if (data.custom) {
    if (from === "°C" && to === "°F") result = val * 9/5 + 32;
    else if (from === "°C" && to === "K") result = val + 273.15;
    else if (from === "°F" && to === "°C") result = (val - 32) * 5/9;
    else if (from === "°F" && to === "K") result = (val - 32) * 5/9 + 273.15;
    else if (from === "K" && to === "°C") result = val - 273.15;
    else if (from === "K" && to === "°F") result = (val - 273.15) * 9/5 + 32;
    else result = val;
  } else {
    result = val * data.base[from] / data.base[to];
  }
  $("conv-result").textContent = `${val} ${from} = ${result.toFixed(6)} ${to}`;
}

function wcCount() {
  const t = $("wc-text").value;
  $("wc-words").innerHTML = `📝 Palabras: <strong>${t.trim() ? t.trim().split(/\s+/).length : 0}</strong>`;
  $("wc-chars").innerHTML = `🔤 Caracteres: <strong>${t.length}</strong>`;
  $("wc-lines").innerHTML = `📄 Líneas: <strong>${t.split("\n").length}</strong>`;
  $("wc-spaces").innerHTML = `📏 Sin espacios: <strong>${t.replace(/\s/g, "").length}</strong>`;
}

function pwGen(count) {
  count = count || 1;
  const len = parseInt($("pw-length").value);
  $("pw-len-label").textContent = len;
  const sets = [];
  if ($("pw-upper").checked) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if ($("pw-lower").checked) sets.push("abcdefghijklmnopqrstuvwxyz");
  if ($("pw-num").checked) sets.push("0123456789");
  if ($("pw-sym").checked) sets.push("!@#$%^&*()_+-=[]{}|;:,.<>?");
  const all = sets.join("");
  if (!all) return;
  const pws = [];
  for (let n = 0; n < count; n++) {
    let pw = "";
    for (let i = 0; i < len; i++) pw += all[Math.floor(Math.random() * all.length)];
    pws.push(pw);
  }
  $("pw-output").value = pws[0];
  if (count > 1) {
    $("pw-multi").innerHTML = pws.map(p => `<div class="result-box" style="font-family:monospace;margin-bottom:4px">${p}</div>`).join("");
  } else {
    $("pw-multi").innerHTML = "";
  }
}

function pwCopy() {
  navigator.clipboard.writeText($("pw-output").value);
  $("pw-output").focus();
  $("pw-output").select();
}

function qrGen() {
  const text = $("qr-text").value.trim() || " ";
  const container = $("qrcode");
  container.innerHTML = "";
  const size = Math.min(280, window.innerWidth - 80);
  try {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
    container.innerHTML = `<img src="${url}" alt="QR Code" style="width:${size}px;height:${size}px">`;
  } catch (e) { container.textContent = "Error generando QR"; }
}

function qrDownload() {
  const img = document.querySelector("#qrcode img");
  if (!img) return;
  const a = document.createElement("a");
  a.href = img.src;
  a.download = "qr-code.png";
  a.click();
}

function caseConvert() {
  const t = $("case-input").value;
  $("case-mayus").textContent = t.toUpperCase();
  $("case-minus").textContent = t.toLowerCase();
  $("case-title").textContent = t.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
  $("case-inv").textContent = [...t].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
}
function caseCopy(id) {
  navigator.clipboard.writeText(document.getElementById(id).textContent);
}

function colorConvert() {
  const input = $("color-input").value.trim();
  const preview = $("color-preview");
  let r, g, b;
  if (input.startsWith("#")) {
    const h = input.replace("#", "");
    if (h.length === 3) {
      r = parseInt(h[0]+h[0], 16); g = parseInt(h[1]+h[1], 16); b = parseInt(h[2]+h[2], 16);
    } else if (h.length === 6) {
      r = parseInt(h.slice(0,2), 16); g = parseInt(h.slice(2,4), 16); b = parseInt(h.slice(4,6), 16);
    }
  } else if (input.startsWith("rgb")) {
    const m = input.match(/\d+/g);
    if (m) { r = +m[0]; g = +m[1]; b = +m[2]; }
  }
  if (r === undefined || isNaN(r)) return;
  preview.style.background = `rgb(${r},${g},${b})`;
  $("color-hex").innerHTML = `HEX: <strong>#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}</strong>`;
  $("color-rgb").innerHTML = `RGB: <strong>rgb(${r},${g},${b})</strong>`;
  const rn = r/255, gn = g/255, bn = b/255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
    else if (max === gn) h = ((bn - rn) / d + 2) * 60;
    else h = ((rn - gn) / d + 4) * 60;
  }
  $("color-hsl").innerHTML = `HSL: <strong>hsl(${Math.round(h)},${Math.round(s*100)}%,${Math.round(l*100)}%)</strong>`;
}

let timerData = { running: false, time: 0, laps: [], interval: null };
function timerToggle() {
  const btn = $("timer-btn");
  if (timerData.running) {
    clearInterval(timerData.interval); timerData.interval = null;
    btn.textContent = "▶ Reanudar";
    $("timer-lap-btn").disabled = true;
  } else {
    const start = Date.now() - timerData.time;
    timerData.interval = setInterval(() => { timerData.time = Date.now() - start; timerDisplay(); }, 100);
    btn.textContent = "⏸ Pausar";
    $("timer-lap-btn").disabled = false;
  }
  timerData.running = !timerData.running;
}
function timerDisplay() {
  const t = timerData.time;
  const cs = Math.floor((t % 1000) / 100);
  const s = Math.floor((t / 1000) % 60);
  const m = Math.floor((t / 60000) % 60);
  $("timer-display").textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${cs}`;
}
function timerLap() {
  timerData.laps.push(timerData.time);
  $("timer-laps").innerHTML = timerData.laps.map((t, i) =>
    `<div style="padding:2px 0;font-size:.85rem">Vuelta ${i+1}: ${(t/1000).toFixed(1)}s</div>`
  ).join("");
}
function timerReset() {
  clearInterval(timerData.interval);
  timerData = { running: false, time: 0, laps: [], interval: null };
  $("timer-btn").textContent = "▶ Iniciar";
  $("timer-lap-btn").disabled = true;
  $("timer-display").textContent = "00:00.0";
  $("timer-laps").innerHTML = "";
}

function notesSave() {
  try { localStorage.setItem("quicknotes", $("notes-text").value); } catch(e) {}
}
function notesLoad() {
  try { $("notes-text").value = localStorage.getItem("quicknotes") || ""; } catch(e) {}
}
function notesClear() {
  if (confirm("¿Limpiar la nota?")) { $("notes-text").value = ""; notesSave(); }
}
function notesCopy() {
  navigator.clipboard.writeText($("notes-text").value);
}
function notesExport() {
  const blob = new Blob([$("notes-text").value], {type: "text/plain"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "nota.txt"; a.click();
}

function md5(s) {
  function rotl(x, n) { return (x << n) | (x >>> (32 - n)); }
  function toHex(n) { let h = ''; for (let i = 0; i < 4; i++) { h += ('0' + ((n >>> (i * 8)) & 0xFF).toString(16)).slice(-2); } return h; }
  const K = [];
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
  const S = [7,12,17,22, 5,9,14,20, 4,11,16,23, 6,10,15,21];
  const blocks = [];
  const bytes = [];
  for (let i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i));
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while ((bytes.length + 8) % 64 !== 0) bytes.push(0);
  for (let i = 0; i < 8; i++) bytes.push((bitLen >>> (i * 8)) & 0xFF);
  for (let i = 0; i < bytes.length; i += 64) {
    const block = [];
    for (let j = 0; j < 16; j++) {
      block[j] = bytes[i + j*4] | (bytes[i + j*4 + 1] << 8) | (bytes[i + j*4 + 2] << 16) | (bytes[i + j*4 + 3] << 24);
    }
    blocks.push(block);
  }
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  for (const M of blocks) {
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) | 0;
      A = D; D = C; C = B; B = (B + rotl(F, S[Math.floor(i / 16) * 4 + (i % 4)])) | 0;
    }
    a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
  }
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

async function hashGen() {
  const t = $("hash-input").value;
  const enc = new TextEncoder().encode(t);
  $("hash-md5").textContent = md5(t);
  const sha1 = await crypto.subtle.digest("SHA-1", enc);
  const sha256 = await crypto.subtle.digest("SHA-256", enc);
  $("hash-sha1").textContent = [...new Uint8Array(sha1)].map(b => b.toString(16).padStart(2,"0")).join("");
  $("hash-sha256").textContent = [...new Uint8Array(sha256)].map(b => b.toString(16).padStart(2,"0")).join("");
}

function b64Encode() {
  try { $("b64-output").textContent = btoa($("b64-input").value); } catch(e) { $("b64-output").textContent = "Error: caracteres no válidos"; }
}
function b64Decode() {
  try { $("b64-output").textContent = atob($("b64-input").value); } catch(e) { $("b64-output").textContent = "Error: Base64 inválido"; }
}

function jsonFormat() {
  try { $("json-output").textContent = JSON.stringify(JSON.parse($("json-input").value), null, 2); } catch(e) { $("json-output").textContent = "Error: JSON inválido"; }
}
function jsonMinify() {
  try { $("json-output").textContent = JSON.stringify(JSON.parse($("json-input").value)); } catch(e) { $("json-output").textContent = "Error: JSON inválido"; }
}
function jsonValidate() {
  try { JSON.parse($("json-input").value); $("json-output").textContent = "✅ JSON válido"; } catch(e) { $("json-output").textContent = "❌ JSON inválido: " + e.message; }
}

function uuidGen(count) {
  count = count || 1;
  const uuids = [];
  for (let n = 0; n < count; n++) {
    uuids.push("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    }));
  }
  $("uuid-display").textContent = uuids[0];
  if (count > 1) $("uuid-list").innerHTML = uuids.map(u => `<div>${u}</div>`).join("");
  else $("uuid-list").innerHTML = "";
}
function uuidCopy() {
  navigator.clipboard.writeText($("uuid-display").textContent);
}

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
function loremGen() {
  const amt = parseInt($("lorem-amount").value) || 3;
  const type = $("lorem-type").value;
  const words = LOREM.split(" ");
  let result = "";
  if (type === "words") {
    result = Array.from({length: amt}, () => words[Math.floor(Math.random() * words.length)]).join(" ");
  } else if (type === "sentences") {
    result = Array.from({length: amt}, () => {
      const len = 5 + Math.floor(Math.random() * 15);
      return Array.from({length: len}, () => words[Math.floor(Math.random() * words.length)]).join(" ") + ".";
    }).join(" ");
  } else {
    result = Array.from({length: amt}, () => {
      const len = 3 + Math.floor(Math.random() * 6);
      return Array.from({length: len}, () => {
        const slen = 5 + Math.floor(Math.random() * 20);
        return Array.from({length: slen}, () => words[Math.floor(Math.random() * words.length)]).join(" ") + ".";
      }).join(" ");
    }).join("\n\n");
  }
  $("lorem-output").textContent = result;
}
function loremCopy() {
  navigator.clipboard.writeText($("lorem-output").textContent);
}

function diffCompare() {
  const a = $("diff-a").value;
  const b = $("diff-b").value;
  if (a === b) { $("diff-result").innerHTML = `<div class="result-box">✅ Los textos son iguales</div>`; return; }
  const len = Math.max(a.length, b.length);
  let html = '<div style="font-family:monospace;font-size:.85rem;line-height:1.6">';
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      html += `<span style="background:#fecaca;color:#dc2626">${a[i] || "¶"}</span>`;
    } else {
      html += a[i] || "";
    }
  }
  html += "</div>";
  $("diff-result").innerHTML = `<div class="result-box">${html}</div>`;
}

function randDice() {
  $("random-result").textContent = "🎲 " + (Math.floor(Math.random() * 6) + 1);
}
function randCoin() {
  $("random-result").textContent = Math.random() < 0.5 ? "🪙 Cara" : "🪙 Cruz";
}
function randNum() {
  $("random-result").textContent = Math.floor(Math.random() * 1000) + 1;
}

const ASCII_FONTS = {
  A: [" ██ ", "███", "█ █", "███", "█ █"],
  B: ["███ ", "█ █ ", "███ ", "█ █ ", "███ "],
  C: [" ███", "█   ", "█   ", "█   ", " ███"],
  D: ["███ ", "█ █ ", "█ █ ", "█ █ ", "███ "],
  E: ["████", "█   ", "███ ", "█   ", "████"],
  F: ["████", "█   ", "███ ", "█   ", "█   "],
  G: [" ███", "█   ", "█ ██", "█  █", " ███"],
  H: ["█ █", "█ █", "███", "█ █", "█ █"],
  I: ["███", " █ ", " █ ", " █ ", "███"],
  J: [" ███", "  █ ", "  █ ", "█ █ ", " █  "],
  K: ["█ █ ", "█ █ ", "██  ", "█ █ ", "█ █ "],
  L: ["█   ", "█   ", "█   ", "█   ", "████"],
  M: ["█   █", "██ ██", "█ █ █", "█   █", "█   █"],
  N: ["█   █", "██  █", "█ █ █", "█  ██", "█   █"],
  O: [" ███ ", "█   █", "█   █", "█   █", " ███ "],
  P: ["███ ", "█ █ ", "███ ", "█   ", "█   "],
  Q: [" ███ ", "█   █", "█   █", "█ ██ ", " ████"],
  R: ["███ ", "█ █ ", "███ ", "█ █ ", "█ █ "],
  S: [" ███", "█   ", " ██ ", "   █", "███ "],
  T: ["█████", "  █  ", "  █  ", "  █  ", "  █  "],
  U: ["█   █", "█   █", "█   █", "█   █", " ███ "],
  V: ["█   █", "█   █", " █ █ ", " █ █ ", "  █  "],
  W: ["█   █", "█   █", "█ █ █", "█ █ █", " █ █ "],
  X: ["█   █", " █ █ ", "  █  ", " █ █ ", "█   █"],
  Y: ["█   █", " █ █ ", "  █  ", "  █  ", "  █  "],
  Z: ["████", "   █", "  █ ", " █  ", "████"],
  " ": ["    ", "    ", "    ", "    ", "    "],
};
function asciiGen() {
  const t = $("ascii-input").value.toUpperCase();
  const lines = ["","","","",""];
  for (const ch of t) {
    const font = ASCII_FONTS[ch] || ASCII_FONTS[" "];
    for (let i = 0; i < 5; i++) lines[i] += font[i] + " ";
  }
  $("ascii-output").textContent = lines.join("\n");
}


const MD1_OPS = { '¬': 5, '∧': 4, '∨': 3, '⊕': 3, '→': 2, '↔': 1 };

function md1Kbd(inputId, opts) {
  opts = opts || {};
  const vars = opts.vars || 'pqrstu';
  return `
    <div class="md1-kbd">
      ${[...vars].map(v => `<button class="kbd-var" onclick="md1Insert('${inputId}','${v}')">${v}</button>`).join('')}
      <span style="width:4px"></span>
      <button class="kbd-op" onclick="md1Insert('${inputId}','¬')">¬</button>
      <button class="kbd-op" onclick="md1Insert('${inputId}','∧')">∧</button>
      <button class="kbd-op" onclick="md1Insert('${inputId}','∨')">∨</button>
      <button class="kbd-op" onclick="md1Insert('${inputId}','⊕')">⊕</button>
      <span style="width:4px"></span>
      <button class="kbd-op" onclick="md1Insert('${inputId}','→')">→</button>
      <button class="kbd-op" onclick="md1Insert('${inputId}','↔')">↔</button>
      <span style="width:4px"></span>
      <button class="kbd-op" onclick="md1Insert('${inputId}','(')">(</button>
      <button class="kbd-op" onclick="md1Insert('${inputId}',')')">)</button>
      <button class="kbd-op" onclick="md1Insert('${inputId}','[')">[</button>
      <button class="kbd-op" onclick="md1Insert('${inputId}',']')">]</button>
      <button class="kbd-op" onclick="md1Insert('${inputId}','{')">{</button>
      <button class="kbd-op" onclick="md1Insert('${inputId}','}')">}</button>
      <span style="width:4px"></span>
      <button class="kbd-op" onclick="md1Insert('${inputId}','∀')">∀</button>
      <button class="kbd-op" onclick="md1Insert('${inputId}','∃')">∃</button>
      <span style="width:4px"></span>
      <button class="kbd-action" onclick="md1Clear('${inputId}')">C</button>
      <button class="kbd-del" onclick="md1Back('${inputId}')">⌫</button>
    </div>
  `;
}

function md1Tokenize(s) {
  const t = []; let i = 0;
  while (i < s.length) {
    if (s[i] === ' ') { i++; continue; }
    if ('()[]{}'.includes(s[i])) { t.push(s[i]); i++; continue; }
    if (/[a-zA-Z]/.test(s[i])) { t.push(s[i]); i++; continue; }
    if (s[i] === '-' && s[i+1] === '>') { t.push('→'); i += 2; continue; }
    if (s[i] === '<' && s[i+1] === '-' && s[i+2] === '>') { t.push('↔'); i += 3; continue; }
    const m = { '!': '¬', '~': '¬', '^': '∧', '|': '∨', '+': '⊕' };
    if (m[s[i]]) { t.push(m[s[i]]); i++; continue; }
    if ('¬∧∨⊕→↔∀∃'.includes(s[i])) { t.push(s[i]); i++; continue; }
    i++;
  }
  return t;
}

function md1ToPostfix(tokens) {
  const out = [], stack = [];
  for (const t of tokens) {
    if (t === '(') { stack.push(t); continue; }
    if (t === ')') {
      while (stack.length && stack[stack.length-1] !== '(') out.push(stack.pop());
      stack.pop(); continue;
    }
    if (t in MD1_OPS) {
      while (stack.length && stack[stack.length-1] in MD1_OPS && MD1_OPS[stack[stack.length-1]] >= MD1_OPS[t]) out.push(stack.pop());
      stack.push(t); continue;
    }
    out.push(t);
  }
  while (stack.length) out.push(stack.pop());
  return out;
}

function md1EvalPF(postfix, vals) {
  const stack = [];
  for (const t of postfix) {
    if (t in MD1_OPS) {
      if (t === '¬') { stack.push(!stack.pop()); continue; }
      const b = stack.pop(), a = stack.pop();
      if (t === '∧') stack.push(a && b);
      else if (t === '∨') stack.push(a || b);
      else if (t === '⊕') stack.push(a !== b);
      else if (t === '→') stack.push(!a || b);
      else if (t === '↔') stack.push((!a || b) && (!b || a));
    } else if (t === 'V') stack.push(true);
    else if (t === 'F') stack.push(false);
    else stack.push(!!vals[t]);
  }
  return stack[0];
}

function md1Tab(tab) {
  const c = $("md1-content");
  if (tab === 'truth') c.innerHTML = `
    
    <p style="margin-bottom:8px">Ingresa una expresión lógica usando variables y operadores</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <input type="text" id="md1-expr" value="(p∧q)→r" style="flex:1;min-width:180px" placeholder="Ej: ¬p ∨ (q ∧ r)" onkeydown="if(event.key==='Enter')md1Truth()">
      <button class="btn" onclick="md1Truth()">📋 Generar Tabla</button>
    </div>
    ${md1Kbd('md1-expr', {vars:'pqrstu'})}
    <div class="presets" style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px">
      <button class="btn btn-secondary" style="font-size:.75rem;padding:3px 8px" onclick="md1SetExpr('p∧q')">p∧q</button>
      <button class="btn btn-secondary" style="font-size:.75rem;padding:3px 8px" onclick="md1SetExpr('p∨q')">p∨q</button>
      <button class="btn btn-secondary" style="font-size:.75rem;padding:3px 8px" onclick="md1SetExpr('p→q')">p→q</button>
      <button class="btn btn-secondary" style="font-size:.75rem;padding:3px 8px" onclick="md1SetExpr('p↔q')">p↔q</button>
      <button class="btn btn-secondary" style="font-size:.75rem;padding:3px 8px" onclick="md1SetExpr('p⊕q')">p⊕q</button>
      <button class="btn btn-secondary" style="font-size:.75rem;padding:3px 8px" onclick="md1SetExpr('¬p∨q')">¬p∨q</button>
      <button class="btn btn-secondary" style="font-size:.75rem;padding:3px 8px" onclick="md1SetExpr('(p∧q)→r')">(p∧q)→r</button>
      <button class="btn btn-secondary" style="font-size:.75rem;padding:3px 8px" onclick="md1SetExpr('(p→q)∧(q→p)')">(p→q)∧(q→p)</button>
      <button class="btn btn-secondary" style="font-size:.75rem;padding:3px 8px" onclick="md1SetExpr('(p⊕q)↔((p∧¬q)∨(¬p∧q))')">(p⊕q)↔((p∧¬q)∨(¬p∧q))</button>
    </div>
    <div id="md1-truth-result" style="margin-top:12px"></div>
    
  `;
  else if (tab === 'eval') c.innerHTML = `
    
    <p style="margin-bottom:8px">Asigna valores de verdad y evalúa una expresión</p>
    <div class="split" style="margin-bottom:8px">
      <div><label>p</label><select id="md1-ep" onchange="md1EvalProp()"><option value="V">V</option><option value="F">F</option></select></div>
      <div><label>q</label><select id="md1-eq" onchange="md1EvalProp()"><option value="V">V</option><option value="F">F</option></select></div>
      <div><label>r</label><select id="md1-er" onchange="md1EvalProp()"><option value="F">F</option><option value="V">V</option></select></div>
      <div><label>s</label><select id="md1-es" onchange="md1EvalProp()"><option value="F">F</option><option value="V">V</option></select></div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <input type="text" id="md1-ee" value="(p∧q)→r" style="flex:1;min-width:180px" placeholder="Expresión" onkeydown="if(event.key==='Enter')md1EvalProp()">
      <button class="btn" onclick="md1EvalProp()">🔢 Evaluar</button>
    </div>
    ${md1Kbd('md1-ee', {vars:'pqrstu'})}
    <div id="md1-eval-result" style="margin-top:12px"></div>
    
  `;
  else if (tab === 'sets') c.innerHTML = `
    
    <p style="margin-bottom:8px">Operaciones con conjuntos. Ingresa elementos separados por coma.</p>
    <div class="split">
      <div><label>Conjunto A</label><input type="text" id="md1-sa" value="1,2,3,4,5" placeholder="1,2,3,4,5"></div>
      <div><label>Conjunto B</label><input type="text" id="md1-sb" value="4,5,6,7" placeholder="4,5,6,7"></div>
      <div><label>Conjunto C</label><input type="text" id="md1-sc" value="6,7,8,9" placeholder="6,7,8,9"></div>
    </div>
    <p style="font-size:.8rem;font-weight:600;margin:8px 0 4px;color:var(--muted)">Operaciones 2 conjuntos</p>
    <div class="btn-group">
      <button class="btn" onclick="md1SetOp('∪',2)">A ∪ B</button>
      <button class="btn" onclick="md1SetOp('∩',2)">A ∩ B</button>
      <button class="btn btn-secondary" onclick="md1SetOp('-',2)">A − B</button>
      <button class="btn btn-secondary" onclick="md1SetOp('Δ',2)">A Δ B</button>
      <button class="btn btn-secondary" onclick="md1SetOp('compl',2)">A<sup>c</sup></button>
    </div>
    <p style="font-size:.8rem;font-weight:600;margin:8px 0 4px;color:var(--muted)">Operaciones 3 conjuntos</p>
    <div class="btn-group">
      <button class="btn" onclick="md1SetOp('∪',3)">A ∪ B ∪ C</button>
      <button class="btn" onclick="md1SetOp('∩',3)">A ∩ B ∩ C</button>
      <button class="btn btn-secondary" onclick="md1SetOp('a∪b∩c',3)">(A ∪ B) ∩ C</button>
      <button class="btn btn-secondary" onclick="md1SetOp('a∩b∪c',3)">(A ∩ B) ∪ C</button>
      <button class="btn btn-secondary" onclick="md1SetOp('a−b∪c',3)">A − (B ∪ C)</button>
    </div>
    <div id="md1-sets-result" style="margin-top:12px"></div>
    <hr style="margin:16px 0;border-color:var(--border)">
    <h3 style="font-size:.9rem;margin-bottom:8px">📦 Particiones</h3>
    <p style="font-size:.8rem;margin-bottom:8px">Una <b>partición</b> de un conjunto S es una colección de subconjuntos <b>no vacíos</b>, <b>disjuntos</b> y cuya <b>unión</b> es S.</p>
    <div style="font-size:.8rem;margin-bottom:8px;padding:8px;background:var(--bg-card);border-radius:6px;border:1px solid var(--border)">
      <b>Reglas de partición:</b><br>
      &nbsp;1. P<sub>i</sub> ≠ ∅ — cada parte es <b>no vacía</b><br>
      &nbsp;2. P<sub>i</sub> ∩ P<sub>j</sub> = ∅ — las partes son <b>disjuntas</b> entre sí<br>
      &nbsp;3. ⋃ P<sub>i</sub> = S — la unión de todas las partes <b>cubre</b> todo S
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;align-items:center">
      <label style="font-size:.8rem">Conjunto S:</label>
      <input type="text" id="md1-pset" value="a,b,c" style="flex:1;max-width:200px;padding:4px" placeholder="a,b,c,d">
      <button class="btn" onclick="md1ShowPartitions()" style="font-size:.8rem">🔍 Generar Particiones</button>
    </div>
    <div id="md1-partition-result"></div>
    
  `;
  else if (tab === 'bool') c.innerHTML = `
    
    <p style="margin-bottom:8px">Álgebra de Boole: evalúa expresiones con variables <b>A, B, C</b> usando + (OR), · (AND), ¬ o ' (NOT)</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <input type="text" id="bool-expr" value="A·B + A·C" style="flex:1;min-width:180px" placeholder="Ej: A + B·C" onkeydown="if(event.key==='Enter')boolEval()">
      <button class="btn" onclick="boolEval()">📋 Generar Tabla</button>
      <button class="btn btn-secondary" onclick="document.getElementById('bool-expr').value='A + A·B';boolEval()">A+A·B</button>
      <button class="btn btn-secondary" onclick="document.getElementById('bool-expr').value='(A+B)·(A+C)';boolEval()">(A+B)(A+C)</button>
    </div>
    <div class="md1-kbd">
      <button class="kbd-var" onclick="md1Insert('bool-expr','A')">A</button>
      <button class="kbd-var" onclick="md1Insert('bool-expr','B')">B</button>
      <button class="kbd-var" onclick="md1Insert('bool-expr','C')">C</button>
      <button class="kbd-var" onclick="md1Insert('bool-expr','D')">D</button>
      <span style="width:4px"></span>
      <button class="kbd-op" onclick="md1Insert('bool-expr','+')">+ (OR)</button>
      <button class="kbd-op" onclick="md1Insert('bool-expr','·')">· (AND)</button>
      <button class="kbd-op" onclick="md1Insert('bool-expr','¬')">¬ (NOT)</button>
      <button class="kbd-op" onclick="md1Insert('bool-expr',"'")">' (NOT)</button>
      <span style="width:4px"></span>
      <button class="kbd-op" onclick="md1Insert('bool-expr','(')">(</button>
      <button class="kbd-op" onclick="md1Insert('bool-expr',')')">)</button>
      <button class="kbd-action" onclick="md1Clear('bool-expr')">C</button>
      <button class="kbd-del" onclick="md1Back('bool-expr')">⌫</button>
    </div>
    <div id="bool-result" style="margin-top:12px"></div>
    <div style="margin-top:16px;font-size:.85rem">
      <h3 style="margin-bottom:8px">Axiomas del Álgebra de Boole (B, +, ·)</h3>
      <table class="truth-table">
        <tr><th>Axioma</th><th>Forma</th></tr>
        <tr><td>1. Conmutativa</td><td>A+B = B+A &nbsp; | &nbsp; A·B = B·A</td></tr>
        <tr><td>2. Asociativa</td><td>(A+B)+C = A+(B+C) &nbsp; | &nbsp; (A·B)·C = A·(B·C)</td></tr>
        <tr><td>3. Elemento neutro</td><td>A+0 = A &nbsp; | &nbsp; A·1 = A</td></tr>
        <tr><td>4. Distributiva</td><td>A·(B+C) = A·B + A·C &nbsp; | &nbsp; A+B·C = (A+B)·(A+C)</td></tr>
        <tr><td>5. Complemento</td><td>A+¬A = 1 &nbsp; | &nbsp; A·¬A = 0</td></tr>
      </table>
    </div>
    
  `;
  else if (tab === 'gates') c.innerHTML = `
    
    <p style="margin-bottom:8px">Compuertas lógicas básicas y su representación</p>
    <div id="gates-content">
      <div class="split">
        <div class="result-box">
          <h3>NOT (Inversor)</h3>
          <pre style="font-size:.7rem;line-height:1.2;font-family:monospace">
  A ──┤==o──  ¬A
          </pre>
          <table class="truth-table" style="margin-top:4px">
            <tr><th>A</th><th>¬A</th></tr>
            <tr><td>0</td><td class="tv">1</td></tr>
            <tr><td>1</td><td class="tf">0</td></tr>
          </table>
        </div>
        <div class="result-box">
          <h3>AND</h3>
          <pre style="font-size:.7rem;line-height:1.2;font-family:monospace">
  A ──┤&  ├──  A·B
  B ──┤   │
          </pre>
          <table class="truth-table" style="margin-top:4px">
            <tr><th>A</th><th>B</th><th>A·B</th></tr>
            <tr><td>0</td><td>0</td><td class="tf">0</td></tr>
            <tr><td>0</td><td>1</td><td class="tf">0</td></tr>
            <tr><td>1</td><td>0</td><td class="tf">0</td></tr>
            <tr><td>1</td><td>1</td><td class="tv">1</td></tr>
          </table>
        </div>
        <div class="result-box">
          <h3>OR</h3>
          <pre style="font-size:.7rem;line-height:1.2;font-family:monospace">
  A ──┤≥1 ├──  A+B
  B ──┤   │
          </pre>
          <table class="truth-table" style="margin-top:4px">
            <tr><th>A</th><th>B</th><th>A+B</th></tr>
            <tr><td>0</td><td>0</td><td class="tf">0</td></tr>
            <tr><td>0</td><td>1</td><td class="tv">1</td></tr>
            <tr><td>1</td><td>0</td><td class="tv">1</td></tr>
            <tr><td>1</td><td>1</td><td class="tv">1</td></tr>
          </table>
        </div>
        <div class="result-box">
          <h3>NAND</h3>
          <pre style="font-size:.7rem;line-height:1.2;font-family:monospace">
  A ──┤&  o──  ¬(A·B)
  B ──┤   │
          </pre>
          <table class="truth-table" style="margin-top:4px">
            <tr><th>A</th><th>B</th><th>¬(A·B)</th></tr>
            <tr><td>0</td><td>0</td><td class="tv">1</td></tr>
            <tr><td>0</td><td>1</td><td class="tv">1</td></tr>
            <tr><td>1</td><td>0</td><td class="tv">1</td></tr>
            <tr><td>1</td><td>1</td><td class="tf">0</td></tr>
          </table>
        </div>
        <div class="result-box">
          <h3>NOR</h3>
          <pre style="font-size:.7rem;line-height:1.2;font-family:monospace">
  A ──┤≥1 o──  ¬(A+B)
  B ──┤   │
          </pre>
          <table class="truth-table" style="margin-top:4px">
            <tr><th>A</th><th>B</th><th>¬(A+B)</th></tr>
            <tr><td>0</td><td>0</td><td class="tv">1</td></tr>
            <tr><td>0</td><td>1</td><td class="tf">0</td></tr>
            <tr><td>1</td><td>0</td><td class="tf">0</td></tr>
            <tr><td>1</td><td>1</td><td class="tf">0</td></tr>
          </table>
        </div>
        <div class="result-box">
          <h3>XOR</h3>
          <pre style="font-size:.7rem;line-height:1.2;font-family:monospace">
  A ──┤=1 ├──  A⊕B
  B ──┤   │
          </pre>
          <table class="truth-table" style="margin-top:4px">
            <tr><th>A</th><th>B</th><th>A⊕B</th></tr>
            <tr><td>0</td><td>0</td><td class="tf">0</td></tr>
            <tr><td>0</td><td>1</td><td class="tv">1</td></tr>
            <tr><td>1</td><td>0</td><td class="tv">1</td></tr>
            <tr><td>1</td><td>1</td><td class="tf">0</td></tr>
          </table>
        </div>
        <div class="result-box">
          <h3>XNOR</h3>
          <pre style="font-size:.7rem;line-height:1.2;font-family:monospace">
  A ──┤=1 o──  ¬(A⊕B)
  B ──┤   │
          </pre>
          <table class="truth-table" style="margin-top:4px">
            <tr><th>A</th><th>B</th><th>¬(A⊕B)</th></tr>
            <tr><td>0</td><td>0</td><td class="tv">1</td></tr>
            <tr><td>0</td><td>1</td><td class="tf">0</td></tr>
            <tr><td>1</td><td>0</td><td class="tf">0</td></tr>
            <tr><td>1</td><td>1</td><td class="tv">1</td></tr>
          </table>
        </div>
      </div>
    </div>
    
  `;
  else if (tab === 'intro') c.innerHTML = `
    
    <p style="margin-bottom:12px"><b>Introducción a la Lógica y Matemática Discreta</b></p>
    <div style="font-size:.85rem;line-height:1.8">
      <div class="result-box" style="margin-bottom:12px">
        <h3>📖 ¿Qué es la Matemática Discreta?</h3>
        <p style="font-weight:400">Rama de las matemáticas que estudia elementos <b>discretos</b> (contables, separados), a diferencia del cálculo que estudia lo continuo. Incluye lógica, teoría de conjuntos, combinatoria, grafos y álgebra booleana.</p>
      </div>
      <div class="result-box" style="margin-bottom:12px">
        <h3>📖 ¿Qué es una Proposición?</h3>
        <p style="font-weight:400">Una <b>proposición</b> es una oración declarativa que puede ser <b>verdadera</b> o <b>falsa</b>, pero no ambas a la vez. Ej: "2 + 2 = 4" (V), "5 es menor que 3" (F).</p>
      </div>
      <div class="result-box" style="margin-bottom:12px">
        <h3>📖 Conectivos Lógicos</h3>
        <p style="font-weight:400">
          <b>¬</b> Negación (NO) &nbsp;|&nbsp;
          <b>∧</b> Conjunción (Y) &nbsp;|&nbsp;
          <b>∨</b> Disyunción (O) &nbsp;|&nbsp;
          <b>⊕</b> Disyunción Exclusiva (XOR) &nbsp;|&nbsp;
          <b>→</b> Condicional (SI...ENTONCES) &nbsp;|&nbsp;
          <b>↔</b> Bicondicional (SI Y SOLO SI)
        </p>
      </div>
    </div>
    <h3 style="margin:16px 0 8px">🧩 Acertijos de Lógica</h3>
    <div id="puzzles">
      <div class="result-box" style="margin-bottom:8px">
        <p><b>1. El código de la caja fuerte</b></p>
        <p style="font-weight:400;font-size:.85rem">Una caja fuerte tiene un código de 5 dígitos (0-9). Sabes que:<br>
        • El tercer dígito es el doble del primero.<br>
        • El segundo es igual al cuarto.<br>
        • La suma del cuarto y el quinto es 10.<br>
        • La suma de todos los dígitos es 23.<br>
        • Ningún dígito se repite (excepto 2do y 4to).</p>
        <button class="btn btn-secondary" style="font-size:.8rem;padding:4px 10px;margin-top:6px" onclick="this.nextElementSibling.style.display='block'">Mostrar solución</button>
        <div style="display:none;margin-top:6px;padding:8px;background:#f0fdf4;border-radius:6px;font-size:.85rem"><b>Solución:</b> Códigos posibles: <b>26958</b>, <b>34857</b> (verificar con condiciones)</div>
      </div>
      <div class="result-box" style="margin-bottom:8px">
        <p><b>2. El enigma de las edades</b></p>
        <p style="font-weight:400;font-size:.85rem">Tres amigos (Ana, Beto y Carlos) tienen edades diferentes.<br>
        • La suma de sus edades es 72 años.<br>
        • Ana es 6 años mayor que Beto.<br>
        • Carlos es el mayor, y su edad es el doble que la de Beto.</p>
        <button class="btn btn-secondary" style="font-size:.8rem;padding:4px 10px;margin-top:6px" onclick="this.nextElementSibling.style.display='block'">Mostrar solución</button>
        <div style="display:none;margin-top:6px;padding:8px;background:#f0fdf4;border-radius:6px;font-size:.85rem"><b>Solución:</b> Ana = 24, Beto = 18, Carlos = 36. (24+18+36=72, 24=18+6, 36=2·18)</div>
      </div>
      <div class="result-box" style="margin-bottom:8px">
        <p><b>3. Rompecabezas de los colores</b></p>
        <p style="font-weight:400;font-size:.85rem">Laura, Pedro, María y Juan viven en ese orden en casas de colores distintos (Azul, verde, rojo y amarillo). Cada uno tiene una mascota diferente (Perro, gato, pájaro y pez).<br>
        • Laura no vive en la casa roja ni tiene pez.<br>
        • Pedro tiene un perro y es vecino de la casa verde.<br>
        • La casa azul está al lado de la casa del pájaro.<br>
        • María vive en la casa amarilla.<br>
        • Juan no tiene un gato.</p>
        <button class="btn btn-secondary" style="font-size:.8rem;padding:4px 10px;margin-top:6px" onclick="this.nextElementSibling.style.display='block'">Mostrar solución</button>
        <div style="display:none;margin-top:6px;padding:8px;background:#f0fdf4;border-radius:6px;font-size:.85rem"><b>Solución:</b> Laura - Verde - Pájaro, Pedro - Rojo - Perro, María - Amarillo - Gato, Juan - Azul - Pez</div>
      </div>
    </div>
    
  `;
  else if (tab === 'proof') c.innerHTML = `
    
    <p style="margin-bottom:8px">Asistente de demostración lógica</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <input type="text" id="md1-premises" value="p→q, p" style="flex:1;min-width:180px" placeholder="Premisas separadas por coma">
      <input type="text" id="md1-conclusion" value="q" style="flex:1;min-width:120px" placeholder="Conclusión">
    </div>
    ${md1Kbd('md1-premises', {vars:'pqrstu'})}
    <div class="btn-group">
      <button class="btn" onclick="md1DirectProof()">🔍 Demostración Directa</button>
      <button class="btn btn-secondary" onclick="md1IndirectProof()">🔄 Demostración Indirecta</button>
      <button class="btn btn-secondary" onclick="md1ShowRules()">📜 Reglas Básicas</button>
    </div>
    <div id="md1-proof-result" style="margin-top:12px"></div>
    
  `;
  else if (tab === 'laws') c.innerHTML = `
    
    <div style="font-size:.85rem;line-height:1.8;overflow-x:auto">
      <table class="truth-table">
        <tr><th>Ley</th><th>Forma</th></tr>
        <tr><td>Involución</td><td>¬¬p ≡ p</td></tr>
        <tr><td>Idempotencia</td><td>p∧p ≡ p, &nbsp; p∨p ≡ p</td></tr>
        <tr><td>Conmutativa</td><td>p∧q ≡ q∧p, &nbsp; p∨q ≡ q∨p</td></tr>
        <tr><td>Asociativa</td><td>(p∧q)∧r ≡ p∧(q∧r), &nbsp; (p∨q)∨r ≡ p∨(q∨r)</td></tr>
        <tr><td>Distributiva</td><td>p∧(q∨r) ≡ (p∧q)∨(p∧r), &nbsp; p∨(q∧r) ≡ (p∨q)∧(p∨r)</td></tr>
        <tr><td>De Morgan</td><td>¬(p∧q) ≡ ¬p∨¬q, &nbsp; ¬(p∨q) ≡ ¬p∧¬q</td></tr>
        <tr><td>Condicional</td><td>p→q ≡ ¬p∨q ≡ ¬q→¬p</td></tr>
        <tr><td>Bicondicional</td><td>p↔q ≡ (p∧q)∨(¬p∧¬q) ≡ (p→q)∧(q→p)</td></tr>
        <tr><td>Complemento</td><td>p∨¬p ≡ T, &nbsp; p∧¬p ≡ F</td></tr>
        <tr><td>Dominante</td><td>p∨T ≡ T, &nbsp; p∧F ≡ F</td></tr>
        <tr><td>Identidad</td><td>p∧T ≡ p, &nbsp; p∨F ≡ p</td></tr>
        <tr><td>Absorción</td><td>p∧(p∨q) ≡ p, &nbsp; p∨(p∧q) ≡ p</td></tr>
      </table>
      <h3 style="margin-top:16px">Reglas de Inferencia</h3>
      <table class="truth-table">
        <tr><th>Nombre</th><th>Forma</th></tr>
        <tr><td>Modus Ponens (MP)</td><td>p → q, p &nbsp; ∴ q</td></tr>
        <tr><td>Modus Tollens (MT)</td><td>p → q, ¬q &nbsp; ∴ ¬p</td></tr>
        <tr><td>Silogismo Hipotético (SH)</td><td>p → q, q → r &nbsp; ∴ p → r</td></tr>
        <tr><td>Silogismo Disyuntivo (SD)</td><td>p ∨ q, ¬p &nbsp; ∴ q</td></tr>
        <tr><td>Adición (Ad)</td><td>p &nbsp; ∴ p ∨ q</td></tr>
        <tr><td>Simplificación (Sim)</td><td>p ∧ q &nbsp; ∴ p</td></tr>
        <tr><td>Conjunción (Conj)</td><td>p, q &nbsp; ∴ p ∧ q</td></tr>
        <tr><td>Absorción (Abs)</td><td>p → q &nbsp; ∴ p → (p ∧ q)</td></tr>
      </table>
    </div>
    
  `;
  else if (tab === 'falacias') c.innerHTML = `
    
    <p style="margin-bottom:8px"><b>⚖️ Falacias Lógicas y Argumentos</b></p>
    <div style="font-size:.85rem;line-height:1.7">
      <div class="result-box" style="margin-bottom:10px">
        <h3>📖 ¿Qué es un argumento?</h3>
        <p style="font-weight:400">Un <b>argumento</b> es un conjunto de <b>premisas</b> que pretenden apoyar una <b>conclusión</b>.<br>
        • <b>Válido</b>: si las premisas son verdaderas, la conclusión <i>debe</i> ser verdadera.<br>
        • <b>Sólido</b>: es válido <i>y</i> todas las premisas son verdaderas.<br>
        • <b>Falacia</b>: error en el razonamiento que hace el argumento inválido o no sólido.</p>
      </div>
      <div class="result-box" style="margin-bottom:10px">
        <h3>⚠️ Falacias Formales (error en la estructura lógica)</h3>
        <table class="truth-table" style="font-size:.8rem">
          <tr><th>Falacia</th><th>Descripción</th><th>Ejemplo</th></tr>
          <tr><td><b>Afirmación del consecuente</b></td><td>p→q, q ∴ p</td><td>"Si llueve, el suelo se moja. El suelo está mojado, ∴ llueve"</td></tr>
          <tr><td><b>Negación del antecedente</b></td><td>p→q, ¬p ∴ ¬q</td><td>"Si estudias, apruebas. No estudiaste, ∴ no apruebas"</td></tr>
          <tr><td><b>Silogismo disyuntivo falaz</b></td><td>p∨q, p ∴ ¬q</td><td>"Es café o té. Es café, ∴ no es té" (podría ser ambos)</td></tr>
          <tr><td><b>Petición de principio</b></td><td>La conclusión está implícita en las premisas</td><td>"Dios existe porque la Biblia lo dice, y la Biblia es la palabra de Dios"</td></tr>
        </table>
      </div>
      <div class="result-box" style="margin-bottom:10px">
        <h3>⚠️ Falacias Informales (error en el contenido)</h3>
        <table class="truth-table" style="font-size:.8rem">
          <tr><th>Falacia</th><th>Descripción</th></tr>
          <tr><td><b>Ad Hominem</b></td><td>Atacar a la persona en lugar de al argumento</td></tr>
          <tr><td><b>Hombre de Paja</b></td><td>Distorsionar el argumento del oponente para refutarlo fácilmente</td></tr>
          <tr><td><b>Falsa Dicotomía</b></td><td>Presentar solo dos opciones cuando hay más</td></tr>
          <tr><td><b>Apelación a la Autoridad</b></td><td>Usar una autoridad no calificada como prueba</td></tr>
          <tr><td><b>Pendiente Resbaladiza</b></td><td>Afirmar que un paso pequeño lleva inevitablemente a una cadena de eventos extremos</td></tr>
          <tr><td><b>Apelación a la Emoción</b></td><td>Manipular emociones en lugar de dar evidencia lógica</td></tr>
          <tr><td><b>Generalización Apresurada</b></td><td>Conclusión basada en evidencia insuficiente</td></tr>
          <tr><td><b>Post Hoc Ergo Propter Hoc</b></td><td>"Después de esto, ∴ a causa de esto" — confundir correlación con causalidad</td></tr>
          <tr><td><b>Tu Quoque</b></td><td>"Tú también" — desviar la crítica señalando hipocresía</td></tr>
          <tr><td><b>Circular (Círculo vicioso)</b></td><td>La conclusión es igual a una de las premisas</td></tr>
        </table>
      </div>
    </div>
    <hr style="margin:12px 0;border-color:var(--border)">
    <p style="font-size:.85rem;font-weight:600;margin-bottom:6px">🎯 Identificador de Falacias</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
      <input type="text" id="md1-falacia-input" value="Si es inteligente, entonces resuelve el problema. No lo resuelve, así que no es inteligente." style="flex:1;padding:4px;font-size:.8rem">
      <button class="btn" onclick="md1DetectFalacia()" style="font-size:.8rem">🔍 Analizar</button>
    </div>
    <div id="md1-falacia-result" class="result-box" style="font-size:.85rem;min-height:20px"></div>
    
  `;
}

function boolTokenize(s) {
  const t = []; let i = 0;
  while (i < s.length) {
    if (s[i] === ' ') { i++; continue; }
    if ('()'.includes(s[i])) { t.push(s[i]); i++; continue; }
    if (/[A-D]/.test(s[i])) { t.push(s[i]); i++; continue; }
    if (s[i] === '¬' || s[i] === "'") { t.push('¬'); i++; continue; }
    if (s[i] === '·' || s[i] === '*') { t.push('∧'); i++; continue; }
    if (s[i] === '+') { t.push('∨'); i++; continue; }
    i++;
  }
  return t;
}

function boolEval() {
  const expr = $("bool-expr").value.trim();
  if (!expr) return;
  let s = expr.replace(/·/g, '∧').replace(/\+/g, '∨').replace(/'/g, '¬');
  const tokens = boolTokenize(expr);
  const pf = md1ToPostfix(tokens);
  const vars = [...new Set(tokens.filter(t => /[A-D]/.test(t)))].sort();
  if (vars.length > 4) { $("bool-result").innerHTML = '<div class="result-box error">Máximo 4 variables (A,B,C,D)</div>'; return; }
  const rows = 2 ** vars.length;
  let html = '<table class="truth-table"><thead><tr>';
  for (const v of vars) html += `<th>${v}</th>`;
  html += `<th>${expr}</th></tr></thead><tbody>`;
  for (let i = 0; i < rows; i++) {
    const vals = {};
    html += '<tr>';
    for (let j = 0; j < vars.length; j++) {
      vals[vars[j]] = !!(i & (1 << (vars.length - 1 - j)));
      html += `<td>${vals[vars[j]] ? '1' : '0'}</td>`;
    }
    html += `<td class="${md1EvalPF(pf,vals) ? 'tv' : 'tf'}">${md1EvalPF(pf,vals) ? '1' : '0'}</td></tr>`;
  }
  html += '</tbody></table>';
  const allVals = Array.from({length: rows}, (_, i) => {
    const vals = {};
    for (let j = 0; j < vars.length; j++) vals[vars[j]] = !!(i & (1 << (vars.length - 1 - j)));
    return md1EvalPF(pf, vals);
  });
  if (rows > 0 && allVals.every(Boolean)) html += '<div class="result-box" style="margin-top:8px;background:#d1fae5;color:#065f46">✅ Siempre verdadero (1) — tautología</div>';
  if (rows > 0 && allVals.every(x => !x)) html += '<div class="result-box" style="margin-top:8px;background:#fee2e2;color:#991b1b">❌ Siempre falso (0)</div>';
  $("bool-result").innerHTML = html;
}

function md1SetExpr(e) { $("md1-expr").value = e; md1Truth(); }

function md1Truth() {
  const expr = $("md1-expr").value.trim();
  if (!expr) return;
  const tokens = md1Tokenize(expr);
  const pf = md1ToPostfix(tokens);
  const vars = [...new Set(tokens.filter(t => /[a-z]/.test(t)))].sort();
  if (vars.length > 5) { $("md1-truth-result").innerHTML = '<div class="result-box error">Máximo 5 variables (p,q,r,s,t)</div>'; return; }
  const rows = 2 ** vars.length;
  let html = '<table class="truth-table"><thead><tr>';
  for (const v of vars) html += `<th>${v}</th>`;
  html += `<th>${expr}</th></tr></thead><tbody>`;
  for (let i = 0; i < rows; i++) {
    const vals = {};
    html += '<tr>';
    for (let j = 0; j < vars.length; j++) {
      vals[vars[j]] = !!(i & (1 << (vars.length - 1 - j)));
      html += `<td>${vals[vars[j]] ? 'V' : 'F'}</td>`;
    }
    html += `<td class="${md1EvalPF(pf,vals) ? 'tv' : 'tf'}">${md1EvalPF(pf,vals) ? 'V' : 'F'}</td></tr>`;
  }
  html += '</tbody></table>';
  const last = md1EvalPF(pf, Object.fromEntries(vars.map(v => [v, true])));
  const tautology = rows > 0 && Array.from({length: rows}, (_, i) => {
    const vals = {};
    for (let j = 0; j < vars.length; j++) vals[vars[j]] = !!(i & (1 << (vars.length - 1 - j)));
    return md1EvalPF(pf, vals);
  }).every(Boolean);
  if (tautology) html += '<div class="result-box" style="margin-top:8px;background:#d1fae5;color:#065f46">✅ Tautología: verdadero para todas las combinaciones</div>';
  const contradiction = rows > 0 && Array.from({length: rows}, (_, i) => {
    const vals = {};
    for (let j = 0; j < vars.length; j++) vals[vars[j]] = !!(i & (1 << (vars.length - 1 - j)));
    return md1EvalPF(pf, vals);
  }).every(x => !x);
  if (contradiction) html += '<div class="result-box" style="margin-top:8px;background:#fee2e2;color:#991b1b">❌ Contradicción: falso para todas las combinaciones</div>';
  $("md1-truth-result").innerHTML = html;
}

function md1EvalProp() {
  const expr = $("md1-ee").value.trim();
  const ids = { p: 'md1-ep', q: 'md1-eq', r: 'md1-er', s: 'md1-es' };
  const vals = {};
  for (const [k, id] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el) vals[k] = el.value === 'V';
  }
  const tokens = md1Tokenize(expr);
  const pf = md1ToPostfix(tokens);
  const result = md1EvalPF(pf, vals);
  const showVals = Object.entries(vals).filter(([k]) => expr.includes(k)).map(([k,v]) => `${k} = ${v ? 'V' : 'F'}`);
  $("md1-eval-result").innerHTML = `
    <div class="result-box" style="text-align:center;font-size:1.3rem;padding:16px">
      ${result ? '✅ Verdadero (V)' : '❌ Falso (F)'}
    </div>
    <div style="margin-top:8px;font-size:.85rem;color:var(--muted)">
      ${showVals.join(', ')} &nbsp;|&nbsp; ${expr} = <strong>${result ? 'V' : 'F'}</strong>
    </div>
  `;
}

function md1SetOp(op, n=2) {
  const a = $("md1-sa").value.split(',').map(x => x.trim()).filter(Boolean);
  const b = $("md1-sb").value.split(',').map(x => x.trim()).filter(Boolean);
  const c = $("md1-sc").value.split(',').map(x => x.trim()).filter(Boolean);
  const setA = new Set(a), setB = new Set(b), setC = new Set(c);
  let result, label;
  if (n === 2) {
    if (op === '∪') { result = new Set([...setA, ...setB]); label = 'A ∪ B'; }
    else if (op === '∩') { result = new Set([...setA].filter(x => setB.has(x))); label = 'A ∩ B'; }
    else if (op === '-') { result = new Set([...setA].filter(x => !setB.has(x))); label = 'A − B'; }
    else if (op === 'Δ') { result = new Set([...setA].filter(x => !setB.has(x)).concat([...setB].filter(x => !setA.has(x)))); label = 'A Δ B'; }
    else if (op === 'compl') { result = new Set(a.filter(x => !setB.has(x))); label = 'A<sup>c</sup>'; }
  } else {
    if (op === '∪') { result = new Set([...setA, ...setB, ...setC]); label = 'A ∪ B ∪ C'; }
    else if (op === '∩') { result = new Set([...setA].filter(x => setB.has(x) && setC.has(x))); label = 'A ∩ B ∩ C'; }
    else if (op === 'a∪b∩c') { result = new Set([...new Set([...setA, ...setB])].filter(x => setC.has(x))); label = '(A ∪ B) ∩ C'; }
    else if (op === 'a∩b∪c') { result = new Set([...new Set([...setA].filter(x => setB.has(x))), ...setC]); label = '(A ∩ B) ∪ C'; }
    else if (op === 'a−b∪c') { result = new Set([...setA].filter(x => !setB.has(x) && !setC.has(x))); label = 'A − (B ∪ C)'; }
  }
  const arr = result ? [...result].sort((a,b) => isNaN(a)||isNaN(b) ? String(a).localeCompare(b) : a-b) : [];
  let html = '<div class="split">';
  html += `<div class="result-box"><b>A</b> = {${[...setA].join(', ')}} &nbsp; |A| = ${setA.size}</div>`;
  html += `<div class="result-box"><b>B</b> = {${[...setB].join(', ')}} &nbsp; |B| = ${setB.size}</div>`;
  if (n === 3) html += `<div class="result-box"><b>C</b> = {${[...setC].join(', ')}} &nbsp; |C| = ${setC.size}</div>`;
  html += '</div>';
  html += `<div class="result-box" style="font-size:1.1rem;margin-top:8px"><b>${label}</b> = {${arr.join(', ')}} &nbsp; |${label.replace(/<sup>c<\/sup>/,'')}| = ${arr.length}</div>`;
  $("md1-sets-result").innerHTML = html;
}

function md1DirectProof() {
  const premises = $("md1-premises").value.split(',').map(s => s.trim()).filter(Boolean);
  const conclusion = $("md1-conclusion").value.trim();
  if (!premises.length || !conclusion) return;
  const allVars = [...new Set((premises.join('') + conclusion).match(/[a-z]/g) || [])].sort();
  if (allVars.length > 5) { $("md1-proof-result").innerHTML = '<div class="result-box error">Demasiadas variables</div>'; return; }
  const rows = 2 ** allVars.length;
  let valid = true;
  for (let i = 0; i < rows; i++) {
    const vals = {};
    for (let j = 0; j < allVars.length; j++) vals[allVars[j]] = !!(i & (1 << (allVars.length - 1 - j)));
    const premisesTrue = premises.every(p => {
      const tokens = md1Tokenize(p);
      const pf = md1ToPostfix(tokens);
      return md1EvalPF(pf, vals);
    });
    if (premisesTrue) {
      const concTokens = md1Tokenize(conclusion);
      const concPF = md1ToPostfix(concTokens);
      const concVal = md1EvalPF(concPF, vals);
      if (!concVal) { valid = false; break; }
    }
  }
  $("md1-proof-result").innerHTML = valid
    ? `<div class="result-box" style="background:#d1fae5;color:#065f46;font-size:1rem;">
        ✅ El argumento es <b>válido</b> por demostración directa.<br>
        <span style="font-size:.85rem">Premisas: ${premises.join(', ')} &nbsp; ∴ ${conclusion}</span>
       </div>`
    : `<div class="result-box" style="background:#fee2e2;color:#991b1b;font-size:1rem;">
        ❌ El argumento es <b>inválido</b>. Existe una combinación donde las premisas son V y la conclusión F.<br>
        <span style="font-size:.85rem">Premisas: ${premises.join(', ')} &nbsp; ∴ ${conclusion}</span>
       </div>`;
}

function md1IndirectProof() {
  const premises = $("md1-premises").value.split(',').map(s => s.trim()).filter(Boolean);
  const conclusion = $("md1-conclusion").value.trim();
  if (!premises.length || !conclusion) return;
  const allVars = [...new Set((premises.join('') + conclusion).match(/[a-z]/g) || [])].sort();
  if (allVars.length > 5) { $("md1-proof-result").innerHTML = '<div class="result-box error">Demasiadas variables</div>'; return; }
  const rows = 2 ** allVars.length;
  let contradictionFound = true;
  for (let i = 0; i < rows; i++) {
    const vals = {};
    for (let j = 0; j < allVars.length; j++) vals[allVars[j]] = !!(i & (1 << (allVars.length - 1 - j)));
    const premisesTrue = premises.every(p => {
      const tokens = md1Tokenize(p);
      const pf = md1ToPostfix(tokens);
      return md1EvalPF(pf, vals);
    });
    const concTokens = md1Tokenize(conclusion);
    const concPF = md1ToPostfix(concTokens);
    const concNeg = !md1EvalPF(concPF, vals);
    if (premisesTrue && concNeg) {
      const negTokens = md1Tokenize('¬(' + conclusion + ')');
      const negPF = md1ToPostfix(negTokens);
      contradictionFound = false;
      break;
    }
  }
  $("md1-proof-result").innerHTML = contradictionFound
    ? `<div class="result-box" style="background:#d1fae5;color:#065f46;font-size:1rem;">
        ✅ El argumento es <b>válido</b> por demostración indirecta (reducción al absurdo).<br>
        <span style="font-size:.85rem">Asumir ¬(${conclusion}) junto a las premisas lleva a contradicción.</span>
       </div>`
    : `<div class="result-box" style="background:#fee2e2;color:#991b1b;font-size:1rem;">
        ❌ El argumento es <b>inválido</b>. La negación de la conclusión no genera contradicción.<br>
        <span style="font-size:.85rem">Premisas: ${premises.join(', ')} &nbsp; ∴ ${conclusion}</span>
       </div>`;
}

function md1ShowRules() {
  md1Tab('laws');
}


function md1ShowPartitions() {
  const s = $("md1-pset")?.value.split(',').map(x => x.trim()).filter(Boolean);
  if (!s || s.length === 0) { $("md1-partition-result").innerHTML = '<div class="result-box error">Ingresa elementos válidos</div>'; return; }
  if (s.length > 5) { $("md1-partition-result").innerHTML = '<div class="result-box error">Máximo 5 elementos por rendimiento</div>'; return; }
  const n = s.length;
  const allParts = [];
  function generatePartitions(elems) {
    if (elems.length === 0) return [[]];
    const [first, ...rest] = elems;
    const partitions = [];
    for (const sub of generatePartitions(rest)) {
      partitions.push([[first], ...sub]);
      for (let i = 0; i < sub.length; i++) {
        const copy = sub.map(b => [...b]);
        copy[i] = [first, ...copy[i]];
        partitions.push(copy);
      }
    }
    return partitions;
  }
  const partitions = generatePartitions(s);
  const bell = [1,1,2,5,15,52,203,877,4140,21147];
  let html = `<div style="font-size:.8rem;margin-bottom:8px">`;
  html += `<b>Número de Bell</b> B(${n}) = <b style="color:#6366f1">${bell[n]}</b> &nbsp; (total de particiones de un conjunto de ${s.length} elementos)<br>`;
  html += `Elementos: {${s.join(', ')}}</div>`;
  html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px;font-size:.75rem">`;
  for (let i = 0; i < partitions.length; i++) {
    const block = partitions[i].map(part => `{${part.join(',')}}`).join(' ');
    html += `<div style="padding:4px 8px;background:var(--bg-card);border-radius:4px;border:1px solid var(--border)">${block}</div>`;
  }
  html += `</div>`;
  $("md1-partition-result").innerHTML = html;
}


function md1DetectFalacia() {
  const text = $("md1-falacia-input")?.value.trim();
  if (!text) return;
  const lower = text.toLowerCase();
  const patterns = [
    { name: 'Afirmación del consecuente', desc: '"Si P entonces Q, Q ∴ P" — la conclusión no se sigue lógicamente.',
      pattern: /si.*entonces.*,\s*.+,\s*(?:así que|entonces|por lo tanto|∴)\s*(?!no)/i },
    { name: 'Negación del antecedente', desc: '"Si P entonces Q, no P ∴ no Q" — la conclusión no se sigue lógicamente.',
      pattern: /si.*entonces.*,?\s*(?:no|¬)\s*.*,\s*(?:así que|entonces|por lo tanto|∴)\s*(?:no|¬)/i },
    { name: 'Generalización apresurada', desc: 'Conclusión general basada en muy pocos casos particulares.',
      pattern: /(?:todos?|siempre|nunca|nadie|todo el mundo).*(?:porque|ya que|basado en|vi).*(?:un|una|uno?|algunos?|pocos)/i },
    { name: 'Falsa dicotomía', desc: 'Presenta solo dos opciones cuando existen más alternativas.',
      pattern: /(?:o|or).*(?:o|or)\s+(?:no hay más|sin más|solamente|únicamente|forzosamente|necesariamente)/i },
    { name: 'Pendiente resbaladiza', desc: 'Asume que un primer paso inevitablemente lleva a una cadena de eventos extremos.',
      pattern: /(?:llevará?|conducirá?|terminará?|acabará?|desembocará?).*(?:catástrofe|desastre|caos|ruina|destrucción|apocalipsis)/i },
    { name: 'Ad Hominem', desc: 'Ataca a la persona en lugar de refutar su argumento.',
      pattern: /(?:eres (?:un|una) |tú (?:solo|siempre) |no entiendes|ignorante|estúpido|idiota|no sabes de lo que hablas)/i },
    { name: 'Apelación a la autoridad', desc: 'Usa una autoridad no calificada como evidencia.',
      pattern: /(?:experto|autoridad|doctor|profesor|científico dice|especialista afirma|según).*(?:por lo tanto|así que|entonces|∴|por eso)/i },
    { name: 'Post Hoc', desc: 'Confunde correlación con causalidad — "después de esto, por lo tanto a causa de esto".',
      pattern: /(?:después de|tras|desde que|luego de).*,?\s*(?:por lo tanto|entonces|así que|∴)\s*/i },
    { name: 'Petición de principio (circular)', desc: 'La conclusión está implícita en las premisas — argumento circular.',
      pattern: /(?:porque|ya que).*\1/i },
    { name: 'Apelación a la emoción', desc: 'Manipula emociones (miedo, lástima, orgullo) en lugar de dar evidencia.',
      pattern: /(?:piensa en los niños|imagina el sufrimiento|qué pasaría si|ten compasión|por el bien de|por amor a|ten piedad)/i },
  ];
  let found = [];
  for (const f of patterns) {
    if (f.pattern.test(text)) { found.push(f); }
  }
  if (found.length > 0) {
    let html = `<div style="margin-bottom:6px">⚠️ Posible(s) falacia(s) detectada(s):</div>`;
    for (const f of found) {
      html += `<div style="padding:6px 10px;margin-bottom:6px;background:#fef3c7;border-radius:6px;border-left:4px solid #f59e0b">
        <b style="color:#92400e">${f.name}</b><br><span style="color:#6b7280;font-size:.8rem">${f.desc}</span>
      </div>`;
    }
    $("md1-falacia-result").innerHTML = html;
  } else {
    $("md1-falacia-result").innerHTML = `
      <div style="padding:8px;background:#d1fae5;border-radius:6px;border-left:4px solid #10b981">
        ✅ No se detectaron falacias comunes en el texto.<br>
        <span style="font-size:.8rem;color:#6b7280">(Análisis básico basado en patrones — puede no detectar todas las falacias)</span>
      </div>`;
  }
}


function md1StudyTab(tab) {
  const c = $("md1-study-content");
  if (!c) return;
  const t = {
    logic: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>🧠 Lógica Proposicional Interactiva</b></p>
      <div style="background:var(--bg-card);border-radius:8px;padding:12px;margin-bottom:12px;border:1px solid var(--border)">
        <p style="font-size:.8rem;margin-bottom:8px">Escribe una expresión lógica con variables <b>p, q, r</b> y operadores <b>¬ ∧ ∨ ⊕ → ↔</b></p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
          <input type="text" id="study-logic-expr" value="p ∧ q → r" style="flex:1;font-family:monospace;font-size:1rem" onkeydown="if(event.key==='Enter')md1StudyLogic()">
          <button class="btn" onclick="md1StudyLogic()">Generar</button>
        </div>
        <div class="md1-kbd" style="font-size:.8rem">
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="md1SInsert('¬')">¬</button>
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="md1SInsert('∧')">∧</button>
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="md1SInsert('∨')">∨</button>
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="md1SInsert('⊕')">⊕</button>
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="md1SInsert('→')">→</button>
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="md1SInsert('↔')">↔</button>
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="md1SInsert('(')">(</button>
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="md1SInsert(')')">)</button>
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="md1SClear()">C</button>
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:.75rem" onclick="md1SBack()">⌫</button>
        </div>
      </div>
      <div id="study-logic-result"></div>
      <div style="margin-top:12px">
        <p style="font-size:.85rem;font-weight:600;margin-bottom:6px">🎯 Ejemplos rápidos:</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-logic-expr').value='p ∧ q';md1StudyLogic()">p ∧ q</button>
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-logic-expr').value='p ∨ q';md1StudyLogic()">p ∨ q</button>
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-logic-expr').value='p → q';md1StudyLogic()">p → q</button>
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-logic-expr').value='p ↔ q';md1StudyLogic()">p ↔ q</button>
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-logic-expr').value='p ⊕ q';md1StudyLogic()">p ⊕ q</button>
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-logic-expr').value='¬(p ∧ q) ↔ ¬p ∨ ¬q';md1StudyLogic()">De Morgan</button>
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-logic-expr').value='(p → q) ∧ (q → r) → (p → r)';md1StudyLogic()">Silogismo</button>
        </div>
      </div>
    `,
    sets: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>📊 Diagramas de Venn Interactivos</b></p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;align-items:center">
        <label style="font-size:.8rem">A: <input type="text" id="venn-elems-a" value="1,2,3,4" style="width:100px;padding:4px" oninput="md1StudySetsVenn()"></label>
        <label style="font-size:.8rem">B: <input type="text" id="venn-elems-b" value="3,4,5,6" style="width:100px;padding:4px" oninput="md1StudySetsVenn()"></label>
        <label style="font-size:.8rem">C: <input type="text" id="venn-elems-c" value="4,5,7,8" style="width:100px;padding:4px" oninput="md1StudySetsVenn()"></label>
      </div>
      <div style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:4px;font-size:.8rem">
        <b style="margin-right:6px">2 conjuntos:</b>
        <button class="btn btn-secondary" onclick="md1StudySetOp('∪',2)" style="padding:3px 8px;font-size:.75rem">A∪B</button>
        <button class="btn btn-secondary" onclick="md1StudySetOp('∩',2)" style="padding:3px 8px;font-size:.75rem">A∩B</button>
        <button class="btn btn-secondary" onclick="md1StudySetOp('−',2)" style="padding:3px 8px;font-size:.75rem">A−B</button>
        <button class="btn btn-secondary" onclick="md1StudySetOp('Δ',2)" style="padding:3px 8px;font-size:.75rem">AΔB</button>
      </div>
      <div style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:8px;font-size:.8rem">
        <b style="margin-right:6px">3 conjuntos:</b>
        <button class="btn btn-secondary" onclick="md1StudySetOp('∪',3)" style="padding:3px 8px;font-size:.75rem">A∪B∪C</button>
        <button class="btn btn-secondary" onclick="md1StudySetOp('∩',3)" style="padding:3px 8px;font-size:.75rem">A∩B∩C</button>
        <button class="btn btn-secondary" onclick="md1StudySetOp('a∪b∩c',3)" style="padding:3px 8px;font-size:.75rem">(A∪B)∩C</button>
        <button class="btn btn-secondary" onclick="md1StudySetOp('a∩b∪c',3)" style="padding:3px 8px;font-size:.75rem">(A∩B)∪C</button>
        <button class="btn btn-secondary" onclick="md1StudySetOp('a−b∪c',3)" style="padding:3px 8px;font-size:.75rem">A−(B∪C)</button>
      </div>
      <canvas id="venn-canvas" width="480" height="360"></canvas>
      <div id="venn-result" class="result-box" style="margin-top:8px;font-size:.85rem;text-align:center"></div>
    `,
    bool: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>⚡ Álgebra de Boole Interactiva</b></p>
      <div style="background:var(--bg-card);border-radius:8px;padding:12px;margin-bottom:12px;border:1px solid var(--border)">
        <p style="font-size:.8rem;margin-bottom:8px">Variables: <b>A, B, C, D</b> &nbsp; Operadores: <b>·</b> (AND), <b>+</b> (OR), <b>'</b> o <b>¬</b> (NOT)</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <input type="text" id="study-bool-expr" value="A·B + B·C" style="flex:1;font-family:monospace;font-size:1rem" onkeydown="if(event.key==='Enter')md1StudyBool()">
          <button class="btn" onclick="md1StudyBool()">Evaluar</button>
        </div>
        <div style="margin-top:8px;font-size:.75rem" class="md1-kbd">
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="md1SInsert('A')">A</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="md1SInsert('B')">B</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="md1SInsert('C')">C</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="md1SInsert('D')">D</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="md1SInsert('·')">·</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="md1SInsert('+')">+</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="md1SInsert('¬')">¬</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="md1SInsert('(')">(</button>
          <button class="btn btn-secondary" style="padding:2px 8px" onclick="md1SInsert(')')">)</button>
        </div>
      </div>
      <div id="study-bool-result"></div>
      <div style="margin-top:12px">
        <p style="font-size:.85rem;font-weight:600;margin-bottom:6px">🎯 Ejemplos:</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-bool-expr').value='A·B';md1StudyBool()">A·B</button>
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-bool-expr').value='A+B';md1StudyBool()">A+B</button>
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-bool-expr').value='¬A·B + A·¬B';md1StudyBool()">XOR</button>
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-bool-expr').value='A·(B+C)';md1StudyBool()">A·(B+C)</button>
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-bool-expr').value='¬(A·B)';md1StudyBool()">NAND</button>
          <button class="btn btn-secondary" style="padding:4px 12px;font-size:.75rem" onclick="document.getElementById('study-bool-expr').value='¬A·¬B';md1StudyBool()">NOR</button>
        </div>
      </div>
    `
  };
  c.innerHTML = (t[tab] || t.logic) ;
  if (tab === 'logic') setTimeout(md1StudyLogic, 50);
  if (tab === 'sets') setTimeout(md1StudySetsVenn, 50);
  if (tab === 'bool') setTimeout(md1StudyBool, 50);
}

let studySetOp = '∪', studySetN = 2;

function md1SInsert(ch) {
  const inp = document.getElementById('study-logic-expr') || document.getElementById('study-bool-expr');
  if (!inp) return;
  const start = inp.selectionStart, end = inp.selectionEnd;
  inp.value = inp.value.substring(0, start) + ch + inp.value.substring(end);
  inp.selectionStart = inp.selectionEnd = start + ch.length;
  inp.focus();
}
function md1SClear() {
  const inp = document.getElementById('study-logic-expr');
  if (inp) { inp.value = ""; inp.focus(); }
}
function md1SBack() {
  const inp = document.getElementById('study-logic-expr');
  if (!inp) return;
  const start = inp.selectionStart;
  if (start > 0) {
    inp.value = inp.value.substring(0, start-1) + inp.value.substring(inp.selectionEnd);
    inp.selectionStart = inp.selectionEnd = start - 1;
  }
  inp.focus();
}

function md1StudyLogic() {
  const expr = $("study-logic-expr")?.value.trim();
  if (!expr) return;
  const tokens = md1Tokenize(expr);
  const pf = md1ToPostfix(tokens);
  const vars = [...new Set(tokens.filter(t => /^[a-z]$/.test(t)))].sort();
  if (vars.length > 4) { $("study-logic-result").innerHTML = '<div class="result-box error">Máximo 4 variables</div>'; return; }
  const rows = 2 ** vars.length;
  let html = '<table class="truth-table"><thead><tr>';
  for (const v of vars) html += `<th>${v}</th>`;
  html += `<th style="background:#6366f1;color:#fff">${expr}</th></tr></thead><tbody>`;
  const colVals = [];
  for (let i = 0; i < rows; i++) {
    const vals = {};
    html += '<tr>';
    for (let j = 0; j < vars.length; j++) {
      vals[vars[j]] = !!(i & (1 << (vars.length - 1 - j)));
      html += `<td>${vals[vars[j]] ? 'V' : 'F'}</td>`;
    }
    const r = md1EvalPF(pf, vals);
    colVals.push(r);
    html += `<td class="${r ? 'tv' : 'tf'}" style="font-weight:700">${r ? 'V' : 'F'}</td></tr>`;
  }
  html += '</tbody></table>';
  const isTauto = colVals.every(Boolean);
  const isContra = colVals.every(x => !x);
  if (isTauto) html += '<div class="result-box" style="margin-top:8px;background:#d1fae5;color:#065f46;font-weight:600">✅ Tautología — siempre verdadero</div>';
  else if (isContra) html += '<div class="result-box" style="margin-top:8px;background:#fee2e2;color:#991b1b;font-weight:600">❌ Contradicción — siempre falso</div>';
  else html += '<div class="result-box" style="margin-top:8px;background:#fef3c7;color:#92400e;font-weight:600">⚠️ Contingencia — depende de los valores</div>';
  const nV = colVals.filter(Boolean).length, nF = colVals.filter(x => !x).length;
  html += `<div style="font-size:.8rem;color:var(--muted);margin-top:6px;text-align:center">V: ${nV} &nbsp;|&nbsp; F: ${nF} &nbsp;|&nbsp; Filas: ${rows}</div>`;
  $("study-logic-result").innerHTML = html;
}

function md1StudySetOp(op, n) {
  studySetOp = op;
  if (n) studySetN = n;
  md1StudySetsVenn();
}

function md1StudySetsVenn() {
  const canvas = $("venn-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const aStr = $("venn-elems-a")?.value || "";
  const bStr = $("venn-elems-b")?.value || "";
  const cStr = $("venn-elems-c")?.value || "";
  const setA = new Set(aStr.split(',').map(x => x.trim()).filter(Boolean));
  const setB = new Set(bStr.split(',').map(x => x.trim()).filter(Boolean));
  const setC = new Set(cStr.split(',').map(x => x.trim()).filter(Boolean));
  const onlyA = [...setA].filter(x => !setB.has(x) && !setC.has(x));
  const onlyB = [...setB].filter(x => !setA.has(x) && !setC.has(x));
  const onlyC = [...setC].filter(x => !setA.has(x) && !setB.has(x));
  const abOnly = [...setA].filter(x => setB.has(x) && !setC.has(x));
  const acOnly = [...setA].filter(x => setC.has(x) && !setB.has(x));
  const bcOnly = [...setB].filter(x => setC.has(x) && !setA.has(x));
  const abcAll = [...setA].filter(x => setB.has(x) && setC.has(x));
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  const r = 105, dx = 70, dy = 38, dcy = 55;
  const cx = W/2, cy = H/2 - 5;
  const centers = [
    {x: cx - dx, y: cy - dy},  // A
    {x: cx + dx, y: cy - dy},  // B
    {x: cx, y: cy + dcy}       // C
  ];
  const inResult = (inA, inB, inC) => {
    if (studySetN === 2) {
      if (studySetOp === '∪') return inA || inB;
      if (studySetOp === '∩') return inA && inB;
      if (studySetOp === '−') return inA && !inB;
      if (studySetOp === 'Δ') return (inA || inB) && !(inA && inB);
      return false;
    } else {
      if (studySetOp === '∪') return inA || inB || inC;
      if (studySetOp === '∩') return inA && inB && inC;
      if (studySetOp === 'a∪b∩c') return (inA || inB) && inC;
      if (studySetOp === 'a∩b∪c') return (inA && inB) || inC;
      if (studySetOp === 'a−b∪c') return inA && !inB && !inC;
      return false;
    }
  };
  const drawFilled = (maskFn) => {
    ctx.fillStyle = "rgba(139,92,246,0.35)";
    for (const c of centers) { ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI*2); ctx.fill(); }
    ctx.globalCompositeOperation = 'destination-out';
    for (const c of centers) {
      if (!maskFn(c === centers[0], c === centers[1], c === centers[2])) {
        ctx.save();
        ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI*2); ctx.clip();
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  };
  if (studySetOp === '∩' && studySetN === 2) {
    ctx.beginPath(); ctx.arc(centers[0].x, centers[0].y, r, 0, Math.PI*2); ctx.clip();
    ctx.fillStyle = "rgba(139,92,246,0.6)";
    ctx.beginPath(); ctx.arc(centers[1].x, centers[1].y, r, 0, Math.PI*2); ctx.fill();
  } else if (studySetOp === '∪' && studySetN === 2) {
    ctx.fillStyle = "rgba(139,92,246,0.3)";
    for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.arc(centers[i].x, centers[i].y, r, 0, Math.PI*2); ctx.fill(); }
  } else if (studySetOp === '−' && studySetN === 2) {
    ctx.fillStyle = "rgba(59,130,246,0.5)";
    ctx.beginPath(); ctx.arc(centers[0].x, centers[0].y, r, 0, Math.PI*2); ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(centers[1].x, centers[1].y, r, 0, Math.PI*2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = "rgba(59,130,246,0.2)";
    ctx.beginPath(); ctx.arc(centers[0].x, centers[0].y, r, 0, Math.PI*2); ctx.fill();
  } else if (studySetOp === 'Δ' && studySetN === 2) {
    ctx.fillStyle = "rgba(139,92,246,0.25)";
    for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.arc(centers[i].x, centers[i].y, r, 0, Math.PI*2); ctx.fill(); }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath(); ctx.arc(centers[0].x, centers[0].y, r, 0, Math.PI*2); ctx.clip();
    ctx.beginPath(); ctx.arc(centers[1].x, centers[1].y, r, 0, Math.PI*2); ctx.fill();
  } else if (studySetN === 3) {
    ctx.fillStyle = "rgba(139,92,246,0.3)";
    for (const c of centers) { ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI*2); ctx.fill(); }
  }
  ctx.restore();
  for (const c of centers) { ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI*2); ctx.stroke(); }
  ctx.fillStyle = "#1e293b"; ctx.font = "bold 18px sans-serif"; ctx.textAlign = "center";
  ctx.fillText("A", centers[0].x - r/2 - 10, centers[0].y + 6);
  ctx.fillText("B", centers[1].x + r/2 + 10, centers[1].y + 6);
  ctx.fillText("C", centers[2].x, centers[2].y + r/2 + 18);
  ctx.font = "11px sans-serif"; ctx.fillStyle = "#475569";
  ctx.fillText(onlyA.join(', '), centers[0].x - r/2 - 5, centers[0].y);
  ctx.fillText(onlyB.join(', '), centers[1].x + r/2 + 5, centers[1].y);
  ctx.fillText(onlyC.join(', '), centers[2].x, centers[2].y + r/2 + 6);
  ctx.fillText(abOnly.join(', '), (centers[0].x + centers[1].x)/2, centers[0].y + 5);
  ctx.fillText(acOnly.join(', '), (centers[0].x + centers[2].x)/2, (centers[0].y + centers[2].y)/2 - 8);
  ctx.fillText(bcOnly.join(', '), (centers[1].x + centers[2].x)/2, (centers[1].y + centers[2].y)/2 - 8);
  ctx.fillText(abcAll.join(', '), cx, cy + 6);
  ctx.font = "13px sans-serif"; ctx.fillStyle = "#6366f1";
  ctx.fillText(studySetN === 2 ? `A ${studySetOp} B` : (
    studySetOp === '∪' ? 'A ∪ B ∪ C' :
    studySetOp === '∩' ? 'A ∩ B ∩ C' :
    studySetOp === 'a∪b∩c' ? '(A ∪ B) ∩ C' :
    studySetOp === 'a∩b∪c' ? '(A ∩ B) ∪ C' :
    studySetOp === 'a−b∪c' ? 'A − (B ∪ C)' : ''), W/2, 16);
  let result;
  if (studySetN === 2) {
    if (studySetOp === '∪') result = new Set([...setA, ...setB]);
    else if (studySetOp === '∩') result = new Set([...setA].filter(x => setB.has(x)));
    else if (studySetOp === '−') result = new Set(onlyA);
    else if (studySetOp === 'Δ') result = new Set([...onlyA, ...onlyB]);
  } else {
    if (studySetOp === '∪') result = new Set([...setA, ...setB, ...setC]);
    else if (studySetOp === '∩') result = new Set(abcAll);
    else if (studySetOp === 'a∪b∩c') result = new Set([...new Set([...setA, ...setB])].filter(x => setC.has(x)));
    else if (studySetOp === 'a∩b∪c') result = new Set([...new Set([...setA].filter(x => setB.has(x))), ...setC]);
    else if (studySetOp === 'a−b∪c') result = new Set(onlyA);
  }
  const arr = result ? [...result].sort() : [];
  $("venn-result").innerHTML = `
    <b>A</b>={${[...setA].join(',')}} |A|=${setA.size} &nbsp;
    <b>B</b>={${[...setB].join(',')}} |B|=${setB.size} &nbsp;
    <b>C</b>={${[...setC].join(',')}} |C|=${setC.size}<br>
    <b>${studySetN === 2 ? `A ${studySetOp} B` : studySetOp}</b> = {${arr.join(', ')}} |${arr.length}|
  `;
}

function md1StudyBool() {
  const expr = $("study-bool-expr")?.value.trim();
  if (!expr) return;
  const tokens = boolTokenize(expr);
  const pf = md1ToPostfix(tokens);
  const vars = [...new Set(tokens.filter(t => /^[A-D]$/.test(t)))].sort();
  if (vars.length > 4) { $("study-bool-result").innerHTML = '<div class="result-box error">Máximo 4 variables (A,B,C,D)</div>'; return; }
  const rows = 2 ** vars.length;
  let html = '<table class="truth-table"><thead><tr>';
  for (const v of vars) html += `<th>${v}</th>`;
  html += `<th style="background:#6366f1;color:#fff">${expr}</th></tr></thead><tbody>`;
  const colVals = [];
  for (let i = 0; i < rows; i++) {
    const vals = {};
    html += '<tr>';
    for (let j = 0; j < vars.length; j++) {
      vals[vars[j]] = !!(i & (1 << (vars.length - 1 - j)));
      html += `<td>${vals[vars[j]] ? '1' : '0'}</td>`;
    }
    const r = md1EvalPF(pf, vals);
    colVals.push(r);
    html += `<td class="${r ? 'tv' : 'tf'}" style="font-weight:700">${r ? '1' : '0'}</td></tr>`;
  }
  html += '</tbody></table>';
  const isTauto = colVals.every(Boolean);
  const isContra = colVals.every(x => !x);
  if (isTauto) html += '<div class="result-box" style="margin-top:8px;background:#d1fae5;color:#065f46">✅ Identidad booleana — siempre 1</div>';
  else if (isContra) html += '<div class="result-box" style="margin-top:8px;background:#fee2e2;color:#991b1b">❌ Siempre 0</div>';
  html += `<div style="font-size:.8rem;color:var(--muted);margin-top:6px;text-align:center">1: ${colVals.filter(Boolean).length} &nbsp;|&nbsp; 0: ${colVals.filter(x => !x).length} &nbsp;|&nbsp; Filas: ${rows}</div>`;
  $("study-bool-result").innerHTML = html;
}

function boolTokenize(s) {
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    if (' \t'.includes(s[i])) { i++; continue; }
    if ('()'.includes(s[i])) { tokens.push(s[i]); i++; continue; }
    if (s[i] === '¬') { tokens.push('¬'); i++; continue; }
    if (s[i] === '+' || s[i] === '∨') { tokens.push('∨'); i++; continue; }
    if (s[i] === '·' || s[i] === '*' || s[i] === '∧') { tokens.push('∧'); i++; continue; }
    if (s[i] === "'") { tokens.push('¬'); i++; continue; }
    if (/[A-D]/i.test(s[i])) { tokens.push(s[i].toUpperCase()); i++; continue; }
    i++;
  }
  return tokens;
}


function precalcTab(tab) {
  const c = $("precalc-content");
  if (!c) return;
  const t = {
    func: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>📈 Explorador de Funciones</b></p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;align-items:center">
        <label style="font-size:.8rem">Función:</label>
        <select id="pfunc-type" onchange="precalcFuncDraw()" style="padding:4px;font-size:.85rem">
          <option value="linear">Lineal (ax + b)</option>
          <option value="quad" selected>Cuadrática (ax² + bx + c)</option>
          <option value="cubic">Cúbica (ax³ + bx² + cx + d)</option>
          <option value="sin">seno (a·sin(bx + c) + d)</option>
          <option value="cos">coseno (a·cos(bx + c) + d)</option>
          <option value="tan">tangente (a·tan(bx))</option>
          <option value="exp">exponencial (a·e^(bx) + c)</option>
          <option value="log">logaritmo (a·ln(bx) + c)</option>
          <option value="sqrt">raíz (a·√(bx) + c)</option>
          <option value="recip">1/(ax + b)</option>
        </select>
      </div>
      <div id="pfunc-sliders" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;font-size:.75rem"></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;font-size:.75rem">
        <label>X: <input type="number" id="pfunc-xmin" value="-10" style="width:50px;padding:2px" onchange="precalcFuncDraw()">
        <input type="number" id="pfunc-xmax" value="10" style="width:50px;padding:2px" onchange="precalcFuncDraw()"></label>
        <label>Y: <input type="number" id="pfunc-ymin" value="-5" style="width:50px;padding:2px" onchange="precalcFuncDraw()">
        <input type="number" id="pfunc-ymax" value="5" style="width:50px;padding:2px" onchange="precalcFuncDraw()"></label>
        <span style="font-size:.7rem;color:var(--muted)">🖱 Arrastra para mover · Rueda zoom</span>
      </div>
      <canvas id="pfunc-canvas" width="500" height="350"></canvas>
      <div id="pfunc-info" class="result-box" style="margin-top:8px;font-size:.8rem;text-align:center"></div>
    `,
    lim: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>🎯 Límites — Visualización Interactiva</b></p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;align-items:center">
        <label style="font-size:.8rem">f(x) = </label>
        <input type="text" id="plim-fx" value="Math.sin(x)/x" style="flex:1;font-family:monospace;padding:4px" onkeydown="if(event.key==='Enter')precalcLimDraw()">
        <button class="btn" style="padding:4px 12px;font-size:.8rem" onclick="precalcLimDraw()">Graficar</button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;font-size:.8rem;align-items:center">
        <label>x → <input type="number" id="plim-target" value="0" style="width:60px;padding:4px" oninput="precalcLimDraw()"></label>
        <label>Zoom: <input type="range" id="plim-zoom" min="1" max="10" step="0.5" value="5" oninput="precalcLimDraw()" style="width:80px"></label>
        <span style="font-size:.7rem;color:var(--muted)">🖱 Arrastra para mover · Rueda zoom</span>
        <button class="btn btn-secondary" style="padding:2px 8px;font-size:.75rem" onclick="plimResetView()">⟲</button>
        <button class="btn btn-secondary" style="padding:4px 10px;font-size:.75rem" onclick="document.getElementById('plim-fx').value='(x*x-1)/(x-1)';precalcLimDraw()">(x²-1)/(x-1)</button>
        <button class="btn btn-secondary" style="padding:4px 10px;font-size:.75rem" onclick="document.getElementById('plim-fx').value='Math.sin(x)/x';precalcLimDraw()">sin(x)/x</button>
        <button class="btn btn-secondary" style="padding:4px 10px;font-size:.75rem" onclick="document.getElementById('plim-fx').value='1/x';precalcLimDraw()">1/x</button>
      </div>
      <canvas id="plim-canvas" width="500" height="350"></canvas>
      <div id="plim-info" class="result-box" style="margin-top:8px;font-size:.85rem;text-align:center"></div>
    `,
    deriv: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>📐 Derivadas — Recta Tangente</b></p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;align-items:center">
        <label style="font-size:.8rem">f(x) = </label>
        <input type="text" id="pderiv-fx" value="x*x" style="flex:1;font-family:monospace;padding:4px" onkeydown="if(event.key==='Enter')precalcDerivDraw()">
        <button class="btn" style="padding:4px 12px;font-size:.8rem" onclick="precalcDerivDraw()">Graficar</button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;font-size:.8rem;align-items:center">
        <label>x₀ = <input type="range" id="pderiv-x" min="-8" max="8" step="0.1" value="1" oninput="precalcDerivDraw()" style="width:150px">
        <span id="pderiv-xval" style="font-weight:600;min-width:30px">1</span></label>
        <span style="font-size:.7rem;color:var(--muted)">🖱 Arrastra para mover · Rueda zoom</span>
        <button class="btn btn-secondary" style="padding:2px 8px;font-size:.75rem" onclick="pderivResetView()">⟲</button>
        <button class="btn btn-secondary" style="padding:4px 10px;font-size:.75rem" onclick="document.getElementById('pderiv-fx').value='x*x';precalcDerivDraw()">x²</button>
        <button class="btn btn-secondary" style="padding:4px 10px;font-size:.75rem" onclick="document.getElementById('pderiv-fx').value='Math.sin(x)';precalcDerivDraw()">sin(x)</button>
        <button class="btn btn-secondary" style="padding:4px 10px;font-size:.75rem" onclick="document.getElementById('pderiv-fx').value='x*x*x';precalcDerivDraw()">x³</button>
        <button class="btn btn-secondary" style="padding:4px 10px;font-size:.75rem" onclick="document.getElementById('pderiv-fx').value='Math.exp(x)';precalcDerivDraw()">eˣ</button>
      </div>
      <canvas id="pderiv-canvas" width="500" height="350"></canvas>
      <div id="pderiv-info" class="result-box" style="margin-top:8px;font-size:.85rem;text-align:center"></div>
    `,
    int: `
      <p style="font-size:.9rem;margin-bottom:8px"><b>∫ Integral Definida — Sumas de Riemann</b></p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;align-items:center">
        <label style="font-size:.8rem">f(x) = </label>
        <input type="text" id="pint-fx" value="x*x" style="flex:1;font-family:monospace;padding:4px" onkeydown="if(event.key==='Enter')precalcIntDraw()">
        <button class="btn" style="padding:4px 12px;font-size:.8rem" onclick="precalcIntDraw()">Graficar</button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;font-size:.8rem;align-items:center">
        <label>a = <input type="number" id="pint-a" value="0" style="width:50px;padding:4px" oninput="precalcIntDraw()"></label>
        <label>b = <input type="number" id="pint-b" value="2" style="width:50px;padding:4px" oninput="precalcIntDraw()"></label>
        <label>Rectángulos: <input type="range" id="pint-n" min="2" max="50" step="1" value="8" oninput="precalcIntDraw()" style="width:100px">
        <span id="pint-nval" style="font-weight:600;min-width:20px">8</span></label>
        <select id="pint-type" onchange="precalcIntDraw()" style="padding:4px;font-size:.75rem">
          <option value="left">Izquierda</option>
          <option value="mid" selected>Punto medio</option>
          <option value="right">Derecha</option>
        </select>
        <span style="font-size:.7rem;color:var(--muted)">🖱 Arrastra para mover · Rueda zoom</span>
        <button class="btn btn-secondary" style="padding:2px 8px;font-size:.75rem" onclick="pintResetView()">⟲</button>
      </div>
      <canvas id="pint-canvas" width="500" height="350"></canvas>
      <div id="pint-info" class="result-box" style="margin-top:8px;font-size:.85rem;text-align:center"></div>
    `
  };
  c.innerHTML = (t[tab] || t.func) ;
  if (tab === 'func') setTimeout(precalcFuncDraw, 50);
  if (tab === 'lim') setTimeout(precalcLimDraw, 50);
  if (tab === 'deriv') setTimeout(precalcDerivDraw, 50);
  if (tab === 'int') setTimeout(precalcIntDraw, 50);
}

function precalcFuncDraw() {
  const canvas = $("pfunc-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const type = $("pfunc-type")?.value || "quad";
  const xmin = parseFloat($("pfunc-xmin")?.value || -10), xmax = parseFloat($("pfunc-xmax")?.value || 10);
  const ymin = parseFloat($("pfunc-ymin")?.value || -5), ymax = parseFloat($("pfunc-ymax")?.value || 5);
  const slidersDiv = $("pfunc-sliders");
  const paramDefs = {
    linear: [{id:'pa',label:'a (pendiente)',min:-5,max:5,step:0.1,val:1},{id:'pb',label:'b (intercepto)',min:-10,max:10,step:0.5,val:0}],
    quad: [{id:'pa',label:'a',min:-5,max:5,step:0.1,val:1},{id:'pb',label:'b',min:-10,max:10,step:0.5,val:0},{id:'pc',label:'c',min:-10,max:10,step:0.5,val:0}],
    cubic: [{id:'pa',label:'a',min:-3,max:3,step:0.1,val:1},{id:'pb',label:'b',min:-5,max:5,step:0.2,val:0},{id:'pc',label:'c',min:-5,max:5,step:0.2,val:0},{id:'pd',label:'d',min:-5,max:5,step:0.5,val:0}],
    sin: [{id:'pa',label:'amplitud',min:0.1,max:5,step:0.1,val:1},{id:'pb',label:'frecuencia',min:0.1,max:5,step:0.1,val:1},{id:'pc',label:'fase',min:-6.28,max:6.28,step:0.1,val:0},{id:'pd',label:'desplaz. Y',min:-5,max:5,step:0.5,val:0}],
    cos: [{id:'pa',label:'amplitud',min:0.1,max:5,step:0.1,val:1},{id:'pb',label:'frecuencia',min:0.1,max:5,step:0.1,val:1},{id:'pc',label:'fase',min:-6.28,max:6.28,step:0.1,val:0},{id:'pd',label:'desplaz. Y',min:-5,max:5,step:0.5,val:0}],
    tan: [{id:'pa',label:'amplitud',min:0.1,max:5,step:0.1,val:1},{id:'pb',label:'frecuencia',min:0.1,max:2,step:0.1,val:1}],
    exp: [{id:'pa',label:'a',min:0.1,max:5,step:0.1,val:1},{id:'pb',label:'b (tasa)',min:-2,max:2,step:0.1,val:0.5},{id:'pc',label:'c',min:-10,max:10,step:0.5,val:0}],
    log: [{id:'pa',label:'a',min:0.1,max:5,step:0.1,val:1},{id:'pb',label:'b',min:0.1,max:5,step:0.1,val:1},{id:'pc',label:'c',min:-5,max:5,step:0.5,val:0}],
    sqrt: [{id:'pa',label:'a',min:-3,max:3,step:0.1,val:1},{id:'pb',label:'b',min:0.1,max:3,step:0.1,val:1},{id:'pc',label:'c',min:-5,max:5,step:0.5,val:0}],
    recip: [{id:'pa',label:'a',min:-5,max:5,step:0.1,val:1},{id:'pb',label:'b',min:-10,max:10,step:0.5,val:0}],
  };
  const params = paramDefs[type] || paramDefs.quad;
  let sliderHtml = '';
  for (const p of params) {
    const el = $(p.id);
    const currentVal = el ? parseFloat(el.value) : p.val;
    sliderHtml += `<label style="display:flex;align-items:center;gap:4px;white-space:nowrap">${p.label}:
      <input type="range" id="${p.id}" min="${p.min}" max="${p.max}" step="${p.step}" value="${currentVal}" oninput="precalcFuncDraw()" style="width:80px">
      <span id="${p.id}-v" style="min-width:28px;font-weight:600">${currentVal}</span></label>`;
  }
  slidersDiv.innerHTML = sliderHtml;
  const a = parseFloat($("pa")?.value || 1), b = parseFloat($("pb")?.value || 0);
  const c = parseFloat($("pc")?.value || 0), d = parseFloat($("pd")?.value || 0);
  for (const p of params) {
    const vEl = $(p.id + '-v');
    if (vEl) vEl.textContent = parseFloat($(p.id)?.value || p.val).toFixed(p.step < 0.5 ? 2 : 1);
  }
  let fx;
  switch(type) {
    case 'linear': fx = `(${a})*x+(${b})`; break;
    case 'quad': fx = `(${a})*x*x+(${b})*x+(${c})`; break;
    case 'cubic': fx = `(${a})*x*x*x+(${b})*x*x+(${c})*x+(${d})`; break;
    case 'sin': fx = `(${a})*Math.sin((${b})*x+(${c}))+(${d})`; break;
    case 'cos': fx = `(${a})*Math.cos((${b})*x+(${c}))+(${d})`; break;
    case 'tan': fx = `(${a})*Math.tan((${b})*x)`; break;
    case 'exp': fx = `(${a})*Math.exp((${b})*x)+(${c})`; break;
    case 'log': fx = `(${a})*Math.log((${b})*x)+(${c})`; break;
    case 'sqrt': fx = `(${a})*Math.sqrt((${b})*x)+(${c})`; break;
    case 'recip': fx = `1/((${a})*x+(${b}))`; break;
  }
  ctx.clearRect(0, 0, W, H);
  const px = x => (x - xmin) / (xmax - xmin) * W;
  const py = y => H - (y - ymin) / (ymax - ymin) * H;
  ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 0.5;
  for (let i = Math.ceil(xmin); i <= Math.floor(xmax); i++) {
    if (i === 0) continue;
    ctx.beginPath(); ctx.moveTo(px(i), 0); ctx.lineTo(px(i), H); ctx.stroke();
  }
  for (let i = Math.ceil(ymin); i <= Math.floor(ymax); i++) {
    if (i === 0) continue;
    ctx.beginPath(); ctx.moveTo(0, py(i)); ctx.lineTo(W, py(i)); ctx.stroke();
  }
  ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(px(0), 0); ctx.lineTo(px(0), H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, py(0)); ctx.lineTo(W, py(0)); ctx.stroke();
  const steps = W;
  ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2.5;
  ctx.beginPath();
  let started = false;
  let roots = [];
  for (let i = 0; i <= steps; i++) {
    const x = xmin + (xmax - xmin) * i / steps;
    try {
      const y = Function("x", `return (${fx})`)(x);
      if (typeof y !== 'number' || !isFinite(y) || y < ymin || y > ymax) { started = false; continue; }
      if (!started) { ctx.moveTo(px(x), py(y)); started = true; } else ctx.lineTo(px(x), py(y));
      if (i > 0 && Math.abs(y) < 0.01) roots.push(x);
    } catch(e) { started = false; }
  }
  ctx.stroke();
  ctx.fillStyle = "#1a1a2e"; ctx.font = "12px monospace"; ctx.textAlign = "left";
  const funcNames = { linear: 'Lineal', quad: 'Cuadrática', cubic: 'Cúbica', sin: 'Seno', cos: 'Coseno', tan: 'Tangente', exp: 'Exponencial', log: 'Logarítmica', sqrt: 'Raíz', recip: '1/(ax+b)' };
  ctx.fillText(`${funcNames[type]}: f(x) = ${fx}`, 10, 16);
  const infoEl = $("pfunc-info");
  if (infoEl) {
    let info = `<b>${funcNames[type]}</b> &nbsp; f(x) = ${fx}`;
    if (type === 'quad' && a !== 0) {
      const vertexX = -b / (2*a);
      const vertexY = Function("x", `return (${fx})`)(vertexX);
      info += ` &nbsp; | &nbsp; Vértice: (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`;
      info += ` &nbsp; | &nbsp; ${a > 0 ? 'Abre hacia arriba (∪)' : 'Abre hacia abajo (∩)'}`;
    }
    infoEl.innerHTML = info;
  }
  if (!canvas._pfuncInited) {
    canvas._pfuncInited = true;
    makeGraphInteractive('pfunc-canvas', {
      xmin: () => $("pfunc-xmin")?.value || -10,
      xmax: () => $("pfunc-xmax")?.value || 10,
      ymin: () => $("pfunc-ymin")?.value || -5,
      ymax: () => $("pfunc-ymax")?.value || 5,
      xmin_set: v => { const e = $("pfunc-xmin"); if (e) e.value = v.toFixed(4); },
      xmax_set: v => { const e = $("pfunc-xmax"); if (e) e.value = v.toFixed(4); },
      ymin_set: v => { const e = $("pfunc-ymin"); if (e) e.value = v.toFixed(4); },
      ymax_set: v => { const e = $("pfunc-ymax"); if (e) e.value = v.toFixed(4); },
    }, precalcFuncDraw);
  }
}

function precalcLimDraw() {
  const canvas = $("plim-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const fx = $("plim-fx")?.value.trim() || "Math.sin(x)/x";
  const target = parseFloat($("plim-target")?.value || 0);
  const zoom = parseFloat($("plim-zoom")?.value || 5);
  if (!canvas._vpInited) {
    canvas._vpInited = false;
    canvas._vp = {};
  }
  if (!canvas._vpInited || !canvas._vp.custom) {
    const range = zoom;
    canvas._vp = { xmin: target - range, xmax: target + range, ymin: -range * 0.7, ymax: range * 0.7, custom: false };
  }
  const { xmin, xmax, ymin, ymax } = canvas._vp;
  ctx.clearRect(0, 0, W, H);
  const px = x => (x - xmin) / (xmax - xmin) * W;
  const py = y => H - (y - ymin) / (ymax - ymin) * H;
  ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 0.5;
  for (let i = Math.ceil(xmin); i <= Math.floor(xmax); i++) { if (i === 0) continue;
    ctx.beginPath(); ctx.moveTo(px(i), 0); ctx.lineTo(px(i), H); ctx.stroke(); }
  for (let i = Math.ceil(ymin); i <= Math.floor(ymax); i++) { if (i === 0) continue;
    ctx.beginPath(); ctx.moveTo(0, py(i)); ctx.lineTo(W, py(i)); ctx.stroke(); }
  ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(px(target), 0); ctx.lineTo(px(target), H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, py(0)); ctx.lineTo(W, py(0)); ctx.stroke();
  const steps = W;
  ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2.5;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= steps; i++) {
    const x = xmin + (xmax - xmin) * i / steps;
    try {
      const y = Function("x", `return (${fx})`)(x);
      if (typeof y !== 'number' || !isFinite(y) || y < ymin || y > ymax) { started = false; continue; }
      if (!started) { ctx.moveTo(px(x), py(y)); started = true; } else ctx.lineTo(px(x), py(y));
    } catch(e) { started = false; }
  }
  ctx.stroke();
  const h = 1e-8;
  let limLeft, limRight;
  try {
    const f = v => Function("x", `return (${fx})`)(v);
    limLeft = f(target - h);
    limRight = f(target + h);
  } catch(e) { limLeft = limRight = NaN; }
  if (isFinite(limLeft)) {
    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(px(target - h), py(limLeft), 5, 0, Math.PI*2); ctx.fill();
  }
  if (isFinite(limRight)) {
    ctx.fillStyle = "#22c55e"; ctx.beginPath(); ctx.arc(px(target + h), py(limRight), 5, 0, Math.PI*2); ctx.fill();
  }
  ctx.fillStyle = "#6366f1";
  ctx.beginPath(); ctx.arc(px(target), py(target > xmin && target < xmax ? Function("x", `return (${fx})`)(target) : 0), 6, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = "#1a1a2e"; ctx.font = "12px monospace"; ctx.textAlign = "left";
  ctx.fillText(`f(x) = ${fx}`, 10, 16);
  ctx.fillStyle = "#ef4444"; ctx.textAlign = "right";
  ctx.fillText(`→ Izq: ${isFinite(limLeft) ? limLeft.toFixed(4) : '∞'}`, W - 10, 16);
  ctx.fillStyle = "#22c55e";
  ctx.fillText(`→ Der: ${isFinite(limRight) ? limRight.toFixed(4) : '∞'}`, W - 10, 34);
  const infoEl = $("plim-info");
  if (infoEl) {
    let info = `lim<sub>x→${target}</sub> ${fx}`;
    if (isFinite(limLeft) && isFinite(limRight) && Math.abs(limLeft - limRight) < 1e-6) {
      info += ` = <b style="color:#059669">${limLeft.toFixed(6)}</b>`;
    } else if (isFinite(limLeft) && isFinite(limRight)) {
      info += ` &nbsp; Izquierda: ${limLeft.toFixed(4)} &nbsp; Derecha: ${limRight.toFixed(4)} &nbsp; <b style="color:#dc2626">No existe</b>`;
    } else {
      info += ` &nbsp; <b style="color:#dc2626">No existe / ∞</b>`;
    }
    infoEl.innerHTML = info;
  }
  if (!canvas._graphInited) {
    canvas._graphInited = true;
    canvas._vpInited = true;
    canvas._vp.custom = true;
    makeGraphInteractive('plim-canvas', {
      xmin: () => { const c = $("plim-canvas"); return c ? (c._vp?.xmin ?? -5) : -5; },
      xmax: () => { const c = $("plim-canvas"); return c ? (c._vp?.xmax ?? 5) : 5; },
      ymin: () => { const c = $("plim-canvas"); return c ? (c._vp?.ymin ?? -3.5) : -3.5; },
      ymax: () => { const c = $("plim-canvas"); return c ? (c._vp?.ymax ?? 3.5) : 3.5; },
      xmin_set: v => { const c = $("plim-canvas"); if (c) { c._vp.xmin = v; c._vp.custom = true; } },
      xmax_set: v => { const c = $("plim-canvas"); if (c) { c._vp.xmax = v; c._vp.custom = true; } },
      ymin_set: v => { const c = $("plim-canvas"); if (c) { c._vp.ymin = v; c._vp.custom = true; } },
      ymax_set: v => { const c = $("plim-canvas"); if (c) { c._vp.ymax = v; c._vp.custom = true; } },
    }, precalcLimDraw);
  }
}
function plimResetView() {
  const canvas = $("plim-canvas");
  if (canvas) { canvas._vpInited = false; canvas._vp = {}; }
  precalcLimDraw();
}

function precalcDerivDraw() {
  const canvas = $("pderiv-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const fx = $("pderiv-fx")?.value.trim() || "x*x";
  const x0 = parseFloat($("pderiv-x")?.value || 1);
  if (!canvas._vp) canvas._vp = { xmin: -10, xmax: 10, ymin: -5, ymax: 5 };
  const { xmin, xmax, ymin, ymax } = canvas._vp;
  $("pderiv-xval").textContent = x0.toFixed(1);
  ctx.clearRect(0, 0, W, H);
  const px = x => (x - xmin) / (xmax - xmin) * W;
  const py = y => H - (y - ymin) / (ymax - ymin) * H;
  ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 0.5;
  for (let i = Math.ceil(xmin); i <= Math.floor(xmax); i++) { if (i === 0) continue;
    ctx.beginPath(); ctx.moveTo(px(i), 0); ctx.lineTo(px(i), H); ctx.stroke(); }
  for (let i = Math.ceil(ymin); i <= Math.floor(ymax); i++) { if (i === 0) continue;
    ctx.beginPath(); ctx.moveTo(0, py(i)); ctx.lineTo(W, py(i)); ctx.stroke(); }
  ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(px(0), 0); ctx.lineTo(px(0), H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, py(0)); ctx.lineTo(W, py(0)); ctx.stroke();
  const steps = W;
  ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2.5;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= steps; i++) {
    const x = xmin + (xmax - xmin) * i / steps;
    try {
      const y = Function("x", `return (${fx})`)(x);
      if (typeof y !== 'number' || !isFinite(y) || y < ymin || y > ymax) { started = false; continue; }
      if (!started) { ctx.moveTo(px(x), py(y)); started = true; } else ctx.lineTo(px(x), py(y));
    } catch(e) { started = false; }
  }
  ctx.stroke();
  let deriv, y0;
  try {
    const f = v => Function("x", `return (${fx})`)(v);
    const h = 1e-8;
    deriv = (f(x0 + h) - f(x0 - h)) / (2 * h);
    y0 = f(x0);
  } catch(e) { deriv = NaN; y0 = NaN; }
  if (isFinite(deriv) && isFinite(y0)) {
    const x1 = x0 - 3, y1 = y0 + deriv * (x1 - x0);
    const x2 = x0 + 3, y2 = y0 + deriv * (x2 - x0);
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    if (y1 >= ymin && y1 <= ymax) { ctx.moveTo(px(x1), py(y1)); } else { const t = (ymin - y0) / deriv; ctx.moveTo(px(x0 + t), py(ymin)); }
    if (y2 >= ymin && y2 <= ymax) { ctx.lineTo(px(x2), py(y2)); } else { const t = (ymax - y0) / deriv; ctx.lineTo(px(x0 + t), py(ymax)); }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(px(x0), py(y0), 7, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(px(x0), py(y0), 7, 0, Math.PI*2); ctx.stroke();
  }
  ctx.fillStyle = "#1a1a2e"; ctx.font = "12px monospace"; ctx.textAlign = "left";
  ctx.fillText(`f(x) = ${fx}`, 10, 16);
  ctx.fillStyle = "#ef4444";
  ctx.fillText(`Recta tangente en x = ${x0.toFixed(1)}`, 10, 34);
  const infoEl = $("pderiv-info");
  if (infoEl) {
    if (isFinite(deriv)) {
      infoEl.innerHTML = `
        f(${x0.toFixed(2)}) = <b>${isFinite(y0) ? y0.toFixed(4) : '?'}</b> &nbsp;|&nbsp;
        f'(${x0.toFixed(2)}) = <b style="color:#dc2626">${deriv.toFixed(6)}</b><br>
        <span style="font-size:.75rem;color:var(--muted)">Ecuación tangente: y - ${y0.toFixed(2)} = ${deriv.toFixed(4)}(x - ${x0.toFixed(2)})</span>
      `;
    } else {
      infoEl.innerHTML = '<span style="color:#dc2626">La función no es derivable en este punto</span>';
    }
  }
  if (!canvas._graphInited) {
    canvas._graphInited = true;
    makeGraphInteractive('pderiv-canvas', {
      xmin: () => { const c = $("pderiv-canvas"); return c?._vp?.xmin ?? -10; },
      xmax: () => { const c = $("pderiv-canvas"); return c?._vp?.xmax ?? 10; },
      ymin: () => { const c = $("pderiv-canvas"); return c?._vp?.ymin ?? -5; },
      ymax: () => { const c = $("pderiv-canvas"); return c?._vp?.ymax ?? 5; },
      xmin_set: v => { const c = $("pderiv-canvas"); if (c) c._vp.xmin = v; },
      xmax_set: v => { const c = $("pderiv-canvas"); if (c) c._vp.xmax = v; },
      ymin_set: v => { const c = $("pderiv-canvas"); if (c) c._vp.ymin = v; },
      ymax_set: v => { const c = $("pderiv-canvas"); if (c) c._vp.ymax = v; },
    }, precalcDerivDraw);
  }
}
function pderivResetView() {
  const canvas = $("pderiv-canvas");
  if (canvas) canvas._vp = { xmin: -10, xmax: 10, ymin: -5, ymax: 5 };
  precalcDerivDraw();
}

function precalcIntDraw() {
  const canvas = $("pint-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const fx = $("pint-fx")?.value.trim() || "x*x";
  const a = parseFloat($("pint-a")?.value || 0);
  const b = parseFloat($("pint-b")?.value || 2);
  const n = parseInt($("pint-n")?.value || 8);
  const rtype = $("pint-type")?.value || "mid";
  $("pint-nval").textContent = n;
  if (!canvas._vp) {
    const pad = 0.2;
    canvas._vp_xRange = { a, b };
    const xmin0 = a - (b - a) * pad, xmax0 = b + (b - a) * pad;
    canvas._vp = { xmin: xmin0, xmax: xmax0 };
  }
  let { xmin, xmax } = canvas._vp;
  if (a !== canvas._vp_xRange?.a || b !== canvas._vp_xRange?.b) {
    const pad2 = 0.2;
    xmin = a - (b - a) * pad2;
    xmax = b + (b - a) * pad2;
    canvas._vp = { xmin, xmax };
    canvas._vp_xRange = { a, b };
    canvas._vpY = null;
  }
  const margin = 0.3;
  let maxY = 0;
  for (let i = 0; i <= 100; i++) {
    const x = a + (b - a) * i / 100;
    try { const y = Math.abs(Function("x", `return (${fx})`)(x)); if (isFinite(y) && y > maxY) maxY = y; } catch(e) {}
  }
  if (!canvas._vpY) canvas._vpY = { ymin: -maxY * margin, ymax: maxY * (1 + margin) };
  const ymin = canvas._vpY.ymin, ymax = canvas._vpY.ymax;
  ctx.clearRect(0, 0, W, H);
  const px = x => (x - xmin) / (xmax - xmin) * W;
  const py = y => H - (y - ymin) / (ymax - ymin) * H;
  ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 0.5;
  for (let i = Math.ceil(xmin); i <= Math.floor(xmax); i++) { if (i === 0) continue;
    ctx.beginPath(); ctx.moveTo(px(i), 0); ctx.lineTo(px(i), H); ctx.stroke(); }
  for (let i = Math.ceil(ymin); i <= Math.floor(ymax); i++) { if (i === 0) continue;
    ctx.beginPath(); ctx.moveTo(0, py(i)); ctx.lineTo(W, py(i)); ctx.stroke(); }
  ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(px(0), 0); ctx.lineTo(px(0), H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, py(0)); ctx.lineTo(W, py(0)); ctx.stroke();
  const h = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    let xSample;
    if (rtype === 'left') xSample = a + i * h;
    else if (rtype === 'right') xSample = a + (i + 1) * h;
    else xSample = a + (i + 0.5) * h;
    let ySample;
    try { ySample = Function("x", `return (${fx})`)(xSample); } catch(e) { ySample = 0; }
    if (!isFinite(ySample)) ySample = 0;
    sum += ySample * h;
    const x = a + i * h;
    ctx.fillStyle = ySample >= 0 ? "rgba(99,102,241,0.25)" : "rgba(239,68,68,0.25)";
    ctx.strokeStyle = ySample >= 0 ? "rgba(99,102,241,0.6)" : "rgba(239,68,68,0.6)";
    ctx.lineWidth = 1;
    ctx.fillRect(px(x), py(Math.max(0, ySample)), px(x + h) - px(x), py(Math.min(0, ySample)) - py(Math.max(0, ySample)));
    ctx.strokeRect(px(x), py(Math.max(0, ySample)), px(x + h) - px(x), py(Math.min(0, ySample)) - py(Math.max(0, ySample)));
  }
  const steps = W;
  ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2.5;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= steps; i++) {
    const x = xmin + (xmax - xmin) * i / steps;
    try {
      const y = Function("x", `return (${fx})`)(x);
      if (typeof y !== 'number' || !isFinite(y) || y < ymin || y > ymax) { started = false; continue; }
      if (!started) { ctx.moveTo(px(x), py(y)); started = true; } else ctx.lineTo(px(x), py(y));
    } catch(e) { started = false; }
  }
  ctx.stroke();
  ctx.strokeStyle = "#059669"; ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(px(a), 0); ctx.lineTo(px(a), H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px(b), 0); ctx.lineTo(px(b), H); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#1a1a2e"; ctx.font = "12px monospace"; ctx.textAlign = "left";
  ctx.fillText(`f(x) = ${fx}`, 10, 16);
  ctx.fillStyle = "#059669";
  ctx.fillText(`a = ${a.toFixed(1)} &nbsp; b = ${b.toFixed(1)}`, 10, 34);
  const infoEl = $("pint-info");
  if (infoEl) {
    infoEl.innerHTML = `
      ∫<sub>${a}</sub><sup>${b}</sup> ${fx} dx &nbsp;≈&nbsp; <b style="color:#6366f1;font-size:1.1rem">${sum.toFixed(6)}</b>
      &nbsp; (${rtype === 'left' ? 'izquierda' : rtype === 'right' ? 'derecha' : 'punto medio'}, n=${n})
    `;
  }
  if (!canvas._graphInited) {
    canvas._graphInited = true;
    makeGraphInteractive('pint-canvas', {
      xmin: () => { const c = $("pint-canvas"); return c?._vp?.xmin ?? -0.4; },
      xmax: () => { const c = $("pint-canvas"); return c?._vp?.xmax ?? 2.4; },
      ymin: () => { const c = $("pint-canvas"); return c?._vpY?.ymin ?? -1; },
      ymax: () => { const c = $("pint-canvas"); return c?._vpY?.ymax ?? 5; },
      xmin_set: v => { const c = $("pint-canvas"); if (c) c._vp.xmin = v; },
      xmax_set: v => { const c = $("pint-canvas"); if (c) c._vp.xmax = v; },
      ymin_set: v => { const c = $("pint-canvas"); if (c) { if (!c._vpY) c._vpY = {}; c._vpY.ymin = v; } },
      ymax_set: v => { const c = $("pint-canvas"); if (c) { if (!c._vpY) c._vpY = {}; c._vpY.ymax = v; } },
    }, precalcIntDraw);
  }
}
function pintResetView() {
  const canvas = $("pint-canvas");
  if (canvas) { canvas._vp = null; canvas._vpY = null; canvas._vp_xRange = null; }
  precalcIntDraw();
}


function getLayout() {
  try { const s = localStorage.getItem('herramientas_layout'); return s ? JSON.parse(s) : null; } catch(e) { return null; }
}
function saveLayout() {
  const grid = $("tool-grid");
  if (!grid) return;
  const order = Array.from(grid.querySelectorAll('.tool-card')).map(c => c.dataset.toolId);
  localStorage.setItem('herramientas_layout', JSON.stringify(order));
  window._layoutEditing = false;
  homePage();
}
function toggleLayoutEdit() {
  window._layoutEditing = !window._layoutEditing;
  const btn = document.getElementById('layout-toggle-btn');
  if (btn) btn.textContent = window._layoutEditing ? '💾' : '✏️';
  homePage();
}
let _dragSrc = null;
function dragStart(e) {
  _dragSrc = e.target.closest('.tool-card');
  if (!_dragSrc || !_dragSrc.draggable) return;
  e.dataTransfer.effectAllowed = 'move';
  _dragSrc.classList.add('dragging');
}
function dragOver(e) {
  e.preventDefault();
  const t = e.target.closest('.tool-card');
  if (!t || t === _dragSrc) return;
  const g = t.parentNode; const r = t.getBoundingClientRect();
  g.insertBefore(_dragSrc, e.clientY < r.top + r.height / 2 ? t : t.nextSibling);
}
function drop(e) { e.preventDefault(); }
function dragEnd(e) { const c = e.target.closest('.tool-card'); if (c) c.classList.remove('dragging'); _dragSrc = null; }
async function downloadSite() {
  try {
    const [html, css, tools, app] = await Promise.all([
      fetch('index.html').then(r => r.text()),
      fetch('css/style.css').then(r => r.text()),
      fetch('js/tools.js').then(r => r.text()),
      fetch('js/app.js').then(r => r.text())
    ]);
    const combined = html
      .replace('<link rel="stylesheet" href="css/style.css">', `<style>${css}</style>`)
      .replace('<script src="js/tools.js"></script>', `<script>${tools}\n</script>`)
      .replace('<script src="js/app.js"></script>', `<script>${app}\n</script>`);
    const blob = new Blob([combined], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'herramientas-offline.html';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  } catch(e) { alert('Error al descargar: ' + e.message); }
}


function makeGraphInteractive(canvasId, vp, redraw) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  let state = { dragging: false, sx: 0, sy: 0, v0: null };
  const getV = () => ({
    xmin: parseFloat(vp.xmin()),
    xmax: parseFloat(vp.xmax()),
    ymin: parseFloat(vp.ymin()),
    ymax: parseFloat(vp.ymax())
  });
  const setV = (v) => {
    vp.xmin_set(v.xmin); vp.xmax_set(v.xmax);
    vp.ymin_set(v.ymin); vp.ymax_set(v.ymax);
  };
  canvas.addEventListener('mousedown', e => {
    const r = canvas.getBoundingClientRect();
    state.dragging = true; state.sx = e.clientX - r.left; state.sy = e.clientY - r.top; state.v0 = getV();
    canvas.style.cursor = 'grabbing';
  });
  canvas.addEventListener('mousemove', e => {
    if (!state.dragging) return;
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const dx = (mx - state.sx) / canvas.width, dy = (my - state.sy) / canvas.height;
    const v = state.v0; const sx = v.xmax - v.xmin, sy = v.ymax - v.ymin;
    setV({ xmin: v.xmin - dx * sx, xmax: v.xmax - dx * sx, ymin: v.ymin + dy * sy, ymax: v.ymax + dy * sy });
    redraw();
  });
  const endDrag = () => { state.dragging = false; canvas.style.cursor = 'grab'; };
  canvas.addEventListener('mouseup', endDrag);
  canvas.addEventListener('mouseleave', endDrag);
  canvas.style.cursor = 'grab';
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    const mx = (e.clientX - r.left) / canvas.width, my = (e.clientY - r.top) / canvas.height;
    const v = getV(); const sx = v.xmax - v.xmin, sy = v.ymax - v.ymin;
    const f = e.deltaY > 0 ? 1.15 : 0.87;
    const nsx = sx * f, nsy = sy * f;
    const cx = v.xmin + mx * sx, cy = v.ymin + (1 - my) * sy;
    setV({ xmin: cx - mx * nsx, xmax: cx + (1 - mx) * nsx, ymin: cy - (1 - my) * nsy, ymax: cy + my * nsy });
    redraw();
  }, { passive: false });
}


let _csFiles = [];
let _csCurrent = 0;
let _csLangMap = { html:'html', css:'css', javascript:'javascript', python:'python', cpp:'text/x-c++src', c:'text/x-csrc', csharp:'text/x-csharp', php:'php', json:'application/json' };
const _csExtMap = { html:'.html', css:'.css', javascript:'.js', python:'.py', cpp:'.cpp', c:'.c', csharp:'.cs', php:'.php', json:'.json' };
const _csTemplates = {
  html:'<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1.0">\n  <title>Mi Página</title>\n  <style>\n    * { margin:0; padding:0; box-sizing:border-box; }\n    body { font-family:system-ui,sans-serif; background:#f5f5f5; color:#333; padding:40px; display:flex; justify-content:center; align-items:center; min-height:100vh; }\n    h1 { color:#7c3aed; }\n  </style>\n</head>\n<body>\n  <h1>Hola Mundo</h1>\n</body>\n</html>',
  css:'* { margin:0; padding:0; box-sizing:border-box; }\nbody { font-family:system-ui,sans-serif; background:#f5f5f5; color:#333; padding:40px; }\n.container { max-width:800px; margin:0 auto; }\nh1 { color:#7c3aed; font-size:2rem; }',
  javascript:'function saludar(nombre) {\n  return `Hola, ${nombre}!`;\n}\n\nconst msg = saludar("Mundo");\nconsole.log(msg);\n\n// Escribe tu código aquí',
  python:'def saludar(nombre):\n    return f"Hola, {nombre}!"\n\nprint(saludar("Mundo"))',
  cpp:'#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hola Mundo" << endl;\n    return 0;\n}',
  c:'#include <stdio.h>\n\nint main() {\n    printf("Hola Mundo\\n");\n    return 0;\n}',
  csharp:'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hola Mundo");\n    }\n}',
  php:'<?php\n$saludo = "Hola Mundo";\necho $saludo;\n?>',
  json:'{\n  "nombre": "CodeStudio",\n  "version": "1.0",\n  "lenguajes": ["HTML","CSS","JS","Python"],\n  "opensource": true\n}'
};

let _csLayout = { pos: 'right', ratio: 50 };
try { const s = localStorage.getItem('codestudio_layout'); if (s) Object.assign(_csLayout, JSON.parse(s)); } catch(e) {}

function csSetLayout(pos) {
  _csLayout.pos = pos;
  localStorage.setItem('codestudio_layout', JSON.stringify(_csLayout));
  const main = document.getElementById('cs-main');
  const preview = document.getElementById('cs-preview');
  const resizer = document.getElementById('cs-resizer');
  if (!main) return;
  main.className = 'cs-main';
  if (pos === 'bottom') main.classList.add('cs-col');
  if (pos === 'hidden') { preview.style.display = 'none'; resizer.style.display = 'none'; }
  else { preview.style.display = ''; resizer.style.display = ''; }
  document.querySelectorAll('.cs-layout-btn').forEach(b => b.classList.toggle('active', b.dataset.pos === pos));
  csApplyRatio();
}

function csApplyRatio() {
  const editor = document.getElementById('cs-editor');
  const preview = document.getElementById('cs-preview');
  if (!editor || !preview || _csLayout.pos === 'hidden') return;
  editor.style.flex = `${_csLayout.ratio} 1 0`;
  preview.style.flex = `${100 - _csLayout.ratio} 1 0`;
}

function csInitResizer() {
  const resizer = document.getElementById('cs-resizer');
  if (!resizer) return;
  resizer.addEventListener('mousedown', e => {
    e.preventDefault();
    const main = document.getElementById('cs-main');
    const editor = document.getElementById('cs-editor');
    const preview = document.getElementById('cs-preview');
    if (!main || !editor || !preview) return;
    const isCol = _csLayout.pos === 'bottom';
    const start = isCol ? e.clientY : e.clientX;
    const startRatio = _csLayout.ratio;

    function onMove(ev) {
      const delta = isCol ? ev.clientY - start : ev.clientX - start;
      const total = isCol ? main.offsetHeight : main.offsetWidth;
      if (total === 0) return;
      const pct = (delta / total) * 100;
      _csLayout.ratio = Math.max(20, Math.min(80, startRatio + pct));
      csApplyRatio();
    }
    function onUp() {
      localStorage.setItem('codestudio_layout', JSON.stringify(_csLayout));
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

function csInit() {
  _csFiles = [{ name:'index.html', lang:'html', content:_csTemplates.html }];
  _csCurrent = 0;
  setTimeout(() => {
    csRenderTabs();
    csRenderEditor();
    csUpdatePreview();
    csSetLayout(_csLayout.pos);
    csInitResizer();
    csApplyRatio();
  }, 50);
}

function csRenderTabs() {
  const el = document.getElementById('cs-tabs');
  if (!el) return;
  el.innerHTML = _csFiles.map((f,i) =>
    `<div class="cs-tab ${i===_csCurrent?'active':''}" onclick="csSwitchFile(${i})">
      ${f.name}
      ${_csFiles.length>1 ? `<span class="cs-tab-close" onclick="event.stopPropagation();csCloseFile(${i})">✕</span>` : ''}
    </div>`
  ).join('');
}

function csRenderEditor() {
  const f = _csFiles[_csCurrent];
  if (!f) return;
  const ta = document.getElementById('cs-code');
  const sel = document.getElementById('cs-lang');
  if (ta) { ta.value = f.content; }
  if (sel) { sel.value = f.lang; }
  csUpdateGutter();
  csUpdatePreview();
}

function csSwitchFile(i) {
  csSaveCurrent();
  _csCurrent = i;
  csRenderTabs();
  csRenderEditor();
}

function csCloseFile(i) {
  if (_csFiles.length < 2) return;
  _csFiles.splice(i, 1);
  if (_csCurrent >= _csFiles.length) _csCurrent = _csFiles.length - 1;
  csRenderTabs();
  csRenderEditor();
}

function csNewFile() {
  csSaveCurrent();
  const lang = document.getElementById('cs-lang').value;
  const name = `archivo${_csExtMap[lang] || '.txt'}`;
  _csFiles.push({ name, lang, content:_csTemplates[lang] || '' });
  _csCurrent = _csFiles.length - 1;
  csRenderTabs();
  csRenderEditor();
}

function csSetLang(lang) {
  const f = _csFiles[_csCurrent];
  if (!f) return;
  const newName = f.name.replace(/\.[^.]+$/, _csExtMap[lang] || '.txt');
  f.lang = lang;
  f.name = newName;
  csRenderTabs();
  csRenderEditor();
}

function csSaveCurrent() {
  const ta = document.getElementById('cs-code');
  const f = _csFiles[_csCurrent];
  if (ta && f) f.content = ta.value;
}

function csUpdateGutter() {
  const ta = document.getElementById('cs-code');
  const g = document.getElementById('cs-gutter');
  if (!ta || !g) return;
  const lines = ta.value.split('\n').length;
  g.innerHTML = Array.from({length:lines}, (_,i) => `<div>${i+1}</div>`).join('');
}

function csSyncScroll() {
  const ta = document.getElementById('cs-code');
  const g = document.getElementById('cs-gutter');
  if (ta && g) g.scrollTop = ta.scrollTop;
}

function csHandleKey(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const ta = e.target;
    const start = ta.selectionStart;
    ta.value = ta.value.substring(0, start) + '  ' + ta.value.substring(ta.selectionEnd);
    ta.selectionStart = ta.selectionEnd = start + 2;
    csUpdateGutter();
  }
}

function csTermClear() {
  const out = document.getElementById('cs-term-out');
  if (out) out.innerHTML = '';
}

function csTermLog(...args) {
  const out = document.getElementById('cs-term-out');
  if (!out) return;
  const text = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
  out.innerHTML += `<div>> ${text}</div>`;
  out.scrollTop = out.scrollHeight;
}

function csTermKey(e) {
  if (e.key === 'Enter') {
    const inp = document.getElementById('cs-term-input');
    if (!inp) return;
    const code = inp.value.trim();
    if (!code) return;
    inp.value = '';
    csTermLog(`\u001b[1m${code}\u001b[0m`);
    try {
      const result = eval(code);
      if (result !== undefined) csTermLog(result);
    } catch(e) { csTermLog(`\u001b[31mError: ${e.message}\u001b[0m`); }
  }
}

function csRun() {
  csSaveCurrent();
  const f = _csFiles[_csCurrent];
  if (!f) return;
  const out = document.getElementById('cs-term-out');
  if (out) out.innerHTML = '';
  csTermLog(`\u001b[36m\u00bb Ejecutando ${f.name}...\u001b[0m`);

  if (f.lang === 'html') {
    csUpdatePreview();
    csTermLog('HTML renderizado en la vista previa');
  } else if (f.lang === 'css') {
    csUpdatePreview();
    csTermLog('CSS aplicado a la vista previa');
  } else if (f.lang === 'javascript') {
    const logs = [];
    const _log = console.log, _err = console.error, _warn = console.warn;
    console.log = (...a) => { logs.push(a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' ')); csTermLog(...a); };
    console.error = (...a) => { logs.push('\u001b[31m'+a.map(x=>String(x)).join(' ')); csTermLog('\u001b[31m'+a.map(x=>String(x)).join(' ')+'\u001b[0m'); };
    console.warn = (...a) => { logs.push('\u001b[33m'+a.map(x=>String(x)).join(' ')); csTermLog('\u001b[33m'+a.map(x=>String(x)).join(' ')+'\u001b[0m'); };
    try {
      const result = eval(f.content);
      if (result !== undefined && logs.length === 0) csTermLog(result);
    } catch(e) { csTermLog(`\u001b[31mError: ${e.message}\u001b[0m`); }
    console.log = _log; console.error = _err; console.warn = _warn;
  } else {
    csTermLog(`\u001b[33m\u26a0 ${f.lang.toUpperCase()} no puede ejecutarse en el navegador. Usa la terminal para JS o previsualiza HTML/CSS.\u001b[0m`);
    csTermLog(`Código guardado en "${f.name}" — puedes exportarlo con \u00abExportar\u00bb`);
  }
}

function csUpdatePreview() {
  csSaveCurrent();
  const f = _csFiles[_csCurrent];
  const ifr = document.getElementById('cs-iframe');
  const empty = document.getElementById('cs-preview-empty');
  if (!ifr || !empty) return;
  
  if (f.lang === 'html') {
    empty.style.display = 'none';
    ifr.srcdoc = f.content;
  } else if (f.lang === 'css') {
    empty.style.display = 'none';
    ifr.srcdoc = `<!DOCTYPE html><html><head><style>${f.content}</style></head><body><div style="padding:20px;font-family:sans-serif"><h1>Vista previa CSS</h1><p style="color:#666">Este CSS se aplicaría a tu HTML.</p><hr><pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-size:13px">${f.content.replace(/</g,'&lt;')}</pre></div></body></html>`;
  } else {
    ifr.srcdoc = '';
    empty.style.display = 'flex';
  }
}

function csLiveWin() {
  csSaveCurrent();
  const f = _csFiles[_csCurrent];
  if (f.lang !== 'html') {
    csTermLog('\u001b[33m\u26a0 Live Server solo funciona con archivos HTML\u001b[0m');
    return;
  }
  const w = window.open('', 'cs-live', 'width=1024,height=700');
  if (!w) { csTermLog('\u001b[31mError: Bloquea ventanas emergentes. Permite popups para Live Server.\u001b[0m'); return; }
  w.document.write(f.content);
  w.document.close();
  csTermLog(`\u001b[36m\u00bb Live Server abierto en ventana externa (mismo dominio)\u001b[0m`);
}

function csImport() {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.html,.css,.js,.py,.cpp,.c,.cs,.php,.json,.txt,.*';
  inp.onchange = () => {
    const file = inp.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target.result;
      const ext = file.name.split('.').pop().toLowerCase();
      const langMap = { html:'html', htm:'html', css:'css', js:'javascript', py:'python', cpp:'cpp', c:'c', cs:'csharp', php:'php', json:'json', txt:'javascript' };
      const lang = langMap[ext] || 'javascript';
      csSaveCurrent();
      _csFiles.push({ name:file.name, lang, content });
      _csCurrent = _csFiles.length - 1;
      csRenderTabs();
      csRenderEditor();
      csTermLog(`\u001b[36m\u00bb Importado: ${file.name}\u001b[0m`);
    };
    reader.readAsText(file);
  };
  inp.click();
}

function csExport() {
  csSaveCurrent();
  const f = _csFiles[_csCurrent];
  if (!f) return;
  const blob = new Blob([f.content], { type:'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = f.name;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
  csTermLog(`\u001b[36m\u00bb Exportado: ${f.name}\u001b[0m`);
}


let _bgParticles = [];
let _bg3D = null;
let _bgRAF = null;
let _bgTime = 0;

const _bgPresets = {
  hyperion: ['#7c3aed','#00f3ff','#ff0055','#a78bfa','#06b6d4','#f472b6'],
  rainbow:  ['#ff0040','#ff8c00','#ffe600','#00e676','#2979ff','#d500f9'],
  aurora:   ['#00e676','#1de9b6','#00bcd4','#7c4dff','#e040fb','#00e5ff'],
  fire:     ['#ff1744','#ff6d00','#ff9100','#ffab00','#d50000','#ff3d00'],
  ocean:    ['#0277bd','#0288d1','#039be5','#03a9f4','#29b6f6','#4fc3f7'],
  breathing:['#7c3aed']
};

function _loadBgSettings() {
  try { return JSON.parse(localStorage.getItem('bg-settings')); } catch(e) {}
  return null;
}
function _saveBgSettings(s) {
  localStorage.setItem('bg-settings', JSON.stringify(s));
}
let _bgCfg = Object.assign({ mode:'particles', preset:'hyperion' }, _loadBgSettings());

function _getPalette() {
  const p = _bgPresets[_bgCfg.preset] || _bgPresets.hyperion;
  return p;
}


function _bgInitParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  _bgStop();
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const palette = _getPalette();
  const count = _bgCfg.preset === 'breathing' ? 60 : 91;
  const isBreathing = _bgCfg.preset === 'breathing';
  const breathColor = palette[0];
  _bgParticles = [];
  for (let i = 0; i < count; i++) {
    _bgParticles.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2.5 + 0.5,
      color: isBreathing ? breathColor : palette[Math.floor(Math.random() * palette.length)],
      alpha: Math.random() * 0.35 + 0.08,
      pulse: Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
      driftX: 0, driftY: 0
    });
  }

  let bgTime = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.7);
    g.addColorStop(0, 'rgba(30, 10, 60, 0.4)');
    g.addColorStop(0.4, 'rgba(10, 5, 30, 0.25)');
    g.addColorStop(0.7, 'rgba(5, 5, 15, 0.15)');
    g.addColorStop(1, 'rgba(2, 2, 5, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    bgTime += 0.02;
    const breathFactor = isBreathing ? 0.5 + 0.5 * Math.sin(bgTime * 0.8) : 1;

    for (const p of _bgParticles) {
      p.pulse += 0.02;
      const sAlpha = isBreathing
        ? p.alpha * breathFactor
        : p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = sAlpha;
      ctx.fill();
      if (p.r > 1.5) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    }

    for (let i = 0; i < _bgParticles.length; i++) {
      for (let j = i + 1; j < _bgParticles.length; j++) {
        const dx = _bgParticles[i].x - _bgParticles[j].x;
        const dy = _bgParticles[i].y - _bgParticles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(_bgParticles[i].x, _bgParticles[i].y);
          ctx.lineTo(_bgParticles[j].x, _bgParticles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    for (const p of _bgParticles) {
      p.driftX += (Math.random() - 0.5) * 0.04;
      p.driftY += (Math.random() - 0.5) * 0.04;
      p.driftX = Math.max(-0.3, Math.min(0.3, p.driftX));
      p.driftY = Math.max(-0.3, Math.min(0.3, p.driftY));
      p.x += p.vx + p.driftX;
      p.y += p.vy + p.driftY;
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
    }
    _bgRAF = requestAnimationFrame(draw);
  }
  draw();
}


function _bgInit3D() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  _bgStop();

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 35;

  const palette = _getPalette();
  const geos = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.TorusKnotGeometry(0.6, 0.3, 48, 6),
    new THREE.TorusGeometry(0.7, 0.25, 12, 24),
    new THREE.ConeGeometry(0.8, 1.2, 6)
  ];

  const objects = [];
  const count = _bgCfg.preset === 'breathing' ? 50 : 36;
  for (let i = 0; i < count; i++) {
    const g = geos[i % geos.length];
    const c = palette[i % palette.length];
    const mat = new THREE.MeshPhongMaterial({ color: c, transparent: true, opacity: 0.5 + Math.random() * 0.3, shininess: 20, flatShading: true });
    const m = new THREE.Mesh(g, mat);
    const s = 0.5 + Math.random() * 0.9;
    m.scale.set(s, s, s);
    m.position.set((Math.random() - 0.5) * 70, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 30);
    m.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    m.userData = {
      rx: (Math.random() - 0.5) * 0.012, ry: (Math.random() - 0.5) * 0.012, rz: (Math.random() - 0.5) * 0.006,
      baseX: m.position.x, baseY: m.position.y, baseZ: m.position.z,
      phaseX: Math.random() * Math.PI * 2, phaseY: Math.random() * Math.PI * 2, phaseZ: Math.random() * Math.PI * 2,
      speedX: 0.003 + Math.random() * 0.005, speedY: 0.003 + Math.random() * 0.005, speedZ: 0.002 + Math.random() * 0.004,
      ampX: 0.3 + Math.random() * 0.8, ampY: 0.3 + Math.random() * 0.8, ampZ: 0.2 + Math.random() * 0.5,
      driftX: 0, driftY: 0, driftZ: 0
    };
    scene.add(m);
    objects.push(m);
  }

  const ambient = new THREE.AmbientLight(0x404060, 0.6);
  scene.add(ambient);
  const d1 = new THREE.DirectionalLight(0xfff0f5, 0.8);
  d1.position.set(15, 20, 25);
  scene.add(d1);
  const d2 = new THREE.DirectionalLight(0x4040ff, 0.3);
  d2.position.set(-15, -10, -20);
  scene.add(d2);

  let mx = 0, my = 0, autoAngle = 0;
  const onMouse = e => { mx = (e.clientX / window.innerWidth) * 2 - 1; my = -(e.clientY / window.innerHeight) * 2 + 1; };
  document.addEventListener('mousemove', onMouse);

  let time = 0;
  function anim() {
    time += 0.01;
    autoAngle += 0.0004;
    const breath = _bgCfg.preset === 'breathing' ? 0.4 + 0.6 * Math.sin(time * 0.8) : 1;
    for (const o of objects) {
      const noise = o.userData;
      noise.driftX += (Math.random() - 0.5) * 0.0004;
      noise.driftY += (Math.random() - 0.5) * 0.0004;
      noise.driftZ += (Math.random() - 0.5) * 0.0003;
      noise.driftX = Math.max(-0.02, Math.min(0.02, noise.driftX));
      noise.driftY = Math.max(-0.02, Math.min(0.02, noise.driftY));
      noise.driftZ = Math.max(-0.015, Math.min(0.015, noise.driftZ));
      o.rotation.x += noise.rx + noise.driftX + Math.sin(time * 0.2 + noise.phaseX) * 0.004;
      o.rotation.y += noise.ry + noise.driftY + Math.cos(time * 0.15 + noise.phaseY) * 0.004;
      o.rotation.z += noise.rz + noise.driftZ + Math.sin(time * 0.25 + noise.phaseZ) * 0.003;
      o.position.x = noise.baseX + Math.sin(time * noise.speedX * 8 + noise.phaseX) * noise.ampX * breath;
      o.position.y = noise.baseY + Math.sin(time * noise.speedY * 8 + noise.phaseY + 1) * noise.ampY * breath;
      o.position.z = noise.baseZ + Math.sin(time * noise.speedZ * 6 + noise.phaseZ + 2) * noise.ampZ * breath * 0.6;
      o.material.opacity = (0.5 + 0.3 * Math.sin(time * 0.5 + noise.phaseY)) * breath;
    }
    camera.position.x += (mx * 5 + Math.sin(autoAngle) * 2 - camera.position.x) * 0.015;
    camera.position.y += (my * 4 + Math.cos(autoAngle * 0.7) * 1.5 - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    _bgRAF = requestAnimationFrame(anim);
  }
  anim();

  _bg3D = { renderer, scene, camera, objects, onMouse };
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function _bgStop() {
  if (_bgRAF) { cancelAnimationFrame(_bgRAF); _bgRAF = null; }
  if (_bg3D) {
    document.removeEventListener('mousemove', _bg3D.onMouse);
    _bg3D.renderer.dispose();
    _bg3D = null;
  }
  _bgParticles = [];
}

function initBg() {
  if (_bgCfg.mode === '3d') _bgInit3D();
  else _bgInitParticles();
}


function openBgSettings() {
  const existing = document.getElementById('bg-settings-modal');
  if (existing) existing.remove();

  const is3D = _bgCfg.mode === '3d';
  const curPreset = _bgCfg.preset;

  const m = document.createElement('div');
  m.id = 'bg-settings-modal';
  m.className = 'modal-overlay';
  m.onclick = e => { if (e.target === m) m.remove(); };
  m.innerHTML = `
    <div class="modal-panel" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3>🎨 Personalizar Fondo</h3>
        <button class="modal-close" onclick="document.getElementById('bg-settings-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <label>Motor</label>
        <div class="opt-group">
          <button class="opt-btn ${!is3D ? 'active' : ''}" onclick="setBgMode('particles')">✨ Partículas 2D</button>
          <button class="opt-btn ${is3D ? 'active' : ''}" onclick="setBgMode('3d')">🌌 Mundo 3D</button>
        </div>
        <label>Paleta de color</label>
        <div class="opt-group">
          <button class="opt-btn ${curPreset === 'hyperion' ? 'active' : ''}" onclick="setBgPreset('hyperion')">HYPERION</button>
          <button class="opt-btn ${curPreset === 'rainbow' ? 'active' : ''}" onclick="setBgPreset('rainbow')">Arcoíris</button>
          <button class="opt-btn ${curPreset === 'aurora' ? 'active' : ''}" onclick="setBgPreset('aurora')">Aurora</button>
          <button class="opt-btn ${curPreset === 'fire' ? 'active' : ''}" onclick="setBgPreset('fire')">Fuego</button>
          <button class="opt-btn ${curPreset === 'ocean' ? 'active' : ''}" onclick="setBgPreset('ocean')">Océano</button>
          <button class="opt-btn ${curPreset === 'breathing' ? 'active' : ''}" onclick="setBgPreset('breathing')">Respiración</button>
        </div>
        <p class="modal-desc">✨ Partículas 2D — clásicas, ligeras y conectadas<br>🌌 Mundo 3D — figuras geométricas flotando en el espacio</p>
      </div>
    </div>`;
  document.body.appendChild(m);
}

function setBgMode(mode) {
  _bgCfg.mode = mode;
  _saveBgSettings(_bgCfg);
  initBg();
  document.querySelectorAll('#bg-settings-modal [onclick*="setBgMode"]').forEach(b => b.classList.toggle('active', b.getAttribute('onclick').includes(mode)));
}

function setBgPreset(preset) {
  _bgCfg.preset = preset;
  _saveBgSettings(_bgCfg);
  initBg();
  document.querySelectorAll('#bg-settings-modal [onclick*="setBgPreset"]').forEach(b => b.classList.toggle('active', b.getAttribute('onclick').includes(preset)));
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBg);
} else {
  initBg();
}
