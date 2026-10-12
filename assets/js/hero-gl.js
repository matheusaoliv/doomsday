/* ==========================================================================
   Cena WebGL da abertura: duas Terras em rota de colisão (a Incursão),
   nebulosa de magia verde e estrelas. Shader escrito à mão, sem bibliotecas.
   API: DoomGL.init(canvas) -> boolean; DoomGL.set({p1,p2,r1,r2,inc}); DoomGL.pause(bool)
   Coordenadas p1/p2/r em pixels CSS, origem no topo-esquerdo.
   ========================================================================== */
(function () {
  "use strict";
  var VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  var FRAG = [
    "precision highp float;",
    "uniform vec2 uRes;uniform float uTime;uniform vec2 uP1;uniform vec2 uP2;uniform float uR1;uniform float uR2;uniform float uInc;uniform vec2 uMouse;uniform float uScale;",
    "float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
    "float n2(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),u.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x),u.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*n2(p);p=m*p;a*=.5;}return v;}",
    "float h31(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}",
    "float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);",
    " return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),",
    "            mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z);}",
    "float fbm3(vec3 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return v;}",
    // planeta: devolve cor (rgb) e cobertura (a)
    "vec4 planet(vec2 fc,vec2 c,float r,float seed,vec3 ocean,vec3 land,vec3 atmo,float rot){",
    " vec2 d=(fc-c)/r;float l=length(d);vec4 col=vec4(0.);",
    " if(l<1.){",
    "  float z=sqrt(1.-l*l);vec3 n=vec3(d.x,d.y,z);",
    "  float ca=cos(rot),sa=sin(rot);vec3 q=vec3(ca*n.x+sa*n.z,n.y,-sa*n.x+ca*n.z);",
    "  float h=fbm3(q*2.3+seed);float lm=smoothstep(.5,.54,h);",
    "  vec3 base=mix(ocean,land*(.7+.6*fbm3(q*6.+seed)),lm);",
    "  float cl=smoothstep(.56,.82,fbm3(q*3.4+seed*2.+vec3(uTime*.012,0.,0.)));",
    "  base=mix(base,vec3(.93,.97,.95),cl*.7);",
    "  vec3 L=normalize(vec3(-.55,-.45,.7));float df=clamp(dot(n,L),0.,1.);",
    "  float rim=pow(1.-z,2.6);",
    "  vec3 c3=base*(.05+df*1.15)+atmo*rim*1.6;",
    "  c3+=vec3(1.,.25,.12)*uInc*pow(1.-z,1.5)*.9;",
    "  col=vec4(c3,smoothstep(1.,.985,l));",
    " }",
    " float g=exp(-max(l-1.,0.)*7.)*step(1.,l);",
    " col.rgb+=atmo*g*.85*(1.-col.a);col.a=max(col.a,g*.6);",
    " return col;}",
    "void main(){",
    " vec2 fc=gl_FragCoord.xy/uScale;fc.y=uRes.y-fc.y;",
    " vec2 uv=fc/uRes;float asp=uRes.x/uRes.y;vec2 p=(uv-.5)*vec2(asp,1.);",
    " p+=uMouse*.015;",
    " float t=uTime*.03;",
    // nebulosa com domain warp
    " vec2 q=vec2(fbm(p*2.+t),fbm(p*2.-t+3.1));",
    " float neb=fbm(p*2.6+q*1.8+vec2(t*.6,-t*.4));",
    " vec3 col=vec3(.006,.014,.01);",
    " col+=vec3(.02,.33,.17)*pow(neb,2.4)*1.25;",
    " col+=vec3(.0,.85,.45)*pow(neb,6.)*1.1;",
    " vec3 red=vec3(.03,.0,.0)+vec3(.5,.05,.03)*pow(neb,2.2)*1.4+vec3(1.,.42,.12)*pow(neb,6.)*1.2;",
    " col=mix(col,red,uInc*.92);",
    // estrelas
    " vec2 sg=fc/3.;vec2 si=floor(sg);float sr=h21(si);",
    " float star=step(.9965,sr)*pow(1.-length(fract(sg)-.5)*2.,3.)*(.6+.4*sin(uTime*2.+sr*90.));",
    " col+=vec3(.85,1.,.92)*star*(1.-uInc*.4);",
    " vec2 sg2=fc/1.6;float sr2=h21(floor(sg2)+7.);col+=vec3(.6,.8,.7)*step(.9985,sr2)*.6;",
    // arco de energia entre os planetas
    " vec2 ab=uP2-uP1;float tt=clamp(dot(fc-uP1,ab)/dot(ab,ab),0.,1.);vec2 cp=uP1+ab*tt;",
    " vec2 nrm=normalize(vec2(-ab.y,ab.x));float off=(fbm(vec2(tt*8.,uTime*1.7))-.5)*60.*uInc;",
    " float dl=abs(dot(fc-cp,nrm)-off);",
    " float arc=smoothstep(3.5,0.,dl)*smoothstep(.0,.15,tt)*smoothstep(1.,.85,tt)*smoothstep(.25,.7,uInc);",
    " float arcGlow=exp(-dl*.05)*smoothstep(.25,.9,uInc)*.55;",
    " col+=vec3(.55,1.,.75)*arc*1.4+vec3(.18,1.,.5)*arcGlow*.6;",
    // planetas
    " vec4 a=planet(fc,uP1,uR1,1.7,vec3(.02,.12,.32),vec3(.12,.36,.16),vec3(.25,.65,1.),uTime*.035);",
    " vec4 b=planet(fc,uP2,uR2,7.3,vec3(.25,.12,.04),vec3(.75,.52,.22),vec3(1.,.55,.2),-uTime*.03+1.);",
    " col=mix(col,a.rgb,a.a);col=mix(col,b.rgb,b.a);",
    // brilho verde do Destino vindo de baixo
    " col+=vec3(.0,.5,.25)*pow(1.-uv.y,3.)*.35*(1.-uInc*.5);",
    // vinheta e grão
    " float vig=smoothstep(1.25,.25,length(p*vec2(.85,1.)));col*=mix(.35,1.,vig);",
    " col+=(h21(fc+fract(uTime))-.5)*.035;",
    " col=pow(col,vec3(.92));",
    " gl_FragColor=vec4(col,1.);}"
  ].join("\n");

  var gl, prog, canvas, U = {}, raf = 0, paused = false, t0 = performance.now(), scale = 1;
  var state = { p1: [300, 300], p2: [900, 260], r1: 140, r2: 100, inc: 0, mx: 0, my: 0 };
  var cur = { p1: [300, 300], p2: [900, 260], r1: 140, r2: 100, inc: 0, mx: 0, my: 0 };

  function compile(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var small = window.innerWidth < 760;
    scale = dpr * (small ? 0.6 : 0.8);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.max(2, Math.round(w * scale)); canvas.height = Math.max(2, Math.round(h * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (paused) return;
    var k = 0.12;
    cur.p1[0] += (state.p1[0] - cur.p1[0]) * k; cur.p1[1] += (state.p1[1] - cur.p1[1]) * k;
    cur.p2[0] += (state.p2[0] - cur.p2[0]) * k; cur.p2[1] += (state.p2[1] - cur.p2[1]) * k;
    cur.r1 += (state.r1 - cur.r1) * k; cur.r2 += (state.r2 - cur.r2) * k; cur.inc += (state.inc - cur.inc) * k;
    cur.mx += (state.mx - cur.mx) * 0.05; cur.my += (state.my - cur.my) * 0.05;
    gl.uniform2f(U.uRes, canvas.clientWidth, canvas.clientHeight);
    gl.uniform1f(U.uScale, scale);
    gl.uniform1f(U.uTime, (now - t0) / 1000);
    gl.uniform2f(U.uP1, cur.p1[0], cur.p1[1]); gl.uniform2f(U.uP2, cur.p2[0], cur.p2[1]);
    gl.uniform1f(U.uR1, cur.r1); gl.uniform1f(U.uR2, cur.r2); gl.uniform1f(U.uInc, cur.inc);
    gl.uniform2f(U.uMouse, cur.mx, cur.my);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  window.DoomGL = {
    init: function (cv) {
      canvas = cv;
      try { gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" }); } catch (e) { gl = null; }
      if (!gl) return false;
      var vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return false;
      prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
      gl.useProgram(prog);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ["uRes", "uTime", "uP1", "uP2", "uR1", "uR2", "uInc", "uMouse", "uScale"].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
      resize();
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", function (e) { state.mx = e.clientX / window.innerWidth - 0.5; state.my = e.clientY / window.innerHeight - 0.5; }, { passive: true });
      raf = requestAnimationFrame(frame);
      return true;
    },
    set: function (o, snap) {
      if (o.p1) state.p1 = o.p1.slice(); if (o.p2) state.p2 = o.p2.slice();
      if (o.r1 != null) state.r1 = o.r1; if (o.r2 != null) state.r2 = o.r2; if (o.inc != null) state.inc = o.inc;
      if (snap) { cur.p1 = state.p1.slice(); cur.p2 = state.p2.slice(); cur.r1 = state.r1; cur.r2 = state.r2; cur.inc = state.inc; }
    },
    pause: function (p) { paused = !!p; },
    resize: function () { if (gl) resize(); }
  };
})();
