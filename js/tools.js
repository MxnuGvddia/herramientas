const TOOLS = [
  {
    id: "calculator", icon: "🧮", name: "Calculadora", desc: "Suma, resta, multiplica y divide",
    render: () => `
      <div class="tabs" style="display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap">
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="calcTab('basic')">🔢 Básica</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="calcTab('graph')">📈 Gráficas</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="calcTab('calc')">∫ Cálculo</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="calcTab('phys')">⚡ Física</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="calcTab('complex')">🔮 Complejos</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="calcTab('bases')">💠 Bases</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="calcTab('elec')">🔌 Electricidad</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="calcTab('chem')">🧪 Química</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="calcTab('stat')">📊 Estadística</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="calcTab('rule3')">➗ Regla de 3</button>
      </div>
      <div id="calc-engine-content"></div>
    `,
    init: () => { calcTab('basic'); setTimeout(calcEval, 50); }
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
        <button class="btn btn-secondary" style="flex:1" onclick="md1Tab('falacias')">⚖️ Falacias</button>
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
  {
    id: "md1-study", icon: "🧠", name: "MD1 Estudio Interactivo", desc: "Lógica, conjuntos y álgebra booleana con visualizaciones dinámicas",
    render: () => `
      <div class="tabs" style="display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap">
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="md1StudyTab('logic')">🧠 Lógica Viva</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="md1StudyTab('sets')">📊 Conjuntos</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="md1StudyTab('bool')">⚡ Álgebra Boole</button>
      </div>
      <div id="md1-study-content"></div>
    `,
    init: () => { md1StudyTab('logic'); }
  },
  {
    id: "precalc", icon: "📈", name: "Precálculo / Cálculo 1", desc: "Funciones, límites, derivadas e integrales interactivos",
    render: () => `
      <div class="tabs" style="display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap">
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="precalcTab('func')">📈 Funciones Vivas</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="precalcTab('lim')">🎯 Límites</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="precalcTab('deriv')">📐 Derivadas</button>
        <button class="btn btn-secondary" style="flex:1;font-size:.75rem;padding:6px" onclick="precalcTab('int')">∫ Integrales</button>
      </div>
      <div id="precalc-content"></div>
    `,
    init: () => { precalcTab('func'); }
  },
  {
    id: "codestudio", icon: "💻", name: "CodeStudio", desc: "Editor multi-lenguaje con previsualización en vivo, terminal y gestor de archivos",
    render: () => `
      <div class="cs">
        <div class="cs-bar">
          <select class="cs-lang" id="cs-lang" onchange="csSetLang(this.value)">
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="csharp">C#</option>
            <option value="php">PHP</option>
            <option value="json">JSON</option>
          </select>
          <div class="cs-sep"></div>
          <button class="cs-btn" onclick="csNewFile()">📄 Nueva</button>
          <button class="cs-btn" onclick="csImport()">📂 Importar</button>
          <button class="cs-btn" onclick="csExport()">📥 Exportar</button>
          <div class="cs-sep"></div>
          <button class="cs-btn cs-btn-primary" onclick="csRun()">▶ Ejecutar</button>
          <button class="cs-btn cs-btn-primary" onclick="csLiveWin()">🔗 Live Server</button>
          <div class="cs-sep"></div>
          <span class="cs-lbl">Layout</span>
          <button class="cs-btn cs-layout-btn" data-pos="right" onclick="csSetLayout('right')" title="Preview a la derecha">◧</button>
          <button class="cs-btn cs-layout-btn" data-pos="bottom" onclick="csSetLayout('bottom')" title="Preview abajo">⇅</button>
          <button class="cs-btn cs-layout-btn" data-pos="hidden" onclick="csSetLayout('hidden')" title="Solo editor">⊞</button>
        </div>
        <div class="cs-tabs" id="cs-tabs"></div>
        <div class="cs-main" id="cs-main">
          <div class="cs-editor" id="cs-editor">
            <div class="cs-gutter" id="cs-gutter"></div>
            <textarea class="cs-textarea" id="cs-code" spellcheck="false" oninput="csUpdateGutter()" onscroll="csSyncScroll()" onkeydown="csHandleKey(event)"></textarea>
          </div>
          <div class="cs-resizer" id="cs-resizer"></div>
          <div class="cs-preview" id="cs-preview">
            <iframe class="cs-iframe" id="cs-iframe"></iframe>
            <div class="cs-preview-empty" id="cs-preview-empty">
              <div>🔍 Vista previa</div>
              <small>HTML se renderiza aquí en vivo · JS se ejecuta en la terminal</small>
            </div>
          </div>
        </div>
        <div class="cs-term" id="cs-term">
          <div class="cs-term-out" id="cs-term-out"><span class="cs-term-muted">⎯ Consola lista · Presiona ▶ o escribe código aquí abajo</span></div>
          <div class="cs-term-in">
            <span class="cs-term-prompt">›</span>
            <input class="cs-term-input" id="cs-term-input" placeholder="Escribe JS aquí..." onkeydown="csTermKey(event)">
          </div>
        </div>
      </div>
    `,
    init: () => { csInit(); }
  },
  {
    id: "scientific-grapher", icon: "📉", name: "Graficadora Científica", desc: "Gráficos de laboratorio con ajuste de curvas (lineal, potencial, exponencial)",
    render: () => `
      <div class="sg-container">
        <div class="sg-form">
          <div class="sg-row">
            <div class="sg-field">
              <label>Datos Eje X:</label>
              <textarea id="sg-x" rows="3" placeholder="Ej: 1, 2, 3, 4">1, 2, 3, 4, 5</textarea>
            </div>
            <div class="sg-field">
              <label>Datos Eje Y:</label>
              <textarea id="sg-y" rows="3" placeholder="Ej: 2.1, 4.2, 5.9, 8.1">2.3, 4.1, 6.2, 7.9, 10.1</textarea>
            </div>
          </div>
          <div class="sg-row">
            <div class="sg-field sg-field-sm">
              <label>ΔX (opcional):</label>
              <input type="text" id="sg-ex" placeholder="Ej: 0.1">
            </div>
            <div class="sg-field sg-field-sm">
              <label>ΔY (opcional):</label>
              <input type="text" id="sg-ey" placeholder="Ej: 0.5">
            </div>
            <div class="sg-field sg-field-sm">
              <label>Modelo:</label>
              <select id="sg-model">
                <option value="lineal">Lineal: y = A·x + B</option>
                <option value="potencial">Potencial: y = A·x^B</option>
                <option value="exponencial">Exponencial: y = A·e^(Bx)</option>
              </select>
            </div>
          </div>
          <div class="sg-row">
            <div class="sg-field sg-field-sm">
              <label>Color Datos:</label>
              <select id="sg-color-data">
                <option value="#000000">Negro</option>
                <option value="#2563eb">Azul</option>
                <option value="#dc2626" selected>Rojo</option>
                <option value="#16a34a">Verde</option>
                <option value="#ea580c">Naranja</option>
                <option value="#9333ea">Morado</option>
              </select>
            </div>
            <div class="sg-field sg-field-sm">
              <label>Color Línea:</label>
              <select id="sg-color-fit">
                <option value="#000000">Negro</option>
                <option value="#2563eb">Azul</option>
                <option value="#dc2626">Rojo</option>
                <option value="#16a34a" selected>Verde</option>
                <option value="#ea580c">Naranja</option>
                <option value="#9333ea">Morado</option>
              </select>
            </div>
            <div class="sg-field sg-field-sm">
              <label>Título:</label>
              <input type="text" id="sg-title" value="Gráfico de Laboratorio">
            </div>
          </div>
          <div class="sg-row">
            <div class="sg-field sg-field-sm">
              <label>Eje X:</label>
              <input type="text" id="sg-label-x" value="X">
            </div>
            <div class="sg-field sg-field-sm">
              <label>Eje Y:</label>
              <input type="text" id="sg-label-y" value="Y">
            </div>
            <div class="sg-field sg-field-sm sg-btn-wrap">
              <label>&nbsp;</label>
              <button class="btn" onclick="sgPlot()">📈 Graficar y Analizar</button>
            </div>
          </div>
        </div>
        <div class="sg-row">
          <div class="sg-canvas-wrap">
            <canvas id="sg-canvas" width="700" height="420"></canvas>
          </div>
          <div class="sg-results" id="sg-results">
            <div class="sg-placeholder">📊 Ingresa datos y haz clic en Graficar</div>
          </div>
        </div>
      </div>
      <style>
        .sg-container { display:flex; flex-direction:column; gap:12px; }
        .sg-form { display:flex; flex-direction:column; gap:8px; }
        .sg-row { display:flex; gap:8px; flex-wrap:wrap; }
        .sg-field { flex:1; min-width:140px; display:flex; flex-direction:column; gap:3px; }
        .sg-field-sm { min-width:100px; }
        .sg-field label { font-size:.75rem; font-weight:600; color:var(--text,#333); }
        .sg-field textarea, .sg-field input, .sg-field select {
          font-size:.8rem; padding:5px 8px; border:1px solid #ccc; border-radius:6px;
          background:var(--bg-card,#fff); color:var(--text,#333); font-family:monospace;
        }
        .sg-field textarea { resize:vertical; }
        .sg-btn-wrap { display:flex; align-items:flex-end; }
        .sg-btn-wrap .btn { width:100%; padding:6px 12px; font-size:.8rem; }
        .sg-canvas-wrap { flex:2; min-width:280px; }
        .sg-canvas-wrap canvas { width:100%; height:auto; border-radius:8px; border:1px solid #ddd; cursor:grab; background:#fafafa; }
        .sg-results { flex:1; min-width:200px; background:var(--bg-card,#fff); border-radius:8px; border:1px solid #ddd; padding:12px; font-family:monospace; font-size:.8rem; overflow-y:auto; max-height:420px; }
        .sg-placeholder { color:#999; text-align:center; padding:40px 10px; }
        .sg-results table { width:100%; border-collapse:collapse; }
        .sg-results td { padding:3px 6px; border-bottom:1px solid #eee; }
        .sg-results td:last-child { text-align:right; font-weight:600; }
        .sg-results .section-title { font-weight:700; font-size:.85rem; margin:8px 0 4px; color:var(--primary,#2563eb); }
      </style>
    `,
    init: () => { sgInit(); }
  },
];

// ===== Scientific Grapher =====
let sgCanvas, sgCtx, sgW, sgH;
let sgVp = { xmin: -2, xmax: 12, ymin: -2, ymax: 14 };

function sgInit() {
  sgCanvas = document.getElementById('sg-canvas');
  if (!sgCanvas) return;
  sgCtx = sgCanvas.getContext('2d');
  sgW = sgCanvas.width; sgH = sgCanvas.height;
  sgCanvas.style.cursor = 'grab';
  makeGraphInteractive('sg-canvas', {
    xmin: () => sgVp.xmin, xmax: () => sgVp.xmax,
    ymin: () => sgVp.ymin, ymax: () => sgVp.ymax,
    xmin_set: v => { sgVp.xmin = v; sgPlot({ redraw: true }); },
    xmax_set: v => { sgVp.xmax = v; sgPlot({ redraw: true }); },
    ymin_set: v => { sgVp.ymin = v; sgPlot({ redraw: true }); },
    ymax_set: v => { sgVp.ymax = v; sgPlot({ redraw: true }); },
  }, () => sgPlot({ redraw: true }));
  sgPlot({ redraw: true });
}

function sgParse(v) {
  return String(v).split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
}

function sgPlot(opts) {
  const canvas = document.getElementById('sg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  if (!opts?.redraw) {
    const xv = sgParse(document.getElementById('sg-x').value);
    const yv = sgParse(document.getElementById('sg-y').value);
    if (xv.length < 2 || yv.length < 2) {
      document.getElementById('sg-results').innerHTML = '<div class="sg-placeholder">⚠️ Ingresa al menos 2 puntos en X e Y</div>';
      return;
    }
    const n = Math.min(xv.length, yv.length);
    const xs = xv.slice(0, n), ys = yv.slice(0, n);

    const ex = sgParse(document.getElementById('sg-ex').value);
    const ey = sgParse(document.getElementById('sg-ey').value);
    const errX = ex.length === n ? ex : null;
    const errY = ey.length === n ? ey : null;

    const model = document.getElementById('sg-model').value;
    const colorData = document.getElementById('sg-color-data').value;
    const colorFit = document.getElementById('sg-color-fit').value;
    const title = document.getElementById('sg-title').value || 'Gráfico';
    const labelX = document.getElementById('sg-label-x').value || 'X';
    const labelY = document.getElementById('sg-label-y').value || 'Y';

    const fit = sgFit(xs, ys, errY, model);
    sgVp = sgAutoVp(xs, ys, fit);
    sgDraw(ctx, W, H, xs, ys, errX, errY, fit, model, colorData, colorFit, title, labelX, labelY);
    sgResults(document.getElementById('sg-results'), fit, model);
  } else {
    const oldResults = document.getElementById('sg-results');
    oldResults.innerHTML = oldResults.innerHTML;
    const xs = sgParse(document.getElementById('sg-x').value);
    const ys = sgParse(document.getElementById('sg-y').value);
    if (xs.length < 2 || ys.length < 2) return;
    const n = Math.min(xs.length, ys.length);
    const xv = xs.slice(0, n), yv = ys.slice(0, n);
    const model = document.getElementById('sg-model').value;
    const colorData = document.getElementById('sg-color-data').value;
    const colorFit = document.getElementById('sg-color-fit').value;
    const title = document.getElementById('sg-title').value || 'Gráfico';
    const labelX = document.getElementById('sg-label-x').value || 'X';
    const labelY = document.getElementById('sg-label-y').value || 'Y';
    const fit = sgFit(xv, yv, null, model);
    sgDraw(ctx, W, H, xv, yv, null, null, fit, model, colorData, colorFit, title, labelX, labelY);
  }
}

function sgFit(xs, ys, errY, model) {
  const n = xs.length;
  if (model === 'lineal') {
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (let i = 0; i < n; i++) { sx += xs[i]; sy += ys[i]; sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; }
    const det = n * sxx - sx * sx;
    const A = (n * sxy - sx * sy) / det;
    const B = (sxx * sy - sx * sxy) / det;
    let ssr = 0, sst = 0, my = sy / n;
    for (let i = 0; i < n; i++) {
      const yp = A * xs[i] + B;
      ssr += (ys[i] - yp) ** 2;
      sst += (ys[i] - my) ** 2;
    }
    const r2 = sst > 0 ? 1 - ssr / sst : 1;
    const sigma = Math.sqrt(ssr / (n - 2));
    const eA = sigma * Math.sqrt(n / det);
    const eB = sigma * Math.sqrt(sxx / det);
    const f = x => A * x + B;
    const fstr = `y = ${sgFmt(A)}·x ${B >= 0 ? '+' : '-'} ${sgFmt(Math.abs(B))}`;
    return { A, B, eA, eB, r2, sigma, f, fstr, model };
  } else if (model === 'potencial') {
    const lxs = xs.map(x => Math.log(x)), lys = ys.map(y => Math.log(y));
    let slx = 0, sly = 0, slxlx = 0, slxly = 0;
    for (let i = 0; i < n; i++) { slx += lxs[i]; sly += lys[i]; slxlx += lxs[i] * lxs[i]; slxly += lxs[i] * lys[i]; }
    const det = n * slxlx - slx * slx;
    const B = (n * slxly - slx * sly) / det;
    const lnA = (slxlx * sly - slx * slxly) / det;
    const A = Math.exp(lnA);
    let ssr = 0, sst = 0, my = sly / n;
    for (let i = 0; i < n; i++) {
      const yp = lnA + B * lxs[i];
      ssr += (lys[i] - yp) ** 2;
      sst += (lys[i] - my) ** 2;
    }
    const r2 = sst > 0 ? 1 - ssr / sst : 1;
    const f = x => A * Math.pow(x, B);
    const fstr = `y = ${sgFmt(A)}·x^${sgFmt(B)}`;
    return { A, B, r2, sigma: Math.sqrt(ssr / (n - 2)), f, fstr, model };
  } else if (model === 'exponencial') {
    const lys = ys.map(y => Math.log(y));
    let sx = 0, sly = 0, sxx = 0, sxly = 0;
    for (let i = 0; i < n; i++) { sx += xs[i]; sly += lys[i]; sxx += xs[i] * xs[i]; sxly += xs[i] * lys[i]; }
    const det = n * sxx - sx * sx;
    const B = (n * sxly - sx * sly) / det;
    const lnA = (sxx * sly - sx * sxly) / det;
    const A = Math.exp(lnA);
    let ssr = 0, sst = 0, my = sly / n;
    for (let i = 0; i < n; i++) {
      const yp = lnA + B * xs[i];
      ssr += (lys[i] - yp) ** 2;
      sst += (lys[i] - my) ** 2;
    }
    const r2 = sst > 0 ? 1 - ssr / sst : 1;
    const f = x => A * Math.exp(B * x);
    const fstr = `y = ${sgFmt(A)}·e^(${sgFmt(B)}·x)`;
    return { A, B, r2, sigma: Math.sqrt(ssr / (n - 2)), f, fstr, model };
  }
}

function sgAutoVp(xs, ys, fit) {
  const xmin = Math.min(...xs), xmax = Math.max(...xs);
  const padX = (xmax - xmin) * 0.15 || 1;
  let ymin = Math.min(...ys), ymax = Math.max(...ys);
  const n = 100;
  for (let i = 0; i <= n; i++) {
    const x = xmin + (xmax - xmin) * i / n;
    const y = fit.f(x);
    if (isFinite(y)) { ymin = Math.min(ymin, y); ymax = Math.max(ymax, y); }
  }
  const padY = (ymax - ymin) * 0.15 || 1;
  return { xmin: xmin - padX, xmax: xmax + padX, ymin: ymin - padY, ymax: ymax + padY };
}

function sgDraw(ctx, W, H, xs, ys, errX, errY, fit, model, colorData, colorFit, title, labelX, labelY) {
  const { xmin, xmax, ymin, ymax } = sgVp;
  const mapX = x => (x - xmin) / (xmax - xmin) * W;
  const mapY = y => H - (y - ymin) / (ymax - ymin) * H;

  ctx.clearRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 0.5;
  const nx = Math.max(4, Math.round(W / 80));
  const ny = Math.max(4, Math.round(H / 60));
  for (let i = 0; i <= nx; i++) {
    const x = xmin + (xmax - xmin) * i / nx;
    ctx.beginPath(); ctx.moveTo(mapX(x), 0); ctx.lineTo(mapX(x), H); ctx.stroke();
  }
  for (let i = 0; i <= ny; i++) {
    const y = ymin + (ymax - ymin) * i / ny;
    ctx.beginPath(); ctx.moveTo(0, mapY(y)); ctx.lineTo(W, mapY(y)); ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, mapY(0)); ctx.lineTo(W, mapY(0)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(mapX(0), 0); ctx.lineTo(mapX(0), H); ctx.stroke();

  // Fit curve
  ctx.strokeStyle = colorFit; ctx.lineWidth = 2.5;
  ctx.beginPath();
  let started = false;
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const x = xmin + (xmax - xmin) * i / steps;
    const y = fit.f(x);
    if (!isFinite(y)) { started = false; continue; }
    const px = mapX(x), py = mapY(y);
    if (px < -50 || px > W + 50 || py < -50 || py > H + 50) { started = false; continue; }
    if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Error bars
  if (errY || errX) {
    ctx.strokeStyle = colorData; ctx.lineWidth = 1;
    for (let i = 0; i < xs.length; i++) {
      const px = mapX(xs[i]), py = mapY(ys[i]);
      if (errY) {
        const ey = errY[i] || 0;
        const py1 = mapY(ys[i] - ey), py2 = mapY(ys[i] + ey);
        ctx.beginPath(); ctx.moveTo(px, py1); ctx.lineTo(px, py2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px - 3, py1); ctx.lineTo(px + 3, py1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px - 3, py2); ctx.lineTo(px + 3, py2); ctx.stroke();
      }
      if (errX) {
        const ex = errX[i] || 0;
        const px1 = mapX(xs[i] - ex), px2 = mapX(xs[i] + ex);
        ctx.beginPath(); ctx.moveTo(px1, py); ctx.lineTo(px2, py); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px1, py - 3); ctx.lineTo(px1, py + 3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px2, py - 3); ctx.lineTo(px2, py + 3); ctx.stroke();
      }
    }
  }

  // Data points
  for (let i = 0; i < xs.length; i++) {
    const px = mapX(xs[i]), py = mapY(ys[i]);
    ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = colorData; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Labels
  ctx.fillStyle = '#333'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(title, W / 2, 18);
  ctx.font = '12px sans-serif';
  ctx.fillText(labelX, W / 2, H - 6);
  ctx.save(); ctx.translate(12, H / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText(labelY, 0, 0); ctx.restore();

  // Axis ticks
  ctx.font = '10px monospace'; ctx.fillStyle = '#555';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  for (let i = 0; i <= nx; i++) {
    const x = xmin + (xmax - xmin) * i / nx;
    if (Math.abs(x) < (xmax - xmin) / 200) continue;
    ctx.fillText(sgFmt(x), mapX(x), mapY(0) + 4);
  }
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (let i = 0; i <= ny; i++) {
    const y = ymin + (ymax - ymin) * i / ny;
    if (Math.abs(y) < (ymax - ymin) / 200) continue;
    ctx.fillText(sgFmt(y), mapX(0) - 6, mapY(y));
  }

  // Equation on graph
  ctx.fillStyle = colorFit; ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText(fit.fstr, 12, 38);
  ctx.fillStyle = '#555'; ctx.font = '11px monospace';
  ctx.fillText(`R² = ${fit.r2.toFixed(4)}`, 12, 56);
}

function sgResults(el, fit, model) {
  const params = [
    ['A', fit.A, fit.eA],
    ['B', fit.B, fit.eB],
  ];
  let html = '<div class="section-title">📈 Ecuación de ajuste</div>';
  html += `<div style="margin:4px 0 8px;font-size:.9rem">${fit.fstr}</div>`;
  html += '<div class="section-title">📊 Parámetros</div><table>';
  for (const [name, val, err] of params) {
    html += `<tr><td>${name}</td><td>${sgFmt(val)} ${err !== undefined ? '± ' + sgFmt(err) : ''}</td></tr>`;
  }
  html += '</table>';
  html += '<div class="section-title">✅ Bondad de ajuste</div><table>';
  html += `<tr><td>R²</td><td>${fit.r2.toFixed(6)}</td></tr>`;
  html += `<tr><td>σ (Error estándar)</td><td>${sgFmt(fit.sigma)}</td></tr>`;
  html += '</table>';
  html += '<div class="section-title">📋 Datos</div><table>';
  const xs = sgParse(document.getElementById('sg-x').value);
  const ys = sgParse(document.getElementById('sg-y').value);
  const n = Math.min(xs.length, ys.length);
  html += '<tr><td>Puntos</td><td>' + n + '</td></tr>';
  html += `<tr><td>Modelo</td><td style="text-transform:capitalize">${model}</td></tr>`;

  if (fit.model === 'lineal') {
    html += '<tr><td colspan="2" style="font-size:.7rem;color:#888;text-align:center;padding-top:8px">';
    html += 'y = A·x + B &nbsp;|&nbsp; A = pendiente, B = intercepto</td></tr>';
  } else if (fit.model === 'potencial') {
    html += '<tr><td colspan="2" style="font-size:.7rem;color:#888;text-align:center;padding-top:8px">';
    html += 'y = A·x^B &nbsp;|&nbsp; A = coeficiente, B = exponente</td></tr>';
  } else if (fit.model === 'exponencial') {
    html += '<tr><td colspan="2" style="font-size:.7rem;color:#888;text-align:center;padding-top:8px">';
    html += 'y = A·e^(B·x) &nbsp;|&nbsp; A = valor inicial, B = tasa</td></tr>';
  }
  html += '</table>';
  el.innerHTML = html;
}

function sgFmt(n) {
  if (!isFinite(n) || isNaN(n)) return '—';
  if (Math.abs(n) >= 1000) return n.toExponential(3);
  if (Math.abs(n) >= 1) return n.toFixed(4);
  if (Math.abs(n) >= 0.001) return n.toFixed(6);
  return n.toExponential(3);
}

const CONV = {
  length: { units: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"], base: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 } },
  weight: { units: ["mg", "g", "kg", "t", "oz", "lb"], base: { mg: 0.000001, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592 } },
  volume: { units: ["ml", "l", "gal", "qt", "pt", "cup", "fl oz"], base: { ml: 0.001, l: 1, gal: 3.78541, qt: 0.946353, pt: 0.473176, "cup": 0.236588, "fl oz": 0.0295735 } },
  temp: { units: ["°C", "°F", "K"], custom: true },
};

