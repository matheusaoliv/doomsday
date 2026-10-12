/* ==========================================================================
   DESTINO — uma HQ de fã em 8 páginas, 100% vetorial e original.
   Roteiro e arte gerados em SVG para este site. Personagens © Marvel.
   API:  window.DoomComic = { pages, count, title, renderPage(i, prefix), renderPanel(i, j, prefix) }
   Cada página usa viewBox 0 0 800 1200. pages[i].panels guarda os retângulos
   [x, y, w, h] usados pela leitura “painel a painel”.
   ========================================================================== */
(function () {
  "use strict";
  var W = 800, H = 1200, M = 26, G = 14; // margem e calha

  /* ------------------------------------------------------------ utilidades */
  function rng(seed) {
    var s = (seed >>> 0) || 1;
    return function () { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function wrap(text, max) {
    var words = String(text).split(/\s+/), lines = [], cur = "";
    words.forEach(function (w) {
      if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; }
      else cur = (cur + " " + w).trim();
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function f(n) { return Math.round(n * 10) / 10; }

  /* contexto de renderização: ids únicos por SVG (evita conflitos de <defs>) */
  function Ctx(prefix) { this.P = prefix || ("dc" + Math.random().toString(36).slice(2, 7)); this.n = 0; this.defs = []; }
  Ctx.prototype.id = function () { return this.P + "_" + (this.n++); };
  Ctx.prototype.lin = function (stops, x1, y1, x2, y2) {
    var id = this.id();
    this.defs.push('<linearGradient id="' + id + '" x1="' + (x1 || 0) + '" y1="' + (y1 || 0) + '" x2="' + (x2 == null ? 0 : x2) + '" y2="' + (y2 == null ? 1 : y2) + '">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] != null ? ' stop-opacity="' + s[2] + '"' : "") + "/>"; }).join("") + "</linearGradient>");
    return "url(#" + id + ")";
  };
  Ctx.prototype.rad = function (stops, cx, cy, r) {
    var id = this.id();
    this.defs.push('<radialGradient id="' + id + '" cx="' + (cx == null ? 0.5 : cx) + '" cy="' + (cy == null ? 0.5 : cy) + '" r="' + (r || 0.5) + '">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] != null ? ' stop-opacity="' + s[2] + '"' : "") + "/>"; }).join("") + "</radialGradient>");
    return "url(#" + id + ")";
  };
  Ctx.prototype.dots = function (color, size, gap) {
    var id = this.id(); gap = gap || 9; size = size || 1.6;
    this.defs.push('<pattern id="' + id + '" width="' + gap + '" height="' + gap + '" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="' + gap / 2 + '" cy="' + gap / 2 + '" r="' + size + '" fill="' + color + '"/></pattern>');
    return "url(#" + id + ")";
  };

  /* ------------------------------------------------------------- cenário */
  function rect(x, y, w, h, fill, extra) { return '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '" fill="' + fill + '"' + (extra || "") + "/>"; }
  function stars(w, h, n, seed, color) {
    var r = rng(seed), o = "";
    for (var i = 0; i < n; i++) o += '<circle cx="' + f(r() * w) + '" cy="' + f(r() * h) + '" r="' + f(0.6 + r() * 1.6) + '" fill="' + (color || "#e9fff4") + '" opacity="' + f(0.3 + r() * 0.7) + '"/>';
    return o;
  }
  function mountains(w, base, peak, color, seed, n) {
    var r = rng(seed), pts = ["0," + f(base + 400)], step = w / (n || 7);
    pts.push("0," + f(base));
    for (var x = 0; x <= w + step; x += step / 2) {
      var hgt = (Math.floor(x / (step / 2)) % 2 === 0) ? peak * (0.55 + r() * 0.45) : peak * (0.1 + r() * 0.25);
      pts.push(f(x) + "," + f(base - hgt));
    }
    pts.push(f(w) + "," + f(base + 400));
    return '<polygon points="' + pts.join(" ") + '" fill="' + color + '"/>';
  }
  function snowcaps(w, base, peak, seed, n) {
    var r = rng(seed), o = "", step = w / (n || 7);
    for (var x = 0; x <= w + step; x += step) {
      var hgt = peak * (0.55 + r() * 0.45), px = x, py = base - hgt;
      r(); // mantém a sequência alinhada com mountains()
      o += '<polygon points="' + f(px - 18) + "," + f(py + 26) + " " + f(px) + "," + f(py) + " " + f(px + 20) + "," + f(py + 30) + " " + f(px + 6) + "," + f(py + 22) + '" fill="#dfe9ee" opacity=".85"/>';
    }
    return o;
  }
  function castle(x, y, s, color, win) {
    // x,y = base central; s = escala
    var o = '<g transform="translate(' + f(x) + "," + f(y) + ") scale(" + s + ')" fill="' + color + '">';
    o += '<path d="M-120 0 L-120 -70 L-110 -70 L-110 -80 L-100 -80 L-100 -70 L-90 -70 L-90 -80 L-80 -80 L-80 -70 L-70 -70 L-70 -110 L-40 -110 L-40 -70 L40 -70 L40 -130 L70 -130 L70 -70 L120 -70 L120 0 Z"/>';
    o += '<path d="M-14 -70 L-14 -190 L-30 -190 L0 -250 L30 -190 L14 -190 L14 -70 Z"/>';
    o += '<path d="M-85 -110 L-85 -150 L-95 -150 L-55 -200 L-15 -150 L-25 -150 L-25 -110 Z"/>';
    o += '<path d="M48 -130 L48 -170 L40 -170 L55 -215 L70 -170 L62 -170 L62 -130 Z"/>';
    o += '<path d="M90 -70 L90 -150 L80 -150 L105 -195 L130 -150 L120 -150 L120 -70 Z"/>';
    o += "</g>";
    if (win) {
      var ws = [[-4, -165], [-60, -135], [52, -150], [100, -120], [-100, -45], [80, -40], [0, -100]];
      ws.forEach(function (p) { o += '<rect x="' + f(x + p[0] * s) + '" y="' + f(y + p[1] * s) + '" width="' + f(6 * s) + '" height="' + f(10 * s) + '" fill="' + win + '"/>'; });
    }
    return o;
  }
  function person(x, y, s, o) {
    o = o || {};
    var b = o.bulk || 1, c = o.fill || "#050807", hr = s * 0.072, hy = y - s + hr;
    var sh = s * 0.13 * b, hip = s * 0.09 * b, sy = y - s * 0.8, hipY = y - s * 0.46, lean = (o.lean || 0) * s;
    var cl = o.cloak || 0, out = "";
    var body = "M" + f(x - sh + lean) + " " + f(sy) + " Q" + f(x + lean) + " " + f(sy - s * 0.05) + " " + f(x + sh + lean) + " " + f(sy) +
      " L" + f(x + hip) + " " + f(hipY) + " L" + f(x + hip * 0.9) + " " + f(y) + " L" + f(x + hip * 0.15) + " " + f(y) +
      " L" + f(x) + " " + f(hipY + s * 0.08) + " L" + f(x - hip * 0.15) + " " + f(y) + " L" + f(x - hip * 0.9) + " " + f(y) + " L" + f(x - hip) + " " + f(hipY) + " Z";
    if (cl) {
      var cw = s * 0.32 * cl;
      out += '<path d="M' + f(x - sh * 0.9 + lean) + " " + f(sy - s * 0.02) + " Q" + f(x - cw) + " " + f(y - s * 0.3) + " " + f(x - cw * 1.15) + " " + f(y) +
        " L" + f(x + cw * 1.15) + " " + f(y) + " Q" + f(x + cw) + " " + f(y - s * 0.3) + " " + f(x + sh * 0.9 + lean) + " " + f(sy - s * 0.02) + ' Z" fill="' + (o.cloakFill || c) + '"/>';
    }
    if (o.rim) out += '<path d="' + body + '" fill="' + o.rim + '" transform="translate(' + (o.rimDx || -3) + ',0)"/>' +
      '<circle cx="' + f(x + lean + (o.rimDx || -3)) + '" cy="' + f(hy) + '" r="' + f(hr) + '" fill="' + o.rim + '"/>';
    out += '<path d="' + body + '" fill="' + c + '"/>';
    out += '<circle cx="' + f(x + lean) + '" cy="' + f(hy) + '" r="' + f(hr) + '" fill="' + c + '"/>';
    if (o.hood) out += '<path d="M' + f(x + lean - hr * 1.6) + " " + f(sy + 2) + " Q" + f(x + lean - hr * 1.8) + " " + f(hy - hr * 1.9) + " " + f(x + lean) + " " + f(hy - hr * 1.5) +
      " Q" + f(x + lean + hr * 1.8) + " " + f(hy - hr * 1.9) + " " + f(x + lean + hr * 1.6) + " " + f(sy + 2) + ' Z" fill="' + (o.hoodFill || o.cloakFill || c) + '"/>';
    if (o.horns) out += '<path d="M' + f(x + lean - hr * 0.7) + " " + f(hy - hr * 0.6) + " Q" + f(x + lean - hr * 2.2) + " " + f(hy - hr * 1.6) + " " + f(x + lean - hr * 1.6) + " " + f(hy - hr * 3.4) +
      " Q" + f(x + lean - hr * 1.1) + " " + f(hy - hr * 1.7) + " " + f(x + lean - hr * 0.1) + " " + f(hy - hr * 0.9) + " Z M" + f(x + lean + hr * 0.7) + " " + f(hy - hr * 0.6) + " Q" + f(x + lean + hr * 2.2) + " " + f(hy - hr * 1.6) + " " + f(x + lean + hr * 1.6) + " " + f(hy - hr * 3.4) +
      " Q" + f(x + lean + hr * 1.1) + " " + f(hy - hr * 1.7) + " " + f(x + lean + hr * 0.1) + " " + f(hy - hr * 0.9) + ' Z" fill="' + c + '"/>';
    if (o.eyes) out += '<rect x="' + f(x + lean - hr * 0.6) + '" y="' + f(hy - hr * 0.15) + '" width="' + f(hr * 0.45) + '" height="' + f(hr * 0.18) + '" fill="' + o.eyes + '"/><rect x="' + f(x + lean + hr * 0.15) + '" y="' + f(hy - hr * 0.15) + '" width="' + f(hr * 0.45) + '" height="' + f(hr * 0.18) + '" fill="' + o.eyes + '"/>';
    return out;
  }
  /* A máscara: desenho original, reaproveitado no site inteiro */
  function mask(ctx, x, y, s, o) {
    o = o || {};
    var metal = o.hot ? ctx.lin([[0, "#fff6c2"], [0.35, "#ffb12b"], [0.7, "#ff4b12"], [1, "#7a1004"]], 0, 0, 0, 1)
                      : ctx.lin([[0, "#f4f8f9"], [0.45, "#a6b1b4"], [0.75, "#59646a"], [1, "#22292c"]], 0, 0, 1, 1);
    var eye = o.eye || "#2dff8a";
    var g = '<g transform="translate(' + f(x) + "," + f(y) + ") scale(" + s + ') translate(-100,-120)">';
    if (o.hood) g += '<path d="M100 -8 C40 -8 6 40 4 110 C2 170 18 226 36 252 L164 252 C182 226 198 170 196 110 C194 40 160 -8 100 -8 Z" fill="' + (o.hood === true ? "#0d3d24" : o.hood) + '"/>' +
      '<path d="M100 6 C52 6 24 48 22 112 C20 168 34 214 48 240 L152 240 C166 214 180 168 178 112 C176 48 148 6 100 6 Z" fill="#04130b"/>';
    g += '<path d="M60 40 Q100 18 140 40 L150 118 Q150 172 128 204 L100 220 L72 204 Q50 172 50 118 Z" fill="' + metal + '" stroke="#0b0f10" stroke-width="3"/>' +
      '<path d="M100 26 L100 218" stroke="#0b0f10" stroke-width="1.5" opacity=".35"/>' +
      '<path d="M58 86 L95 94 M142 86 L105 94" stroke="#0b0f10" stroke-width="5" stroke-linecap="round"/>' +
      '<polygon points="64,98 92,102 90,110 64,106" fill="#020403"/><polygon points="136,98 108,102 110,110 136,106" fill="#020403"/>' +
      '<polygon points="66,100 90,103 89,107 66,104" fill="' + eye + '"/><polygon points="134,100 110,103 111,107 134,104" fill="' + eye + '"/>' +
      '<path d="M100 98 L93 142 L100 150 L107 142 Z" fill="#ffffff" opacity=".25"/>' +
      '<path d="M66 128 Q82 150 80 172 M134 128 Q118 150 120 172" stroke="#0b0f10" stroke-width="3" fill="none" opacity=".7"/>' +
      '<rect x="78" y="164" width="44" height="14" rx="2" fill="#0b0f10"/>';
    for (var i = 0; i < 7; i++) g += '<rect x="' + (81 + i * 6) + '" y="166" width="2.4" height="10" fill="' + (o.hot ? "#ffd27a" : "#7f8a8e") + '"/>';
    [[58, 64], [142, 64], [55, 140], [145, 140], [72, 192], [128, 192]].forEach(function (p) { g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.2" fill="#0b0f10"/><circle cx="' + (p[0] - 0.8) + '" cy="' + (p[1] - 0.8) + '" r="1.3" fill="#ffffff" opacity=".6"/>'; });
    g += "</g>";
    return g;
  }
  function doom(ctx, x, y, s, o) {
    // figura de corpo inteiro: manto verde, armadura e máscara
    o = o || {};
    var cloak = ctx.lin([[0, "#1d7a46"], [1, "#062414"]], 0, 0, 1, 1);
    var hr = s * 0.072, hy = y - s + hr, out = "";
    out += person(x, y, s, { fill: "#4e5a5f", cloak: o.cloak == null ? 1.3 : o.cloak, cloakFill: cloak, hood: true, hoodFill: "#0d3d24", bulk: 1.15, rim: o.rim, rimDx: o.rimDx });
    out += mask(ctx, x, hy + hr * 0.15, (hr * 2.3) / 200, { eye: o.eye || "#2dff8a" });
    out += '<rect x="' + f(x - s * 0.06) + '" y="' + f(y - s * 0.62) + '" width="' + f(s * 0.12) + '" height="' + f(s * 0.04) + '" fill="#0d3d24"/>';
    return out;
  }
  function flames(x, y, w, h, seed, hot) {
    var r = rng(seed), o = "", n = Math.max(6, Math.round(w / 26));
    for (var i = 0; i < n; i++) {
      var cx = x + (i + 0.5) * (w / n) + (r() - 0.5) * 12, fh = h * (0.45 + r() * 0.55), fw = (w / n) * 1.3;
      var col = i % 3 === 0 ? "#ffd34d" : i % 3 === 1 ? "#ff7a1a" : "#e8380d";
      if (hot) col = i % 2 ? "#2dff8a" : "#0fb562";
      o += '<path d="M' + f(cx - fw / 2) + " " + f(y) + " Q" + f(cx - fw * 0.6) + " " + f(y - fh * 0.5) + " " + f(cx + (r() - 0.5) * fw * 0.6) + " " + f(y - fh) +
        " Q" + f(cx + fw * 0.6) + " " + f(y - fh * 0.45) + " " + f(cx + fw / 2) + " " + f(y) + ' Z" fill="' + col + '" opacity=".92"/>';
    }
    return o;
  }
  function burst(cx, cy, r1, r2, n, fill, stroke, seed) {
    var rr = rng(seed || 3), pts = [];
    for (var i = 0; i < n * 2; i++) {
      var a = (i / (n * 2)) * Math.PI * 2, rad = i % 2 ? r1 * (0.55 + rr() * 0.2) : r2 * (0.85 + rr() * 0.3);
      pts.push(f(cx + Math.cos(a) * rad) + "," + f(cy + Math.sin(a) * rad));
    }
    return '<polygon points="' + pts.join(" ") + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="5" stroke-linejoin="round"' : "") + "/>";
  }
  function rays(cx, cy, n, len, color, width, seed) {
    var r = rng(seed || 7), o = "";
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + r() * 0.05, l0 = len * (0.25 + r() * 0.25);
      o += '<line x1="' + f(cx + Math.cos(a) * l0) + '" y1="' + f(cy + Math.sin(a) * l0) + '" x2="' + f(cx + Math.cos(a) * len) + '" y2="' + f(cy + Math.sin(a) * len) + '" stroke="' + color + '" stroke-width="' + (width || 2) + '" opacity="' + f(0.35 + r() * 0.5) + '"/>';
    }
    return o;
  }
  function krackle(cx, cy, rad, n, seed, glow) {
    var r = rng(seed), o = "";
    for (var i = 0; i < n; i++) {
      var a = r() * Math.PI * 2, d = Math.sqrt(r()) * rad, s = 3 + r() * 14;
      var x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      o += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(s + 3) + '" fill="' + glow + '" opacity=".55"/><circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(s) + '" fill="#060606"/>';
    }
    return o;
  }
  function runes(cx, cy, r, color) {
    var o = '<g fill="none" stroke="' + color + '" stroke-width="3">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/><circle cx="' + cx + '" cy="' + cy + '" r="' + f(r * 0.82) + '" stroke-dasharray="6 10"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(r * 0.5) + '"/>';
    for (var i = 0; i < 8; i++) {
      var a = (i / 8) * Math.PI * 2, x = cx + Math.cos(a) * r * 0.91, y = cy + Math.sin(a) * r * 0.91;
      o += '<path d="M' + f(x - 6) + " " + f(y - 6) + " L" + f(x + 6) + " " + f(y + 6) + " M" + f(x + 6) + " " + f(y - 6) + " L" + f(x) + " " + f(y + 8) + '"/>';
    }
    var tri = [0, 1, 2].map(function (i) { var a = -Math.PI / 2 + (i * 2 * Math.PI) / 3; return f(cx + Math.cos(a) * r * 0.5) + "," + f(cy + Math.sin(a) * r * 0.5); }).join(" ");
    var tri2 = [0, 1, 2].map(function (i) { var a = Math.PI / 2 + (i * 2 * Math.PI) / 3; return f(cx + Math.cos(a) * r * 0.5) + "," + f(cy + Math.sin(a) * r * 0.5); }).join(" ");
    return o + '<polygon points="' + tri + '"/><polygon points="' + tri2 + '"/></g>';
  }
  function planet(ctx, cx, cy, r, c1, c2, seed, ring) {
    var rr = rng(seed), body = ctx.rad([[0, c1], [0.7, c2], [1, "#020604"]], 0.35, 0.35, 0.75), o = "";
    if (ring) o += '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(r * 1.12) + '" fill="none" stroke="' + ring + '" stroke-width="' + f(r * 0.08) + '" opacity=".55"/>';
    o += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + body + '"/>';
    for (var i = 0; i < 6; i++) {
      var a = rr() * Math.PI * 2, d = rr() * r * 0.6, s = r * (0.12 + rr() * 0.2);
      o += '<ellipse cx="' + f(cx + Math.cos(a) * d) + '" cy="' + f(cy + Math.sin(a) * d) + '" rx="' + f(s * 1.4) + '" ry="' + f(s) + '" fill="#1d5a32" opacity=".55" transform="rotate(' + f(rr() * 180) + " " + f(cx + Math.cos(a) * d) + " " + f(cy + Math.sin(a) * d) + ')"/>';
    }
    o += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#bfffe0" stroke-width="2" opacity=".35"/>';
    return o;
  }

  /* ------------------------------------------------------------- textos */
  function caption(x, y, w, text, o) {
    o = o || {};
    var fs = o.fs || 17, lines = wrap(text, Math.floor((w - 18) / (fs * 0.62))), lh = fs * 1.22, h = lines.length * lh + 18;
    var bg = o.bg || "#f1d65a", fg = o.fg || "#141008";
    var t = '<g class="cm-cap"><rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '" fill="' + bg + '" stroke="#050505" stroke-width="3"/>';
    lines.forEach(function (l, i) { t += '<text x="' + f(x + 11) + '" y="' + f(y + 13 + fs * 0.9 + i * lh) + '" font-family="\'Comic Neue\', \'Comic Sans MS\', sans-serif" font-weight="700" font-size="' + fs + '" fill="' + fg + '">' + esc(l.toUpperCase()) + "</text>"; });
    return t + "</g>";
  }
  function balloon(x, y, w, text, tx, ty, o) {
    o = o || {};
    var fs = o.fs || 17, lines = wrap(text, Math.floor(w / (fs * 0.6))), lh = fs * 1.2, h = lines.length * lh + 26;
    var doomStyle = o.doom, bg = doomStyle ? "#0f3d24" : (o.bg || "#ffffff"), fg = doomStyle ? "#d9ffe9" : "#0a0a0a", stroke = doomStyle ? "#2dff8a" : "#050505";
    var cx = x + w / 2, cy = y + h / 2, out = '<g class="cm-bal">';
    if (tx != null) {
      var bx = Math.max(x + 22, Math.min(x + w - 22, tx));
      var by = ty > cy ? y + h - 4 : y + 4;
      out += '<path d="M' + f(bx - 12) + " " + f(by) + " L" + f(tx) + " " + f(ty) + " L" + f(bx + 12) + " " + f(by) + ' Z" fill="' + bg + '" stroke="' + stroke + '" stroke-width="3" stroke-linejoin="round"/>';
    }
    if (doomStyle) out += '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '" rx="10" fill="' + bg + '" stroke="' + stroke + '" stroke-width="3"/>';
    else out += '<ellipse cx="' + f(cx) + '" cy="' + f(cy) + '" rx="' + f(w / 2 + 14) + '" ry="' + f(h / 2 + 8) + '" fill="' + bg + '" stroke="' + stroke + '" stroke-width="3"/>';
    if (tx != null) { // limpa a base do rabicho
      var bx2 = Math.max(x + 22, Math.min(x + w - 22, tx)), by2 = ty > cy ? y + h - 5 : y + 5;
      out += '<path d="M' + f(bx2 - 9) + " " + f(by2) + " L" + f(bx2 + 9) + " " + f(by2) + '" stroke="' + bg + '" stroke-width="6"/>';
    }
    lines.forEach(function (l, i) {
      out += '<text x="' + f(cx) + '" y="' + f(y + 13 + fs * 0.9 + i * lh) + '" text-anchor="middle" font-family="\'Comic Neue\', \'Comic Sans MS\', sans-serif" font-weight="700" font-size="' + fs + '" fill="' + fg + '">' + esc(l.toUpperCase()) + "</text>";
    });
    return out + "</g>";
  }
  function sfx(x, y, text, size, rot, fill, stroke) {
    return '<text x="' + f(x) + '" y="' + f(y) + '" font-family="Bangers, Impact, sans-serif" font-size="' + size + '" fill="' + (fill || "#ffd34d") + '" stroke="' + (stroke || "#050505") + '" stroke-width="' + Math.max(3, size / 14) + '" paint-order="stroke" letter-spacing="2" transform="rotate(' + (rot || 0) + " " + f(x) + " " + f(y) + ')">' + esc(text) + "</text>";
  }

  /* ------------------------------------------------------------- páginas */
  // cada painel: r = [x,y,w,h], art(ctx,w,h) desenha em coordenadas locais, txt(ctx,x,y,w,h) em coordenadas da página
  var pages = [];

  /* CAPA ------------------------------------------------------------- */
  pages.push({
    title: "Capa",
    panels: [[M, M, W - M * 2, H - M * 2]],
    cover: true,
    draw: function (ctx) {
      var w = W - M * 2, h = H - M * 2, o = "";
      o += rect(0, 0, w, h, ctx.lin([[0, "#071a10"], [0.55, "#030806"], [1, "#000"]]));
      o += rect(0, 0, w, h, ctx.dots("#2dff8a", 1.4, 10), ' opacity=".22"');
      o += rays(w / 2, h * 0.47, 90, 900, "#2dff8a", 2, 11);
      o += '<circle cx="' + w / 2 + '" cy="' + f(h * 0.47) + '" r="300" fill="' + ctx.rad([[0, "#2dff8a", 0.55], [1, "#2dff8a", 0]]) + '"/>';
      o += krackle(w / 2, h * 0.47, 330, 46, 21, "#2dff8a");
      o += mask(ctx, w / 2, h * 0.5, 2.15, { hood: true });
      o += rect(0, h - 170, w, 170, ctx.lin([[0, "#000", 0], [1, "#000", 0.95]]));
      return o;
    },
    text: function () {
      var o = "";
      o += '<rect x="' + M + '" y="' + M + '" width="' + (W - M * 2) + '" height="150" fill="#000" opacity=".55"/>';
      o += '<text x="' + W / 2 + '" y="' + (M + 112) + '" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="900" font-size="112" letter-spacing="10" fill="#e9f1ec" stroke="#2dff8a" stroke-width="1.5">DESTINO</text>';
      o += '<text x="' + (M + 22) + '" y="' + (M + 40) + '" font-family="Bangers, Impact, sans-serif" font-size="34" fill="#f1d65a">#1</text>';
      o += '<text x="' + W / 2 + '" y="' + (M + 182) + '" text-anchor="middle" font-family="\'Comic Neue\', sans-serif" font-weight="700" font-size="17" letter-spacing="3" fill="#cfe9da">UMA HQ DE FÃ EM 8 PÁGINAS</text>';
      o += caption(M + 40, H - M - 150, 420, "A origem do maior vilão da Marvel — antes de ele chegar aos cinemas.", { fs: 18 });
      o += '<g transform="translate(' + (W - M - 150) + "," + (H - M - 140) + ') rotate(-8)"><circle r="62" fill="#ff4433" stroke="#050505" stroke-width="4"/><text text-anchor="middle" y="-6" font-family="Bangers, Impact, sans-serif" font-size="24" fill="#fff">DE FÃ</text><text text-anchor="middle" y="22" font-family="Bangers, Impact, sans-serif" font-size="24" fill="#fff">PARA FÃ</text></g>';
      o += '<text x="' + (M + 40) + '" y="' + (H - M - 24) + '" font-family="\'Comic Neue\', sans-serif" font-weight="700" font-size="13" fill="#9fb8aa">ROTEIRO E ARTE ORIGINAIS • PERSONAGENS © MARVEL • SEM FINS LUCRATIVOS</text>';
      return o;
    }
  });

  /* PÁG. 1 — LATVÉRIA ------------------------------------------------- */
  pages.push({
    title: "Latvéria",
    panels: [[M, M, W - M * 2, 430], [M, M + 430 + G, 360, 330], [M + 360 + G, M + 430 + G, W - M * 2 - 360 - G, 330], [M, M + 760 + G * 2, W - M * 2, H - M * 2 - 760 - G * 2]],
    art: [
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.lin([[0, "#06121c"], [0.6, "#0d2a2a"], [1, "#163a2c"]]));
        o += stars(w, h * 0.6, 70, 4);
        o += '<circle cx="' + f(w * 0.78) + '" cy="90" r="46" fill="#e9fff4"/><circle cx="' + f(w * 0.78 + 14) + '" cy="82" r="42" fill="#0b1f24" opacity=".25"/>';
        o += mountains(w, h * 0.7, 230, "#0d1e1d", 12, 6) + snowcaps(w, h * 0.7, 230, 12, 6);
        o += mountains(w, h * 0.85, 140, "#08130f", 31, 9);
        o += castle(w * 0.62, h * 0.66, 1.15, "#030806", "#f1d65a");
        o += rect(0, h * 0.86, w, h * 0.2, "#030806");
        for (var i = 0; i < 9; i++) o += '<path d="M' + (30 + i * 46) + " " + f(h - 20) + " l20 -26 l20 26 v28 h-40 Z" + '" fill="#050a08"/><rect x="' + (44 + i * 46) + '" y="' + f(h - 12) + '" width="8" height="9" fill="#ff9b3a" opacity=".8"/>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.rad([[0, "#1d6b45"], [1, "#03120a"]], 0.5, 0.4, 0.8));
        o += runes(w / 2, h * 0.38, 110, "#2dff8a");
        o += '<circle cx="' + w / 2 + '" cy="' + f(h * 0.38) + '" r="140" fill="' + ctx.rad([[0, "#2dff8a", 0.45], [1, "#2dff8a", 0]]) + '"/>';
        o += person(w / 2, h + 10, 300, { fill: "#020605", cloak: 1.2, hood: true, rim: "#2dff8a", rimDx: -4 });
        o += '<path d="M' + f(w / 2 - 70) + " " + f(h * 0.62) + " Q" + f(w / 2 - 120) + " " + f(h * 0.4) + " " + f(w / 2 - 60) + " " + f(h * 0.3) + '" stroke="#2dff8a" stroke-width="4" fill="none" opacity=".8"/>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.lin([[0, "#9fb2bd"], [1, "#e5eef2"]]));
        var r = rng(77);
        for (var i = 0; i < 120; i++) { var x = r() * w, y = r() * h; o += '<line x1="' + f(x) + '" y1="' + f(y) + '" x2="' + f(x - 18) + '" y2="' + f(y + 30) + '" stroke="#ffffff" stroke-width="2" opacity=".8"/>'; }
        o += '<path d="M0 ' + f(h * 0.78) + " Q" + f(w * 0.5) + " " + f(h * 0.7) + " " + w + " " + f(h * 0.8) + " L" + w + " " + h + " L0 " + h + ' Z" fill="#f7fbfd"/>';
        o += person(w * 0.5, h * 0.86, 220, { fill: "#1a2328", cloak: 1, lean: 0.08 });
        o += person(w * 0.5 + 18, h * 0.66, 70, { fill: "#1a2328" });
        o += '<path d="M' + f(w * 0.2) + " " + f(h * 0.9) + " l40 -6 l40 4" + '" stroke="#7b8b93" stroke-width="3" fill="none"/>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, "#030806");
        o += rect(0, 0, w, h, ctx.dots("#2dff8a", 1.2, 8), ' opacity=".18"');
        o += '<rect x="0" y="' + f(h * 0.32) + '" width="' + w + '" height="' + f(h * 0.36) + '" fill="#0a1a12"/>';
        o += '<path d="M' + f(w * 0.12) + " " + f(h * 0.5) + " Q" + f(w * 0.25) + " " + f(h * 0.36) + " " + f(w * 0.38) + " " + f(h * 0.5) + " Q" + f(w * 0.25) + " " + f(h * 0.62) + " " + f(w * 0.12) + " " + f(h * 0.5) + ' Z" fill="#e9f1ec"/>';
        o += '<circle cx="' + f(w * 0.25) + '" cy="' + f(h * 0.5) + '" r="' + f(h * 0.1) + '" fill="#0f5132"/><circle cx="' + f(w * 0.25) + '" cy="' + f(h * 0.5) + '" r="' + f(h * 0.05) + '" fill="#000"/><circle cx="' + f(w * 0.23) + '" cy="' + f(h * 0.47) + '" r="' + f(h * 0.02) + '" fill="#2dff8a"/>';
        o += '<path d="M' + f(w * 0.62) + " " + f(h * 0.5) + " Q" + f(w * 0.75) + " " + f(h * 0.36) + " " + f(w * 0.88) + " " + f(h * 0.5) + " Q" + f(w * 0.75) + " " + f(h * 0.62) + " " + f(w * 0.62) + " " + f(h * 0.5) + ' Z" fill="#e9f1ec"/>';
        o += '<circle cx="' + f(w * 0.75) + '" cy="' + f(h * 0.5) + '" r="' + f(h * 0.1) + '" fill="#0f5132"/><circle cx="' + f(w * 0.75) + '" cy="' + f(h * 0.5) + '" r="' + f(h * 0.05) + '" fill="#000"/><circle cx="' + f(w * 0.73) + '" cy="' + f(h * 0.47) + '" r="' + f(h * 0.02) + '" fill="#2dff8a"/>';
        o += '<path d="M' + f(w * 0.08) + " " + f(h * 0.33) + " L" + f(w * 0.4) + " " + f(h * 0.39) + " M" + f(w * 0.92) + " " + f(h * 0.33) + " L" + f(w * 0.6) + " " + f(h * 0.39) + '" stroke="#000" stroke-width="10"/>';
        return o;
      }
    ],
    text: function (P) {
      var p = this.panels, o = "";
      o += caption(p[0][0] + 16, p[0][1] + 16, 330, "Latvéria. Um pequeno reino nas montanhas do Leste Europeu.");
      o += caption(p[1][0] + 12, p[1][1] + 12, 300, "Cynthia, a mãe de Victor, era feiticeira. Para proteger seu povo, fez um pacto com Mefisto — e perdeu a alma.", { fs: 15 });
      o += caption(p[2][0] + 12, p[2][1] + 12, p[2][2] - 24, "Werner, o pai, fugiu com o filho pela neve. Não sobreviveu ao inverno.", { fs: 15 });
      o += balloon(p[3][0] + 250, p[3][1] + 22, 250, "Eu vou trazê-la de volta. Nem que eu precise dobrar o próprio inferno.", p[3][0] + 380, p[3][1] + 120);
      return o;
    }
  });

  /* PÁG. 2 — UNIVERSIDADE / ACIDENTE ---------------------------------- */
  pages.push({
    title: "Universidade Empire State",
    panels: [[M, M, W - M * 2, 330], [M, M + 330 + G, 330, 400], [M + 330 + G, M + 330 + G, W - M * 2 - 330 - G, 400], [M, M + 730 + G * 2, W - M * 2, H - M * 2 - 730 - G * 2]],
    art: [
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.lin([[0, "#f2b36b"], [1, "#f6dfb6"]]));
        o += '<rect x="' + f(w * 0.15) + '" y="40" width="' + f(w * 0.7) + '" height="' + f(h * 0.55) + '" fill="#c6884b"/>';
        o += '<polygon points="' + f(w * 0.1) + ",45 " + f(w * 0.5) + ",0 " + f(w * 0.9) + ',45" fill="#a86d36"/>';
        for (var i = 0; i < 8; i++) o += '<rect x="' + f(w * 0.18 + i * (w * 0.64 / 8)) + '" y="58" width="16" height="' + f(h * 0.5) + '" fill="#f6dfb6"/>';
        o += rect(0, h * 0.72, w, h * 0.3, "#8a5a2c");
        o += person(w * 0.28, h, 250, { fill: "#2b1d12" });
        o += person(w * 0.5, h, 270, { fill: "#16202b" });
        o += person(w * 0.72, h, 240, { fill: "#2b1d12", bulk: 1.5 });
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, "#1d2a24");
        o += '<rect x="20" y="30" width="' + (w - 40) + '" height="170" fill="#0d1612" stroke="#6b4a2a" stroke-width="8"/>';
        var r = rng(5);
        for (var i = 0; i < 8; i++) o += '<path d="M' + (36 + r() * 30) + " " + (52 + i * 18) + " q" + f(30 + r() * 60) + " -8 " + f(80 + r() * 140) + ' 0" stroke="#e7efe9" stroke-width="2" fill="none" opacity=".75"/>';
        o += '<text x="' + (w - 90) + '" y="120" font-family="Bangers, sans-serif" font-size="34" fill="#ff4433">ERRO?</text>';
        o += person(w * 0.35, h + 6, 240, { fill: "#16202b", lean: -0.05 });
        o += '<path d="M' + f(w * 0.4) + " " + f(h - 160) + " L" + f(w * 0.72) + " " + f(h - 225) + '" stroke="#16202b" stroke-width="12" stroke-linecap="round"/>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.rad([[0, "#fff6c2"], [0.35, "#ffb12b"], [0.8, "#e8380d"], [1, "#4a0a02"]], 0.5, 0.45, 0.8));
        o += rays(w / 2, h * 0.45, 70, 420, "#fff", 4, 9);
        o += burst(w / 2, h * 0.45, 70, 170, 14, "#fff6c2", "#050505", 4);
        o += person(w * 0.5, h + 20, 210, { fill: "#050505", lean: -0.15 });
        o += krackle(w / 2, h * 0.45, 150, 22, 8, "#ff7a1a");
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.lin([[0, "#1b1f24"], [1, "#07090b"]]));
        for (var i = 0; i < 40; i++) o += '<line x1="' + (i * 22) + '" y1="0" x2="' + (i * 22 - 60) + '" y2="' + h + '" stroke="#5f7380" stroke-width="2" opacity=".4"/>';
        o += '<rect x="' + f(w * 0.08) + '" y="' + f(h * 0.12) + '" width="' + f(w * 0.3) + '" height="' + f(h * 0.6) + '" fill="#2a3138"/>';
        o += person(w * 0.7, h + 10, 230, { fill: "#030405", cloak: 1.1 });
        o += '<path d="M' + f(w * 0.7 - 16) + " " + f(h - 214) + " h32 v20 h-32 Z" + '" fill="#e9f1ec"/>';
        return o;
      }
    ],
    text: function () {
      var p = this.panels, o = "";
      o += caption(p[0][0] + 14, p[0][1] + 14, 300, "Anos depois, uma bolsa leva Victor aos Estados Unidos.", { fs: 16 });
      o += balloon(p[0][0] + 420, p[0][1] + 28, 260, "Então você é o tal Richards. O gênio.", p[0][0] + 380, p[0][1] + 150);
      o += balloon(p[1][0] + 30, p[1][1] + 220, 220, "Victor, seus cálculos estão errados. Isso vai explodir!", p[1][0] + 120, p[1][1] + 300, { fs: 15 });
      o += sfx(p[2][0] + 40, p[2][1] + 110, "KA-BUUUM!", 74, -10, "#fff6c2");
      o += caption(p[2][0] + 14, p[2][1] + p[2][3] - 90, p[2][2] - 28, "A máquina deveria alcançar o além. Alcançou o rosto de Victor.", { fs: 15 });
      o += caption(p[3][0] + 16, p[3][1] + 16, 360, "Expulso da universidade, Victor culpa Reed. Nunca a si mesmo.", { fs: 16 });
      o += balloon(p[3][0] + 430, p[3][1] + 24, 250, "Isso não acabou, Richards.", p[3][0] + 520, p[3][1] + 120);
      return o;
    }
  });

  /* PÁG. 3 — TIBETE / A MÁSCARA --------------------------------------- */
  pages.push({
    title: "A máscara",
    panels: [[M, M, W - M * 2, 300], [M, M + 300 + G, W - M * 2, 300], [M, M + 600 + G * 2, 340, H - M * 2 - 600 - G * 2], [M + 340 + G, M + 600 + G * 2, W - M * 2 - 340 - G, H - M * 2 - 600 - G * 2]],
    art: [
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.lin([[0, "#3b5b7a"], [1, "#c4d6e2"]]));
        o += mountains(w, h * 0.75, 220, "#5c7486", 51, 5) + snowcaps(w, h * 0.75, 220, 51, 5);
        o += mountains(w, h * 0.95, 120, "#2e4352", 9, 8);
        var mx = w * 0.3, my = h * 0.78;
        o += '<g fill="#14100c"><rect x="' + f(mx - 60) + '" y="' + f(my - 40) + '" width="120" height="40"/><path d="M' + f(mx - 80) + " " + f(my - 40) + " L" + f(mx) + " " + f(my - 80) + " L" + f(mx + 80) + " " + f(my - 40) + ' Z"/><rect x="' + f(mx - 36) + '" y="' + f(my - 110) + '" width="72" height="34"/><path d="M' + f(mx - 52) + " " + f(my - 108) + " L" + f(mx) + " " + f(my - 140) + " L" + f(mx + 52) + " " + f(my - 108) + ' Z"/></g>';
        o += '<rect x="' + f(mx - 8) + '" y="' + f(my - 30) + '" width="16" height="22" fill="#ffb12b"/>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.rad([[0, "#ff8a1f"], [0.6, "#5a1606"], [1, "#120403"]], 0.5, 0.6, 0.8));
        o += flames(w * 0.1, h, w * 0.8, h * 0.45, 4);
        o += '<path d="M' + f(w * 0.38) + " " + f(h * 0.72) + " h" + f(w * 0.24) + " l-20 30 h" + f(-w * 0.24 + 40) + ' Z" fill="#141414"/><rect x="' + f(w * 0.36) + '" y="' + f(h * 0.66) + '" width="' + f(w * 0.28) + '" height="22" fill="#262626"/>';
        o += mask(ctx, w * 0.5, h * 0.48, 0.7, { hot: true, eye: "#2a0700" });
        o += person(w * 0.15, h + 20, 270, { fill: "#2a0d05", cloak: 1, rim: "#ffb12b", rimDx: 3 });
        o += person(w * 0.85, h + 20, 270, { fill: "#2a0d05", cloak: 1, rim: "#ffb12b", rimDx: -3 });
        o += '<path d="M' + f(w * 0.2) + " " + f(h * 0.42) + " L" + f(w * 0.42) + " " + f(h * 0.3) + '" stroke="#141414" stroke-width="16" stroke-linecap="round"/><rect x="' + f(w * 0.4) + '" y="' + f(h * 0.22) + '" width="50" height="34" fill="#141414" transform="rotate(-25 ' + f(w * 0.42) + " " + f(h * 0.3) + ')"/>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, "#120403");
        o += mask(ctx, w * 0.5, h * 0.42, 1.25, { hot: true, eye: "#2a0700" });
        o += '<path d="M' + f(w * 0.05) + " " + f(h) + " Q" + f(w * 0.12) + " " + f(h * 0.5) + " " + f(w * 0.22) + " " + f(h * 0.36) + " L" + f(w * 0.3) + " " + f(h * 0.44) + " Q" + f(w * 0.22) + " " + f(h * 0.62) + " " + f(w * 0.25) + " " + f(h) + ' Z" fill="#0a0a0a"/>';
        o += '<path d="M' + f(w * 0.95) + " " + f(h) + " Q" + f(w * 0.88) + " " + f(h * 0.5) + " " + f(w * 0.78) + " " + f(h * 0.36) + " L" + f(w * 0.7) + " " + f(h * 0.44) + " Q" + f(w * 0.78) + " " + f(h * 0.62) + " " + f(w * 0.75) + " " + f(h) + ' Z" fill="#0a0a0a"/>';
        var r = rng(3);
        for (var i = 0; i < 14; i++) o += '<path d="M' + f(w * 0.3 + r() * w * 0.4) + " " + f(h * 0.2) + " q" + f((r() - 0.5) * 40) + " -40 " + f((r() - 0.5) * 20) + ' -80" stroke="#d9d0c4" stroke-width="3" fill="none" opacity=".5"/>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, "#010302");
        o += '<circle cx="' + f(w / 2) + '" cy="' + f(h * 0.48) + '" r="' + f(h * 0.55) + '" fill="' + ctx.rad([[0, "#2dff8a", 0.5], [1, "#2dff8a", 0]]) + '"/>';
        o += mask(ctx, w / 2, h * 0.52, 1.35, { hood: true });
        return o;
      }
    ],
    text: function () {
      var p = this.panels, o = "";
      o += caption(p[0][0] + 14, p[0][1] + 14, 280, "Nos Himalaias, um mosteiro esquecido.", { fs: 16 });
      o += caption(p[1][0] + 14, p[1][1] + 14, 300, "Monges o ajudam a forjar uma armadura. Ele exige uma máscara.", { fs: 16 });
      o += sfx(p[1][0] + p[1][2] - 300, p[1][1] + 95, "TANG! TANG!", 50, 8, "#ffd34d");
      o += balloon(p[2][0] + 30, p[2][1] + 20, 230, "Não vou esperar esfriar.", p[2][0] + 150, p[2][1] + 140, { fs: 16 });
      o += sfx(p[2][0] + 40, p[2][1] + p[2][3] - 40, "TSSSSSS", 46, -6, "#ffb12b");
      o += caption(p[3][0] + 14, p[3][1] + p[3][3] - 96, p[3][2] - 28, "Victor morreu ali. Nasceu o Doutor Destino.", { fs: 18, bg: "#0f3d24", fg: "#e9fff4" });
      return o;
    }
  });

  /* PÁG. 4 — O REI / MEFISTO ------------------------------------------ */
  pages.push({
    title: "O rei da Latvéria",
    panels: [[M, M, W - M * 2, 480], [M, M + 480 + G, 360, 300], [M + 360 + G, M + 480 + G, W - M * 2 - 360 - G, 300], [M, M + 780 + G * 2, W - M * 2, H - M * 2 - 780 - G * 2]],
    art: [
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.lin([[0, "#0a1410"], [1, "#122a1d"]]));
        for (var i = 0; i < 4; i++) {
          var bx = w * 0.12 + i * w * 0.255;
          o += '<rect x="' + f(bx - 24) + '" y="0" width="48" height="' + f(h * 0.7) + '" fill="#061009"/>';
          o += '<path d="M' + f(bx - 34) + " 30 h68 v170 l-34 -26 l-34 26 Z" + '" fill="#0f5132" stroke="#d4ae5b" stroke-width="3"/>';
        }
        o += rect(0, h * 0.78, w, h * 0.22, "#050b08");
        o += '<path d="M' + f(w * 0.36) + " " + f(h * 0.82) + " L" + f(w * 0.36) + " " + f(h * 0.22) + " Q" + f(w * 0.5) + " " + f(h * 0.06) + " " + f(w * 0.64) + " " + f(h * 0.22) + " L" + f(w * 0.64) + " " + f(h * 0.82) + ' Z" fill="#1a1a14" stroke="#d4ae5b" stroke-width="4"/>';
        o += doom(ctx, w * 0.5, h * 0.84, 300, { cloak: 1.6 });
        for (var j = 0; j < 3; j++) {
          o += person(w * (0.12 + j * 0.08), h, 220, { fill: "#0f3d24", eyes: "#2dff8a", bulk: 1.2 });
          o += person(w * (0.88 - j * 0.08), h, 220, { fill: "#0f3d24", eyes: "#2dff8a", bulk: 1.2 });
        }
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, "#0d4fa8");
        o += rect(0, 0, w, h, ctx.dots("#4fc3ff", 2.2, 10), ' opacity=".5"');
        o += rays(w * 0.5, h * 0.5, 40, 400, "#cfe9ff", 3, 12);
        o += '<circle cx="' + f(w * 0.5) + '" cy="' + f(h * 0.5) + '" r="70" fill="#fff" stroke="#050505" stroke-width="6"/><text x="' + f(w * 0.5) + '" y="' + f(h * 0.5 + 34) + '" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="100" fill="#0d4fa8">4</text>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.rad([[0, "#ff5a1f"], [0.6, "#6b0a05"], [1, "#120202"]], 0.7, 0.5, 0.8));
        o += flames(0, h, w, h * 0.5, 12);
        o += person(w * 0.75, h + 30, 300, { fill: "#2a0202", cloak: 1.5, horns: true, eyes: "#ffd34d" });
        o += person(w * 0.25, h + 20, 220, { fill: "#4e5a5f", cloak: 1.1, cloakFill: "#0d3d24", hood: true, hoodFill: "#0d3d24", rim: "#2dff8a" });
        o += '<path d="M' + f(w * 0.3) + " " + f(h * 0.45) + " Q" + f(w * 0.5) + " " + f(h * 0.3) + " " + f(w * 0.65) + " " + f(h * 0.4) + '" stroke="#2dff8a" stroke-width="6" fill="none"/>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.lin([[0, "#fff8e0"], [1, "#d9c27a"]]));
        o += rays(w / 2, h * 1.1, 60, 600, "#ffffff", 5, 33);
        o += person(w * 0.5, h * 0.95, 220, { fill: "#f6f0d8", cloak: 1.3, rim: "#d4ae5b" });
        o += person(w * 0.15, h + 20, 240, { fill: "#4e5a5f", cloak: 1.3, cloakFill: "#0d3d24", hood: true, hoodFill: "#0d3d24" });
        return o;
      }
    ],
    text: function () {
      var p = this.panels, o = "";
      o += caption(p[0][0] + 16, p[0][1] + 16, 330, "Ele voltou para casa, derrubou o regime e coroou a si mesmo.", { fs: 16 });
      o += balloon(p[0][0] + 430, p[0][1] + 40, 260, "A Latvéria agora pertence a Destino.", p[0][0] + 400, p[0][1] + 190, { doom: true });
      o += caption(p[1][0] + 12, p[1][1] + p[1][3] - 74, p[1][2] - 24, "1962: estreia contra o Quarteto Fantástico, por Stan Lee e Jack Kirby.", { fs: 14 });
      o += balloon(p[2][0] + 20, p[2][1] + 16, 230, "Todo ano, Mefisto. Até eu vencer.", p[2][0] + 80, p[2][1] + 130, { doom: true, fs: 15 });
      o += caption(p[3][0] + 16, p[3][1] + 16, 380, "E um dia ele venceu: com a ajuda do Doutor Estranho, libertou a alma da mãe.", { fs: 16 });
      return o;
    }
  });

  /* PÁG. 5 — GUERRAS SECRETAS ----------------------------------------- */
  pages.push({
    title: "Guerras Secretas",
    panels: [[M, M, 360, 400], [M + 360 + G, M, W - M * 2 - 360 - G, 400], [M, M + 400 + G, W - M * 2, 470], [M, M + 870 + G * 2, W - M * 2, H - M * 2 - 870 - G * 2]],
    art: [
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.rad([[0, "#ffe9a8"], [0.4, "#8a4cff"], [1, "#12052b"]], 0.5, 0.35, 0.85));
        o += rays(w / 2, h * 0.35, 60, 500, "#fff6c2", 3, 2);
        o += krackle(w / 2, h * 0.35, 150, 30, 14, "#b28cff");
        o += doom(ctx, w / 2, h + 10, 300, { rim: "#ffe9a8" });
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, "#05030d") + stars(w, h, 80, 41);
        o += '<circle cx="' + f(w / 2) + '" cy="' + f(h * 0.52) + '" r="150" fill="' + ctx.rad([[0, "#ffe9a8", 0.35], [1, "#ffe9a8", 0]]) + '"/>';
        var cols = ["#2d6b3f", "#8a5a2c", "#3b5b7a", "#7a2a2a", "#c4a24a", "#3a2a6b", "#2a7a6b"], r = rng(9);
        o += '<clipPath id="' + ctx.P + '_bw"><circle cx="' + f(w / 2) + '" cy="' + f(h * 0.52) + '" r="120"/></clipPath><g clip-path="url(#' + ctx.P + '_bw)">';
        for (var i = 0; i < 7; i++) for (var j = 0; j < 7; j++) o += '<rect x="' + f(w / 2 - 120 + i * 34 + (j % 2) * 10) + '" y="' + f(h * 0.52 - 120 + j * 34) + '" width="36" height="36" fill="' + cols[Math.floor(r() * cols.length)] + '"/>';
        o += '</g><circle cx="' + f(w / 2) + '" cy="' + f(h * 0.52) + '" r="120" fill="none" stroke="#ffe9a8" stroke-width="3"/>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.lin([[0, "#1a0f2e"], [0.5, "#4d2a12"], [1, "#0b0705"]]));
        o += rays(w * 0.6, h * 0.3, 50, 700, "#ffd34d", 3, 19);
        o += '<path d="M' + f(w * 0.4) + " " + f(h * 0.95) + " L" + f(w * 0.43) + " " + f(h * 0.1) + " L" + f(w * 0.77) + " " + f(h * 0.1) + " L" + f(w * 0.8) + " " + f(h * 0.95) + ' Z" fill="#2a1a0a" stroke="#d4ae5b" stroke-width="6"/>';
        o += doom(ctx, w * 0.6, h * 0.95, 380, { rim: "#ffd34d", cloak: 1.8 });
        o += person(w * 0.15, h, 140, { fill: "#0d1b3a", rim: "#4fc3ff" });
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, "#0b0705");
        o += '<path d="M0 ' + f(h * 0.5) + " L" + f(w * 0.3) + " " + f(h * 0.45) + " L" + f(w * 0.42) + " " + f(h * 0.6) + " L" + f(w * 0.6) + " " + f(h * 0.4) + " L" + f(w * 0.8) + " " + f(h * 0.55) + " L" + w + " " + f(h * 0.48) + '" stroke="#ffd34d" stroke-width="5" fill="none"/>';
        o += '<path d="M' + f(w * 0.42) + " " + f(h * 0.6) + " L" + f(w * 0.46) + " " + f(h) + " M" + f(w * 0.6) + " " + f(h * 0.4) + " L" + f(w * 0.55) + ' 0" stroke="#ffd34d" stroke-width="3" fill="none"/>';
        return o;
      }
    ],
    text: function () {
      var p = this.panels, o = "";
      o += caption(p[0][0] + 12, p[0][1] + 12, 320, "1984: Destino rouba o poder de um ser onipotente, o Beyonder.", { fs: 15 });
      o += caption(p[1][0] + 12, p[1][1] + 12, p[1][2] - 24, "2015: o multiverso morre. Ele junta os destroços num planeta só: o Mundo Bélico.", { fs: 14 });
      o += balloon(p[2][0] + 30, p[2][1] + 30, 260, "Eu salvei o que restou. Eu sou Deus.", p[2][0] + 420, p[2][1] + 150, { doom: true });
      o += balloon(p[2][0] + 40, p[2][1] + 260, 200, "Se fosse eu no seu lugar…", p[2][0] + 115, p[2][1] + 360, { fs: 15 });
      o += balloon(p[3][0] + 240, p[3][1] + 24, 300, "…você teria feito melhor.", p[3][0] + 600, p[3][1] - 40, { doom: true });
      return o;
    }
  });

  /* PÁG. 6 — DESTINO HOJE --------------------------------------------- */
  pages.push({
    title: "Destino hoje",
    panels: [[M, M, W - M * 2, 400], [M, M + 400 + G, 340, 360], [M + 340 + G, M + 400 + G, W - M * 2 - 340 - G, 360], [M, M + 760 + G * 2, W - M * 2, H - M * 2 - 760 - G * 2]],
    art: [
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.lin([[0, "#3a0d0a"], [1, "#0d0a06"]]));
        o += rays(w * 0.5, h * 0.55, 60, 700, "#ffb12b", 3, 4);
        o += person(w * 0.5, h + 40, 420, { fill: "#a3221a", bulk: 1.35, cloak: 1.6, cloakFill: "#0d3d24", rim: "#ffd34d" });
        var hy = h + 40 - 420 + 420 * 0.072;
        o += '<rect x="' + f(w * 0.5 - 20) + '" y="' + f(hy - 4) + '" width="40" height="8" fill="#9fffd0"/>';
        o += '<circle cx="' + f(w * 0.5) + '" cy="' + f(h + 40 - 420 * 0.7) + '" r="20" fill="#9fffd0"/><circle cx="' + f(w * 0.5) + '" cy="' + f(h + 40 - 420 * 0.7) + '" r="36" fill="#9fffd0" opacity=".25"/>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, "#06030f");
        o += runes(w / 2, h / 2, 140, "#b28cff") + runes(w / 2, h / 2, 90, "#2dff8a");
        o += mask(ctx, w / 2, h / 2, 0.55, { hood: true });
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, "#02060a") + stars(w, h, 60, 88);
        o += planet(ctx, w * 0.5, h * 0.56, 120, "#4fa3ff", "#0d3a6b", 3);
        o += '<g transform="translate(' + f(w * 0.5) + "," + f(h * 0.56) + ') scale(.5) translate(-100,-120)" opacity=".75"><path d="M60 40 Q100 18 140 40 L150 118 Q150 172 128 204 L100 220 L72 204 Q50 172 50 118 Z" fill="#2dff8a"/></g>';
        o += '<rect x="20" y="20" width="' + (w - 40) + '" height="' + (h - 40) + '" fill="none" stroke="#2dff8a" stroke-width="2" stroke-dasharray="8 6"/>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, "#0a0f0c");
        for (var i = 0; i < 6; i++) {
          var x = 20 + i * ((w - 40) / 6);
          o += '<rect x="' + f(x + 6) + '" y="40" width="' + f((w - 40) / 6 - 12) + '" height="' + f(h - 80) + '" fill="#0f3d24" stroke="#2dff8a" stroke-width="2"/>';
          o += mask(ctx, x + (w - 40) / 12, h * 0.5, 0.42, {});
        }
        return o;
      }
    ],
    text: function () {
      var p = this.panels, o = "";
      o += caption(p[0][0] + p[0][2] - 330, p[0][1] + 16, 314, "2016: com Tony Stark fora de combate, Destino veste a armadura do Homem de Ferro.", { fs: 16 });
      o += caption(p[1][0] + 12, p[1][1] + p[1][3] - 64, p[1][2] - 24, "2024: torna-se o Mago Supremo.", { fs: 15 });
      o += caption(p[2][0] + 12, p[2][1] + 12, p[2][2] - 24, "2025: Um mundo sob Destino.", { fs: 15 });
      o += balloon(p[3][0] + 160, p[3][1] + 22, 440, "Cidadãos da Terra: a era dos heróis acabou. Começa a era de Destino.", p[3][0] + 380, p[3][1] + 150, { doom: true, fs: 16 });
      return o;
    }
  });

  /* PÁG. 7 — O FILME --------------------------------------------------- */
  pages.push({
    title: "Dezembro de 2026",
    panels: [[M, M, W - M * 2, 420], [M, M + 420 + G, 330, 330], [M + 330 + G, M + 420 + G, W - M * 2 - 330 - G, 330], [M, M + 750 + G * 2, W - M * 2, H - M * 2 - 750 - G * 2]],
    art: [
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.lin([[0, "#3a0505"], [0.6, "#7a1208"], [1, "#1a0303"]]));
        o += stars(w, h * 0.7, 40, 6, "#ffd0c0");
        o += planet(ctx, w * 0.34, h * 0.48, 130, "#4fa3ff", "#0d3a6b", 7, "#ff4433");
        o += planet(ctx, w * 0.68, h * 0.44, 110, "#ffcf6b", "#7a3a0d", 2, "#ff4433");
        o += '<path d="M' + f(w * 0.46) + " " + f(h * 0.4) + " L" + f(w * 0.5) + " " + f(h * 0.47) + " L" + f(w * 0.48) + " " + f(h * 0.5) + " L" + f(w * 0.56) + " " + f(h * 0.46) + '" stroke="#fff" stroke-width="4" fill="none"/>';
        o += mountains(w, h * 0.98, 90, "#120202", 70, 10);
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.lin([[0, "#0e1620"], [1, "#05080b"]]));
        o += '<g stroke="#e5eef2" stroke-width="5" fill="none"><rect x="' + f(w * 0.2) + '" y="' + f(h * 0.55) + '" width="' + f(w * 0.6) + '" height="' + f(h * 0.25) + '"/>';
        for (var i = 1; i < 8; i++) o += '<line x1="' + f(w * 0.2 + i * w * 0.075) + '" y1="' + f(h * 0.55) + '" x2="' + f(w * 0.2 + i * w * 0.075) + '" y2="' + f(h * 0.8) + '"/>';
        o += "</g>";
        o += '<circle cx="' + f(w * 0.5) + '" cy="' + f(h * 0.62) + '" r="26" fill="#ffe0b8"/><circle cx="' + f(w * 0.5) + '" cy="' + f(h * 0.62) + '" r="60" fill="#4fc3ff" opacity=".22"/>';
        o += '<path d="M' + f(w * 0.05) + " 0 L" + f(w * 0.4) + " 0 Q" + f(w * 0.45) + " " + f(h * 0.4) + " " + f(w * 0.28) + " " + f(h) + " L" + f(w * 0.05) + " " + f(h) + ' Z" fill="#06120b"/>';
        o += '<rect x="' + f(w * 0.3) + '" y="' + f(h * 0.3) + '" width="20" height="6" fill="#2dff8a"/>';
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, ctx.lin([[0, "#1a0303"], [1, "#050202"]]));
        var cols = ["#3d7bff", "#d7dde0", "#a072ff", "#4fc3ff", "#ffc629", "#ff8a1f"];
        for (var i = 0; i < 9; i++) o += person(30 + i * ((w - 60) / 8), h + 10, 150 + (i % 3) * 22, { fill: "#050505", rim: cols[i % cols.length], rimDx: i % 2 ? 3 : -3, cloak: i === 4 ? 1 : 0 });
        return o;
      },
      function (ctx, w, h) {
        var o = rect(0, 0, w, h, "#010302");
        o += rect(0, 0, w, h, ctx.dots("#2dff8a", 1.3, 9), ' opacity=".2"');
        o += '<circle cx="' + f(w * 0.78) + '" cy="' + f(h * 0.55) + '" r="200" fill="' + ctx.rad([[0, "#2dff8a", 0.45], [1, "#2dff8a", 0]]) + '"/>';
        o += mask(ctx, w * 0.78, h * 0.6, 0.95, { hood: true });
        return o;
      }
    ],
    text: function () {
      var p = this.panels, o = "";
      o += caption(p[0][0] + 16, p[0][1] + 16, 360, "Dezembro de 2026. O céu fica vermelho. O multiverso está colapsando.", { fs: 16, bg: "#ff4433", fg: "#fff" });
      o += caption(p[1][0] + 12, p[1][1] + 12, p[1][2] - 24, "Ele já sabe onde está o poder.", { fs: 15 });
      o += caption(p[2][0] + 12, p[2][1] + 12, p[2][2] - 24, "Três universos. Heróis que nunca se viram.", { fs: 15 });
      o += '<text x="' + (p[3][0] + 30) + '" y="' + (p[3][1] + 90) + '" font-family="Cinzel, Georgia, serif" font-weight="900" font-size="40" fill="#e9f1ec">UMA DECISÃO</text>';
      o += '<text x="' + (p[3][0] + 30) + '" y="' + (p[3][1] + 140) + '" font-family="Cinzel, Georgia, serif" font-weight="900" font-size="40" fill="#2dff8a">IMPENSÁVEL.</text>';
      o += '<text x="' + (p[3][0] + 30) + '" y="' + (p[3][1] + 200) + '" font-family="\'Comic Neue\', sans-serif" font-weight="700" font-size="18" fill="#cfe9da">VINGADORES: DOUTOR DESTINO • 17/12 NOS CINEMAS</text>';
      o += '<text x="' + (p[3][0] + 30) + '" y="' + (p[3][1] + 260) + '" font-family="Bangers, Impact, sans-serif" font-size="44" fill="#f1d65a">FIM?</text>';
      return o;
    }
  });

  /* ------------------------------------------------------------- render */
  function renderPage(i, prefix, viewBox, opts) {
    opts = opts || {};
    var pg = pages[i], ctx = new Ctx(prefix), body = "";
    body += rect(0, 0, W, H, "#f4efe2");
    if (pg.cover) {
      var r = pg.panels[0];
      body += '<svg x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" viewBox="0 0 ' + r[2] + " " + r[3] + '" overflow="hidden">' + pg.draw(ctx) + "</svg>";
      body += '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" fill="none" stroke="#050505" stroke-width="6"/>';
    } else {
      pg.panels.forEach(function (r, j) {
        body += '<svg x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" viewBox="0 0 ' + r[2] + " " + r[3] + '" overflow="hidden">' + pg.art[j](ctx, r[2], r[3]) + "</svg>";
        body += '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" fill="none" stroke="#050505" stroke-width="6"/>';
      });
    }
    if (!opts.noText) body += pg.text.call(pg, ctx.P);
    if (!pg.cover && !opts.noText) body += '<text x="' + (W - M) + '" y="' + (H - 8) + '" text-anchor="end" font-family="\'Comic Neue\', sans-serif" font-weight="700" font-size="13" fill="#6b6455">' + i + "/" + (pages.length - 1) + "</text>";
    var vb = viewBox || ("0 0 " + W + " " + H);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" class="cm-page" role="img" aria-label="Página ' + i + ': ' + esc(pg.title) + '"><defs>' + ctx.defs.join("") + "</defs>" + body + "</svg>";
  }
  function renderPanel(i, j, prefix, opts) {
    var r = pages[i].panels[j];
    return renderPage(i, prefix, r.join(" "), opts);
  }

  window.DoomComic = {
    title: "DESTINO #1 — uma HQ de fã",
    width: W, height: H,
    pages: pages,
    count: pages.length,
    renderPage: renderPage,
    renderPanel: renderPanel,
    mask: function (prefix, opts) {
      var ctx = new Ctx(prefix), g = mask(ctx, 100, 120, 1, opts || { hood: true });
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -12 200 268" aria-hidden="true"><defs>' + ctx.defs.join("") + "</defs>" + g + "</svg>";
    }
  };
})();
