/* ==========================================================================
   VINGADORES: DOUTOR DESTINO — orquestração do site
   Monta as seções a partir de window.DOOM e cuida de toda a animação.
   ========================================================================== */
(function () {
  "use strict";
  var D = window.DOOM, C = window.DoomComic;
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  var lenis = null;
  root.classList.add("js");
  if (reduce || !hasGsap) root.classList.add("no-motion");

  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function h(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function chan(key) { return D.channels.filter(function (c) { return c.key === key; })[0]; }
  var TAG_LABEL = { oficial: "Oficial", indicio: "Indício", rumor: "Rumor", hq: "HQ", teoria: "Teoria" };
  function tag(t) { return '<span class="tag tag--' + t + '">' + TAG_LABEL[t] + "</span>"; }
  function thumb(id, q) { return "https://i.ytimg.com/vi/" + id + "/" + (q || "hqdefault") + ".jpg"; }

  /* ===================================================================
     1. CONSTRUÇÃO DO CONTEÚDO
     =================================================================== */
  function clock(s) { var hh = Math.floor(s / 3600), mm = Math.floor(s / 60) % 60, ss = s % 60; return (hh ? hh + ":" + pad(mm) : mm) + ":" + pad(ss); }
  function castById(id) { return D.cast.filter(function (c) { return c.id === id; })[0]; }
  function credit(p) { return 'Foto: <a href="' + p[3] + '" target="_blank" rel="noopener">' + esc(p[1]) + '</a> · <a href="' + (D.licenseUrls[p[2]] || "#") + '" target="_blank" rel="noopener">' + esc(p[2]) + "</a>"; }
  // capas que vieram das edições brasileiras (as demais são as capas originais americanas)
  var PANINI = { "livros-de-destino": 1, "legado-de-destino": 1, "triunfo-e-tormento": 1, "guerras-secretas-1984": 1, "quarteto-hickman": 1, "tempo-esgotado": 1, "doutor-destino-2019": 1, "cacada-sangrenta": 1, "um-mundo-sob-destino": 1, "destino-2099": 1, "masmorras-de-destino": 1 };

  function build() {
    // marca e capa do livro
    $("#navMark").innerHTML = '<img src="assets/img/doom/doom-icon.webp" alt="" width="96" height="96">';
    $("#bookCoverArt").innerHTML = C.renderPage(0, "book");

    // as duas faces de Victor
    $("#faceCredit").textContent = "Quadrinhos: Alex Ross, capa variante Timeless (Marvel Comics, 2023) · Cinema: imagem promocional © Marvel Studios";

    // universos: cada Terra com a sua direção de arte e os seus heróis
    $("#universes").innerHTML = D.universes.map(function (u) {
      var art = u.faces.map(function (id, k) {
        var c = castById(id);
        return '<span class="uni__f" style="--k:' + k + '"><img src="assets/img/film/' + id + '.webp" alt="' + esc(c.name.split(" / ").pop()) + '" loading="lazy" decoding="async" width="660" height="880"></span>';
      }).join("");
      return '<article class="uni uni--u' + u.id + '" style="--c:' + u.color + '" data-reveal><div class="uni__art">' + art + '</div><div class="uni__txt"><p class="uni__k">' + esc(u.kicker) + '</p><h3 class="uni__id">' + esc(u.name) + '</h3><p class="uni__who">' + esc(u.who) + '</p><p class="uni__note">' + esc(u.note) + "</p></div></article>";
    }).join("");
    $("#facts").innerHTML = D.facts.map(function (f) { return "<div><dt>" + esc(f.k) + "</dt><dd>" + esc(f.v) + "</dd></div>"; }).join("");
    $("#glossary").innerHTML = D.glossary.map(function (g) { return "<div><dt>" + esc(g.t) + "</dt><dd>" + esc(g.d) + "</dd></div>"; }).join("");
    $("#timeline").innerHTML = D.timeline.map(function (t) { return "<li><time>" + esc(t.d) + "</time><h4>" + esc(t.t) + "</h4><p>" + esc(t.x) + "</p></li>"; }).join("");
    $("#doomFile").innerHTML = D.doomFile.map(function (f) { return "<div><dt>" + esc(f.k) + "</dt><dd>" + esc(f.v) + "</dd></div>"; }).join("");

    // capítulos: capa (ou foto) de cada fase da vida de Destino + o trecho dela no Recap oficial
    var R = D.recap;
    $("#chaptersTrack").innerHTML = D.chapters.map(function (c, i) {
      var name = c.img.split("/").pop(), btn = "";
      if (c.recap != null) btn = '<button class="chapter__play" data-play="' + R.id + '" data-start="' + c.recap + '" data-title="' + esc(R.t) + '"><i>▶</i> Ver no Recap oficial · ' + clock(c.recap) + "</button>";
      else if (c.play) btn = '<button class="chapter__play" data-play="' + c.play + '" data-title="' + esc(c.playT) + '"><i>▶</i> ' + esc(c.playT) + "</button>";
      return '<article class="chapter" data-i="' + i + '"><figure class="chapter__art" style="background-image:url(assets/img/blur/' + name + ')"><img src="' + c.img + '" alt="" loading="lazy" decoding="async"><figcaption>' + esc(c.credit) + '</figcaption></figure><div class="chapter__txt"><p class="chapter__n">' + c.n + '</p><p class="chapter__y">' + esc(c.y) + "</p><h3>" + esc(c.t) + '</h3><p class="chapter__x">' + esc(c.x) + "</p>" + btn + "</div></article>";
    }).join("");
    $("#chapterTotal").textContent = pad(D.chapters.length);

    // Recap oficial: o vídeo de 1h20 já reúne as 3 partes; os capítulos viram atalhos
    $("#recapTitle").textContent = R.h; $("#recapNote").textContent = R.note; $("#recapDur").textContent = R.dur;
    $("#recapThumb").dataset.play = R.id; $("#recapThumb").dataset.title = R.t;
    $("#recapList").innerHTML = R.chapters.map(function (c) {
      return '<li><button data-play="' + R.id + '" data-start="' + c[1] + '" data-title="' + esc(R.t + " — " + c[0]) + '"><time>' + clock(c[1]) + "</time><span>" + esc(c[0].replace("Destino contra", "Contra")) + "</span><i>▶</i></button></li>";
    }).join("");

    // aliados
    $("#allies").innerHTML = D.allies.map(function (a) {
      return '<article class="ally" style="--conf:' + a.conf + '" data-reveal><div class="ally__tags">' + a.tags.map(tag).join("") + "</div><h3>" + esc(a.name) + '</h3><div class="ally__conf"><span>Chance de estar com Destino</span><span>' + a.conf + "%</span><i><b></b></i></div><dl><div><dt>O que vimos</dt><dd>" + esc(a.seen) + '</dd></div><div><dt>Como chega ao lado dele</dt><dd class="ally__how">' + esc(a.how) + "</dd></div><div><dt>Nos quadrinhos</dt><dd>" + esc(a.comics) + "</dd></div></dl></article>";
    }).join("");
    $("#rumors").innerHTML = D.rumors.map(function (r) {
      return '<li><p>' + esc(r.c) + "<small>" + esc(r.src) + '</small></p><div class="meter" style="--v:' + r.cred + '"><span>credibilidade ' + r.cred + "%</span><i><b></b></i></div></li>";
    }).join("");

    // heróis
    var tabs = '<button role="tab" aria-selected="true" data-team="all" style="--c:var(--ink)">Todos <span class="n">' + D.cast.length + "</span></button>";
    tabs += D.teams.map(function (t) {
      var n = D.cast.filter(function (c) { return c.team === t.id; }).length;
      return '<button role="tab" aria-selected="false" data-team="' + t.id + '" style="--c:' + t.color + '">' + esc(t.name) + ' <span class="n">' + n + "</span></button>";
    }).join("");
    $("#teamTabs").innerHTML = tabs;
    $("#teams").innerHTML = D.teams.map(function (t) {
      var uni = D.universes.filter(function (u) { return u.id === t.uni; })[0];
      var cards = D.cast.filter(function (c) { return c.team === t.id; }).map(function (c) {
        return '<button class="hero-card" data-cast="' + c.id + '" style="--c:' + t.color + '" aria-label="' + esc(c.name + " — " + c.actor + ". Ver dossiê") + '">' +
          '<span class="hero-card__media"><img class="hero-card__film" src="assets/img/film/' + c.id + '.webp" alt="" loading="lazy" decoding="async" width="660" height="880"><img class="hero-card__real" src="assets/img/cast/' + c.id + '.webp" alt="" loading="lazy" decoding="async" width="600" height="800"></span>' +
          (c.status !== "confirmado" ? '<span class="hero-card__status">' + tag("indicio") + "</span>" : "") +
          '<span class="hero-card__uni">' + esc(uni.name) + '</span><span class="hero-card__body"><span class="hero-card__name">' + esc(c.name) + '</span><span class="hero-card__actor"><img src="assets/img/cast/' + c.id + '.webp" alt="" loading="lazy" decoding="async" width="600" height="800">' + esc(c.actor) + '</span><span class="hero-card__role">' + esc(c.role) + "</span></span></button>";
      }).join("");
      return '<section class="team" data-team="' + t.id + '" style="--c:' + t.color + '"><header class="team__head"><h3><small>' + esc(uni.name) + "</small>" + esc(t.name) + "</h3><p>" + esc(t.desc) + '</p></header><div class="team__row">' + cards + "</div></section>";
    }).join("");
    $("#reported").innerHTML = D.reported.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("");

    // roteiro de HQs
    var stops = "", route = 0, step = 0;
    D.comics.forEach(function (c) {
      if (c.route !== route) {
        route = c.route;
        var r = D.routes[route - 1];
        stops += '<div class="route" data-reveal><p class="route__n">Rota ' + route + '</p><p class="route__t">' + esc(r.t) + '</p><p class="route__s">' + esc(r.s) + "</p></div>";
      }
      step++;
      var br = c.cover.filter(function (id) { return PANINI[id]; }).length, us = c.cover.length - br;
      var cap = br && us ? "Capas: Panini · Marvel" : br ? "Capa: Panini Comics" : "Capa original: Marvel";
      var imgs = c.cover.map(function (id, k) { return '<img src="assets/img/covers/' + id + '.webp" alt="' + (k ? "" : "Capa de " + esc(c.title)) + '" loading="lazy" decoding="async" width="600" height="908">'; }).join("");
      stops += '<article class="stop" data-reveal><figure class="cover' + (c.cover.length > 1 ? " cover--stack" : "") + '"><span class="cover__imgs">' + imgs + "</span><figcaption>" + cap + '</figcaption></figure><div class="stop__head"><div class="stop__meta"><span class="tier tier--' + c.tier + '">' + (c.tier === "bonus" ? "Bônus" : c.tier[0].toUpperCase() + c.tier.slice(1)) + "</span><small>Parada " + pad(step) + " · " + esc(c.year) + "</small></div><h3>" + esc(c.title) + '</h3><p class="stop__orig">' + esc(c.orig) + '</p><p class="stop__by">' + esc(c.by) + '</p></div><div class="stop__body"><p class="stop__why">' + esc(c.why) + '</p><div class="stop__br"><strong>Edição brasileira ' + (c.ok ? '<span class="ok-badge">✔ Panini</span>' : "") + "</strong>" + esc(c.br) + "</div></div></article>";
    });
    $("#roadStops").innerHTML = stops;
    $("#readLegal").innerHTML = D.readLegal.map(function (l) { return "<li>" + (l.free ? '<span class="free">De graça</span>' : "") + "<b>" + esc(l.t) + "</b><p>" + esc(l.d) + "</p>" + (l.url ? '<a href="' + l.url + '" target="_blank" rel="noopener">Conhecer ↗</a>' : "") + "</li>"; }).join("");

    // referências
    var cats = { trailer: "Trailers", encore: "Ultimato Encore", mcu: "MCU", bastidores: "Bastidores", quadrinhos: "Quadrinhos" };
    $("#refFilters").innerHTML = '<button role="tab" aria-selected="true" data-cat="all">Todas</button>' + Object.keys(cats).map(function (k) { return '<button role="tab" aria-selected="false" data-cat="' + k + '">' + cats[k] + "</button>"; }).join("");
    $("#refGrid").innerHTML = D.references.map(function (r, i) {
      return '<button class="ref" data-cat="' + r.cat + '" aria-pressed="false" data-reveal><span class="ref__inner"><span class="ref__face ref__front"><span class="ref__n">' + pad(i + 1) + '</span><span class="ref__seen">' + esc(r.seen) + '</span><span class="ref__cat">' + cats[r.cat] + '</span></span><span class="ref__face ref__back"><span class="ref__cat">A referência</span><span class="ref__ref">' + esc(r.ref) + '</span><span class="ref__x">' + esc(r.x) + "</span></span></span></button>";
    }).join("");

    // vídeos: canais
    $("#creators").innerHTML = D.channels.map(function (c) {
      return '<article class="creator" data-reveal><img src="' + c.img + '" alt="" width="56" height="56" loading="lazy"><div><h4>' + esc(c.name) + "</h4><small>" + esc(c.handle) + "</small><p>" + esc(c.d) + '</p><div class="creator__links"><a href="' + c.url + '" target="_blank" rel="noopener">Ver canal ↗</a><a class="sub" href="' + c.url + '?sub_confirmation=1" target="_blank" rel="noopener">Inscrever-se</a></div></div></article>';
    }).join("");
    $("#vidCats").innerHTML = '<button role="tab" aria-selected="true" data-vcat="all">Todos <span class="n">' + D.videos.length + "</span></button>" + D.videoCats.map(function (c) {
      var n = D.videos.filter(function (v) { return v.cat === c.id; }).length;
      return '<button role="tab" aria-selected="false" data-vcat="' + c.id + '">' + esc(c.t) + ' <span class="n">' + n + "</span></button>";
    }).join("");
    $("#vidChannels").innerHTML = '<button role="tab" aria-selected="true" data-vch="all">Todos os canais <span class="n"></span></button>' + D.channels.map(function (c) {
      return '<button role="tab" aria-selected="false" data-vch="' + c.key + '"><img src="' + c.img + '" alt="">' + esc(c.name) + ' <span class="n"></span></button>';
    }).join("");
    $("#vgrid").innerHTML = D.videos.map(function (v) {
      var c = chan(v.ch), cat = D.videoCats.filter(function (x) { return x.id === v.cat; })[0];
      return '<button class="vcard" data-id="' + v.id + '" data-cat="' + v.cat + '" data-ch="' + v.ch + '"><span class="vcard__thumb"><img src="' + thumb(v.id, "hqdefault") + '" alt="" loading="lazy" decoding="async" width="480" height="360"><span class="vcard__dur">' + v.dur + '</span><span class="vcard__cat">' + (v.cat === "rumores" ? tag("rumor") : '<span class="chip">' + esc(cat.t) + "</span>") + '</span></span><span class="vcard__meta"><img src="' + c.img + '" alt="" loading="lazy"><span><b>' + esc(v.t) + "</b><small>" + esc(c.name) + "</small></span></span></button>";
    }).join("");

    // FAQ e créditos
    $("#faqList").innerHTML = D.faq.map(function (f) { return "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>"; }).join("");
    $("#updated").textContent = D.updated;
    $("#sources").innerHTML = D.sources.map(function (s) { return '<li><a href="' + s.url + '" target="_blank" rel="noopener">' + esc(s.t) + "</a></li>"; }).join("");
    $("#channelCredits").innerHTML = D.channels.map(function (c) { return '<li><a href="' + c.url + '" target="_blank" rel="noopener">' + esc(c.name) + "</a> — " + esc(c.handle) + "</li>"; }).join("") + '<li><a href="https://www.youtube.com/@MarvelBR" target="_blank" rel="noopener">Marvel Brasil</a> — trailers oficiais</li>';
    $("#photoCredits").innerHTML = D.cast.map(function (c) {
      var p = D.photoCredits[c.id]; if (!p) return "";
      return "<li>" + esc(c.actor) + ': foto de <a href="' + p[2] + '" target="_blank" rel="noopener">' + esc(p[0]) + "</a>, " + '<a href="' + (D.licenseUrls[p[1]] || "#") + '" target="_blank" rel="noopener">' + esc(p[1]) + "</a></li>";
    }).join("");
  }

  /* ===================================================================
     2. CONTAGEM REGRESSIVA
     =================================================================== */
  var zone = store("doom.zone") || "br";
  function release() { return D.releases.filter(function (r) { return r.id === zone; })[0] || D.releases[0]; }
  function makeDigits(el, n) {
    if (el.children.length === n) return;
    el.innerHTML = "";
    for (var i = 0; i < n; i++) {
      var d = document.createElement("span"); d.className = "digit";
      d.innerHTML = '<span class="digit__strip">' + "0123456789".split("").map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</span>";
      el.appendChild(d);
    }
  }
  function setDigits(el, str) {
    makeDigits(el, str.length);
    Array.prototype.forEach.call(el.children, function (d, i) {
      d.firstChild.style.transform = "translateY(" + (-(+str[i]) * 1.02) + "em)";
    });
  }
  function tick() {
    var r = release(), target = new Date(r.date).getTime(), now = Date.now(), diff = Math.max(0, target - now);
    var days = Math.floor(diff / 864e5), hours = Math.floor(diff / 36e5) % 24, mins = Math.floor(diff / 6e4) % 60, secs = Math.floor(diff / 1e3) % 60;
    setDigits($('[data-unit="d"]'), days >= 100 ? String(days) : pad(days));
    setDigits($('[data-unit="h"]'), pad(hours));
    setDigits($('[data-unit="m"]'), pad(mins));
    setDigits($('[data-unit="s"]'), pad(secs));
    $("#navDays").textContent = days; $("#footDays").textContent = days;
    $("#contagem").classList.toggle("is-over", diff === 0);
    if (diff === 0) $("#cdTitle").textContent = "Destino chegou. Já nos cinemas.";
    var start = new Date(D.announced).getTime(), pct = Math.min(1, Math.max(0, (now - start) / (target - start)));
    $("#sinceBar").style.transform = "scaleX(" + pct + ")";
    $("#sincePct").textContent = (pct * 100).toFixed(1) + "% do caminho";
    if (secs === 0 || !$("#cdSr").textContent) $("#cdSr").textContent = "Faltam " + days + " dias, " + hours + " horas e " + mins + " minutos para a estreia no " + r.label + ".";
    var hand = $("#clockHand");
    if (hand) hand.setAttribute("transform", "rotate(" + (secs * 6) + ")");
    var arc = $("#clockArc");
    if (arc) arc.style.strokeDashoffset = String(1696 * (1 - pct));
    return days;
  }
  function buildCountdown() {
    $("#zones").innerHTML = D.releases.map(function (r) {
      return '<button role="tab" data-zone="' + r.id + '" aria-selected="' + (r.id === zone) + '">' + esc(r.label) + " · " + r.human.replace(" de 2026", "").replace(" de ", "/").replace("dezembro", "12") + "</button>";
    }).join("");
    $("#zones").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      zone = b.dataset.zone; store("doom.zone", zone);
      $$("#zones button").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
      whenText(); tick(); if (window.__calLinks) window.__calLinks();
    });
    function whenText() { var r = release(); $("#cdWhen").textContent = "Estreia no " + r.label + ": " + r.human + ". Contagem até 00h00 do horário local."; }
    whenText();

    // relógio de Latvéria
    var svg = $("#clockFace"), o = "", romans = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    o += '<circle r="290" fill="none" stroke="rgba(45,255,138,.18)" stroke-width="1"/><circle r="270" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="30"/>';
    o += '<circle id="clockArc" r="270" fill="none" stroke="rgba(45,255,138,.45)" stroke-width="2" stroke-dasharray="1696" stroke-dashoffset="1696" transform="rotate(-90)"/>';
    for (var i = 0; i < 60; i++) {
      var a = (i / 60) * Math.PI * 2, big = i % 5 === 0, r1 = big ? 248 : 258;
      o += '<line x1="' + (Math.sin(a) * r1).toFixed(1) + '" y1="' + (-Math.cos(a) * r1).toFixed(1) + '" x2="' + (Math.sin(a) * 282).toFixed(1) + '" y2="' + (-Math.cos(a) * 282).toFixed(1) + '" stroke="' + (big ? "rgba(233,241,236,.55)" : "rgba(233,241,236,.2)") + '" stroke-width="' + (big ? 2.5 : 1) + '"/>';
    }
    romans.forEach(function (rn, k) {
      var a = (k / 12) * Math.PI * 2;
      o += '<text x="' + (Math.sin(a) * 218).toFixed(1) + '" y="' + (-Math.cos(a) * 218 + 9).toFixed(1) + '" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="26" fill="rgba(233,241,236,.35)">' + rn + "</text>";
    });
    o += '<g id="clockHand" opacity=".55"><line y1="24" y2="-240" stroke="#2dff8a" stroke-width="1.2"/><circle r="5" fill="#2dff8a"/></g>';
    svg.innerHTML = o;

    // agenda: Google e Outlook abrem o evento já preenchido; Apple/iPhone e “baixar”
    // usam um .ics hospedado (o iOS só oferece “Adicionar ao Calendário” para arquivos
    // servidos por URL — um Blob baixado não abre a agenda, era esse o problema)
    var calBtn = $("#icsBtn"), calMenu = $("#calMenu");
    var ua = navigator.userAgent, isApple = /iPhone|iPad|iPod|Macintosh/.test(ua) && "ontouchend" in document || /iPhone|iPad|iPod/.test(ua), isAndroid = /Android/.test(ua);
    function calLinks() {
      var r = release(), d = r.date.slice(0, 10), d1 = d.replace(/-/g, ""), next = new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10) + 1));
      var d2 = next.toISOString().slice(0, 10), title = "Estreia de Vingadores: Doutor Destino";
      var details = "Vingadores: Doutor Destino estreia hoje nos cinemas (" + r.label + "). Guia do fã: " + location.href.split("#")[0];
      $("#calGoogle").href = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(title) + "&dates=" + d1 + "/" + d2.replace(/-/g, "") + "&details=" + encodeURIComponent(details) + "&location=" + encodeURIComponent("Cinemas");
      $("#calOutlook").href = "https://outlook.live.com/calendar/0/action/compose?rru=addevent&allday=true&subject=" + encodeURIComponent(title) + "&startdt=" + d + "&enddt=" + d2 + "&body=" + encodeURIComponent(details) + "&location=" + encodeURIComponent("Cinemas");
      var ics = "assets/cal/vingadores-doutor-destino-" + r.id + ".ics";
      $("#calApple").href = ics; $("#calIcs").href = ics;
    }
    window.__calLinks = calLinks;
    function setCal(open) {
      calLinks();
      calMenu.hidden = !open; calBtn.setAttribute("aria-expanded", String(open));
      if (open) {
        var first = isApple ? $("#calApple") : $("#calGoogle");
        calMenu.insertBefore(first, calMenu.firstChild);
        if (hasGsap && !reduce) gsap.fromTo(calMenu, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.3 });
        first.focus({ preventScroll: true });
      }
    }
    calBtn.addEventListener("click", function (e) { e.stopPropagation(); setCal(calMenu.hidden); });
    document.addEventListener("click", function (e) { if (!calMenu.hidden && !e.target.closest("#cal")) setCal(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !calMenu.hidden) { setCal(false); calBtn.focus(); } });
    calMenu.addEventListener("click", function (e) { if (e.target.closest("a")) setTimeout(function () { setCal(false); }, 50); });
    if (isAndroid) calMenu.insertBefore($("#calGoogle"), calMenu.firstChild);
    calLinks();
    $("#shareBtn").addEventListener("click", function () {
      var days = tick(), data = { title: "Vingadores: Doutor Destino", text: "Faltam " + days + " dias para Vingadores: Doutor Destino. O guia completo do fã:", url: location.href.split("#")[0] };
      var btn = this;
      if (navigator.share) navigator.share(data).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(data.text + " " + data.url).then(function () { btn.textContent = "Link copiado!"; setTimeout(function () { btn.textContent = "Compartilhar contagem"; }, 2200); });
    });

    tick();
    // alinha com a virada de segundo
    setTimeout(function () { tick(); setInterval(tick, 1000); }, 1000 - (Date.now() % 1000));

    var days = tick(), items = ["Destino chega em " + days + " dias", "17 · 12 · 2026", "Três universos", "Uma decisão impensável", "O inferno me obedece", "Victor Von Doom", "Vingadores: Guerras Secretas · 2027"];
    var row = items.map(function (t) { return "<span>" + esc(t) + "</span><i>◆</i>"; }).join("");
    $("#marquee").innerHTML = row + row + row;
  }

  /* ===================================================================
     3. INTERAÇÕES (sem depender de animação)
     =================================================================== */
  function interactions() {
    // menu mobile
    var burger = $("#burger"), menu = $("#menu");
    function setMenu(open) {
      burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      menu.hidden = !open;
      if (lenis) open ? lenis.stop() : lenis.start();
      if (open && hasGsap && !reduce) gsap.from($$("#menu a"), { y: 40, opacity: 0, stagger: 0.04, duration: 0.6, ease: "expo.out" });
    }
    burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) setMenu(false); });

    // âncoras com rolagem suave
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]'); if (!a) return;
      var id = a.getAttribute("href"); if (id.length < 2) return;
      var t = $(id); if (!t) return;
      e.preventDefault();
      if (!menu.hidden) setMenu(false);
      if (id === "#inicio") { lenis ? lenis.scrollTo(0) : window.scrollTo(0, 0); return; }
      if (lenis) lenis.scrollTo(t, { offset: -10, duration: 1.4 });
      else t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });

    // heróis: abas e dossiê
    $("#teamTabs").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      $$("#teamTabs button").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
      var t = b.dataset.team;
      $$(".team").forEach(function (s) { s.hidden = t !== "all" && s.dataset.team !== t; });
      if (hasGsap && !reduce) gsap.fromTo($$(".team:not([hidden]) .hero-card"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.6, ease: "expo.out" });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
    var dossie = $("#dossie");
    $("#teams").addEventListener("click", function (e) {
      var b = e.target.closest(".hero-card"); if (!b) return;
      var c = D.cast.filter(function (x) { return x.id === b.dataset.cast; })[0], t = D.teams.filter(function (x) { return x.id === c.team; })[0];
      var uni = D.universes.filter(function (u) { return u.id === t.uni; })[0], p = D.photoCredits[c.id];
      $("#dossieBox").innerHTML = '<figure class="dossie__img" style="--c:' + t.color + '"><img src="assets/img/film/' + c.id + '.webp" alt="' + esc(c.name) + ' em imagem promocional da Marvel" width="660" height="880"><figcaption>Imagem promocional © Marvel Studios</figcaption></figure>' +
        '<div class="dossie__body"><span class="tag ' + (c.status === "confirmado" ? "tag--oficial" : "tag--indicio") + '">' + (c.status === "confirmado" ? "Elenco confirmado" : "Esperado, não confirmado") + '</span><h2 id="dossieName">' + esc(c.name) + "</h2>" +
        '<div class="dossie__who"><img src="assets/img/cast/' + c.id + '.webp" alt="' + esc(c.actor) + '" width="600" height="800"><div><b>' + esc(c.actor) + "</b><span>" + esc(t.name) + " · " + esc(uni.name) + "</span>" + (p ? "<small>" + credit([0, p[0], p[1], p[2]]) + "</small>" : "") + "</div></div>" +
        '<dl><div class="dossie__role"><dt>Papel no filme</dt><dd>' + esc(c.role) + "</dd></div><div><dt>Último visto em</dt><dd>" + esc(c.last) + "</dd></div><div><dt>Por que importa em Doomsday</dt><dd>" + esc(c.why) + "</dd></div><div><dt>A equipe</dt><dd>" + esc(t.desc) + "</dd></div></dl></div>";
      dossie.showModal(); document.dispatchEvent(new CustomEvent("doom:dialog", { detail: true }));
    });
    dossie.addEventListener("close", function () { document.dispatchEvent(new CustomEvent("doom:dialog", { detail: false })); });
    dossie.addEventListener("click", function (e) { if (e.target === dossie || e.target.closest("[data-close]")) dossie.close(); });

    // referências
    $("#refGrid").addEventListener("click", function (e) {
      var b = e.target.closest(".ref"); if (!b) return;
      b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
    });
    $("#refFilters").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      $$("#refFilters button").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
      var c = b.dataset.cat;
      $$(".ref").forEach(function (r) { r.hidden = c !== "all" && r.dataset.cat !== c; if (!r.hidden) { r.style.opacity = 1; r.style.transform = "none"; } });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });

    // leitor
    $("#readBtn").addEventListener("click", function () { window.DoomReader.openComic(); });
    $("#bookBtn").addEventListener("click", function () { window.DoomReader.openComic(); });
    $("#cbzInput").addEventListener("change", function () {
      var input = this;
      window.DoomReader.openFiles(input.files).catch(function (err) { alert(err.message || "Não foi possível abrir o arquivo."); }).then(function () { input.value = ""; });
    });

    faceSlider();
    videos();
    watchlist();
    konami();

    // Lenis pausa enquanto houver um diálogo aberto. Observamos o atributo “open” em vez de
    // confiar só no evento “close”: no Chromium, um diálogo reaberto e fechado com Esc às
    // vezes fecha sem disparar “close” — e a página ficava sem rolar (e o vídeo, tocando).
    var dialogs = $$("dialog");
    function syncDialogs() {
      var any = dialogs.some(function (d) { return d.open; });
      if (lenis) any ? lenis.stop() : lenis.start();
      if (!$("#player").open && $("#playerFrame").firstChild) $("#playerFrame").innerHTML = "";
    }
    if (window.MutationObserver) { var mo = new MutationObserver(syncDialogs); dialogs.forEach(function (d) { mo.observe(d, { attributes: true, attributeFilter: ["open"] }); }); }
    document.addEventListener("doom:dialog", syncDialogs);
  }

  /* ------------------------------------------- as duas faces (comparador) */
  function faceSlider() {
    var stage = $("#faceStage"), range = $("#faceRange"), drag = false, sx = 0, sy = 0;
    function set(v) { v = Math.max(0, Math.min(100, +v)); stage.style.setProperty("--pos", v + "%"); range.value = Math.round(v); stage.classList.toggle("is-a", v > 70); stage.classList.toggle("is-b", v < 30); }
    function at(e) { var r = stage.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; }
    window.__faceSet = set;
    // o selo só gira enquanto o retrato está na tela
    if (window.IntersectionObserver) new IntersectionObserver(function (en) { $("#doomFace").classList.toggle("is-live", en[0].isIntersecting); }).observe(stage);
    set(reduce || !hasGsap ? 50 : 100);
    function touched() { window.__faceTouched = true; stage.classList.add("is-touched"); }
    range.addEventListener("input", function () { touched(); set(range.value); });
    // mouse: clicar ou arrastar em qualquer ponto; toque: só arrasto horizontal (o vertical continua rolando a página)
    stage.addEventListener("pointerdown", function (e) {
      if (e.button) return;
      drag = true; sx = e.clientX; sy = e.clientY;
      if (e.pointerType === "mouse") { touched(); set(at(e)); stage.setPointerCapture(e.pointerId); }
    });
    stage.addEventListener("pointermove", function (e) {
      if (!drag) return;
      if (e.pointerType !== "mouse" && !stage.hasPointerCapture(e.pointerId)) {
        if (Math.abs(e.clientX - sx) < 6 || Math.abs(e.clientX - sx) < Math.abs(e.clientY - sy)) return;
        stage.setPointerCapture(e.pointerId);
      }
      touched(); set(at(e));
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (t) { stage.addEventListener(t, function () { drag = false; }); });
  }

  /* -------------------------------------------------------------- vídeos */
  function videos() {
    var player = $("#player"), frame = $("#playerFrame"), lang = "dub", queue = [], qi = 0, featured = "trailer";
    var O = D.officialVideos;
    function officialItems() {
      return [{ key: "trailer", v: O.trailer }, { key: "special", v: O.special }].concat(O.teasers.map(function (t, i) { return { key: "t" + i, v: t }; }))
        .concat([{ key: "recap", v: { dub: O.recap.id, leg: O.recap.id, t: O.recap.t, dur: O.recap.dur } }, { key: "encore", v: { dub: O.encore.id, leg: O.encore.id, t: O.encore.t, dur: O.encore.dur } }]);
    }
    function itemId(v) { return v[lang] || v.dub; }
    function renderOfficial() {
      var items = officialItems(), cur = items.filter(function (x) { return x.key === featured; })[0] || items[0];
      var id = itemId(cur.v);
      var img = $("#featureImg");
      img.onerror = function () { img.onerror = null; img.src = thumb(id, "hqdefault"); };
      img.src = thumb(id, "maxresdefault");
      $("#featureTitle").textContent = cur.v.t;
      $("#featureThumb").dataset.id = id;
      $("#featureChapters").hidden = cur.key !== "recap";
      $("#officialList").innerHTML = items.map(function (x) {
        var vid = itemId(x.v);
        return '<li><button data-key="' + x.key + '" aria-current="' + (x.key === featured) + '"><img src="' + thumb(vid, "mqdefault") + '" alt="" loading="lazy"><span><b>' + esc(x.v.t) + "</b><small>" + x.v.dur + " · Marvel Brasil</small></span></button></li>";
      }).join("");
    }
    $("#featureChapterBtns").innerHTML = D.recap.chapters.map(function (c) {
      return '<button class="chip" data-play="' + D.recap.id + '" data-start="' + c[1] + '" data-title="' + esc(D.recap.t + " — " + c[0]) + '">' + clock(c[1]) + " · " + esc(c[0].replace("Destino contra ", "vs. ")) + "</button>";
    }).join("");
    renderOfficial();
    $$(".feature .seg button").forEach(function (b) {
      b.addEventListener("click", function () {
        lang = b.dataset.lang;
        $$(".feature .seg button").forEach(function (x) { x.setAttribute("aria-checked", String(x === b)); });
        renderOfficial();
      });
    });
    $("#officialList").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      featured = b.dataset.key; renderOfficial();
      var items = officialItems();
      queue = items.map(function (x) { return { id: itemId(x.v), t: x.v.t, ch: "marvel" }; });
      qi = items.map(function (x) { return x.key; }).indexOf(featured);
      play(queue[qi]);
    });
    $("#featureThumb").addEventListener("click", function () {
      var items = officialItems();
      queue = items.map(function (x) { return { id: itemId(x.v), t: x.v.t, ch: "marvel" }; });
      qi = Math.max(0, items.map(function (x) { return x.key; }).indexOf(featured));
      play(queue[qi]);
    });

    // filtros (categoria × canal) com contagens, estado vazio e “ver mais”
    var vcat = "all", vch = "all", expanded = false, LIM = window.innerWidth < 760 ? 6 : 12;
    function match(v, cat, ch) { return (cat === "all" || v.cat === cat) && (ch === "all" || v.ch === ch); }
    function count(cat, ch) { return D.videos.filter(function (v) { return match(v, cat, ch); }).length; }
    function filter(animate) {
      var total = 0, shownEls = [];
      $$(".vcard").forEach(function (c) {
        var ok = match(c.dataset, vcat, vch);
        if (ok) total++;
        var show = ok && (expanded || total <= LIM);
        c.hidden = !show;
        if (show) shownEls.push(c);
      });
      $$("#vidCats button").forEach(function (b) { var n = count(b.dataset.vcat, vch); b.querySelector(".n").textContent = n; b.classList.toggle("is-empty", !n); });
      $$("#vidChannels button").forEach(function (b) { var n = count(vcat, b.dataset.vch); b.querySelector(".n").textContent = n; b.classList.toggle("is-empty", !n); });
      var chName = vch === "all" ? "" : chan(vch).name, catName = vcat === "all" ? "" : D.videoCats.filter(function (x) { return x.id === vcat; })[0].t;
      $("#vEmpty").hidden = total > 0;
      $("#vEmptyText").textContent = "Nenhum vídeo " + (chName ? "do canal " + chName : "") + (catName ? " em “" + catName + "”" : "") + " por enquanto.";
      var rest = total - shownEls.length;
      $("#vMore").hidden = rest <= 0;
      $("#vMore").textContent = "Ver mais " + rest + " vídeo" + (rest > 1 ? "s" : "");
      $("#vCount").textContent = total ? "Mostrando " + shownEls.length + " de " + total + " vídeo" + (total > 1 ? "s" : "") : "";
      if (animate && hasGsap && !reduce) gsap.fromTo(shownEls, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.025, duration: 0.45, overwrite: true, clearProps: "transform,opacity,visibility" });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
    function pick(listSel, attr, val) { $$(listSel + " button").forEach(function (x) { x.setAttribute("aria-selected", String(x.dataset[attr] === val)); }); }
    $("#vidCats").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      vcat = b.dataset.vcat;
      if (!count(vcat, vch)) { vch = "all"; pick("#vidChannels", "vch", "all"); } // combinação vazia: libera o canal
      pick("#vidCats", "vcat", vcat); expanded = false; filter(true);
    });
    $("#vidChannels").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      vch = b.dataset.vch;
      if (!count(vcat, vch)) { vcat = "all"; pick("#vidCats", "vcat", "all"); }
      pick("#vidChannels", "vch", vch); expanded = false; filter(true);
    });
    $("#vMore").addEventListener("click", function () { expanded = true; filter(true); });
    $("#vReset").addEventListener("click", function () { vcat = "all"; vch = "all"; pick("#vidCats", "vcat", "all"); pick("#vidChannels", "vch", "all"); filter(true); });
    filter(false);
    $("#vgrid").addEventListener("click", function (e) {
      var b = e.target.closest(".vcard"); if (!b) return;
      var vis = $$(".vcard").filter(function (c) { return !c.hidden; });
      queue = vis.map(function (c) { var v = D.videos.filter(function (x) { return x.id === c.dataset.id; })[0]; return { id: v.id, t: v.t, ch: v.ch }; });
      qi = vis.indexOf(b);
      play(queue[qi]);
    });

    // botões soltos com data-play (ex.: hero)
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-play]"); if (!b) return;
      queue = [{ id: b.dataset.play, t: b.dataset.title, ch: b.dataset.ch || "marvel", start: +b.dataset.start || 0 }]; qi = 0; play(queue[0]);
    });

    function play(v) {
      if (!v) return;
      var c = v.ch === "marvel" ? { name: "Marvel Brasil", url: "https://www.youtube.com/@MarvelBR", img: "assets/img/favicon.svg" } : chan(v.ch);
      frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + v.id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1&hl=pt-BR' + (v.start ? "&start=" + v.start : "") + '" title="' + esc(v.t) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      $("#playerTitle").textContent = v.t;
      $("#playerCredit").innerHTML = "Vídeo de <b>" + esc(c.name) + "</b> · todos os direitos reservados ao canal";
      $("#playerAvatar").src = c.img;
      $("#playerYt").href = "https://www.youtube.com/watch?v=" + v.id + (v.start ? "&t=" + v.start + "s" : "");
      $("#playerSub").href = c.url + "?sub_confirmation=1";
      $("#playerNext").hidden = queue.length < 2;
      if (!player.open) { player.showModal(); document.dispatchEvent(new CustomEvent("doom:dialog", { detail: true })); }
    }
    $("#playerNext").addEventListener("click", function () { qi = (qi + 1) % queue.length; play(queue[qi]); });
    // um “close” atrasado (Chromium) não pode apagar o vídeo de um player que já reabriu
    player.addEventListener("close", function () { if (!player.open) frame.innerHTML = ""; document.dispatchEvent(new CustomEvent("doom:dialog", { detail: false })); });
    player.addEventListener("click", function (e) { if (e.target === player || e.target.closest("[data-close]")) player.close(); });
  }

  /* ------------------------------------------------------------ maratona */
  function watchlist() {
    var done = store("doom.watch") || {}, mode = store("doom.watchMode") || "oficial";
    var list = $("#watchList");
    list.innerHTML = D.watch.map(function (w) {
      return '<li class="witem" data-id="' + w.id + '" data-list="' + w.list + '" data-fast="' + !!w.fast + '"><span class="witem__n"></span><div><div class="witem__t">' + esc(w.t) + "<small>" + w.y + " · " + (w.m ? (w.m >= 300 ? "≈" + Math.round(w.m / 60) + "h" : w.m + " min") : "—") + "</small></div><p>" + esc(w.why) + '</p><div class="witem__tags">' + (w.list === "oficial" ? "<span>Coleção Disney+</span>" : '<span class="extra">Extra · ' + esc(w.where || "Disney+") + "</span>") + (w.fast ? '<span class="fast">Sem tempo</span>' : "") + '</div></div><label class="check"><input type="checkbox" aria-label="Já assisti ' + esc(w.t) + '"' + (done[w.id] ? " checked" : "") + "><span></span></label></li>";
    }).join("");
    function update() {
      var vis = 0, seen = 0, mins = 0, n = 0;
      $$(".witem", list).forEach(function (li) {
        var show = mode === "tudo" || (mode === "oficial" && li.dataset.list === "oficial") || (mode === "rapido" && li.dataset.fast === "true");
        li.hidden = !show;
        var w = D.watch.filter(function (x) { return x.id === li.dataset.id; })[0], on = !!done[w.id];
        li.classList.toggle("is-done", on);
        if (show) { vis++; n++; li.querySelector(".witem__n").textContent = pad(n); if (on) seen++; else if (w.m) mins += w.m; }
      });
      $("#watchCount").textContent = seen + "/" + vis;
      $("#watchHours").textContent = mins ? "≈" + (mins / 60).toFixed(1).replace(".", ",") + "h restantes" : "Pronto para o cinema!";
      $("#watchRing").style.strokeDashoffset = String(327 * (1 - (vis ? seen / vis : 0)));
      $$("#watchModes button").forEach(function (b) { b.setAttribute("aria-checked", String(b.dataset.mode === mode)); });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
    list.addEventListener("change", function (e) {
      var li = e.target.closest(".witem"); if (!li) return;
      done[li.dataset.id] = e.target.checked; store("doom.watch", done); update();
    });
    $("#watchModes").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      mode = b.dataset.mode; store("doom.watchMode", mode); update();
    });
    update();
  }

  /* -------------------------------------------------------------- konami */
  function konami() {
    var seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"], i = 0;
    document.addEventListener("keydown", function (e) {
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === seq[i] ? i + 1 : (k === seq[0] ? 1 : 0);
      if (i < seq.length) return;
      i = 0;
      document.body.classList.toggle("doom-mode");
      var el = $("#konami");
      if (hasGsap) gsap.timeline().to(el, { opacity: 1, duration: 0.25 }).from("#konami p", { scale: 1.6, duration: 0.6, ease: "expo.out" }, 0).to(el, { opacity: 0, duration: 0.6, delay: 1.4 });
    });
  }

  /* ===================================================================
     4. MOTION (GSAP + ScrollTrigger + Lenis)
     =================================================================== */
  function motion() {
    gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin, DrawSVGPlugin);
    gsap.defaults({ ease: "expo.out", duration: 1 });

    if (!reduce && window.Lenis) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // barra de progresso
    gsap.to("#progressBar", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 } });

    // nav: some ao descer, volta ao subir
    var nav = $("#nav");
    ScrollTrigger.create({
      start: "top -80", end: "max",
      onUpdate: function (self) {
        nav.classList.toggle("is-solid", self.scroll() > window.innerHeight * 0.6);
        nav.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > window.innerHeight * 3.5 && $("#menu").hidden);
      }
    });
    // link ativo
    $$(".nav__links a").forEach(function (a) {
      var s = $(a.getAttribute("href")); if (!s) return;
      ScrollTrigger.create({ trigger: s, start: "top 50%", end: "bottom 50%", onToggle: function (self) { a.classList.toggle("is-active", self.isActive); } });
    });

    intro();
    if (reduce) { road(true); incursao(true); return; }
    reveals();
    incursao();
    chapters();
    road();
    marquee();
    extras();
    ScrollTrigger.sort();
  }

  /* ----------------------------------------------------------- abertura */
  var geo = {};
  function intro() {
    var glOk = window.DoomGL && window.DoomGL.init($("#gl"));
    if (!glOk) root.classList.add("no-webgl");
    var mode = "", info = null;
    var st = { z: 0, inc: 0, zoom: 1, mask: 1 }, eIO = gsap.parseEase("power2.inOut"), eIn = gsap.parseEase("power2.in");
    function lerp(a, b, t) { return a + (b - a) * t; }
    function lerp2(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }
    function wantMode() { return window.innerHeight > window.innerWidth * 1.15 ? "portrait" : "landscape"; }

    // geometria em pixels CSS, relativa ao palco (que ocupa a viewport)
    function measure() {
      var w = window.innerWidth, hh = window.innerHeight, m = Math.min(w, hh), mob = w < 760;
      if (info) {
        var aspect = info.w / info.h;
        var rw = Math.min(w * 0.98, hh * (mode === "portrait" ? 0.8 : 0.82) * aspect), rh = rw / aspect;
        var rx = (w - rw) / 2, ry = (hh - rh) / 2 + hh * 0.025, k = rw / info.w;
        geo.rect = [rx, ry, rw, rh];
        geo.s1 = [rx + info.o1[0] * k, ry + info.o1[1] * k];
        geo.s2 = [rx + info.o2[0] * k, ry + info.o2[1] * k];
        geo.rHole = info.hole * k;
        geo.zoomMax = Math.max(w, hh) / (geo.rHole * 0.9) * 1.6;
      }
      geo.h1 = mob ? [w * 0.34, hh * 0.25] : [w * 0.7, hh * 0.42];
      geo.h2 = mob ? [w * 0.78, hh * 0.15] : [w * 0.9, hh * 0.22];
      geo.hr1 = m * (mob ? 0.2 : 0.17); geo.hr2 = m * (mob ? 0.13 : 0.11);
      geo.c1 = mob ? [w * 0.42, hh * 0.24] : [w * 0.74, hh * 0.4];
      var dx = geo.h2[0] - geo.h1[0], dy = geo.h2[1] - geo.h1[1], dl = Math.sqrt(dx * dx + dy * dy) || 1, gap = (geo.hr1 + geo.hr2) * 0.72;
      geo.c2 = [geo.c1[0] + dx / dl * gap, geo.c1[1] + dy / dl * gap];
      if (!geo.s1) { geo.s1 = geo.h1; geo.s2 = geo.h2; geo.rHole = geo.hr1; geo.rect = [0, 0, 1, 1]; geo.zoomMax = 30; }
    }
    function apply() {
      if (!glOk) return;
      var z = eIO(st.z), i = st.inc, ie = eIn(i);
      var p1 = lerp2(geo.s1, geo.h1, z), p2 = lerp2(geo.s2, geo.h2, z);
      window.DoomGL.set({
        p1: lerp2(p1, geo.c1, ie), p2: lerp2(p2, geo.c2, ie),
        r1: lerp(geo.rHole, geo.hr1, z), r2: lerp(geo.rHole * 0.92, geo.hr2, z), inc: i,
        zoom: st.zoom, zoomO: geo.s2, maskOn: st.mask, rect: geo.rect
      });
    }
    function rebuild() {
      var m = wantMode();
      if (!glOk || m === mode) { measure(); apply(); return Promise.resolve(); }
      mode = m;
      return window.DoomGL.buildMask(m).then(function (inf) { info = inf; measure(); apply(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
    }
    measure(); apply();
    var ready = rebuild();
    // o pin do ScrollTrigger só assume o tamanho novo da janela no “refresh” (depois do resize):
    // só então o canvas tem as medidas certas
    if (glOk) ScrollTrigger.addEventListener("refresh", function () { window.DoomGL.resize(); measure(); apply(); });

    if (reduce || !glOk) {
      st.z = 1; st.inc = 0.25; st.mask = 0; st.zoom = 1; apply();
      gsap.set(["#introPre", "#introCue"], { autoAlpha: 0 }); gsap.set("#hero", { autoAlpha: 1 });
      return ready;
    }

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: "#inicio", start: "top top", end: function () { return "+=" + Math.round(window.innerHeight * (window.innerWidth < 760 ? 2.4 : 3)); },
        pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        onRefresh: function () { measure(); apply(); }
      }
    });
    // pausa o WebGL só quando a abertura saiu inteira da tela (a contagem encostou no topo)
    ScrollTrigger.create({ trigger: "#contagem", start: "top top", end: "max", onToggle: function (self) { window.DoomGL.pause(self.isActive); } });
    tl.to(["#introPre", "#introCue"], { autoAlpha: 0, y: -30, duration: 0.08 }, 0)
      .to(st, { zoom: function () { return geo.zoomMax; }, duration: 0.42, ease: "power3.in" }, 0)
      .to(st, { z: 1, duration: 0.42 }, 0)
      .to(st, { mask: 0, duration: 0.08 }, 0.36)
      .fromTo("#hero", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.44)
      .from(".hero__eyebrow, .hero__pre, .hero__tag, .hero__meta, .hero__cta", { y: 50, autoAlpha: 0, stagger: 0.02, duration: 0.12, ease: "power3.out" }, 0.44)
      .from("#heroMain", { yPercent: 30, autoAlpha: 0, scale: 0.94, duration: 0.16, ease: "power3.out" }, 0.46)
      .to("#incursion", { autoAlpha: 1, duration: 0.05 }, 0.62)
      .to(st, { inc: 1, duration: 0.36, ease: "power1.in" }, 0.62)
      .to("#incursionBar", { scaleX: 1, duration: 0.36 }, 0.62)
      .to("#hero", { y: -40, duration: 0.36 }, 0.62);
    // a cena acompanha a timeline (inclusive durante o “scrub”, depois que a rolagem para)
    var pct = $("#incursionPct"), lastPct = -1;
    tl.eventCallback("onUpdate", function () {
      apply();
      var v = Math.round(st.inc * 100); if (v !== lastPct) { lastPct = v; pct.textContent = v + "%"; }
    });
    var rt;
    window.addEventListener("resize", function () {
      measure(); apply(); // imediato: planetas e máscara acompanham a janela sem atraso
      clearTimeout(rt); rt = setTimeout(rebuild, 160);
    });
    return ready;
  }

  /* ------------------------------------------------------------ reveals */
  function reveals() {
    // títulos com SplitText (linhas mascaradas)
    $$("[data-split]").forEach(function (el) {
      SplitText.create(el, {
        type: "lines,words", mask: "lines", autoSplit: true, linesClass: "split-line",
        onSplit: function (self) {
          return gsap.from(self.words, { yPercent: 115, rotate: 4, stagger: 0.05, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 86%", once: true } });
        }
      });
    });
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 90%", once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, stagger: 0.07, duration: 1.1, ease: "expo.out", overwrite: true }); }
    });
    // medidores de confiança dos aliados e do radar
    $$(".ally__conf b, .meter b").forEach(function (b) {
      gsap.from(b, { scaleX: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: b, start: "top 92%", once: true } });
    });
    // as duas faces: a cortina passa dos quadrinhos para o cinema quando o retrato entra na tela
    var face = { v: 100 };
    gsap.timeline({ scrollTrigger: { trigger: "#doomFace", start: "top 70%", once: true } })
      .fromTo("#faceStage", { clipPath: "inset(12% 12% 12% 12% round 22px)", autoAlpha: 0 }, { clipPath: "inset(0% 0% 0% 0% round 22px)", autoAlpha: 1, duration: 1.4, ease: "expo.out" })
      .from("#faceSigil", { autoAlpha: 0, duration: 1.8, ease: "power2.out" }, 0.2)
      .to(face, { v: 50, duration: 2.2, ease: "expo.inOut", onUpdate: function () { if (!window.__faceTouched) window.__faceSet(face.v); } }, 0.5);
    gsap.fromTo("#faceB, #faceA", { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "#doomFace", start: "top bottom", end: "bottom top", scrub: true } });
    // contagem: entrada dos dígitos
    gsap.from(".unit", { y: 80, autoAlpha: 0, stagger: 0.1, duration: 1.3, scrollTrigger: { trigger: "#digits", start: "top 85%", once: true } });
    gsap.to("#clockFace", { rotate: 25, ease: "none", scrollTrigger: { trigger: "#contagem", start: "top bottom", end: "bottom top", scrub: true } });
    // rodapé
    gsap.from(".footer__big", { yPercent: 40, autoAlpha: 0, duration: 1.6, scrollTrigger: { trigger: ".footer", start: "top 90%", once: true } });
  }

  /* --------------------------------------------- capítulos horizontais */
  function chapters() {
    var mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", function () {
      var track = $("#chaptersTrack"), wrap = $("#chapters"), total = D.chapters.length, last = 0, now = $("#chapterNow"), bar = $("#chapterBar");
      function dist() { return track.scrollWidth - window.innerWidth; }
      var tween = gsap.to(track, {
        x: function () { return -dist(); }, ease: "none",
        scrollTrigger: {
          trigger: wrap, start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (self) {
            var n = Math.min(total, Math.floor(self.progress * (total - 0.001)) + 1);
            if (n !== last) { last = n; now.textContent = pad(n); }
            bar.style.transform = "scaleX(" + Math.max(0.08, self.progress) + ")";
          }
        }
      });
      $$(".chapter", track).forEach(function (ch) {
        var art = $(".chapter__art img", ch), txt = $(".chapter__txt", ch);
        gsap.fromTo(art, { scale: 1.12, xPercent: 4 }, { scale: 1, xPercent: -4, ease: "none", scrollTrigger: { trigger: ch, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        gsap.from(txt.children, { x: 80, autoAlpha: 0, stagger: 0.06, duration: 1, scrollTrigger: { trigger: ch, containerAnimation: tween, start: "left 70%", once: true } });
      });
    });
    mm.add("(max-width: 1023px)", function () {
      $$(".chapter").forEach(function (ch) {
        gsap.from(ch, { y: 60, autoAlpha: 0, duration: 1.1, scrollTrigger: { trigger: ch, start: "top 88%", once: true } });
      });
    });
  }

  /* ----------------------------------------- como funciona uma Incursão */
  // Dois globos em arame (canvas 2D, barato) se aproximam; o céu fica vermelho e o
  // relógio de 8 horas corre; no fim, uma das Terras se desfaz. p vai de 0 a 3.
  function incursao(still) {
    var cv = $("#incCanvas"), ctx = cv.getContext("2d"), steps = $$("#incSteps .incstep"), clockEl = $("#incClock");
    var W = 0, H = 0, dpr = 1, p = still ? 1.55 : 0, rot = 0.6, on = false, step = -1, lastClock = "";
    var lines = [], i, k, a, b, stars = [], dust = [];
    for (i = 0; i < 8; i++) { // meridianos (círculos completos)
      a = i / 8 * Math.PI; var m = [];
      for (k = 0; k <= 64; k++) { b = k / 64 * Math.PI * 2; m.push([Math.cos(b) * Math.cos(a), Math.sin(b), Math.cos(b) * Math.sin(a)]); }
      lines.push(m);
    }
    [-60, -30, 0, 30, 60].forEach(function (lat) { // paralelos
      var r = Math.cos(lat * Math.PI / 180), y = Math.sin(lat * Math.PI / 180), q = [];
      for (k = 0; k <= 64; k++) { b = k / 64 * Math.PI * 2; q.push([Math.cos(b) * r, y, Math.sin(b) * r]); }
      lines.push(q);
    });
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (i = 0; i < 140; i++) stars.push([rnd(), rnd(), rnd() * 1.2 + 0.2, rnd()]);
    lines.forEach(function (l) { for (k = 0; k < l.length; k += 2) dust.push([l[k], rnd() * 0.9 + 0.3, rnd()]); });

    function size() {
      var r = cv.getBoundingClientRect(); if (!r.width) return;
      dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); draw();
    }
    function lerp(x, y, t) { return x + (y - x) * t; }
    function clamp(x) { return Math.max(0, Math.min(1, x)); }
    function project(pt, cx, cy, R, ry) {
      var c = Math.cos(ry), s = Math.sin(ry), x = pt[0] * c - pt[2] * s, z = pt[0] * s + pt[2] * c;
      var t = -0.38, ct = Math.cos(t), st = Math.sin(t), y = pt[1] * ct - z * st; z = pt[1] * st + z * ct;
      return [cx + x * R, cy - y * R, z];
    }
    function globe(cx, cy, R, ry, col, alpha) {
      ctx.lineWidth = 1;
      for (var pass = 0; pass < 2; pass++) {
        ctx.strokeStyle = col; ctx.globalAlpha = alpha * (pass ? 0.9 : 0.18);
        ctx.beginPath();
        lines.forEach(function (l) {
          var pen = false;
          for (var j = 0; j < l.length; j++) {
            var q = project(l[j], cx, cy, R, ry), front = q[2] >= 0;
            if (front === !!pass) { pen ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); pen = true; } else pen = false;
          }
        });
        ctx.stroke();
      }
      ctx.globalAlpha = alpha * 0.9; ctx.strokeStyle = col; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    function shatter(cx, cy, R, ry, col, e) {
      ctx.fillStyle = col;
      dust.forEach(function (d) {
        var q = project(d[0], cx, cy, R, ry), dx = q[0] - cx, dy = q[1] - cy, f = 1 + e * e * d[1] * 2.4;
        ctx.globalAlpha = (1 - e) * (q[2] >= 0 ? 0.9 : 0.3) * (0.6 + d[2] * 0.4);
        var sz = 1.2 + d[2] * 1.6 * (1 - e);
        ctx.fillRect(cx + dx * f - sz / 2, cy + dy * f + e * e * 40 * d[2] - sz / 2, sz, sz);
      });
      ctx.globalAlpha = 1;
    }
    function draw() {
      if (!W) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var a1 = clamp(p), a2 = clamp(p - 1), a3 = clamp(p - 2), desk = W >= 900;
      // no desktop os globos ficam na parte esquerda (o texto ocupa a direita); no celular, em cima
      var SW = desk ? W * 0.62 : W, cy = desk ? H * 0.52 : H * 0.34;
      var R = desk ? Math.min(SW * 0.2, H * 0.3) : Math.min(W * 0.22, H * 0.16);
      // céu: escurece e fica vermelho na etapa 2, vira brasa na 3
      var red = a2 * (1 - a3 * 0.55);
      var g = ctx.createRadialGradient(SW / 2, cy, 0, SW / 2, cy, Math.max(W, H) * 0.8);
      g.addColorStop(0, "rgba(" + Math.round(lerp(20, 255, red)) + "," + Math.round(lerp(40, 60, red)) + "," + Math.round(lerp(60, 40, red)) + "," + (0.18 + red * 0.5) + ")");
      g.addColorStop(1, "rgba(4,6,5,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#e9f1ec";
      stars.forEach(function (s) { ctx.globalAlpha = (0.25 + s[3] * 0.5) * (1 - red * 0.6); ctx.fillRect(s[0] * W, s[1] * H, s[2], s[2]); });
      ctx.globalAlpha = 1;
      var e1 = a1 * a1 * (3 - 2 * a1);
      var x1 = lerp(desk ? 0.24 : 0.29, 0.42, e1) + a2 * 0.02 + a3 * 0.06, x2 = lerp(desk ? 0.76 : 0.71, 0.6, e1) - a2 * 0.03;
      x1 *= SW; x2 *= SW;
      if (a2 > 0) { // ponto de contato brilhando
        var mx = (x1 + x2) / 2, gl = ctx.createRadialGradient(mx, cy, 0, mx, cy, R * 1.3);
        gl.addColorStop(0, "rgba(255,90,60," + (0.55 * a2 * (1 - a3)) + ")"); gl.addColorStop(1, "rgba(255,60,40,0)");
        ctx.fillStyle = gl; ctx.fillRect(mx - R * 1.4, cy - R * 1.4, R * 2.8, R * 2.8);
      }
      globe(x1, cy, R, rot, red > 0.2 ? "#ffb4a6" : "#7fb2ff", 1);
      if (a3 < 1) {
        if (a3 > 0) shatter(x2, cy, R * 0.94, -rot * 1.3, "#ff8a3d", a3);
        else globe(x2, cy, R * 0.94, -rot * 1.3, "#ff8a3d", 1);
      }
      // rótulos (afastados para não se sobreporem quando os globos se tocam)
      ctx.font = "600 11px 'JetBrains Mono', monospace"; ctx.fillStyle = "rgba(233,241,236,.6)";
      ctx.textAlign = "right"; ctx.fillText("TERRA A", x1 - R * 0.35, cy + R + 24);
      if (a3 < 0.6) { ctx.globalAlpha = 1 - a3 / 0.6; ctx.textAlign = "left"; ctx.fillText("TERRA B", x2 + R * 0.35, cy + R + 24); ctx.globalAlpha = 1; }
      // relógio de 8 horas
      var left = a2 >= 1 ? 0 : 8 * 3600 * (1 - a2), txt = pad(Math.floor(left / 3600)) + ":" + pad(Math.floor(left / 60) % 60) + ":" + pad(Math.floor(left) % 60);
      if (txt !== lastClock) { lastClock = txt; clockEl.textContent = txt; }
      cv.parentNode.classList.toggle("is-red", a2 > 0.02);
      var st2 = p < 1 ? 0 : p < 2 ? 1 : 2;
      if (st2 !== step) { step = st2; steps.forEach(function (li, j) { li.classList.toggle("is-on", j === step); }); }
    }
    size();
    var t;
    window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(size, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(size);
    if (still) { $("#incursao").classList.add("is-still"); return; }

    // o globo gira só enquanto a seção está na tela
    function spin(time, dt) { rot += Math.min(dt, 50) * 0.00022; draw(); }
    ScrollTrigger.create({
      trigger: "#incursao", start: "top bottom", end: "bottom top",
      onToggle: function (self) { if (self.isActive && !on) { on = true; gsap.ticker.add(spin); } else if (!self.isActive && on) { on = false; gsap.ticker.remove(spin); } }
    });
    ScrollTrigger.create({
      trigger: "#incursao", start: "top top", end: function () { return "+=" + Math.round(window.innerHeight * 2.4); },
      pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: function (self) { p = self.progress * 3; if (!on) draw(); },
      onRefresh: size
    });
  }

  /* ------------------------------------------------ estrada das HQs */
  function road(still) {
    var road = $("#road"), svg = $("#roadSvg"), path = $("#roadPath"), glow = $("#roadPathGlow"), tween;
    function draw() {
      var r = road.getBoundingClientRect(), w = r.width, hgt = road.offsetHeight, d;
      svg.setAttribute("viewBox", "0 0 " + w + " " + hgt);
      var desktop = window.innerWidth >= 900;
      var cards = $$(".stop", road);
      if (desktop) {
        var mid = w / 2, pts = [[mid, 0]];
        cards.forEach(function (c, i) { var b = c.getBoundingClientRect(); pts.push([mid + (i % 2 ? 46 : -46), b.top - r.top + b.height / 2]); });
        pts.push([mid, hgt]);
        d = "M" + pts[0][0] + " " + pts[0][1];
        for (var i = 1; i < pts.length; i++) { var p0 = pts[i - 1], p1 = pts[i], my = (p0[1] + p1[1]) / 2; d += " C" + p0[0] + " " + my + " " + p1[0] + " " + my + " " + p1[0] + " " + p1[1]; }
      } else {
        var x = parseFloat(getComputedStyle(road).paddingLeft) + 13;
        d = "M" + x + " 0 L" + x + " " + hgt;
      }
      path.setAttribute("d", d); glow.setAttribute("d", d);
      if (still) return;
      if (tween) { tween.scrollTrigger.kill(); tween.kill(); }
      tween = gsap.fromTo(glow, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", ease: "none", scrollTrigger: { trigger: road, start: "top 70%", end: "bottom 70%", scrub: 0.6 } });
    }
    draw();
    var t;
    if (window.ResizeObserver) new ResizeObserver(function () { clearTimeout(t); t = setTimeout(draw, 150); }).observe(road);
  }

  /* --------------------------------------------------------- marquee */
  function marquee() {
    var tr = $("#marquee"), loop = gsap.to(tr, { xPercent: -33.333, duration: 40, ease: "none", repeat: -1 });
    ScrollTrigger.create({
      trigger: ".marquee", start: "top bottom", end: "bottom top",
      onUpdate: function (self) { var v = Math.min(4, Math.abs(self.getVelocity() / 400)) + 1; gsap.to(loop, { timeScale: v * (self.direction || 1), duration: 0.3, overwrite: true }); }
    });
  }

  /* ------------------------------------------ cursor, botões magnéticos */
  function extras() {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      var cur = $("#cursor"), xTo = gsap.quickTo(cur, "x", { duration: 0.35, ease: "power3" }), yTo = gsap.quickTo(cur, "y", { duration: 0.35, ease: "power3" });
      window.addEventListener("pointermove", function (e) { cur.classList.add("is-on"); xTo(e.clientX); yTo(e.clientY); }, { passive: true });
      document.addEventListener("pointerover", function (e) { cur.classList.toggle("is-hover", !!e.target.closest("a, button, label, summary, input")); });
      $$(".btn").forEach(function (b) {
        var bx = gsap.quickTo(b, "x", { duration: 0.4, ease: "power3" }), by = gsap.quickTo(b, "y", { duration: 0.4, ease: "power3" });
        b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); bx((e.clientX - r.left - r.width / 2) * 0.25); by((e.clientY - r.top - r.height / 2) * 0.35); });
        b.addEventListener("pointerleave", function () { bx(0); by(0); });
      });
    }
    // cartões de herói: inclinação 3D sutil
    $$(".hero-card").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(c, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 800, duration: 0.5, ease: "power3" });
      });
      c.addEventListener("pointerleave", function () { gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.7 }); });
    });
  }

  /* ----------------------------------------------------------- loader */
  function loader(done) {
    var el = $("#loader"), count = $("#loaderCount");
    var finish = function () {
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-ready");
      done();
    };
    if (!hasGsap || reduce) { el.remove(); finish(); return; }
    gsap.registerPlugin(DrawSVGPlugin);
    var o = { v: 0 };
    var tl = gsap.timeline();
    tl.from(".loader__line", { drawSVG: "0%", duration: 1.1, stagger: 0.12, ease: "power2.inOut" }, 0)
      .to(o, { v: 100, duration: 1.3, ease: "power2.inOut", onUpdate: function () { count.textContent = pad(Math.round(o.v)); } }, 0)
      .to(el, { yPercent: -100, duration: 0.9, ease: "expo.inOut", onStart: finish }, "+=0.15")
      .add(function () { el.remove(); })
      .from("#introPre > *", { y: 24, autoAlpha: 0, stagger: 0.08, duration: 1 }, "-=0.45")
      .from("#introCue", { autoAlpha: 0, y: 20, duration: 0.8 }, "-=1.4");
  }

  /* ============================================================= INÍCIO */
  function start() {
    build();
    buildCountdown();
    interactions();
    var fontsReady = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 2500); })]) : Promise.resolve();
    fontsReady.then(function () {
      if (!hasGsap) { loader(function () {}); incursao(true); return; }
      if (reduce) { motion(); loader(function () {}); return; }
      // o loader roda em paralelo à montagem do motion
      motion();
      loader(function () { ScrollTrigger.refresh(); });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
