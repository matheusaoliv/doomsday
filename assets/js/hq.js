/* ==========================================================================
   HQs de fã com arte em imagem (DESTINO #2 em diante)
   Cada HQ fica em assets/comics/<id>/: o roteiro (hq.json) e os quadros
   pNN-K.webp. A página é montada em SVG: quadros em imagem + recordatórios,
   balões e onomatopeias em texto (legíveis, traduzíveis e leves).
   API: window.DoomHQ = { load(id), renderPage(def, i, prefix), panels(def, i) }
   ========================================================================== */
(function () {
  "use strict";
  var W = 800, H = 1200, M = 26, G = 14, CW = 748, CH = 1148, HALF = (CW - G) / 2, THIRD = (CW - 2 * G) / 3;
  var cache = {};

  // grades de quadros (as mesmas de tools/gerar-hq.py)
  function grid(name) {
    switch (name) {
      case "splash": return [[M, M, CW, CH]];
      case "w-2-w": return [[M, M, CW, 390], [M, M + 404, HALF, 360], [M + HALF + G, M + 404, HALF, 360], [M, M + 778, CW, 370]];
      case "2-w-2": return [[M, M, HALF, 360], [M + HALF + G, M, HALF, 360], [M, M + 374, CW, 400], [M, M + 788, HALF, 360], [M + HALF + G, M + 788, HALF, 360]];
      case "w-w-w": return [[M, M, CW, 373], [M, M + 387, CW, 374], [M, M + 775, CW, 373]];
      case "tall-2": return [[M, M, HALF, CH], [M + HALF + G, M, HALF, 567], [M + HALF + G, M + 581, HALF, 567]];
      case "w-3": return [[M, M, CW, 560], [M, M + 574, THIRD, 574], [M + THIRD + G, M + 574, THIRD, 574], [M + (THIRD + G) * 2, M + 574, THIRD, 574]];
      case "w-2": return [[M, M, CW, 560], [M, M + 574, HALF, 574], [M + HALF + G, M + 574, HALF, 574]];
      case "2-w": return [[M, M, HALF, 574], [M + HALF + G, M, HALF, 574], [M, M + 588, CW, 560]];
    }
    return [[M, M, CW, CH]];
  }
  function f(n) { return Math.round(n * 10) / 10; }
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function load(id) {
    if (cache[id]) return Promise.resolve(cache[id]);
    var base = "assets/comics/" + id + "/";
    return fetch(base + "hq.json").then(function (r) {
      if (!r.ok) throw new Error("Não foi possível abrir esta HQ.");
      return r.json();
    }).then(function (def) { def.base = base; cache[id] = def; return def; });
  }

  function panels(def, i) { return grid(def.pages[i].layout); }

  function lettering(def, pg, R) {
    var ui = window.DoomComic.ui, o = "";
    (pg.text || []).forEach(function (t) {
      var r = R[t.p] || R[0], x = r[0] + t.x * r[2], y = r[1] + t.y * r[3], w = (t.w || 0.5) * r[2];
      var tx = t.tail ? r[0] + t.tail[0] * r[2] : null, ty = t.tail ? r[1] + t.tail[1] * r[3] : null;
      if (t.k === "c") o += ui.caption(x, y, w, t.t, { fs: 16, bg: t.bg });
      else if (t.k === "n") o += ui.caption(x, y, w, t.t, { fs: 16, bg: t.bg || "#efe6cf", fg: "#2a1d0e" });
      else if (t.k === "b") o += ui.balloon(x, y, w, t.t, tx, ty, { fs: 16 });
      else if (t.k === "d") o += ui.balloon(x, y, w, t.t, tx, ty, { fs: 16, doom: true });
      else if (t.k === "m") o += ui.balloon(x, y, w, t.t, tx, ty, { fs: 16, bg: "#4a0808", fg: "#ffe9e0", stroke: "#ff4433" });
      else if (t.k === "s") o += ui.sfx(x, y, t.t, t.size || 48, t.rot || 0, t.fill, t.stroke);
    });
    return o;
  }

  function cover(def, P) {
    var o = '<rect x="' + M + '" y="' + M + '" width="' + CW + '" height="170" fill="url(#' + P + 'Top)"/>';
    o += '<text x="' + W / 2 + '" y="' + (M + 104) + '" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="900" font-size="104" letter-spacing="10" fill="#e9f1ec" stroke="#2dff8a" stroke-width="1.5">DESTINO</text>';
    o += '<text x="' + (M + 22) + '" y="' + (M + 40) + '" font-family="Bangers, Impact, sans-serif" font-size="34" fill="#f1d65a">' + esc(def.num) + "</text>";
    o += '<text x="' + W / 2 + '" y="' + (M + 150) + '" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="40" letter-spacing="3" fill="#f1d65a" stroke="#050505" stroke-width="3" paint-order="stroke">' + esc(def.title.toUpperCase()) + "</text>";
    o += '<rect x="' + M + '" y="' + (H - M - 120) + '" width="' + CW + '" height="120" fill="url(#' + P + 'Bot)"/>';
    var lines = window.DoomComic.ui.wrap(def.based, 80);
    lines.forEach(function (l, i) { o += '<text x="' + W / 2 + '" y="' + (H - M - 62 + i * 18) + '" text-anchor="middle" font-family="\'Comic Neue\', sans-serif" font-weight="700" font-size="14" fill="#e9f1ec">' + esc(l) + "</text>"; });
    o += '<text x="' + W / 2 + '" y="' + (H - M - 16) + '" text-anchor="middle" font-family="\'Comic Neue\', sans-serif" font-weight="700" font-size="11" letter-spacing="1" fill="#9fb8aa">' + esc(def.credits.toUpperCase()) + "</text>";
    return o;
  }

  function renderPage(def, i, prefix) {
    var pg = def.pages[i], R = panels(def, i), body = "", P = prefix || "hq";
    body += '<rect width="' + W + '" height="' + H + '" fill="' + (pg.cover ? "#050505" : "#f4efe2") + '"/>';
    R.forEach(function (r, k) {
      var href = def.base + "p" + pad(i) + "-" + (k + 1) + ".webp";
      body += '<svg x="' + f(r[0]) + '" y="' + f(r[1]) + '" width="' + f(r[2]) + '" height="' + f(r[3]) + '" viewBox="0 0 ' + f(r[2]) + " " + f(r[3]) + '" overflow="hidden">' +
        '<rect width="100%" height="100%" fill="#14100c"/><image href="' + href + '" width="' + f(r[2]) + '" height="' + f(r[3]) + '" preserveAspectRatio="xMidYMid slice"/></svg>';
      body += '<rect x="' + f(r[0]) + '" y="' + f(r[1]) + '" width="' + f(r[2]) + '" height="' + f(r[3]) + '" fill="none" stroke="#050505" stroke-width="5"/>';
    });
    body += pg.cover ? cover(def, P) : lettering(def, pg, R);
    if (!pg.cover) body += '<text x="' + (W - M) + '" y="' + (H - 8) + '" text-anchor="end" font-family="\'Comic Neue\', sans-serif" font-weight="700" font-size="13" fill="#6b6455">' + i + "/" + (def.pages.length - 1) + "</text>";
    var defs = '<linearGradient id="' + P + 'Top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".85"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="' + P + 'Bot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".9"/></linearGradient>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" class="cm-page" data-p="' + P + '" role="img" aria-label="' + esc(def.full) + ", página " + i + ": " + esc(pg.title) + '"><defs>' + defs + "</defs>" + body + "</svg>";
  }

  window.DoomHQ = { load: load, renderPage: renderPage, panels: panels, grid: grid };
})();
