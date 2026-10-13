/* ==========================================================================
   Cena WebGL da abertura — tudo na GPU, num único passe:
   • nebulosa de magia verde, estrelas e duas Terras em rota de colisão;
   • a máscara “DOOM” (letras que viram janelas) vem de uma textura SDF
     (signed distance field): bordas nítidas em qualquer zoom e custo zero de
     CPU durante a rolagem — antes era uma <mask> SVG re-rasterizada a cada
     quadro, a principal causa dos engasgos;
   • resolução adaptativa: se o aparelho não sustenta ~55 fps, a cena reduz a
     resolução interna sozinha (e volta a subir quando sobra fôlego).

   API
     DoomGL.init(canvas)                 -> boolean
     DoomGL.buildMask(mode)              -> Promise<{w,h,o1,o2,hole}> (coords da textura)
     DoomGL.set({p1,p2,r1,r2,inc,zoom,zoomO,maskOn,rect})   (pixels CSS, origem no topo)
     DoomGL.pause(bool) · DoomGL.resize() · DoomGL.quality()
   ========================================================================== */
(function () {
  "use strict";
  var VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  var FRAG = [
    "precision highp float;",
    "uniform vec2 uRes;uniform float uTime;uniform vec2 uP1;uniform vec2 uP2;uniform float uR1;uniform float uR2;uniform float uInc;uniform vec2 uMouse;uniform float uScale;",
    "uniform sampler2D uMask;uniform vec4 uRect;uniform float uTexW;uniform float uSpread;uniform float uZoom;uniform vec2 uZoomO;uniform float uMaskOn;",
    "float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
    "float n2(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),u.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x),u.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<4;i++){v+=a*n2(p);p=m*p;a*=.5;}return v;}",
    "float h31(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}",
    "float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);",
    " return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),",
    "            mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z);}",
    "float fbm3(vec3 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return v;}",
    "float fbm3s(vec3 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*n3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return v;}",
    "vec4 planet(vec2 fc,vec2 c,float r,float seed,vec3 ocean,vec3 land,vec3 atmo,float rot){",
    " vec2 d=(fc-c)/r;float l=length(d);vec4 col=vec4(0.);",
    " if(l>1.7)return col;",
    " if(l<1.){",
    "  float z=sqrt(1.-l*l);vec3 n=vec3(d.x,d.y,z);",
    "  float ca=cos(rot),sa=sin(rot);vec3 q=vec3(ca*n.x+sa*n.z,n.y,-sa*n.x+ca*n.z);",
    "  float h=fbm3(q*2.3+seed);float lm=smoothstep(.5,.54,h);",
    "  vec3 base=mix(ocean,land*(.75+.5*h),lm);",
    "  float cl=smoothstep(.55,.8,fbm3s(q*3.4+seed*2.+vec3(uTime*.012,0.,0.)));",
    "  base=mix(base,vec3(.93,.97,.95),cl*.7);",
    "  vec3 L=normalize(vec3(-.55,-.45,.7));float df=clamp(dot(n,L),0.,1.);",
    "  float rim=pow(1.-z,2.6);",
    "  vec3 c3=base*(.05+df*1.15)+atmo*rim*1.6;",
    "  c3+=vec3(1.,.25,.12)*uInc*pow(1.-z,1.5)*.9;",
    "  col=vec4(c3,smoothstep(1.,1.-2./r,l));",
    " }",
    " float g=exp(-max(l-1.,0.)*7.)*step(1.,l);",
    " col.rgb+=atmo*g*.85*(1.-col.a);col.a=max(col.a,g*.6);",
    " return col;}",
    "void main(){",
    " vec2 fc=gl_FragCoord.xy/uScale;fc.y=uRes.y-fc.y;",
    // ---- máscara DOOM (SDF) ----------------------------------------------
    " float inside=1.,outline=0.;",
    " if(uMaskOn>.001){",
    "  vec2 mp=(fc-uZoomO)/uZoom+uZoomO;vec2 tc=(mp-uRect.xy)/uRect.zw;",
    "  inside=0.;",
    "  if(tc.x>0.&&tc.x<1.&&tc.y>0.&&tc.y<1.){",
    "   vec2 s=texture2D(uMask,tc).rg;float ppt=uRect.z/uTexW*uZoom*uScale;",
    "   inside=clamp((s.r-.5)*2.*uSpread*ppt+.5,0.,1.);",
    "   outline=clamp(1.6*uScale-abs((s.g-.5)*2.*uSpread*ppt),0.,1.);",
    "  }",
    "  float cover=(1.-inside)*uMaskOn;",
    "  if(cover>.999){gl_FragColor=vec4(vec3(.008,.016,.012)+vec3(.18,1.,.55)*outline*.75,1.);return;}",
    " }",
    // ---- cena --------------------------------------------------------------
    " vec2 uv=fc/uRes;float asp=uRes.x/uRes.y;vec2 p=(uv-.5)*vec2(asp,1.);",
    " p+=uMouse*.015;",
    " float t=uTime*.03;",
    " vec2 q=vec2(fbm(p*2.+t),fbm(p*2.-t+3.1));",
    " float neb=fbm(p*2.6+q*1.8+vec2(t*.6,-t*.4));",
    " vec3 col=vec3(.006,.014,.01);",
    " col+=vec3(.02,.33,.17)*pow(neb,2.4)*1.25;",
    " col+=vec3(.0,.85,.45)*pow(neb,6.)*1.1;",
    " vec3 red=vec3(.03,.0,.0)+vec3(.5,.05,.03)*pow(neb,2.2)*1.4+vec3(1.,.42,.12)*pow(neb,6.)*1.2;",
    " col=mix(col,red,uInc*.92);",
    " vec2 sg=fc/3.;vec2 si=floor(sg);float sr=h21(si);",
    " float star=step(.9965,sr)*pow(1.-length(fract(sg)-.5)*2.,3.)*(.6+.4*sin(uTime*2.+sr*90.));",
    " col+=vec3(.85,1.,.92)*star*(1.-uInc*.4);",
    " vec2 sg2=fc/1.6;float sr2=h21(floor(sg2)+7.);col+=vec3(.6,.8,.7)*step(.9985,sr2)*.6;",
    " if(uInc>.25){",
    "  vec2 ab=uP2-uP1;float tt=clamp(dot(fc-uP1,ab)/dot(ab,ab),0.,1.);vec2 cp=uP1+ab*tt;",
    "  vec2 nrm=normalize(vec2(-ab.y,ab.x));float off=(n2(vec2(tt*8.,uTime*1.7))-.5)*60.*uInc;",
    "  vec2 dd=fc-cp;float dl=length(vec2(dot(dd,nrm)-off,dot(dd,normalize(ab))));",
    "  float win=smoothstep(.0,.15,tt)*smoothstep(1.,.85,tt);",
    "  float arc=smoothstep(3.5,0.,dl)*win*smoothstep(.25,.7,uInc);",
    "  float arcGlow=exp(-dl*.05)*win*smoothstep(.25,.9,uInc)*.55;",
    "  col+=vec3(.55,1.,.75)*arc*1.4+vec3(.18,1.,.5)*arcGlow*.6;",
    " }",
    " vec4 a=planet(fc,uP1,uR1,1.7,vec3(.02,.12,.32),vec3(.12,.36,.16),vec3(.25,.65,1.),uTime*.035);",
    " vec4 b=planet(fc,uP2,uR2,7.3,vec3(.25,.12,.04),vec3(.75,.52,.22),vec3(1.,.55,.2),-uTime*.03+1.);",
    " col=mix(col,a.rgb,a.a);col=mix(col,b.rgb,b.a);",
    " col+=vec3(.0,.5,.25)*pow(1.-uv.y,3.)*.35*(1.-uInc*.5);",
    " float vig=smoothstep(1.25,.25,length(p*vec2(.85,1.)));col*=mix(.35,1.,vig);",
    " col+=(h21(fc+fract(uTime))-.5)*.035;",
    " col=pow(col,vec3(.92));",
    " if(uMaskOn>.001){float cover=(1.-inside)*uMaskOn;col=mix(col,vec3(.008,.016,.012),cover);col+=vec3(.18,1.,.55)*outline*.75*uMaskOn;}",
    " gl_FragColor=vec4(col,1.);}"
  ].join("\n");

  var gl, prog, canvas, tex, U = {}, raf = 0, paused = false, t0 = performance.now(), scale = 1;
  var quality = 0.8, qMax = 1, frames = 0, ema = 16.7, calm = 0;
  var S = { p1: [300, 300], p2: [900, 260], r1: 140, r2: 100, inc: 0, zoom: 1, zoomO: [0, 0], maskOn: 0, rect: [0, 0, 1, 1], mx: 0, my: 0 };
  var mouse = { x: 0, y: 0 };
  var mask = { texW: 1, spread: 16 };

  function compile(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    scale = Math.max(0.35, dpr * quality);
    var w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
    var cw = Math.max(2, Math.round(w * scale)), ch = Math.max(2, Math.round(h * scale));
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; gl.viewport(0, 0, cw, ch); }
    draw(performance.now()); // desenha já: evita o quadro preto ao redimensionar
  }
  function draw(now) {
    gl.uniform2f(U.uRes, canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight);
    gl.uniform1f(U.uScale, scale);
    gl.uniform1f(U.uTime, (now - t0) / 1000);
    gl.uniform2f(U.uP1, S.p1[0], S.p1[1]); gl.uniform2f(U.uP2, S.p2[0], S.p2[1]);
    gl.uniform1f(U.uR1, S.r1); gl.uniform1f(U.uR2, S.r2); gl.uniform1f(U.uInc, S.inc);
    gl.uniform2f(U.uMouse, mouse.x, mouse.y);
    gl.uniform4f(U.uRect, S.rect[0], S.rect[1], S.rect[2], S.rect[3]);
    gl.uniform1f(U.uTexW, mask.texW); gl.uniform1f(U.uSpread, mask.spread);
    gl.uniform1f(U.uZoom, S.zoom); gl.uniform2f(U.uZoomO, S.zoomO[0], S.zoomO[1]);
    gl.uniform1f(U.uMaskOn, tex ? S.maskOn : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  var last = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (paused || document.hidden) { last = 0; return; }
    var dt = last ? Math.min(250, now - last) : 16.7; last = now;
    // só o paralaxe do mouse é suavizado; o resto já chega suave do ScrollTrigger/Lenis
    var k = 1 - Math.pow(0.95, dt / 16.7);
    mouse.x += (S.mx - mouse.x) * k; mouse.y += (S.my - mouse.y) * k;
    adapt(dt);
    draw(now);
  }
  // resolução adaptativa
  function adapt(dt) {
    ema = ema * 0.92 + dt * 0.08;
    if (++frames < 45) return;
    frames = 0;
    if (ema > 21 && quality > 0.4) { quality = Math.max(0.4, quality - 0.12); calm = 0; resize(); }
    else if (ema < 17.5 && quality < qMax) { if (++calm >= 4) { quality = Math.min(qMax, quality + 0.06); calm = 0; resize(); } }
    else calm = 0;
  }

  /* ---------------------------------------------------- textura SDF da máscara
     Desenha “DOOM” (ou “DO/OM” no retrato) num canvas 2D, calcula o campo de
     distância (Felzenszwalb–Huttenlocher) num Web Worker e envia como textura RG:
     R = letras + miolo dos “O” (janela), G = só as letras (contorno). */
  var EDT_SRC = "var INF=1e20;" +
    "function edt1(f,n,st,d,v,z,o,off){var k=0;v[0]=0;z[0]=-INF;z[1]=INF;for(var q=1;q<n;q++){var fq=f[off+q*st];var s=((fq+q*q)-(f[off+v[k]*st]+v[k]*v[k]))/(2*q-2*v[k]);while(s<=z[k]){k--;s=((fq+q*q)-(f[off+v[k]*st]+v[k]*v[k]))/(2*q-2*v[k]);}k++;v[k]=q;z[k]=s;z[k+1]=INF;}k=0;for(var q2=0;q2<n;q2++){while(z[k+1]<q2)k++;var dq=q2-v[k];o[q2]=dq*dq+f[off+v[k]*st];}for(var i=0;i<n;i++)f[off+i*st]=o[i];}" +
    "function edt(f,w,h){var n=Math.max(w,h),v=new Int32Array(n),z=new Float64Array(n+1),o=new Float64Array(n);for(var x=0;x<w;x++)edt1(f,h,w,null,v,z,o,x);for(var y=0;y<h;y++)edt1(f,w,1,null,v,z,o,y*w);}" +
    "function sdf(a,w,h,spread){var N=w*h,fi=new Float64Array(N),fo=new Float64Array(N);for(var i=0;i<N;i++){var on=a[i]>127;fo[i]=on?0:INF;fi[i]=on?INF:0;}edt(fo,w,h);edt(fi,w,h);var out=new Uint8ClampedArray(N);for(var j=0;j<N;j++){var d=Math.sqrt(fi[j])-Math.sqrt(fo[j]);out[j]=Math.max(0,Math.min(255,Math.round(127.5+d/spread*127.5)));}return out;}" +
    "onmessage=function(e){var m=e.data;var r=sdf(m.fill,m.w,m.h,m.spread),g=sdf(m.text,m.w,m.h,m.spread);postMessage({id:m.id,r:r,g:g},[r.buffer,g.buffer]);};";
  var worker = null, jobs = {}, jobId = 0;
  function runSdf(fill, text, w, h, spread) {
    return new Promise(function (resolve) {
      try {
        if (!worker) {
          worker = new Worker(URL.createObjectURL(new Blob([EDT_SRC], { type: "text/javascript" })));
          worker.onmessage = function (e) { var cb = jobs[e.data.id]; delete jobs[e.data.id]; if (cb) cb(e.data); };
        }
        var id = ++jobId; jobs[id] = resolve;
        worker.postMessage({ id: id, fill: fill, text: text, w: w, h: h, spread: spread }, [fill.buffer, text.buffer]);
      } catch (err) { // sem worker: calcula aqui mesmo
        var f = new Function(EDT_SRC.replace("onmessage=", "var _o=") + "return {r:sdf(arguments[0],arguments[2],arguments[3],arguments[4]),g:sdf(arguments[1],arguments[2],arguments[3],arguments[4])};");
        resolve(f(fill, text, w, h, spread));
      }
    });
  }
  var cache = {};
  function buildMask(mode) {
    if (cache[mode]) { upload(cache[mode]); return Promise.resolve(cache[mode].info); }
    var portrait = mode === "portrait", W = portrait ? 760 : 1200, H = portrait ? 840 : 600, spread = 14;
    var cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var c = cv.getContext("2d", { willReadFrequently: true });
    var family = "900 100px Cinzel, 'Trajan Pro', Georgia, serif";
    c.font = family;
    var lines = portrait ? ["DO", "OM"] : ["DOOM"];
    var widest = Math.max.apply(null, lines.map(function (l) { return c.measureText(l).width; }));
    var fs = 100 * (W * (portrait ? 0.9 : 0.9)) / widest;
    if (portrait) fs = Math.min(fs, H / 2.05);
    c.font = family.replace("100px", fs.toFixed(1) + "px");
    c.textBaseline = "alphabetic"; c.textAlign = "left";
    var cap = fs * 0.7, gap = fs * 0.2;
    var baselines = portrait ? [(H - (cap * 2 + gap)) / 2 + cap, (H - (cap * 2 + gap)) / 2 + cap * 2 + gap] : [(H + cap) / 2];
    var holes = [];
    function drawText(ctx) {
      lines.forEach(function (l, li) {
        var lw = ctx.measureText(l).width, x0 = (W - lw) / 2, y = baselines[li];
        ctx.fillText(l, x0, y);
        for (var i = 0; i < l.length; i++) if (l[i] === "O") {
          var pre = ctx.measureText(l.slice(0, i)).width, ow = ctx.measureText("O").width;
          holes.push([x0 + pre + ow / 2, y - fs * 0.355]);
        }
      });
    }
    c.fillStyle = "#fff"; drawText(c);
    var text = c.getImageData(0, 0, W, H).data;
    // canal de preenchimento: letras + miolo dos O
    var hs = holes.slice(0, 2); holes = [];
    c.clearRect(0, 0, W, H); drawText(c);
    hs.forEach(function (o) { c.beginPath(); c.ellipse(o[0], o[1], fs * 0.215, fs * 0.335, 0, 0, Math.PI * 2); c.fill(); });
    var fill = c.getImageData(0, 0, W, H).data;
    var A = new Uint8Array(W * H), B = new Uint8Array(W * H);
    for (var i = 0; i < W * H; i++) { A[i] = fill[i * 4 + 3]; B[i] = text[i * 4 + 3]; }
    var info = { w: W, h: H, o1: hs[0], o2: hs[1], hole: fs * 0.205, fs: fs };
    return runSdf(A, B, W, H, spread).then(function (res) {
      var rgba = new Uint8Array(W * H * 4);
      for (var j = 0; j < W * H; j++) { rgba[j * 4] = res.r[j]; rgba[j * 4 + 1] = res.g[j]; rgba[j * 4 + 3] = 255; }
      cache[mode] = { info: info, rgba: rgba, w: W, h: H, spread: spread };
      upload(cache[mode]);
      return info;
    });
  }
  function upload(m) {
    if (!gl) return;
    if (!tex) tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, m.w, m.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, m.rgba);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(U.uMask, 0);
    mask.texW = m.w; mask.spread = m.spread;
  }

  window.DoomGL = {
    init: function (cv) {
      canvas = cv;
      try { gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: false }); } catch (e) { gl = null; }
      if (!gl) return false;
      var vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return false;
      prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
      gl.useProgram(prog);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ["uRes", "uTime", "uP1", "uP2", "uR1", "uR2", "uInc", "uMouse", "uScale", "uMask", "uRect", "uTexW", "uSpread", "uZoom", "uZoomO", "uMaskOn"].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
      var small = Math.min(window.innerWidth, window.innerHeight) < 600;
      quality = small ? 0.62 : 0.8; qMax = small ? 0.8 : 1;
      resize();
      var rt;
      window.addEventListener("resize", function () { resize(); clearTimeout(rt); rt = setTimeout(resize, 150); });
      window.addEventListener("pointermove", function (e) { S.mx = e.clientX / window.innerWidth - 0.5; S.my = e.clientY / window.innerHeight - 0.5; }, { passive: true });
      cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); cancelAnimationFrame(raf); });
      raf = requestAnimationFrame(frame);
      return true;
    },
    buildMask: buildMask,
    set: function (o) {
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) S[k] = Array.isArray(o[k]) ? o[k].slice() : o[k];
      if (paused && gl) draw(performance.now());
    },
    pause: function (p) { paused = !!p; },
    resize: function () { if (gl) resize(); },
    quality: function () { return quality; }
  };
})();
