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
