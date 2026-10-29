/* hana.aistudio — hero AI core (Three.js, no build step) */
import * as THREE from './vendor/three.module.min.js';

const canvas = document.getElementById('core');
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(max-width: 980px)').matches;

function fail() { root.classList.add('no-webgl'); }

let renderer;
try {
  if (!canvas) throw 0;
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  if (!renderer.getContext()) throw 0;
} catch (e) { fail(); renderer = null; }

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  camera.position.set(0, 0, 8);

  const CRIMSON = new THREE.Color('#D7263D'), DEEP = new THREE.Color('#9B111E');
  const BLUE = new THREE.Color('#2F6BFF'), CYAN = new THREE.Color('#4CC9F0');

  const world = new THREE.Group(); scene.add(world);
  const rig = new THREE.Group(); world.add(rig);

  /* ---------- noise (Ashima simplex 3D) ---------- */
  const NOISE = `
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
  float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;

  /* ---------- liquid glass core ---------- */
  const uni = { uTime: { value: 0 }, uAmp: { value: .17 }, uMouse: { value: new THREE.Vector2() },
    uCrimson: { value: CRIMSON }, uDeep: { value: DEEP }, uBlue: { value: BLUE }, uCyan: { value: CYAN } };
  const coreMat = new THREE.ShaderMaterial({
    uniforms: uni, transparent: true,
    vertexShader: NOISE + `
      uniform float uTime; uniform float uAmp; uniform vec2 uMouse;
      varying vec3 vN; varying vec3 vView; varying float vNoise; varying vec3 vPos;
      float disp(vec3 p){ return snoise(p*.85 + vec3(uTime*.16, uTime*.12, -uTime*.09))*.8 + snoise(p*1.7 - uTime*.18)*.2; }
      void main(){
        vec3 p = position; vec3 n = normalize(normal);
        float d = disp(p + vec3(uMouse*.4, 0.));
        vec3 pos = p + n * d * uAmp;
        // approximate displaced normal
        vec3 t = normalize(cross(n, vec3(0.,1.,0.)+.001)); vec3 b = normalize(cross(n,t));
        float e=.02;
        vec3 pa = p + t*e; pa += normalize(pa)*disp(pa + vec3(uMouse*.4,0.))*uAmp;
        vec3 pb = p + b*e; pb += normalize(pb)*disp(pb + vec3(uMouse*.4,0.))*uAmp;
        vec3 nn = normalize(cross(pa-pos, pb-pos));
        if(dot(nn,n)<0.) nn=-nn;
        vNoise = d; vPos = pos;
        vec4 mv = modelViewMatrix * vec4(pos,1.);
        vN = normalize(normalMatrix * nn); vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uTime; uniform vec3 uCrimson,uDeep,uBlue,uCyan;
      varying vec3 vN; varying vec3 vView; varying float vNoise; varying vec3 vPos;
      void main(){
        vec3 n = normalize(vN); vec3 v = normalize(vView);
        float fr = pow(1. - max(dot(n,v),0.), 2.2);
        float mixv = smoothstep(-.6,.9, vPos.y*.55 + vPos.x*.35 + vNoise*.9 + sin(uTime*.3)*.2);
        vec3 body = mix(uDeep*.9, uBlue*.75, mixv);
        // thin-film iridescence bands
        float band = sin(fr*9. + vNoise*6. + uTime*.6)*.5+.5;
        vec3 irid = mix(uCrimson, uCyan, band);
        vec3 col = body*.5 + irid*fr*1.9 + mix(uCrimson,uCyan,mixv)*pow(1.-fr,3.)*.18;
        // specular highlights (two fake lights)
        vec3 h1 = normalize(normalize(vec3(-.5,.8,.9)) + v);
        vec3 h2 = normalize(normalize(vec3(.8,-.5,.6)) + v);
        col += vec3(1.)*pow(max(dot(n,h1),0.),70.)*.5;
        col += uCyan*pow(max(dot(n,h2),0.),24.)*.45;
        // inner caustic glow
        col += uCrimson*smoothstep(.2,1.,vNoise)*.35*(1.-fr);
        float a = clamp(.5 + fr*.6, 0., 1.);
        gl_FragColor = vec4(col, a);
      }`
  });
  const detail = mobile ? 40 : 64;
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, detail), coreMat);
  rig.add(core);

  /* inner light */
  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
  })();
  const halo = (color, s, o) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false })); m.scale.setScalar(s); return m; };
  const h1 = halo(CRIMSON, 5.2, .34), h2 = halo(BLUE, 7.5, .24), h3 = halo(new THREE.Color('#ff6a7c'), 2.6, .55), h4 = halo(0xffffff, 1.1, .5);
  h3.material.depthTest = false; h4.material.depthTest = false; h3.renderOrder = h4.renderOrder = 5; rig.add(h4);
  h1.position.set(.35, -.2, -1); h2.position.set(-.5, .4, -1.6); h3.position.set(0, 0, .2);
  world.add(h1, h2); rig.add(h3);

  /* wire shell */
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.75, 2)),
    new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: .09, blending: THREE.AdditiveBlending, depthWrite: false }));
  rig.add(wire);

  /* orbit rings */
  const ring = (r, color, o, rx, ry) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, .006, 6, 220), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.rotation.set(rx, ry, 0); return m;
  };
  const r1 = ring(2.15, CRIMSON, .55, 1.25, .35), r2 = ring(2.45, CYAN, .4, 1.6, -.5), r3 = ring(2.9, BLUE, .18, .3, 1.1);
  world.add(r1, r2, r3);
  // satellite nodes on rings
  const sat = (parent, r, color) => { const s = halo(color, .28, .95); s.position.set(r, 0, 0); const g = new THREE.Group(); g.add(s); parent.add(g); return g; };
  const s1 = sat(r1, 2.15, CRIMSON), s2 = sat(r2, 2.45, CYAN);
  s1.rotation.z = 1; s2.rotation.z = 3;

  /* neural mesh: nodes + nearest-neighbour links */
  const N = mobile ? 120 : 240;
  const nodes = [];
  for (let i = 0; i < N; i++) {
    const phi = Math.acos(1 - 2 * (i + .5) / N), th = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 2.0 + (Math.sin(i * 12.9898) * .5 + .5) * .9;
    nodes.push(new THREE.Vector3(Math.sin(phi) * Math.cos(th) * r, Math.cos(phi) * r * .92, Math.sin(phi) * Math.sin(th) * r));
  }
  const linkPos = [], linkCol = [];
  nodes.forEach((a, i) => {
    const near = nodes.map((b, j) => [a.distanceTo(b), j]).filter(x => x[1] !== i).sort((x, y) => x[0] - y[0]).slice(0, 3);
    near.forEach(([dd, j]) => { if (j < i || dd > .85) return; const b = nodes[j];
      linkPos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      const ca = a.y > 0 ? CYAN : CRIMSON, cb = b.y > 0 ? BLUE : DEEP;
      linkCol.push(ca.r, ca.g, ca.b, cb.r, cb.g, cb.b); });
  });
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.Float32BufferAttribute(linkPos, 3));
  lg.setAttribute('color', new THREE.Float32BufferAttribute(linkCol, 3));
  const links = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: .32, blending: THREE.AdditiveBlending, depthWrite: false }));
  const neural = new THREE.Group(); neural.add(links); world.add(neural);

  /* particles (dust + nodes) */
  const P = mobile ? 700 : 1600;
  const pp = new Float32Array((P + N) * 3), pc = new Float32Array((P + N) * 3), ps = new Float32Array(P + N), ph = new Float32Array(P + N);
  for (let i = 0; i < P; i++) {
    const u = Math.random(), v = Math.random(), th = u * Math.PI * 2, phi = Math.acos(2 * v - 1);
    const r = 2.2 + Math.pow(Math.random(), 1.6) * 4.2;
    pp.set([Math.sin(phi) * Math.cos(th) * r, Math.cos(phi) * r * .7, Math.sin(phi) * Math.sin(th) * r], i * 3);
    const c = Math.random() < .55 ? CYAN.clone().lerp(BLUE, Math.random()) : CRIMSON.clone().lerp(DEEP, Math.random() * .5);
    pc.set([c.r, c.g, c.b], i * 3); ps[i] = Math.random() * 1.6 + .4; ph[i] = Math.random() * 6.28;
  }
  nodes.forEach((n, k) => { const i = P + k; pp.set([n.x, n.y, n.z], i * 3); const c = n.y > 0 ? CYAN : CRIMSON; pc.set([c.r, c.g, c.b], i * 3); ps[i] = 3.2; ph[i] = k; });
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  pg.setAttribute('color', new THREE.BufferAttribute(pc, 3));
  pg.setAttribute('aSize', new THREE.BufferAttribute(ps, 1));
  pg.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
  const pMat = new THREE.ShaderMaterial({
    uniforms: { uTime: uni.uTime, uDpr: { value: renderer.getPixelRatio() } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aSize; attribute float aPhase; attribute vec3 color; uniform float uTime; uniform float uDpr; varying vec3 vC; varying float vA;
      void main(){ vC=color; vec4 mv=modelViewMatrix*vec4(position,1.); vA=.45+.55*sin(uTime*1.3+aPhase);
      gl_PointSize = aSize*uDpr*(9./-mv.z)*(.75+.25*vA); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: `varying vec3 vC; varying float vA; void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,0.,d); gl_FragColor=vec4(vC*(1.2+a), a*a*vA); }`
  });
  const dust = new THREE.Points(pg, pMat); neural.add(dust);

  /* ---------- layout ---------- */
  let W = 0, H = 0;
  function layout() {
    const r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z, visW = visH * camera.aspect;
    if (W > 980) { world.position.set(-visW * .23, 0, 0); world.scale.setScalar(Math.min(1.05, visW / 11)); }
    else { const s = Math.min(1.05, visW / 5.0); world.scale.setScalar(s); world.position.set(0, visH * .22, 0); }
  }
  layout(); addEventListener('resize', layout);

  /* ---------- input ---------- */
  const target = new THREE.Vector2(), cur = new THREE.Vector2();
  addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; target.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1)); }, { passive: true });
  let gyro = false;
  addEventListener('deviceorientation', e => { if (e.gamma == null) return; gyro = true; target.set(THREE.MathUtils.clamp(e.gamma / 30, -1, 1), THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1)); }, { passive: true });

  /* ---------- loop ---------- */
  let running = true, visible = true, last = performance.now(), t = 0;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 }).observe(canvas);
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });
  let scrollK = 0; addEventListener('scroll', () => { scrollK = Math.min(scrollY / innerHeight, 1.2); }, { passive: true });

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (!running || !visible) return;
    if (!reduce) t += dt;
    if (mobile && !gyro && !reduce) target.set(Math.sin(t * .35) * .5, Math.cos(t * .27) * .35);
    cur.lerp(target, .045);
    uni.uTime.value = t;
    uni.uMouse.value.copy(cur);
    rig.rotation.y = t * .12 + cur.x * .55;
    rig.rotation.x = -cur.y * .4 + Math.sin(t * .2) * .1;
    wire.rotation.y = -t * .18; wire.rotation.z = t * .05;
    neural.rotation.y = t * .035 + cur.x * .25; neural.rotation.x = -cur.y * .18;
    r1.rotation.z = t * .25; r2.rotation.z = -t * .18; r3.rotation.z = t * .08;
    s1.rotation.z = 1 + t * .6; s2.rotation.z = 3 - t * .45;
    h1.material.opacity = .28 + Math.sin(t * .8) * .06;
    uni.uAmp.value = .17 + Math.sin(t * .4) * .04 + cur.length() * .05;
    h3.material.opacity = .45 + Math.sin(t * 1.1) * .12;
    world.rotation.z = cur.x * -.05;
    camera.position.z = 8 + scrollK * 2.2;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  renderer.render(scene, camera);
  root.classList.add('webgl-ready');
  window.__coreReady = true;
}
