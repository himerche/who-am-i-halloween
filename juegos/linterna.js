// Spooky Games · Flashlight: una linterna recorre la habitación a oscuras. ¿Qué hay escondido? El primer equipo que lo sepa, ¡pulsa!
(function () {
  const { esc, azar, elegir, tomar, numEn, plural } = BANCO;
  const { $, $$, esperar, SFX } = J;
  const COLOR = "#ffd25e";
  const CONTABLES = ["pumpkin", "ghost", "bat", "spider", "skull", "candle", "cat", "owl", "lollipop", "bone", "frog", "witch", "vampire", "zombie", "key", "star", "apple"];

  let st = null, raf = 0;
  const juego = {
    id: "linterna", nombre: "Flashlight", emoji: "🔦", color: COLOR,
    desc: "La habitación está a oscuras... Una linterna se mueve sola. ¿Qué se esconde? ¡Cuanto antes lo adivinéis, más puntos!",
    tags: ["👥 Equipos", "⭐ a ⭐⭐⭐", "⚡ Rápido", "⏱️ 10–15 min"],
    enJuego: () => !!st, cerrar() { parar(); st = null; },
    abrir() {
      J.preparar(juego, {
        reglas: [
          "Hay algo escondido en la oscuridad. La linterna 🔦 se mueve sola y cada vez ilumina más.",
          "El equipo que lo sepa <b>pulsa su número</b> en el teclado (1, 2, 3…) o toca su nombre, y lo dice <b>en inglés</b>: <i>«It's a bat!»</i>",
          "Puntos: empieza valiendo <b>5</b> y baja hasta 1 con el tiempo. Si fallan, ese equipo queda fuera de la ronda.",
          "En «¿Cuántos hay?» hay que contar: <i>«There are three ghosts!»</i>. En «¿Qué ves?» hay que describir la escena: <i>«I can see two bats and a pumpkin.»</i>",
          "¡Cuidado! A veces la linterna encuentra a un fantasma escondido... 👻",
          "Ayudas para toda la clase: 🔤 primera letra (−1 punto) y 🔦 más luz.",
        ],
        opciones: [
          { id: "niveles", t: "⭐ Niveles", multi: true, def: [1, 2], valores: [[1, "⭐ 1.º–2.º"], [2, "⭐⭐ 3.º–4.º"], [3, "⭐⭐⭐ 5.º–6.º"]] },
          { id: "modo", t: "🔍 Tipo de ronda", def: "mix", valores: [["objeto", "What is it? ¿Qué es?"], ["contar", "How many? ¿Cuántos?"], ["escena", "What can you see? ¿Qué ves?"], ["mix", "🎲 Mezcla"]] },
          { id: "rondas", t: "🔁 Rondas", def: 10, valores: [[6, "6"], [10, "10"], [15, "15"], [20, "20"]] },
          { id: "palabras", t: "📝 Mostrar palabras de ayuda", def: "si", valores: [["si", "Sí (3 opciones)"], ["no", "No"]] },
          { id: "control", t: "🖱️ Linterna", def: "auto", valores: [["auto", "Se mueve sola"], ["raton", "La mueve un alumno con el ratón"]] },
        ],
        alJugar: empezar,
      });
    },
  };
  J.registrar(juego);

  function empezar(o) {
    st = { o, eqs: J.equipos(), ronda: 0, r: null };
    J.Musica.poner("tension");
    J.Reloj.iniciar(o.minutos, () => { if (st) st.tiempoFuera = true; J.aviso("⏰ ¡Tiempo! Última ronda", 2500); });
    $("#escena").innerHTML = `<style>
      .fl-cab { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: .6rem; flex-wrap: wrap; }
      .fl-cab h2 { margin: 0; font-size: 2rem; } .fl-cab .pts { font-family: var(--display); font-size: 2.4rem; color: var(--oro); }
      .fl-cab .ronda { color: var(--gris); font-weight: 700; }
      .esce { position: relative; flex: 1; min-height: 16rem; border-radius: 24px; overflow: hidden; border: 4px solid #2a2a18;
        background: repeating-linear-gradient(90deg, #3a2e4a 0 60px, #33294a 60px 120px), #2a2238; cursor: crosshair; }
      .esce .suelo { position: absolute; left: 0; right: 0; bottom: 0; height: 22%; background: repeating-linear-gradient(90deg, #4a3020 0 90px, #3f2818 90px 180px); }
      .esce .ob { position: absolute; transform: translate(-50%, -50%); line-height: 1; filter: drop-shadow(0 8px 10px #000a); }
      .esce .ob.cara { opacity: .95; }
      .oscuro { position: absolute; inset: 0; pointer-events: none; transition: opacity .8s;
        background: radial-gradient(circle at var(--x) var(--y), transparent 0, transparent var(--r), #000 calc(var(--r) + 45px)); }
      .halo { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: soft-light;
        background: radial-gradient(circle at var(--x) var(--y), #fff6b0 0, transparent calc(var(--r) + 20px)); }
      .esce.ver .oscuro, .esce.ver .halo { opacity: 0; }
      .fl-pie { display: flex; gap: .8rem; align-items: center; justify-content: space-between; margin-top: .7rem; flex-wrap: wrap; }
      .ayuda-pal { display: flex; gap: .7rem; flex-wrap: wrap; }
      .ayuda-pal span { font-size: 1.6rem; font-weight: 700; padding: .3rem 1rem; border-radius: 16px; background: var(--noche-3); border: 2px solid var(--linea); }
      .pista-l { font-size: 2rem; font-weight: 700; letter-spacing: .3em; color: var(--oro); }
      .zumbido { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 5; text-align: center; background: #07131cf2; border: 4px solid var(--c);
        border-radius: 28px; padding: 1.2rem 2rem; box-shadow: 0 0 60px var(--c); animation: salta .3s cubic-bezier(.2, 1.6, .5, 1); }
      .zumbido .av { font-size: 4rem; } .zumbido h3 { font-family: var(--display); font-weight: 400; font-size: 2.6rem; margin: 0 0 .8rem; color: var(--c); }
      .sol { position: absolute; left: 50%; bottom: 6%; transform: translateX(-50%); z-index: 5; background: #000c; border-radius: 22px; padding: .6rem 1.6rem; font-size: 2.6rem; font-weight: 700; text-align: center; animation: salta .4s; }
    </style>
    <div id="marcador"></div>
    <div class="fl-cab"><h2 id="pregunta"></h2><span class="ronda" id="ronda"></span><span class="pts" id="ptsR"></span></div>
    <div class="esce" id="esce"><div class="suelo"></div><div id="obs"></div><div class="oscuro"></div><div class="halo"></div><div id="sobre"></div></div>
    <div class="fl-pie"><div class="ayuda-pal" id="ayudaPal"></div>
      <div class="fila"><button class="btn" id="bPista">🔤 Pista</button><button class="btn" id="bLuz">🔦 Más luz</button><button class="btn naranja" id="bVer">👁️ Ver</button></div></div>`;
    $("#esce").addEventListener("mousemove", e => {
      if (!st?.r || st.o.control !== "raton") return;
      const b = e.currentTarget.getBoundingClientRect(); st.r.x = (e.clientX - b.left) / b.width; st.r.y = (e.clientY - b.top) / b.height;
    });
    $("#bPista").onclick = pista; $("#bLuz").onclick = () => { if (st?.r) { st.r.extra = 1; SFX.magia(); } };
    $("#bVer").onclick = () => revelar(null);
    ronda();
  }

  function nuevaRonda() {
    const lv = Math.max(...st.o.niveles), lvs = st.o.niveles;
    let modo = st.o.modo;
    if (modo === "mix") modo = elegir(lvs.includes(1) && lvs.length === 1 ? ["objeto", "objeto", "contar"] : ["objeto", "objeto", "contar", "escena"]);
    const pos = () => ({ x: .1 + Math.random() * .8, y: .15 + Math.random() * .65 });
    const r = { modo, obs: [], x: .5, y: .5, tx: .5, ty: .5, t0: performance.now(), fuera: new Set(), pista: false, extra: 0, cara: null, asustado: false };
    if (modo === "objeto") {
      const v = elegir(BANCO.vocab(elegir(lvs)));
      r.v = v; r.obs.push({ e: v.e, ...pos(), t: 9 });
      r.preg = "What is it? ¿Qué es?"; r.decir = "What is it?"; r.sol = `It's ${BANCO.art(v.en)}!`;
      r.ayuda = BANCO.barajar(tomar(BANCO.vocab(2).filter(x => x.cat === v.cat && x.en !== v.en), 2).map(x => x.en).concat(v.en));
      r.letra = v.en;
    } else {
      const tipos = tomar(CONTABLES, modo === "contar" ? 1 + (lv > 1 ? 1 : 0) : 2 + (lv > 2 ? 1 : 0)).map(BANCO.buscar);
      const sitios = [];
      const libre = () => { for (let k = 0; k < 60; k++) { const p = pos(); if (sitios.every(s => Math.hypot(s.x - p.x, (s.y - p.y) * .6) > .13)) { sitios.push(p); return p; } } const p = pos(); sitios.push(p); return p; };
      r.cuentas = tipos.map(v => ({ v, n: 1 + azar(modo === "contar" ? (lv === 1 ? 5 : 7) : 3) }));
      r.cuentas.forEach(c => { for (let k = 0; k < c.n; k++) r.obs.push({ e: c.v.e, ...libre(), t: 4.6 }); });
      const lista = r.cuentas.map(c => `${c.n === 1 ? BANCO.art(c.v.en) : numEn(c.n) + " " + plural(c.v.en)}`);
      if (modo === "contar") {
        const c = r.cuentas[0];
        r.preg = `How many ${plural(c.v.en)} can you see?`; r.decir = r.preg;
        r.sol = c.n === 1 ? `There is one ${c.v.en}!` : `There are ${numEn(c.n)} ${plural(c.v.en)}!`;
        r.ayuda = tomar([1, 2, 3, 4, 5, 6, 7, 8].filter(n => n !== c.n), 2).concat(c.n).sort((a, b) => a - b).map(numEn);
        r.letra = numEn(c.n);
      } else {
        r.preg = "What can you see? ¿Qué ves?"; r.decir = "What can you see?";
        r.sol = "I can see " + lista.slice(0, -1).join(", ") + " and " + lista[lista.length - 1] + ".";
        r.ayuda = ["I can see..."]; r.letra = null;
      }
    }
    const prob = { no: 0, suave: .3, fuerte: .45 }[J.cfg.sustos];
    if (Math.random() < prob) {
      let p; for (let k = 0; k < 40; k++) { p = pos(); if (r.obs.every(o => Math.hypot(o.x - p.x, (o.y - p.y) * .6) > .2)) break; }
      r.cara = p;
    }
    return r;
  }

  function ronda() {
    if (!st) return;
    st.ronda++;
    if (st.ronda > st.o.rondas || st.tiempoFuera) return acabar();
    const r = st.r = nuevaRonda();
    const esce = $("#esce"); esce.classList.remove("ver");
    $("#sobre").innerHTML = "";
    $("#obs").innerHTML = r.obs.map(o => `<span class="ob" style="left:${o.x * 100}%;top:${o.y * 100}%;font-size:${o.t}rem">${o.e}</span>`).join("")
      + (r.cara ? `<span class="ob cara" style="left:${r.cara.x * 100}%;top:${r.cara.y * 100}%;font-size:5rem">${elegir(["👻", "💀", "🧟", "👹"])}</span>` : "");
    $("#pregunta").textContent = r.preg;
    $("#ronda").textContent = `Round ${st.ronda} / ${st.o.rondas}`;
    $("#ayudaPal").innerHTML = st.o.palabras === "si" || r.modo === "escena" ? r.ayuda.map(a => `<span>${esc(a)}</span>`).join("") : "";
    $("#bPista").disabled = !r.letra; $("#bVer").disabled = false;
    marcador();
    J.decir(r.decir);
    teclasRonda();
    parar(); bucle();
  }
  function teclasRonda() {
    J.teclas(e => {
      const n = +e.key;
      if (n >= 1 && n <= st.eqs.length) { zumbar(st.eqs[n - 1]); return true; }
    });
  }

  function puntos() {
    if (!st?.r) return 0;
    const t = (performance.now() - st.r.t0 - (st.r.pausa || 0)) / 1000;
    return Math.max(1, 5 - Math.floor(t / 6) - (st.r.pista ? 1 : 0));
  }
  function marcador() { J.marcador($("#marcador"), st.eqs, { onClick: zumbar, fuera: e => st.r?.fuera.has(e.i) }); }

  function bucle() {
    const esce = $("#esce"); if (!esce || !st?.r) return;
    const r = st.r;
    let ultimo = performance.now();
    const paso = now => {
      if (!st || st.r !== r) return;
      const dt = Math.min(.05, (now - ultimo) / 1000); ultimo = now;
      if (!r.pausado && !r.revelada) {
        const t = (now - r.t0 - (r.pausa || 0)) / 1000;
        if (st.o.control === "auto") {
          if (Math.hypot(r.tx - r.x, r.ty - r.y) < .03) {
            // tras unos segundos la linterna se acerca cada vez más a lo escondido
            const o = elegir(r.obs), cerca = Math.min(.85, t / 22);
            r.tx = Math.random() < cerca ? o.x + (Math.random() - .5) * .25 : .08 + Math.random() * .84;
            r.ty = Math.random() < cerca ? o.y + (Math.random() - .5) * .25 : .1 + Math.random() * .8;
            if (r.cara && Math.random() < .3) { r.tx = r.cara.x; r.ty = r.cara.y; }
          }
          const v = .22 * dt, dx = r.tx - r.x, dy = r.ty - r.y, d = Math.hypot(dx, dy) || 1;
          r.x += dx / d * Math.min(v, d); r.y += dy / d * Math.min(v, d);
        }
        const b = esce.getBoundingClientRect();
        if (r.extra > 0) r.extra = Math.max(0, r.extra - dt / 3);
        const rad = b.width * (.055 + Math.min(.16, t * .0055) + r.extra * .14);
        esce.style.setProperty("--x", r.x * b.width + "px"); esce.style.setProperty("--y", r.y * b.height + "px"); esce.style.setProperty("--r", rad + "px");
        $("#ptsR").textContent = `${"⭐".repeat(puntos())} ${puntos()}`;
        if (r.cara && !r.asustado && Math.hypot((r.cara.x - r.x) * b.width, (r.cara.y - r.y) * b.height) < rad * .8) { r.asustado = true; asustar(); }
        if (t > 50) revelar(null);
      }
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
  }
  function parar() { cancelAnimationFrame(raf); raf = 0; }

  async function asustar() {
    const r = st.r; pausa(r, true);
    await J.susto();
    if (st?.r === r) pausa(r, false);
  }
  function pausa(r, si) {
    if (si && !r.pausado) { r.pausado = true; r.p0 = performance.now(); }
    else if (!si && r.pausado) { r.pausado = false; r.pausa = (r.pausa || 0) + performance.now() - r.p0; }
  }

  function pista() {
    const r = st?.r; if (!r || !r.letra || r.pista) return;
    r.pista = true; SFX.magia();
    $("#ayudaPal").innerHTML = `<span class="pista-l">${esc(r.letra[0].toUpperCase() + r.letra.slice(1).replace(/[a-z]/gi, "_"))}</span>`;
    $("#bPista").disabled = true;
  }

  function zumbar(e) {
    const r = st?.r; if (!r || r.pausado || r.revelada || r.fuera.has(e.i)) return;
    pausa(r, true); SFX.campana();
    const pts = puntos();
    $("#sobre").innerHTML = `<div class="zumbido" style="--c:${e.c}"><div class="av">${e.e}</div><h3>${esc(e.n)}!</h3>
      <p style="font-size:1.3rem;margin:0 0 .8rem">Say it in English! (${pts} pts)</p>
      <div class="fila"><button class="btn verde gigante" data-ok>✅ Correct</button><button class="btn rojo gigante" data-mal>❌ Wrong</button></div></div>`;
    J.decir(`${e.n}?`);
    let hecho = false;
    const ok = () => { if (hecho) return; hecho = true; e.pts += pts; revelar(e, pts); };
    const mal = () => {
      if (hecho) return; hecho = true;
      SFX.mal(); r.fuera.add(e.i); $("#sobre").innerHTML = ""; marcador(); teclasRonda();
      if (r.fuera.size >= st.eqs.length) revelar(null); else pausa(r, false);
    };
    $("#sobre [data-ok]").onclick = ok; $("#sobre [data-mal]").onclick = mal;
    J.teclas(k => { if (k.key === "Enter") { ok(); return true; } if (k.key === "Backspace" || k.key === "Escape") { mal(); return true; } });
  }

  function revelar(e, pts) {
    const r = st?.r; if (!r || r.revelada) return;
    r.revelada = true; r.pausado = true;
    $("#esce").classList.add("ver");
    if (r.cara) $$(".ob.cara").forEach(x => x.remove());
    if (e) { SFX.bien(); J.confeti(14); } else SFX.fantasma();
    $("#sobre").innerHTML = `<div class="sol">${e ? `<span style="color:${e.c}">${e.e} +${pts}</span><br>` : ""}${esc(r.sol)}</div>`;
    $("#bVer").disabled = true;
    J.decir(r.sol, { rate: .85 });
    marcador();
    const fila = document.createElement("div"); fila.className = "fila"; fila.style.marginTop = ".6rem";
    fila.innerHTML = `<button class="btn verde gigante" id="bSig">${st.ronda >= st.o.rondas || st.tiempoFuera ? "🏆 Ver resultados" : "Next round ▶"}</button>`;
    $("#sobre .sol").appendChild(fila);
    $("#bSig").onclick = ronda;
    J.teclas(k => { if (k.key === " " || k.key === "Enter") { ronda(); return true; } });
  }

  function acabar() {
    parar();
    const eqs = st.eqs, o = st.o; st = null;
    J.final(eqs, { otraVez: () => empezar(o) });
  }
})();
