// Spooky Games · Haunted House: tablero por las plantas de una casa encantada. Acierta, tira el dado y llega a los caramelos del desván.
(function () {
  const { esc, azar, elegir, barajar } = BANCO;
  const { $, $$, esperar, SFX } = J;
  const COLOR = "#c58cff";
  const POR_FILA = 8;
  const PLANTAS = [
    { n: "garden", t: "Garden", e: "🌳", c: "#12301c" }, { n: "living room", t: "Living room", e: "🛋️", c: "#2a1a38" },
    { n: "kitchen", t: "Kitchen", e: "🍳", c: "#38251a" }, { n: "bedroom", t: "Bedroom", e: "🛏️", c: "#1a2444" },
    { n: "attic", t: "Attic", e: "🕸️", c: "#2c2c30" }];
  const ESPECIALES = {
    susto: { e: "👻", t: "¡Susto! −3", malo: true }, hechizo: { e: "🧙‍♀️", t: "Hechizo −2", malo: true }, telarana: { e: "🕸️", t: "Telaraña: pierdes turno", malo: true },
    pasadizo: { e: "🚪", t: "Pasadizo +3" }, murcielago: { e: "🦇", t: "Murciélago +2" }, caramelo: { e: "🍬", t: "Caramelo: comodín" },
    reto: { e: "💃", t: "Reto de movimiento +2" }, bola: { e: "🔮", t: "Bola mágica: otro equipo −2" }};
  const NIVELES = [[1, "⭐", "Easy", "1.º–2.º", 0], [2, "⭐⭐", "Medium", "3.º–4.º", 1], [3, "⭐⭐⭐", "Hard", "5.º–6.º", 2]];

  let st = null;
  const juego = {
    id: "casa", nombre: "Haunted House", emoji: "🏚️", color: COLOR,
    desc: "¡Escapad de la casa encantada! Responded preguntas, tirad el dado y subid planta a planta hasta los caramelos del desván.",
    tags: ["👥 Equipos", "⭐ a ⭐⭐⭐", "🎲 Tablero", "⏱️ 10–20 min"],
    enJuego: () => !!st, cerrar() { st = null; },
    abrir() {
      J.preparar(juego, {
        reglas: [
          "En su turno, cada equipo <b>elige la dificultad</b>: ⭐ fácil, ⭐⭐ media o ⭐⭐⭐ difícil. Así juegan juntos los peques y los mayores.",
          "Si acierta, <b>tira el dado</b> 🎲 y avanza. Las preguntas difíciles dan casillas extra (+1 / +2).",
          "Casillas mágicas: 👻 susto (−3), 🧙‍♀️ hechizo (−2), 🕸️ telaraña (pierde turno), 🚪 pasadizo (+3), 🦇 murciélago (+2), 🍬 caramelo (comodín), 💃 reto de movimiento, 🔮 bola mágica.",
          "Comodines de cada equipo (una vez): 🧪 50:50 · 🧹 cambiar pregunta · 🍀 otro intento · 🛡️ escudo contra trampas.",
          "Gana quien llegue primero al desván 🍬. Si se acaba el tiempo, gana el equipo que haya subido más.",
        ],
        opciones: [
          { id: "largo", t: "🏚️ Tamaño de la casa", def: 32, valores: [[24, "Pequeña · 3 plantas"], [32, "Mediana · 4 plantas"], [40, "Grande · 5 plantas"]] },
          { id: "seg", t: "⏳ Tiempo para responder", def: 30, valores: [[0, "Sin tiempo"], [20, "20 s"], [30, "30 s"], [45, "45 s"]] },
        ],
        alJugar: empezar,
      });
    },
  };
  J.registrar(juego);

  function empezar(o) {
    const N = o.largo, esp = {};
    const tipos = ["susto", "susto", "telarana", "hechizo", "pasadizo", "pasadizo", "murcielago", "caramelo", "reto", "reto", "bola"];
    let bolsa = barajar(tipos);
    for (let i = 3; i < N - 2; i += 2 + azar(2)) { if (!bolsa.length) bolsa = barajar(tipos); esp[i] = bolsa.pop(); }
    st = { o, N, esp, eqs: J.equipos(["mitad", "cambiar", "otra", "escudo"]), turno: 0, fin: false, tiempoFuera: false, ocupado: false };
    st.eqs.forEach(e => { e.pos = 0; e.pierde = false; });
    J.Musica.poner("misterio");
    pintar();
    J.Reloj.iniciar(o.minutos, () => { st && (st.tiempoFuera = true); J.aviso("⏰ ¡Se acabó el tiempo! Última jugada", 3000); if (st && !st.ocupado) acabar(); });
    J.decir("Welcome to the haunted house! Can you escape?");
    SFX.crujido();
  }

  function celda(i) {
    const r = Math.floor(i / POR_FILA), k = i % POR_FILA, col = r % 2 === 0 ? k : POR_FILA - 1 - k;
    return { fila: st.N / POR_FILA - r, col: col + 1, planta: r };
  }

  function pintar() {
    const N = st.N, filas = N / POR_FILA;
    const esc_ = $("#escena");
    esc_.innerHTML = `<style>
      .hh { display: grid; grid-template-columns: minmax(0, 1fr) 18rem; gap: 1rem; flex: 1; min-height: 0; }
      @media (max-width: 1000px) { .hh { grid-template-columns: 1fr; } }
      .casa { position: relative; display: flex; flex-direction: column; min-height: 0; }
      .tejado { height: 4.6rem; clip-path: polygon(6% 100%, 50% 0, 94% 100%); background: linear-gradient(#2b1b3d, #1a1026); display: grid; place-items: end center; padding-bottom: .3rem; }
      .tejado span { font-size: 2.2rem; filter: drop-shadow(0 0 12px #ffd25e); animation: parpadeo 4s infinite; }
      @keyframes parpadeo { 0%, 100% { opacity: 1; } 47% { opacity: 1; } 50% { opacity: .2; } 53% { opacity: 1; } }
      .tablero { display: grid; grid-template-columns: repeat(${POR_FILA}, 1fr); grid-template-rows: repeat(${filas}, 1fr);
        gap: .35rem; padding: .5rem; border: 6px solid #2b1b3d; border-top: 0; border-radius: 0 0 18px 18px; background: #0a0610; flex: 1; min-height: 16rem; }
      .tejado { height: 3rem; }
      .planta-et { grid-column: 1 / -1; }
      .cas { position: relative; border-radius: 12px; background: var(--pc); border: 2px solid #ffffff18; display: flex; flex-direction: column; padding: .2rem .3rem; overflow: hidden; }
      .cas .num { font-size: .8rem; color: #ffffff70; font-weight: 700; }
      .cas .ic { position: absolute; inset: 0; display: grid; place-items: center; font-size: 2.3rem; opacity: .9; pointer-events: none; }
      .cas .num { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; position: relative; z-index: 1; }
      .cas.malo { box-shadow: inset 0 0 18px #ff3d5a44; }
      .cas.bueno { box-shadow: inset 0 0 18px #a6ff4d33; }
      .cas.salida, .cas.meta { background: linear-gradient(135deg, #3d2a00, #6b4a00); }
      .cas.meta .ic { font-size: 2.8rem; animation: latir 1.4s infinite; }
      .cas .pl { display: block; color: #ffffffc0; font-size: .72rem; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; position: relative; z-index: 1; }
      .fichas { position: relative; margin-top: auto; display: flex; flex-wrap: wrap; gap: .1rem; z-index: 2; }
      .ficha { width: 2.1rem; height: 2.1rem; border-radius: 50%; display: grid; place-items: center; font-size: 1.45rem; background: var(--c); border: 3px solid #fff;
        box-shadow: 0 4px 10px #000c; animation: pop .3s; }
      .ficha.act { animation: botar .7s infinite; }
      @keyframes pop { from { transform: scale(.3); } }
      @keyframes botar { 50% { transform: translateY(-6px); } }
      .lado { display: flex; flex-direction: column; gap: .8rem; min-height: 0; overflow: auto; }
      .lado .panel { padding: .9rem 1rem; }
      .turno-big { text-align: center; }
      .turno-big .av { font-size: 4rem; line-height: 1; display: block; animation: flota 2s infinite; }
      .turno-big b { font-family: var(--display); font-weight: 400; font-size: 2.2rem; color: var(--c); display: block; line-height: 1.1; }
      .dif { display: grid; gap: .55rem; }
      .dif button { display: flex; align-items: center; gap: .6rem; text-align: left; border: 3px solid var(--linea); background: var(--noche-3); border-radius: 18px; padding: .55rem .8rem; font-weight: 700; }
      .dif button:hover { border-color: var(--oro); transform: translateX(3px); }
      .dif .st { font-size: 1.4rem; min-width: 4.6rem; }
      .dif .tx { flex: 1; font-size: 1.15rem; line-height: 1.1; } .dif .tx small { display: block; color: var(--gris); font-size: .8rem; }
      .dif .bo { color: var(--veneno); font-size: 1.1rem; }
      .leyenda { display: grid; grid-template-columns: 1fr 1fr; gap: .2rem .6rem; font-size: .82rem; color: var(--gris); }
      .dado-capa { display: grid; justify-items: center; gap: 1rem; }
      .dado { width: 10rem; height: 10rem; border-radius: 28px; background: var(--hueso); color: #1a1a1a; display: grid; place-items: center; font-size: 6.5rem; font-weight: 700;
        box-shadow: 0 12px 0 #8a8270, 0 20px 40px #000c; }
      .dado.rueda { animation: rodar .12s linear infinite; }
      @keyframes rodar { 50% { transform: rotate(12deg) scale(.95); } }
      .suma { font-size: 2.6rem; font-weight: 700; } .suma b { color: var(--veneno); font-size: 3.4rem; }
      .elige-eq { display: flex; gap: .8rem; flex-wrap: wrap; justify-content: center; margin-top: 1rem; }
    </style>
    <div id="marcador"></div>
    <div class="hh">
      <div class="casa"><div class="tejado"><span>🕯️</span></div><div class="tablero" id="tablero"></div></div>
      <aside class="lado"><div class="panel" id="turnoPanel"></div>
        <div class="panel"><div class="leyenda">${Object.values(ESPECIALES).map(x => `<span>${x.e} ${x.t}</span>`).join("")}</div></div></aside>
    </div>`;
    const tab = $("#tablero");
    let html = "";
    for (let i = 0; i < N; i++) {
      const c = celda(i), pl = PLANTAS[c.planta], e = st.esp[i], x = e && ESPECIALES[e];
      const primera = (c.planta % 2 === 0 ? c.col === 1 : c.col === POR_FILA);
      html += `<div class="cas${x ? (x.malo ? " malo" : " bueno") : ""}${i === 0 ? " salida" : ""}${i === N - 1 ? " meta" : ""}" style="grid-row:${c.fila};grid-column:${c.col};--pc:${pl.c}" data-i="${i}">
        <span class="num">${i === 0 ? "START" : i}</span>${primera ? `<span class="pl">${pl.e} ${pl.t}</span>` : ""}
        ${i === N - 1 ? `<span class="ic">🍬</span>` : i === 0 ? `<span class="ic">🚪</span>` : x ? `<span class="ic">${x.e}</span>` : ""}
        <div class="fichas"></div></div>`;
    }
    tab.innerHTML = html;
    fichas(); marcador(); panelTurno();
  }
  function fichas() {
    $$(".fichas").forEach(f => f.innerHTML = "");
    for (const e of st.eqs) {
      const f = $(`.cas[data-i="${e.pos}"] .fichas`);
      if (f) f.insertAdjacentHTML("beforeend", `<span class="ficha${e.i === st.turno ? " act" : ""}" style="--c:${e.c}" title="${esc(e.n)}">${e.e}</span>`);
    }
  }
  function marcador() { J.marcador($("#marcador"), st.eqs, { turno: st.turno, valor: e => e.pos === st.N - 1 ? "🍬" : e.pos, onCom: (e, k) => J.aviso(`${J.COMODINES[k].e} ${J.COMODINES[k].d}. Se usa dentro de la pregunta.`) }); }

  function panelTurno() {
    const e = st.eqs[st.turno], p = $("#turnoPanel");
    if (e.pierde) {
      p.innerHTML = `<div class="turno-big" style="--c:${e.c}"><span class="av">🕸️</span><b>${esc(e.n)}</b><p>Está atrapado en la telaraña.<br><b style="font-size:1.3rem;font-family:var(--body)">Pierde este turno.</b></p>
        <button class="btn naranja ancho" data-sig>Siguiente equipo ▶</button></div>`;
      p.querySelector("[data-sig]").onclick = () => { e.pierde = false; siguiente(); };
      J.teclas(k => { if (k.key === "Enter" || k.key === " ") { e.pierde = false; siguiente(); return true; } });
      return;
    }
    p.innerHTML = `<div class="turno-big" style="--c:${e.c}"><span class="av">${e.e}</span><small>Turn · Turno de</small><b>${esc(e.n)}</b></div>
      <p class="centro" style="margin:.5rem 0">Choose a level · Elegid nivel:</p>
      <div class="dif">${NIVELES.map(([lv, s, en, cur, bo]) => `<button data-lv="${lv}"><span class="st">${s}</span><span class="tx">${en}<small>${cur}</small></span><span class="bo">🎲${bo ? " +" + bo : ""}</span></button>`).join("")}</div>`;
    p.querySelectorAll("[data-lv]").forEach(b => b.onclick = () => jugarTurno(+b.dataset.lv));
    J.teclas(k => { const n = +k.key; if (n >= 1 && n <= 3) { jugarTurno(n); return true; } });
    J.decir(`${e.n}, it's your turn!`);
  }

  async function jugarTurno(lv) {
    if (!st || st.ocupado || st.fin) return;
    st.ocupado = true; J.teclas(null);
    const e = st.eqs[st.turno];
    const nueva = () => Math.random() < .12 ? BANCO.reto(lv) : BANCO.pregunta(lv);
    const ok = await J.preguntar(nueva(), { eq: e, segundos: st.o.seg, nueva: () => BANCO.pregunta(lv) });
    if (!st) return;
    marcador();
    if (ok) {
      const d = await dado(lv - 1);
      if (!st) return;
      await mover(e, d);
      if (!st) return;
      if (e.pos >= st.N - 1) return ganar(e);
      await casilla(e);
      if (!st) return;
      if (e.pos >= st.N - 1) return ganar(e);
    }
    st.ocupado = false;
    if (st.tiempoFuera) return acabar();
    siguiente();
  }
  function siguiente() {
    if (!st) return;
    st.turno = (st.turno + 1) % st.eqs.length;
    if (Math.random() < .08) SFX.trueno();
    fichas(); marcador(); panelTurno();
  }

  function dado(bonus) {
    return new Promise(res => {
      const capa = document.createElement("div"); capa.className = "capa";
      capa.innerHTML = `<div class="dado-capa"><div class="dado rueda">?</div><div class="suma"></div></div>`;
      document.body.appendChild(capa);
      const d = capa.querySelector(".dado"); SFX.dado();
      let k = 0;
      const tm = setInterval(() => { d.textContent = 1 + azar(6); if (++k % 3 === 0) SFX.clic(); }, 70);
      setTimeout(() => {
        clearInterval(tm); d.classList.remove("rueda");
        const n = 1 + azar(6), total = n + bonus;
        d.textContent = n;
        capa.querySelector(".suma").innerHTML = bonus ? `${n} + ${bonus} bonus = <b>${total}</b>` : `<b>${total}</b>`;
        SFX.bien(); J.decir(`${BANCO.numEn(total)}!`);
        setTimeout(() => { capa.remove(); res(total); }, 1500);
      }, 1000);
    });
  }

  async function mover(e, pasos) {
    const dir = Math.sign(pasos), plantaAntes = Math.floor(e.pos / POR_FILA);
    for (let k = 0; k < Math.abs(pasos); k++) {
      const n = e.pos + dir; if (n < 0 || n > st.N - 1) break;
      e.pos = n; fichas(); SFX.paso(dir > 0 ? k : -k); await esperar(260);
      if (!st) return;
    }
    marcador();
    const pl = Math.floor(e.pos / POR_FILA);
    if (pl !== plantaAntes && e.pos < st.N - 1) { SFX.crujido(); J.aviso(`${PLANTAS[pl].e} ${PLANTAS[pl].t}`); J.decir(`Welcome to the ${PLANTAS[pl].n}!`); await esperar(900); }
  }

  async function protegido(e) {
    if (!e.com.escudo) return false;
    e.com.escudo = false; marcador(); SFX.magia();
    J.aviso(`🛡️ ¡El escudo protege a ${esc(e.n)}!`, 2200); J.decir("The shield saves you!");
    await esperar(1600); return true;
  }

  async function casilla(e) {
    const tipo = st.esp[e.pos]; if (!tipo) return;
    await esperar(250);
    switch (tipo) {
      case "susto":
        await J.susto(); if (J.cfg.sustos === "no") SFX.fantasma();
        if (await protegido(e)) return;
        J.aviso("👻 ¡Qué susto! Back 3 · Retrocedes 3"); J.decir("Aaah! Go back three!"); await esperar(900); await mover(e, -3); break;
      case "hechizo":
        SFX.risa(); J.aviso("🧙‍♀️ The witch casts a spell! Retrocedes 2"); J.decir("Abracadabra! Go back two!"); await esperar(1200);
        if (await protegido(e)) return; await mover(e, -2); break;
      case "telarana":
        J.aviso("🕸️ Spider web! Pierdes el próximo turno"); J.decir("Oh no! A spider web! You miss a turn."); await esperar(1200);
        if (await protegido(e)) return; e.pierde = true; break;
      case "pasadizo":
        SFX.crujido(); J.aviso("🚪 Secret passage! +3"); J.decir("A secret passage! Go forward three!"); await esperar(1100); await mover(e, Math.min(3, st.N - 1 - e.pos)); break;
      case "murcielago":
        SFX.magia(); J.aviso("🦇 A bat carries you! +2"); J.decir("A bat carries you! Go forward two!"); await esperar(1000); await mover(e, Math.min(2, st.N - 1 - e.pos)); break;
      case "caramelo": {
        SFX.magia(); const gastados = Object.keys(e.com).filter(k => !e.com[k]);
        if (gastados.length) { const k = elegir(gastados); e.com[k] = true; marcador(); J.aviso(`🍬 Treat! Recuperas ${J.COMODINES[k].e} ${J.COMODINES[k].n}`); J.decir("Trick or treat? Treat! You get a wildcard!"); await esperar(1600); }
        else { J.aviso("🍬 Treat! +1"); J.decir("Treat! Go forward one!"); await esperar(900); await mover(e, Math.min(1, st.N - 1 - e.pos)); }
        break; }
      case "reto": {
        J.Musica.poner("baile");
        const ok = await J.preguntar(BANCO.movimiento(), { eq: e });
        J.Musica.poner("misterio");
        if (ok && st) { J.aviso("💃 Great dancing! +2"); await mover(e, Math.min(2, st.N - 1 - e.pos)); }
        break; }
      case "bola": await bola(e); break;
    }
  }

  function bola(e) {
    return new Promise(res => {
      const otros = st.eqs.filter(x => x !== e && x.pos > 0);
      if (!otros.length) { J.aviso("🔮 La bola mágica no ve a nadie..."); setTimeout(res, 1200); return; }
      SFX.magia(); J.decir("Crystal ball! Choose a team. They go back two!");
      const capa = document.createElement("div"); capa.className = "capa";
      capa.innerHTML = `<div class="ventana centro" style="--c:${e.c}"><div class="reto-e">🔮</div><h2>Crystal ball!<br><small>Elegid un equipo: retrocede 2 casillas</small></h2>
        <div class="elige-eq">${otros.map(x => `<button class="btn gigante" style="border-color:${x.c}" data-x="${x.i}">${x.e} ${esc(x.n)}</button>`).join("")}</div></div>`;
      document.body.appendChild(capa);
      capa.onclick = async ev => {
        const b = ev.target.closest("[data-x]"); if (!b) return;
        capa.remove(); const x = st.eqs[+b.dataset.x];
        if (!(await protegido(x))) { SFX.risa(); await mover(x, -2); }
        res();
      };
    });
  }

  function ganar(e) {
    J.Reloj.parar(); SFX.fanfarria(); J.decir(`${e.n} found the sweets!`);
    st.fin = true; $("#turnoPanel").innerHTML = `<div class="turno-big" style="--c:${e.c}"><span class="av">🍬</span><b>${esc(e.n)}</b><p>found the sweets!</p></div>`;
    setTimeout(acabar, 1600);
  }
  function acabar() {
    if (!st) return;
    const eqs = st.eqs, o = st.o; st = null;
    J.final(eqs, { valor: e => e.pos, unidad: "🏠", otraVez: () => empezar(o) });
  }
})();
