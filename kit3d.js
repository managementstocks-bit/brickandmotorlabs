import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const C = {
  blue: 0x2e9be5, yellow: 0xffd21e, black: 0x1a1a1a, orange: 0xf5800e,
  green: 0x8dc63f, gray: 0xb7bcc2, white: 0xf2f3f5, lime: 0x6fcf2c,
  red: 0xe04a3a, clear: 0xdfe8ee
};
const mats = {};
export function M(color, o) {
  const k = color + (o ? JSON.stringify(o) : '');
  if (!mats[k]) mats[k] = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.6, metalness: 0.05 }, o));
  return mats[k];
}
export function box(w, h, d, color, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(color));
  m.position.set(x, y, z); return m;
}
export function cyl(rt, rb, h, color, seg = 20, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), M(color));
  m.position.set(x, y, z); return m;
}
// gear/wheel with axle along Z (spins about Z), radius r
export function disc(r, th, color, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, th, 24), M(color));
  m.rotation.x = Math.PI / 2; m.position.set(x, y, z); return m;
}
export function gear(r, th, color, teeth = 12, x = 0, y = 0, z = 0) {
  const g = new THREE.Group();
  g.add(disc(r, th, color));
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const t = box(0.28, 0.28, th, color);
    t.position.set(Math.cos(a) * (r + 0.12), Math.sin(a) * (r + 0.12), 0);
    t.rotation.z = a; g.add(t);
  }
  g.position.set(x, y, z); return g;
}
export function wheel(r, hub, x = 0, y = 0, z = 0) {
  const g = new THREE.Group();
  g.add(disc(r, r * 0.7, C.black));
  g.add(disc(r * 0.62, r * 0.8, hub));
  g.add(disc(r * 0.16, r * 0.9, C.black));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const s = box(r * 0.2, r * 0.5, r * 0.75, hub);
    s.position.set(Math.cos(a) * r * 0.35, Math.sin(a) * r * 0.35, 0);
    s.rotation.z = a; g.add(s);
  }
  g.position.set(x, y, z); return g;
}
export function beam(len, color, x = 0, y = 0, z = 0) {
  const m = box(len, 0.5, 0.3, color, x, y, z); return m;
}

export function viewer(el, build) {
  const w = el.clientWidth, h = el.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.setSize(w, h); el.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(40, w / h, 0.1, 300);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.1));
  const dl = new THREE.DirectionalLight(0xffffff, 1.4); dl.position.set(6, 10, 8); scene.add(dl);
  const model = build(THREE);
  scene.add(model.group);
  const target = model.center || new THREE.Vector3(0, 2, 0);
  let yaw = 0.7, pitch = 0.32, dist = model.dist || 22, tyaw = yaw, tpitch = pitch, tdist = dist;
  let dragging = false, px = 0, py = 0;
  el.style.touchAction = 'none';
  el.addEventListener('pointerdown', e => { dragging = true; px = e.clientX; py = e.clientY; });
  addEventListener('pointerup', () => dragging = false);
  addEventListener('pointermove', e => {
    if (!dragging) return;
    tyaw += (e.clientX - px) * 0.005; tpitch = Math.max(0.05, Math.min(1.3, tpitch + (e.clientY - py) * 0.004));
    px = e.clientX; py = e.clientY;
  });
  el.addEventListener('wheel', e => { e.preventDefault(); tdist = Math.max(6, Math.min(60, tdist + e.deltaY * 0.02)); }, { passive: false });
  function resize() {
    const W = el.clientWidth, H = el.clientHeight;
    renderer.setSize(W, H); cam.aspect = W / H; cam.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    if (!dragging) tyaw += 0.0016;
    yaw += (tyaw - yaw) * 0.12; pitch += (tpitch - pitch) * 0.12; dist += (tdist - dist) * 0.12;
    cam.position.set(target.x + dist * Math.cos(pitch) * Math.sin(yaw), target.y + dist * Math.sin(pitch), target.z + dist * Math.cos(pitch) * Math.cos(yaw));
    cam.lookAt(target);
    if (model.update) model.update(t);
    renderer.render(scene, cam);
  })();
}

export const MODELS = {};

MODELS.bike = () => {
  const g = new THREE.Group();
  const fw = wheel(2, C.blue, -3.4, 2, 0), rw = wheel(2, C.blue, 3.4, 2, 0);
  const fork = box(0.5, 4.4, 0.5, C.blue, -3.1, 3.4, 0); fork.rotation.z = 0.25;
  const down = box(5.4, 0.6, 0.5, C.blue, -0.6, 3.2, 0); down.rotation.z = 0.5;
  const top = box(6.4, 0.6, 0.5, C.blue, 0, 4.8, 0);
  const rear = box(0.6, 3.6, 0.5, C.blue, 3.1, 3.4, 0); rear.rotation.z = -0.2;
  const seat = box(2.4, 0.7, 1.2, C.yellow, 0.4, 5.4, 0);
  const bar = cyl(0.16, 0.16, 2.2, C.black, 8, -3.4, 5.4, 0); bar.rotation.x = Math.PI / 2;
  const ex1 = cyl(0.28, 0.28, 1.6, C.black, 10, 3.2, 5.4, 0.4); ex1.rotation.z = -0.7;
  const ex2 = cyl(0.28, 0.28, 1.6, C.black, 10, 3.2, 5.4, -0.4); ex2.rotation.z = -0.7;
  g.add(fw, rw, fork, down, top, rear, seat, bar, ex1, ex2);
  return { group: g, center: new THREE.Vector3(0, 3.4, 0), dist: 16, update: t => { fw.rotation.z = rw.rotation.z = -t * 4; } };
};

MODELS['ferris-wheel'] = () => {
  const g = new THREE.Group();
  g.add(box(9, 0.5, 6, C.green, 0, 0.25, 0));
  g.add(box(0.6, 6.4, 0.6, C.black, -1.6, 3.4, 0), box(0.6, 6.4, 0.6, C.black, 1.6, 3.4, 0));
  const wg = new THREE.Group(); wg.position.set(0, 7, 0);
  const a1 = box(9.6, 0.5, 0.4, C.blue); a1.rotation.z = Math.PI / 4;
  const a2 = box(9.6, 0.5, 0.4, C.blue); a2.rotation.z = -Math.PI / 4;
  wg.add(a1, a2, gear(2.4, 0.6, C.yellow, 16));
  const seats = [];
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + i * Math.PI / 2;
    const s = box(2, 0.6, 1.1, C.yellow, Math.cos(a) * 4.8, Math.sin(a) * 4.8, 0);
    seats.push(s); wg.add(s);
  }
  g.add(wg, gear(0.9, 0.5, C.orange, 8, 2.4, 4.2, 0.6));
  return { group: g, center: new THREE.Vector3(0, 6, 0), dist: 22, update: t => { const r = t * 0.7; wg.rotation.z = r; seats.forEach(s => s.rotation.z = -r); } };
};

MODELS['queaky-charge'] = () => {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(1.5, 3.4, 8, 20), M(C.lime));
  body.position.y = 3.4; body.scale.set(0.9, 1, 0.55);
  g.add(body, disc(0.5, 0.15, C.white, -0.6, 4.6, 0.85), disc(0.5, 0.15, C.white, 0.6, 4.6, 0.85));
  g.add(disc(0.2, 0.2, C.black, -0.6, 4.6, 0.95), disc(0.2, 0.2, C.black, 0.6, 4.6, 0.95));
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.12, 8, 20, Math.PI), M(C.white));
  smile.position.set(0, 3.6, 0.85); g.add(smile);
  const hL = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.16, 8, 20), M(C.gray)); hL.position.set(-1.5, 4.6, 0);
  const hR = hL.clone(); hR.position.x = 1.5; g.add(hL, hR);
  return { group: g, center: new THREE.Vector3(0, 3.4, 0), dist: 12, update: t => { const s = 1 + Math.sin(t * 4) * 0.07; body.scale.y = s; body.scale.x = 0.9 * (2 - s); } };
};

MODELS.buddy = () => {
  const g = new THREE.Group();
  g.add(box(0.5,2.6,0.5,C.gray,-0.9,1.3,0), box(0.5,2.6,0.5,C.gray,0.9,1.3,0));
  g.add(box(1.2,0.4,1.6,C.blue,-0.9,0.2,0.2), box(1.2,0.4,1.6,C.blue,0.9,0.2,0.2));
  const head = disc(1.3,0.5,C.yellow,0,6.6,0);
  const armL = box(2.8,0.5,0.5,C.orange,-2.6,5,0); armL.rotation.z=0.5;
  const armR = box(2.8,0.5,0.5,C.orange,2.6,5,0); armR.rotation.z=-0.5;
  g.add(box(3,3,1.4,C.green,0,4,0), disc(1.2,0.3,C.yellow,0,4.2,0.8), head, armL, armR);
  g.add(disc(0.18,0.2,C.black,-0.4,6.8,0.5), disc(0.18,0.2,C.black,0.4,6.8,0.5));
  return { group:g, center:new THREE.Vector3(0,4,0), dist:15, update:t=>{ armL.rotation.z=0.5+Math.sin(t*2.4)*0.35; armR.rotation.z=-0.5-Math.sin(t*2.4)*0.35; head.rotation.z=Math.sin(t*1.2)*0.15; } };
};

MODELS.crawlers = () => {
  const g = new THREE.Group();
  const body = box(5,1.4,2.4,C.blue,0,3.4,0);
  g.add(body, box(1.6,1.2,2.6,C.black,0,4.6,0));
  const legs=[], gs=[];
  for (const sx of [-1.6,1.6]) for (const sz of [-1.4,1.4]) {
    const gg = gear(1.6,0.5,C.yellow,12,sx,2,sz); gs.push(gg); g.add(gg);
    const leg = box(0.6,3.4,0.5,C.orange,sx,1.6,sz+0.5); legs.push(leg); g.add(leg);
  }
  return { group:g, center:new THREE.Vector3(0,2.6,0), dist:15, update:t=>{ gs.forEach(x=>x.rotation.z=t*3); legs.forEach((l,i)=>{ l.rotation.z=Math.sin(t*3+i*1.7)*0.5; }); body.position.y=3.4+Math.abs(Math.sin(t*3))*0.3; } };
};

MODELS.rover = () => {
  const g = new THREE.Group();
  g.add(box(2.6,2,2,C.blue,-3,4.4,0), disc(0.4,0.2,C.white,-3.5,4.8,1.05), disc(0.4,0.2,C.white,-2.5,4.8,1.05));
  g.add(box(6,1,2.6,C.black,0,2.6,0), box(1.6,1.4,1.8,C.clear,2.4,4,0));
  const ws=[];
  for (const sx of [-2.4,2.4]) for (const sz of [-1.5,1.5]) { const w=wheel(1.4,C.blue,sx,1.4,sz); ws.push(w); g.add(w); }
  for (const sz of [-1.5,1.5]) g.add(box(7,0.4,0.5,C.black,0,2.6,sz+ (sz>0?0.9:-0.9)));
  return { group:g, center:new THREE.Vector3(0,2.6,0), dist:15, update:t=>{ ws.forEach(w=>w.rotation.z=-t*3); } };
};

MODELS['gear-box'] = () => {
  const g = new THREE.Group();
  g.add(box(7,0.5,4,C.green,0,0.6,0), box(7,0.5,4,C.green,0,5.4,0));
  for (const sx of [-2.6,2.6]) for (const sz of [-1.6,1.6]) g.add(box(0.5,4.6,0.5,C.orange,sx,3,sz));
  const g1=gear(1.6,0.5,C.yellow,14,0,3,0), g2=gear(1,0.5,C.yellow,10,1.9,3,0);
  g.add(g1,g2);
  const ws=[];
  for (const sx of [-2.8,2.8]) for (const sz of [-1.8,1.8]) { const w=wheel(1.2,C.orange,sx,1.2,sz); ws.push(w); g.add(w); }
  return { group:g, center:new THREE.Vector3(0,3,0), dist:16, update:t=>{ g1.rotation.z=t*2; g2.rotation.z=-t*3.2; ws.forEach(w=>w.rotation.z=-t*3); } };
};

MODELS['forklift-power'] = () => {
  const g = new THREE.Group();
  g.add(box(5,1,3,C.yellow,0.6,1.6,0), box(2,1.6,3,C.black,3,2.2,0));
  const ws=[];
  for (const sx of [-1.6,2.6]) for (const sz of [-1.6,1.6]) { const w=wheel(1.1,C.yellow,sx,1.1,sz); ws.push(w); g.add(w); }
  const carriage=new THREE.Group(); carriage.position.set(-3.1,2,0);
  carriage.add(box(0.4,2.6,2.4,C.yellow), box(2,0.3,0.6,C.black,-1,-1.2,0.6), box(2,0.3,0.6,C.black,-1,-1.2,-0.6));
  g.add(box(0.6,5,0.6,C.black,-2.6,3.6,0), carriage, gear(1.4,0.5,C.yellow,12,-2.2,4.4,1));
  return { group:g, center:new THREE.Vector3(0,3,0), dist:15, update:t=>{ carriage.position.y=2+(Math.sin(t*1.2)*0.5+0.5)*2.4; } };
};

MODELS['power-screw'] = () => {
  const g = new THREE.Group();
  g.add(box(7,0.6,3,C.green,0,1,0));
  const ws=[];
  for (const sx of [-2.6,2.6]) for (const sz of [-1.5,1.5]) { const w=wheel(1,C.orange,sx,1,sz); ws.push(w); g.add(w); }
  const top=box(6,0.4,2.6,C.green,0,4,0); g.add(top);
  const sc=[];
  for (const sz of [0.6,-0.6]) { const a=box(5,0.4,0.5,C.orange,0,2.5,sz), b=box(5,0.4,0.5,C.orange,0,2.5,sz); sc.push(a,b); g.add(a,b); }
  return { group:g, center:new THREE.Vector3(0,2.6,0), dist:15, update:t=>{ const h=2+ (Math.sin(t*1.4)*0.5+0.5)*1.6; top.position.y=h+1.6; sc[0].rotation.z=0.5; sc[1].rotation.z=-0.5; sc[2].rotation.z=-0.5; sc[3].rotation.z=0.5; const m=(h-2)/1.6; sc.forEach(s=>{ s.position.y=1+h/2; }); } };
};

MODELS['marble-run-2'] = () => {
  const g = new THREE.Group();
  g.add(box(10,0.4,5,C.gray,0,0.2,0), box(6,0.4,5,C.gray,7,0.2,0));
  const track=new THREE.Mesh(new THREE.TorusGeometry(4,0.3,10,40), M(C.lime));
  track.rotation.x=Math.PI/2; track.position.set(-1,4,0); g.add(track);
  for (const p of [[-5,0],[3,0],[-1,3.6],[-1,-3.6]]) g.add(cyl(0.2,0.2,4,C.yellow,8,p[0],2,p[1]));
  const lift=box(0.6,6,0.6,C.gray,6,3,0); g.add(lift, box(1.4,1.4,1.4,C.black,7.6,1,0));
  const marble=new THREE.Mesh(new THREE.SphereGeometry(0.4,16,16), M(C.red));
  g.add(marble);
  return { group:g, center:new THREE.Vector3(1,3,0), dist:20, update:t=>{ const a=t*1.2; marble.position.set(-1+Math.cos(a)*4, 4+Math.sin(a*0.5)*0.3, Math.sin(a)*4); } };
};

MODELS['rc-explorers'] = () => {
  const g = new THREE.Group();
  g.add(box(4,1,3,C.clear,0,1,0));
  const ws=[];
  for (const sx of [-2,2]) for (const sz of [-1.6,1.6]) { const w=wheel(1,C.orange,sx,1,sz); ws.push(w); g.add(w); }
  g.add(box(3,2.4,0.6,C.green,0,3,0), box(4,0.4,3,C.green,0,4.6,0));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.9,16,12,0,Math.PI*2,0,Math.PI/2), M(C.white)).translateY? box(0,0,0,C.white):box(0,0,0,C.white));
  const cup=cyl(0.7,0.5,0.9,C.white,16,0,5.3,0); g.add(cup);
  g.add(box(1.4,1.4,0.8,C.white,0,6.6,0), disc(0.15,0.2,C.black,-0.3,6.8,0.45), disc(0.15,0.2,C.black,0.3,6.8,0.45));
  return { group:g, center:new THREE.Vector3(0,3.4,0), dist:14, update:t=>{ ws.forEach(w=>w.rotation.z=-t*3); } };
};

MODELS['rc-rover'] = () => {
  const g = new THREE.Group();
  g.add(box(2.4,2,1.6,C.blue,0,6,0), disc(0.3,0.2,C.white,-0.5,6.4,0.85), disc(0.3,0.2,C.white,0.5,6.4,0.85));
  g.add(box(3,3.4,1.6,C.blue,0,3.4,0));
  const aL=box(2.6,0.5,0.5,C.blue,-2.4,4.6,0); aL.rotation.z=0.6;
  const aR=box(2.6,0.5,0.5,C.blue,2.4,4.6,0); aR.rotation.z=-0.6;
  g.add(aL,aR);
  const ws=[];
  for (const sx of [-1.6,1.6]) for (const sz of [-1.4,1.4]) { const w=wheel(1.2,C.blue,sx,1.2,sz); ws.push(w); g.add(w); }
  return { group:g, center:new THREE.Vector3(0,3.4,0), dist:14, update:t=>{ ws.forEach(w=>w.rotation.z=-t*2.6); aL.rotation.z=0.6+Math.sin(t*2)*0.2; aR.rotation.z=-0.6-Math.sin(t*2)*0.2; } };
};

MODELS['amusement-park'] = () => {
  const g = new THREE.Group();
  g.add(box(7,0.5,6,C.green,0,0.25,0), box(0.7,5,0.7,C.orange,-1,2.7,0), box(0.7,5,0.7,C.orange,1,2.7,0));
  const wg=new THREE.Group(); wg.position.set(0,6.4,0);
  for (let i=0;i<3;i++){ const a=i*Math.PI/3; const sp=box(9,0.5,0.5,C.orange); sp.rotation.z=a; wg.add(sp); }
  const pods=[];
  for (let i=0;i<6;i++){ const a=i*Math.PI/3; const w=wheel(1,C.orange,Math.cos(a)*4.5,Math.sin(a)*4.5,0); pods.push(w); wg.add(w); }
  g.add(wg, gear(1.4,0.5,C.yellow,12,0,4.4,1));
  return { group:g, center:new THREE.Vector3(0,5,0), dist:18, update:t=>{ const r=t*0.8; wg.rotation.z=r; pods.forEach(p=>p.rotation.z=-r); } };
};

MODELS['discovering-motions'] = () => {
  const g = new THREE.Group();
  g.add(box(5,0.5,4,C.gray,0,0.25,0));
  const top=box(4,0.4,3,C.green,0,4.6,0); g.add(top);
  const sc=[];
  for (const sz of [0.8,-0.8]) { const a=box(4.4,0.4,0.5,C.orange,0,2.5,sz), b=box(4.4,0.4,0.5,C.orange,0,2.5,sz); sc.push(a,b); g.add(a,b); }
  g.add(gear(1.4,0.5,C.yellow,12,2.6,1.4,1.4), box(1.4,1.2,1,C.black,-2.6,0.9,1.4));
  return { group:g, center:new THREE.Vector3(0,2.6,0), dist:14, update:t=>{ const h=2.4+(Math.sin(t*1.5)*0.5+0.5)*1.8; top.position.y=h+1.8; sc.forEach(s=>{ s.position.y=1+h/2; }); } };
};

MODELS['rc-megastructures'] = () => {
  const g = new THREE.Group();
  g.add(box(6,0.5,5,C.green,0,0.25,0));
  g.add(box(0.7,7,0.7,C.gray,-1,3.7,0), box(0.7,7,0.7,C.gray,1,3.7,0));
  const jib=new THREE.Group(); jib.position.set(0,7.2,0);
  jib.add(box(9,0.5,0.5,C.gray,2,0,0), box(3,0.5,0.5,C.gray,-2.5,0,0), gear(1.2,0.5,C.yellow,12,0,0,0.6));
  const hook=new THREE.Group(); hook.position.set(5,7.2,0);
  hook.add(cyl(0.06,0.06,3,C.black,6,0,-1.5,0), box(0.7,0.5,0.7,C.orange,0,-3.1,0));
  jib.add(hook); g.add(jib);
  return { group:g, center:new THREE.Vector3(0,4,0), dist:20, update:t=>{ jib.rotation.y=Math.sin(t*0.5)*0.7; hook.position.y= -1 - (Math.sin(t*1.1)*0.5+0.5)*2; } };
};

function init3D() {
  document.querySelectorAll('[data-kit3d]').forEach(el => {
    const b = MODELS[el.dataset.kit3d];
    if (b) viewer(el, b);
  });
}
if (document.readyState === 'loading') addEventListener('DOMContentLoaded', init3D); else init3D();
