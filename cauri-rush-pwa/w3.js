/* w3.js : modèles et décors 3D de Cauri Rush, construits avec les formes de g3.js.
   Convention : 1 unité = 20 px du jeu 2D. Les modèles regardent vers +x ; y est le haut ; la caméra est à +z. */
const W3=(function(){
'use strict';
const G=G3,N=G.N,SC=20,R={SC};
const PI=Math.PI;
const cl=(v,a,b)=>v<a?a:v>b?b:v;
/* ---------- aides de construction (dimensions en unités) ---------- */
function nd(par,prim,col,x,y,z,sx,sy,sz,o){const n=new N(prim,col,o);n.x=x||0;n.y=y||0;n.z=z||0;n.sx=sx;n.sy=sy==null?sx:sy;n.sz=sz==null?sx:sz;if(par)par.add(n);return n}
const B=(p,c,x,y,z,w,h,d,o)=>nd(p,'box',c,x,y,z,w,h,d,o);                    // boîte (largeur, hauteur, profondeur)
const S=(p,c,x,y,z,rx,ry,rz,o)=>nd(p,'sph',c,x,y,z,rx,ry,rz,o);              // sphère (rayons)
const Y=(p,c,x,y,z,r,h,o)=>nd(p,'cyl',c,x,y,z,r,h,r,o);                      // cylindre vertical
const K=(p,c,x,y,z,r,h,o)=>nd(p,'cone',c,x,y,z,r,h,r,o);                     // cône (pointe en haut)
const Q=(p,c,x,y,z,s,h,o)=>nd(p,'pyr',c,x,y,z,s/2,h,s/2,o);                  // pyramide (côté de base)
const D=(p,c,x,y,z,w,h,d,o)=>nd(p,'dia',c,x,y,z,w,h,d,o);                    // losange
const G0=(p,x,y,z)=>nd(p,null,null,x,y,z,1,1,1);                              // groupe
const R3=(n,x,y,z)=>{n.rx=x||0;n.ry=y||0;n.rz=z||0;return n};
const OL={ol:.045},OL2={ol:.06},OL3={ol:.035};
const mixc=G.mix,rgb=G.rgb;
R.nd=nd;R.B=B;R.S=S;R.Y=Y;R.K=K;R.Q=Q;R.D=D;R.G0=G0;R.R3=R3;R.cl=cl;

/* ---------- héros ---------- */
const SKIN=['#8a5a35','#6b4226','#7a4a2a','#5a3720'];
const HAIR='#1a0f08';
function hero(i,A){
  const c0=A.c[0],c1=A.c[1],skin=SKIN[i%4];
  const root=new N(),K0=G0(root,0,0,0);
  const bd=G0(K0,0,.62,0);
  Y(bd,c0,0,.3,0,.42,.6,OL);                       // torse
  Y(bd,c1,0,.06,0,.44,.14,OL3);                    // ceinture
  D(bd,c1,.4,.33,0,.2,.26,.12,{em:.5});            // emblème
  const hd=G0(bd,.04,.98,0);
  S(hd,skin,0,0,0,.47,.45,.45,OL);                 // tête
  S(hd,'#fff',.38,.07,.17,.13,.15,.1);S(hd,'#fff',.38,.07,-.17,.13,.15,.1);
  S(hd,'#111',.48,.07,.17,.065,.08,.06);S(hd,'#111',.48,.07,-.17,.065,.08,.06);
  B(hd,'#3b1a0a',.45,-.17,0,.04,.05,.2);           // bouche
  S(hd,skin,-.02,0,.45,.09,.12,.06);S(hd,skin,-.02,0,-.45,.09,.12,.06);
  const mkArm=z=>{const a=G0(bd,0,.5,z*.52);Y(a,skin,0,-.27,0,.13,.55,OL3);S(a,skin,0,-.58,0,.15,.15,.15,OL3);return a};
  const aL=mkArm(-1),aR=mkArm(1);
  const mkLeg=(z,bc)=>{const l=G0(bd,0,0,z*.21);Y(l,'#3b2514',0,-.3,0,.15,.58,OL3);B(l,bc,.1,-.62,0,.42,.16,.28,OL3);return l};
  const boot=A.stomp?c1:'#2a1a0e';
  const lL=mkLeg(-1,boot),lR=mkLeg(1,boot);
  let extra=null;
  if(i===0){ // Séna : foulard rouge, boule de feu
    S(hd,c0,-.04,.27,0,.5,.3,.5,OL3);Y(hd,c1,-.04,.2,0,.49,.1);
    S(hd,HAIR,-.38,.2,.32,.2,.2,.2);S(hd,HAIR,-.38,.2,-.32,.2,.2,.2);
    const f=G0(aR,.32,-.58,0);S(f,'#ff7a1a',0,0,0,.2,.2,.2,{em:.85});K(f,'#ffd23f',0,.2,0,.12,.34,{em:1});extra=f}
  else if(i===1){ // Kofi : casquette bleue, pochette de pierres
    Y(hd,c0,-.04,.3,0,.5,.2,OL3);B(hd,c0,.4,.25,0,.4,.06,.52);Y(hd,c1,-.04,.22,0,.51,.06);
    S(bd,'#8a6a45',-.34,.0,.4,.2,.2,.18,OL3);
    extra=S(aR,'#8d8d8d',.2,-.62,0,.15,.15,.15,OL3)}
  else if(i===2){ // Adjoa : bandeau vert, plume, arc, carquois
    Y(hd,c0,-.04,.22,0,.49,.09);Q(hd,'#e8112d',-.1,.5,.15,.13,.42).rz=.2;
    Y(hd,HAIR,-.44,-.25,.22,.07,.7,OL3).rz=.15;Y(hd,HAIR,-.44,-.25,-.22,.07,.7,OL3).rz=.15;S(hd,HAIR,-.2,.25,0,.4,.22,.44);
    const bw=G0(bd,-.46,.35,0);B(bw,'#4a2c1a',0,0,0,.08,1.0,.08).rz=.1;B(bw,'#4a2c1a',.1,.38,0,.07,.4,.07).rz=-.5;B(bw,'#4a2c1a',.1,-.38,0,.07,.4,.07).rz=.5;
    Y(bd,'#6a4a2a',-.44,.5,.25,.12,.55,OL3).rz=.3;D(bd,'#e8112d',-.52,.85,.27,.1,.2,.1);
    extra=B(aR,'#4a2c1a',.1,-.58,0,.5,.07,.07)}
  else { // Zinsou : chapeau violet, bottes à ressort, cape
    Y(hd,c0,-.04,.36,0,.74,.08,OL3);Y(hd,c0,-.04,.55,0,.38,.34,OL3);Y(hd,c1,-.04,.43,0,.39,.1);
    B(bd,c1,-.44,.28,0,.1,.74,.7,OL3);
    extra=null}
  const m={root,K0,bd,hd,aL,aR,lL,lR,extra,fy:-.3,sq:0,pvy:0,A};
  root.sx=root.sy=root.sz=.95;
  return m}
function poseHero(m,a){ // a={t,vx,vy,g,f,stun,fire}
  const run=cl(Math.abs(a.vx||0)/3.2,0,1),ph=a.t*.33;
  const tgt=a.f>=0?-.3:-PI+.3;
  m.fy+=(tgt-m.fy)*.3;m.root.ry=m.fy;
  if(a.g&&m.pvy>6)m.sq=.9;m.pvy=a.vy;m.sq*=.86;
  const sq=m.sq*.3;
  m.bd.sy=1-sq*.5;m.bd.sx=1+sq*.3;m.bd.sz=1+sq*.3;
  m.bd.y=.62-sq*.15+(a.g?Math.abs(Math.sin(ph))*.07*run+Math.sin(a.t*.08)*.015*(1-run):0);
  m.bd.rz=-run*.08*(a.f>=0?1:1);
  if(a.g){const s=Math.sin(ph)*.95*run;m.lL.rz=s;m.lR.rz=-s;m.aL.rz=-s*.9;m.aR.rz=s*.9;
    if(!run){m.aL.rz=m.aR.rz=0}}
  else{const up=a.vy<0;m.lL.rz=up?.75:.4;m.lR.rz=up?-.35:-.2;m.aL.rz=up?2.5:1.6;m.aR.rz=up?2.3:1.4}
  if(a.fire>0)m.aR.rz=1.45;
  m.hd.rz=a.stun?Math.sin(a.t*.6)*.35:0;
  m.root.fl=a.stun?(a.t%6<3?.7:0):0;
  if(m.extra&&m.A&&m.A.stomp===undefined&&a.t!==undefined){} }

/* ---------- moustique ---------- */
function mosq(big){
  const root=new N(),b=G0(root,0,0,0);
  const body=S(b,big?'#5a3a24':'#4a2c1a',0,.62,0,.66,.46,.4,OL);
  S(b,big?'#6a4630':'#5a3a24',.62,.72,0,.34,.3,.3,OL);
  S(b,'#fff',.82,.82,.15,.1,.11,.08);S(b,'#fff',.82,.82,-.15,.1,.11,.08);
  S(b,big?'#e8112d':'#111',.9,.82,.15,.05,.06,.05);S(b,big?'#e8112d':'#111',.9,.82,-.15,.05,.06,.05);
  const pr=K(b,'#2a1810',1.06,.66,0,.05,.55);pr.rz=-PI/2-.25;
  B(b,'#c9b79a',-.1,.62,0,.1,.5,.8).sy=.3;
  const wA=G0(b,-.05,1.0,.1),wB=G0(b,-.05,1.0,-.1);
  const mk=(w,z)=>{B(w,'#fff',-.25,.0,z*.5,.9,.04,.6,{a:.55,em:.6})};mk(wA,1);mk(wB,-1);
  const legs=[];for(let k=0;k<3;k++){const l=G0(b,-.3+k*.3,.35,k%2?.12:-.12);B(l,'#2a1810',0,-.18,0,.05,.4,.05);legs.push(l)}
  return{root,b,wA,wB,legs,fy:0}}
function poseMosq(m,f,t,fly){
  const dir=f.vx>=0?1:-1,tgt=dir>0?-.3:-PI+.3;m.fy+=(tgt-m.fy)*.25;m.root.ry=m.fy;
  const w=Math.sin(t*(fly?.9:.7)+(f.x||0));m.wA.rx=w*.9;m.wB.rx=-w*.9;
  m.b.y=fly?Math.sin(t*.1+f.x)*.08:0;
  for(let k=0;k<m.legs.length;k++)m.legs[k].rz=fly?.5:Math.sin(t*.4+k*2)*.6}

/* ---------- fourmi ---------- */
function ant(){
  const root=new N(),b=G0(root,0,0,0);
  S(b,'#8a1f12',-.32,.3,0,.3,.24,.22,OL3);S(b,'#a62a18',0,.3,0,.2,.18,.17,OL3);S(b,'#6e160c',.28,.34,0,.22,.2,.19,OL3);
  S(b,'#fff',.4,.4,.1,.05,.05,.04);S(b,'#fff',.4,.4,-.1,.05,.05,.04);
  B(b,'#2a0f08',.48,.58,.0,.04,.3,.04).rz=-.5;
  const legs=[];for(let k=0;k<3;k++)for(const z of[-1,1]){const l=G0(b,-.15+k*.17,.22,z*.14);B(l,'#2a0f08',0,-.12,z*.05,.04,.28,.04);legs.push(l)}
  return{root,b,legs,fy:0}}
function poseAnt(m,f,t){
  const dir=f.vx>=0?1:-1,tgt=dir>0?-.3:-PI+.3;m.fy+=(tgt-m.fy)*.35;m.root.ry=m.fy;
  for(let k=0;k<m.legs.length;k++)m.legs[k].rz=Math.sin(t*.9+k*1.7)*.7;
  m.b.y=Math.abs(Math.sin(t*.45+f.x*.2))*.03}

/* ---------- cauri ---------- */
function cowrie(){
  const root=new N(),b=G0(root,0,0,0);
  const sh=G0(b,0,0,0);sh.rz=.4;
  S(sh,'#fff5dc',0,0,0,.34,.48,.25,{ol:.03});
  B(sh,'#8a6a3a',0,0,.235,.07,.5,.06);B(sh,'#8a6a3a',0,0,-.235,.07,.5,.06);
  for(let k=-2;k<=2;k++){B(sh,'#fff5dc',k*.05,0,.26,.02,.3,.03);B(sh,'#fff5dc',k*.05,0,-.26,.02,.3,.03)}
  S(b,'#fcd116',0,0,0,.7,.7,.7,{a:.22,em:1});
  return{root,b,sh}}

/* ---------- projectiles ---------- */
function proj(kind){
  const root=new N();
  if(kind==='fire'){S(root,'#ff7a1a',0,0,0,.34,.34,.34,{em:.9});S(root,'#ffd23f',0,0,0,.2,.2,.2,{em:1});K(root,'#ff4a00',-.55,0,0,.24,.8,{em:.9,a:.8}).rz=PI/2}
  else if(kind==='stone'){S(root,'#8d8d8d',0,0,0,.3,.26,.28,OL3)}
  else if(kind==='arrow'){const a=G0(root,0,0,0);Y(a,'#4a2c1a',0,0,0,.05,1.0).rz=PI/2;K(a,'#cfd3d6',.58,0,0,.1,.25).rz=-PI/2;D(a,'#e8112d',-.52,0,0,.3,.22,.04);}
  else if(kind==='wave'){S(root,'#d9c9a0',0,0,0,.5,.8,.3,{em:.4,a:.85})}
  else{S(root,'#ff5a4d',0,0,0,.32,.32,.32,{em:.85});S(root,'#fff',0,0,0,.16,.16,.16,{em:1})}
  return{root}}

/* ---------- pique, drapeau ---------- */
function spikeNode(par,x,w){ // x,w en unités ; posé sur y=0
  B(par,'#2a1a12',x+w/2,.09,0,w+.2,.18,.9);
  const n=3;for(let i=0;i<n;i++){const cx=x+(i+.5)*w/n;Q(par,'#d8dde0',cx,.18+.4,0,w/n*.98,.8,OL3)}}
function flagNode(){
  const root=new N();
  Y(root,'#ddd',0,3.5,0,.09,7,OL3);S(root,'#fcd116',0,7.1,0,.2,.2,.2,{em:.4});
  const cloth=[];
  for(let j=0;j<4;j++){
    if(j<2){cloth.push([B(root,'#008751',.35+j*.5,5.9,0,.5,1.5,.06,{em:.15})]);}
    else{cloth.push([B(root,'#fcd116',.35+j*.5,6.275,0,.5,.75,.06,{em:.15}),B(root,'#e8112d',.35+j*.5,5.525,0,.5,.75,.06,{em:.15})]);}
  }
  cloth.forEach(a=>a.forEach(n=>n.by=n.y));
  return{root,cloth}}

/* ---------- particules ---------- */
const PART=[],PM=[];
R.fx=function(kind,x,y){
  const defs={cow:{n:8,c:['#fcd116','#fff5dc','#ffe45c'],s:.18,sp:.09,up:.1,life:28,em:1},
    poof:{n:10,c:['#fff','#e8e0d0','#cfc6b0'],s:.28,sp:.1,up:.06,life:26,em:.2},
    hit:{n:12,c:['#ff7a1a','#ffd23f','#fff'],s:.25,sp:.14,up:.1,life:24,em:1},
    die:{n:14,c:['#e8112d','#fff','#fcd116'],s:.3,sp:.16,up:.14,life:34,em:.8},
    boom:{n:26,c:['#fcd116','#ff7a1a','#e8112d','#fff'],s:.4,sp:.28,up:.16,life:50,em:1}}[kind]||null;
  if(!defs)return;
  for(let i=0;i<defs.n&&PART.length<160;i++){const a=Math.random()*PI*2,sp=defs.sp*(.4+Math.random()*.9);
    PART.push({x,y,z:(Math.random()-.5)*.6,vx:Math.cos(a)*sp,vy:Math.abs(Math.sin(a))*sp+defs.up,vz:(Math.random()-.5)*.06,l:defs.life,l0:defs.life,s:defs.s*(.6+Math.random()*.7),c:defs.c[i%defs.c.length],em:defs.em})}};
let PNODE=null;
function drawParts(){
  if(!PART.length)return;
  if(!PNODE)PNODE=D(null,'#fff',0,0,0,1,1,1);
  for(let i=PART.length-1;i>=0;i--){const q=PART[i];q.x+=q.vx;q.y+=q.vy;q.z+=q.vz;q.vy-=.006;q.l--;if(q.l<=0){PART.splice(i,1);continue}
    const k=q.l/q.l0;PNODE.c=rgb(q.c);PNODE.em=q.em;PNODE.x=q.x;PNODE.y=q.y;PNODE.z=q.z;PNODE.sx=PNODE.sy=PNODE.sz=q.s*(.4+k*.8);PNODE.ry=q.l*.2;PNODE.rz=q.l*.15;G.add(PNODE)}}

R.hero=hero;R.poseHero=poseHero;R.mosq=mosq;R.poseMosq=poseMosq;R.ant=ant;R.poseAnt=poseAnt;R.cowrie=cowrie;R.proj=proj;R.spikeNode=spikeNode;R.flagNode=flagNode;R.drawParts=drawParts;
R.parts=PART;

/* ---------- les 9 boss (origine = centre du bas de la boîte de collision) ---------- */
const BO={};
const ol=OL2;
BO[2]=function(){ // Crapaud géant du marché
  const root=new N(),b=G0(root,0,0,0);
  S(b,'#4f9d2f',0,1.15,0,1.9,1.1,1.35,ol);S(b,'#cfe69a',.25,.85,0,1.45,.8,1.1);
  [[-.6,1.9,.5],[.3,2.1,-.6],[-1.0,1.5,-.4],[.7,1.8,.7],[-.2,1.3,.95]].forEach(w=>S(b,'#2f6b1a',w[0],w[1],w[2],.18,.14,.18));
  S(b,'#6fbf3f',1.0,2.1,.62,.44,.44,.44,ol);S(b,'#6fbf3f',1.0,2.1,-.62,.44,.44,.44,ol);
  S(b,'#ffe45c',1.35,2.15,.62,.26,.28,.2);S(b,'#ffe45c',1.35,2.15,-.62,.26,.28,.2);S(b,'#000',1.55,2.15,.62,.1,.2,.09);S(b,'#000',1.55,2.15,-.62,.1,.2,.09);
  const mouth=B(b,'#3b1a0a',1.55,1.2,0,.1,.14,1.5);
  const hl=G0(b,-1.2,.7,.9),hr=G0(b,-1.2,.7,-.9);[hl,hr].forEach(h=>{S(h,'#4f9d2f',0,0,0,.7,.55,.32,ol);B(h,'#4f9d2f',.8,-.45,0,.9,.2,.34)});
  const fl=G0(b,.9,.5,.85),fr=G0(b,.9,.5,-.85);[fl,fr].forEach(h=>{Y(h,'#4f9d2f',0,-.25,0,.2,.6,ol);B(h,'#4f9d2f',.15,-.55,0,.5,.14,.4)});
  return{root,pose(o){const sq=o.g?0:cl(-o.vy*.04,-.25,.3);b.sy=1+sq;b.sx=1-sq*.6;b.sz=1-sq*.6;const k=cl(Math.sin(o.t*.2)*.04,-1,1);b.y=o.g?k:0;
    hl.rz=hr.rz=o.g?0:.6;mouth.sy=1+(o.warn?3:0)}}};
BO[3]=function(){ // Caïman du lac
  const root=new N(),b=G0(root,0,0,0);
  Y(b,'#2f6b3a',-.2,.95,0,.9,4.0,ol).rz=PI/2;Y(b,'#cfe69a',-.2,.5,0,.7,3.6).rz=PI/2;
  B(b,'#2f6b3a',2.1,1.05,0,1.7,.65,1.15,ol);const jaw=B(b,'#25552e',2.3,.55,0,1.6,.3,1.0,ol);
  for(let k=0;k<5;k++){Q(b,'#fff',1.6+k*.3,.82,.45,.18,.24).rx=PI;Q(b,'#fff',1.6+k*.3,.82,-.45,.18,.24).rx=PI}
  const eye=S(b,'#ffe45c',1.7,1.55,.5,.2,.2,.14);S(b,'#000',1.85,1.55,.5,.06,.15,.05);S(b,'#ffe45c',1.7,1.55,-.5,.2,.2,.14);
  K(b,'#2f6b3a',-3.0,.8,0,.7,2.6,ol).rz=PI/2;
  for(let k=0;k<6;k++)Q(b,'#1d4a28',-1.8+k*.7,1.95,0,.45,.5);
  [[-1.2,.7],[1.0,.7],[-1.2,-.7],[1.0,-.7]].forEach(l=>{Y(b,'#2f6b3a',l[0],.28,l[1]*1.0,.28,.56,ol)});
  return{root,pose(o){b.rx=0;b.rz=o.warn?Math.sin(o.t*1.4)*.03:0;eye.c=rgb(o.warn?'#ff2a2a':'#ffe45c');eye.em=o.warn?.8:0;
    jaw.rz=o.warn?-.35:Math.sin(o.t*.08)*.05;b.ry=Math.sin(o.t*.15)*.03}}};
BO[4]=function(){ // Crabe géant
  const root=new N(),b=G0(root,0,0,0);
  S(b,'#d9381e',0,1.0,0,1.75,.95,1.2,ol);S(b,'#f08a6a',.25,.75,0,1.2,.5,.95);
  [-1,1].forEach(s=>{Y(b,'#fff',.9,1.9,s*.4,.1,.5);S(b,'#fff',.9,2.2,s*.4,.2,.22,.2);S(b,'#000',1.05,2.25,s*.4,.09,.12,.09)});
  const arms=[];[-1,1].forEach(s=>{const a=G0(b,1.4,1.2,s*1.15);Y(a,'#d9381e',.4,.3,0,.2,.9,ol).rz=-.9;
    const c1=G0(a,.9,.75,0);S(c1,'#d9381e',0,0,0,.78,.55,.5,ol);const up=B(c1,'#a82810',.55,.28,0,.8,.2,.3,ol);const dn=B(c1,'#a82810',.55,-.28,0,.8,.2,.3,ol);K(c1,'#5a1208',1.0,.28,0,.1,.3).rz=-PI/2;
    arms.push({a,up,dn})});
  for(let k=0;k<3;k++)for(const s of[-1,1]){const l=G0(b,-.6+k*.7,.5,s*.8);B(l,'#a82810',0,-.2,s*.3,.18,.6,.18).rx=s*.6;}
  return{root,pose(o){const sn=Math.sin(o.t*.18);arms.forEach((q,i)=>{q.up.rz=.15+Math.max(0,sn)*.5;q.dn.rz=-.15-Math.max(0,sn)*.5;q.a.rz=Math.sin(o.t*.1+i)*.1});b.y=Math.abs(Math.sin(o.t*.14))*.06}}};
BO[5]=function(){ // Vautour de Ouidah
  const root=new N(),b=G0(root,0,.2,0);
  S(b,'#3a2a22',0,1.5,0,1.35,1.0,.85,ol);S(b,'#e8d8c0',.9,2.1,0,.55,.45,.6);
  const nk=Y(b,'#e8b0a0',1.3,2.5,0,.25,.8,ol);nk.rz=-.4;
  S(b,'#d94a3a',1.65,3.0,0,.45,.4,.4,ol);S(b,'#fff',1.95,3.1,.28,.1,.1,.08);S(b,'#000',2.03,3.1,.28,.05,.06,.04);S(b,'#fff',1.95,3.1,-.28,.1,.1,.08);
  K(b,'#e8b13a',2.2,2.9,0,.2,.8,ol).rz=-PI/2-.3;
  const fan=G0(b,-1.2,1.3,0);for(let k=-2;k<=2;k++){B(fan,'#241912',-.5,0,k*.22,.9,.1,.18).rz=k*.12}
  const wL=G0(b,-.1,2.0,.7),wR=G0(b,-.1,2.0,-.7);
  [wL,wR].forEach((w,i)=>{const s=i?-1:1;for(let k=0;k<5;k++){B(w,k%2?'#2a1c16':'#3a2a22',-.2-k*.2,0,s*(.7+k*.4),.7-k*.08,.1,.9,ol)}});
  Y(b,'#e8b13a',-.2,.6,.3,.08,.7);Y(b,'#e8b13a',.4,.6,.3,.08,.7);
  return{root,pose(o){const w=Math.sin(o.t*.35)*(o.warn?.2:.55);wL.rx=w+.2;wR.rx=-w-.2;b.rz=o.warn?-.35:Math.sin(o.t*.05)*.05;nk.rz=-.4}}};
BO[6]=function(){ // Scorpion de Bohicon
  const root=new N(),b=G0(root,0,0,0);
  S(b,'#c8913a',0,.75,0,1.9,.65,1.0,ol);S(b,'#e0b060',.2,.95,0,1.3,.35,.8);
  for(let k=0;k<4;k++)B(b,'#8a6226',-.9+k*.6,.98,0,.08,.5,1.2);
  S(b,'#c8913a',1.75,.8,0,.55,.45,.55,ol);S(b,'#000',2.1,.95,.25,.07,.09,.07);S(b,'#000',2.1,.95,-.25,.07,.09,.07);
  const tail=[];let tx=-1.4,ty=1.0;const tg=G0(b,0,0,0);
  for(let k=0;k<6;k++){const a=k/5;const sx=-1.4+Math.sin(a*2.0)*1.1,sy=1.0+Math.sin(a*PI*.62)*1.9;tail.push(S(tg,'#c8913a',sx,sy,0,.4-k*.02,.4-k*.02,.4-k*.02,ol))}
  const st=K(tg,'#b43bd1',.25,3.0,0,.2,.65,{ol:.04,em:.4});st.rz=PI-.5;
  [-1,1].forEach(s=>{const a=G0(b,1.5,.8,s*.95);B(a,'#c8913a',.4,0,0,.9,.22,.26,ol);const c=S(a,'#d9a44a',1.0,0,0,.4,.3,.3,ol);K(a,'#6a4a1a',1.35,.05,0,.14,.35).rz=-PI/2});
  for(let k=0;k<4;k++)for(const s of[-1,1])B(b,'#8a6226',-.7+k*.55,.35,s*.75,.12,.7,.12).rx=s*.5;
  return{root,pose(o){tg.rz=Math.sin(o.t*.12)*.06;st.em=o.warn?1:.4;b.y=Math.abs(Math.sin(o.t*.1))*.04}}};
BO[7]=function(){ // Buffle de guerre
  const root=new N(),b=G0(root,0,0,0);
  S(b,'#3b2a24',-.3,1.95,0,2.5,1.45,1.45,ol);S(b,'#2f211c',-.9,3.0,0,1.2,.8,1.0,ol);
  const hd=G0(b,2.1,1.9,0);S(hd,'#4a342a',0,0,0,.95,.9,.85,ol);S(hd,'#5a443a',.75,-.45,0,.55,.5,.55);
  S(hd,'#111',1.2,-.5,.25,.08,.08,.08);S(hd,'#111',1.2,-.5,-.25,.08,.08,.08);
  const e1=S(hd,'#fff',.45,.25,.6,.12,.12,.1),e2=S(hd,'#fff',.45,.25,-.6,.12,.12,.1);const p1=S(hd,'#111',.55,.25,.6,.06,.07,.05),p2=S(hd,'#111',.55,.25,-.6,.06,.07,.05);
  [-1,1].forEach(s=>{const h=G0(hd,-.1,.65,s*.75);K(h,'#f0e8d0',0,.0,0,.2,1.1,ol).rz=s*-.9;K(h,'#f0e8d0',s*0,.4,s*.8,.12,.7,ol).rz=s*-.3;});
  const legs=[];[[-1.9,.55],[-.9,.55],[.6,.55],[1.5,.55],[-1.5,-.55],[1.0,-.55]].forEach(l=>{legs.push(Y(b,'#2f211c',l[0],.7,l[1],.28,1.4,ol))});
  K(b,'#2f211c',-2.8,1.6,0,.1,1.0).rz=.5;
  return{root,pose(o){hd.rz=o.warn?-.35:Math.sin(o.t*.1)*.04;[e1,e2,p1,p2].forEach(q=>{});p1.c=p2.c=rgb(o.warn?'#ff2a2a':'#111');
    b.y=Math.abs(Math.sin(o.t*.2))*(Math.abs(o.vx)>1?.12:.02);legs.forEach((l,i)=>l.rz=Math.abs(o.vx)>1?Math.sin(o.t*.5+i)*.35:0)}}};
BO[8]=function(){ // Hippopotame de la Pendjari
  const root=new N(),b=G0(root,0,0,0);
  S(b,'#7a6a86',-.2,1.85,0,2.6,1.55,1.5,ol);S(b,'#c898a8',-.2,1.0,0,2.2,.6,1.2);
  const hd=G0(b,2.2,1.9,0);S(hd,'#8a7a96',0,0,0,1.15,1.0,1.1,ol);S(hd,'#9a8aa6',.75,-.4,0,.9,.65,1.0,ol);
  const jaw=B(hd,'#c898a8',.95,-.9,0,1.2,.25,1.5);
  S(hd,'#3a2a46',1.5,-.15,.35,.1,.1,.1);S(hd,'#3a2a46',1.5,-.15,-.35,.1,.1,.1);
  S(hd,'#8a7a96',0,.85,.55,.24,.24,.24,ol);S(hd,'#8a7a96',0,.85,-.55,.24,.24,.24,ol);S(hd,'#111',.13,.9,.55,.08,.09,.08);S(hd,'#111',.13,.9,-.55,.08,.09,.08);
  S(hd,'#c898a8',-.5,.95,.8,.2,.28,.1);S(hd,'#c898a8',-.5,.95,-.8,.2,.28,.1);
  K(hd,'#fff',1.55,-.75,.5,.1,.45).rz=PI;K(hd,'#fff',1.55,-.75,-.5,.1,.45).rz=PI;
  [[-1.4,.7],[1.0,.7],[-1.4,-.7],[1.0,-.7]].forEach(l=>Y(b,'#6a5a76',l[0],.6,l[1],.4,1.2,ol));
  return{root,pose(o){const sq=o.g?0:.1;b.sy=1+sq;jaw.rz=-.3*Math.max(0,Math.sin(o.t*.08))+(o.g?0:-.15);hd.rz=Math.sin(o.t*.06)*.03}}};
BO[9]=function(){ // Léopard de l'Atacora
  const root=new N(),b=G0(root,0,0,0);
  S(b,'#e0a030',0,1.15,0,2.1,.78,.72,ol);
  for(let k=0;k<12;k++){const r=k*2.399,sx=Math.cos(r)*1.5,sy=1.15+Math.sin(r*1.7)*.4;S(b,'#3b2410',sx,sy,.55+Math.abs(Math.sin(r))*.1,.16,.12,.12)}
  const hd=G0(b,2.0,1.55,0);S(hd,'#e0a030',0,0,0,.65,.55,.55,ol);S(hd,'#f4dca0',.45,-.2,0,.38,.3,.4);S(hd,'#111',.78,-.05,0,.1,.08,.12);
  S(hd,'#9fd34a',.38,.15,.25,.12,.12,.08);S(hd,'#111',.48,.15,.25,.04,.1,.04);S(hd,'#9fd34a',.38,.15,-.25,.12,.12,.08);
  S(hd,'#e0a030',-.1,.5,.25,.15,.17,.1,ol);S(hd,'#e0a030',-.1,.5,-.25,.15,.17,.1,ol);
  const legs=[[-1.3,.45],[-.7,.4],[1.0,.45],[1.5,.4]].map(l=>{const g=G0(b,l[0],.85,l[1]);Y(g,'#e0a030',0,-.4,0,.24,.9,ol);S(g,'#c88a20',.1,-.9,0,.34,.16,.26,ol);return g});
  const tg=G0(b,-2.0,1.3,0);for(let k=0;k<5;k++)S(tg,k===4?'#222':'#e0a030',-k*.32,Math.sin(k*.9)*.45+k*.12,0,.2,.2,.2,ol);
  return{root,pose(o){const run=Math.abs(o.vx)>1.2,s=Math.sin(o.t*.5);legs.forEach((g,i)=>g.rz=run?s*(i%2?-.7:.7):0);b.sy=1;tg.rz=Math.sin(o.t*.12)*.15;
    hd.rz=o.warn?.28:0;b.rz=o.warn?-.12:0;b.y=run?Math.abs(s)*.1:Math.sin(o.t*.08)*.02}}};
BO[10]=function(){ // Roi des Moustiques
  const root=new N(),b=G0(root,0,0,0);
  S(b,'#4a2c1a',-.2,1.9,0,1.5,1.2,1.1,ol);for(let k=0;k<4;k++)B(b,'#f0e0c0',-1.0+k*.5,1.9,0,.1,2.2,1.15).sx=.1;
  S(b,'#5a3a24',1.5,2.4,0,.8,.75,.7,ol);
  S(b,'#e8112d',2.0,2.5,.42,.36,.4,.28,{ol:.05,em:.5});S(b,'#e8112d',2.0,2.5,-.42,.36,.4,.28,{ol:.05,em:.5});S(b,'#fff',2.25,2.6,.42,.12,.13,.08,{em:1});S(b,'#fff',2.25,2.6,-.42,.12,.13,.08,{em:1});
  K(b,'#2a1810',2.4,2.15,0,.1,1.5).rz=-PI/2-.3;
  const cr=G0(b,1.35,3.1,0);Y(cr,'#fcd116',0,0,0,.6,.14,{em:.5,ol:.04});for(let k=-2;k<=2;k++)Q(cr,'#fcd116',k*.22,.28+(k===0?.1:0),0,.22,.5-Math.abs(k)*.06,{em:.5,ol:.04});S(cr,'#e8112d',0,.26,.28,.07,.07,.07,{em:1});
  const wA=G0(b,-.3,3.0,.3),wB=G0(b,-.3,3.0,-.3);[wA,wB].forEach((w,i)=>{B(w,'#fff',-.5,0,(i?-1:1)*1.2,1.9,.05,1.9,{a:.5,em:.6});B(w,'#cfe8f2',-.6,.01,(i?-1:1)*1.6,1.4,.05,1.2,{a:.35,em:.6})});
  const legs=[];for(let k=0;k<3;k++)for(const s of[-1,1]){const l=G0(b,-.9+k*.7,1.0,s*.5);B(l,'#2a1810',0,-.5,0,.1,1.2,.1).rx=s*.3;legs.push(l)}
  return{root,pose(o){const w=Math.sin(o.t*.9);wA.rx=w*.8;wB.rx=-w*.8;b.y=Math.sin(o.t*.12)*.12;b.rz=o.warn?-.3:0;legs.forEach((l,i)=>l.rz=Math.sin(o.t*.3+i)*.2)}}};
R.BO=BO;

/* ---------- décors : objets réutilisables (x en unités, z = profondeur, posé sur y=0) ---------- */
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const pick=(r,a)=>a[Math.floor(r()*a.length)];
function palm(P,r,x,z,s,lean,trunk,leaf){
  s=s||1;lean=lean==null?(r()-.5)*.4:lean;trunk=trunk||'#7a5a3a';leaf=leaf||'#2f8f3a';
  const g=G0(P,x,0,z);const h=5.5*s;
  for(let k=0;k<5;k++){const a=k/5,px=Math.sin(lean)*h*a*a*1.0,py=a*h+.5*s;Y(g,k%2?'#6a4a2a':trunk,px,py,0,.32*s*(1-a*.3),h/5*1.1);}
  const top=G0(g,Math.sin(lean)*h*.9,h+.3*s,0);
  for(let k=0;k<7;k++){const ang=k/7*PI*2,f=G0(top,0,0,0);f.ry=ang;const l=B(f,k%2?leaf:'#3a9f46',1.6*s,-.35*s,0,3.2*s,.1*s,.8*s);l.rz=-.35;}
  S(top,'#6a4a2a',0,-.1*s,0,.35*s,.35*s,.35*s);S(top,'#6a4a2a',.3*s,-.25*s,.2*s,.25*s,.25*s,.25*s);
  return g}
function acacia(P,r,x,z,s,col){s=s||1;col=col||'#5a8a2e';const g=G0(P,x,0,z);
  Y(g,'#5a4128',0,1.5*s,0,.28*s,3*s);B(g,'#5a4128',.5*s,3.1*s,0,1.2*s,.22*s,.22*s).rz=.4;B(g,'#5a4128',-.5*s,3.0*s,0,1.2*s,.22*s,.22*s).rz=-.4;
  S(g,col,0,3.9*s,0,3.2*s,.7*s,2.2*s);S(g,mixc(col,'#8fcf5a',.4),.3*s,4.2*s,0,2.1*s,.45*s,1.5*s);return g}
function baobab(P,r,x,z,s){s=s||1;const g=G0(P,x,0,z);
  Y(g,'#8a7a66',0,2.2*s,0,1.2*s,4.4*s);Y(g,'#7a6a56',0,4.8*s,0,.9*s,1.4*s);
  for(let k=0;k<5;k++){const a=k/5*PI*2,b=B(g,'#7a6a56',Math.cos(a)*.9*s,5.5*s,Math.sin(a)*.9*s,.3*s,1.8*s,.3*s);b.rz=Math.cos(a)*.6;b.rx=-Math.sin(a)*.6;S(g,'#4c8f3a',Math.cos(a)*1.9*s,6.4*s,Math.sin(a)*1.9*s,1.1*s,.6*s,1.1*s)}
  S(g,'#4c8f3a',0,6.5*s,0,1.8*s,.7*s,1.8*s);return g}
function hut(P,r,x,z,s,wall,roof){s=s||1;const g=G0(P,x,0,z);
  Y(g,wall||'#b9794a',0,.9*s,0,1.5*s,1.8*s);B(g,'#3b2112',.0,.6*s,1.48*s,.7*s,1.2*s,.06);K(g,roof||'#d9b45a',0,2.6*s,0,2.1*s,1.8*s);return g}
function tata(P,r,x,z,s){s=s||1;const g=G0(P,x,0,z);
  Y(g,'#b9794a',0,1.7*s,0,2.2*s,3.4*s);B(g,'#3b2112',0,.8*s,2.18*s,.8*s,1.5*s,.06);
  K(g,'#cfa860',0,4.2*s,0,2.5*s,1.6*s);
  for(let k=0;k<4;k++){const a=k/4*PI*2+.4;Y(g,'#b9794a',Math.cos(a)*2.0*s,3.7*s,Math.sin(a)*2.0*s,.45*s,.6*s);K(g,'#cfa860',Math.cos(a)*2.0*s,4.3*s,Math.sin(a)*2.0*s,.6*s,.55*s)}
  Y(g,'#b9794a',2.3*s,.9*s,.9*s,.7*s,1.8*s);K(g,'#cfa860',2.3*s,2.4*s,.9*s,.9*s,.9*s);return g}
function stall(P,r,x,z,col){const g=G0(P,x,0,z),cs=col||['#e8112d','#fff3d6','#fcd116','#008751'];
  [[-1.8,-1.0],[1.8,-1.0],[-1.8,1.0],[1.8,1.0]].forEach(p=>Y(g,'#5a3a1e',p[0],1.5,p[1],.1,3));
  for(let k=0;k<6;k++){const b=B(g,cs[(k+Math.floor(r()*4))%4],-1.6+k*.64,3.1,0,.66,.12,2.6);b.rz=0;}
  K(g,cs[Math.floor(r()*4)],0,3.5,0,2.4,.7).sy=.5;
  B(g,'#8a5a33',0,.75,.7,3.4,1.0,1.1);B(g,'#3b1a0a',0,1.3,.7,3.5,.1,1.2);
  for(let k=0;k<6;k++)S(g,pick(r,['#e8112d','#fcd116','#008751','#ff7a1a','#7a2e8a']),-1.4+k*.56,1.5,.7,.24,.24,.24);
  Y(g,'#8a5a33',2.4,.4,1.2,.4,.8);Y(g,'#8a5a33',-2.4,.4,1.2,.35,.7);return g}
function building(P,r,x,z,w,h,d,col,roof,win){const g=G0(P,x,0,z);
  B(g,col,0,h/2,0,w,h,d,{win:win===false?0:1,tag:r()*9});B(g,roof||'#5a6a7e',0,h+.18,0,w+.3,.36,d+.3);
  if(r()<.5)B(g,'#cfd6dd',w*.2,h+.6,0,w*.25,.5,d*.25);return g}
function stilt(P,r,x,z,s){s=s||1;const g=G0(P,x,0,z);
  [[-1.6,-1.0],[1.6,-1.0],[-1.6,1.0],[1.6,1.0]].forEach(p=>Y(g,'#4a3320',p[0]*s,.6*s,p[1]*s,.14*s,3.2*s));
  B(g,'#7a5a3a',0,2.3*s,0,4.2*s,.2*s,2.6*s);B(g,'#9a6a3a',0,3.2*s,0,3.6*s,1.7*s,2.1*s);B(g,'#3b2112',.5*s,3.0*s,1.06*s,.8*s,1.2*s,.05);
  B(g,'#cfe8f2',-1.0*s,3.4*s,1.06*s,.6*s,.5*s,.05);Q(g,'#d9b45a',0,5.1*s,0,4.6*s,1.9*s);return g}
function boat(P,r,x,z,col,sail){const g=G0(P,x,0,z);
  B(g,col,0,.15,0,4,.5,1.0,OL3);B(g,col,2.1,.4,0,.9,.4,.9).rz=.5;B(g,col,-2.1,.4,0,.9,.4,.9).rz=-.5;
  if(sail){Y(g,'#5a3a1e',0,1.8,0,.07,3.6);D(g,'#fff3d6',.9,2.0,0,1.8,2.6,.04).rz=0;}return g}
function pylon(P,r,x,z){const g=G0(P,x,0,z);
  B(g,'#7a828a',-.6,3.5,0,.18,7,.18).rz=.07;B(g,'#7a828a',.6,3.5,0,.18,7,.18).rz=-.07;B(g,'#7a828a',0,7.0,0,3.2,.18,.18);B(g,'#7a828a',0,5.2,0,2.2,.14,.14);
  for(let k=0;k<3;k++)B(g,'#7a828a',0,1.5+k*1.6,0,1.2-k*.2,.1,.1).rz=k%2?.5:-.5;return g}
function carriage(P,r,x,z,col){const g=G0(P,x,0,z);
  B(g,col,0,1.9,0,7,2.6,2.6,{win:1,tag:r()*9});B(g,'#2a2a2e',0,.5,0,7.2,.5,2.4);B(g,'#4a4a52',0,3.4,0,7.2,.25,2.7);
  [-2.4,-1.4,1.4,2.4].forEach(wx=>{Y(g,'#222',wx,.35,1.2,.4,.2).rx=PI/2;Y(g,'#222',wx,.35,-1.2,.4,.2).rx=PI/2});return g}
function wall(P,r,x,z,w,col){const g=G0(P,x,0,z);
  B(g,col,0,2,0,w,4,1.4);for(let k=0;k<Math.floor(w/1.4);k++)B(g,col,-w/2+.7+k*1.4,4.35,0,.8,.7,1.4);
  for(let k=0;k<Math.floor(w/2.4);k++){const px=-w/2+1.2+k*2.4;B(g,k%2?'#fcd116':'#fff3d6',px,2.3,.72,1.5,1.5,.06);D(g,k%2?'#fff3d6':'#fcd116',px,2.3,.76,.9,1.0,.06);B(g,'#3b1a0a',px,.8,.72,1.5,.14,.06)}
  return g}
function crystal(P,r,x,z,s,col){const g=G0(P,x,0,z);col=col||pick(r,['#5ae0ff','#ff5ad0','#b08aff']);
  for(let k=0;k<3;k++)D(g,col,(k-1)*.5*s,(.8+k%2*.5)*s,k*.2,.7*s,(1.8+k%2)*s,.7*s,{em:.85,ol:.03}).rz=(k-1)*.25;return g}
function tuft(P,r,x,z,col){const g=G0(P,x,0,z);for(let k=0;k<4;k++)K(g,col,(k-1.5)*.18,.25,(r()-.5)*.3,.12,.5+r()*.3).rz=(k-1.5)*.18;return g}
function cloud(P,r,x,y,z,s){const g=G0(P,x,y,z);
  for(let k=0;k<5;k++)S(g,'#fff',(k-2)*s*.55,Math.sin(k*1.7)*s*.2,(r()-.5)*s*.4,s*(.7+r()*.4),s*(.42+r()*.15),s*.6,{em:.75});return g}
function mountain(P,r,x,z,w,h,col,snow){const g=G0(P,x,0,z);
  K(g,col,0,h/2-1,0,w/2,h);K(g,mixc(col,'#fff',.15),w*.32,h*.3,w*.1,w*.28,h*.62);K(g,mixc(col,'#000',.12),-w*.3,h*.28,w*.1,w*.3,h*.58);
  if(snow)K(g,'#fff',0,h*.82-1,0,w*.1,h*.36);return g}
function elephant(P,r,x,z,s){const g=G0(P,x,0,z);const c='#8a8a92';
  S(g,c,0,2.2*s,0,2.1*s,1.5*s,1.2*s);S(g,c,2.0*s,2.8*s,0,1.0*s,.95*s,.9*s);
  Y(g,c,2.7*s,1.7*s,0,.3*s,1.8*s).rz=.2;S(g,'#7a7a82',1.8*s,2.8*s,.95*s,.15*s,.9*s,.7*s);S(g,'#7a7a82',1.8*s,2.8*s,-.95*s,.15*s,.9*s,.7*s);
  [[-1.2,.6],[1.2,.6],[-1.2,-.6],[1.2,-.6]].forEach(l=>Y(g,c,l[0]*s,.8*s,l[1]*s,.4*s,1.6*s));return g}
function giraffe(P,r,x,z,s){const g=G0(P,x,0,z);
  S(g,'#d9a84a',0,3.0*s,0,1.5*s,.9*s,.6*s);Y(g,'#d9a84a',1.4*s,4.8*s,0,.28*s,3.2*s).rz=-.25;S(g,'#d9a84a',2.0*s,6.5*s,0,.55*s,.4*s,.4*s);
  [[-.9,.3],[.9,.3],[-.9,-.3],[.9,-.3]].forEach(l=>Y(g,'#d9a84a',l[0]*s,1.3*s,l[1]*s,.18*s,2.6*s));
  for(let k=0;k<6;k++)S(g,'#7a4a1a',-.8*s+k*.3*s,3.1*s+(k%2)*.2*s,.5*s,.18*s,.16*s,.1*s);return g}
function torch(P,x,z){const g=G0(P,x,0,z);Y(g,'#3b2112',0,1.8,0,.12,3.6,OL3);K(g,'#ff7a1a',0,3.9,0,.34,.8,{em:1});K(g,'#ffd23f',0,3.85,0,.2,.5,{em:1});return g}
function lamp(P,x,z){const g=G0(P,x,0,z);Y(g,'#444a52',0,2.2,0,.08,4.4);B(g,'#444a52',.3,4.4,0,.8,.08,.08);S(g,'#fff3a0',.65,4.3,0,.18,.18,.18,{em:1});return g}
function lighthouse(P,x,z){const g=G0(P,x,0,z);for(let k=0;k<5;k++)Y(g,k%2?'#fff':'#e8112d',0,1.5+k*3,0,2.2-k*.2,3);Y(g,'#444',0,16,0,1.6,1.0);S(g,'#fff3a0',0,17.2,0,1.0,1.0,1.0,{em:1});K(g,'#e8112d',0,18.8,0,1.5,1.6);return g}
R.fns={palm,acacia,baobab,hut,tata,stall,building,stilt,boat,pylon,carriage,wall,crystal,tuft,cloud,mountain,elephant,giraffe,torch,lamp,lighthouse};

/* ---------- thèmes : lumière, sol, décors des 10 villes ---------- */
const LT=[ // sky=lumière ambiante du haut, gnd=du bas, sun=soleil, ld=direction de la lumière, sunPos=[x,y,rayon] écran
 {sky:[1,1,1],gnd:[.58,.52,.44],sun:[1,.96,.86],ld:[-.45,.8,.55],sp:[.8,.82,.07],sc:[1,.97,.78]},
 {sky:[1,.99,.95],gnd:[.6,.5,.4],sun:[1,.94,.8],ld:[-.4,.8,.5],sp:[.78,.8,.07],sc:[1,.95,.7]},
 {sky:[.96,1,1],gnd:[.5,.55,.58],sun:[1,.98,.9],ld:[-.4,.85,.5],sp:[.75,.82,.07],sc:[1,.98,.85]},
 {sky:[1,1,1],gnd:[.62,.56,.45],sun:[1,.96,.82],ld:[-.5,.75,.5],sp:[.82,.8,.075],sc:[1,.95,.72]},
 {sky:[1,.86,.78],gnd:[.6,.42,.38],sun:[1,.74,.52],ld:[-.8,.32,.5],sp:[.2,.3,.11],sc:[1,.6,.25]},
 {sky:[.98,.98,1],gnd:[.55,.5,.46],sun:[1,.95,.85],ld:[-.45,.8,.5],sp:[.76,.82,.07],sc:[1,.96,.8]},
 {sky:[1,.92,.82],gnd:[.62,.44,.34],sun:[1,.84,.62],ld:[-.5,.7,.5],sp:[.8,.78,.09],sc:[1,.78,.42]},
 {sky:[1,.96,.84],gnd:[.62,.52,.36],sun:[1,.9,.66],ld:[-.5,.7,.5],sp:[.78,.74,.1],sc:[1,.84,.4]},
 {sky:[.9,.94,1],gnd:[.45,.46,.5],sun:[.95,.96,1],ld:[-.4,.8,.5],sp:[.8,.82,.07],sc:[1,1,.92]},
 {sky:[.46,.5,.9],gnd:[.2,.16,.3],sun:[.55,.6,1],ld:[-.4,.7,.55],sp:[.74,.78,.085],sc:[.96,.95,.8]}];
const GCOL=[ // [terre, herbe]
 ['#b5532a','#3d9a3d'],['#a8602a','#6aa84f'],['#6a4220','#b98a4e'],['#d9b36a','#f3dc9a'],['#7a2e1a','#4c8f3a'],
 ['#9c4a22','#3d8a3d'],['#8c3b1b','#6a8f2e'],['#b88a3c','#a5a542'],['#6b4a2b','#2f7a3a'],['#4a2020','#6a2e8a']];

function theme(L,P,F,r,xa,xb,LWu){
  const row=(step,fn,jit)=>{for(let x=xa;x<xb;x+=step*(1-(jit==null?.35:jit)+r()*(jit==null?.7:jit*2)))fn(x)};
  const near=P,far=F;
  /* nuages communs */
  if(L!==10)row(34,x=>cloud(far,r,x,26+r()*18,-135,9+r()*7),.5);
  const hills=(col,y,z)=>row(26,x=>S(far,col,x,y,z,16+r()*16,6+r()*9,16));
  switch(L){
  case 1: // Cotonou : ville moderne, palmiers
    row(7,x=>{const h=14+r()*36,w=5+r()*5;B(far,pick(r,['#7f93ab','#94a4b8','#6f8199','#a9b7c8']),x,h/2-2,-100-r()*28,w,h+4,w,{win:1,tag:r()*9})},.5);
    row(10,x=>building(near,r,x,-34-r()*14,5+r()*3,7+r()*13,6,pick(r,['#f2e6d0','#e8c9a0','#cfe0ea','#f0d8d0']),'#5a6a7e'));
    row(9,x=>{const v=r();if(v<.55)palm(near,r,x,-9-r()*4,.9+r()*.4);else{const g=G0(near,x,0,-10-r()*3);B(g,pick(r,['#f4ead0','#f0c8a0','#cfe0ea']),0,1.8,0,5,3.6,4,{win:1,tag:r()*9});B(g,'#5a6a7e',0,3.75,0,5.3,.3,4.3);Q(g,pick(r,['#e8112d','#008751','#fcd116']),0,3.2,2.2,4.8,.9).rx=-.9}});
    row(18,x=>lamp(near,x,-6),.2);
    break;
  case 2: // Dantokpa : marché
    row(8,x=>{B(far,pick(r,['#a8602a','#8a5a33','#b9794a']),x,3,-60-r()*30,9,6,5);B(far,'#8a2a1a',x,6.3,-60,9.6,.6,5.6)},.4);
    row(9,x=>building(near,r,x,-26-r()*6,7+r()*3,5+r()*5,5,pick(r,['#c9a070','#d9b88a','#b98a5a']),'#8a2a1a'),.3);
    row(7,x=>stall(near,r,x,-7-r()*3),.35);
    row(15,x=>{const g=G0(near,x,0,-5.5);Y(g,'#5a3a1e',0,2.2,0,.08,4.4);for(let k=0;k<3;k++)D(g,pick(r,['#e8112d','#fcd116','#008751']),1.0+k*1.0,4.0-k*.05,0,.7,.9,.05)},.3);
    break;
  case 3: // Ganvié : village lacustre
    row(10,x=>stilt(near,r,x,-9-r()*6,.9+r()*.3),.3);
    row(13,x=>stilt(near,r,x,-22-r()*14,1.1+r()*.4),.4);
    row(16,x=>boat(near,r,x,-6.5-r()*3,pick(r,['#e8112d','#fcd116','#1f6feb','#fff3d6']),r()<.5),.4);
    row(30,x=>{const g=G0(near,x,0,-5);for(let k=0;k<3;k++)B(g,'#4a3320',k*.8,1.5,0,.08,3,.08).rz=(k-1)*.12;D(g,'#e8e0d0',.8,2.6,0,1.8,1.6,.03)},.4);
    row(9,x=>{for(let k=0;k<5;k++)Y(near,'#6a8f3a',x+k*.25,.8,-4.6-r()*.8,.05,1.6+r()*.7)},.5);
    break;
  case 4: // Grand-Popo : plage
    row(8,x=>palm(near,r,x,-7-r()*7,1+r()*.4,.15+r()*.3),.4);
    row(15,x=>{const g=G0(near,x,0,-14-r()*3);Y(g,'#8a6a3a',0,.9,0,1.5,1.8);K(g,'#d9b45a',0,2.7,0,2.2,1.8)},.4);
    row(22,x=>boat(far,r,x,-30-r()*26,pick(r,['#fff3d6','#e8112d','#fcd116']),true),.5);
    row(120,x=>lighthouse(far,x,-70),.2);
    row(6,x=>B(far,'#fff',x,-.2,-20-r()*70,3+r()*3,.04,.4,{em:.7,a:.7}),.5);
    break;
  case 5: // Ouidah : coucher de soleil, baobabs, porte du Non-Retour
    row(14,x=>baobab(near,r,x,-10-r()*8,.9+r()*.5),.4);
    row(26,x=>{const g=G0(near,x,0,-24);[-3,3].forEach(s=>{B(g,'#efe4cc',s,3,0,1.4,6,1.4);B(g,'#c24a2a',s,6.2,0,1.8,.4,1.8)});B(g,'#efe4cc',0,6.5,0,8,1.0,1.4);Q(g,'#c24a2a',0,7.4,0,2,1.1);for(let k=0;k<4;k++)B(g,'#8a6a45',-2.4+k*1.6,6.5,.75,.8,.6,.06)},.2);
    row(18,x=>{const g=G0(near,x,0,-14);B(g,'#efe4cc',0,1.8,0,9,3.6,4);for(let k=0;k<4;k++){B(g,'#8a6a45',-3.6+k*2.4,1.2,2.02,1.2,2.2,.06);S(g,'#8a6a45',-3.6+k*2.4,2.3,2.04,.6,.6,.05)}B(g,'#c24a2a',0,3.9,0,9.6,.4,4.6);Q(g,'#c24a2a',0,4.6,0,9.4,1.4)},.3);
    row(10,x=>palm(far,r,x,-60-r()*20,1.3,r()-.5),.4);
    hills('#7a5a4a',-3,-115);
    break;
  case 6: // Bohicon : gare et voie ferrée
    for(let x=xa;x<xb;x+=8){B(near,'#6a6a6e',x+4,.12,-8.5,8,.24,3.2);for(let k=0;k<6;k++)B(near,'#4a3320',x+.7+k*1.4,.3,-8.5,.4,.12,2.8);B(near,'#b0b4ba',x+4,.38,-7.6,8,.1,.12);B(near,'#b0b4ba',x+4,.38,-9.4,8,.1,.12)}
    row(30,x=>{for(let k=0;k<3;k++)carriage(near,r,x+k*7.4,-13.5,pick(r,['#1f6feb','#e0752a','#2a8f5a']))},.3);
    row(16,x=>pylon(near,r,x,-6.2),.2);
    row(46,x=>{const g=G0(near,x,0,-20);B(g,'#cfc6b0',0,2.2,0,10,4.4,5,{win:1,tag:r()*9});B(g,'#b5532a',0,4.7,0,11,.5,6);B(g,'#8a8a8e',0,3.2,3.6,10,.2,3);[-4,0,4].forEach(px=>Y(g,'#8a8a8e',px,1.5,4.9,.12,3))},.3);
    row(14,x=>{const g=G0(near,x,0,-30-r()*10);const s=r()<.5;if(s){Y(g,'#b0b4ba',0,4,0,1.6,8);S(g,'#9a9ea6',0,8,0,1.6,.8,1.6)}else{B(g,'#9a8a7a',0,2.4,0,7,4.8,5);B(g,'#7a2a1a',0,5.1,0,7.4,.5,5.4)}},.4);
    row(60,x=>{const g=G0(near,x,0,-8);Y(g,'#444',0,2.2,0,.07,4.4);S(g,'#ff3a2a',0,4.3,.1,.14,.14,.14,{em:1})},.3);
    break;
  case 7: // Abomey : palais royal
    row(14,x=>wall(near,r,x,-14-r()*3,12,pick(r,['#a8472a','#b9573a','#9a3f24'])),.2);
    row(24,x=>{const g=G0(near,x,0,-9);Y(g,'#8a6a3a',0,1.4,0,1.9,2.8);K(g,'#d9b45a',0,4,0,2.5,2.4);Y(g,'#5a3a1e',-1.4,1.5,1.5,.1,3);Y(g,'#5a3a1e',1.4,1.5,1.5,.1,3)},.3);
    row(40,x=>{const g=G0(near,x,0,-6);Y(g,'#5a3a1e',0,3.4,0,.08,6.8);B(g,'#e8112d',.8,6.2,0,1.4,.9,.04);B(g,'#fcd116',.8,5.3,0,1.4,.9,.04)},.3);
    row(10,x=>acacia(far,r,x,-50-r()*20,1.5,'#4a7a2a'),.4);
    row(30,x=>wall(far,r,x,-40,22,'#a8472a'),.3);
    break;
  case 8: // Pendjari : savane
    row(10,x=>acacia(near,r,x,-8-r()*14,.9+r()*.6),.4);
    row(24,x=>{const g=G0(near,x,0,-7-r()*3);K(g,'#a8764a',0,1.1,0,1.1,2.2);K(g,'#8a5a30',.8,.7,.3,.7,1.4)},.4);
    row(5,x=>tuft(near,r,x,-3-r()*5,pick(r,['#b8a050','#a5a542','#c9b060'])),.6);
    row(60,x=>elephant(far,r,x,-34-r()*14,1.2+r()*.4),.5);
    row(70,x=>giraffe(far,r,x,-40-r()*14,1.2+r()*.4),.5);
    row(45,x=>baobab(far,r,x,-60-r()*20,1.8),.5);
    hills('#b89a5a',-3,-118);
    break;
  case 9: // Tanguiéta : montagnes de l'Atacora, tata somba
    row(26,x=>mountain(far,r,x,-95-r()*20,28+r()*20,22+r()*18,pick(r,['#8a6a5a','#7a5a4a','#9a7a62']),false),.4);
    row(14,x=>mountain(far,r,x,-58-r()*10,16+r()*10,10+r()*8,'#7a6a5a',false),.4);
    row(22,x=>tata(near,r,x,-10-r()*7,.85+r()*.3),.4);
    row(12,x=>{const g=G0(near,x,0,-5-r()*6);S(g,'#8a8478',0,.7,0,1.3,.9,1.0);S(g,'#7a746a',1.1,.4,.5,.8,.55,.7)},.5);
    row(20,x=>acacia(near,r,x,-20-r()*10,.9,'#4a7a3a'),.4);
    break;
  case 10: // Nuit du Roi : forêt hantée et château
    row(16,x=>{const g=G0(near,x,0,-9-r()*10),s=1+r()*.6;Y(g,'#241a2e',0,3*s,0,.55*s,6*s).rz=(r()-.5)*.2;for(let k=0;k<4;k++){const a=k/4*PI*2+r();B(g,'#241a2e',Math.cos(a)*1.0*s,5.5*s,Math.sin(a)*.8*s,.2*s,2.6*s,.2*s).rz=Math.cos(a)*.7}S(g,'#1d1626',0,7.5*s,0,2.4*s,1.3*s,2.2*s);S(g,'#2a1e38',.4*s,8.4*s,0,1.5*s,.8*s,1.4*s)},.4);
    row(30,x=>{const g=G0(far,x,0,-60-r()*12),h=18+r()*14;B(g,'#1a1426',0,h/2,0,7,h,6,{win:1,tag:r()*9});K(g,'#2a1e38',0,h+3,0,4.6,6);[-3,3].forEach(s=>{Y(g,'#1a1426',s,h*.4,3,1.1,h*.8);K(g,'#2a1e38',s,h*.8+1.2,3,1.4,2.4)})},.4);
    row(7,x=>crystal(near,r,x,-4-r()*4,.7+r()*.8),.6);
    row(5,x=>{const s=.4+r()*.5;S(near,'#2a1e38',x,s*.6,-3-r()*3,s*1.2,s*.9,s*1.2)},.5);
    break;
  }
}

R.world=function(o){
  const L=o.lvl,r=rng(L*1013+7),th=o.TH,SPx=o.S,GY=o.GY;
  G.clear();
  const near=new N(),far=new N();
  const LWu=o.LW/SC,xa=-48,xb=LWu+70;
  const gc=GCOL[L-1],dirt=gc[0],grass=gc[1],water=L===3||L===4;
  const darker=mixc(dirt,'#000',.22);
  /* sol et plateformes */
  SPx.forEach(s=>{
    let x0=s.x/SC,w=s.w/SC,top=(GY-s.y)/SC,h=s.h/SC;
    if(s.g){
      if(s.x<=0){x0-=14;w+=14}
      if(Math.abs(s.x+s.w-o.LW)<2){w+=22}
      const cx=x0+w/2;
      B(near,dirt,cx,-1.575,0,w,2.85,8);
      B(near,grass,cx,-.2,0,w+.02,.4,8.04);
      B(near,mixc(grass,'#fff',.18),cx,-.02,3.9,w+.02,.06,.3);
      for(let k=0;k<w/1.9;k++){const px=x0+.8+k*1.9+r()*.6;B(near,darker,px,-1.0-(k%3)*.55,4.02,1.0+r()*.7,.14,.02);if(r()<.4)S(near,mixc(dirt,'#fff',.2),px+.3,-1.9,4.0,.26,.2,.1)}
      if(!water)for(let k=0;k<w/2.4;k++)if(r()<.8)tuft(near,r,x0+r()*w,4.35,grass);
      if(L===3)for(let k=0;k<w/1.2;k++)B(near,'#4a3320',x0+k*1.2+.6,-.19,0,.04,.4,8.06);
    }else{
      const cx=x0+w/2;
      B(near,'#c97b3c',cx,top-h/2,0,w,h,4);
      B(near,'#fcd116',cx,top-.1,0,w+.02,.2,4.04);
      B(near,'#8a4a1c',cx,top-h/2,2.01,w-.2,Math.max(.1,h-.4),.02);
      for(let k=0;k<w/1.4;k++)B(near,'#fcd116',x0+.7+k*1.4,top-h*.5,2.03,.5,.12,.02);
      if(h>1.4)for(let k=0;k<h*2.5;k++)B(near,'#fcd116',x0+.4,top-.4-k*.4,2.03,.16,.16,.02),B(near,'#fcd116',x0+w-.4,top-.4-k*.4,2.03,.16,.16,.02);
    }});
  /* piques */
  (o.SP||[]).forEach(k=>R.spikeNode(near,k.x/SC,k.w/SC));
  /* fond : prairie ou eau, plancher des fosses */
  const wcx=(xa+xb)/2,ww=xb-xa;
  if(L===3){B(far,'#3a9ac4',wcx,-.9,-62,ww,.5,130);B(far,'#8ad0e8',wcx,-.62,-4.5,ww,.04,3,{a:.9});B(far,'#2a7aa4',wcx,-3.3,10,ww,.4,40)}
  else if(L===4){B(far,'#d6bc78',wcx,-.42,-9,ww,.5,10);B(far,'#2f86c0',wcx,-.6,-70,ww,.5,120);B(far,'#7ac0e8',wcx,-.34,-17,ww,.05,3,{em:.6});B(far,'#1f6a9a',wcx,-3.3,10,ww,.4,40)}
  else{B(far,mixc(grass,'#000',.12),wcx,-.3,-64,ww,.5,124);B(far,L===10?'#0e0a18':'#3a2418',wcx,-3.7,10,ww,.4,40)}
  /* le décor de la ville */
  theme(L,near,far,r,xa,xb,LWu);
  /* arène du boss : torches et colonnes */
  if(o.boss){const a0=o.boss.A0/SC,a1=o.LW/SC;
    [a0+1.2,a0+13,a1-13,a1-1.2].forEach(x=>torch(near,x,-3.6));
    [a0-.6,a1+1.6].forEach(x=>{B(near,'#6a5a46',x,4,-3.5,1,8,1,{});B(near,'#8a7a66',x,8.2,-3.5,1.4,.5,1.4)});
    for(let x=a0+4;x<a1-3;x+=8){B(near,'#3b2112',x,9.2,-5,2.8,.18,.18);B(near,'#8a1a1a',x,7.5,-5,2.2,3.2,.08,{em:.12});D(near,'#fcd116',x,7.5,-4.94,.9,1.3,.06,{em:.7});B(near,'#fcd116',x,5.95,-4.95,2.2,.1,.06,{em:.4})}}
  G.bake(near,false);G.bake(far,true);G.commit();
  /* environnement */
  const e=G.env,lt=LT[L-1];
  e.top=rgb(th[0]);e.bot=rgb(th[1]);
  e.fog=L===10?mixc(th[1],'#000',.35):mixc(th[1],'#ffffff',.1);
  e.fogN=L===10?40:55;e.fogF=L===10?190:230;
  e.sky=lt.sky;e.gnd=lt.gnd;e.sun=lt.sun;e.ld=lt.ld;e.sunPos=lt.sp;e.sunCol=lt.sc;
  e.stars=L===10?1:0;G.stars(L===10);
  e.outline=L===10?[.04,.02,.1]:[.16,.08,.04];
  R.lvl=L;R.firefly=L===10||L===8;
};

/* ---------- image : caméra et acteurs animés ---------- */
const CAMP={d:27,h:7.4,ty:3.0,fov:38*PI/180};
let cxs=null,cys=0,shk=0,HM={},GHM={},cw=null,mqM=null,anM=null,flag=null,PJ={},ffN=null;
R.shake=n=>{shk=Math.max(shk,n|0)};
R.snap=()=>{cxs=null;cys=0};
R.resize=(w,h,pr)=>G.resize(w,h,pr);
R.proj=(x,y,z)=>G.proj(x,y,z,640,360);
R.count=()=>G.count();
function ensure(){
  if(cw)return;
  cw=cowrie();mqM=mosq(false);anM=ant();flag=flagNode();
  PJ.fire=proj('fire');PJ.stone=proj('stone');PJ.arrow=proj('arrow');PJ.orb=proj('orb');PJ.wave=proj('wave');
  ffN=D(null,'#e8ff6a',0,0,0,.2,.2,.2,{em:1})}
R.frame=function(g){
  ensure();
  const p=g.player,t=g.t,GY=g.GY,A=g.AVS;
  const tx=(g.cam+320)/SC;
  if(cxs==null||Math.abs(tx-cxs)>14)cxs=tx;else cxs+=(tx-cxs)*.3;
  const feet=(GY-(p.y+p.h))/SC;
  cys+=(cl(feet,0,9)*.35-cys)*.08;
  let sx=0,sy=0;if(shk>0){const k=shk/10;shk--;sx=(Math.random()-.5)*.4*k;sy=(Math.random()-.5)*.4*k}
  const cam=G.cam,CP=R.camOverride||CAMP;
  G.cam={x:cxs+sx+(CP.dx||0),y:CP.h+cys+sy,z:CP.d,tx:cxs+sx+(CP.dx||0),ty:CP.ty+cys+sy,tz:0,fov:CP.fov||CAMP.fov,near:.5,far:420,asp:cam.asp};
  G.env.time=t/60;
  G.begin();
  const vis=x=>Math.abs(x-cxs)<36;
  /* cauris */
  for(const c of g.C){if(c.t)continue;const x=c.x/SC;if(!vis(x))continue;
    cw.root.x=x;cw.root.y=(GY-c.y)/SC+Math.sin(t/12+c.x)*.12;cw.sh.ry=t*.05+c.x;G.add(cw.root)}
  /* ennemis et fourmis */
  for(const f of g.F){if(f.dead)continue;const x=(f.x+f.w/2)/SC;if(!vis(x))continue;
    const m=f.ant?anM:mqM;m.fy=f.fy||0;if(f.ant)poseAnt(m,f,t);else poseMosq(m,f,t,!!f.fly);f.fy=m.fy;
    m.root.x=x;m.root.y=(GY-(f.y+f.h))/SC;G.add(m.root)}
  /* boss */
  const b=g.boss;
  if(b&&!b.dead){
    if(b.m3===undefined){const mk=BO[g.lvl];b.m3=mk?mk():null}
    const m=b.m3;
    if(m){const x=(b.x+b.w/2)/SC;
      m.pose({t:b.t||t,warn:!!b.warn,vx:b.vx||0,vy:b.vy||0,g:!!b.g,hit:b.hit,inv:b.inv,enr:b.enr});
      const tgt=(b.f||-1)>=0?-.3:-PI+.3;b.fy3=(b.fy3==null?tgt:b.fy3);b.fy3+=(tgt-b.fy3)*.2;
      m.root.ry=b.fy3;m.root.x=x;m.root.y=(GY-(b.y+b.h))/SC;
      m.root.vis=!(b.inv>0&&b.inv%8>=4);m.root.fl=b.hit>0?.6:(b.enr?.12:0);
      m.root.sx=m.root.sy=m.root.sz=b.enr?1.06:1;
      G.add(m.root)}
    for(const q of b.P){const pm=q.wv?PJ.wave:PJ.orb;if(!q.wv)pm.root.k[0].c=rgb(q.col||'#ff5a4d');
      pm.root.x=(q.x+7)/SC;pm.root.y=(GY-(q.y+(q.wv?12:7)))/SC;G.add(pm.root)}}
  /* héros et fantômes */
  const poseH=(m,o,x,y)=>{poseHero(m,o);m.root.x=x;m.root.y=y;G.add(m.root)};
  const hm=HM[g.ME.a]||(HM[g.ME.a]=hero(g.ME.a,A[g.ME.a]));
  const sh=A[g.ME.a].shot;
  poseH(hm,{t,vx:p.vx,vy:p.vy,g:p.g,f:p.f,stun:p.stun>0,fire:sh&&p.cd>sh.cd-8?1:0},(p.x+11)/SC,(GY-(p.y+p.h))/SC);
  for(const q of g.ghosts){const i=q.a|0;let m=GHM[q.k];if(!m||m.i!==i){m=GHM[q.k]=hero(i,A[i]);m.i=i;m.px=q.x}
    const vx=(q.x-m.px)*.6;m.px=q.x;
    poseH(m,{t,vx,vy:0,g:Math.abs(q.y-m.py||0)<.5,f:q.f,stun:!!q.z,fire:0},(q.x+11)/SC,(GY-(q.y+34))/SC);m.py=q.y}
  /* projectiles du joueur */
  for(const q of g.PR){const pm=q.len?PJ.arrow:(q.a===0?PJ.fire:(q.a===1?PJ.stone:PJ.orb));
    if(pm===PJ.orb)pm.root.k[0].c=rgb(q.col||'#ff5a4d');
    pm.root.x=q.x/SC;pm.root.y=(GY-q.y)/SC;pm.root.ry=q.vx<0?PI:0;pm.root.rz=pm===PJ.stone?t*.3:0;G.add(pm.root)}
  /* drapeau d'arrivée */
  if(!b||b.dead){
    flag.root.x=(g.FLAG+62)/SC;
    flag.cloth.forEach((a,j)=>a.forEach(n=>{n.y=n.by+Math.sin(t*.12+j*.9)*.06*(j+1);n.z=Math.sin(t*.1+j)*.12*(j+1)}));
    G.add(flag.root)}
  /* lucioles */
  if(R.firefly){for(let i=0;i<24;i++){ffN.x=cxs+((i*5.7+t*.025*(1+i%3*.3))%48)-24;ffN.y=1.2+(i%6)*.9+Math.sin(t*.03+i)*.4;ffN.z=-3+(i%5)*2;ffN.em=.6+.4*Math.sin(t*.1+i*2);ffN.ry=t*.05;G.add(ffN)}}
  R.drawParts();
  G.render()};
R.ok=true;
return R})();
