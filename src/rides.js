import * as THREE from 'three';

/** Original hand-built amusement-ride miniatures. All rides face +X. */
export const RIDES = [
  { id: 'horse', name: 'Golden Galloper', emoji: '🐎', color: '#d2a44c', subtitle: 'A classic fairground favourite' },
  { id: 'vintagecar', name: 'Sunday Roadster', emoji: '🚗', color: '#e76f5c', subtitle: 'A little spin in a grand old car' },
  { id: 'biplane', name: 'Sky Explorer', emoji: '✈️', color: '#70a7ba', subtitle: 'Up, up, and around we go' },
  { id: 'rocket', name: 'Moon Rocket', emoji: '🚀', color: '#d97762', subtitle: 'A tiny mission to the stars' },
  { id: 'swan', name: 'Swan Princess', emoji: '🦢', color: '#e7c8a2', subtitle: 'A graceful ride on golden wings' },
  { id: 'teacup', name: 'Twinkle Teacup', emoji: '☕', color: '#b18bc0', subtitle: 'A wonderful little whirl' },
  { id: 'firetruck', name: 'Little Fire Engine', emoji: '🚒', color: '#cf584f', subtitle: 'Our brave little helper' },
  { id: 'train', name: 'Garden Express', emoji: '🚂', color: '#719e8a', subtitle: 'All aboard for another adventure' },
  { id: 'helicopter', name: 'Cloud Chopper', emoji: '🚁', color: '#e1b552', subtitle: 'Watch the world from above' },
  { id: 'submarine', name: 'Coral Submarine', emoji: '🐠', color: '#e2bb50', subtitle: 'A golden undersea adventure' },
  { id: 'elephant', name: 'Little Maharaja', emoji: '🐘', color: '#91a2b8', subtitle: 'Big ears and a gentle heart' },
  { id: 'dragon', name: 'Dragon Dreamer', emoji: '🐉', color: '#75a78d', subtitle: 'A friendly, magical flight' },
];

const mat = (color, metalness = 0.08, roughness = 0.3) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
const M = {
  ivory: mat('#fff0cf'), white: mat('#fffaf0'), gold: mat('#cba25c', .78, .24), brass: mat('#9c7540', .75, .3),
  dark: mat('#283c42', .2, .36), rubber: mat('#273238', .05, .64), leather: mat('#714b3c', .02, .62),
  red: mat('#cc5248'), coral: mat('#e37860'), blue: mat('#79b4c8'), navy: mat('#35596f'), green: mat('#7aa28a'),
  mint: mat('#a3c5ad'), purple: mat('#ac86b6'), lilac: mat('#d4b8d7'), yellow: mat('#edc763'),
  grey: mat('#a5b0be'), lightgrey: mat('#c7cbd0'), pink: mat('#dc9ca7'), glass: mat('#a9d6dd', .3, .17),
  black: mat('#12242b', .15, .2), orange: mat('#e7a15b'), lamp: new THREE.MeshStandardMaterial({color:'#fff1be',emissive:'#ffd37b',emissiveIntensity:.25,roughness:.25}),
};
const sphereG = new THREE.SphereGeometry(1, 18, 12);
const detailSphereG = new THREE.SphereGeometry(1, 10, 7);
const v = (a) => new THREE.Vector3(...a);
function mesh(g, geo, material, p = [0,0,0], r = [0,0,0]) {
  const o = new THREE.Mesh(geo, material); o.position.set(...p); o.rotation.set(...r); o.castShadow = true; o.receiveShadow = true; g.add(o); return o;
}
function oval(g, p, s, m, r = [0,0,0], small = false) { const o=mesh(g,small?detailSphereG:sphereG,m,p,r);o.scale.set(...s);return o; }
function cylinder(g, p, rt, rb, h, m, r=[0,0,0], n=20) {return mesh(g,new THREE.CylinderGeometry(rt,rb,h,n,1),m,p,r);}
function bar(g, a, b, radius, m, r2=radius, segments=12) {
  const d=v(b).sub(v(a)); const o=cylinder(g,v(a).add(v(b)).multiplyScalar(.5).toArray(),r2,radius,d.length(),m,[0,0,0],segments);
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()); return o;
}
function torus(g,p,r,t,m,rot=[0,0,0],arc=Math.PI*2) { return mesh(g,new THREE.TorusGeometry(r,t,7,32,arc),m,p,rot); }
function box(g,p,s,m,r=[0,0,0],radius=.06) {
  const [w,h,d]=s, b=Math.min(radius,w*.24,h*.24,d*.24), x=-w/2+b,y=-h/2+b, W=w-2*b,H=h-2*b, rr=Math.min(b,W*.3,H*.3);
  const sh=new THREE.Shape();sh.moveTo(x+rr,y);sh.lineTo(x+W-rr,y);sh.quadraticCurveTo(x+W,y,x+W,y+rr);sh.lineTo(x+W,y+H-rr);sh.quadraticCurveTo(x+W,y+H,x+W-rr,y+H);sh.lineTo(x+rr,y+H);sh.quadraticCurveTo(x,y+H,x,y+H-rr);sh.lineTo(x,y+rr);sh.quadraticCurveTo(x,y,x+rr,y);
  const geo=new THREE.ExtrudeGeometry(sh,{depth:Math.max(.001,d-2*b),bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:2,steps:1,curveSegments:3});geo.translate(0,0,-d/2+b);return mesh(g,geo,m,p,r);
}
function pipe(g,points,r,m,segments=20,radial=8) { const c=new THREE.CatmullRomCurve3(points.map(v)); return mesh(g,new THREE.TubeGeometry(c,segments,r,radial,false),m); }
function taper(g,points,radii,m,segments=22,radial=9) {
  const curve=new THREE.CatmullRomCurve3(points.map(v)), frames=curve.computeFrenetFrames(segments,false), vertices=[],normals=[],indices=[];
  for(let i=0;i<=segments;i++){const u=i/segments,p=curve.getPointAt(u),k=u*(radii.length-1),j=Math.min(radii.length-2,Math.floor(k)),r=THREE.MathUtils.lerp(radii[j],radii[j+1],k-j);for(let a=0;a<=radial;a++){const angle=a/radial*Math.PI*2,n=frames.normals[i].clone().multiplyScalar(Math.cos(angle)).addScaledVector(frames.binormals[i],Math.sin(angle));vertices.push(p.x+n.x*r,p.y+n.y*r,p.z+n.z*r);normals.push(n.x,n.y,n.z);}}
  for(let i=0;i<segments;i++)for(let j=0;j<radial;j++){const a=i*(radial+1)+j,b=a+radial+1;indices.push(a,b,a+1,b,b+1,a+1);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geo.setIndex(indices);geo.computeBoundingSphere();return mesh(g,geo,m);
}
function lathe(g,profile,m,p=[0,0,0],rot=[0,0,0],segments=32) {return mesh(g,new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),segments),m,p,rot);}
function badge(g,p,r,m=M.gold,rotation=[Math.PI/2,0,0]) {return cylinder(g,p,r,r,.025,m,rotation,20);}
function eye(g,p,scale=.055) {oval(g,p,[scale,scale*1.25,scale*.45],M.black,[0,0,0],true);oval(g,[p[0]+scale*.2,p[1]+scale*.35,p[2]+Math.sign(p[2])*.02],[scale*.23,scale*.23,scale*.2],M.white,[0,0,0],true);}
function seat(g,p,w=.54,d=.56,m=M.leather,back=true) {box(g,p,[w,.10,d],m,[0,0,0],.05);if(back)box(g,[p[0]-w*.42,p[1]+.20,p[2]],[.105,.38,d*.96],m,[0,0,-.12],.05);g.userData.seat={x:p[0]+.03,y:p[1]+.055,z:p[2]};}
function wheel(g,x,y,z,r=.29) {
  const side=Math.sign(z)||1; cylinder(g,[x,y,z],r,r,.18,M.rubber,[Math.PI/2,0,0],24);
  cylinder(g,[x,y,z+side*.10],r*.73,r*.73,.025,M.ivory,[Math.PI/2,0,0],24);
  cylinder(g,[x,y,z+side*.122],r*.47,r*.47,.03,M.gold,[Math.PI/2,0,0],20);
  cylinder(g,[x,y,z+side*.147],r*.17,r*.17,.035,M.brass,[Math.PI/2,0,0],12);
}
function rail(g,points,r=.023,m=M.gold){return pipe(g,points,r,m,16,7);}
function tinyBolt(g,p,m=M.gold){return oval(g,p,[.026,.026,.018],m,[0,0,0],true);}
function steering(g,p,r=.19){const o=torus(g,p,r,.022,M.leather,[0,Math.PI/2,0]);bar(g,[p[0],p[1]-r,p[2]],[p[0],p[1]+r,p[2]],.012,M.gold);bar(g,[p[0],p[1],p[2]-r],[p[0],p[1],p[2]+r],.012,M.gold);return o;}
function fin(g,points,depth,m,p=[0,0,0],rot=[0,0,0]) { const s=new THREE.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath(); const geo=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2,steps:1,curveSegments:5});geo.translate(0,0,-depth/2);return mesh(g,geo,m,p,rot); }

function horse() {
  const g=new THREE.Group();
  oval(g,[0,1.12,0],[.65,.38,.30],M.ivory);oval(g,[.44,1.22,0],[.30,.40,.29],M.ivory);oval(g,[-.42,1.13,0],[.33,.36,.31],M.ivory);
  taper(g,[[.39,1.22,0],[.52,1.60,0],[.57,1.91,0]],[.27,.22,.15],M.ivory,20,12);
  oval(g,[.73,1.89,0],[.31,.21,.18],M.ivory,[0,0,-.15]);oval(g,[.96,1.78,0],[.20,.14,.155],M.ivory);
  for(const z of [-.115,.115]){taper(g,[[.57,2.01,z],[.54,2.20,z],[.65,2.17,z]],[.075,.04,.001],M.ivory,10,8);oval(g,[.59,2.12,z],[.028,.07,.032],M.pink,[0,0,-.2],true);eye(g,[.80,1.94,z<0?-.175:.175],.045);oval(g,[1.06,1.80,z],[.035,.025,.016],M.brass,[0,0,0],true);}
  for(const z of [-.22,.22]) {
    taper(g,[[.42,1.05,z],[.42,.72,z],[.70,.54,z],[.70,.24,z]],[.13,.10,.07,.065],M.ivory,18,9);
    box(g,[.73,.18,z],[.22,.16,.17],M.dark,[0,0,-.12],.035);cylinder(g,[.70,.30,z],.078,.075,.09,M.gold);
    taper(g,[[-.42,1.04,z],[-.58,.72,z],[-.37,.48,z],[-.46,.13,z]],[.145,.115,.065,.065],M.ivory,18,9);
    box(g,[-.45,.075,z],[.23,.15,.18],M.dark,[0,0,-.05],.03);cylinder(g,[-.45,.20,z],.078,.075,.08,M.gold);
  }
  taper(g,[[-.60,1.27,0],[-.86,1.20,0],[-1.02,.86,.03],[-.97,.49,.06]],[.15,.14,.10,.015],M.leather,21,10);
  taper(g,[[.46,1.31,0],[.37,1.64,0],[.44,1.96,0],[.57,2.04,0]],[.095,.10,.095,.03],M.leather,22,9);
  oval(g,[-.10,1.445,0],[.40,.065,.35],M.blue);oval(g,[-.12,1.50,0],[.28,.065,.27],M.leather);
  oval(g,[-.37,1.54,0],[.07,.10,.27],M.leather);oval(g,[.14,1.55,0],[.065,.09,.22],M.leather);
  g.userData.seat={x:-.09,y:1.55,z:0};
  for(const s of [-1,1]) {
    rail(g,[[.94,1.88,s*.15],[.80,1.72,s*.19],[.63,1.78,s*.19]],.018,M.gold);
    rail(g,[[.67,1.89,s*.18],[.51,1.55,s*.30],[.18,1.46,s*.30]],.016,M.leather);
    rail(g,[[-.04,1.48,s*.29],[-.04,1.20,s*.33],[-.03,1.05,s*.36]],.025,M.leather);
    torus(g,[-.03,.99,s*.36],.105,.018,M.gold,[0,0,0]);
    badge(g,[.33,1.27,s*.30],.075,M.gold);tinyBolt(g,[-.25,1.40,s*.31]);
  }
  return g;
}

function vintagecar() {
  const g=new THREE.Group();
  box(g,[0,.45,0],[2.25,.20,.97],M.dark,[0,0,0],.06);
  box(g,[0,.69,0],[2.05,.40,.94],M.coral,[0,0,0],.14);
  oval(g,[.65,.89,0],[.58,.28,.46],M.coral);box(g,[.87,.88,0],[.28,.38,.78],M.coral,[0,0,0],.09);
  box(g,[-.81,.87,0],[.36,.40,.86],M.coral,[0,0,0],.10);
  for(const s of [-1,1]) {
    box(g,[-.29,.80,s*.45],[.75,.37,.11],M.coral,[0,0,0],.05);
    rail(g,[[-1.10,.72,s*.57],[-.91,.88,s*.57],[-.65,.88,s*.57],[-.45,.63,s*.57],[.43,.63,s*.57],[.65,.88,s*.57],[.91,.88,s*.57],[1.08,.73,s*.57]],.065,M.coral);
    rail(g,[[-.94,.75,s*.55],[-.71,.86,s*.55]],.018,M.gold);
    wheel(g,-.74,.34,s*.52,.32);wheel(g,.75,.34,s*.52,.32);
    box(g,[-.12,.52,s*.66],[.65,.06,.22],M.gold,[0,0,0],.02);
    box(g,[-.35,.91,s*.52],[.17,.035,.03],M.gold,[0,0,0],.01);
  }
  seat(g,[-.36,.80,0],.53,.70,M.leather);
  box(g,[.27,1.09,0],[.045,.37,.80],M.glass,[0,0,-.18],.018);
  for(const s of [-1,1])bar(g,[.23,.89,s*.41],[.30,1.30,s*.41],.025,M.gold);
  bar(g,[.30,1.30,-.41],[.30,1.30,.41],.023,M.gold);bar(g,[.23,.91,-.41],[.23,.91,.41],.023,M.gold);
  bar(g,[.18,.88,0],[.00,1.02,0],.035,M.dark);steering(g,[.01,1.03,0],.16);
  box(g,[1.075,.87,0],[.07,.43,.56],M.gold,[0,0,0],.06);
  box(g,[1.12,.87,0],[.025,.32,.42],M.dark,[0,0,0],.03);
  for(let i=-3;i<=3;i++)bar(g,[1.14,.73,i*.053],[1.14,1.01,i*.053],.008,M.gold);
  for(const s of [-1,1]){cylinder(g,[1.04,.94,s*.40],.12,.13,.12,M.gold,[0,0,Math.PI/2]);cylinder(g,[1.108,.94,s*.40],.092,.092,.012,M.lamp,[0,0,Math.PI/2]);}
  box(g,[1.17,.51,0],[.10,.09,1.04],M.gold,[0,0,0],.025);box(g,[-1.17,.51,0],[.10,.09,1.04],M.gold,[0,0,0],.025);
  badge(g,[.79,1.16,0],.07,M.gold,[0,0,0]);return g;
}

function biplane() {
  const g=new THREE.Group();
  lathe(g,[[0,-1.08],[.09,-1.04],[.16,-.70],[.27,-.13],[.34,.40],[.29,.83],[.20,1.0],[0,1.03]],M.blue,[0,1.05,0],[0,0,-Math.PI/2],28);
  // Two elliptical airfoils, with brass leading edges and rigging.
  for(const y of [.83,1.57]){oval(g,[.19,y,0],[.40,.065,1.35],M.ivory);rail(g,[[.43,y,-1.20],[.55,y,0],[.43,y,1.20]],.022,M.gold);}
  for(const s of [-1,1]){bar(g,[.15,.89,s*.90],[.15,1.53,s*.95],.024,M.gold);bar(g,[-.07,.89,s*.90],[.41,1.53,s*.95],.014,M.dark);bar(g,[.41,.89,s*.90],[-.07,1.53,s*.95],.014,M.dark);}
  for(const z of [-.27,.27])bar(g,[.24,1.20,z],[.26,1.53,z*.9],.022,M.gold);
  oval(g,[-.36,1.30,0],[.34,.045,.23],M.leather);seat(g,[-.40,1.30,0],.39,.35,M.leather,false);
  oval(g,[-.08,1.38,0],[.05,.13,.22],M.glass);
  oval(g,[-.91,1.10,0],[.29,.045,.49],M.ivory);
  fin(g,[[-1.11,1.07],[-1.03,1.49],[-.85,1.49],[-.65,1.08]],.07,M.blue);
  for(const s of [-1,1]){bar(g,[.36,.82,s*.22],[.32,.33,s*.48],.038,M.gold);wheel(g,.32,.28,s*.48,.25);}
  bar(g,[-.86,.92,0],[-.94,.24,0],.035,M.gold);wheel(g,-.94,.20,0,.14);
  cylinder(g,[1.01,1.05,0],.22,.22,.18,M.gold,[0,0,Math.PI/2]);
  const prop=new THREE.Group();prop.position.set(1.14,1.05,0);g.add(prop);
  oval(prop,[0,0,0],[.045,.61,.075],M.leather,[.15,0,0]);oval(prop,[.025,0,0],[.10,.11,.11],M.gold);
  for(const s of [-1,1]){badge(g,[.22,1.64,s*.88],.12,M.blue,[0,0,0]);badge(g,[.22,1.655,s*.88],.065,M.coral,[0,0,0]);}
  g.userData.animate=(t,e=1)=>{prop.rotation.x=t*(5+e*15);};return g;
}

function rocket() {
  const g=new THREE.Group();
  lathe(g,[[0,0],[.30,.08],[.39,.22],[.48,.58],[.48,.93],[.43,1.30],[.31,1.66],[.13,1.94],[0,2.10]],M.ivory,[0,.16,0]);
  lathe(g,[[0,0],[.12,.15],[.26,.35],[.31,.43],[.28,.47]],M.coral,[0,1.79,0],[0,0,0],28);
  torus(g,[0,.45,0],.405,.035,M.gold,[Math.PI/2,0,0]);torus(g,[0,1.35,0],.415,.025,M.gold,[Math.PI/2,0,0]);
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3, f=new THREE.Group();f.rotation.y=a;g.add(f);fin(f,[[-.26,.66],[-.65,.55],[-.76,.0],[-.50,.0],[-.30,.25]],.09,M.coral);}
  cylinder(g,[0,.18,0],.29,.35,.18,M.brass);cylinder(g,[0,.08,0],.19,.25,.10,M.dark);
  for(const s of [-1,1]){cylinder(g,[.03,1.13,s*.456],.18,.18,.055,M.gold,[Math.PI/2,0,0]);cylinder(g,[.03,1.13,s*.49],.135,.135,.015,M.glass,[Math.PI/2,0,0]);for(let i=0;i<6;i++){const a=i*Math.PI/3;tinyBolt(g,[.03+Math.cos(a)*.155,1.13+Math.sin(a)*.155,s*.495]);}}
  // A real exterior rider's saddle, not a closed cockpit.
  box(g,[-.58,.87,0],[.48,.22,.51],M.coral,[0,0,0],.075);seat(g,[-.61,1.0,0],.42,.44,M.leather);
  for(const s of [-1,1]){rail(g,[[-.74,1.08,s*.28],[-.53,1.32,s*.28],[-.30,1.29,s*.28]],.025,M.gold);box(g,[-.38,.61,s*.35],[.35,.06,.16],M.gold,[0,0,0],.02);}
  return g;
}

function swan() {
  const g=new THREE.Group();
  oval(g,[-.13,.65,0],[.84,.43,.49],M.ivory);oval(g,[-.41,.88,0],[.52,.24,.46],M.ivory);
  taper(g,[[.49,.69,0],[.81,1.01,0],[.69,1.42,0],[.57,1.68,0],[.75,1.85,0]],[.25,.17,.105,.105,.14],M.ivory,30,12);
  oval(g,[.81,1.84,0],[.21,.16,.145],M.ivory);taper(g,[[.94,1.82,0],[1.12,1.78,0],[1.19,1.74,0]],[.10,.08,.012],M.orange,9,8);
  for(const s of [-1,1]){eye(g,[.86,1.88,s*.135],.035);oval(g,[.95,1.83,s*.09],[.055,.05,.025],M.dark,[0,0,0],true);
    oval(g,[-.20,.88,s*.37],[.63,.19,.18],M.white,[s*.24,0,-.15]);
    for(let i=0;i<5;i++)taper(g,[[.25-i*.14,.90,s*.41],[-.34-i*.10,1.00,s*.48],[-.86-i*.025,1.10,s*.37]],[.075,.055,.002],i%2?M.ivory:M.white,12,7);
    rail(g,[[.29,.83,s*.40],[-.03,1.00,s*.48],[-.56,1.03,s*.44]],.018,M.gold);
  }
  taper(g,[[-.66,.72,0],[-1.00,.95,0],[-1.16,1.18,0]],[.25,.12,.003],M.ivory,15,9);
  seat(g,[-.08,.93,0],.48,.50,M.purple,false);
  for(const s of [-1,1])rail(g,[[.29,.90,s*.26],[.45,1.03,s*.24],[.52,1.15,s*.13]],.022,M.gold);
  oval(g,[-.04,.24,0],[.83,.10,.52],M.blue);return g;
}

function teacup() {
  const g=new THREE.Group();
  lathe(g,[[0,0],[.63,0],[.83,.04],[1.02,.11],[1.05,.16],[.99,.20],[.77,.20],[.58,.14],[0,.14]],M.ivory);
  torus(g,[0,.17,0],1.01,.022,M.gold,[Math.PI/2,0,0]);
  lathe(g,[[0,.14],[.40,.14],[.46,.23],[.52,.32],[.69,.55],[.78,.89],[.81,1.08],[.80,1.13],[.74,1.13],[.71,.91],[.62,.58],[.45,.36],[0,.36]],M.lilac);
  torus(g,[0,1.125,0],.778,.031,M.gold,[Math.PI/2,0,0]);torus(g,[0,.34,0],.526,.021,M.gold,[Math.PI/2,0,0]);
  pipe(g,[[.75,1.01,0],[1.14,1.05,0],[1.28,.80,0],[1.09,.51,0],[.65,.49,0]],.078,M.gold,26,10);
  for(let i=0;i<10;i++){const a=i*Math.PI*2/10,x=Math.cos(a)*.725,z=Math.sin(a)*.725;const flower=new THREE.Group();flower.position.set(x,.78,z);flower.rotation.y=Math.PI/2-a;g.add(flower);for(let j=0;j<5;j++){const b=j*Math.PI*2/5;oval(flower,[Math.cos(b)*.043,Math.sin(b)*.043,0],[.026,.036,.012],M.ivory,[0,0,b],true);}oval(flower,[0,0,.014],[.025,.025,.012],M.gold,[0,0,0],true);}
  seat(g,[-.24,.53,0],.43,.59,M.purple,true);
  bar(g,[.24,.38,0],[.24,.88,0],.028,M.gold);torus(g,[.24,.90,0],.23,.025,M.gold,[Math.PI/2,0,0]);
  for(let i=0;i<3;i++){const a=i*2*Math.PI/3;bar(g,[.24,.90,0],[.24+Math.cos(a)*.23,.90,Math.sin(a)*.23],.015,M.gold);}
  return g;
}

function firetruck() {
  const g=new THREE.Group();
  box(g,[0,.42,0],[2.32,.17,.97],M.dark);box(g,[0,.64,0],[2.21,.36,.95],M.red,[0,0,0],.075);
  box(g,[.74,.97,0],[.60,.42,.91],M.red,[0,0,0],.08);box(g,[-.86,.85,0],[.37,.29,.91],M.red,[0,0,0],.06);
  for(const s of [-1,1]){wheel(g,.78,.32,s*.51,.29);wheel(g,-.76,.32,s*.51,.29);box(g,[-.33,.73,s*.49],[.88,.23,.025],M.gold,[0,0,0],.012);for(let i=0;i<5;i++)bar(g,[-.67+i*.14,.64,s*.515],[-.67+i*.14,.82,s*.515],.008,M.brass);box(g,[.20,.51,s*.64],[.54,.055,.23],M.gold,[0,0,0],.02);}
  seat(g,[.01,.85,0],.48,.63,M.leather);bar(g,[.49,.99,0],[.29,1.12,0],.026,M.gold);steering(g,[.28,1.12,0],.15);
  // Open sides and a slim, high canopy leave the rider visible.
  for(const z of [-.43,.43]){bar(g,[.44,1.12,z],[.43,1.78,z],.024,M.gold);bar(g,[-.36,.95,z],[-.36,1.78,z],.024,M.gold);}
  box(g,[.04,1.80,0],[.97,.09,1.00],M.red,[0,0,0],.045);box(g,[.46,1.44,0],[.035,.59,.79],M.glass,[0,0,0],.012);
  cylinder(g,[.02,1.92,0],.12,.14,.16,M.gold);oval(g,[.02,2.02,0],[.115,.10,.115],M.blue);
  for(const z of [-.34,.34]){bar(g,[-1.03,1.10,z],[-.45,1.29,z],.035,M.ivory);for(let i=0;i<5;i++){const x=-1.02+i*.14,y=1.11+i*.046;bar(g,[x,y,-.34],[x,y,.34],.021,M.gold);}}
  for(const s of [-1,1]){torus(g,[-.80,.98,s*.49],.17,.042,M.leather);torus(g,[-.80,.98,s*.49],.11,.027,M.leather);cylinder(g,[1.10,.92,s*.32],.095,.095,.045,M.lamp,[0,0,Math.PI/2]);}
  box(g,[1.135,.72,0],[.04,.24,.45],M.gold,[0,0,0],.025);for(let i=-2;i<=2;i++)bar(g,[1.16,.64,i*.075],[1.16,.80,i*.075],.012,M.dark);
  box(g,[1.19,.47,0],[.10,.09,1.03],M.gold,[0,0,0],.025);return g;
}

function train() {
  const g=new THREE.Group();
  box(g,[0,.43,0],[2.27,.18,.92],M.dark,[0,0,0],.04);box(g,[0,.56,0],[2.20,.15,1.0],M.red,[0,0,0],.03);
  cylinder(g,[.51,.95,0],.36,.36,1.03,M.green,[0,0,Math.PI/2],28);cylinder(g,[1.04,.95,0],.37,.37,.07,M.gold,[0,0,Math.PI/2],28);cylinder(g,[1.09,.95,0],.29,.29,.04,M.dark,[0,0,Math.PI/2]);
  cylinder(g,[.77,1.43,0],.13,.11,.37,M.dark);cylinder(g,[.77,1.65,0],.19,.14,.12,M.gold);oval(g,[.24,1.31,0],[.15,.15,.15],M.gold);
  for(const x of [.14,.88])torus(g,[x,.95,0],.366,.020,M.gold,[0,Math.PI/2,0]);
  for(const s of [-1,1]){for(const x of [-.77,-.20,.64])wheel(g,x,.30,s*.49,.27);bar(g,[-.77,.30,s*.63],[.64,.30,s*.63],.032,M.gold);box(g,[-.55,.91,s*.45],[.88,.62,.10],M.green,[0,0,0],.035);bar(g,[-.94,1.12,s*.44],[-.94,1.87,s*.44],.025,M.gold);bar(g,[-.12,1.13,s*.44],[-.12,1.87,s*.44],.025,M.gold);}
  box(g,[-.53,1.90,0],[1.13,.11,1.08],M.dark,[0,0,0],.05);box(g,[-.98,1.16,0],[.09,.71,.91],M.green,[0,0,0],.04);
  seat(g,[-.56,.99,0],.52,.65,M.leather);bar(g,[-.08,1.05,0],[-.22,1.19,0],.03,M.gold);steering(g,[-.23,1.19,0],.14);
  cylinder(g,[1.15,1.16,0],.11,.12,.09,M.gold,[0,0,Math.PI/2]);cylinder(g,[1.20,1.16,0],.08,.08,.015,M.lamp,[0,0,Math.PI/2]);
  fin(g,[[1.08,.53],[1.36,.20],[1.06,.23]],.86,M.gold);return g;
}

function helicopter() {
  const g=new THREE.Group();
  oval(g,[.20,.92,0],[.74,.49,.45],M.yellow);oval(g,[.69,1.01,0],[.39,.32,.40],M.glass);
  taper(g,[[-.38,1.01,0],[-.86,1.16,0],[-1.40,1.31,0]],[.24,.14,.055],M.yellow,20,10);
  fin(g,[[-1.41,1.28],[-1.53,1.76],[-1.32,1.71],[-1.12,1.28]],.07,M.coral);
  oval(g,[-1.21,1.29,0],[.25,.035,.40],M.coral);
  for(const s of [-1,1]){rail(g,[[.97,.36,s*.52],[.75,.25,s*.52],[-.70,.25,s*.52],[-.89,.31,s*.52]],.042,M.dark);bar(g,[.51,.65,s*.25],[.51,.27,s*.52],.033,M.gold);bar(g,[-.38,.65,s*.25],[-.38,.27,s*.52],.033,M.gold);rail(g,[[.73,.78,s*.40],[.49,1.17,s*.43],[.30,1.36,s*.22]],.023,M.gold);}
  // Open saddle aft of the bubble windscreen.
  seat(g,[-.11,1.24,0],.46,.49,M.leather,true);rail(g,[[.24,1.28,-.23],[.35,1.41,0],[.24,1.28,.23]],.023,M.gold);
  cylinder(g,[-.34,1.78,0],.065,.10,.74,M.gold);const rotor=new THREE.Group();rotor.position.set(-.34,2.15,0);g.add(rotor);
  for(let i=0;i<3;i++){const blade=new THREE.Group();blade.rotation.y=i*Math.PI*2/3;rotor.add(blade);box(blade,[.63,0,0],[1.22,.035,.12],M.dark,[0,0,0],.015);box(blade,[1.16,.006,0],[.12,.04,.12],M.ivory,[0,0,0],.012);}
  oval(rotor,[0,.025,0],[.14,.055,.14],M.gold);
  const tail=new THREE.Group();tail.position.set(-1.39,1.42,.10);g.add(tail);box(tail,[0,0,0],[.40,.06,.035],M.dark,[0,0,.2],.014);box(tail,[0,0,0],[.06,.40,.035],M.dark,[0,0,.2],.014);oval(tail,[0,0,.035],[.055,.055,.05],M.gold,[0,0,0],true);
  g.userData.animate=(t,e=1)=>{rotor.rotation.y=t*(3+e*12);tail.rotation.z=-t*(5+e*15);};return g;
}

function submarine() {
  const g=new THREE.Group();
  lathe(g,[[0,-1.15],[.19,-1.08],[.34,-.84],[.43,-.50],[.45,.38],[.38,.80],[.22,1.03],[0,1.10]],M.yellow,[0,.69,0],[0,0,-Math.PI/2],32);
  for(const x of [-.62,.62])torus(g,[x,.69,0],.418,.024,M.gold,[0,Math.PI/2,0]);
  for(const s of [-1,1]){for(const x of [-.58,0,.58]){const z=s*(x===0?.45:.411);cylinder(g,[x,.73,z],.16,.16,.06,M.gold,[Math.PI/2,0,0]);cylinder(g,[x,.73,z+s*.037],.116,.116,.018,M.glass,[Math.PI/2,0,0]);for(let k=0;k<4;k++){const a=k*Math.PI/2;tinyBolt(g,[x+Math.cos(a)*.14,.73+Math.sin(a)*.14,z+s*.05]);}}oval(g,[-.83,.72,s*.42],[.28,.04,.28],M.coral);}
  box(g,[-.10,1.19,0],[.76,.36,.58],M.yellow,[0,0,0],.08);seat(g,[-.16,1.37,0],.46,.45,M.leather,true);
  rail(g,[[.22,1.18,-.31],[.27,1.55,-.31],[.58,1.55,-.31]],.060,M.gold);cylinder(g,[.61,1.55,-.31],.085,.085,.09,M.dark,[0,0,Math.PI/2]);
  for(const s of [-1,1])rail(g,[[-.49,1.15,s*.34],[-.48,1.41,s*.34],[.16,1.41,s*.34],[.22,1.15,s*.34]],.022,M.gold);
  fin(g,[[-1.05,.69],[-1.31,1.13],[-1.35,.73],[-1.27,.28],[-1.03,.55]],.065,M.coral);
  const prop=new THREE.Group();prop.position.set(-1.29,.68,0);g.add(prop);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;oval(prop,[0,Math.sin(a)*.19,Math.cos(a)*.19],[.04,.17,.08],M.gold,[a+.5,0,0]);}oval(prop,[-.04,0,0],[.10,.08,.08],M.brass);
  for(const s of [-1,1])box(g,[0,.23,s*.29],[1.40,.10,.12],M.dark,[0,0,0],.035);
  g.userData.animate=(t,e=1)=>{prop.rotation.x=-t*(2+e*9);};return g;
}

function elephant() {
  const g=new THREE.Group();
  oval(g,[-.10,1.01,0],[.66,.49,.44],M.grey);oval(g,[.46,1.30,0],[.43,.44,.39],M.grey);
  for(const x of [-.46,.36])for(const z of [-.29,.29]){taper(g,[[x,.95,z],[x,.53,z],[x+.025,.16,z]],[.20,.17,.17],M.grey,12,10);oval(g,[x+.04,.14,z],[.20,.14,.19],M.grey);for(let i=-1;i<=1;i++)oval(g,[x+.20,.12,z+i*.075],[.035,.045,.035],M.ivory,[0,0,0],true);}
  for(const s of [-1,1]){oval(g,[.31,1.36,s*.38],[.29,.37,.11],M.grey,[s*.2,0,-.15]);oval(g,[.32,1.37,s*.475],[.20,.28,.025],M.pink,[s*.2,0,-.15]);eye(g,[.68,1.43,s*.255],.052);
    taper(g,[[.74,1.11,s*.26],[.91,1.05,s*.29],[1.01,1.19,s*.29]],[.065,.045,.002],M.ivory,12,8);
    rail(g,[[.05,1.30,s*.44],[-.31,1.31,s*.44],[-.58,1.18,s*.36]],.026,M.gold);
  }
  taper(g,[[.72,1.36,0],[.94,1.10,0],[1.02,.67,0],[1.23,.74,0],[1.27,1.04,0]],[.20,.16,.105,.085,.07],M.grey,28,11);
  for(let i=0;i<4;i++)rail(g,[[.91+i*.02,1.02-i*.07,-.12],[.99+i*.01,1.02-i*.07,0],[.91+i*.02,1.02-i*.07,.12]],.008,M.brass);
  taper(g,[[-.66,1.12,0],[-.88,.94,.02],[-.88,.62,.04]],[.055,.033,.015],M.grey,15,8);oval(g,[-.87,.60,.04],[.055,.10,.055],M.dark,[0,0,-.2],true);
  oval(g,[-.15,1.43,0],[.44,.11,.46],M.purple);oval(g,[-.15,1.50,0],[.37,.065,.38],M.gold);
  seat(g,[-.15,1.54,0],.46,.55,M.leather,false);
  for(const s of [-1,1])rail(g,[[-.45,1.54,s*.31],[-.43,1.76,s*.31],[.13,1.76,s*.31],[.15,1.54,s*.31]],.022,M.gold);
  oval(g,[.57,1.70,0],[.23,.055,.26],M.purple);badge(g,[.79,1.56,0],.075,M.gold,[0,0,Math.PI/2]);return g;
}

function dragon() {
  const g=new THREE.Group();
  oval(g,[-.12,.88,0],[.65,.40,.33],M.green);oval(g,[.25,1.08,0],[.38,.46,.32],M.green);
  taper(g,[[.29,1.15,0],[.46,1.56,0],[.65,1.66,0]],[.27,.22,.20],M.green,17,11);
  oval(g,[.72,1.62,0],[.31,.25,.24],M.green);oval(g,[.98,1.52,0],[.29,.16,.23],M.mint);
  for(const s of [-1,1]){eye(g,[.80,1.73,s*.22],.06);oval(g,[1.12,1.61,s*.13],[.035,.025,.020],M.dark,[0,0,0],true);
    taper(g,[[.57,1.81,s*.15],[.46,2.03,s*.21],[.35,2.10,s*.25]],[.075,.043,.003],M.gold,12,8);
    rail(g,[[1.20,1.46,s*.09],[1.00,1.41,s*.21],[.85,1.43,s*.22]],.012,M.dark);
    taper(g,[[.25,.78,s*.26],[.50,.49,s*.35],[.64,.24,s*.35]],[.14,.11,.085],M.green,15,8);oval(g,[.71,.20,s*.35],[.24,.11,.14],M.green);
    taper(g,[[-.48,.80,s*.26],[-.66,.50,s*.36],[-.45,.17,s*.40]],[.19,.13,.09],M.green,15,8);oval(g,[-.36,.13,s*.40],[.24,.12,.15],M.green);
    for(let i=-1;i<=1;i++){taper(g,[[.83,.19,s*.35+i*.07],[.96,.17,s*.35+i*.07]],[.035,.001],M.ivory,5,6);taper(g,[[-.23,.11,s*.40+i*.07],[-.11,.09,s*.40+i*.07]],[.035,.001],M.ivory,5,6);}
    const wing=new THREE.Group();wing.position.set(-.10,1.13,s*.23);wing.rotation.x=s*.95;wing.rotation.z=-.10;g.add(wing);
    fin(wing,[[.22,0],[.01,.68],[-.46,1.03],[-.38,.55],[-.75,.61],[-.57,.26],[-.88,.19],[-.55,-.10]],.035,M.mint);
    for(const tip of [[-.46,1.03],[-.75,.61],[-.88,.19]])rail(wing,[[.22,0,0],[-.13,.31,0],[tip[0],tip[1],0]],.025,M.gold);
  }
  taper(g,[[-.67,.93,0],[-1.01,.78,0],[-1.20,.43,.04],[-1.40,.47,.07],[-1.47,.73,.10]],[.22,.17,.10,.055,.002],M.green,27,10);
  for(let i=0;i<5;i++){const x=-.63-i*.14,y=.99-i*.055;fin(g,[[x+.10,y],[x-.04,y+.22],[x-.15,y-.04]],.055,M.gold);}
  oval(g,[.43,1.13,0],[.15,.31,.29],M.mint,[0,0,-.25]);
  oval(g,[-.16,1.24,0],[.34,.08,.30],M.coral);seat(g,[-.16,1.30,0],.44,.48,M.leather,false);
  for(const s of [-1,1])rail(g,[[.18,1.24,s*.24],[.31,1.40,s*.23],[.41,1.45,s*.20]],.023,M.gold);
  return g;
}

const factories={horse,vintagecar,biplane,rocket,swan,teacup,firetruck,train,helicopter,submarine,elephant,dragon};
export function createRide(id) {
  const model=(factories[id]||horse)();model.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(model), size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  // Consistent footprints, with natural relative heights rather than stretched sculptures.
  const scale=Math.min(2.45/Math.max(size.x,size.z),2.30/size.y);
  const root=new THREE.Group();root.name=`ride-${id}`;model.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);model.scale.setScalar(scale);root.add(model);
  const raw=model.userData.seat||{x:0,y:size.y*.6,z:0};root.userData.seat={x:(raw.x-center.x)*scale,y:(raw.y-bounds.min.y)*scale,z:(raw.z-center.z)*scale};
  root.userData.seatRotationY=Math.PI/2;root.userData.facing='+X';root.userData.animate=model.userData.animate||(()=>{});root.userData.id=id;
  root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  return root;
}
