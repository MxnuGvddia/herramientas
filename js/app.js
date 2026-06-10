/* App */
const $ = id => document.getElementById(id);
const page = $("page-content");

function homePage() {
  document.title = "Herramientas Gratis — Calculadoras, Conversores y Utilidades";
  page.innerHTML = `
    <div class="ad-banner ad-rect"><div class="ad-placeholder">— Publicidad —</div></div>
    <div class="tool-grid">${TOOLS.map(t => `
      <div class="tool-card" onclick="navigate('${t.id}')">
        <div class="icon">${t.icon}</div>
        <h3>${t.name}</h3>
        <p>${t.desc}</p>
      </div>
    `).join("")}</div>
    <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
  `;
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
      <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
      <div class="tool-box" id="tool-content">${t.render()}</div>
      <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
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

/* Tool functions */
function calcInsert(ch) {
  const inp = $("calc-expr");
  const start = inp.selectionStart, end = inp.selectionEnd;
  inp.value = inp.value.substring(0, start) + ch + inp.value.substring(end);
  inp.selectionStart = inp.selectionEnd = start + ch.length;
  inp.focus(); calcEval();
}
function calcClear() { $("calc-expr").value = ""; $("calc-expr").focus(); calcEval(); }
function calcBack() {
  const inp = $("calc-expr");
  const start = inp.selectionStart;
  if (start > 0) {
    inp.value = inp.value.substring(0, start-1) + inp.value.substring(inp.selectionEnd);
    inp.selectionStart = inp.selectionEnd = start - 1;
  }
  inp.focus(); calcEval();
}
function calcPi() {
  calcInsert('(' + Math.PI + ')');
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

async function hashGen() {
  const t = $("hash-input").value;
  const enc = new TextEncoder().encode(t);
  const md5 = await crypto.subtle.digest("MD5", enc).catch(() => null);
  const sha1 = await crypto.subtle.digest("SHA-1", enc);
  const sha256 = await crypto.subtle.digest("SHA-256", enc);
  $("hash-md5").textContent = md5 ? [...new Uint8Array(md5)].map(b => b.toString(16).padStart(2,"0")).join("") : "no disponible";
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

async function ipRefresh() {
  $("ip-display").textContent = "Cargando...";
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const d = await r.json();
    $("ip-display").textContent = d.ip;
    try {
      const r2 = await fetch(`https://ipapi.co/${d.ip}/json/`);
      const d2 = await r2.json();
      $("ip-info").innerHTML = `${d2.city || ""}, ${d2.region || ""}, ${d2.country_name || ""} &middot; ${d2.org || ""}`;
    } catch(e) { $("ip-info").textContent = ""; }
  } catch(e) {
    $("ip-display").textContent = "Error";
    $("ip-info").textContent = "No se pudo obtener la IP";
  }
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

/* MD1 — Mate Discreta 1 */
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
    <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
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
    <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
  `;
  else if (tab === 'eval') c.innerHTML = `
    <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
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
    <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
  `;
  else if (tab === 'sets') c.innerHTML = `
    <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
    <p style="margin-bottom:8px">Operaciones entre dos conjuntos. Ingresa elementos separados por coma.</p>
    <div class="split">
      <div><label>Conjunto A</label><input type="text" id="md1-sa" value="1,2,3,4,5" placeholder="1,2,3,4,5"></div>
      <div><label>Conjunto B</label><input type="text" id="md1-sb" value="4,5,6,7" placeholder="4,5,6,7"></div>
    </div>
    <div class="btn-group">
      <button class="btn" onclick="md1SetOp('∪')">A ∪ B (Unión)</button>
      <button class="btn" onclick="md1SetOp('∩')">A ∩ B (Intersección)</button>
      <button class="btn btn-secondary" onclick="md1SetOp('-')">A − B (Diferencia)</button>
      <button class="btn btn-secondary" onclick="md1SetOp('Δ')">A Δ B (Simétrica)</button>
      <button class="btn btn-secondary" onclick="md1SetOp('compl')">A<sup>c</sup> (Complemento)</button>
    </div>
    <div id="md1-sets-result" style="margin-top:12px"></div>
    <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
  `;
  else if (tab === 'proof') c.innerHTML = `
    <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
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
    <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
  `;
  else if (tab === 'laws') c.innerHTML = `
    <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
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
    <div class="ad-banner"><div class="ad-placeholder">— Publicidad —</div></div>
  `;
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

function md1SetOp(op) {
  const a = $("md1-sa").value.split(',').map(x => x.trim()).filter(Boolean);
  const b = $("md1-sb").value.split(',').map(x => x.trim()).filter(Boolean);
  const setA = new Set(a), setB = new Set(b);
  let result, label;
  if (op === '∪') { result = new Set([...setA, ...setB]); label = 'A ∪ B'; }
  else if (op === '∩') { result = new Set([...setA].filter(x => setB.has(x))); label = 'A ∩ B'; }
  else if (op === '-') { result = new Set([...setA].filter(x => !setB.has(x))); label = 'A − B'; }
  else if (op === 'Δ') { result = new Set([...setA].filter(x => !setB.has(x)).concat([...setB].filter(x => !setA.has(x)))); label = 'A Δ B'; }
  else if (op === 'compl') { result = new Set([...setA].filter(x => !setB.has(x))); label = 'A<sup>c</sup> (relativo a B)'; }
  const arr = [...result].sort((a,b) => isNaN(a)||isNaN(b) ? String(a).localeCompare(b) : a-b);
  $("md1-sets-result").innerHTML = `
    <div class="split">
      <div class="result-box"><b>A</b> = {${[...setA].join(', ')}} &nbsp; |A| = ${setA.size}</div>
      <div class="result-box"><b>B</b> = {${[...setB].join(', ')}} &nbsp; |B| = ${setB.size}</div>
    </div>
    <div class="result-box" style="font-size:1.1rem;margin-top:8px">
      <b>${label}</b> = {${arr.join(', ')}} &nbsp; |${label.replace(/<sup>c<\/sup>/,'')}| = ${arr.length}
    </div>
  `;
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
