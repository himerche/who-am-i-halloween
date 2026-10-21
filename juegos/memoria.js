// Spooky Games · Spooky Memory: parejas de vocabulario y gramática por equipos, con cartas susto escondidas.
(function () {
  const { esc, barajar, elegir } = BANCO;
  const { $, $$, esperar, SFX } = J;
  const COLOR = "#9fe7ff";
  const P = BANCO.PAREJAS;

  let st = null;
  const juego = {
    id: "memoria", nombre: "Spooky Memory", emoji: "🃏", color: COLOR,
    desc: "Levantad dos cartas y encontrad las parejas: dibujo y palabra, colores, números, sonidos, contrarios, plurales, pasados…",
    tags: ["👥 Equipos", "⭐ a ⭐⭐⭐", "🧠 Memoria", "⏱️ 10–15 min"],
    enJuego: () => !!st, cerrar() { st = null; },
    abrir() {
      J.preparar(juego, {
        reglas: [
          "Por turnos, cada equipo levanta <b>dos cartas</b>. La app dice cada palabra en inglés: ¡repetidla en voz alta!",
          "Si son pareja, el equipo se las queda (+1 punto) y <b>vuelve a jugar</b>. Si no, se dan la vuelta y pasa el turno.",
          "💀 <b>Cartas susto</b>: si levantas una... ¡BOO! y pierdes el turno.",
          "Comodines (una vez por equipo): 🔦 linterna, ver todas las cartas 2 segundos · 🍀 trébol, si fallas sigues jugando.",
          "Gana el equipo con más parejas.",
        ],
        opciones: [
          { id: "tipo", t: "🃏 Tipo de parejas", def: "imagen", valores: Object.entries(P).map(([k, p]) => [k, `${p.t} ${"⭐".repeat(p.lv)}`]).concat([["mix", "🎲 Mezcla"]]) },
          { id: "nivel", t: "⭐ Vocabulario (dibujo ↔ palabra, números y mezcla)", def: 1, valores: [[1, "⭐ Básico"], [2, "⭐⭐ Ampliado"], [3, "⭐⭐⭐ Todo"]] },
          { id: "parejas", t: "🔢 Número de parejas", def: 8, valores: [[6, "6 parejas"], [8, "8"], [10, "10"], [12, "12"]] },
          { id: "sustos", t: "💀 Cartas susto", def: 1, valores: [[0, "Ninguna"], [1, "1"], [2, "2"]] },
        ],
        alJugar: empezar,
      });
    },
  };
  J.registrar(juego);

  function generar(o) {
    if (o.tipo !== "mix") return P[o.tipo].gen(o.parejas, Math.max(1, o.nivel));
    const tipos = Object.keys(P).filter(k => P[k].lv <= o.nivel && k !== "dibujos");
    const r = []; let k = 0; const orden = barajar(tipos);
    while (r.length < o.parejas) {
      const t = orden[k++ % orden.length], nuevos = P[t].gen(2, o.nivel).filter(p => !r.some(q => q[0].decir === p[0].decir || q[1].decir === p[1].decir));
      r.push(...nuevos.slice(0, o.parejas - r.length));
      if (k > 50) break;
    }
    return r;
  }

  function empezar(o) {
    const pares = generar(o);
    const cartas = [];
    pares.forEach((p, i) => p.forEach(c => cartas.push({ ...c, par: i })));
    for (let k = 0; k < o.sustos; k++) cartas.push({ susto: true, html: `<span class="ce">${elegir(["💀", "👻", "🧟", "👹"])}</span><span class="cw">BOO!</span>`, decir: "Boo!" });
    st = { o, cartas: barajar(cartas), eqs: J.equipos(["linterna", "otra"]), turno: 0, abiertas: [], bloqueo: false, hechas: 0, pares: pares.length, trebol: false };
    st.cartas.forEach((c, i) => { c.i = i; c.estado = "oculta"; });
    J.Musica.poner("misterio");
    J.Reloj.iniciar(o.minutos, () => { if (st) { J.aviso("⏰ ¡Se acabó el tiempo!", 2500); setTimeout(acabar, 1500); } });
    const n = st.cartas.length, cols = Math.max(3, Math.round(Math.sqrt(n * 16 / 9 * .78))), filas = Math.ceil(n / cols);
    const tam = n <= 13 ? 1.25 : n <= 17 ? 1.05 : n <= 21 ? .92 : .82;
    $("#escena").innerHTML = `<style>
      .mem { flex: 1; display: grid; grid-template-columns: repeat(${cols}, 1fr); grid-template-rows: repeat(${filas}, minmax(0, 1fr)); gap: .6rem; min-height: 18rem; --t: ${tam}; }
      .carta-m { perspective: 900px; border: 0; background: none; padding: 0; min-height: 3.5rem; }
      .carta-m .gira { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform .5s cubic-bezier(.3, 1.3, .5, 1); }
      .carta-m.vista .gira, .carta-m.hecha .gira, .mem.espia .carta-m .gira { transform: rotateY(180deg); }
      .carta-m .cara { position: absolute; inset: 0; border-radius: 20px; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: .2rem; border: 4px solid #000; box-shadow: 0 8px 18px #000a; overflow: hidden; padding: .3rem; text-align: center; }
      .carta-m .dorso { background: radial-gradient(circle at 50% 50%, #2a5a3a 0, #11301e 60%), #11301e;
        background-image: repeating-radial-gradient(circle at 50% 50%, transparent 0 18px, #a6ff4d22 18px 20px), linear-gradient(45deg, transparent 49%, #a6ff4d22 49% 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, #a6ff4d22 49% 51%, transparent 51%), linear-gradient(#1a4a2a, #0c2416);
        border-color: #2f7a14; font-size: calc(3rem * var(--t)); }
      .carta-m:hover:not(.vista):not(.hecha) .dorso { border-color: var(--veneno); transform: translateY(-3px); }
      .carta-m .frente { background: var(--hueso); color: #1a1020; transform: rotateY(180deg); }
      .carta-m.hecha .frente { background: color-mix(in srgb, var(--c) 35%, var(--hueso)); border-color: var(--c); box-shadow: 0 0 22px var(--c); }
      .carta-m.mal .frente { animation: tiembla .4s; border-color: var(--sangre); }
      .carta-m.trampa .frente { background: #1a0006; color: var(--sangre); }
      .carta-m .ce { font-size: calc(3.6rem * var(--t)); line-height: 1; } .carta-m .cw { font-size: calc(1.1rem * var(--t)); font-weight: 700; }
      .carta-m .ct { font-size: calc(1.9rem * var(--t)); font-weight: 700; line-height: 1.1; word-break: break-word; } .carta-m .ct.pas { color: #6331a8; }
      .carta-m .cc { width: 70%; height: 60%; border-radius: 50%; border: 4px solid #000; }
      .carta-m .cn { font-size: calc(1.9rem * var(--t)); line-height: 1.05; word-break: break-all; } .carta-m .cn.mini { font-size: calc(1.4rem * var(--t)); }
      .carta-m.fuera { visibility: hidden; }
    </style><div id="marcador"></div><p class="turno-de" id="turnoDe" style="flex:none"></p><div class="mem" id="mem">
      ${st.cartas.map(c => `<button class="carta-m${c.susto ? " trampa" : ""}" data-i="${c.i}" aria-label="Carta ${c.i + 1}"><div class="gira">
        <div class="cara dorso">🎃</div><div class="cara frente">${c.html}</div></div></button>`).join("")}</div>`;
    $("#mem").onclick = e => { const b = e.target.closest(".carta-m"); if (b) voltear(st.cartas[+b.dataset.i]); };
    pintarTurno();
  }

  function pintarTurno() {
    const e = st.eqs[st.turno];
    J.marcador($("#marcador"), st.eqs, { turno: st.turno, onCom: comodin });
    $("#turnoDe").innerHTML = `Turn · Turno de <b style="--c:${e.c}">${e.e} ${esc(e.n)}</b>${st.trebol ? " 🍀" : ""}`;
    J.teclas(null);
  }

  async function comodin(e, k) {
    if (!st || st.bloqueo || !e.com[k]) return;
    e.com[k] = false; SFX.magia();
    if (k === "linterna") {
      st.bloqueo = true; J.aviso("🔦 ¡Linterna! Mirad bien...", 2000);
      $("#mem").classList.add("espia"); await esperar(2200);
      if (!st) return; $("#mem").classList.remove("espia"); await esperar(500); st.bloqueo = false;
    } else if (k === "otra") { st.trebol = true; J.aviso("🍀 Trébol: si fallas, sigues jugando", 2000); }
    pintarTurno();
  }

  const btn = c => $(`.carta-m[data-i="${c.i}"]`);
  async function voltear(c) {
    if (!st || st.bloqueo || c.estado !== "oculta") return;
    c.estado = "vista"; btn(c).classList.add("vista"); SFX.clic();
    if (c.susto) {
      st.bloqueo = true;
      await esperar(400); await J.susto(); if (J.cfg.sustos === "no") { SFX.fantasma(); J.decir("Boo!", { pitch: .4 }); await esperar(900); }
      if (!st) return;
      btn(c).classList.add("fuera"); c.estado = "fuera";
      for (const a of st.abiertas) { a.estado = "oculta"; btn(a).classList.remove("vista"); }
      st.abiertas = []; st.trebol = false;
      J.aviso("💀 ¡Carta susto! Pierdes el turno", 1800);
      await esperar(700); return pasar();
    }
    J.decir(c.decir, { rate: .85 });
    st.abiertas.push(c);
    if (st.abiertas.length < 2) return;
    st.bloqueo = true;
    const [a, b] = st.abiertas, e = st.eqs[st.turno];
    await esperar(900);
    if (!st) return;
    if (a.par === b.par) {
      [a, b].forEach(x => { x.estado = "hecha"; const el = btn(x); el.classList.remove("vista"); el.classList.add("hecha"); el.style.setProperty("--c", e.c); });
      e.pts++; st.hechas++; SFX.bien();
      J.decir(elegir(["It's a match!", "Well done!", "Great memory!"]));
      st.abiertas = []; st.bloqueo = false;
      if (st.hechas >= st.pares) return setTimeout(acabar, 900);
      pintarTurno();
    } else {
      [a, b].forEach(x => btn(x).classList.add("mal")); SFX.mal();
      await esperar(1100);
      if (!st) return;
      [a, b].forEach(x => { x.estado = "oculta"; const el = btn(x); el.classList.remove("vista", "mal"); });
      st.abiertas = [];
      if (st.trebol) { st.trebol = false; st.bloqueo = false; J.aviso("🍀 ¡Otra oportunidad!", 1500); pintarTurno(); return; }
      pasar();
    }
  }
  function pasar() {
    if (!st) return;
    st.bloqueo = false; st.trebol = false;
    st.turno = (st.turno + 1) % st.eqs.length;
    pintarTurno();
    J.decir(`${st.eqs[st.turno].n}, your turn!`);
  }
  function acabar() {
    if (!st) return;
    const eqs = st.eqs, o = st.o; st = null;
    J.final(eqs, { unidad: "🃏", otraVez: () => empezar(o) });
  }
})();
