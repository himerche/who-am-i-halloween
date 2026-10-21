// Spooky Games · motor común: ajustes, sonido y música sintetizados, voz en inglés, sustos, equipos, marcador, preguntas y podio.
(function () {
  const { esc, azar, elegir, barajar } = BANCO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esperar = ms => new Promise(r => setTimeout(r, ms));
  const sinHtml = s => String(s).replace(/<span class="raya">[^<]*<\/span>/g, " blank ").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  const contar = ev => { try { window.contar && window.contar(ev); } catch {} };

  const guardar = (k, v) => { try { localStorage.setItem("spooky-" + k, JSON.stringify(v)); } catch {} };
  const leer = (k, d) => { try { const v = JSON.parse(localStorage.getItem("spooky-" + k)); return v ?? d; } catch { return d; } };

  const EQUIPOS_BASE = [
    { n: "Pumpkins", c: "#ff9a3c", e: "🎃" }, { n: "Ghosts", c: "#9fe7ff", e: "👻" }, { n: "Zombies", c: "#a6ff4d", e: "🧟" },
    { n: "Bats", c: "#c58cff", e: "🦇" }, { n: "Vampires", c: "#ff3d5a", e: "🧛" }, { n: "Witches", c: "#ffd25e", e: "🧙‍♀️" }];

  const cfg = Object.assign({
    equipos: ["Pumpkins", "Ghosts", "Zombies", "Bats"], sonido: true, musica: true, volMusica: .6, voz: "en-GB", velVoz: 1,
    sustos: "suave", letra: 1, leer: true, minutos: 15, juegos: {},
  }, leer("cfg", {}));
  const guardarCfg = () => guardar("cfg", cfg);

  /* ======================= SONIDO ======================= */
  let ctx, master, busSfx, busMusica, ruidoBuf;
  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.connect(ctx.destination);
      busSfx = ctx.createGain(); busSfx.gain.value = .9; busSfx.connect(master);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2800;
      busMusica = ctx.createGain(); busMusica.gain.value = cfg.volMusica * .55; busMusica.connect(lp); lp.connect(master);
      ruidoBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = ruidoBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  addEventListener("pointerdown", () => audio(), { capture: true });
  addEventListener("keydown", () => audio(), { capture: true });
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  function tono(f, t, dur, o = {}) {
    if (!ctx) return;
    const { tipo = "sine", vol = .2, dest = busSfx, f2, att = .01, vib = 0, vibF = 6 } = o;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = tipo; osc.frequency.setValueAtTime(f, t);
    if (f2) osc.frequency.exponentialRampToValueAtTime(f2, t + dur);
    if (vib) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = vibF; lg.gain.value = vib; l.connect(lg).connect(osc.frequency); l.start(t); l.stop(t + dur + .05); }
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    osc.connect(g).connect(dest); osc.start(t); osc.stop(t + dur + .05);
  }
  function ruido(t, dur, o = {}) {
    if (!ctx) return;
    const { vol = .3, tipo = "lowpass", f = 1200, f2, q = 1, dest = busSfx, att = .005 } = o;
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = ruidoBuf; s.loop = true; fl.type = tipo; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(fl).connect(g).connect(dest); s.start(t); s.stop(t + dur + .05);
  }
  const ahora = () => (audio() && cfg.sonido ? ctx.currentTime : null);
  const SFX = {
    bien() { const t = ahora(); if (t == null) return; [660, 880, 1320].forEach((f, i) => tono(f, t + i * .09, .3, { tipo: "triangle", vol: .22 })); tono(1760, t + .27, .5, { vol: .08 }); },
    mal() { const t = ahora(); if (t == null) return; tono(330, t, .35, { tipo: "sawtooth", vol: .1, f2: 220 }); tono(220, t + .3, .55, { tipo: "sawtooth", vol: .1, f2: 110, vib: 8 }); },
    clic() { const t = ahora(); if (t == null) return; tono(900, t, .04, { tipo: "square", vol: .04 }); },
    tic() { const t = ahora(); if (t == null) return; tono(1500, t, .05, { vol: .08 }); },
    paso(k = 0) { const t = ahora(); if (t == null) return; tono(440 + k * 40, t, .09, { tipo: "triangle", vol: .16 }); },
    dado() { const t = ahora(); if (t == null) return; for (let i = 0; i < 9; i++) ruido(t + i * .055 + Math.random() * .02, .04, { tipo: "bandpass", f: 2500 + Math.random() * 1500, q: 4, vol: .35 }); },
    magia() { const t = ahora(); if (t == null) return; for (let i = 0; i < 10; i++) tono(700 + i * 180, t + i * .045, .4, { vol: .05 }); },
    fantasma() { const t = ahora(); if (t == null) return; tono(260, t, 1.6, { vol: .18, f2: 520, vib: 18, vibF: 5, att: .3 }); tono(390, t + .1, 1.5, { vol: .07, f2: 700, vib: 20, att: .4 }); },
    crujido() { const t = ahora(); if (t == null) return; tono(70, t, 1.3, { tipo: "sawtooth", vol: .12, f2: 140, vib: 25, vibF: 23 }); ruido(t, 1.2, { tipo: "bandpass", f: 900, q: 9, vol: .2, f2: 1400 }); },
    trueno() { const t = ahora(); if (t == null) return; ruido(t, 2.8, { f: 500, f2: 60, vol: .9, att: .02 }); ruido(t + .1, .4, { f: 3000, f2: 300, vol: .4 }); },
    latido() { const t = ahora(); if (t == null) return; [0, .22].forEach(d => tono(62, t + d, .2, { vol: .55, f2: 40 })); },
    risa() { const t = ahora(); if (t == null) return; for (let i = 0; i < 7; i++) tono(1000 - i * 45, t + i * .12, .09, { tipo: "square", vol: .06, f2: 700 - i * 30 }); },
    aullido() { const t = ahora(); if (t == null) return; tono(380, t, 2, { vol: .16, f2: 620, vib: 10, att: .4 }); tono(600, t + 1.1, 1.2, { vol: .1, f2: 420, vib: 10 }); },
    campana() { const t = ahora(); if (t == null) return; tono(880, t, 1.8, { vol: .2 }); tono(1760, t, 1.1, { vol: .08 }); tono(2637, t, .7, { vol: .04 }); },
    grito(fuerte) {
      const t = ahora(); if (t == null) return;
      const v = fuerte ? 1 : .45;
      tono(900, t, .9, { tipo: "sawtooth", vol: .22 * v, f2: 1500, vib: 70, vibF: 31 });
      tono(1300, t + .05, .8, { tipo: "square", vol: .1 * v, f2: 600, vib: 60, vibF: 27 });
      ruido(t, .7, { tipo: "bandpass", f: 2200, q: 1.5, vol: .5 * v });
      tono(90, t, 1, { vol: .7 * v, f2: 30 });
    },
    fanfarria() { const t = ahora(); if (t == null) return; [523, 659, 784, 1047].forEach((f, i) => tono(f, t + i * .14, .35, { tipo: "triangle", vol: .2 }));
      [523, 659, 784, 1047].forEach(f => tono(f, t + .62, 1.4, { tipo: "triangle", vol: .12 })); },
  };

  /* ---------- música ---------- */
  const ACORDES = [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]]; // Dm Bb Gm A
  const MELODIA = [74, 0, 77, 0, 81, 80, 81, 0, 77, 0, 74, 0, 76, 77, 76, 0, 74, 0, 77, 0, 81, 82, 81, 79, 77, 76, 74, 73, 74, 0, 0, 0];
  const PISTAS = {
    misterio: { bpm: 74, paso(i, t, d) {
      const ac = ACORDES[Math.floor(i / 8) % 4], m = busMusica;
      if (i % 8 === 0) tono(mtof(ac[0] - 12), t, d * 8, { tipo: "triangle", vol: .2, dest: m, att: .05 });
      tono(mtof([ac[0], ac[1], ac[2], ac[1]][i % 4] + 12), t, d * 1.6, { tipo: "triangle", vol: .05, dest: m });
      if (i % 16 === 0) tono(mtof(ac[2] + 24), t, 2.4, { vol: .035, dest: m });
      if (i % 64 === 44) tono(300, t, 2.4, { vol: .03, dest: m, f2: 520, vib: 15, att: .6 });
    } },
    baile: { bpm: 128, paso(i, t, d) {
      const ac = ACORDES[[0, 0, 2, 3][Math.floor(i / 8) % 4]], m = busMusica;
      if (i % 2 === 0) tono(mtof(ac[0] - 12 + (i % 4 === 2 ? 7 : 0)), t, d * .9, { tipo: "square", vol: .07, dest: m });
      else ac.forEach(n => tono(mtof(n + 12), t, d * .5, { tipo: "triangle", vol: .025, dest: m }));
      if (i % 4 === 2) ruido(t, .12, { tipo: "bandpass", f: 1800, q: .8, vol: .14, dest: m });
      if (i % 2 === 1) ruido(t, .03, { tipo: "highpass", f: 7000, vol: .05, dest: m });
      const n = MELODIA[i % 32]; if (n) tono(mtof(n), t, d * .85, { tipo: "square", vol: .03, dest: m });
    } },
    tension: { bpm: 66, paso(i, t, d) {
      const m = busMusica;
      if (i % 16 === 0) { tono(mtof(38), t, d * 16, { tipo: "sawtooth", vol: .05, dest: m, att: 1 }); tono(mtof(39) + 1, t, d * 16, { tipo: "sawtooth", vol: .035, dest: m, att: 1 }); }
      if (i % 8 === 0) [0, .2].forEach(x => tono(60, t + x, .2, { vol: .3, dest: m, f2: 42 }));
      if (i % 8 === 5 && Math.random() < .5) tono(mtof(86 + azar(6)), t, 1.5, { vol: .02, dest: m });
    } },
  };
  const Musica = {
    pista: null, i: 0, sig: 0, timer: null, pausada: false,
    poner(p) { if (this.pista === p && this.timer) return; this.pista = p; this.pausada = false; this.arrancar(); },
    arrancar() {
      clearInterval(this.timer); this.timer = null;
      if (!this.pista || this.pausada || !cfg.musica || !cfg.sonido || !audio()) return;
      this.i = 0; this.sig = ctx.currentTime + .08;
      this.timer = setInterval(() => {
        const p = PISTAS[this.pista], d = 60 / p.bpm / 2;
        while (this.sig < ctx.currentTime + .2) { p.paso(this.i++, this.sig, d); this.sig += d; }
      }, 40);
    },
    pausar() { this.pausada = true; clearInterval(this.timer); this.timer = null; },
    seguir() { this.pausada = false; this.arrancar(); },
    quitar() { this.pista = null; clearInterval(this.timer); this.timer = null; },
    volumen() { if (busMusica) busMusica.gain.setTargetAtTime(cfg.volMusica * .55, ctx.currentTime, .1); },
  };
  const agacharMusica = baja => { if (busMusica) busMusica.gain.setTargetAtTime(cfg.volMusica * .55 * (baja ? .25 : 1), ctx.currentTime, .15); };

  /* ---------- voz en inglés ---------- */
  let voces = [];
  const cargarVoces = () => { try { voces = speechSynthesis.getVoices(); } catch {} };
  if ("speechSynthesis" in window) { cargarVoces(); speechSynthesis.onvoiceschanged = cargarVoces; }
  function voz() {
    const l = cfg.voz.toLowerCase(), m = v => v.lang.toLowerCase().replace("_", "-");
    const exactas = voces.filter(v => m(v) === l), ingles = voces.filter(v => m(v).startsWith("en"));
    const mejor = a => a.find(v => /natural|online|google/i.test(v.name)) || a[0];
    return mejor(exactas) || mejor(ingles) || null;
  }
  function decir(texto, o = {}) {
    if (!cfg.sonido || !("speechSynthesis" in window) || !texto) return Promise.resolve();
    const { rate = .9, pitch = 1, cola = false } = o;
    if (!cola) speechSynthesis.cancel();
    return new Promise(res => {
      const u = new SpeechSynthesisUtterance(sinHtml(texto));
      const v = voz(); if (v) u.voice = v;
      u.lang = v ? v.lang : cfg.voz; u.rate = rate * cfg.velVoz; u.pitch = pitch;
      let hecho = false; const fin = () => { if (!hecho) { hecho = true; agacharMusica(false); res(); } };
      u.onend = u.onerror = fin; setTimeout(fin, 4000 + texto.length * 120);
      agacharMusica(true); speechSynthesis.speak(u);
    });
  }
  const callar = () => { try { speechSynthesis.cancel(); } catch {} agacharMusica(false); };

  /* ======================= SUSTOS ======================= */
  const CARAS = [
    `<svg viewBox="0 0 300 340"><path d="M150 10C70 10 30 80 30 160v170l30-30 30 30 30-30 30 30 30-30 30 30 30-30 30 30V160C270 80 230 10 150 10z" fill="#f4f4f4" stroke="#000" stroke-width="6"/><ellipse cx="105" cy="140" rx="30" ry="48" fill="#000"/><ellipse cx="195" cy="140" rx="30" ry="48" fill="#000"/><ellipse cx="150" cy="245" rx="40" ry="58" fill="#000"/><circle cx="105" cy="150" r="7" fill="#ff2a2a"/><circle cx="195" cy="150" r="7" fill="#ff2a2a"/></svg>`,
    `<svg viewBox="0 0 300 330"><path d="M150 12C70 12 25 70 25 140c0 45 20 75 45 92v48c0 18 14 30 30 30h100c16 0 30-12 30-30v-48c25-17 45-47 45-92C275 70 230 12 150 12z" fill="#efe7d0" stroke="#000" stroke-width="6"/><path d="M60 140c0-30 25-45 52-40 18 4 28 22 22 46-6 22-28 34-48 28S60 160 60 140zM240 140c0-30-25-45-52-40-18 4-28 22-22 46 6 22 28 34 48 28s26-14 26-34z" fill="#000"/><circle cx="98" cy="140" r="9" fill="#ff1f1f"/><circle cx="202" cy="140" r="9" fill="#ff1f1f"/><path d="M150 175l-18 38h36z" fill="#000"/><path d="M90 245h120M105 232v30M125 232v34M150 232v36M175 232v34M195 232v30" stroke="#000" stroke-width="6"/></svg>`,
    `<svg viewBox="0 0 320 300"><path d="M160 40c-4-22 8-34 24-34" stroke="#2f6b1e" stroke-width="12" fill="none" stroke-linecap="round"/><ellipse cx="160" cy="165" rx="150" ry="125" fill="#ff7a12" stroke="#3a1600" stroke-width="7"/><path d="M160 42v248M95 52c-30 50-30 176 0 226M225 52c30 50 30 176 0 226" stroke="#c4520a" stroke-width="5" fill="none"/><path d="M70 130l60-30 10 55zM250 130l-60-30-10 55z" fill="#ffe14a" stroke="#3a1600" stroke-width="5"/><path d="M60 190q100 90 200 0l-25 10-15-20-20 28-20-26-20 26-20-28-15 20z" fill="#ffe14a" stroke="#3a1600" stroke-width="5"/></svg>`,
    `<svg viewBox="0 0 300 330"><path d="M40 120c0-70 50-105 110-105s110 35 110 105v80c0 70-45 115-110 115S40 270 40 200z" fill="#7fae6a" stroke="#000" stroke-width="6"/><path d="M40 110c20-40 60-55 110-55s90 15 110 55c-30-15-60-22-110-22S70 95 40 110z" fill="#2a2a2a"/><path d="M75 150l60 10-8 30-48-10zM225 150l-60 10 8 30 48-10z" fill="#fff8b0" stroke="#000" stroke-width="5"/><circle cx="108" cy="168" r="7"/><circle cx="192" cy="168" r="7"/><path d="M90 250q60-40 120 0" fill="none" stroke="#000" stroke-width="8"/><path d="M110 240v20M130 232v22M150 230v24M170 232v22M190 240v20" stroke="#fff" stroke-width="6"/><path d="M60 215l25 6M240 215l-25 6M150 70v40M140 80h20M140 95h20" stroke="#000" stroke-width="5"/></svg>`];
  const BOOS = ["BOO!", "BOO!", "AAARGH!", "GOTCHA!", "BOO!"];
  async function susto(forzar) {
    const nivel = forzar || cfg.sustos;
    if (nivel === "no") return;
    const fuerte = nivel === "fuerte";
    callar();
    const d = document.createElement("div");
    d.className = "susto " + (fuerte ? "fuerte" : "suave");
    d.innerHTML = `<div class="cara">${elegir(CARAS)}</div><div class="boo">${elegir(BOOS)}</div>`;
    document.body.appendChild(d);
    audio();
    if (fuerte) { SFX.grito(true); try { navigator.vibrate?.([300, 80, 300]); } catch {} }
    else { SFX.fantasma(); setTimeout(() => decir("Boo!", { pitch: .4, rate: .7 }), 350); }
    await esperar(fuerte ? 1500 : 1900);
    d.style.transition = "opacity .3s"; d.style.opacity = "0";
    await esperar(300); d.remove();
  }

  /* ======================= INTERFAZ ======================= */
  let teclado = null;
  addEventListener("keydown", e => {
    if (e.target.matches("input, select, textarea")) return;
    if (e.key === "f" || e.key === "F") { pantallaCompleta(); return; }
    if (teclado && teclado(e) === true) e.preventDefault();
  });
  const pantallaCompleta = () => { try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); } catch {} };

  function aviso(t, ms = 2200) {
    const d = document.createElement("div"); d.className = "aviso"; d.innerHTML = t; document.body.appendChild(d);
    setTimeout(() => d.remove(), ms);
  }
  function confeti(n = 40) {
    const c = document.createElement("div"); c.className = "confeti";
    const e = ["🍬", "🎃", "👻", "🦇", "⭐", "🍭", "🕸️", "💀"];
    c.innerHTML = Array.from({ length: n }, () => `<span style="left:${Math.random() * 100}vw;animation-duration:${2.5 + Math.random() * 3}s;animation-delay:${Math.random() * 1.5}s">${elegir(e)}</span>`).join("");
    document.body.appendChild(c); setTimeout(() => c.remove(), 7000);
  }

  /* ---------- equipos y comodines ---------- */
  const COMODINES = {
    mitad: { e: "🧪", n: "50:50", d: "Poción 50:50: quita respuestas incorrectas" },
    cambiar: { e: "🧹", n: "Cambiar", d: "Escoba: cambia la pregunta" },
    tiempo: { e: "⏳", n: "+15 s", d: "Reloj de arena: 15 segundos más" },
    escudo: { e: "🛡️", n: "Escudo", d: "Escudo de ajo: te salva de una trampa" },
    linterna: { e: "🔦", n: "Linterna", d: "Linterna: ver todas las cartas 2 segundos" },
    otra: { e: "🍀", n: "Otra vez", d: "Trébol: si fallas, vuelves a intentarlo" },
    mirar: { e: "👀", n: "Mirar", d: "Ojo mágico: ver el monstruo 3 segundos" },
  };
  function equipos(comodines = []) {
    return cfg.equipos.map((n, i) => ({ i, n: n.trim() || EQUIPOS_BASE[i].n, c: EQUIPOS_BASE[i].c, e: EQUIPOS_BASE[i].e, pts: 0,
      com: Object.fromEntries(comodines.map(k => [k, true])) }));
  }
  function marcador(el, eqs, o = {}) {
    const { turno = -1, valor = e => e.pts, onCom, onClick, fuera = () => false } = o;
    el.className = "marcador";
    el.innerHTML = eqs.map(e => `<div class="eq${e.i === turno ? " turno" : ""}${fuera(e) ? " fuera" : ""}${onClick ? " btn-eq" : ""}" style="--c:${e.c}" data-eq="${e.i}"
      ${onClick ? `role="button" tabindex="0" title="Tecla ${e.i + 1}"` : ""}>
      <span class="av">${e.e}</span><span>${esc(e.n)}</span><span class="pts">${valor(e)}</span>
      ${Object.keys(e.com).length ? `<span class="com">${Object.entries(e.com).map(([k, ok]) =>
        `<button data-com="${k}" ${ok && onCom && e.i === turno ? "" : "disabled"} title="${COMODINES[k].d}">${COMODINES[k].e}</button>`).join("")}</span>` : ""}
    </div>`).join("");
    el.onclick = ev => {
      const b = ev.target.closest("[data-com]"), d = ev.target.closest("[data-eq]");
      if (b && onCom) { ev.stopPropagation(); onCom(eqs[+d.dataset.eq], b.dataset.com); return; }
      if (d && onClick) onClick(eqs[+d.dataset.eq]);
    };
  }

  /* ---------- ventana de pregunta ---------- */
  const estrellas = lv => lv ? "⭐".repeat(lv) : "💃";
  // Devuelve Promise<boolean> (acierto). o: { eq, segundos, nueva: () => q }
  function preguntar(q, o = {}) {
    const { eq, segundos = 0, nueva } = o;
    return new Promise(resolver => {
      const capa = document.createElement("div"); capa.className = "capa";
      document.body.appendChild(capa);
      const previo = teclado;
      let restante = segundos, tm = null, acabado = false, trebol = false;
      const cerrar = ok => { clearInterval(tm); callar(); teclado = previo; capa.remove(); resolver(ok); };

      function pintar() {
        const esReto = q.tipo === "reto", opts = q.opciones || [];
        const emoji = q.opcEmoji, tres = opts.length === 3;
        const coms = eq ? Object.entries(eq.com).filter(([k]) => ["mitad", "cambiar", "tiempo", "otra"].includes(k)) : [];
        capa.innerHTML = `<div class="ventana" style="--c:${eq ? eq.c : "var(--linea)"}">
          <div class="sup"><span class="tema">${estrellas(q.lv)} ${esc(q.tema)}</span>
            ${eq ? `<span class="quien">${eq.e} ${esc(eq.n)}</span>` : ""}
            <button class="ib" data-leer title="Leer en voz alta">🔊</button></div>
          ${esReto ? `<div class="reto-e">${q.e}</div>` : ""}
          <h2>${q.titulo}</h2>
          ${q.visual ? `<div class="visual">${q.visual}</div>` : ""}
          ${segundos ? `<div class="barra-t"><i></i></div>` : ""}
          ${esReto ? `<div class="fila"><button class="btn verde gigante" data-reto="1">✅ ¡Conseguido!</button><button class="btn rojo gigante" data-reto="0">❌ No</button></div>`
            : `<div class="opciones${tres ? " tres" : ""}">${opts.map((op, i) => `<button class="opcion${emoji ? " emoji" : ""}" data-op="${i}"><span class="k">${i + 1}</span>${op.html ?? esc(op)}</button>`).join("")}</div>`}
          ${coms.length && !esReto ? `<div class="comodines-q">${coms.map(([k, ok]) => k === "tiempo" && !segundos ? "" :
            `<button data-cq="${k}" ${ok && !(k === "mitad" && opts.length < 3) ? "" : "disabled"} title="${COMODINES[k].d}"><b>${COMODINES[k].e}</b>${COMODINES[k].n}</button>`).join("")}</div>` : ""}
          <div class="pie-q"></div></div>`;
        leerEnVoz();
      }
      function leerEnVoz() {
        if (q.oir) { setTimeout(() => decir(q.oir, { rate: .8 }), 250); return; }
        if (cfg.leer) decir(q.decir || q.titulo);
      }
      function barra() {
        const i = $(".barra-t i", capa); if (!i) return;
        i.style.transform = `scaleX(${Math.max(0, restante / segundos)})`;
      }
      function arrancarReloj() {
        if (!segundos) return;
        clearInterval(tm); barra();
        tm = setInterval(() => {
          restante -= .25; barra();
          if (restante <= 5 && restante > 0 && restante % 1 === 0) SFX.tic();
          if (restante <= 0) { clearInterval(tm); responder(-1); }
        }, 250);
      }
      async function responder(i) {
        if (acabado) return;
        const ok = i === q.ok;
        if (!ok && i >= 0 && trebol) {
          // Trébol activado antes de responder: el primer fallo no cuenta
          const b = $(`[data-op="${i}"]`, capa); b.classList.add("mal"); b.disabled = true; SFX.mal();
          trebol = false; aviso("🍀 ¡Trébol de la suerte! Otro intento", 1800);
          return;
        }
        acabado = true; clearInterval(tm);
        $$(".opcion", capa).forEach((b, k) => { b.disabled = true; if (k === q.ok) b.classList.add("bien"); else if (k === i) b.classList.add("mal"); });
        const pie = $(".pie-q", capa);
        $(".comodines-q", capa)?.remove();
        pie.innerHTML = `<div class="fila" style="margin-top:.8rem"><div class="veredicto ${ok ? "bien" : "mal"}">${ok ? elegir(["Well done!", "Great!", "Correct!", "Fantastic!", "Spooktacular!"]) : i === -1 ? "Time's up!" : "Oh no!"}</div>
          <button class="btn ${ok ? "verde" : "naranja"} gigante" data-seguir>Continuar ▶</button></div>`;
        if (ok) SFX.bien(); else SFX.mal();
        const sol = q.opciones[q.ok];
        setTimeout(() => decir(ok ? $(".veredicto", capa).textContent : `The answer is: ${sol.t ?? sol}`), 350);
        $("[data-seguir]", pie).focus();
        capa.dataset.ok = ok ? "1" : "0";
      }
      capa.addEventListener("click", e => {
        const t = e.target;
        if (t.closest("[data-leer]")) { leerEnVoz(); return; }
        if (t.closest("[data-oir]")) { decir(q.oir, { rate: .75 }); return; }
        const op = t.closest("[data-op]"); if (op && !op.disabled) { responder(+op.dataset.op); return; }
        const r = t.closest("[data-reto]");
        if (r) { const ok = r.dataset.reto === "1"; ok ? SFX.bien() : SFX.mal(); cerrar(ok); return; }
        if (t.closest("[data-seguir]")) { cerrar(capa.dataset.ok === "1"); return; }
        const cq = t.closest("[data-cq]");
        if (cq && !cq.disabled && !acabado) {
          const k = cq.dataset.cq; eq.com[k] = false; SFX.magia();
          if (k === "mitad") {
            const malas = barajar(q.opciones.map((_, i) => i).filter(i => i !== q.ok)).slice(0, Math.floor(q.opciones.length / 2));
            malas.forEach(i => $(`[data-op="${i}"]`, capa).classList.add("fuera"));
            cq.disabled = true;
          } else if (k === "cambiar" && nueva) { q = nueva(); pintar(); restante = segundos; arrancarReloj(); }
          else if (k === "tiempo") { restante += 15; cq.disabled = true; barra(); }
          else if (k === "otra") { cq.disabled = true; trebol = true; aviso("🍀 Trébol activado: si fallas, otro intento", 1800); }
        }
      });
      teclado = e => {
        if (acabado || q.tipo === "reto") {
          if ((e.key === "Enter" || e.key === " ") && acabado) { cerrar(capa.dataset.ok === "1"); return true; }
          return false;
        }
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= (q.opciones || []).length) { const b = $(`[data-op="${n - 1}"]`, capa); if (b && !b.disabled && !b.classList.contains("fuera")) responder(n - 1); return true; }
        return false;
      };
      pintar(); arrancarReloj();
    });
  }

  /* ---------- reloj de partida ---------- */
  const Reloj = {
    fin: 0, timer: null, cb: null, avisado: false,
    iniciar(min, cb) {
      this.parar(); if (!min) return;
      this.fin = Date.now() + min * 60000; this.cb = cb; this.avisado = false;
      const el = $("#reloj"); el.hidden = false;
      const tick = () => {
        const s = Math.max(0, Math.round((this.fin - Date.now()) / 1000));
        el.textContent = `⏰ ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
        el.classList.toggle("poco", s <= 60);
        if (s === 60 && !this.avisado) { this.avisado = true; aviso("⏰ ¡Queda 1 minuto!"); SFX.campana(); }
        if (s === 0) { this.parar(false); SFX.campana(); this.cb && this.cb(); }
      };
      tick(); this.timer = setInterval(tick, 500);
    },
    parar(ocultar = true) { clearInterval(this.timer); this.timer = null; if (ocultar) $("#reloj").hidden = true; },
  };

  /* ---------- pantallas ---------- */
  const JUEGOS = [];
  let actual = null;
  const escena = () => $("#escena");

  function titulo(t) { $("#tituloJuego").textContent = t || ""; }
  const fija = si => $(".app").classList.toggle("fija", !!si);

  function menu() {
    if (actual?.cerrar) actual.cerrar();
    actual = null; teclado = null; Musica.poner("misterio"); Reloj.parar(); callar(); titulo(""); fija(false);
    document.querySelectorAll(".capa").forEach(c => c.remove());
    escena().innerHTML = `
      <div class="portada"><h1>Spooky <span>Games</span></h1><p>Juegos de Halloween en inglés para primaria · Halloween games in English</p></div>
      <div class="juegos">
        ${JUEGOS.map(j => `<button class="tarjeta" data-juego="${j.id}" style="--c:${j.color}">
          <span class="ico">${j.emoji}</span><h2>${j.nombre}</h2><p>${j.desc}</p>
          <span class="tags">${j.tags.map(t => `<span>${t}</span>`).join("")}</span></button>`).join("")}
        <a class="tarjeta otra" href="./" style="text-decoration:none;color:inherit"><span class="ico">🎭</span><h2>Who Am I?</h2>
          <p>El juego de cartas de adivinar personajes y criaturas.</p><span class="tags"><span>👥 Equipos</span><span>📱 Móvil</span></span></a>
      </div>
      <div class="ajustes">
        <section class="panel"><h3>👥 Equipos · Teams</h3>
          <div class="equipos-ed" id="eqEd"></div>
          <p class="fila" style="justify-content:flex-start;margin:.7rem 0 0"><button class="chip" id="masEq">+ Añadir equipo</button><button class="chip" id="menosEq">− Quitar</button></p>
        </section>
        <section class="panel opciones-aj"><h3>⚙️ Ajustes</h3>
          <div><span class="lab">👻 Sustos</span><div class="chips" data-aj="sustos">
            ${[["no", "🙂 Sin sustos"], ["suave", "👻 Suaves"], ["fuerte", "💀 ¡Fuertes!"]].map(([v, t]) => `<button class="chip" data-v="${v}" aria-pressed="${cfg.sustos === v}">${t}</button>`).join("")}</div></div>
          <div><span class="lab">🗣️ Voz en inglés</span><div class="chips" data-aj="voz">
            ${[["en-GB", "🇬🇧 British"], ["en-US", "🇺🇸 American"]].map(([v, t]) => `<button class="chip" data-v="${v}" aria-pressed="${cfg.voz === v}">${t}</button>`).join("")}
            <button class="chip" id="leerQ" aria-pressed="${cfg.leer}">Leer preguntas</button></div></div>
          <div><span class="lab">🔠 Tamaño de letra</span><div class="chips" data-aj="letra">
            ${[[0.9, "Normal"], [1, "Grande"], [1.15, "Enorme"], [1.3, "Gigante"]].map(([v, t]) => `<button class="chip" data-v="${v}" aria-pressed="${cfg.letra === v}">${t}</button>`).join("")}</div></div>
          <div><span class="lab">🎵 Volumen de la música</span><input type="range" min="0" max="1" step=".1" value="${cfg.volMusica}" id="volM" style="width:100%"></div>
          <p class="nota" style="margin:0">Atajos: <b>F</b> pantalla completa · <b>1–6</b> responder / equipos · <b>Espacio</b> continuar. Los sustos fuertes tienen destellos y gritos: elige «suaves» si hay peques sensibles.</p>
        </section>
      </div>`;
    pintarEquipos();
    escena().onclick = e => {
      const j = e.target.closest("[data-juego]"); if (j) { abrir(j.dataset.juego); return; }
      const aj = e.target.closest("[data-aj] [data-v]");
      if (aj) { const k = aj.parentElement.dataset.aj; cfg[k] = k === "letra" ? +aj.dataset.v : aj.dataset.v; guardarCfg(); aplicarCfg();
        $$("[data-v]", aj.parentElement).forEach(b => b.setAttribute("aria-pressed", b === aj));
        if (k === "sustos" && cfg.sustos !== "no") susto(); if (k === "voz") decir("Hello! Happy Halloween!"); return; }
      if (e.target.id === "leerQ") { cfg.leer = !cfg.leer; e.target.setAttribute("aria-pressed", cfg.leer); guardarCfg(); }
      if (e.target.id === "masEq" && cfg.equipos.length < 6) { cfg.equipos.push(EQUIPOS_BASE[cfg.equipos.length].n); guardarCfg(); pintarEquipos(); }
      if (e.target.id === "menosEq" && cfg.equipos.length > 2) { cfg.equipos.pop(); guardarCfg(); pintarEquipos(); }
    };
    $("#volM").oninput = e => { cfg.volMusica = +e.target.value; guardarCfg(); Musica.volumen(); };
  }
  function pintarEquipos() {
    $("#eqEd").innerHTML = cfg.equipos.map((n, i) => `<div class="eq-ed"><span class="av" style="background:${EQUIPOS_BASE[i].c}55">${EQUIPOS_BASE[i].e}</span>
      <input value="${esc(n)}" data-i="${i}" maxlength="16" aria-label="Equipo ${i + 1}"></div>`).join("");
    $("#eqEd").oninput = e => { const i = e.target.dataset.i; if (i != null) { cfg.equipos[+i] = e.target.value; guardarCfg(); } };
  }

  function abrir(id) {
    const j = JUEGOS.find(x => x.id === id); if (!j) return;
    actual = j; teclado = null; titulo(j.emoji + " " + j.nombre); callar();
    escena().onclick = null; escena().innerHTML = ""; fija(false);
    contar("juego: " + j.nombre);
    j.abrir(escena());
    scrollTo(0, 0);
  }

  // Pantalla de preparación estándar. opciones: [{ id, t, valores:[[v, etiqueta]], multi, def }]
  function preparar(j, { reglas, opciones = [], equipos: usaEquipos = true, minutos = true, alJugar }) {
    const guard = cfg.juegos[j.id] || {};
    const val = {};
    for (const o of opciones) val[o.id] = guard[o.id] ?? o.def;
    if (minutos) val.minutos = guard.minutos ?? cfg.minutos;
    const ops = minutos ? [...opciones, { id: "minutos", t: "⏰ Duración de la partida", valores: [[0, "Sin límite"], [10, "10 min"], [15, "15 min"], [20, "20 min"]] }] : opciones;
    Musica.poner("misterio");
    escena().innerHTML = `<div class="prep" style="--c:${j.color}">
      <div class="cab"><span class="ico">${j.emoji}</span><div><h2>${j.nombre}</h2><p>${j.desc}</p></div></div>
      <div class="panel"><h3>📜 Cómo se juega</h3><ul class="reglas">${reglas.map(r => `<li>${r}</li>`).join("")}</ul></div>
      <div class="panel" style="display:grid;gap:1rem">
        ${ops.map(o => `<div class="opc"><b>${o.t}</b><div class="chips" data-op="${o.id}">${o.valores.map(([v, t]) =>
          `<button class="chip" data-v="${v}" aria-pressed="${o.multi ? val[o.id].includes(v) : val[o.id] === v}">${t}</button>`).join("")}</div></div>`).join("")}
        ${usaEquipos ? `<div class="opc"><b>👥 Equipos</b><div class="chips">${equipos().map(e => `<span class="chip" style="border-color:${e.c}">${e.e} ${esc(e.n)}</span>`).join("")}
          <button class="chip" data-menu>✏️ Cambiar en el menú</button></div></div>` : ""}
      </div>
      <div class="fila"><button class="btn verde gigante" data-jugar>▶ ¡Jugar! · Play</button><button class="btn" data-menu>⬅ Menú</button></div>
    </div>`;
    escena().onclick = e => {
      const b = e.target.closest("[data-op] [data-v]");
      if (b) {
        const id = b.parentElement.dataset.op, o = ops.find(x => x.id === id);
        const raw = b.dataset.v, v = typeof o.valores[0][0] === "number" ? +raw : raw;
        if (o.multi) { const s = val[id].includes(v) ? val[id].filter(x => x !== v) : [...val[id], v]; if (!s.length) return; val[id] = s; }
        else val[id] = v;
        $$("[data-v]", b.parentElement).forEach(x => { const xv = typeof o.valores[0][0] === "number" ? +x.dataset.v : x.dataset.v; x.setAttribute("aria-pressed", o.multi ? val[id].includes(xv) : val[id] === xv); });
        SFX.clic();
        cfg.juegos[j.id] = { ...val }; guardarCfg();
        return;
      }
      if (e.target.closest("[data-menu]")) { menu(); return; }
      if (e.target.closest("[data-jugar]")) { cfg.juegos[j.id] = { ...val }; guardarCfg(); SFX.magia(); escena().onclick = null; scrollTo(0, 0); fija(true); alJugar(val); }
    };
    teclado = e => { if (e.key === "Enter") { $("[data-jugar]")?.click(); return true; } };
  }

  // Podio final
  function final(eqs, { valor = e => e.pts, unidad = "pts", otraVez, orden } = {}) {
    Reloj.parar(); teclado = null; fija(false); $$(".capa").forEach(c => c.remove());
    const ord = eqs.slice().sort(orden || ((a, b) => valor(b) - valor(a)));
    const top = valor(ord[0]), ganadores = ord.filter(e => valor(e) === top);
    const empate = ganadores.length > 1;
    Musica.poner("baile"); SFX.fanfarria(); confeti(60);
    const alturas = [7, 5.4, 4.4, 3.7, 3.2, 2.8];
    escena().innerHTML = `<div class="final">
      <h2>🏆 ${empate ? "It's a draw!" : "The winner is..."}</h2>
      <div class="ganador">${ganadores.map(g => `<b style="--c:${g.c}">${g.e} ${esc(g.n)}</b>`).join("")}</div>
      <div class="podio">${ord.map((e, k) => `<div class="p" style="--c:${e.c}"><span class="av">${k === 0 || valor(e) === top ? "👑" : e.e}</span>
        <span class="n">${esc(e.n)}</span><div class="caja" style="height:${alturas[k]}rem">${valor(e)}<small style="font-size:.5em">&nbsp;${unidad}</small></div></div>`).join("")}</div>
      <div class="fila"><button class="btn verde gigante" data-otra>🔁 Otra partida</button><button class="btn gigante" data-menu>🏠 Menú</button></div></div>`;
    setTimeout(() => decir(empate ? "It's a draw! Well done everybody!" : `The winner is... ${ganadores[0].n}! Congratulations!`), 700);
    escena().onclick = e => { if (e.target.closest("[data-otra]")) otraVez(); if (e.target.closest("[data-menu]")) menu(); };
  }

  function aplicarCfg() {
    document.documentElement.style.setProperty("--escala", cfg.letra);
    $("#bSonido").setAttribute("aria-pressed", cfg.sonido); $("#bSonido").textContent = cfg.sonido ? "🔊" : "🔇";
    $("#bMusica").setAttribute("aria-pressed", cfg.musica && cfg.sonido);
    $("#bSustos").textContent = { no: "🙂", suave: "👻", fuerte: "💀" }[cfg.sustos];
    $("#bSustos").title = "Sustos: " + { no: "desactivados", suave: "suaves", fuerte: "fuertes" }[cfg.sustos];
  }
  function iniciarBarra() {
    $("#inicio").onclick = () => { if (actual && actual.enJuego?.() && !confirm("¿Salir de la partida y volver al menú?")) return; menu(); };
    $("#bSonido").onclick = () => { cfg.sonido = !cfg.sonido; guardarCfg(); aplicarCfg(); if (!cfg.sonido) { callar(); Musica.pausar(); } else Musica.seguir(); };
    $("#bMusica").onclick = () => { cfg.musica = !cfg.musica; guardarCfg(); aplicarCfg(); cfg.musica ? Musica.seguir() : Musica.pausar(); };
    $("#bSustos").onclick = () => { cfg.sustos = { no: "suave", suave: "fuerte", fuerte: "no" }[cfg.sustos]; guardarCfg(); aplicarCfg(); aviso("Sustos: " + $("#bSustos").title.split(": ")[1]); };
    $("#bGrande").onclick = () => { pantallaCompleta(); };
    aplicarCfg();
  }

  window.J = {
    $, $$, esc, esperar, sinHtml, cfg, guardarCfg, SFX, Musica, decir, callar, susto, aviso, confeti, COMODINES, equipos, marcador, preguntar,
    Reloj, final, preparar, fija, menu, abrir, titulo, estrellas, audio,
    registrar: j => JUEGOS.push(j),
    teclas: f => { teclado = f; },
    arrancar() { iniciarBarra(); menu(); },
  };
})();
