const TOOLS = [
  {
    id: "calculator", icon: "🧮", name: "Calculadora", desc: "Suma, resta, multiplica y divide",
    render: () => `
      <input type="text" id="calc-expr" placeholder="Ej: 2 + 2 * 5" value="2 + 2" onkeydown="if(event.key==='Enter')calcEval()">
      <div style="margin-top:10px">
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
          <button class="btn calc-key calc-op" onclick="calcPi()">π</button>
          <button class="btn calc-key calc-op" onclick="calcInsert('+')">+</button>
          <button class="calc-eq" onclick="calcEval()">= Calcular</button>
        </div>
      </div>
      <div class="result" id="calc-result"></div>
    `,
    init: () => { calcEval(); }
  },
  {
    id: "converter", icon: "📏", name: "Conversor de Unidades", desc: "Longitud, peso, temperatura, volumen",
    render: () => `
      <div class="split">
        <div>
          <label>Categoría</label>
          <select id="conv-cat" onchange="convUpdate()">
            <option value="length">Longitud</option>
            <option value="weight">Peso</option>
            <option value="temp">Temperatura</option>
            <option value="volume">Volumen</option>
          </select>
        </div>
        <div>
          <label>Valor</label>
          <input type="number" id="conv-val" value="1" oninput="convUpdate()">
        </div>
      </div>
      <div class="split">
        <div>
          <label>De</label>
          <select id="conv-from" onchange="convUpdate()"></select>
        </div>
        <div>
          <label>A</label>
          <select id="conv-to" onchange="convUpdate()"></select>
        </div>
      </div>
      <div class="result"><div class="result-box" id="conv-result">—</div></div>
    `,
    init: () => { convUpdate(); }
  },
  {
    id: "wordcount", icon: "📝", name: "Contador de Palabras", desc: "Cuenta palabras, caracteres y líneas",
    render: () => `
      <label>Texto</label>
      <textarea id="wc-text" rows="8" placeholder="Pega o escribe tu texto aquí..." oninput="wcCount()">Hola mundo. Esto es un texto de ejemplo.</textarea>
      <div class="split" style="margin-top:12px">
        <div class="result-box" id="wc-words">Palabras: 0</div>
        <div class="result-box" id="wc-chars">Caracteres: 0</div>
        <div class="result-box" id="wc-lines">Líneas: 0</div>
        <div class="result-box" id="wc-spaces">Sin espacios: 0</div>
      </div>
    `,
    init: () => { wcCount(); }
  },
  {
    id: "password", icon: "🔑", name: "Generador de Contraseñas", desc: "Crea contraseñas seguras aleatorias",
    render: () => `
      <div class="pw-display">
        <input type="text" id="pw-output" readonly value="abc123XYZ!@#">
        <button class="btn btn-secondary" onclick="pwCopy()">📋</button>
      </div>
      <div class="pw-length">
        <label>Longitud: <span id="pw-len-label">12</span></label>
        <input type="range" id="pw-length" min="4" max="64" value="12" oninput="pwGen()">
      </div>
      <div class="checkbox-group">
        <label><input type="checkbox" id="pw-upper" checked onchange="pwGen()"> Mayúsculas</label>
        <label><input type="checkbox" id="pw-lower" checked onchange="pwGen()"> Minúsculas</label>
        <label><input type="checkbox" id="pw-num" checked onchange="pwGen()"> Números</label>
        <label><input type="checkbox" id="pw-sym" checked onchange="pwGen()"> Símbolos</label>
      </div>
      <div class="btn-group">
        <button class="btn" onclick="pwGen()">🔄 Generar</button>
        <button class="btn btn-secondary" onclick="pwGen(4)">Generar 4</button>
      </div>
      <div class="result" id="pw-multi"></div>
    `,
    init: () => { pwGen(); }
  },
  {
    id: "qr", icon: "📲", name: "Generador QR", desc: "Crea códigos QR a partir de texto o URLs",
    render: () => `
      <label>Texto o URL</label>
      <input type="text" id="qr-text" value="https://google.com" oninput="qrGen()" placeholder="Escribe texto o URL">
      <div id="qrcode"></div>
      <div class="btn-group">
        <button class="btn" onclick="qrDownload()">💾 Descargar QR</button>
      </div>
    `,
    init: () => { qrGen(); }
  },
  {
    id: "case", icon: "🔤", name: "Convertir Texto", desc: "Mayúsculas, minúsculas, título, inverso",
    render: () => `
      <label>Texto original</label>
      <textarea id="case-input" rows="4" oninput="caseConvert()">texto de ejemplo para convertir</textarea>
      <div class="split" style="margin-top:12px">
        <div>
          <div class="result-box" style="cursor:pointer" onclick="caseCopy('case-mayus')" title="Click para copiar">
            <small>MAYÚSCULAS</small><br><strong id="case-mayus">TEXTO DE EJEMPLO</strong>
          </div>
        </div>
        <div>
          <div class="result-box" style="cursor:pointer" onclick="caseCopy('case-minus')" title="Click para copiar">
            <small>minúsculas</small><br><strong id="case-minus">texto de ejemplo</strong>
          </div>
        </div>
        <div>
          <div class="result-box" style="cursor:pointer" onclick="caseCopy('case-title')" title="Click para copiar">
            <small>Título</small><br><strong id="case-title">Texto De Ejemplo</strong>
          </div>
        </div>
        <div>
          <div class="result-box" style="cursor:pointer" onclick="caseCopy('case-inv')" title="Click para copiar">
            <small>InVeRsO</small><br><strong id="case-inv">tExTo dE eJeMpLo</strong>
          </div>
        </div>
      </div>
    `,
    init: () => { caseConvert(); }
  },
  {
    id: "color", icon: "🎨", name: "Conversor de Colores", desc: "HEX, RGB, HSL — convierte entre formatos",
    render: () => `
      <div class="split">
        <div>
          <label>Color</label>
          <input type="text" id="color-input" value="#6366f1" oninput="colorConvert()" placeholder="#ff0000">
        </div>
        <div>
          <label>Vista previa</label>
          <div id="color-preview" style="height:60px;border-radius:8px;background:#6366f1;border:1px solid var(--border)"></div>
        </div>
      </div>
      <div class="split" style="margin-top:12px">
        <div class="result-box" id="color-hex">HEX: #6366f1</div>
        <div class="result-box" id="color-rgb">RGB: rgb(99,102,241)</div>
        <div class="result-box" id="color-hsl">HSL: hsl(239,84%,67%)</div>
        <div class="result-box" id="color-name">Nombre: —</div>
      </div>
    `,
    init: () => { colorConvert(); }
  },
  {
    id: "timer", icon: "⏱️", name: "Cronómetro", desc: "Cronómetro online con vueltas y cuenta atrás",
    render: () => `
      <div style="text-align:center;padding:20px">
        <div style="font-size:3rem;font-weight:700;font-variant-numeric:tabular-nums" id="timer-display">00:00.0</div>
        <div class="btn-group" style="justify-content:center;margin-top:12px">
          <button class="btn" id="timer-btn" onclick="timerToggle()">▶ Iniciar</button>
          <button class="btn btn-secondary" onclick="timerLap()" id="timer-lap-btn" disabled>⏱ Vuelta</button>
          <button class="btn btn-secondary" onclick="timerReset()">🔄 Reiniciar</button>
        </div>
        <div id="timer-laps" style="margin-top:12px;max-height:200px;overflow-y:auto"></div>
      </div>
    `,
    init: () => {}
  },
  {
    id: "notes", icon: "📋", name: "Notas Rápidas", desc: "Notas de texto que se guardan automáticamente",
    render: () => `
      <label>Escribe tu nota (se guarda automáticamente)</label>
      <textarea id="notes-text" rows="10" placeholder="Escribe lo que quieras..." oninput="notesSave()"></textarea>
      <div class="btn-group">
        <button class="btn btn-secondary" onclick="notesClear()">🗑️ Limpiar</button>
        <button class="btn btn-secondary" onclick="notesCopy()">📋 Copiar</button>
        <button class="btn btn-secondary" onclick="notesExport()">💾 Exportar .txt</button>
      </div>
    `,
    init: () => { notesLoad(); }
  },
  {
    id: "hash", icon: "🔐", name: "Generador Hash", desc: "MD5, SHA-1, SHA-256 de cualquier texto",
    render: () => `
      <label>Texto</label>
      <input type="text" id="hash-input" value="Hola mundo" oninput="hashGen()">
      <div class="split" style="margin-top:12px">
        <div class="result-box" style="font-size:.8rem;word-break:break-all"><small>MD5</small><br><code id="hash-md5">—</code></div>
        <div class="result-box" style="font-size:.8rem;word-break:break-all"><small>SHA-1</small><br><code id="hash-sha1">—</code></div>
        <div class="result-box" style="font-size:.8rem;word-break:break-all"><small>SHA-256</small><br><code id="hash-sha256">—</code></div>
      </div>
    `,
    init: () => { hashGen(); }
  },
  {
    id: "base64", icon: "🔢", name: "Base64", desc: "Codifica y decodifica texto a Base64",
    render: () => `
      <label>Texto</label>
      <textarea id="b64-input" rows="4" oninput="b64Encode()">Hola mundo</textarea>
      <div class="btn-group">
        <button class="btn" onclick="b64Encode()">→ Codificar</button>
        <button class="btn btn-secondary" onclick="b64Decode()">← Decodificar</button>
      </div>
      <div class="result"><div class="result-box" id="b64-output">—</div></div>
    `,
    init: () => { b64Encode(); }
  },
  {
    id: "jsonfmt", icon: "📊", name: "Formatear JSON", desc: "Formatea, minifica y valida JSON",
    render: () => `
      <label>JSON</label>
      <textarea id="json-input" rows="6">{"nombre":"Juan","edad":30,"ciudad":"San Salvador"}</textarea>
      <div class="btn-group">
        <button class="btn" onclick="jsonFormat()">✨ Formatear</button>
        <button class="btn btn-secondary" onclick="jsonMinify()">🗜️ Minificar</button>
        <button class="btn btn-secondary" onclick="jsonValidate()">✅ Validar</button>
      </div>
      <div class="result"><div class="result-box" id="json-output" style="font-family:monospace;font-size:.85rem;white-space:pre-wrap">—</div></div>
    `,
    init: () => { jsonFormat(); }
  },
  {
    id: "ip", icon: "🌐", name: "Mi IP", desc: "Muestra tu dirección IP pública e información de red",
    render: () => `
      <div style="text-align:center;padding:20px">
        <div id="ip-display" style="font-size:2rem;font-weight:700">Cargando...</div>
        <div id="ip-info" style="margin-top:8px;color:var(--muted)"></div>
        <button class="btn" style="margin-top:16px" onclick="ipRefresh()">🔄 Refrescar</button>
      </div>
    `,
    init: () => { ipRefresh(); }
  },
  {
    id: "uuid", icon: "🆔", name: "Generador UUID", desc: "Genera identificadores únicos UUID v4",
    render: () => `
      <div style="text-align:center;padding:20px">
        <div class="result-box" id="uuid-display" style="font-family:monospace;font-size:1.1rem">—</div>
        <div class="btn-group" style="justify-content:center;margin-top:12px">
          <button class="btn" onclick="uuidGen()">🔄 Generar</button>
          <button class="btn btn-secondary" onclick="uuidGen(5)">Generar 5</button>
          <button class="btn btn-secondary" onclick="uuidCopy()">📋 Copiar</button>
        </div>
        <div id="uuid-list" style="margin-top:12px;font-family:monospace;font-size:.85rem"></div>
      </div>
    `,
    init: () => { uuidGen(); }
  },
  {
    id: "Lorem", icon: "📄", name: "Generador Lorem Ipsum", desc: "Genera texto Lorem Ipsum para relleno",
    render: () => `
      <div class="split">
        <div>
          <label>Cantidad</label>
          <input type="number" id="lorem-amount" value="3" min="1" max="50">
        </div>
        <div>
          <label>Tipo</label>
          <select id="lorem-type">
            <option value="paragraphs">Párrafos</option>
            <option value="sentences">Oraciones</option>
            <option value="words">Palabras</option>
          </select>
        </div>
      </div>
      <div class="btn-group">
        <button class="btn" onclick="loremGen()">✨ Generar</button>
        <button class="btn btn-secondary" onclick="loremCopy()">📋 Copiar</button>
      </div>
      <div class="result"><div class="result-box" id="lorem-output" style="line-height:1.8">—</div></div>
    `,
    init: () => { loremGen(); }
  },
  {
    id: "diff", icon: "🔍", name: "Diff de Texto", desc: "Compara dos textos lado a lado",
    render: () => `
      <div class="split">
        <div>
          <label>Texto A (original)</label>
          <textarea id="diff-a" rows="6" oninput="diffCompare()">Hola mundo</textarea>
        </div>
        <div>
          <label>Texto B (modificado)</label>
          <textarea id="diff-b" rows="6" oninput="diffCompare()">Hola mundo!</textarea>
        </div>
      </div>
      <div class="result" id="diff-result"></div>
    `,
    init: () => { diffCompare(); }
  },
  {
    id: "random", icon: "🎲", name: "Generador Aleatorio", desc: "Números aleatorios, moneda, dados",
    render: () => `
      <div style="text-align:center;padding:20px">
        <div class="btn-group" style="justify-content:center">
          <button class="btn" onclick="randDice()">🎲 Tirar dado</button>
          <button class="btn" onclick="randCoin()">🪙 Lanzar moneda</button>
          <button class="btn btn-secondary" onclick="randNum()">🔢 Número aleatorio</button>
        </div>
        <div id="random-result" style="font-size:3rem;padding:20px">—</div>
      </div>
    `,
    init: () => {}
  },
  {
    id: "md1", icon: "🧠", name: "Mate Discreta 1", desc: "Tablas de verdad, proposiciones, conjuntos — lógica proposicional",
    render: () => `
      <div class="tabs" style="display:flex;gap:4px;margin-bottom:16px;flex-wrap:wrap">
        <button class="btn btn-secondary" style="flex:1" onclick="md1Tab('truth')">📋 Tabla de Verdad</button>
        <button class="btn btn-secondary" style="flex:1" onclick="md1Tab('eval')">🔢 Evaluar</button>
        <button class="btn btn-secondary" style="flex:1" onclick="md1Tab('proof')">🔍 Demostración</button>
        <button class="btn btn-secondary" style="flex:1" onclick="md1Tab('sets')">📚 Conjuntos</button>
        <button class="btn btn-secondary" style="flex:1" onclick="md1Tab('bool')">🔲 Álgebra Boole</button>
        <button class="btn btn-secondary" style="flex:1" onclick="md1Tab('gates')">⚡ Compuertas</button>
        <button class="btn btn-secondary" style="flex:1" onclick="md1Tab('intro')">🧩 Introducción</button>
        <button class="btn btn-secondary" style="flex:1" onclick="md1Tab('laws')">📜 Leyes</button>
      </div>
      <div id="md1-content"></div>
    `,
    init: () => { md1Tab('truth'); }
  },
  {
    id: "ascii", icon: "🎭", name: "Arte ASCII", desc: "Convierte texto a arte ASCII",
    render: () => `
      <label>Texto (máx 10 caracteres)</label>
      <input type="text" id="ascii-input" value="HOLA" maxlength="10" oninput="asciiGen()">
      <div class="result"><pre id="ascii-output" style="font-size:.5rem;line-height:1.1;overflow-x:auto;background:#000;color:#0f0;padding:16px;border-radius:8px">—</pre></div>
    `,
    init: () => { asciiGen(); }
  },
];

const CONV = {
  length: { units: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"], base: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 } },
  weight: { units: ["mg", "g", "kg", "t", "oz", "lb"], base: { mg: 0.000001, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592 } },
  volume: { units: ["ml", "l", "gal", "qt", "pt", "cup", "fl oz"], base: { ml: 0.001, l: 1, gal: 3.78541, qt: 0.946353, pt: 0.473176, "cup": 0.236588, "fl oz": 0.0295735 } },
  temp: { units: ["°C", "°F", "K"], custom: true },
};
