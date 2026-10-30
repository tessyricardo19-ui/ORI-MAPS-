/* g3.js : mini moteur 3D WebGL2 pour Cauri Rush.
   Tout est dessiné avec 6 formes de base (boîte, sphère, cylindre, cône, pyramide, losange), instanciées :
   une poignée d'appels de dessin par image. Ombrage « cartoon » à paliers, contours, brouillard,
   fenêtres d'immeubles calculées dans le shader. Aucune dépendance. */
const G3=(function(){
'use strict';
const R={ok:false,err:'',pr:1,cull:70};
const cvs=document.getElementById('g3');
if(!cvs){R.err='canvas g3 absent';return R}
let gl=null;
try{gl=cvs.getContext('webgl2',{antialias:true,alpha:false,depth:true,powerPreference:'high-performance'})}catch(e){}
if(!gl){R.err='WebGL2 indisponible';return R}

/* ------------------------------------------------------------ maths */
const M4=()=>new Float32Array(16);
function mMul(o,a,b){
  const a0=a[0],a1=a[1],a2=a[2],a3=a[3],a4=a[4],a5=a[5],a6=a[6],a7=a[7],a8=a[8],a9=a[9],a10=a[10],a11=a[11],a12=a[12],a13=a[13],a14=a[14],a15=a[15];
  for(let c=0;c<4;c++){const b0=b[c*4],b1=b[c*4+1],b2=b[c*4+2],b3=b[c*4+3];
    o[c*4]=a0*b0+a4*b1+a8*b2+a12*b3;o[c*4+1]=a1*b0+a5*b1+a9*b2+a13*b3;
    o[c*4+2]=a2*b0+a6*b1+a10*b2+a14*b3;o[c*4+3]=a3*b0+a7*b1+a11*b2+a15*b3}
  return o}
function mPersp(o,fovy,asp,n,f){const t=1/Math.tan(fovy/2),nf=1/(n-f);
  o.fill(0);o[0]=t/asp;o[5]=t;o[10]=(f+n)*nf;o[11]=-1;o[14]=2*f*n*nf;return o}
function mLook(o,ex,ey,ez,tx,ty,tz){
  let zx=ex-tx,zy=ey-ty,zz=ez-tz,l=1/Math.hypot(zx,zy,zz);zx*=l;zy*=l;zz*=l;
  let xx=zz,xy=0,xz=-zx;l=1/(Math.hypot(xx,xz)||1);xx*=l;xz*=l;            // haut = +Y
  const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
  o[0]=xx;o[1]=yx;o[2]=zx;o[3]=0;o[4]=xy;o[5]=yy;o[6]=zy;o[7]=0;o[8]=xz;o[9]=yz;o[10]=zz;o[11]=0;
  o[12]=-(xx*ex+xy*ey+xz*ez);o[13]=-(yx*ex+yy*ey+yz*ez);o[14]=-(zx*ex+zy*ey+zz*ez);o[15]=1;return o}

/* ------------------------------------------------------------ couleurs */
const CC=new Map();
function rgb(c){
  if(Array.isArray(c))return c;
  let v=CC.get(c);if(v)return v;
  let h=String(c).replace('#','');if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  const n=parseInt(h,16)||0;v=[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];CC.set(c,v);return v}
R.rgb=rgb;
R.mix=(a,b,t)=>{a=rgb(a);b=rgb(b);return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]};

/* ------------------------------------------------------------ formes */
const PR={};
function mk(name,pos,nor,idx){PR[name]={pos,nor,idx,n:idx.length}}
function geoBox(){const P=[],N=[],I=[];
  const F=[[0,0,1,[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]],[0,0,-1,[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]],
    [1,0,0,[.5,-.5,.5],[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5]],[-1,0,0,[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5]],
    [0,1,0,[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5],[-.5,.5,-.5]],[0,-1,0,[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5]]];
  F.forEach(f=>{const b=P.length/3;for(let i=3;i<7;i++){P.push(...f[i]);N.push(f[0],f[1],f[2])}I.push(b,b+1,b+2,b,b+2,b+3)});
  mk('box',P,N,I)}
function geoSph(sg,rg){const P=[],N=[],I=[];
  for(let j=0;j<=rg;j++){const v=j/rg,ph=v*Math.PI,y=Math.cos(ph),r=Math.sin(ph);
    for(let i=0;i<=sg;i++){const u=i/sg*Math.PI*2,x=Math.cos(u)*r,z=Math.sin(u)*r;P.push(x,y,z);N.push(x,y,z)}}
  for(let j=0;j<rg;j++)for(let i=0;i<sg;i++){const a=j*(sg+1)+i,b=a+sg+1;I.push(a,a+1,b,a+1,b+1,b)}
  mk('sph',P,N,I)}
function geoCyl(sg){const P=[],N=[],I=[];
  for(let i=0;i<=sg;i++){const u=i/sg*Math.PI*2,c=Math.cos(u),s=Math.sin(u);P.push(c,-.5,s,c,.5,s);N.push(c,0,s,c,0,s)}
  for(let i=0;i<sg;i++){const a=i*2;I.push(a,a+1,a+2,a+1,a+3,a+2)}
  [.5,-.5].forEach(y=>{const b=P.length/3,ny=y>0?1:-1;P.push(0,y,0);N.push(0,ny,0);
    for(let i=0;i<=sg;i++){const u=i/sg*Math.PI*2;P.push(Math.cos(u),y,Math.sin(u));N.push(0,ny,0)}
    for(let i=0;i<sg;i++)ny>0?I.push(b,b+2+i,b+1+i):I.push(b,b+1+i,b+2+i)});
  mk('cyl',P,N,I)}
function geoCone(name,sg,rad,off){const P=[],N=[],I=[],H=1;
  for(let i=0;i<sg;i++){const a0=off+i/sg*Math.PI*2,a1=off+(i+1)/sg*Math.PI*2,am=(a0+a1)/2,b=P.length/3;
    const nm=(a)=>{const x=Math.cos(a)*H,y=rad,z=Math.sin(a)*H,l=Math.hypot(x,y,z);return[x/l,y/l,z/l]};
    P.push(Math.cos(a0)*rad,-.5,Math.sin(a0)*rad,Math.cos(a1)*rad,-.5,Math.sin(a1)*rad,0,.5,0);
    N.push(...nm(a0),...nm(a1),...nm(am));I.push(b,b+2,b+1)}
  const b=P.length/3;P.push(0,-.5,0);N.push(0,-1,0);
  for(let i=0;i<=sg;i++){const a=off+i/sg*Math.PI*2;P.push(Math.cos(a)*rad,-.5,Math.sin(a)*rad);N.push(0,-1,0)}
  for(let i=0;i<sg;i++)I.push(b,b+1+i,b+2+i);
  mk(name,P,N,I)}
function geoDia(){ /* losange (octaèdre) : cristaux, étincelles */
  const P=[],N=[],I=[],V=[[0,.5,0],[0,-.5,0],[.5,0,0],[-.5,0,0],[0,0,.5],[0,0,-.5]];
  [[0,4,2],[0,2,5],[0,5,3],[0,3,4],[1,2,4],[1,5,2],[1,3,5],[1,4,3]].forEach(f=>{
    const a=V[f[0]],b=V[f[1]],c=V[f[2]],ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
    let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const l=Math.hypot(nx,ny,nz);nx/=l;ny/=l;nz/=l;
    const o=P.length/3;[a,b,c].forEach(p=>{P.push(...p);N.push(nx,ny,nz)});I.push(o,o+1,o+2)});
  mk('dia',P,N,I)}
geoBox();geoSph(14,10);geoCyl(12);geoCone('cone',12,1,0);geoCone('pyr',4,Math.SQRT2,Math.PI/4);geoDia();
const PN=['box','sph','cyl','cone','pyr','dia'];
const PI_={};PN.forEach((n,i)=>PI_[n]=i);
R.prim=PI_;

/* ------------------------------------------------------------ shaders */
const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNor;
layout(location=2) in vec4 iM0;
layout(location=3) in vec4 iM1;
layout(location=4) in vec4 iM2;
layout(location=5) in vec4 iM3;
layout(location=6) in vec4 iCol;
layout(location=7) in vec4 iPar;
uniform mat4 uVP;
uniform float uOut;
out vec3 vN;out vec3 vW;out vec4 vCol;out vec4 vPar;out vec3 vP;out vec3 vSz;
void main(){
  mat4 M=mat4(iM0,iM1,iM2,iM3);
  vec3 s2=vec3(dot(iM0.xyz,iM0.xyz),dot(iM1.xyz,iM1.xyz),dot(iM2.xyz,iM2.xyz));
  vec3 n=normalize(mat3(M)*(aNor/s2));
  vec3 w=(M*vec4(aPos,1.0)).xyz;
  if(uOut>0.5){
    if(iPar.y<=0.0){gl_Position=vec4(2.0,2.0,2.0,1.0);return;}
    w+=n*iPar.y;
  }
  vN=n;vW=w;vCol=iCol;vPar=iPar;vP=aPos+0.5;vSz=sqrt(s2);
  gl_Position=uVP*vec4(w,1.0);
}`;
const FS=`#version 300 es
precision highp float;
in vec3 vN;in vec3 vW;in vec4 vCol;in vec4 vPar;in vec3 vP;in vec3 vSz;
uniform vec3 uCam;uniform vec3 uLd;uniform vec3 uSky;uniform vec3 uGnd;uniform vec3 uSun;
uniform vec3 uFogC;uniform vec2 uFog;uniform float uOut;uniform vec3 uOutC;
out vec4 o;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  float dist=length(vW-uCam);
  float fg=clamp((dist-uFog.x)/(uFog.y-uFog.x),0.0,1.0);
  if(uOut>0.5){o=vec4(mix(uOutC,uFogC,fg),1.0);return;}
  vec3 n=normalize(vN);
  vec3 base=vCol.rgb;
  float lit=0.0;
  if(vPar.z>0.5){
    vec3 an=abs(n);
    if(an.y<0.5){
      vec2 uv=an.x>an.z?vec2(vP.z*vSz.z,vP.y*vSz.y):vec2(vP.x*vSz.x,vP.y*vSz.y);
      vec2 cell=vec2(0.95,1.25);vec2 id=floor(uv/cell);vec2 f=fract(uv/cell);
      float win=step(0.2,f.x)*step(f.x,0.8)*step(0.25,f.y)*step(f.y,0.78);
      vec2 sz=an.x>an.z?vSz.zy:vSz.xy;
      win*=step(0.5,uv.x)*step(uv.x,sz.x-0.5)*step(1.0,uv.y)*step(uv.y,sz.y-0.9);
      float h=hash(id+vec2(vPar.w*17.0,vPar.w*5.0));
      vec3 wc=h>0.55?vec3(1.0,0.86,0.45):vec3(0.2,0.3,0.42);
      lit=win*step(0.55,h);
      base=mix(base,wc,win);
    }
  }
  float nd=dot(n,uLd);
  float band=nd<-0.15?0.0:(nd<0.25?0.4:(nd<0.6?0.75:1.0));
  vec3 amb=mix(uGnd,uSky,n.y*0.5+0.5);
  vec3 L=amb*0.68+uSun*(0.12+0.5*band);
  vec3 col=base*L;
  vec3 V=normalize(uCam-vW);
  float rim=pow(1.0-max(dot(n,V),0.0),3.0);
  col+=uSky*rim*0.14;
  col=mix(col,base,clamp(vCol.a+lit*0.8,0.0,1.0));
  col=mix(col,uFogC,fg);
  o=vec4(col,vPar.x);
}`;
const SVS=`#version 300 es
precision highp float;
out vec2 vUv;
void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));vUv=p;gl_Position=vec4(p*2.0-1.0,0.9999,1.0);}`;
const SFS=`#version 300 es
precision highp float;
in vec2 vUv;uniform vec3 uTop;uniform vec3 uBot;uniform vec3 uSunC;uniform vec3 uSun;uniform float uAsp;
out vec4 o;
void main(){
  float t=smoothstep(0.0,1.0,vUv.y);
  vec3 c=mix(uBot,uTop,pow(t,0.8));
  vec2 p=(vUv-uSun.xy)*vec2(uAsp,1.0);float d=length(p);
  c+=uSunC*exp(-d*3.2)*0.35;
  c=mix(c,uSunC,smoothstep(uSun.z,uSun.z*0.9,d));
  o=vec4(c,1.0);
}`;
const PVS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aS;uniform float uT;uniform float uPx;out float vA;
void main(){vA=0.45+0.55*abs(sin(uT*1.7+aS.z*40.0));gl_Position=vec4(aS.xy,0.0,1.0);gl_PointSize=(1.2+aS.z*2.2)*uPx;}`;
const PFS=`#version 300 es
precision highp float;in float vA;out vec4 o;void main(){o=vec4(1.0,0.97,0.88,vA);}`;

function prog(vs,fs){
  const p=gl.createProgram();
  [[gl.VERTEX_SHADER,vs],[gl.FRAGMENT_SHADER,fs]].forEach(([t,s])=>{
    const sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);
    if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));
    gl.attachShader(p,sh)});
  gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
  return p}
let PM,PS,PP;const U={};
try{
  PM=prog(VS,FS);PS=prog(SVS,SFS);PP=prog(PVS,PFS);
  ['uVP','uOut','uCam','uLd','uSky','uGnd','uSun','uFogC','uFog','uOutC'].forEach(n=>U[n]=gl.getUniformLocation(PM,n));
  ['uTop','uBot','uSunC','uSun','uAsp'].forEach(n=>U['s_'+n]=gl.getUniformLocation(PS,n));
  ['uT','uPx'].forEach(n=>U['p_'+n]=gl.getUniformLocation(PP,n));
}catch(e){R.err='shader: '+e.message;return R}

/* ------------------------------------------------------------ tampons */
const STRIDE=24,SB=STRIDE*4;
const geo=PN.map(n=>{
  const g=PR[n],v=gl.createBuffer(),inter=new Float32Array(g.pos.length*2);
  for(let i=0;i<g.pos.length/3;i++){inter.set(g.pos.slice(i*3,i*3+3),i*6);inter.set(g.nor.slice(i*3,i*3+3),i*6+3)}
  gl.bindBuffer(gl.ARRAY_BUFFER,v);gl.bufferData(gl.ARRAY_BUFFER,inter,gl.STATIC_DRAW);
  const e=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,e);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(g.idx),gl.STATIC_DRAW);
  return{v,e,n:g.n}});
function vao(pi,ib,off){
  const a=gl.createVertexArray();gl.bindVertexArray(a);
  gl.bindBuffer(gl.ARRAY_BUFFER,geo[pi].v);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);
  gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,geo[pi].e);
  gl.bindBuffer(gl.ARRAY_BUFFER,ib);
  for(let k=0;k<6;k++){gl.enableVertexAttribArray(2+k);gl.vertexAttribPointer(2+k,4,gl.FLOAT,false,SB,(off||0)+k*16);gl.vertexAttribDivisor(2+k,1)}
  gl.bindVertexArray(null);return a}

/* instances dynamiques : opaques (D) et transparentes (T) */
function lst(){return{a:new Float32Array(STRIDE*256),n:0}}
const D=PN.map(lst),T=PN.map(lst);
const DB=PN.map(()=>({buf:gl.createBuffer(),cap:0})),TB=PN.map(()=>({buf:gl.createBuffer(),cap:0}));
const DV=PN.map((_,i)=>null),TV=PN.map((_,i)=>null);
function grow(l){const b=new Float32Array(l.a.length*2);b.set(l.a);l.a=b}

/* ------------------------------------------------------------ nœuds */
class N{
  constructor(prim,col,o){
    this.x=0;this.y=0;this.z=0;this.rx=0;this.ry=0;this.rz=0;this.sx=1;this.sy=1;this.sz=1;
    this.k=[];this.p=null;this.vis=true;
    this.prim=prim==null?-1:(typeof prim==='string'?PI_[prim]:prim);
    this.c=col==null?[1,1,1]:rgb(col);this.em=0;this.a=1;this.ol=0;this.win=0;this.fl=0;this.tag=0;
    if(o)Object.assign(this,o)}
  add(n){n.p=this;this.k.push(n);return n}
  pos(x,y,z){this.x=x;this.y=y;this.z=z;return this}
  scl(x,y,z){this.sx=x;this.sy=y==null?x:y;this.sz=z==null?x:z;return this}
  rot(x,y,z){this.rx=x||0;this.ry=y||0;this.rz=z||0;return this}
}
R.N=N;
const ST=[];for(let i=0;i<12;i++)ST.push(M4());
const LM=M4();
function local(o,n){
  const sx=n.sx,sy=n.sy,sz=n.sz;
  if(!n.rx&&!n.ry&&!n.rz){o[0]=sx;o[1]=0;o[2]=0;o[3]=0;o[4]=0;o[5]=sy;o[6]=0;o[7]=0;o[8]=0;o[9]=0;o[10]=sz;o[11]=0}
  else{
    const cx=Math.cos(n.rx),sx_=Math.sin(n.rx),cy=Math.cos(n.ry),sy_=Math.sin(n.ry),cz=Math.cos(n.rz),sz_=Math.sin(n.rz);
    o[0]=(cy*cz+sy_*sx_*sz_)*sx;o[1]=cx*sz_*sx;o[2]=(-sy_*cz+cy*sx_*sz_)*sx;o[3]=0;
    o[4]=(-cy*sz_+sy_*sx_*cz)*sy;o[5]=cx*cz*sy;o[6]=(sy_*sz_+cy*sx_*cz)*sy;o[7]=0;
    o[8]=sy_*cx*sz;o[9]=-sx_*sz;o[10]=cy*cx*sz;o[11]=0}
  o[12]=n.x;o[13]=n.y;o[14]=n.z;o[15]=1;return o}
function put(l,m,n,fl){
  if((l.n+1)*STRIDE>l.a.length)grow(l);
  const a=l.a,b=l.n*STRIDE;l.n++;
  for(let i=0;i<16;i++)a[b+i]=m[i];
  const c=n.c,f=Math.max(fl,n.fl);
  if(f>0){a[b+16]=c[0]+(1-c[0])*f;a[b+17]=c[1]+(1-c[1])*f;a[b+18]=c[2]+(1-c[2])*f;a[b+19]=Math.max(n.em,f*0.85)}
  else{a[b+16]=c[0];a[b+17]=c[1];a[b+18]=c[2];a[b+19]=n.em}
  a[b+20]=n.a;a[b+21]=n.ol;a[b+22]=n.win;a[b+23]=n.tag||0}
function emit(n,par,depth,fl,sink,wantAlpha){
  if(!n.vis)return;
  const m=ST[depth];mMul(m,par,local(LM,n));
  const f=Math.max(fl,n.fl);
  if(n.prim>=0){
    if(sink){sink(n.prim,m,n,f)}
    else put(n.a<1?T[n.prim]:D[n.prim],m,n,f)}
  for(let i=0,k=n.k;i<k.length;i++)emit(k[i],m,depth+1,f,sink)}
const I4=M4();I4[0]=I4[5]=I4[10]=I4[15]=1;

/* ------------------------------------------------------------ monde statique */
const SL=[];          // listes en construction : {far,chunk,prim -> lst}
let SW=null;          // monde commité
const CH=32;          // largeur d'un bloc (unités)
const bake={near:new Map(),far:new Map()};
R.bake=function(root,far,cw){
  const store=far?bake.far:bake.near;
  emit(root,I4,0,0,(pi,m,n,f)=>{
    const key=far?0:Math.floor(m[12]/(cw||CH));
    let c=store.get(key);if(!c){c={key,l:PN.map(lst),x0:1e9,x1:-1e9};store.set(key,c)}
    put(n.a<1?(c.t||(c.t=PN.map(lst)))[pi]:c.l[pi],m,n,f);
    c.x0=Math.min(c.x0,m[12]);c.x1=Math.max(c.x1,m[12])},false)};
function commitSet(store){
  const out=[];
  store.forEach(c=>{
    const e={x0:c.x0,x1:c.x1,key:c.key,op:[],tr:[]};
    [['op',c.l],['tr',c.t]].forEach(([nm,L])=>{if(!L)return;
      L.forEach((l,pi)=>{if(!l.n)return;
        const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,l.a.subarray(0,l.n*STRIDE),gl.STATIC_DRAW);
        e[nm].push({pi,n:l.n,b,v:vao(pi,b,0)})})});
    out.push(e)});
  return out}
function freeSet(s){if(!s)return;s.forEach(e=>['op','tr'].forEach(k=>e[k].forEach(q=>{gl.deleteBuffer(q.b);gl.deleteVertexArray(q.v)})))}
R.commit=function(){
  if(SW){freeSet(SW.near);freeSet(SW.far)}
  SW={near:commitSet(bake.near),far:commitSet(bake.far)};
  bake.near.clear();bake.far.clear()};
R.clear=function(){bake.near.clear();bake.far.clear();if(SW){freeSet(SW.near);freeSet(SW.far);SW=null}};

/* ------------------------------------------------------------ cadre */
const VP=M4(),PRJ=M4(),VW=M4();
let SKYV=null,STARB=null,STARN=0,W_=1,H_=1;
R.cam={x:0,y:5,z:16,tx:0,ty:3.4,tz:0,fov:38*Math.PI/180,near:.5,far:420,asp:16/9};
R.env={top:[.4,.7,.95],bot:[.8,.93,.99],fog:[.8,.93,.99],fogN:40,fogF:170,sky:[.95,.97,1],gnd:[.6,.5,.4],sun:[1,.95,.85],ld:[-.4,.8,.5],
  sunPos:[.8,.78,.07],sunCol:[1,.95,.7],stars:0,outline:[.16,.08,.04],time:0};
R.stars=function(on){
  if(!on){STARN=0;return}
  if(!STARB){const n=140,a=new Float32Array(n*3);let s=7;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
    for(let i=0;i<n;i++){a[i*3]=r()*2-1;a[i*3+1]=r()*1.1-0.1;a[i*3+2]=r()}
    STARB=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,STARB);gl.bufferData(gl.ARRAY_BUFFER,a,gl.STATIC_DRAW);STARN=n;
    SKYV=gl.createVertexArray();gl.bindVertexArray(SKYV);gl.bindBuffer(gl.ARRAY_BUFFER,STARB);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.bindVertexArray(null)}
  STARN=140};
R.resize=function(w,h,pr){
  R.pr=pr;const W=Math.max(2,Math.round(w*pr)),H=Math.max(2,Math.round(h*pr));
  if(cvs.width!==W||cvs.height!==H){cvs.width=W;cvs.height=H}
  W_=W;H_=H;R.cam.asp=W/H};
R.begin=function(){for(let i=0;i<PN.length;i++){D[i].n=0;T[i].n=0}};
R.add=function(node,parent){emit(node,parent||I4,0,0,null,true)};
function drawDyn(L,B,V,i){
  const l=L[i];if(!l.n)return;
  gl.bindBuffer(gl.ARRAY_BUFFER,B[i].buf);
  if(B[i].cap<l.n){B[i].cap=Math.max(l.n,Math.ceil(B[i].cap*1.5),256);gl.bufferData(gl.ARRAY_BUFFER,B[i].cap*SB,gl.DYNAMIC_DRAW);if(V[i]){gl.deleteVertexArray(V[i]);V[i]=null}}
  gl.bufferSubData(gl.ARRAY_BUFFER,0,l.a.subarray(0,l.n*STRIDE));
  if(!V[i])V[i]=vao(i,B[i].buf,0);
  gl.bindVertexArray(V[i]);
  gl.drawElementsInstanced(gl.TRIANGLES,geo[i].n,gl.UNSIGNED_SHORT,0,l.n)}
function setEnv(e,c){
  gl.uniformMatrix4fv(U.uVP,false,VP);gl.uniform3f(U.uCam,c.x,c.y,c.z);
  const l=e.ld,q=1/Math.hypot(l[0],l[1],l[2]);gl.uniform3f(U.uLd,l[0]*q,l[1]*q,l[2]*q);
  gl.uniform3fv(U.uSky,e.sky);gl.uniform3fv(U.uGnd,e.gnd);gl.uniform3fv(U.uSun,e.sun);
  gl.uniform3fv(U.uFogC,e.fog);gl.uniform2f(U.uFog,e.fogN,e.fogF);gl.uniform3fv(U.uOutC,e.outline)}
R.render=function(){
  const c=R.cam,e=R.env;
  mPersp(PRJ,c.fov,c.asp,c.near,c.far);mLook(VW,c.x,c.y,c.z,c.tx,c.ty,c.tz);mMul(VP,PRJ,VW);
  gl.viewport(0,0,W_,H_);
  gl.clearColor(e.bot[0],e.bot[1],e.bot[2],1);gl.clearDepth(1);gl.depthMask(true);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  /* ciel */
  gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);
  gl.useProgram(PS);gl.uniform3fv(U.s_uTop,e.top);gl.uniform3fv(U.s_uBot,e.bot);gl.uniform3fv(U.s_uSunC,e.sunCol);
  gl.uniform3fv(U.s_uSun,e.sunPos);gl.uniform1f(U.s_uAsp,c.asp);
  gl.bindVertexArray(null);gl.drawArrays(gl.TRIANGLES,0,3);
  if(STARN&&e.stars){gl.useProgram(PP);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1f(U.p_uT,e.time);gl.uniform1f(U.p_uPx,R.pr);gl.bindVertexArray(SKYV);gl.drawArrays(gl.POINTS,0,STARN);gl.disable(gl.BLEND)}
  /* monde */
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);
  gl.useProgram(PM);setEnv(e,c);gl.uniform1f(U.uOut,0);
  const camX=c.tx;
  if(SW){
    SW.far.forEach(s=>s.op.forEach(q=>{gl.bindVertexArray(q.v);gl.drawElementsInstanced(gl.TRIANGLES,geo[q.pi].n,gl.UNSIGNED_SHORT,0,q.n)}));
    SW.near.forEach(s=>{if(s.x1<camX-R.cull||s.x0>camX+R.cull)return;s.op.forEach(q=>{gl.bindVertexArray(q.v);gl.drawElementsInstanced(gl.TRIANGLES,geo[q.pi].n,gl.UNSIGNED_SHORT,0,q.n)})})}
  for(let i=0;i<PN.length;i++)drawDyn(D,DB,DV,i);
  /* contours des acteurs */
  gl.cullFace(gl.FRONT);gl.uniform1f(U.uOut,1);
  for(let i=0;i<PN.length;i++)if(D[i].n){gl.bindVertexArray(DV[i]);gl.drawElementsInstanced(gl.TRIANGLES,geo[i].n,gl.UNSIGNED_SHORT,0,D[i].n)}
  gl.cullFace(gl.BACK);gl.uniform1f(U.uOut,0);
  /* transparents */
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.disable(gl.CULL_FACE);
  if(SW){SW.far.forEach(s=>s.tr.forEach(q=>{gl.bindVertexArray(q.v);gl.drawElementsInstanced(gl.TRIANGLES,geo[q.pi].n,gl.UNSIGNED_SHORT,0,q.n)}));
    SW.near.forEach(s=>{if(s.x1<camX-R.cull||s.x0>camX+R.cull)return;s.tr.forEach(q=>{gl.bindVertexArray(q.v);gl.drawElementsInstanced(gl.TRIANGLES,geo[q.pi].n,gl.UNSIGNED_SHORT,0,q.n)})})}
  for(let i=0;i<PN.length;i++)drawDyn(T,TB,TV,i);
  gl.depthMask(true);gl.disable(gl.BLEND);gl.bindVertexArray(null)};
/* projection monde -> pixels du HUD (640x360) */
R.proj=function(x,y,z,W,H){
  const m=VP,w=m[3]*x+m[7]*y+m[11]*z+m[15];if(w<=0)return null;
  return[((m[0]*x+m[4]*y+m[8]*z+m[12])/w*.5+.5)*W,(1-((m[1]*x+m[5]*y+m[9]*z+m[13])/w*.5+.5))*H]};
R.count=()=>{let a=0;for(let i=0;i<PN.length;i++)a+=D[i].n+T[i].n;return a};
R.gl=gl;R.ok=true;
return R})();
