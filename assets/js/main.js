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
  function build() {
    // marca, máscara grande e capa do livro
    $("#navMark").innerHTML = C.mask("nav", { hood: true });
    $("#bigMask").innerHTML = C.mask("big", { hood: true });
    $("#bookCoverArt").innerHTML = C.renderPage(0, "book");
    var coverMask = "url(\"data:image/svg+xml," + encodeURIComponent(C.mask("cov", { hood: false })) + "\")";
    $("#road").style.setProperty("--mask", coverMask);

    // universos
    $("#universes").innerHTML = D.universes.map(function (u) {
      return '<article class="uni" style="--c:' + u.color + '" data-reveal><p class="uni__id"><small>UNIVERSO</small>' + esc(u.name) + '</p><p class="uni__who">' + esc(u.who) + "</p><p>" + esc(u.note) + "</p></article>";
    }).join("");
    $("#facts").innerHTML = D.facts.map(function (f) { return "<div><dt>" + esc(f.k) + "</dt><dd>" + esc(f.v) + "</dd></div>"; }).join("");
    $("#glossary").innerHTML = D.glossary.map(function (g) { return "<div><dt>" + esc(g.t) + "</dt><dd>" + esc(g.d) + "</dd></div>"; }).join("");
    $("#timeline").innerHTML = D.timeline.map(function (t) { return "<li><time>" + esc(t.d) + "</time><h4>" + esc(t.t) + "</h4><p>" + esc(t.x) + "</p></li>"; }).join("");
    $("#doomFile").innerHTML = D.doomFile.map(function (f) { return "<div><dt>" + esc(f.k) + "</dt><dd>" + esc(f.v) + "</dd></div>"; }).join("");

    // capítulos (arte = painéis da HQ)
    $("#chaptersTrack").innerHTML = D.chapters.map(function (c, i) {
      return '<article class="chapter" data-i="' + i + '"><div class="chapter__art">' + C.renderPanel(c.page, c.panel, "ch" + i, { noText: true }).replace("<svg ", '<svg preserveAspectRatio="xMidYMid slice" ') + '</div><div class="chapter__txt"><p class="chapter__n">' + c.n + '</p><p class="chapter__y">' + esc(c.y) + "</p><h3>" + esc(c.t) + '</h3><p class="chapter__x">' + esc(c.x) + "</p></div></article>";
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
        return '<button class="hero-card" data-cast="' + c.id + '" style="--c:' + t.color + '" aria-label="' + esc(c.name + " — " + c.actor) + '"><img src="assets/img/cast/' + c.id + '.webp" alt="" loading="lazy" decoding="async" width="600" height="800">' +
          (c.status !== "confirmado" ? '<span class="hero-card__status">' + tag("indicio") + "</span>" : "") +
          '<span class="hero-card__uni">' + esc(uni.name) + '</span><span class="hero-card__body"><span class="hero-card__name">' + esc(c.name) + '</span><span class="hero-card__actor">' + esc(c.actor) + "</span></span></button>";
      }).join("");
      return '<section class="team" data-team="' + t.id + '" style="--c:' + t.color + '"><header class="team__head"><h3><small>' + esc(uni.name) + "</small>" + esc(t.name) + "</h3><p>" + esc(t.desc) + '</p></header><div class="team__row">' + cards + "</div></section>";
    }).join("");
    $("#reported").innerHTML = D.reported.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("");

    // roteiro de HQs
    var stops = "", route = 0, step = 0, colors = { 1: "#0f5132", 2: "#5a1a12", 3: "#1d2f5c", 4: "#3d2a5c" };
    D.comics.forEach(function (c) {
      if (c.route !== route) {
        route = c.route;
        var r = D.routes[route - 1];
        stops += '<div class="route" data-reveal><p class="route__n">Rota ' + route + '</p><p class="route__t">' + esc(r.t) + '</p><p class="route__s">' + esc(r.s) + "</p></div>";
      }
      step++;
      stops += '<article class="stop" data-reveal><div class="cover" style="--cc:' + colors[c.route] + '"><b>' + esc(c.title.split(":")[0].slice(0, 26)) + "</b><span>" + esc(c.year) + '</span></div><div><div class="stop__meta"><span class="tier tier--' + c.tier + '">' + (c.tier === "bonus" ? "Bônus" : c.tier[0].toUpperCase() + c.tier.slice(1)) + "</span><small>Parada " + pad(step) + " · " + esc(c.year) + "</small></div><h3>" + esc(c.title) + '</h3><p class="stop__orig">' + esc(c.orig) + '</p><p class="stop__by">' + esc(c.by) + '</p><p class="stop__why">' + esc(c.why) + '</p><div class="stop__br"><strong>Edição brasileira ' + (c.ok ? '<span class="ok-badge">✔ Panini</span>' : "") + "</strong>" + esc(c.br) + (c.url ? ' <a href="' + c.url + '" target="_blank" rel="noopener">Ver na loja ↗</a>' : "") + "</div></div></article>";
    });
    $("#roadStops").innerHTML = stops;
    $("#readLegal").innerHTML = D.readLegal.map(function (l) { return "<li><b>" + esc(l.t) + "</b><p>" + esc(l.d) + "</p>" + (l.url ? '<a href="' + l.url + '" target="_blank" rel="noopener">Acessar ↗</a>' : "") + "</li>"; }).join("");

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
    $("#vidChannels").innerHTML = '<button role="tab" aria-selected="true" data-vch="all">Todos os canais</button>' + D.channels.map(function (c) {
      return '<button role="tab" aria-selected="false" data-vch="' + c.key + '"><img src="' + c.img + '" alt="">' + esc(c.name) + "</button>";
    }).join("");
    $("#vgrid").innerHTML = D.videos.map(function (v) {
      var c = chan(v.ch), cat = D.videoCats.filter(function (x) { return x.id === v.cat; })[0];
      return '<button class="vcard" data-id="' + v.id + '" data-cat="' + v.cat + '" data-ch="' + v.ch + '" data-reveal><span class="vcard__thumb"><img src="' + thumb(v.id, "mqdefault") + '" alt="" loading="lazy" decoding="async" width="320" height="180"><span class="vcard__dur">' + v.dur + '</span><span class="vcard__cat">' + (v.cat === "rumores" ? tag("rumor") : '<span class="chip">' + esc(cat.t) + "</span>") + '</span></span><span class="vcard__meta"><img src="' + c.img + '" alt="" loading="lazy"><span><b>' + esc(v.t) + "</b><small>" + esc(c.name) + "</small></span></span></button>";
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
      whenText(); tick();
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

    $("#icsBtn").addEventListener("click", function () {
      var r = release(), d = r.date.slice(0, 10).replace(/-/g, ""), d2 = String(+d + 1);
      var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Guia de fã Doutor Destino//PT-BR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
        "UID:vingadores-doutor-destino-" + r.id + "@guia-fa", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
        "DTSTART;VALUE=DATE:" + d, "DTEND;VALUE=DATE:" + d2, "SUMMARY:Estreia — Vingadores: Doutor Destino",
        "DESCRIPTION:Destino chegou. Estreia nos cinemas (" + r.label + ").", "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Amanhã: Vingadores: Doutor Destino", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      a.download = "vingadores-doutor-destino.ics"; document.body.appendChild(a); a.click(); a.remove();
    });
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
      $("#dossieBox").innerHTML = '<figure class="dossie__img" style="margin:0"><img src="assets/img/cast/' + c.id + '.webp" alt="' + esc(c.actor) + '">' +
        (p ? '<figcaption>Foto: <a href="' + p[2] + '" target="_blank" rel="noopener">' + esc(p[0]) + '</a> · <a href="' + (D.licenseUrls[p[1]] || "#") + '" target="_blank" rel="noopener">' + esc(p[1]) + "</a></figcaption>" : "") + "</figure>" +
        '<div class="dossie__body"><span class="tag ' + (c.status === "confirmado" ? "tag--oficial" : "tag--indicio") + '">' + (c.status === "confirmado" ? "Elenco confirmado" : "Esperado, não confirmado") + '</span><h2 id="dossieName">' + esc(c.name) + '</h2><p class="dossie__actor">' + esc(c.actor) + " · " + esc(t.name) + " · " + esc(uni.name) + "</p><dl><div><dt>Último visto em</dt><dd>" + esc(c.last) + "</dd></div><div><dt>Por que importa em Doomsday</dt><dd>" + esc(c.why) + "</dd></div><div><dt>Equipe</dt><dd>" + esc(t.desc) + "</dd></div></dl></div>";
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

    videos();
    watchlist();
    konami();

    // Lenis pausa quando um diálogo abre
    document.addEventListener("doom:dialog", function (e) { if (!lenis) return; e.detail ? lenis.stop() : lenis.start(); });
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
      $("#officialList").innerHTML = items.map(function (x) {
        var vid = itemId(x.v);
        return '<li><button data-key="' + x.key + '" aria-current="' + (x.key === featured) + '"><img src="' + thumb(vid, "mqdefault") + '" alt="" loading="lazy"><span><b>' + esc(x.v.t) + "</b><small>" + x.v.dur + " · Marvel Brasil</small></span></button></li>";
      }).join("");
    }
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

    // filtros
    var vcat = "all", vch = "all";
    function filter() {
      $$(".vcard").forEach(function (c) {
        c.hidden = (vcat !== "all" && c.dataset.cat !== vcat) || (vch !== "all" && c.dataset.ch !== vch);
        if (!c.hidden) { c.style.opacity = 1; c.style.transform = "none"; }
      });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
    $("#vidCats").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      vcat = b.dataset.vcat; $$("#vidCats button").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); }); filter();
    });
    $("#vidChannels").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      vch = b.dataset.vch; $$("#vidChannels button").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); }); filter();
    });
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
      queue = [{ id: b.dataset.play, t: b.dataset.title, ch: "marvel" }]; qi = 0; play(queue[0]);
    });

    function play(v) {
      if (!v) return;
      var c = v.ch === "marvel" ? { name: "Marvel Brasil", url: "https://www.youtube.com/@MarvelBR", img: "assets/img/favicon.svg" } : chan(v.ch);
      frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + v.id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1&hl=pt-BR" title="' + esc(v.t) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      $("#playerTitle").textContent = v.t;
      $("#playerCredit").innerHTML = "Vídeo de <b>" + esc(c.name) + "</b> · todos os direitos reservados ao canal";
      $("#playerAvatar").src = c.img;
      $("#playerYt").href = "https://www.youtube.com/watch?v=" + v.id;
      $("#playerSub").href = c.url + "?sub_confirmation=1";
      $("#playerNext").hidden = queue.length < 2;
      if (!player.open) { player.showModal(); document.dispatchEvent(new CustomEvent("doom:dialog", { detail: true })); }
    }
    $("#playerNext").addEventListener("click", function () { qi = (qi + 1) % queue.length; play(queue[qi]); });
    player.addEventListener("close", function () { frame.innerHTML = ""; document.dispatchEvent(new CustomEvent("doom:dialog", { detail: false })); });
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
    if (reduce) { road(true); return; }
    reveals();
    chapters();
    road();
    marquee();
    extras();
  }

  /* ----------------------------------------------------------- abertura */
  var geo = {};
  function intro() {
    var glOk = window.DoomGL && window.DoomGL.init($("#gl"));
    if (!glOk) root.classList.add("no-webgl");
    var svg = $("#introMask"), stroke = $("#maskStroke text"), mtext = $("#maskText"), zoomG = $("#maskZoom"), strokeG = $("#maskStroke");
    var layout = "";
    function measure() {
      var w = window.innerWidth, hh = window.innerHeight, fs = 430, portrait = hh > w * 1.15;
      // retrato: “DO / OM” em duas linhas (letras 2x maiores no celular)
      var lines = portrait ? [["DO", 520], ["OM", 900]] : [["DOOM", 600]];
      if (layout !== String(portrait)) {
        layout = String(portrait);
        svg.setAttribute("viewBox", portrait ? "370 150 860 830" : "0 0 1600 900");
        [stroke, mtext].forEach(function (t) {
          t.removeAttribute("y");
          t.innerHTML = lines.map(function (l) { return '<tspan x="800" y="' + l[1] + '">' + l[0] + "</tspan>"; }).join("");
        });
      }
      var ctm = svg.getScreenCTM(), pt = svg.createSVGPoint(), cr = $("#gl").getBoundingClientRect();
      function toScreen(x, y) { pt.x = x; pt.y = y; var p = pt.matrixTransform(ctm); return [p.x - cr.left, p.y - cr.top]; }
      var e1, e2;
      try { e1 = stroke.getExtentOfChar(1); e2 = stroke.getExtentOfChar(2); } catch (err) { e1 = { x: 560, width: 340 }; e2 = { x: 880, width: 340 }; }
      var b1 = portrait ? 520 : 600, b2 = portrait ? 900 : 600;
      geo.o1 = [e1.x + e1.width / 2, b1 - fs * 0.355]; geo.o2 = [e2.x + e2.width / 2, b2 - fs * 0.355];
      [["#hole1", geo.o1], ["#hole2", geo.o2]].forEach(function (x) {
        var el = $(x[0]); el.setAttribute("cx", x[1][0]); el.setAttribute("cy", x[1][1]); el.setAttribute("rx", fs * 0.19); el.setAttribute("ry", fs * 0.31);
      });
      geo.s1 = toScreen(geo.o1[0], geo.o1[1]); geo.s2 = toScreen(geo.o2[0], geo.o2[1]);
      var unit = ctm.a; // px por unidade do SVG
      geo.rHole = fs * 0.205 * unit;
      geo.zoomMax = Math.max(w, hh) / (geo.rHole * 0.9) * 1.6;
      var m = Math.min(w, hh), mob = w < 760;
      geo.h1 = mob ? [w * 0.34, hh * 0.25] : [w * 0.7, hh * 0.42];
      geo.h2 = mob ? [w * 0.78, hh * 0.15] : [w * 0.9, hh * 0.22];
      geo.hr1 = m * (mob ? 0.2 : 0.17); geo.hr2 = m * (mob ? 0.13 : 0.11);
      geo.c1 = mob ? [w * 0.42, hh * 0.24] : [w * 0.74, hh * 0.4];
      var dx = geo.h2[0] - geo.h1[0], dy = geo.h2[1] - geo.h1[1], dl = Math.sqrt(dx * dx + dy * dy) || 1, gap = (geo.hr1 + geo.hr2) * 0.72;
      geo.c2 = [geo.c1[0] + dx / dl * gap, geo.c1[1] + dy / dl * gap];
    }
    function setZoom(s) {
      var ox = geo.o2[0], oy = geo.o2[1], tr = "translate(" + ox + " " + oy + ") scale(" + s + ") translate(" + (-ox) + " " + (-oy) + ")";
      zoomG.setAttribute("transform", tr); strokeG.setAttribute("transform", tr);
    }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function lerp2(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }
    var st = { z: 0, inc: 0 }, eIO = gsap.parseEase("power2.inOut"), eIn = gsap.parseEase("power2.in");
    function apply() {
      if (!glOk) return;
      var z = eIO(st.z), i = st.inc;
      var p1 = lerp2(geo.s1, geo.h1, z), p2 = lerp2(geo.s2, geo.h2, z), r1 = lerp(geo.rHole, geo.hr1, z), r2 = lerp(geo.rHole * 0.92, geo.hr2, z);
      var ie = eIn(i);
      window.DoomGL.set({ p1: lerp2(p1, geo.c1, ie), p2: lerp2(p2, geo.c2, ie), r1: r1, r2: r2, inc: i });
    }
    measure(); setZoom(1); apply();
    if (glOk) window.DoomGL.set({}, true);

    if (reduce) {
      gsap.set(svg, { autoAlpha: 0 }); gsap.set(["#introPre", "#introCue"], { autoAlpha: 0 });
      gsap.set("#hero", { autoAlpha: 1 }); st.z = 1; st.inc = 0.25; apply(); if (glOk) window.DoomGL.set({}, true);
      return;
    }

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: "#inicio", start: "top top", end: function () { return "+=" + Math.round(window.innerHeight * (window.innerWidth < 760 ? 2.4 : 3)); },
        pin: true, scrub: 1, anticipatePin: 1,
        onUpdate: function () { apply(); },
        onRefresh: function () { measure(); apply(); }
      }
    });
    // pausa o WebGL quando a abertura sai da tela
    if (glOk && window.IntersectionObserver) new IntersectionObserver(function (en) { window.DoomGL.pause(!en[0].isIntersecting); }).observe($("#gl"));
    var zobj = { s: 1 };
    tl.to(["#introPre", "#introCue"], { autoAlpha: 0, y: -30, duration: 0.08 }, 0)
      .to(zobj, { s: function () { return geo.zoomMax; }, duration: 0.42, ease: "power3.in", onUpdate: function () { setZoom(zobj.s); } }, 0)
      .to(st, { z: 1, duration: 0.42 }, 0)
      .to(svg, { autoAlpha: 0, duration: 0.08 }, 0.36)
      .fromTo("#hero", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.44)
      .from(".hero__eyebrow, .hero__pre, .hero__tag, .hero__meta, .hero__cta", { y: 50, autoAlpha: 0, stagger: 0.02, duration: 0.12, ease: "power3.out" }, 0.44)
      .from("#heroMain", { yPercent: 40, autoAlpha: 0, scale: 0.92, filter: "blur(16px)", duration: 0.16, ease: "power3.out" }, 0.46)
      .to("#incursion", { autoAlpha: 1, duration: 0.05 }, 0.62)
      .to(st, { inc: 1, duration: 0.36, ease: "power1.in" }, 0.62)
      .to("#incursionBar", { scaleX: 1, duration: 0.36 }, 0.62)
      .to("#hero", { y: -40, duration: 0.36 }, 0.62);
    tl.eventCallback("onUpdate", function () { $("#incursionPct").textContent = Math.round(st.inc * 100) + "%"; });

    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { measure(); setZoom(tl.progress() < 0.42 ? zobj.s : geo.zoomMax); apply(); }, 120); });
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
    // máscara grande: leve flutuação e brilho no olhar
    gsap.to("#bigMask", { y: -18, rotate: -1.5, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.from("#bigMask", { scale: 0.85, autoAlpha: 0, duration: 1.6, scrollTrigger: { trigger: "#bigMask", start: "top 80%", once: true } });
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
      var track = $("#chaptersTrack"), wrap = $("#chapters");
      function dist() { return track.scrollWidth - window.innerWidth; }
      var tween = gsap.to(track, {
        x: function () { return -dist(); }, ease: "none",
        scrollTrigger: {
          trigger: wrap, start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (self) {
            var n = Math.min(10, Math.floor(self.progress * 9.999) + 1);
            $("#chapterNow").textContent = pad(n);
            $("#chapterBar").style.transform = "scaleX(" + Math.max(0.1, self.progress) + ")";
          }
        }
      });
      $$(".chapter", track).forEach(function (ch) {
        var art = $(".chapter__art svg", ch), txt = $(".chapter__txt", ch);
        gsap.fromTo(art, { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ch, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        gsap.from(txt.children, { x: 80, autoAlpha: 0, stagger: 0.06, duration: 1, scrollTrigger: { trigger: ch, containerAnimation: tween, start: "left 70%", once: true } });
      });
    });
    mm.add("(max-width: 1023px)", function () {
      $$(".chapter").forEach(function (ch) {
        gsap.from(ch, { y: 60, autoAlpha: 0, duration: 1.1, scrollTrigger: { trigger: ch, start: "top 88%", once: true } });
      });
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
      .from("#maskStroke", { autoAlpha: 0, duration: 1.8, ease: "power2.inOut" }, "<")
      .from("#introCue", { autoAlpha: 0, y: 20, duration: 0.8 }, "-=1.4");
  }

  /* ============================================================= INÍCIO */
  function start() {
    build();
    buildCountdown();
    interactions();
    var fontsReady = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 2500); })]) : Promise.resolve();
    fontsReady.then(function () {
      if (!hasGsap) { loader(function () {}); return; }
      if (reduce) { motion(); loader(function () {}); return; }
      // o loader roda em paralelo à montagem do motion
      motion();
      loader(function () { ScrollTrigger.refresh(); });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
