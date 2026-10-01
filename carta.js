// Who Am I? Halloween · maquetación de carta (anverso y reverso), compartida por la app y la versión imprimible.
(function () {
  const NIVELES = {
    A: { code: "A1–A2", en: "Easy", es: "Fácil" },
    B: { code: "B1–B2", en: "Medium", es: "Medio" },
    C: { code: "C1–C2", en: "Hard", es: "Difícil" },
    X: { code: "X", en: "Impossible", es: "Imposible" },
  };
  const TIPOS = {
    criatura: ["Creature", "Criatura"], personaje: ["Character", "Personaje"], animal: ["Animal", "Animal"],
    objeto: ["Object", "Objeto"], comida: ["Food", "Comida"], famoso: ["Famous", "Famoso"],
    lugar: ["Place", "Lugar"], concepto: ["Idea", "Concepto"], naturaleza: ["Nature", "Naturaleza"],
  };
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  function svg(c) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${c.svg || ""}</svg>`;
  }

  function cabecera(c) {
    const n = NIVELES[c.nivel], t = TIPOS[c.tipo] || ["", ""];
    return `<div class="top"><span class="lv"><b>${n.code}</b>${n.en}</span><span>${t[0]} · ${t[1]}</span></div>`;
  }

  function anverso(c) {
    const largo = c.en.length > 22 ? " muylargo" : c.en.length > 13 ? " largo" : "";
    const vocab = (c.vocab || []).map(([en, es]) => `<span>${esc(en)} <i>· ${esc(es)}</i></span>`).join("");
    return `<div class="carta nivel-${c.nivel}"><div class="in">
      ${cabecera(c)}
      <div class="arte">${svg(c)}</div>
      <div class="nombre"><div class="en${largo}">${esc(cap(c.en))}</div><div class="es">${esc(cap(c.es))}</div></div>
      <div class="desc"><p>${esc(c.desc.en)}</p><p class="es">${esc(c.desc.es)}</p></div>
      <div class="vocab">${vocab}</div>
      <div class="pie"><span>${esc(c.num || "")}</span><span class="obra">${esc(c.obra || "Who am I? · ¿Quién soy?")}</span></div>
    </div></div>`;
  }

  function reverso(c) {
    const largo = c.pistas.en.join("").length + c.pistas.es.join("").length;
    const items = c.pistas.en.map((en, i) => `<li><span class="pt">${5 - i}<small>pts</small></span>
      <span class="t">${esc(en)}<span class="es">${esc(c.pistas.es[i])}</span></span></li>`).join("");
    return `<div class="carta reverso nivel-${c.nivel}${largo > 620 ? " denso" : ""}"><div class="in">
      ${cabecera(c)}
      <div class="titulo">Who am I?</div>
      <div class="sub">¿Quién soy? · read from 5 to 1 · lee de 5 a 1</div>
      <ol class="pistas">${items}</ol>
      <div class="sol">Answer · Solución: <b>${esc(cap(c.en))}</b> · ${esc(c.es)}</div>
    </div></div>`;
  }

  // Numera las cartas por nivel (A-001…) en el orden en que están cargadas
  function numerar(cartas) {
    const n = {};
    cartas.forEach(c => { n[c.nivel] = (n[c.nivel] || 0) + 1; c.num = `${c.nivel}-${String(n[c.nivel]).padStart(3, "0")}`; });
    return cartas;
  }

  window.WHO = { NIVELES, TIPOS, anverso, reverso, svg, numerar, esc, cap };
})();
