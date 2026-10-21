// Spooky Games · Monster Maker: monstruos dibujados por piezas. Escuchar y dibujar, construir el monstruo que se describe o crear el tuyo.
(function () {
  const { esc, azar, elegir, numEn } = BANCO;
  const { $, $$, SFX } = J;
  const COLOR = "#ff9a3c";

  const COLORES = {
    red: ["#e5484d", "#a1262b"], blue: ["#3e7bfa", "#1f4fbf"], green: ["#5cc23a", "#2f7a14"], yellow: ["#f5d33b", "#b8960c"],
    orange: ["#ff9a3c", "#c25e0c"], purple: ["#9b5de5", "#6331a8"], pink: ["#f78fb3", "#c2557e"], grey: ["#9aa5ab", "#5f6a70"] };
  const ES = { red: "rojo", blue: "azul", green: "verde", yellow: "amarillo", orange: "naranja", purple: "morado", pink: "rosa", grey: "gris" };

  const raiz = (a, b) => Math.sqrt(Math.max(0, a * a - b * b));
  const FORMAS = {
    round: { d: "M200 130a120 120 0 1 1 0 240a120 120 0 1 1 0-240z", ojoY: 218, ojoW: 82, bocaY: 300, bocaW: 62, brazoY: [235, 300], pierna: 70, cuerno: 62, pelo: 72,
      arriba: x => 250 - raiz(120, x - 200), abajo: x => 250 + raiz(120, x - 200), lado: y => 200 + raiz(120, y - 250) },
    square: { d: "M114 140h172a34 34 0 0 1 34 34v152a34 34 0 0 1-34 34H114a34 34 0 0 1-34-34V174a34 34 0 0 1 34-34z", ojoY: 205, ojoW: 95, bocaY: 295, bocaW: 72, brazoY: [215, 300], pierna: 88, cuerno: 82, pelo: 100,
      arriba: () => 140, abajo: () => 360, lado: () => 320 },
    triangle: { d: "M200 104c10 0 18 6 23 15l112 222c8 16-3 31-21 31H86c-18 0-29-15-21-31L177 119c5-9 13-15 23-15z", ojoY: 252, ojoW: 58, bocaY: 325, bocaW: 66, brazoY: [270, 330], pierna: 100, cuerno: 18, pelo: 18,
      arriba: x => 108 + Math.abs(x - 200) / 135 * 264, abajo: () => 372, lado: y => 200 + (y - 104) / 268 * 135 },
    tall: { d: "M200 100a90 145 0 1 1 0 290a90 145 0 1 1 0-290z", ojoY: 192, ojoW: 60, bocaY: 300, bocaW: 50, brazoY: [225, 295], pierna: 52, cuerno: 44, pelo: 50,
      arriba: x => 245 - 145 * Math.sqrt(Math.max(0, 1 - ((x - 200) / 90) ** 2)), abajo: x => 245 + 145 * Math.sqrt(Math.max(0, 1 - ((x - 200) / 90) ** 2)), lado: y => 200 + 90 * Math.sqrt(Math.max(0, 1 - ((y - 245) / 145) ** 2)) },
  };
  const BASE = { color: "green", forma: "round", ojos: 2, boca: "smile", cuernos: 0, brazos: 2, piernas: 2, pelo: false, alas: false, cola: false, sombrero: false, patron: "none" };
  const MANCHAS = [[140, 300, 16], [262, 322, 20], [172, 352, 12], [252, 200, 13], [122, 232, 11], [288, 262, 15], [208, 372, 14], [102, 330, 13], [300, 350, 12], [180, 160, 11], [230, 262, 9]];
  let uid = 0;

  function dibujar(m) {
    const F = FORMAS[m.forma], [cl, os] = COLORES[m.color], id = "mc" + (++uid);
    const brazo = (y, lado, k, tot) => {
      const sx = F.lado(y) - 18, arriba = tot === 1 ? true : k === 0;
      const ex = sx + 55, ey = y - 8, hx = sx + 92, hy = arriba ? y - 62 : y + 36;
      const p = `M${sx} ${y}Q${ex} ${ey} ${hx} ${hy}`;
      const g = `<path d="${p}" stroke="#1a1a1a" stroke-width="27" fill="none" stroke-linecap="round"/><path d="${p}" stroke="${cl}" stroke-width="18" fill="none" stroke-linecap="round"/>
        <circle cx="${hx}" cy="${hy}" r="15" fill="${cl}" stroke="#1a1a1a" stroke-width="4"/>
        ${[-1, 0, 1].map(f => `<circle cx="${hx + 10 + Math.abs(f) * -2}" cy="${hy + f * 11 - 4}" r="6" fill="${cl}" stroke="#1a1a1a" stroke-width="3"/>`).join("")}`;
      return lado > 0 ? g : `<g transform="translate(400 0) scale(-1 1)">${g}</g>`;
    };
    let atras = "";
    if (m.alas) {
      const t = F.arriba(200) + 40;
      const ala = `<path d="M150 ${t + 60}L30 ${t - 30}Q48 ${t + 30} 36 ${t + 70}Q70 ${t + 52} 78 ${t + 96}Q98 ${t + 72} 122 ${t + 120}z" fill="#3b1f55" stroke="#1a1a1a" stroke-width="5" stroke-linejoin="round"/>
        <path d="M150 ${t + 60}L48 ${t + 10}M150 ${t + 60}L80 ${t + 60}" stroke="#6a4590" stroke-width="3"/>`;
      atras += ala + `<g transform="translate(400 0) scale(-1 1)">${ala}</g>`;
    }
    if (m.cola) {
      const b = F.abajo(250) - 30;
      atras += `<path d="M250 ${b}Q330 ${b + 40} 350 ${b - 20}T365 ${b - 95}" stroke="#1a1a1a" stroke-width="20" fill="none" stroke-linecap="round"/>
        <path d="M250 ${b}Q330 ${b + 40} 350 ${b - 20}T365 ${b - 95}" stroke="${cl}" stroke-width="12" fill="none" stroke-linecap="round"/>
        <path d="M365 ${b - 125}l22 34h-44z" fill="${os}" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>`;
    }
    // piernas
    const px = { 0: [], 1: [0], 2: [-.55, .55], 3: [-.8, 0, .8], 4: [-.95, -.32, .32, .95] }[m.piernas] || [];
    for (const f of px) {
      const x = 200 + f * F.pierna, y0 = F.abajo(x) - 24, y1 = Math.max(F.abajo(x), F.abajo(200)) + 52;
      atras += `<path d="M${x} ${y0}V${y1}" stroke="#1a1a1a" stroke-width="30" stroke-linecap="round"/><path d="M${x} ${y0}V${y1}" stroke="${cl}" stroke-width="21" stroke-linecap="round"/>
        <ellipse cx="${x + (f < 0 ? -10 : f > 0 ? 10 : 0)}" cy="${y1 + 10}" rx="25" ry="12" fill="${os}" stroke="#1a1a1a" stroke-width="4"/>`;
    }
    // brazos
    const izq = Math.floor(m.brazos / 2), der = m.brazos - izq;
    const ys = n => n === 1 ? [(F.brazoY[0] + F.brazoY[1]) / 2] : n === 2 ? F.brazoY : [];
    ys(der).forEach((y, k) => atras += brazo(y, 1, k, der));
    ys(izq).forEach((y, k) => atras += brazo(y, -1, k, izq));

    // patrón
    let patron = "";
    if (m.patron === "spots") patron = MANCHAS.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${os}" opacity=".55"/>`).join("");
    if (m.patron === "stripes") patron = Array.from({ length: 9 }, (_, k) => `<rect x="40" y="${100 + k * 34}" width="320" height="14" fill="${os}" opacity=".5"/>`).join("");

    // ojos
    const filas = m.ojos <= 3 ? [m.ojos] : [Math.ceil(m.ojos / 2), Math.floor(m.ojos / 2)];
    let ojos = "";
    const rBase = { 1: 38, 2: 29, 3: 25, 4: 23, 5: 21, 6: 20 }[m.ojos];
    filas.forEach((n, fi) => {
      const y = filas.length === 1 ? F.ojoY : F.ojoY + (fi === 0 ? -24 : 30);
      const ancho = m.forma === "triangle" ? F.ojoW * (0.7 + (y - F.ojoY + 30) / 120) : F.ojoW;
      const sep = n === 1 ? 0 : (2 * ancho) / (n - 1 + 1e-9);
      const r = Math.min(rBase, n > 1 ? sep / 2 - 3 : rBase);
      for (let k = 0; k < n; k++) {
        const x = n === 1 ? 200 : 200 - ancho + sep * k;
        ojos += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#1a1a1a" stroke-width="4"/><circle cx="${x}" cy="${y + r * .15}" r="${r * .5}" fill="#1a1a1a"/><circle cx="${x - r * .2}" cy="${y - r * .08}" r="${r * .17}" fill="#fff"/>`;
      }
    });
    // boca
    const bx = 200, by = F.bocaY, w = F.bocaW;
    let boca = "";
    if (m.boca === "smile") boca = `<path d="M${bx - w} ${by}q${w} ${w * .8} ${2 * w} 0" stroke="#1a1a1a" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    if (m.boca === "big") boca = `<path d="M${bx - w} ${by - 10}q${w} ${w * 1.5} ${2 * w} 0z" fill="#4a0a1a" stroke="#1a1a1a" stroke-width="6" stroke-linejoin="round"/><ellipse cx="${bx}" cy="${by + w * .5}" rx="${w * .45}" ry="${w * .2}" fill="#ff6b8a"/>`;
    if (m.boca === "teeth") {
      boca = `<path d="M${bx - w} ${by - 15}H${bx + w}Q${bx + w} ${by + 28} ${bx} ${by + 32}Q${bx - w} ${by + 28} ${bx - w} ${by - 15}z" fill="#4a0a1a" stroke="#1a1a1a" stroke-width="6" stroke-linejoin="round"/>`;
      for (let k = 0; k < 5; k++) { const a = bx - w + k * 2 * w / 5, b = a + 2 * w / 5; boca += `<path d="M${a + 2} ${by - 13}L${(a + b) / 2} ${by + 6}L${b - 2} ${by - 13}z" fill="#fff"/>`; }
    }
    if (m.boca === "fangs") {
      const d = w * .32;
      boca = `<path d="M${bx - w} ${by}q${w} ${w * .8} ${2 * w} 0" stroke="#1a1a1a" stroke-width="9" fill="none" stroke-linecap="round"/>
        ${[-1, 1].map(s => `<path d="M${bx + s * w * .45 - 9} ${by + d}h18l-9 26z" fill="#fff" stroke="#1a1a1a" stroke-width="3" stroke-linejoin="round"/>`).join("")}`;
    }
    // cuernos, pelo, sombrero
    let cabeza = "";
    if (m.pelo) {
      for (let x = 200 - F.pelo; x <= 200 + F.pelo + .1; x += 24) {
        const y = F.arriba(x) + 14;
        cabeza += `<path d="M${x - 13} ${y}L${x} ${y - 38}L${x + 13} ${y}z" fill="${os}" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>`;
      }
    }
    const cuerno = (x, lean) => { const y = F.arriba(x) + 12;
      return `<path d="M${x - 14} ${y}Q${x - 10 + lean * 8} ${y - 40} ${x + lean * 26} ${y - 62}Q${x + 6 + lean * 4} ${y - 26} ${x + 14} ${y}z" fill="#f4eedb" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>`; };
    const cx = { 1: [[200, 0]], 2: [[200 - F.cuerno, -1], [200 + F.cuerno, 1]], 3: [[200 - F.cuerno, -1], [200, 0], [200 + F.cuerno, 1]] }[m.cuernos] || [];
    cabeza += cx.map(([x, l]) => cuerno(x, l)).join("");
    if (m.sombrero) {
      const t = F.arriba(200) + 6;
      cabeza += `<g transform="rotate(-8 200 ${t})"><path d="M140 ${t}L208 ${t - 150}Q220 ${t - 160} 226 ${t - 140}L262 ${t}z" fill="#1d1428" stroke="#000" stroke-width="5" stroke-linejoin="round"/>
        <path d="M150 ${t - 34}L254 ${t - 34}L258 ${t - 14}L146 ${t - 14}z" fill="#9b5de5"/><rect x="190" y="${t - 36}" width="24" height="24" rx="3" fill="none" stroke="#ffd25e" stroke-width="5"/>
        <ellipse cx="200" cy="${t}" rx="92" ry="17" fill="#1d1428" stroke="#000" stroke-width="5"/></g>`;
    }
    const sombra = `<ellipse cx="200" cy="${m.piernas ? 452 : 440}" rx="${m.piernas ? 130 : 90}" ry="14" fill="#000" opacity="${m.piernas ? .35 : .2}"/>`;
    return `<svg viewBox="0 -40 400 510" class="monstruo${m.piernas ? "" : " flota"}" aria-hidden="true">${sombra}<g class="cuerpo">${atras}
      <defs><clipPath id="${id}"><path d="${F.d}"/></clipPath></defs>
      <path d="${F.d}" fill="${cl}" stroke="#1a1a1a" stroke-width="7"/><g clip-path="url(#${id})">${patron}</g>
      ${cabeza}${ojos}${boca}</g></svg>`;
  }

  /* ---------- descripción en inglés ---------- */
  const FORMA_TXT = { round: "round", square: "square", triangle: "a triangle", tall: "tall and thin" };
  const BOCA_TXT = { smile: "a big smile", big: "a big open mouth", teeth: "sharp teeth", fangs: "two long fangs" };
  const pl = (n, s, p) => n === 1 ? `one ${s}` : `${numEn(n)} ${p}`;
  const tiene = (n, s, p) => n ? `It has got ${pl(n, s, p)}.` : `It hasn't got any ${p}.`;
  function describir(m, lv) {
    const f = [];
    if (lv === 1) {
      f.push(`My monster is ${m.color}.`, `It is ${FORMA_TXT[m.forma]}.`, tiene(m.ojos, "eye", "eyes"), tiene(m.brazos, "arm", "arms"), tiene(m.piernas, "leg", "legs"));
      return f;
    }
    f.push(`My monster is ${m.color} and ${m.forma === "triangle" ? "it's a triangle" : FORMA_TXT[m.forma]}.`);
    f.push(`It has got ${pl(m.ojos, "eye", "eyes")} and ${BOCA_TXT[m.boca]}.`);
    f.push(m.cuernos ? `It has got ${pl(m.cuernos, "horn", "horns")}${m.pelo ? " and spiky hair" : ""}.` : m.pelo ? "It hasn't got any horns, but it has got spiky hair." : "It hasn't got any horns or hair.");
    if (m.brazos && m.piernas) f.push(`It has got ${pl(m.brazos, "arm", "arms")} and ${pl(m.piernas, "leg", "legs")}.`);
    else { f.push(tiene(m.brazos, "arm", "arms")); f.push(m.piernas ? tiene(m.piernas, "leg", "legs") : "It hasn't got any legs, so it can't walk. It floats like a ghost!"); }
    f.push(m.patron === "spots" ? "Its body is covered in spots." : m.patron === "stripes" ? "Its body is covered in stripes." : "It hasn't got any spots or stripes.");
    if (lv >= 3) {
      f.push(m.alas ? "It has got bat wings, so it can fly." : "It hasn't got any wings, so it can't fly.");
      f.push(m.cola ? "It has got a long tail." : "It hasn't got a tail.");
      f.push(m.sombrero ? "It is wearing a witch's hat." : "It isn't wearing a hat.");
      if (m.brazos !== m.piernas && m.piernas) f.push(m.brazos > m.piernas ? "It has got more arms than legs." : "It has got more legs than arms.");
    }
    return f;
  }
  const RASGOS = { 1: ["color", "forma", "ojos", "brazos", "piernas"], 2: ["color", "forma", "ojos", "boca", "cuernos", "pelo", "brazos", "piernas", "patron"] };
  RASGOS[3] = [...RASGOS[2], "alas", "cola", "sombrero"];
  const NOMBRE_RASGO = { color: "colour", forma: "shape", ojos: "eyes", boca: "mouth", cuernos: "horns", pelo: "hair", brazos: "arms", piernas: "legs", patron: "spots / stripes", alas: "wings", cola: "tail", sombrero: "hat" };
  function aleatorio(lv) {
    const m = { ...BASE, color: elegir(Object.keys(COLORES)), forma: elegir(Object.keys(FORMAS)), ojos: 1 + azar(6), brazos: azar(5), piernas: 1 + azar(4) };
    if (lv >= 2) Object.assign(m, { boca: elegir(Object.keys(BOCA_TXT)), cuernos: azar(4), pelo: Math.random() < .5, patron: elegir(["none", "spots", "stripes"]) });
    if (lv >= 3) Object.assign(m, { alas: Math.random() < .5, cola: Math.random() < .5, sombrero: Math.random() < .4, piernas: azar(5) });
    return m;
  }
  const NOMBRES = [["Gloopy", "Spooky", "Grumpy", "Fuzzy", "Slimy", "Bonky", "Wobbly", "Creepy", "Snorty", "Zappy", "Stinky", "Giggly"],
    ["Fangface", "Toenail", "McSpider", "Bogeybones", "Pumpkinhead", "Wartnose", "Slimeball", "Batwings", "Grumbletum", "Moonbeam", "Snotsworth", "Eyeballs"]];
  const nombre = () => `${elegir(NOMBRES[0])} ${elegir(NOMBRES[1])}`;

  /* ---------- controles del constructor ---------- */
  function controles(m, lv) {
    const fila = (en, es, html) => `<div class="ctl"><div class="ctl-l"><b>${en}</b><small>${es}</small></div><div class="ctl-o">${html}</div></div>`;
    const sel = (k, v, html, t) => `<button class="mk" data-k="${k}" data-v="${v}" aria-pressed="${String(m[k]) === String(v)}" title="${t || v}">${html}</button>`;
    const num = (k, min, max) => `<button class="mk n" data-k="${k}" data-d="-1" ${m[k] <= min ? "disabled" : ""}>−</button><span class="nv">${m[k]}<small>${numEn(m[k])}</small></span><button class="mk n" data-k="${k}" data-d="1" ${m[k] >= max ? "disabled" : ""}>+</button>`;
    const tog = (k, e, txt) => `<button class="mk tg" data-k="${k}" data-v="${!m[k]}" aria-pressed="${m[k]}">${e} ${txt}</button>`;
    let h = fila("Colour", "color", Object.entries(COLORES).map(([k, [c]]) => sel("color", k, `<i class="sw" style="background:${c}"></i><span>${k}</span>`, ES[k])).join(""));
    h += fila("Shape", "forma", [["round", "⚫"], ["square", "⬛"], ["triangle", "🔺"], ["tall", "🥚"]].map(([k, e]) => sel("forma", k, `${e}<span>${k}</span>`)).join(""));
    h += fila("Eyes", "ojos", num("ojos", 1, 6));
    h += fila("Arms", "brazos", num("brazos", 0, 4));
    h += fila("Legs", "piernas", num("piernas", lv >= 3 ? 0 : 1, 4));
    if (lv >= 2) {
      h += fila("Mouth", "boca", [["smile", "🙂", "smile"], ["big", "😮", "big mouth"], ["teeth", "😬", "sharp teeth"], ["fangs", "🧛", "fangs"]].map(([k, e, t]) => sel("boca", k, `${e}<span>${t}</span>`)).join(""));
      h += fila("Horns", "cuernos", num("cuernos", 0, 3));
      h += fila("Spots / stripes", "manchas / rayas", [["none", "⬜", "none"], ["spots", "🔴", "spots"], ["stripes", "〰️", "stripes"]].map(([k, e, t]) => sel("patron", k, `${e}<span>${t}</span>`)).join(""));
      h += fila("Hair", "pelo", tog("pelo", "🦔", "spiky hair"));
    }
    if (lv >= 3) h += fila("Extras", "extras", tog("alas", "🦇", "wings") + tog("cola", "😈", "tail") + tog("sombrero", "🧙‍♀️", "witch's hat"));
    return h;
  }
  const DECIR_CAMBIO = (k, m) => ({ color: m.color, forma: FORMA_TXT[m.forma], ojos: pl(m.ojos, "eye", "eyes"), brazos: m.brazos ? pl(m.brazos, "arm", "arms") : "no arms",
    piernas: m.piernas ? pl(m.piernas, "leg", "legs") : "no legs", boca: BOCA_TXT[m.boca], cuernos: m.cuernos ? pl(m.cuernos, "horn", "horns") : "no horns",
    patron: { none: "no spots", spots: "spots", stripes: "stripes" }[m.patron], pelo: m.pelo ? "spiky hair" : "no hair", alas: m.alas ? "wings" : "no wings",
    cola: m.cola ? "a tail" : "no tail", sombrero: m.sombrero ? "a witch's hat" : "no hat" }[k]);

  function montarConstructor(cont, m, lv, alCambiar) {
    const pintar = () => { cont.innerHTML = controles(m, lv); };
    pintar();
    cont.onclick = e => {
      const b = e.target.closest(".mk"); if (!b || b.disabled) return;
      const k = b.dataset.k;
      if (b.dataset.d) m[k] += +b.dataset.d;
      else m[k] = b.dataset.v === "true" ? true : b.dataset.v === "false" ? false : b.dataset.v;
      SFX.clic(); pintar(); alCambiar();
      if (J.cfg.leer) J.decir(DECIR_CAMBIO(k, m), { rate: 1 });
    };
  }

  const CSS = `<style>
    .mm { display: grid; grid-template-columns: minmax(16rem, 40%) 1fr; gap: 1.2rem; flex: 1; min-height: 24rem; }
    .app.fija .mm { min-height: 0; }
    .mm.dos { grid-template-columns: 1fr 1fr; }
    @media (max-width: 900px) { .mm, .mm.dos { grid-template-columns: 1fr; } }
    .izq { display: flex; flex-direction: column; gap: .7rem; min-height: 0; }
    .izq .lienzo { flex: 1; min-height: 12rem; }
    .izq .desc { font-size: 1.2rem; overflow: auto; flex: none; max-height: 55%; }
    .lienzo { background: radial-gradient(circle at 50% 40%, #1f4a5e, #0b1d2c 70%); border: 3px solid var(--linea); border-radius: 26px; display: grid; place-items: center; padding: .6rem; position: relative; min-height: 18rem; }
    .lienzo .monstruo { width: 100%; height: 100%; position: absolute; inset: 0; padding: .6rem; }
    .lienzo .nombre { z-index: 1; }
    .monstruo.flota .cuerpo { animation: flota 2.4s ease-in-out infinite; }
    .monstruo { animation: aparecer .4s cubic-bezier(.2, 1.6, .5, 1); }
    @keyframes aparecer { from { transform: scale(.85); } }
    .lienzo .tapado { display: grid; place-items: center; gap: .5rem; text-align: center; font-size: 1.4rem; color: var(--gris); }
    .lienzo .tapado span { font-size: 7rem; animation: flota 2s infinite; }
    .lienzo .nombre { position: absolute; top: .6rem; left: 0; right: 0; text-align: center; font-family: var(--display); font-size: 2rem; color: var(--oro); }
    .derecha { display: flex; flex-direction: column; gap: .8rem; min-height: 0; overflow: auto; padding-right: .3rem; }
    .ctls { display: grid; gap: .45rem; }
    .ctl { display: grid; grid-template-columns: 8.2rem 1fr; gap: .6rem; align-items: center; background: #0e2230cc; border: 2px solid var(--linea); border-radius: 16px; padding: .35rem .6rem; }
    .ctl-l b { display: block; font-size: 1.2rem; color: var(--veneno); line-height: 1.1; } .ctl-l small { color: var(--gris); font-size: .8rem; }
    .ctl-o { display: flex; flex-wrap: wrap; gap: .35rem; align-items: center; }
    .mk { border: 2px solid var(--linea); background: var(--noche-3); border-radius: 12px; padding: .25rem .55rem; font-size: 1.2rem; font-weight: 700; display: inline-flex; align-items: center; gap: .3rem; }
    .mk span { font-size: .95rem; } .mk[aria-pressed="true"] { border-color: var(--oro); background: #4a3a10; box-shadow: 0 0 0 2px var(--oro); }
    .mk .sw { width: 1.4rem; height: 1.4rem; border-radius: 50%; border: 2px solid #000; display: inline-block; }
    .mk.n { width: 2.6rem; height: 2.6rem; justify-content: center; font-size: 1.6rem; }
    .nv { min-width: 6rem; text-align: center; font-size: 1.8rem; font-weight: 700; line-height: 1; } .nv small { display: block; font-size: .8rem; color: var(--gris); }
    .desc { background: var(--hueso); color: #1a1020; border-radius: 22px; padding: .8rem 1.1rem; font-size: 1.55rem; line-height: 1.35; }
    .desc p { margin: .15rem 0; cursor: pointer; border-radius: 8px; padding: 0 .3rem; } .desc p:hover { background: #ffd25e66; }
    .desc p.on { background: #ffd25e; } .desc.oculto p { color: transparent; text-shadow: 0 0 14px #0006; }
    .desc .chip { background: #fff; border-color: #c9bfa6; color: #1a1020; }
    .desc .cab-d { display: flex; justify-content: space-between; align-items: center; gap: .6rem; font-size: 1rem; color: #5a4a6a; font-weight: 700; margin-bottom: .2rem; }
    .comp { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; } .comp .lienzo { min-height: 14rem; height: 42vh; } .comp .lienzo .monstruo { max-height: 40vh; }
    .comp h4 { margin: 0 0 .3rem; text-align: center; font-size: 1.2rem; }
    .lista-r { display: flex; flex-wrap: wrap; gap: .4rem; justify-content: center; margin: .8rem 0; }
    .lista-r span { padding: .25rem .8rem; border-radius: 99px; font-weight: 700; font-size: 1.1rem; } .lista-r .s { background: #2f7a14; } .lista-r .n { background: #7a1424; }
  </style>`;

  let st = null;
  const juego = {
    id: "maker", nombre: "Monster Maker", emoji: "🎨", color: COLOR,
    desc: "Monstruos por piezas: escuchad la descripción y dibujadlo, construid el monstruo misterioso en equipo o cread el vuestro y presentadlo.",
    tags: ["👥 Equipos o clase", "⭐ a ⭐⭐⭐", "🎨 Dibujo", "🗣️ Speaking"],
    enJuego: () => !!st && st.modo === "construye", cerrar() { if (st) clearInterval(st.tm); st = null; },
    abrir() {
      J.preparar(juego, {
        reglas: [
          "<b>🎨 Listen &amp; draw:</b> la app describe un monstruo en inglés frase a frase. Todos lo dibujan en papel o en la pizarra. Al final, ¡se descubre y se compara!",
          "<b>🧩 Build it!</b> (por equipos): el equipo escucha la descripción y construye el monstruo en el ordenador. Gana un punto por cada parte correcta. Comodín 👀: ver el monstruo 3 segundos.",
          "<b>🖌️ Create:</b> cada alumno crea su monstruo; la app escribe la descripción y el alumno la presenta: <i>«This is my monster. It's called…»</i>",
          "⭐ colores, formas, números y partes del cuerpo · ⭐⭐ <i>has got</i>, boca, cuernos, manchas · ⭐⭐⭐ <i>can / can't</i>, <i>more … than</i>, alas, cola, sombrero.",
          "Toca cualquier frase para escucharla otra vez. 🔊",
        ],
        opciones: [
          { id: "modo", t: "🎮 Modo", def: "dibuja", valores: [["dibuja", "🎨 Listen & draw"], ["construye", "🧩 Build it! (equipos)"], ["crea", "🖌️ Create"]] },
          { id: "nivel", t: "⭐ Nivel de inglés", def: 1, valores: [[1, "⭐ 1.º–2.º"], [2, "⭐⭐ 3.º–4.º"], [3, "⭐⭐⭐ 5.º–6.º"]] },
          { id: "texto", t: "📝 Texto de la descripción", def: "si", valores: [["si", "Visible (leer y escuchar)"], ["no", "Oculto (solo escuchar)"]] },
          { id: "seg", t: "⏳ Tiempo para construir (Build it!)", def: 120, valores: [[0, "Sin tiempo"], [60, "1 min"], [120, "2 min"], [180, "3 min"]] },
          { id: "turnos", t: "🔁 Turnos por equipo (Build it!)", def: 2, valores: [[1, "1"], [2, "2"], [3, "3"]] },
        ],
        minutos: false,
        alJugar: o => ({ dibuja: modoDibuja, construye: modoConstruye, crea: modoCrea })[o.modo](o),
      });
    },
  };
  J.registrar(juego);

  // Lee las frases una a una resaltándolas
  async function leerFrases(cont, frases, desde = 0) {
    const tok = (st.lectura = (st.lectura || 0) + 1);
    for (let i = desde; i < frases.length; i++) {
      if (!st || st.lectura !== tok) return;
      $$("p", cont).forEach((p, k) => p.classList.toggle("on", k === i));
      await J.decir(frases[i], { rate: .85, cola: i > desde });
    }
    if (st && st.lectura === tok) $$("p", cont).forEach(p => p.classList.remove("on"));
  }
  function cajaDesc(frases, o, extra = "") {
    return `<div class="desc${o.texto === "no" ? " oculto" : ""}" id="desc"><div class="cab-d"><span>📜 Listen! · Escucha</span>
      <span class="fila" style="gap:.4rem">${o.texto === "no" ? `<button class="chip" id="verTxt" style="color:#1a1020">👁️ Texto</button>` : ""}<button class="chip" id="oirTodo" style="color:#1a1020">🔊 Otra vez</button>${extra}</span></div>
      ${frases.map(f => `<p>${esc(f)}</p>`).join("")}</div>`;
  }
  function enlazarDesc(frases) {
    const d = $("#desc");
    d.onclick = e => {
      if (e.target.id === "oirTodo") { leerFrases(d, frases); return; }
      if (e.target.id === "verTxt") { d.classList.remove("oculto"); e.target.remove(); return; }
      const p = e.target.closest("p");
      if (p) { const i = $$("p", d).indexOf(p); st.lectura = (st.lectura || 0) + 1; J.decir(frases[i], { rate: .8 }); $$("p", d).forEach((x, k) => x.classList.toggle("on", k === i)); }
    };
  }

  /* ---------- 🎨 Listen & draw ---------- */
  function modoDibuja(o) {
    st = { modo: "dibuja", o, n: 0 };
    J.Musica.poner("misterio");
    nuevoDibujo();
  }
  function nuevoDibujo() {
    const o = st.o, m = aleatorio(o.nivel), frases = describir(m, o.nivel), nom = nombre();
    st.n++;
    $("#escena").innerHTML = CSS + `<div class="mm">
      <div class="lienzo" id="lz"><div class="tapado"><span>❓</span>Draw the monster!<br>¡Dibuja el monstruo!</div></div>
      <div class="derecha"><h2 style="margin:0;font-size:1.9rem">Monster ${st.n}: listen and draw! ✏️</h2>${cajaDesc(frases, o)}
        <div class="fila"><button class="btn naranja gigante" id="ver">👁️ Show the monster!</button><button class="btn" id="otro">🎲 New monster</button></div></div></div>`;
    enlazarDesc(frases);
    $("#ver").onclick = () => {
      $("#lz").innerHTML = `<div class="nombre">${esc(nom)}</div>` + dibujar(m);
      SFX.magia(); if (J.cfg.sustos === "fuerte" && Math.random() < .25) J.susto(); else J.decir(`Ta-da! This is ${nom}!`);
      J.confeti(12);
    };
    $("#otro").onclick = nuevoDibujo;
    J.teclas(e => { if (e.key === " ") { $("#ver").click(); return true; } if (e.key === "ArrowRight") { nuevoDibujo(); return true; } });
    setTimeout(() => leerFrases($("#desc"), frases), 400);
  }

  /* ---------- 🖌️ Create ---------- */
  function modoCrea(o) {
    st = { modo: "crea", o, m: { ...BASE }, nom: nombre() };
    J.Musica.poner("misterio");
    $("#escena").innerHTML = CSS + `<div class="mm dos">
      <div class="izq"><div class="lienzo" id="lz"></div><div id="dz" style="display:contents"></div></div>
      <div class="derecha"><div class="fila" style="justify-content:flex-start"><button class="btn" id="az">🎲 Surprise me!</button><button class="btn" id="nom">🏷️ New name</button>
        <button class="btn morado" id="pres">🎤 Present it!</button></div>
        <div class="ctls" id="ctls"></div></div></div>`;
    const repintar = () => {
      $("#lz").innerHTML = `<div class="nombre">${esc(st.nom)}</div>` + dibujar(st.m);
      const fr = [`This is my monster. It's called ${st.nom}.`, ...describir(st.m, o.nivel)];
      $("#dz").innerHTML = cajaDesc(fr, { texto: "si" }); enlazarDesc(fr); st.frases = fr;
    };
    montarConstructor($("#ctls"), st.m, 3, repintar);
    $("#az").onclick = () => { Object.assign(st.m, aleatorio(3)); montarConstructor($("#ctls"), st.m, 3, repintar); repintar(); SFX.magia(); };
    $("#nom").onclick = () => { st.nom = nombre(); repintar(); J.decir(st.nom); };
    $("#pres").onclick = () => leerFrases($("#desc"), st.frases);
    repintar();
  }

  /* ---------- 🧩 Build it! ---------- */
  function modoConstruye(o) {
    st = { modo: "construye", o, eqs: J.equipos(["mirar"]), turno: 0, ronda: 1 };
    J.Musica.poner("misterio");
    turnoConstruye();
  }
  function turnoConstruye() {
    const o = st.o, e = st.eqs[st.turno];
    const objetivo = aleatorio(o.nivel), frases = describir(objetivo, o.nivel), m = { ...BASE };
    J.teclas(null);
    st.obj = objetivo; st.m = m; st.frases = frases;
    $("#escena").innerHTML = CSS + `<div id="marcador"></div><div class="mm dos">
      <div class="izq">${cajaDesc(frases, o, `<span class="chip" style="border-color:${e.c}">${e.e} ${esc(e.n)} · Round ${st.ronda}/${o.turnos}</span>`)}<div class="lienzo" id="lz"></div></div>
      <div class="derecha">
        <div class="fila" style="justify-content:space-between"><span id="tmB" style="font-size:1.6rem;font-weight:700"></span>
          <span class="fila"><button class="btn" id="mirar" ${e.com.mirar ? "" : "disabled"}>👀 Peek · Mirar</button><button class="btn verde gigante" id="check">✅ Check!</button></span></div>
        <div class="ctls" id="ctls"></div></div></div>`;
    J.marcador($("#marcador"), st.eqs, { turno: st.turno, onCom: (eq, k) => k === "mirar" && $("#mirar").click() });
    const repintar = () => { $("#lz").innerHTML = dibujar(m); };
    montarConstructor($("#ctls"), m, o.nivel, repintar); repintar();
    enlazarDesc(frases);
    $("#mirar").onclick = () => {
      if (!e.com.mirar) return; e.com.mirar = false; $("#mirar").disabled = true; SFX.magia();
      $("#lz").innerHTML = dibujar(objetivo); J.marcador($("#marcador"), st.eqs, { turno: st.turno });
      setTimeout(() => st && st.m === m && repintar(), 3000);
    };
    $("#check").onclick = comprobar;
    J.decir(`${e.n}, listen and build the monster!`).then(() => st && st.m === m && leerFrases($("#desc"), frases));
    clearInterval(st.tm);
    if (o.seg) {
      let r = o.seg; const t = () => { const el = $("#tmB"); if (el) { el.textContent = `⏳ ${Math.floor(r / 60)}:${String(r % 60).padStart(2, "0")}`; el.style.color = r <= 10 ? "var(--sangre)" : ""; } };
      t(); st.tm = setInterval(() => { r--; t(); if (r <= 10 && r > 0) SFX.tic(); if (r <= 0) { clearInterval(st.tm); SFX.campana(); comprobar(); } }, 1000);
    }
  }
  function comprobar() {
    if (!st || st.comprobando) return;
    st.comprobando = true; clearInterval(st.tm); J.callar(); st.lectura = (st.lectura || 0) + 1;
    const e = st.eqs[st.turno], ras = RASGOS[st.o.nivel];
    const ok = ras.filter(k => st.m[k] === st.obj[k]);
    e.pts += ok.length;
    const todo = ok.length === ras.length;
    if (todo) { SFX.fanfarria(); J.confeti(30); } else SFX.bien();
    const capa = document.createElement("div"); capa.className = "capa";
    capa.innerHTML = `<div class="ventana" style="--c:${e.c}">${CSS}
      <h2>${todo ? "PERFECT! 🏆" : "Let's compare!"} <span style="color:${e.c}">+${ok.length}</span></h2>
      <div class="comp"><div><h4>🎯 The monster</h4><div class="lienzo">${dibujar(st.obj)}</div></div><div><h4>${e.e} ${esc(e.n)}</h4><div class="lienzo">${dibujar(st.m)}</div></div></div>
      <div class="lista-r">${ras.map(k => `<span class="${ok.includes(k) ? "s" : "n"}">${ok.includes(k) ? "✓" : "✗"} ${NOMBRE_RASGO[k]}</span>`).join("")}</div>
      <div class="fila"><button class="btn verde gigante" id="sigT">Continuar ▶</button></div></div>`;
    document.body.appendChild(capa);
    J.decir(`You got ${numEn(ok.length)} out of ${numEn(ras.length)}!`);
    const seguir = () => {
      capa.remove(); st.comprobando = false;
      st.turno++;
      if (st.turno >= st.eqs.length) { st.turno = 0; st.ronda++; }
      if (st.ronda > st.o.turnos) { const eqs = st.eqs, o = st.o; st = null; J.final(eqs, { otraVez: () => modoConstruye(o) }); return; }
      turnoConstruye();
    };
    $("#sigT", capa).onclick = seguir;
    J.teclas(k => { if (k.key === "Enter" || k.key === " ") { if (capa.isConnected) seguir(); return true; } });
  }

  window.MONSTER = { dibujar, describir, aleatorio };
})();
