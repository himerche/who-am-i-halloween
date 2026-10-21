// Spooky Games · banco de vocabulario y generador de preguntas en inglés (3 niveles de primaria).
// Nivel 1 ⭐ = 1.º–2.º · Nivel 2 ⭐⭐ = 3.º–4.º · Nivel 3 ⭐⭐⭐ = 5.º–6.º
(function () {
  const azar = n => Math.floor(Math.random() * n);
  const elegir = a => a[azar(a.length)];
  const barajar = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = azar(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const tomar = (a, n) => barajar(a).slice(0, n);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const art = w => (/^[aeiou]/i.test(w) && !/^(uni|eu|one)/i.test(w) ? "an " : "a ") + w;

  /* ---------- vocabulario con dibujo: "inglés|emoji|español|nivel" ---------- */
  const CRUDO = {
    halloween: `pumpkin|🎃|calabaza|1 ghost|👻|fantasma|1 skull|💀|calavera|1 bat|🦇|murciélago|1 spider|🕷️|araña|1 witch|🧙‍♀️|bruja|1
      vampire|🧛|vampiro|1 zombie|🧟|zombi|1 monster|👹|monstruo|1 cat|🐈|gato|1 owl|🦉|búho|1 moon|🌕|luna|1 sweets|🍬|caramelos|1
      lollipop|🍭|piruleta|1 candle|🕯️|vela|1 broom|🧹|escoba|1 alien|👽|extraterrestre|1 bone|🦴|hueso|1 spider web|🕸️|telaraña|2
      potion|🧪|poción|2 crystal ball|🔮|bola de cristal|2 coffin|⚰️|ataúd|2 haunted house|🏚️|casa encantada|2 key|🗝️|llave|2
      wolf|🐺|lobo|2 rat|🐀|rata|2 clown|🤡|payaso|2 devil|😈|diablo|2 mask|🎭|máscara|2 dragon|🐉|dragón|2 fairy|🧚|hada|2`,
    animales: `dog|🐕|perro|1 fish|🐟|pez|1 bird|🐦|pájaro|1 horse|🐴|caballo|1 cow|🐄|vaca|1 pig|🐖|cerdo|1 duck|🦆|pato|1
      rabbit|🐇|conejo|1 bear|🐻|oso|1 lion|🦁|león|1 monkey|🐒|mono|1 elephant|🐘|elefante|1 frog|🐸|rana|1 snake|🐍|serpiente|1
      mouse|🐁|ratón|1 chicken|🐔|gallina|1 sheep|🐑|oveja|2 shark|🦈|tiburón|2 octopus|🐙|pulpo|2 butterfly|🦋|mariposa|2 bee|🐝|abeja|2
      snail|🐌|caracol|2 turtle|🐢|tortuga|2 crocodile|🐊|cocodrilo|2 giraffe|🦒|jirafa|2 penguin|🐧|pingüino|2 tiger|🐅|tigre|2 zebra|🦓|cebra|2`,
    comida: `apple|🍎|manzana|1 banana|🍌|plátano|1 cake|🎂|tarta|1 pizza|🍕|pizza|1 chocolate|🍫|chocolate|1 ice cream|🍦|helado|1
      milk|🥛|leche|1 egg|🥚|huevo|1 bread|🍞|pan|1 cheese|🧀|queso|1 orange|🍊|naranja|1 carrot|🥕|zanahoria|1 grapes|🍇|uvas|2
      strawberry|🍓|fresa|2 watermelon|🍉|sandía|2 sandwich|🥪|sándwich|2 chips|🍟|patatas fritas|2 hamburger|🍔|hamburguesa|2
      popcorn|🍿|palomitas|2 biscuit|🍪|galleta|2 lemon|🍋|limón|2 tomato|🍅|tomate|2 potato|🥔|patata|2 soup|🍲|sopa|2`,
    cuerpo: `eyes|👀|ojos|1 nose|👃|nariz|1 mouth|👄|boca|1 ear|👂|oreja|1 hand|✋|mano|1 foot|🦶|pie|1 leg|🦵|pierna|1
      arm|💪|brazo|1 tooth|🦷|diente|2 tongue|👅|lengua|2 brain|🧠|cerebro|2`,
    juguetes: `ball|⚽|pelota|1 teddy bear|🧸|osito de peluche|1 balloon|🎈|globo|1 robot|🤖|robot|1 kite|🪁|cometa|2 drum|🥁|tambor|2
      guitar|🎸|guitarra|2`,
    ropa: `hat|🎩|sombrero|2 dress|👗|vestido|2 T-shirt|👕|camiseta|2 trousers|👖|pantalones|2 trainers|👟|zapatillas|2 boots|👢|botas|2
      socks|🧦|calcetines|2 scarf|🧣|bufanda|2 gloves|🧤|guantes|2 crown|👑|corona|2 glasses|👓|gafas|2 cap|🧢|gorra|2 coat|🧥|abrigo|2`,
    casa: `house|🏠|casa|1 door|🚪|puerta|1 bed|🛏️|cama|1 chair|🪑|silla|2 sofa|🛋️|sofá|2 bath|🛁|bañera|2 toilet|🚽|váter|2
      shower|🚿|ducha|2 clock|⏰|reloj|2 television|📺|televisión|2 lamp|💡|bombilla|2`,
    naturaleza: `sun|☀️|sol|1 star|⭐|estrella|1 tree|🌳|árbol|1 flower|🌸|flor|1 rainbow|🌈|arcoíris|1 cloud|☁️|nube|2 snow|❄️|nieve|2
      fire|🔥|fuego|2 leaf|🍂|hoja|2 mountain|⛰️|montaña|2 lightning|⚡|rayo|2`,
    cole: `book|📕|libro|1 pencil|✏️|lápiz|1 scissors|✂️|tijeras|2 ruler|📏|regla|2 school bag|🎒|mochila|2 crayon|🖍️|cera|2
      computer|💻|ordenador|2 pen|🖊️|bolígrafo|2`,
    transporte: `car|🚗|coche|1 bus|🚌|autobús|1 bike|🚲|bici|1 plane|✈️|avión|1 boat|⛵|barco|1 train|🚂|tren|1 rocket|🚀|cohete|2
      helicopter|🚁|helicóptero|2 lorry|🚚|camión|2`,
  };
  const CATEGORIAS = {
    halloween: "Halloween", animales: "Animals", comida: "Food", cuerpo: "Body", juguetes: "Toys", ropa: "Clothes",
    casa: "House", naturaleza: "Nature", cole: "School", transporte: "Transport",
  };
  const VOCAB = [];
  for (const [cat, txt] of Object.entries(CRUDO)) {
    for (const [, en, e, es, lv] of txt.matchAll(/\s*([^|]+?)\|([^|]+)\|([^|]+)\|(\d)/g)) VOCAB.push({ en, e, es, cat, lv: +lv });
  }
  const vocab = (lv, cats) => VOCAB.filter(v => v.lv <= lv && (!cats || cats.includes(v.cat)));
  const buscar = en => VOCAB.find(v => v.en === en);

  const COLORES = [["red", "#e53935", "rojo"], ["blue", "#1e88e5", "azul"], ["green", "#43a047", "verde"], ["yellow", "#fdd835", "amarillo"],
    ["orange", "#fb8c00", "naranja"], ["purple", "#8e24aa", "morado"], ["pink", "#f48fb1", "rosa"], ["black", "#111111", "negro"],
    ["white", "#ffffff", "blanco"], ["brown", "#795548", "marrón"], ["grey", "#9e9e9e", "gris"]].map(([en, hex, es], i) => ({ en, hex, es, lv: i < 9 ? 1 : 2 }));

  const UNIDADES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen",
    "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const DECENAS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const numEn = n => n < 20 ? UNIDADES[n] : n === 100 ? "one hundred" : DECENAS[Math.floor(n / 10)] + (n % 10 ? "-" + UNIDADES[n % 10] : "");

  const PLURALES = { mouse: "mice", wolf: "wolves", witch: "witches", sweets: "sweets", fish: "fish", sheep: "sheep", tooth: "teeth", foot: "feet",
    "teddy bear": "teddy bears", leaf: "leaves", box: "boxes", fairy: "fairies", butterfly: "butterflies", potato: "potatoes", tomato: "tomatoes",
    "spider web": "spider webs", "crystal ball": "crystal balls", "haunted house": "haunted houses", glasses: "glasses", scissors: "scissors" };
  const plural = w => PLURALES[w] || (/(s|sh|ch|x)$/.test(w) ? w + "es" : /[^aeiou]y$/.test(w) ? w.slice(0, -1) + "ies" : w + "s");

  const DIAS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const MESES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  /* ---------- piezas visuales ---------- */
  const vEmoji = e => `<div class="vis-emoji">${e}</div>`;
  const vMancha = hex => `<div class="vis-mancha"><svg viewBox="0 0 200 200"><path d="M100 14c22 0 30 18 48 22s38 4 38 30-16 26-12 46 18 34 0 52-36 4-54 14-30 14-48 0-12-24-34-30-34-20-26-44 22-22 18-44S78 14 100 14z" fill="${hex}" stroke="#000" stroke-opacity=".35" stroke-width="5"/></svg></div>`;
  const vCuenta = (e, n) => `<div class="vis-cuenta${n > 10 ? " muchos" : ""}">${Array.from({ length: n }, () => `<span>${e}</span>`).join("")}</div>`;
  const vNum = n => `<div class="vis-num">${n}</div>`;
  const vOir = () => `<button class="vis-oir" data-oir aria-label="Escuchar otra vez">🔊</button>`;

  // Escenas de preposiciones (caja de cartón y un bicho en distintas posiciones)
  function vPrepos(prep, quien) {
    const caja = (x, abierta) => `<g transform="translate(${x} 0)">
      ${abierta ? `<path d="M-90 150l-30-34h80l-10 34zM90 150l30-34h-80l10 34z" fill="#c98a4b" stroke="#2b1a0e" stroke-width="5" stroke-linejoin="round"/>` : `<rect x="-95" y="135" width="190" height="22" rx="4" fill="#d9a066" stroke="#2b1a0e" stroke-width="5"/>`}
      <rect x="-90" y="150" width="180" height="130" rx="6" fill="#b8763a" stroke="#2b1a0e" stroke-width="5"/>
      <path d="M-90 190h180" stroke="#8a5523" stroke-width="4"/></g>`;
    const bicho = (x, y, t = 96) => `<text x="${x}" y="${y}" font-size="${t}" text-anchor="middle" dominant-baseline="central">${quien}</text>`;
    let dentro = "";
    switch (prep) {
      case "in": dentro = `${bicho(300, 160, 92)}<g transform="translate(300 0)"><rect x="-90" y="150" width="180" height="130" rx="6" fill="#b8763a" stroke="#2b1a0e" stroke-width="5"/><path d="M-90 190h180" stroke="#8a5523" stroke-width="4"/><path d="M-90 150l-34-36h76l-6 36zM90 150l34-36h-76l6 36z" fill="#c98a4b" stroke="#2b1a0e" stroke-width="5" stroke-linejoin="round"/></g>`; break;
      case "on": dentro = caja(300) + bicho(300, 92); break;
      case "under": dentro = `<g transform="translate(0 -70)">${caja(300)}<path d="M220 280v70M380 280v70" stroke="#2b1a0e" stroke-width="10" stroke-linecap="round"/></g>` + bicho(300, 300, 80); break;
      case "next to": dentro = caja(250) + bicho(440, 225); break;
      case "between": dentro = caja(140) + caja(460) + bicho(300, 225); break;
      case "behind": dentro = bicho(300, 120, 92) + caja(300); break;
      case "in front of": dentro = caja(300) + bicho(300, 262, 120); break;
    }
    return `<div class="vis-svg"><svg viewBox="0 0 600 340" aria-hidden="true">
      <ellipse cx="300" cy="300" rx="280" ry="22" fill="#000" opacity=".25"/>${dentro}</svg></div>`;
  }
  const vLetras = (palabra, hueco) => `<div class="vis-letras">${[...palabra.toUpperCase()].map((l, i) =>
    l === " " ? `<span class="esp"></span>` : `<span class="${i === hueco ? "hueco" : ""}">${i === hueco ? "?" : l}</span>`).join("")}</div>`;
  const vTexto = (t, e = "") => `<div class="vis-frase">${e ? `<span class="fe">${e}</span>` : ""}<span>${t}</span></div>`;
  const hueco = s => esc(s).replace("___", `<span class="raya">____</span>`);

  /* ---------- utilidades de preguntas ---------- */
  // q: { lv, tema, titulo, visual, opciones:[texto|{t,html}], ok, decir, oir, clave }
  function conOpciones(q, correcta, falsas, n) {
    const opts = barajar([correcta, ...tomar([...new Set(falsas)].filter(f => f !== correcta), n - 1)]);
    return Object.assign(q, { opciones: opts, ok: opts.indexOf(correcta) });
  }
  const nOpc = lv => lv === 1 ? 3 : 4;
  const parecidos = (v, lv) => vocab(Math.max(lv, 1)).filter(x => x.cat === v.cat && x.en !== v.en);

  /* ---------- generadores por nivel ---------- */
  const G = {};

  G.queEs = lv => {
    const pool = vocab(lv, lv === 1 ? ["halloween", "animales", "comida", "cuerpo", "juguetes", "naturaleza", "transporte"] : null)
      .filter(v => lv === 1 || v.lv === 2 || Math.random() < .3);
    const v = elegir(pool);
    return conOpciones({ lv, tema: "Vocabulary", titulo: "What is it?", visual: vEmoji(v.e), decir: "What is it?", clave: "q" + v.en, sol: v.en },
      v.en, parecidos(v, 2).map(x => x.en), nOpc(lv));
  };
  G.escucha = lv => {
    const v = elegir(vocab(lv));
    const q = { lv, tema: "Listening", titulo: "Listen and choose!", visual: vOir(), oir: v.en, clave: "e" + v.en, opcEmoji: true };
    const falsas = parecidos(v, 2);
    const opts = barajar([v, ...tomar(falsas, nOpc(lv) - 1)]);
    return Object.assign(q, { opciones: opts.map(x => ({ t: x.en, html: `<span class="oe">${x.e}</span>` })), ok: opts.indexOf(v) });
  };
  G.color = lv => {
    const c = elegir(COLORES.filter(c => c.lv <= lv));
    return conOpciones({ lv, tema: "Colours", titulo: "What colour is it?", visual: vMancha(c.hex), decir: "What colour is it?", clave: "c" + c.en },
      c.en, COLORES.map(x => x.en), nOpc(lv));
  };
  const COLOR_DE = [["pumpkin", "orange"], ["ghost", "white"], ["frog", "green"], ["banana", "yellow"], ["apple", "red"], ["bat", "black"],
    ["grapes", "purple"], ["chocolate", "brown"], ["pig", "pink"], ["elephant", "grey"], ["carrot", "orange"], ["snow", "white"], ["lemon", "yellow"],
    ["strawberry", "red"], ["tree", "green"], ["crocodile", "green"], ["milk", "white"], ["cheese", "yellow"], ["tomato", "red"]];
  G.colorDe = lv => {
    const [en, col] = elegir(COLOR_DE), v = buscar(en);
    const verbo = en === "grapes" ? "are" : "is";
    return conOpciones({ lv, tema: "Colours", titulo: `What colour ${verbo} the ${en}?`, visual: vEmoji(v.e), decir: `What colour ${verbo} the ${en}?`, clave: "cd" + en },
      col, COLORES.filter(c => c.lv <= 2).map(c => c.en), nOpc(lv));
  };
  const CONTABLES = ["pumpkin", "ghost", "bat", "spider", "skull", "candle", "cat", "owl", "apple", "star", "lollipop", "bone", "frog", "witch",
    "vampire", "zombie", "monster", "mouse", "wolf", "key"];
  G.contar = lv => {
    const v = buscar(elegir(CONTABLES)), max = lv === 1 ? 10 : 20, min = lv === 1 ? 2 : 8;
    const n = min + azar(max - min + 1);
    const falsas = [n - 2, n - 1, n + 1, n + 2].filter(x => x > 0 && x <= 20).map(numEn);
    return conOpciones({ lv, tema: "Numbers", titulo: `How many ${plural(v.en)}?`, visual: vCuenta(v.e, n), decir: `How many ${plural(v.en)} can you see?`, clave: "n" + v.en + n },
      numEn(n), falsas, nOpc(lv));
  };
  G.numero = lv => {
    const n = lv === 1 ? 1 + azar(12) : 13 + azar(88);
    const fal = lv === 1 ? [n - 1, n + 1, n + 2, n - 2].filter(x => x > 0 && x < 20)
      : [n % 10 && Math.floor(n / 10) !== n % 10 ? (n % 10) * 10 + Math.floor(n / 10) : n + 10, n + 1, n - 1, n + 10, n - 10].filter(x => x > 10 && x <= 100 && x !== n);
    return conOpciones({ lv, tema: "Numbers", titulo: "What number is it?", visual: vNum(n), decir: "What number is it?", clave: "nu" + n },
      numEn(n), [...new Set(fal.map(numEn))], nOpc(lv));
  };
  const CARAS = [["happy", "😀"], ["sad", "😢"], ["scared", "😱"], ["angry", "😠"], ["tired", "😴"], ["surprised", "😲"], ["ill", "🤒"], ["hungry", "😋"]];
  G.sentimiento = lv => {
    const [f, e] = elegir(CARAS);
    return conOpciones({ lv, tema: "Feelings", titulo: "How do I feel?", visual: vEmoji(e), decir: "How do I feel?", clave: "f" + f },
      `I'm ${f}.`, CARAS.map(c => `I'm ${c[0]}.`), nOpc(lv));
  };

  // ⭐⭐
  const sinEspacio = vocab(2).filter(v => /^[a-z]{4,9}$/.test(v.en));
  G.deletrear = lv => {
    const v = elegir(sinEspacio), w = v.en, i = 1 + azar(w.length - 1), l = w[i];
    const vocales = "aeiou", letras = vocales.includes(l) ? vocales : "bcdfghklmnprstvwy";
    return conOpciones({ lv, tema: "Spelling", titulo: "Which letter is missing?", visual: vEmoji(v.e) + vLetras(w, i), decir: "Which letter is missing?", clave: "d" + w, sol: w },
      l.toUpperCase(), [...letras].map(x => x.toUpperCase()), 4);
  };
  function erratas(w) {
    const s = new Set(), v = "aeiou";
    for (let k = 0; k < 40 && s.size < 6; k++) {
      const a = [...w], i = 1 + azar(a.length - 2);
      const r = azar(4);
      if (r === 0 && a[i] !== a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]];
      else if (r === 1) a.splice(i, 0, a[i]);
      else if (r === 2 && a.length > 4) a.splice(i, 1);
      else if (v.includes(a[i])) a[i] = elegir([...v].filter(x => x !== a[i]));
      const t = a.join("");
      if (t !== w) s.add(t);
    }
    return [...s];
  }
  G.ortografia = lv => {
    const v = elegir(sinEspacio.filter(v => v.en.length >= 5));
    return conOpciones({ lv, tema: "Spelling", titulo: "How do you spell it?", visual: vEmoji(v.e), decir: "How do you spell it?", clave: "o" + v.en },
      v.en, erratas(v.en), 3);
  };
  G.escuchaPalabra = lv => {
    const v = elegir(vocab(lv));
    return conOpciones({ lv, tema: "Listening", titulo: "Listen! Which word is it?", visual: vOir(), oir: v.en, clave: "ep" + v.en },
      v.en, parecidos(v, 2).map(x => x.en), 4);
  };
  // Habilidades: [animal, sí puede, no puede]
  const PUEDE = [["fish", ["swim"], ["walk", "climb trees", "fly"]], ["bat", ["fly"], ["ride a bike", "read", "play football"]], ["bird", ["fly", "sing"], ["swim underwater", "read", "drive a car"]],
    ["owl", ["fly"], ["swim", "play the piano", "cook"]], ["frog", ["jump", "swim"], ["fly", "read", "ride a bike"]], ["spider", ["climb"], ["fly", "sing", "write"]],
    ["cat", ["climb", "run", "jump"], ["fly", "read", "talk"]], ["dog", ["run", "swim", "jump"], ["fly", "write", "drive a car"]], ["horse", ["run", "jump"], ["fly", "climb trees", "read"]],
    ["monkey", ["climb", "jump"], ["fly", "drive a car", "cook"]], ["duck", ["swim", "fly", "walk"], ["read", "play football", "cook"]], ["rabbit", ["jump", "run"], ["fly", "swim underwater", "sing"]],
    ["penguin", ["swim", "walk"], ["fly", "climb trees", "ride a bike"]], ["elephant", ["walk", "swim"], ["fly", "jump", "climb trees"]], ["snail", ["climb"], ["run", "fly", "jump"]],
    ["turtle", ["swim"], ["fly", "run fast", "climb trees"]], ["shark", ["swim"], ["walk", "fly", "climb"]], ["butterfly", ["fly"], ["swim", "run", "sing"]],
    ["ghost", ["fly", "walk through walls"], ["eat pizza", "ride a bike"]], ["witch", ["fly on a broom", "make potions"], ["swim like a fish"]],
    ["vampire", ["fly", "turn into a bat"], ["eat garlic", "go out in the sun"]], ["zombie", ["walk", "eat brains"], ["run fast", "fly"]]];
  G.can = lv => {
    const [a, si, no] = elegir(PUEDE), v = buscar(a);
    if (lv === 2 && Math.random() < .55) {
      const pos = Math.random() < .5, acc = pos ? elegir(si) : elegir(no);
      return conOpciones({ lv, tema: "Can / can't", titulo: `Can ${art(a)} ${acc}?`, visual: vEmoji(v.e), decir: `Can ${art(a)} ${acc}?`, clave: "cn" + a + acc },
        pos ? "Yes, it can." : "No, it can't.", ["Yes, it can.", "No, it can't."], 2);
    }
    return conOpciones({ lv, tema: "Can / can't", titulo: hueco(`${cap(art(a))} can ___.`), visual: vEmoji(v.e), decir: `What can ${art(a)} do?`, clave: "cc" + a },
      elegir(si), no, lv === 1 ? 2 : 3);
  };
  G.thereIs = lv => {
    const v = buscar(elegir(CONTABLES)), n = 1 + azar(lv === 2 ? 6 : 4);
    const frase = n === 1 ? `There ___ ${art(v.en)}.` : `There ___ ${numEn(n)} ${plural(v.en)}.`;
    return conOpciones({ lv, tema: "There is / there are", titulo: hueco(frase), visual: vCuenta(v.e, n), clave: "t" + v.en + n },
      n === 1 ? "is" : "are", ["is", "are"], 2);
  };
  const HABITACIONES = [["You sleep in the ___.", "bedroom", "🛏️"], ["You cook in the ___.", "kitchen", "🍳"], ["You have a bath in the ___.", "bathroom", "🛁"],
    ["You watch TV in the ___.", "living room", "📺"], ["Flowers grow in the ___.", "garden", "🌸"], ["You park the car in the ___.", "garage", "🚗"],
    ["Old boxes and spiders live in the ___.", "attic", "🕸️"], ["You have dinner in the ___.", "dining room", "🍽️"]];
  G.habitacion = lv => {
    const [f, r, e] = elegir(HABITACIONES);
    return conOpciones({ lv, tema: "The house", titulo: hueco(f), visual: vEmoji(e), decir: f.replace("___", "blank"), clave: "h" + r },
      r, HABITACIONES.map(h => h[1]), 4);
  };
  const FUNCIONES = [["You see with your ___.", "eyes", "👀"], ["You hear with your ___.", "ears", "👂"], ["You smell with your ___.", "nose", "👃"],
    ["You eat with your ___.", "mouth", "👄"], ["You walk with your ___.", "legs", "🚶"], ["You clap with your ___.", "hands", "👏"],
    ["You bite with your ___.", "teeth", "🦷"], ["You think with your ___.", "brain", "🤔"], ["You kick a ball with your ___.", "feet", "⚽"]];
  G.cuerpo = lv => {
    const [f, p, e] = elegir(FUNCIONES);
    return conOpciones({ lv, tema: "The body", titulo: hueco(f), visual: vEmoji(e), clave: "b" + p },
      p, FUNCIONES.map(x => x[1]), nOpc(lv));
  };
  const BICHOS = [["spider", "🕷️"], ["bat", "🦇"], ["cat", "🐈"], ["ghost", "👻"], ["pumpkin", "🎃"], ["frog", "🐸"]];
  G.prepos = lv => {
    const preps = lv === 2 ? ["in", "on", "under", "next to"] : ["between", "next to", "behind", "in front of", "under"];
    const p = elegir(preps), [b, e] = elegir(BICHOS), obj = p === "between" ? "boxes" : "box";
    return conOpciones({ lv, tema: "Prepositions", titulo: `Where is the ${b}?`, visual: vPrepos(p, e), decir: `Where is the ${b}?`, clave: "p" + p + b },
      `It's ${p} the ${obj}.`, preps.map(x => `It's ${x} the ${x === "between" ? "boxes" : "box"}.`), Math.min(4, preps.length));
  };
  G.dias = lv => {
    const i = azar(7), antes = lv === 3 && Math.random() < .5;
    const r = DIAS[(i + (antes ? 6 : 1)) % 7];
    return conOpciones({ lv, tema: "Days of the week", titulo: `What day comes ${antes ? "before" : "after"} ${DIAS[i]}?`, visual: vEmoji("📅"), clave: "dy" + i + antes },
      r, DIAS.filter(d => d !== DIAS[i]), 4);
  };
  const FIESTAS = [["Halloween is in ___.", "October", "🎃"], ["Christmas is in ___.", "December", "🎄"], ["New Year's Day is in ___.", "January", "🎆"],
    ["Valentine's Day is in ___.", "February", "💘"], ["The summer holidays start in ___.", "June", "🏖️"]];
  G.meses = lv => {
    if (Math.random() < .5) {
      const [f, m, e] = elegir(FIESTAS);
      return conOpciones({ lv, tema: "Months", titulo: hueco(f), visual: vEmoji(e), clave: "m" + m }, m, MESES, 4);
    }
    const i = azar(12);
    return conOpciones({ lv, tema: "Months", titulo: `What month comes after ${MESES[i]}?`, visual: vEmoji("🗓️"), clave: "ma" + i },
      MESES[(i + 1) % 12], MESES.filter((m, k) => k !== i), 4);
  };
  const CLIMA = [["sunny", "☀️"], ["raining", "🌧️"], ["snowing", "🌨️"], ["windy", "🌬️"], ["cloudy", "☁️"], ["stormy", "⛈️"], ["foggy", "🌫️"]];
  G.clima = lv => {
    const [w, e] = elegir(CLIMA), f = x => `It's ${x}.`;
    return conOpciones({ lv, tema: "Weather", titulo: "What's the weather like?", visual: vEmoji(e), decir: "What's the weather like?", clave: "w" + w },
      f(w), CLIMA.map(c => f(c[0])), 4);
  };

  // ⭐⭐⭐
  const COMPARA = [["mouse", "elephant", "small", "smaller", "bigger"], ["elephant", "mouse", "big", "bigger", "smaller"], ["giraffe", "cat", "tall", "taller", "shorter"],
    ["snail", "horse", "slow", "slower", "faster"], ["rocket", "bike", "fast", "faster", "slower"], ["vampire", "baby", "scary", "scarier", "nicer"],
    ["sun", "moon", "hot", "hotter", "colder"], ["ice cream", "soup", "cold", "colder", "hotter"], ["lion", "cat", "strong", "stronger", "weaker"],
    ["turtle", "rabbit", "slow", "slower", "faster"], ["mountain", "house", "high", "higher", "lower"], ["pumpkin", "apple", "heavy", "heavier", "lighter"],
    ["skeleton", "zombie", "thin", "thinner", "fatter"], ["tiger", "mouse", "dangerous", "more dangerous", "less dangerous"], ["witch's hat", "cap", "tall", "taller", "shorter"],
    ["haunted house", "normal house", "scary", "scarier", "nicer"], ["shark", "fish", "dangerous", "more dangerous", "less dangerous"], ["owl", "bat", "big", "bigger", "smaller"]];
  G.comparativo = lv => {
    const [a, b, adj, ok, op] = elegir(COMPARA), va = buscar(a), vb = buscar(b);
    const sup = adj.includes(" ") ? "the most " + adj : adj.endsWith("y") ? "the " + adj.slice(0, -1) + "iest" : "the " + ok.replace(/er$/, "est");
    const raro = adj.includes(" ") ? adj + "er" : "more " + adj;
    return conOpciones({ lv, tema: "Comparatives", titulo: hueco(`${cap(art(a))} is ___ than ${art(b)}.`) + ` <small>(${adj})</small>`,
      visual: `<div class="vis-dos">${va ? `<span>${va.e}</span>` : ""}<b>vs</b>${vb ? `<span>${vb.e}</span>` : ""}</div>`, clave: "co" + a + b },
      ok, [op, sup, raro], 4);
  };
  const PASADO = [["Yesterday the witch ___ to the moon.", "fly", "flew", "flyed"], ["Last night I ___ a ghost in the garden.", "see", "saw", "seed"],
    ["The zombie ___ all the sweets!", "eat", "ate", "eated"], ["We ___ trick-or-treating last Halloween.", "go", "went", "goed"],
    ["The vampire ___ a glass of tomato juice.", "drink", "drank", "drinked"], ["The skeleton ___ at the party.", "dance", "danced", "dancing"],
    ["The black cat ___ onto the roof.", "jump", "jumped", "jumpt"], ["The children ___ a big pumpkin.", "carve", "carved", "carvd"],
    ["My mum ___ a scary cake.", "make", "made", "maked"], ["The ghost ___ \"Boo!\"", "say", "said", "sayed"], ["I ___ when I saw the spider.", "scream", "screamed", "scremed"],
    ["The monster ___ very fast.", "run", "ran", "runned"], ["We ___ a spooky film on Saturday.", "watch", "watched", "watcht"], ["The bat ___ upside down all day.", "sleep", "slept", "sleeped"],
    ["Dracula ___ a letter to his friend.", "write", "wrote", "writed"], ["I ___ an old key in the haunted house.", "find", "found", "finded"],
    ["The witch ___ a new broom.", "buy", "bought", "buyed"], ["The wolf ___ at the full moon.", "howl", "howled", "howlt"], ["The mummy ___ a long sleep.", "have", "had", "haved"],
    ["Frankenstein ___ the guitar at the party.", "play", "played", "plaid"]];
  G.pasado = lv => {
    const [f, base, ok, mal] = elegir(PASADO);
    const ing = base.replace(/e$/, "").replace(/(run)$/, "runn") + "ing";
    return conOpciones({ lv, tema: "Past simple", titulo: hueco(f) + ` <small>(${base})</small>`, visual: vEmoji("⏪"), clave: "ps" + base },
      ok, [base, mal, ing], 4);
  };
  const ACERTIJOS = [["I am orange and round. You can carve a face on me.", "pumpkin"], ["I am white and I say \"Boo!\". You can see through me.", "ghost"],
    ["I have got eight legs and I make webs.", "spider"], ["I can fly at night and I sleep upside down.", "bat"], ["I have got a pointy hat and a broom. I make potions.", "witch"],
    ["I have got sharp teeth and I sleep in a coffin. I don't like garlic.", "vampire"], ["I am made of bones. I haven't got any skin.", "skeleton"],
    ["I walk very slowly and I am always hungry. I love brains!", "zombie"], ["I shine in the sky at night. Sometimes I am round and full.", "moon"],
    ["Children get me on Halloween. I am sweet and colourful.", "sweets"], ["I have got big eyes and I say \"Twit-twoo!\" at night.", "owl"],
    ["I am a big hairy animal. I howl at the full moon.", "wolf"], ["Nobody lives in me... only ghosts and spiders!", "haunted house"],
    ["I have got a little fire on my head. I give light.", "candle"], ["I am a big black pot. Witches cook potions in me.", "cauldron"],
    ["I am long and I haven't got any legs. I say \"Hiss!\"", "snake"], ["I am green and I live near water. I say \"Ribbit!\"", "frog"],
    ["Witches fly on me. I am also good for cleaning.", "broom"], ["Fortune tellers look into me to see the future.", "crystal ball"],
    ["I am wrapped in long white bandages. I come from Egypt.", "mummy"]];
  G.adivinanza = lv => {
    const [f, r] = elegir(ACERTIJOS);
    return conOpciones({ lv, tema: "Riddles", titulo: "Who am I? What am I?", visual: vTexto(esc(f), "❓"), decir: f, clave: "a" + r },
      r, ACERTIJOS.map(a => a[1]), 4);
  };
  const HAS = [["A spider ___ eight legs.", "has got", "🕷️"], ["Witches ___ black hats.", "have got", "🧙‍♀️"], ["I ___ a scary costume.", "have got", "🎭"],
    ["My monster ___ three eyes.", "has got", "👹"], ["Vampires ___ sharp teeth.", "have got", "🧛"], ["A ghost ___ legs.", "hasn't got", "👻"],
    ["We ___ lots of sweets!", "have got", "🍬"], ["The black cat ___ green eyes.", "has got", "🐈"], ["Skeletons ___ any skin.", "haven't got", "💀"],
    ["An owl ___ big eyes.", "has got", "🦉"]];
  G.hasGot = lv => {
    const [f, ok, e] = elegir(HAS);
    return conOpciones({ lv, tema: "Have got / has got", titulo: hueco(f), visual: vEmoji(e), clave: "hg" + f },
      ok, ok.includes("n't") ? ["hasn't got", "haven't got"] : ["has got", "have got"], 2);
  };
  const AHORA = [["Look! The witch ___ over the house.", "fly", "is flying", "are flying"], ["The children ___ sweets right now.", "eat", "are eating", "is eating"],
    ["I ___ a costume now.", "wear", "am wearing", "is wearing"], ["Listen! The wolf ___.", "howl", "is howling", "are howling"],
    ["The skeletons ___ at the moment.", "dance", "are dancing", "is dancing"], ["Shh! The cat ___ on the sofa.", "sleep", "is sleeping", "are sleeping"],
    ["We ___ pumpkins at the moment.", "carve", "are carving", "is carving"], ["The ghost ___ \"Boo!\" to the teacher.", "say", "is saying", "are saying"]];
  G.continuo = lv => {
    const [f, base, ok, mal] = elegir(AHORA);
    const pres = base === "fly" ? "flies" : /(sh|ch|s|x)$/.test(base) ? base + "es" : base + "s";
    return conOpciones({ lv, tema: "Present continuous", titulo: hueco(f) + ` <small>(${base})</small>`, visual: vEmoji("👀"), clave: "pc" + base },
      ok, [mal, pres, base.replace(/e$/, "") + "ing"], 4);
  };
  const PLUR = [["mouse", "mice", "mouses"], ["tooth", "teeth", "tooths"], ["foot", "feet", "foots"], ["child", "children", "childs"], ["man", "men", "mans"],
    ["witch", "witches", "witchs"], ["box", "boxes", "boxs"], ["leaf", "leaves", "leafs"], ["wolf", "wolves", "wolfs"], ["sheep", "sheep", "sheeps"],
    ["fish", "fish", "fishes"], ["potato", "potatoes", "potatos"], ["butterfly", "butterflies", "butterflys"], ["party", "parties", "partys"],
    ["woman", "women", "womans"], ["knife", "knives", "knifes"]];
  G.plural = lv => {
    const [s, p, m] = elegir(PLUR), v = buscar(s);
    const otra = p.endsWith("es") || p.endsWith("ies") ? s + "s" : s + "es";
    return conOpciones({ lv, tema: "Plurals", titulo: hueco(`one ${s}, two ___`), visual: vEmoji(v ? v.e + v.e : "✌️"), clave: "pl" + s },
      p, [m, otra, s].filter(x => x !== p), 3);
  };
  const OPUESTOS = [["big", "small"], ["happy", "sad"], ["hot", "cold"], ["old", "young"], ["fast", "slow"], ["tall", "short"], ["light", "dark"], ["open", "closed"],
    ["up", "down"], ["day", "night"], ["full", "empty"], ["noisy", "quiet"], ["strong", "weak"], ["early", "late"], ["clean", "dirty"], ["scary", "friendly"]];
  G.opuesto = lv => {
    const par = elegir(OPUESTOS), [a, b] = Math.random() < .5 ? par : [par[1], par[0]];
    return conOpciones({ lv, tema: "Opposites", titulo: `What is the opposite of <b class="pal">${a}</b>?`, visual: vEmoji("🔄"), decir: `What is the opposite of ${a}?`, clave: "op" + a },
      b, OPUESTOS.flat().filter(x => x !== a), 4);
  };
  G.mates = lv => {
    const t = azar(3); let f, r, e = buscar(elegir(["ghost", "bat", "pumpkin", "spider", "cat"]));
    if (t === 0) { const a = 3 + azar(9), b = 2 + azar(9); r = a + b; f = `${cap(numEn(a))} ${plural(e.en)} and ${numEn(b)} more ${plural(e.en)}. How many ${plural(e.en)} are there?`; }
    else if (t === 1) { const a = 10 + azar(10), b = 2 + azar(8); r = a - b; f = `There are ${numEn(a)} sweets. The zombie eats ${numEn(b)}. How many sweets are left?`; e = buscar("sweets"); }
    else { const a = 2 + azar(4), b = 2 + azar(4); r = a * b; f = `${cap(numEn(a))} witches have got ${numEn(b)} cats each. How many cats are there?`; e = buscar("cat"); }
    return conOpciones({ lv, tema: "Maths in English", titulo: esc(f), visual: vEmoji(e.e), decir: f, clave: "mt" + f },
      numEn(r), [r - 1, r + 1, r + 2, r - 2, r + 10].filter(x => x > 0).map(numEn), 4);
  };
  const WH = [["___ do you live? In a haunted house.", "Where"], ["___ is your name? My name is Dracula.", "What"], ["___ old are you? I'm 500 years old!", "How"],
    ["___ is your favourite monster? Frankenstein.", "Who"], ["___ do you go trick-or-treating? At night.", "When"], ["___ are you scared? Because I saw a ghost!", "Why"],
    ["___ sweets have you got? Twenty!", "How many"], ["___ colour is your cat? It's black.", "What"]];
  G.wh = lv => {
    const [f, ok] = elegir(WH);
    return conOpciones({ lv, tema: "Questions", titulo: hueco(f), visual: vEmoji("❔"), clave: "wh" + f },
      ok, ["Where", "What", "How", "Who", "When", "Why", "How many"], 4);
  };

  /* ---------- retos (los valida el profe) ---------- */
  const RETOS = {
    1: [["🗣️", "Say three Halloween words!"], ["🎨", "Say four colours in English!"], ["🔢", "Count from one to ten like a ghost: Booo-one, booo-two..."],
      ["😱", "Make a scary face and shout BOO!"], ["🦇", "Fly like a bat around your team and come back!"], ["🐈", "Meow like a black cat three times!"],
      ["🧟", "Walk like a zombie and say \"I'm hungry!\""], ["👉", "Point to something orange in the classroom and say its colour."],
      ["💀", "Shake your body like a skeleton for 10 seconds!"], ["🐺", "Howl like a wolf at the moon: Aaaa-ooooo!"], ["🍬", "Say three foods you like!"],
      ["✋", "Touch your nose, your ears and your mouth. Say the words!"]],
    2: [["🔤", "Spell PUMPKIN letter by letter!"], ["🐾", "Say five animals in 20 seconds!"], ["👹", "Describe a monster: \"It has got...\""],
      ["📅", "Say the days of the week!"], ["🤖", "Count backwards from ten to zero like a robot!"], ["🧹", "Ride an invisible broom and say \"I can fly!\""],
      ["🕷️", "Say three things a spider can do or can't do."], ["👕", "Say what your teacher is wearing today."], ["🎃", "Spell GHOST and then SPIDER!"],
      ["🏚️", "Name four rooms in a house!"], ["🧪", "Invent a potion: \"I've got two frogs, one spider and...\""], ["🌦️", "Say what the weather is like today."]],
    3: [["📖", "Tell a scary story in three sentences. Start: \"Last night I saw...\""], ["🎭", "Act out a word with no speaking. Your team guesses: VAMPIRE!"],
      ["⏪", "Say five verbs in the past simple!"], ["🔤", "Spell SKELETON!"], ["🎤", "Ask the teacher three questions starting with \"Can you...?\""],
      ["👻", "Compare two monsters: \"A vampire is ... than a ghost.\""], ["🗓️", "Say the months of the year!"], ["🏆", "Describe your perfect Halloween costume in two sentences."],
      ["🔤", "Spell HALLOWEEN!"], ["🧛", "You are a vampire. Introduce yourself: name, age, where you live, what you like."],
      ["🧩", "Make a sentence with: ghost, under, bed."], ["🍭", "Explain how to carve a pumpkin: \"First... Then... Finally...\""]],
  };
  const MOVIMIENTO = [["💃", "The whole team dances like skeletons for 10 seconds!"], ["🧟", "Everybody walks like zombies to the door and back!"],
    ["🦇", "Everybody flaps like bats and says \"Squeak, squeak!\""], ["🧙‍♀️", "Stir a giant cauldron together and say \"Hubble bubble!\" three times!"],
    ["🐺", "The team howls together like wolves: Aaa-ooooo!"], ["🗿", "Freeze like statues for 10 seconds. Nobody laughs!"], ["🕷️", "Crawl like spiders around your table!"],
    ["👻", "Float like ghosts and say \"Boooo!\" very slowly."], ["🎃", "Make a pumpkin shape with all your bodies!"], ["🧛", "Everybody hides behind their cape like a vampire... then jumps out!"]];

  const POR_NIVEL = {
    1: ["queEs", "queEs", "escucha", "escucha", "color", "colorDe", "contar", "contar", "numero", "sentimiento", "can"],
    2: ["queEs", "deletrear", "ortografia", "escuchaPalabra", "can", "thereIs", "habitacion", "cuerpo", "prepos", "dias", "meses", "clima", "numero", "contar"],
    3: ["comparativo", "pasado", "adivinanza", "adivinanza", "hasGot", "continuo", "plural", "opuesto", "mates", "wh", "prepos", "dias"],
  };
  const vistas = new Set();
  function pregunta(lv) {
    for (let k = 0; k < 30; k++) {
      const q = G[elegir(POR_NIVEL[lv])](lv);
      if (!q.opciones || new Set(q.opciones.map(o => o.t ?? o)).size !== q.opciones.length) continue;
      if (vistas.has(q.clave) && k < 25) continue;
      vistas.add(q.clave);
      return q;
    }
    return G.queEs(lv);
  }
  function reto(lv) { const [e, t] = elegir(RETOS[lv]); return { tipo: "reto", lv, tema: "Challenge", e, titulo: t }; }
  function movimiento() { const [e, t] = elegir(MOVIMIENTO); return { tipo: "reto", lv: 0, tema: "Move!", e, titulo: t }; }

  /* ---------- parejas para Spooky Memory ---------- */
  const SONIDOS = [["Meow!", "🐈"], ["Woof!", "🐕"], ["Twit-twoo!", "🦉"], ["Aaa-ooo!", "🐺"], ["Moo!", "🐄"], ["Oink!", "🐖"], ["Ribbit!", "🐸"],
    ["Hiss!", "🐍"], ["Quack!", "🦆"], ["Squeak!", "🐁"], ["Baa!", "🐑"], ["Neigh!", "🐴"], ["Roar!", "🦁"], ["Buzz!", "🐝"], ["Boo!", "👻"]];
  const PAREJAS = {
    dibujos: { t: "🎃 Dibujo = dibujo", lv: 1, d: "Memory clásico con dibujos de Halloween (se dice la palabra)",
      gen: n => tomar(vocab(2, ["halloween"]), n).map(v => [{ html: `<span class="ce">${v.e}</span><span class="cw">${esc(v.en)}</span>`, decir: v.en }, { html: `<span class="ce">${v.e}</span><span class="cw">${esc(v.en)}</span>`, decir: v.en }]) },
    imagen: { t: "🖼️ Dibujo ↔ palabra", lv: 1, d: "Vocabulario: emparejar el dibujo con la palabra",
      gen: (n, lv) => tomar(vocab(lv), n).map(v => [{ html: `<span class="ce">${v.e}</span>`, decir: v.en }, { html: `<span class="ct">${esc(v.en)}</span>`, decir: v.en }]) },
    colores: { t: "🎨 Colores", lv: 1, d: "Mancha de color ↔ nombre del color",
      gen: n => tomar(COLORES, Math.min(n, COLORES.length)).map(c => [{ html: `<span class="cc" style="background:${c.hex}"></span>`, decir: c.en }, { html: `<span class="ct">${c.en}</span>`, decir: c.en }]) },
    numeros: { t: "🔢 Números", lv: 1, d: "Contar dibujos ↔ número en inglés",
      gen: (n, lv) => tomar(Array.from({ length: lv === 1 ? 10 : 20 }, (_, i) => i + 1), n).map(k => { const v = buscar(elegir(CONTABLES));
        return [{ html: `<span class="cn${k > 6 ? " mini" : ""}">${v.e.repeat(k)}</span>`, decir: numEn(k) }, { html: `<span class="ct">${numEn(k)}</span>`, decir: numEn(k) }]; }) },
    sonidos: { t: "🐾 Sonidos", lv: 1, d: "Animal ↔ el sonido que hace (Meow! Woof!...)",
      gen: n => tomar(SONIDOS, n).map(([s, e]) => [{ html: `<span class="ce">${e}</span>`, decir: s }, { html: `<span class="ct">${s}</span>`, decir: s }]) },
    opuestos: { t: "🔄 Contrarios", lv: 2, d: "big ↔ small, happy ↔ sad...",
      gen: n => tomar(OPUESTOS, n).map(([a, b]) => [{ html: `<span class="ct">${a}</span>`, decir: a }, { html: `<span class="ct">${b}</span>`, decir: b }]) },
    plurales: { t: "🕷️ Plurales", lv: 3, d: "mouse ↔ mice, tooth ↔ teeth...",
      gen: n => tomar(PLUR, n).map(([s, p]) => [{ html: `<span class="ct">one ${s}</span>`, decir: "one " + s }, { html: `<span class="ct">two ${p}</span>`, decir: "two " + p }]) },
    pasado: { t: "⏪ Pasado", lv: 3, d: "Verbo ↔ pasado: fly ↔ flew, eat ↔ ate...",
      gen: n => tomar(PASADO, n).map(([, b, p]) => [{ html: `<span class="ct">${b}</span>`, decir: b }, { html: `<span class="ct pas">${p}</span>`, decir: p }]) },
  };

  window.BANCO = { VOCAB, COLORES, CATEGORIAS, vocab, buscar, numEn, plural, art, cap, esc, pregunta, reto, movimiento, PAREJAS, DIAS, MESES,
    azar, elegir, barajar, tomar, G };
})();
