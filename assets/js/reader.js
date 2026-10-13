/* ==========================================================================
   Leitor de quadrinhos
   - DESTINO #1 (SVG) e as HQs de fã com arte em imagem (assets/comics/*):
     página inteira ou painel a painel (guided view)
   - Arquivos do próprio leitor: .cbz/.zip (descompactados no navegador) ou imagens
   Nada é enviado para servidor algum.
   ========================================================================== */
(function () {
  "use strict";
  var dlg, view, thumbs, slider, pageLabel, titleEl, btnGuided, btnZoom;
  var src = null;      // { kind: 'comic'|'hq'|'images', id, def, title, count, pages:[url] }
  var page = 0, guided = false, step = 0, zoom = false, busy = false;
  var spot = { x: 0, y: 0, w: 800, h: 1200 };
  var pan = { x: 0, y: 0 };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var STORE = "doom.reader.page";

  function $(id) { return document.getElementById(id); }
  function hasGsap() { return typeof window.gsap !== "undefined"; }

  /* --------------------------------------------------------- ZIP / CBZ */
  function readZip(file) {
    return file.arrayBuffer().then(function (ab) {
      var buf = new Uint8Array(ab), dv = new DataView(ab), eocd = -1;
      for (var i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
        if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
      }
      if (eocd < 0) throw new Error("Arquivo .cbz inválido.");
      var n = dv.getUint16(eocd + 10, true), p = dv.getUint32(eocd + 16, true), out = [], td = new TextDecoder();
      for (var k = 0; k < n; k++) {
        if (dv.getUint32(p, true) !== 0x02014b50) break;
        var method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
        var nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true);
        var lho = dv.getUint32(p + 42, true), name = td.decode(buf.subarray(p + 46, p + 46 + nl));
        out.push({ name: name, method: method, csize: csize, lho: lho });
        p += 46 + nl + el + cl;
      }
      var imgs = out.filter(function (e) { return /\.(jpe?g|png|webp|gif|avif)$/i.test(e.name) && !/(^|\/)__MACOSX\//.test(e.name); });
      imgs.sort(function (a, b) { return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }); });
      if (!imgs.length) throw new Error("Nenhuma imagem encontrada no arquivo.");
      return Promise.all(imgs.map(function (e) {
        var nl2 = dv.getUint16(e.lho + 26, true), el2 = dv.getUint16(e.lho + 28, true);
        var start = e.lho + 30 + nl2 + el2, data = buf.subarray(start, start + e.csize);
        var type = /png$/i.test(e.name) ? "image/png" : /webp$/i.test(e.name) ? "image/webp" : /gif$/i.test(e.name) ? "image/gif" : /avif$/i.test(e.name) ? "image/avif" : "image/jpeg";
        if (e.method === 0) return URL.createObjectURL(new Blob([data], { type: type }));
        if (e.method !== 8) throw new Error("Compressão não suportada em " + e.name);
        if (typeof DecompressionStream === "undefined") throw new Error("Seu navegador não suporta descompactar .cbz. Tente extrair as imagens e abri-las.");
        var stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
        return new Response(stream).blob().then(function (b) { return URL.createObjectURL(new Blob([b], { type: type })); });
      }));
    });
  }

  /* ------------------------------------------------------------ render */
  // HQs com páginas e quadros conhecidos (a nossa e as de fã); arquivos do leitor são só imagens
  function paged() { return !!src && (src.kind === "comic" || src.kind === "hq"); }
  function hasCover() { return src.kind === "comic" || (src.kind === "hq" && !!src.def.pages[0].cover); }
  function pageMarkup(i, prefix) {
    if (src.kind === "comic") return window.DoomComic.renderPage(i, prefix + i);
    if (src.kind === "hq") return window.DoomHQ.renderPage(src.def, i, prefix + i);
    return '<img src="' + src.pages[i] + '" alt="Página ' + (i + 1) + '" draggable="false"' + (prefix === "th" ? ' loading="lazy"' : "") + ">";
  }
  function stepsFor(i) {
    if (src.kind === "comic") return window.DoomComic.pages[i].panels;
    if (src.kind === "hq") return window.DoomHQ.panels(src.def, i);
    return [];
  }
  function storeKey() { return src.kind === "hq" ? STORE + "." + src.id : STORE; }

  function render(dir) {
    var el = document.createElement("div");
    el.className = "rpage";
    el.innerHTML = pageMarkup(page, "rd");
    var svg = el.querySelector("svg");
    if (svg) {
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      var sp = document.createElementNS("http://www.w3.org/2000/svg", "path");
      sp.setAttribute("class", "rspot"); sp.setAttribute("fill-rule", "evenodd");
      svg.appendChild(sp);
    }
    var old = view.querySelector(".rpage");
    view.appendChild(el);
    pan = { x: 0, y: 0 }; applyZoom();
    if (old) {
      if (hasGsap() && !reduce) {
        gsap.to(old, { opacity: 0, xPercent: -10 * (dir || 1), duration: 0.28, ease: "power2.in", onComplete: function () { old.remove(); } });
        gsap.fromTo(el, { opacity: 0, xPercent: 12 * (dir || 1), rotateY: -10 * (dir || 1) }, { opacity: 1, xPercent: 0, rotateY: 0, duration: 0.55, ease: "power3.out" });
      } else old.remove();
    }
    if (guided) frameStep(true); else setSpot(null, true);
    updateUi();
  }

  function setSpot(r, instant) {
    var svg = view.querySelector(".rpage:last-child svg");
    if (!svg) return;
    var full = { x: 0, y: 0, w: 800, h: 1200 }, target = r ? { x: r[0] - 10, y: r[1] - 10, w: r[2] + 20, h: r[3] + 20 } : full;
    var apply = function () {
      // viewBox ajustado à proporção do palco para que o painel ocupe o máximo
      var vw = view.clientWidth || 1, vh = view.clientHeight || 1, ar = vw / vh, x = spot.x, y = spot.y, w = spot.w, h = spot.h;
      if (guided) { if (w / h > ar) { var nh = w / ar; y -= (nh - h) / 2; h = nh; } else { var nw = h * ar; x -= (nw - w) / 2; w = nw; } }
      svg.setAttribute("viewBox", x + " " + y + " " + w + " " + h);
      var sp = svg.querySelector(".rspot");
      if (sp) sp.setAttribute("d", guided ? "M-4000 -4000H4800V5200H-4000Z M" + spot.x + " " + spot.y + "h" + spot.w + "v" + spot.h + "h" + (-spot.w) + "Z" : "");
    };
    if (instant || !hasGsap() || reduce) { spot = target; apply(); return; }
    gsap.to(spot, { x: target.x, y: target.y, w: target.w, h: target.h, duration: 0.75, ease: "power3.inOut", onUpdate: apply, overwrite: true });
  }
  function frameStep(instant) {
    var panels = stepsFor(page);
    if (!panels.length) { setSpot(null, instant); return; }
    step = Math.max(0, Math.min(step, panels.length - 1));
    setSpot(panels[step], instant);
    updateUi();
  }

  function go(i, dir) {
    if (!src) return;
    i = Math.max(0, Math.min(src.count - 1, i));
    if (i === page && view.querySelector(".rpage")) return;
    page = i;
    if (paged()) try { localStorage.setItem(storeKey(), String(page)); } catch (e) {}
    render(dir);
  }
  function next() {
    if (guided && paged()) {
      var n = stepsFor(page).length;
      if (step < n - 1) { step++; frameStep(); return; }
      if (page < src.count - 1) { step = 0; go(page + 1, 1); }
      return;
    }
    if (page < src.count - 1) go(page + 1, 1);
  }
  function prev() {
    if (guided && paged()) {
      if (step > 0) { step--; frameStep(); return; }
      if (page > 0) { step = stepsFor(page - 1).length - 1; go(page - 1, -1); }
      return;
    }
    if (page > 0) go(page - 1, -1);
  }

  function setGuided(on) {
    if (!paged()) on = false;
    guided = on;
    dlg.classList.toggle("is-guided", guided);
    btnGuided.setAttribute("aria-pressed", String(guided));
    if (guided) { setZoom(false); step = 0; frameStep(); }
    else setSpot(null);
    updateUi();
  }
  function applyZoom() {
    var pg = view.querySelector(".rpage:last-child");
    if (!pg) return;
    pg.style.transform = zoom ? "translate(" + pan.x + "px," + pan.y + "px) scale(2)" : "";
  }
  function setZoom(on) {
    zoom = on && !guided;
    dlg.classList.toggle("is-zoom", zoom);
    btnZoom.setAttribute("aria-pressed", String(zoom));
    pan = { x: 0, y: 0 }; applyZoom();
  }

  function updateUi() {
    if (!src) return;
    var extra = guided && paged() && stepsFor(page).length > 1 ? " · painel " + (step + 1) + "/" + stepsFor(page).length : "";
    var cov = paged() && hasCover();
    pageLabel.textContent = (page === 0 && cov ? "Capa" : "Pág. " + (cov ? page : page + 1)) + " de " + (cov ? src.count - 1 : src.count) + extra;
    slider.max = String(src.count); slider.value = String(page + 1);
    Array.prototype.forEach.call(thumbs.children, function (t, i) { t.classList.toggle("is-on", i === page); t.setAttribute("aria-current", i === page ? "page" : "false"); });
    var on = thumbs.children[page];
    if (on && on.scrollIntoView) on.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
    $("rPrev").disabled = page === 0 && (!guided || step === 0);
    $("rNext").disabled = page === src.count - 1 && (!guided || step >= stepsFor(page).length - 1);
  }

  function buildThumbs() {
    thumbs.innerHTML = "";
    for (var i = 0; i < src.count; i++) {
      var b = document.createElement("button");
      b.className = "rthumb"; b.type = "button";
      b.setAttribute("aria-label", "Ir para a página " + (i + 1));
      b.innerHTML = pageMarkup(i, "th");
      (function (k) { b.addEventListener("click", function () { step = 0; go(k, k > page ? 1 : -1); }); })(i);
      thumbs.appendChild(b);
    }
  }

  function open(source, startAt) {
    src = source;
    titleEl.textContent = src.title;
    view.innerHTML = "";
    page = Math.max(0, Math.min(src.count - 1, startAt || 0));
    guided = false; zoom = false; step = 0;
    dlg.classList.remove("is-guided", "is-zoom");
    btnGuided.disabled = !paged();
    btnGuided.setAttribute("aria-pressed", "false"); btnZoom.setAttribute("aria-pressed", "false");
    buildThumbs();
    if (!dlg.open) { dlg.showModal(); document.dispatchEvent(new CustomEvent("doom:dialog", { detail: true })); }
    render(1);
    if (paged() && window.innerWidth < 760) setGuided(true);
  }

  /* ----------------------------------------------------------- eventos */
  function bind() {
    dlg = $("reader"); view = $("readerView"); thumbs = $("readerThumbs"); slider = $("rSlider");
    pageLabel = $("readerPage"); titleEl = $("readerTitle"); btnGuided = $("rGuided"); btnZoom = $("rZoom");
    if (!dlg) return;

    $("rNext").addEventListener("click", next);
    $("rPrev").addEventListener("click", prev);
    btnGuided.addEventListener("click", function () { setGuided(!guided); });
    btnZoom.addEventListener("click", function () { setZoom(!zoom); });
    $("rFull").addEventListener("click", function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (dlg.requestFullscreen) dlg.requestFullscreen().catch(function () {});
    });
    slider.addEventListener("input", function () { var v = +slider.value - 1; step = 0; go(v, v > page ? 1 : -1); });
    dlg.querySelector("[data-close]").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("close", function () {
      if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
      document.dispatchEvent(new CustomEvent("doom:dialog", { detail: false }));
    });
    dlg.addEventListener("keydown", function (e) {
      if (e.target && e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "g" || e.key === "G") setGuided(!guided);
      else if (e.key === "z" || e.key === "Z") setZoom(!zoom);
      else if (e.key === "f" || e.key === "F") $("rFull").click();
    });
    window.addEventListener("resize", function () { if (dlg.open && guided) frameStep(true); });

    // gestos: deslizar para virar, arrastar para mover no zoom, toque nas bordas
    var sx = 0, sy = 0, st = 0, dragging = false, base = { x: 0, y: 0 };
    view.addEventListener("pointerdown", function (e) { sx = e.clientX; sy = e.clientY; st = Date.now(); dragging = true; base = { x: pan.x, y: pan.y }; });
    view.addEventListener("pointermove", function (e) {
      if (!dragging || !zoom) return;
      pan.x = base.x + (e.clientX - sx); pan.y = base.y + (e.clientY - sy); applyZoom();
    });
    view.addEventListener("pointerup", function (e) {
      if (!dragging) return; dragging = false;
      var dx = e.clientX - sx, dy = e.clientY - sy, dt = Date.now() - st;
      if (zoom) return;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && dt < 700) { dx < 0 ? next() : prev(); return; }
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
        var r = view.getBoundingClientRect(), xr = (e.clientX - r.left) / r.width;
        if (xr > 0.66) next(); else if (xr < 0.33) prev();
      }
    });
    view.addEventListener("dblclick", function () { if (!guided) setZoom(!zoom); });
  }

  window.DoomReader = {
    openComic: function () {
      var start = 0;
      try { start = +(localStorage.getItem(STORE) || 0); } catch (e) {}
      open({ kind: "comic", title: window.DoomComic.title, count: window.DoomComic.count }, start >= window.DoomComic.count ? 0 : start);
    },
    // HQ de fã com arte em imagem: assets/comics/<id>/hq.json
    openHQ: function (id) {
      return window.DoomHQ.load(id).then(function (def) {
        var start = 0;
        try { start = +(localStorage.getItem(STORE + "." + id) || 0); } catch (e) {}
        open({ kind: "hq", id: id, def: def, title: def.full, count: def.pages.length }, start >= def.pages.length ? 0 : start);
      });
    },
    openFiles: function (files) {
      files = Array.prototype.slice.call(files || []);
      if (!files.length) return Promise.resolve();
      var zip = files.filter(function (f) { return /\.(cbz|zip)$/i.test(f.name); })[0];
      if (zip) {
        return readZip(zip).then(function (urls) { open({ kind: "images", title: zip.name.replace(/\.(cbz|zip)$/i, ""), count: urls.length, pages: urls }, 0); });
      }
      var imgs = files.filter(function (f) { return /^image\//.test(f.type); }).sort(function (a, b) { return a.name.localeCompare(b.name, undefined, { numeric: true }); });
      if (!imgs.length) return Promise.reject(new Error("Escolha um arquivo .cbz ou imagens."));
      open({ kind: "images", title: imgs.length + " páginas", count: imgs.length, pages: imgs.map(function (f) { return URL.createObjectURL(f); }) }, 0);
      return Promise.resolve();
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind); else bind();
})();
