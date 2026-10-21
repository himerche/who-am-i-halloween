// Spooky Games · Monster Says: «Simón dice» con un monstruo y «Zombie Freeze» (bailar y congelarse cuando para la música).
(function () {
  const { esc, azar, elegir, barajar } = BANCO;
  const { $, esperar, SFX } = J;
  const COLOR = "#a6ff4d";

  const ORDENES = {
    1: [["👃", "touch your nose"], ["👏", "clap your hands"], ["🦘", "jump"], ["🔄", "turn around"], ["🪑", "sit down"], ["🧍", "stand up"], ["🦇", "fly like a bat"],
      ["🧟", "walk like a zombie"], ["😱", "make a scary face"], ["👻", "say BOO"], ["💀", "shake like a skeleton"], ["🙆", "touch your head"], ["👋", "wave your hands"],
      ["🦶", "stamp your feet"], ["🐈", "meow like a cat"], ["🐺", "howl like a wolf"], ["🦉", "hoot like an owl"], ["🙌", "put your hands up"], ["👇", "put your hands down"],
      ["3️⃣", "jump three times"], ["😴", "sleep like a vampire"], ["👂", "touch your ears"], ["🐸", "jump like a frog"], ["😄", "smile"]],
    2: [["👂", "touch your left ear"], ["🦵", "hop on your right foot"], ["🧪", "stir the potion"], ["🧹", "ride your broomstick"], ["🕷️", "creep like a spider"],
      ["🗿", "freeze like a statue"], ["🎃", "carve a pumpkin"], ["🧻", "walk like a mummy"], ["🖐️", "count to five on your fingers"], ["🦵", "touch your knees and your shoulders"],
      ["⬅️", "take three steps backwards"], ["🔵", "point to something blue"], ["✋", "wave your right hand"], ["🙈", "cover your eyes"], ["💪", "show me your strong arms"],
      ["🐍", "move like a snake"], ["🧛", "hide behind your cape"], ["🧙‍♀️", "cast a spell"], ["🦷", "show me your teeth"], ["🔟", "clap ten times"]],
    3: [["🧛", "pretend you are a hungry vampire"], ["🐌", "walk slowly like a tired zombie"], ["⬆️", "jump as high as you can"], ["🔄", "put your hands on your head and turn around twice"],
      ["🦶", "touch your toes, then touch the sky"], ["💀", "do the skeleton dance"], ["😨", "show me how you feel when you see a ghost"], ["⚫", "jump twice if you are wearing something black"],
      ["👫", "clap three times if you have got a brother or a sister"], ["🧹", "act like a witch who has lost her broom"], ["🤫", "whisper your name like a ghost"],
      ["🥶", "shiver like you are in a cold graveyard"], ["🐺", "turn into a werewolf slowly"], ["🎂", "stand up if your birthday is in October"], ["🍬", "pretend you are eating a giant lollipop"],
      ["👀", "look left, look right, then look scared"], ["🎻", "play an invisible spooky violin"], ["🦵", "stand on one leg and count to five"]],
  };
  const BAILES = [["💀", "Dance like a skeleton!"], ["👻", "Float like a ghost!"], ["🧟", "Dance like a zombie!"], ["🦇", "Flap your wings like a bat!"], ["🧙‍♀️", "Stir the cauldron and dance!"],
    ["🐸", "Jump like a frog!"], ["🕷️", "Wiggle your eight legs like a spider!"], ["🧛", "Dance like a vampire with your cape!"], ["🎃", "Roll like a pumpkin!"], ["🙌", "Hands in the air!"],
    ["🐈", "Dance like a black cat!"], ["🌀", "Spin around!"], ["🧻", "Dance like a mummy!"], ["🐺", "Dance like a werewolf!"]];

  const MONSTRUO = `<svg viewBox="0 0 300 330" class="mon" aria-hidden="true">
    <g class="brazo iz"><path d="M62 180C30 170 20 140 22 110" stroke="#5aa832" stroke-width="22" fill="none" stroke-linecap="round"/><circle cx="22" cy="104" r="16" fill="#6cc23c"/></g>
    <g class="brazo de"><path d="M238 180c32-10 42-40 40-70" stroke="#5aa832" stroke-width="22" fill="none" stroke-linecap="round"/><circle cx="278" cy="104" r="16" fill="#6cc23c"/></g>
    <path d="M95 290v28M205 290v28" stroke="#4a8f28" stroke-width="26" stroke-linecap="round"/>
    <path d="M90 62l-20-50 45 34zM210 62l20-50-45 34z" fill="#f4eedb" stroke="#2a1a0a" stroke-width="5" stroke-linejoin="round"/>
    <path d="M150 40c78 0 112 60 112 130 0 80-44 130-112 130S38 250 38 170C38 100 72 40 150 40z" fill="#6cc23c" stroke="#1e4a0c" stroke-width="6"/>
    <circle cx="95" cy="220" r="12" fill="#58a830"/><circle cx="212" cy="240" r="16" fill="#58a830"/><circle cx="190" cy="90" r="9" fill="#58a830"/>
    <g class="ojo"><circle cx="150" cy="130" r="50" fill="#fff" stroke="#1e4a0c" stroke-width="6"/><g class="pupila"><circle cx="150" cy="134" r="22" fill="#5a1e8a"/><circle cx="150" cy="134" r="11" fill="#000"/><circle cx="142" cy="126" r="6" fill="#fff"/></g>
      <path class="parpado" d="M100 130a50 50 0 0 1 100 0z" fill="#6cc23c" stroke="#1e4a0c" stroke-width="6"/></g>
    <g class="boca"><path d="M95 210q55 55 110 0q-55 20-110 0z" fill="#3a0a1a" stroke="#1e4a0c" stroke-width="6" stroke-linejoin="round"/>
      <path d="M112 214l8 16 8-14M172 216l8 14 8-16" fill="#fff"/></g>
  </svg>`;

  let st = null, generacion = 0;
  const juego = {
    id: "dice", nombre: "Monster Says", emoji: "👹", color: COLOR,
    desc: "¡A moverse! «Monster says…» (Simón dice) y «Zombie Freeze»: bailad con la música y congelaos cuando pare.",
    tags: ["🕺 Toda la clase", "🏃 Movimiento", "👂 Listening", "⏱️ 5–15 min"],
    enJuego: () => !!st, cerrar() { fin(); },
    abrir() {
      J.preparar(juego, {
        equipos: false,
        reglas: [
          "Toda la clase <b>de pie</b>, con un poco de espacio. El monstruo da órdenes en inglés.",
          "<b>Monster says:</b> solo hay que obedecer si la orden empieza por <i>«Monster says…»</i>. Si no lo dice y te mueves... ¡te sientas! 🪑",
          "<b>Zombie Freeze:</b> bailad como dice la pantalla mientras suena la música. Cuando pare: <b>FREEZE!</b> 🧊 Quien se mueva o se ría, se sienta.",
          "Gana quien siga de pie al final. Podéis jugar varias rondas y «resucitar» a todos con el botón 🧟.",
          "Teclas: <b>Espacio</b> pausa · <b>→</b> siguiente.",
        ],
        opciones: [
          { id: "modo", t: "🎮 Modo", def: "mix", valores: [["dice", "👹 Monster says"], ["freeze", "🧊 Zombie Freeze"], ["mix", "🎲 Los dos"]] },
          { id: "niveles", t: "⭐ Órdenes", multi: true, def: [1, 2], valores: [[1, "⭐ Fáciles"], [2, "⭐⭐ Medias"], [3, "⭐⭐⭐ Difíciles"]] },
          { id: "vel", t: "⚡ Velocidad", def: 4.5, valores: [[6, "🐢 Despacio"], [4.5, "🚶 Normal"], [3.2, "🐇 Rápido"]] },
          { id: "trampas", t: "😈 Órdenes trampa (sin «Monster says»)", def: .35, valores: [[.2, "Pocas"], [.35, "Normales"], [.5, "¡Muchas!"]] },
        ],
        alJugar: empezar,
      });
    },
  };
  J.registrar(juego);

  function empezar(o) {
    st = { o, pausa: false, n: 0, token: ++generacion, fase: null };
    $("#escena").innerHTML = `<style>
      .md { flex: 1; display: grid; grid-template-columns: minmax(14rem, 34%) 1fr; gap: 1.5rem; align-items: center; }
      @media (max-width: 800px) { .md { grid-template-columns: 1fr; } }
      .md .mon { width: 100%; max-height: calc(100vh - 14rem); filter: drop-shadow(0 20px 30px #000c); }
      .mon .pupila { animation: mirar 4s ease-in-out infinite; } @keyframes mirar { 25% { transform: translate(-14px, 4px); } 60% { transform: translate(14px, -2px); } }
      .mon .parpado { transform-origin: 150px 80px; transform: scaleY(0); animation: parpadear 5s infinite; }
      @keyframes parpadear { 0%, 92%, 100% { transform: scaleY(0); } 95% { transform: scaleY(1); } }
      .mon .boca { transform-origin: 150px 215px; }
      .habla .mon .boca { animation: hablar .22s infinite alternate; } @keyframes hablar { to { transform: scaleY(1.6); } }
      .baila .mon { animation: bailar .5s infinite alternate ease-in-out; } @keyframes bailar { from { transform: rotate(-6deg) translateY(0); } to { transform: rotate(6deg) translateY(-14px); } }
      .baila .mon .brazo.iz { animation: bIz .5s infinite alternate; transform-origin: 62px 180px; } .baila .mon .brazo.de { animation: bDe .5s infinite alternate; transform-origin: 238px 180px; }
      @keyframes bIz { to { transform: rotate(40deg); } } @keyframes bDe { to { transform: rotate(-40deg); } }
      .congela .mon { filter: drop-shadow(0 0 30px #9fe7ff) hue-rotate(140deg) saturate(.6); }
      .bocadillo { position: relative; background: var(--hueso); color: #1a1020; border-radius: 40px; padding: 1.6rem 2rem; min-height: 16rem; display: grid; place-items: center;
        text-align: center; box-shadow: 0 20px 50px #000a; }
      .bocadillo::before { content: ""; position: absolute; left: -2.2rem; top: 45%; border: 1.4rem solid transparent; border-right: 2.4rem solid var(--hueso); }
      @media (max-width: 800px) { .bocadillo::before { display: none; } }
      .bocadillo .e { font-size: 6rem; line-height: 1; }
      .bocadillo .ms { font-family: var(--display); font-size: 2.6rem; color: #2f7a14; display: block; }
      .bocadillo .t { font-size: 3.2rem; font-weight: 700; line-height: 1.15; }
      .bocadillo.trampa-rev { background: #ffd6dc; } .bocadillo.trampa-rev .t { color: #b0102a; }
      .bocadillo.ok-rev { background: #dfffc8; }
      .bocadillo.frio { background: #d6f6ff; } .bocadillo.frio .t { font-family: var(--display); font-weight: 400; font-size: 6rem; color: #0a5a7a; }
      .md-pie { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
      .md-pie .cont { font-size: 1.3rem; color: var(--gris); font-weight: 700; }
    </style>
    <div class="md" id="md"><div>${MONSTRUO}</div><div class="bocadillo" id="boca"></div></div>
    <div class="md-pie"><span class="cont" id="cont"></span>
      <div class="fila"><button class="btn" id="bPausa">⏸ Pausa</button><button class="btn" id="bSig">⏭ Siguiente</button>
      <button class="btn morado" id="bRes">🧟 ¡Todos de pie!</button><button class="btn rojo" id="bFin">⏹ Terminar</button></div></div>`;
    $("#bPausa").onclick = pausar; $("#bSig").onclick = () => { st.saltar = true; };
    $("#bRes").onclick = () => { SFX.magia(); J.decir("Everybody stand up! You are back from the dead!", { pitch: .5 }); };
    $("#bFin").onclick = terminar;
    J.teclas(e => { if (e.key === " ") { pausar(); return true; } if (e.key === "ArrowRight") { st.saltar = true; return true; } });
    J.Reloj.iniciar(o.minutos, terminar);
    bucle();
  }

  const vivo = t => st && st.token === t;
  async function espera(seg, t) {
    const fin = performance.now() + seg * 1000;
    while (performance.now() < fin) {
      if (!vivo(t)) return false;
      if (st.saltar) { st.saltar = false; return true; }
      if (st.pausa) { await esperar(150); continue; }
      await esperar(100);
    }
    return vivo(t);
  }
  function pausar() {
    if (!st) return;
    st.pausa = !st.pausa; $("#bPausa").textContent = st.pausa ? "▶ Seguir" : "⏸ Pausa";
    if (st.pausa) { J.Musica.pausar(); J.callar(); } else if (st.fase === "baile") J.Musica.seguir();
  }
  const md = () => $("#md");
  async function habla(texto, o = {}) {
    md()?.classList.add("habla");
    await J.decir(texto, { pitch: .55, rate: .92, ...o });
    md()?.classList.remove("habla");
  }
  function bocadillo(html, clase = "") { const b = $("#boca"); if (b) { b.className = "bocadillo " + clase; b.innerHTML = html; } }

  async function bucle() {
    const t = st.token;
    const modos = st.o.modo === "mix" ? ["dice", "freeze"] : [st.o.modo];
    let k = 0;
    while (vivo(t)) {
      const m = modos[k++ % modos.length];
      if (m === "dice") await rondaDice(t, st.o.modo === "mix" ? 6 : 1e9);
      else await rondaFreeze(t, st.o.modo === "mix" ? 3 : 1e9);
    }
  }

  async function rondaDice(t, cuantas) {
    st.fase = "dice"; J.Musica.poner("tension"); md()?.classList.remove("baila", "congela");
    const pool = barajar(st.o.niveles.flatMap(l => ORDENES[l]));
    bocadillo(`<div><span class="e">👹</span><div class="t">Monster says...</div><p style="font-size:1.4rem">Listen carefully!</p></div>`);
    await habla("Listen carefully! Only do it if Monster says!");
    let ultTrampa = false;
    for (let i = 0; i < cuantas && vivo(t); i++) {
      while (st.pausa && vivo(t)) await esperar(150);
      const [e, cmd] = pool[i % pool.length];
      const trampa = !ultTrampa && Math.random() < st.o.trampas; ultTrampa = trampa;
      st.n++; $("#cont").textContent = `Order ${st.n}`;
      const frase = (trampa ? "" : "Monster says: ") + cmd + "!";
      bocadillo(`<div><span class="e">${e}</span>${trampa ? "" : `<span class="ms">Monster says:</span>`}<div class="t">${esc(BANCO.cap(cmd))}!</div></div>`);
      await habla(frase);
      if (!(await espera(st.o.vel, t))) return;
      if (trampa) {
        SFX.risa();
        bocadillo(`<div><span class="e">😈</span><div class="t">I didn't say<br>"Monster says"!</div><p style="font-size:1.6rem;margin:.6rem 0 0">If you moved... sit down! 🪑</p></div>`, "trampa-rev");
        await habla("Ha ha ha! I didn't say Monster says! If you moved, sit down!");
        if (!(await espera(2, t))) return;
      } else if (Math.random() < .25) {
        bocadillo(`<div><span class="e">👍</span><div class="t">${elegir(["Good job!", "Well done!", "Great!", "Perfect!"])}</div></div>`, "ok-rev");
        SFX.bien(); if (!(await espera(1.2, t))) return;
      }
      if (J.cfg.sustos !== "no" && Math.random() < .08) { await J.susto(); if (!(await espera(.5, t))) return; }
    }
  }

  async function rondaFreeze(t, veces) {
    for (let v = 0; v < veces && vivo(t); v++) {
      st.fase = "baile"; md()?.classList.remove("congela"); md()?.classList.add("baila");
      J.Musica.poner("baile"); if (st.pausa) J.Musica.pausar();
      const dur = 8 + Math.random() * 12, finB = performance.now() + dur * 1000;
      while (vivo(t) && performance.now() < finB) {
        const [e, txt] = elegir(BAILES);
        bocadillo(`<div><span class="e">${e}</span><div class="t">${esc(txt)}</div></div>`);
        st.n++; $("#cont").textContent = `Dance ${st.n}`;
        J.decir(txt, { pitch: .6, rate: 1 });
        if (!(await espera(Math.min(4 + Math.random() * 2, (finB - performance.now()) / 1000), t))) return;
      }
      if (!vivo(t)) return;
      st.fase = "frio"; J.Musica.pausar(); SFX.campana();
      md()?.classList.remove("baila"); md()?.classList.add("congela");
      bocadillo(`<div><span class="e">🧊</span><div class="t">FREEZE!</div></div>`, "frio");
      J.decir("Freeze!", { pitch: .5, rate: .8 });
      const hielo = 4 + Math.random() * 3;
      if (!(await espera(1.6, t))) return;
      if (Math.random() < .5) {
        bocadillo(`<div><span class="e">👀</span><div class="t" style="font-family:var(--body);font-size:2.6rem">The monster is watching you...<br>Don't move! Don't laugh!</div></div>`, "frio");
        await habla("I'm watching you... Don't move. Don't laugh!", { rate: .8 });
        if (J.cfg.sustos !== "no" && Math.random() < .4) await J.susto();
      }
      if (!(await espera(hielo - 1.6, t))) return;
      bocadillo(`<div><span class="e">🪑</span><div class="t" style="font-size:2.4rem">If you moved, sit down!</div></div>`, "trampa-rev");
      J.decir("If you moved, sit down!", { pitch: .6 });
      if (!(await espera(2.2, t))) return;
      bocadillo(`<div><span class="e">💃</span><div class="t">GO! Dance!</div></div>`, "ok-rev");
      J.decir("Go! Dance!", { pitch: .6 }); SFX.magia();
      if (!(await espera(.8, t))) return;
    }
  }

  function terminar() {
    if (!st) return;
    fin();
    J.Musica.poner("baile"); SFX.fanfarria(); J.confeti(50);
    $("#escena").innerHTML = `<div class="final"><h2>🏆 Well done, monsters!</h2>
      <p class="ganador">¿Quién sigue de pie?<br><b style="--c:var(--veneno)">The winners are still standing!</b></p>
      <div style="font-size:6rem">🧟💃🕺👻</div>
      <div class="fila"><button class="btn verde gigante" id="otra">🔁 Otra vez</button><button class="btn gigante" id="aMenu">🏠 Menú</button></div></div>`;
    J.decir("Well done, monsters! Who is still standing?");
    const o = juego._o;
    $("#otra").onclick = () => empezar(o); $("#aMenu").onclick = () => J.menu();
  }
  function fin() {
    if (!st) return;
    juego._o = st.o; st = null; J.Reloj.parar(); J.callar(); J.teclas(null);
  }
})();
