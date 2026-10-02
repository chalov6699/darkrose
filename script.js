// Reveal animations with a safe fallback: content remains visible if JS is disabled.
const io = new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Build the self-contained CSS 3D rose (no external libraries).
function buildRose(target, compact=false){
  target.innerHTML='';
  const layers=[
    {count:12,cls:'',tilt:66,z:-8,spread:1},
    {count:10,cls:'mid',tilt:48,z:20,spread:.78},
    {count:8,cls:'inner',tilt:30,z:44,spread:.54}
  ];
  layers.forEach((layer,li)=>{
    for(let i=0;i<layer.count;i++){
      const p=document.createElement('span');
      p.className='petal '+layer.cls;
      const a=i*(360/layer.count)+(li%2?18:0);
      const jitter=(i%3-1)*5;
      p.style.transform=`rotateZ(${a}deg) rotateX(${layer.tilt+jitter}deg) translateZ(${layer.z}px) scale(${layer.spread})`;
      p.style.zIndex=String(2+li);
      target.appendChild(p);
    }
  });
  const core=document.createElement('span');core.className='rose-core';target.appendChild(core);
  if(compact){target.querySelectorAll('.petal').forEach(p=>p.style.filter='saturate(.9) brightness(.92)')}
}
buildRose(document.getElementById('rose3d'));
const poster=document.getElementById('posterRose');
const clone=document.createElement('div');clone.className='rose3d';clone.style.animationDuration='18s';poster.appendChild(clone);buildRose(clone,true);

// Bouquet card flowers.
document.querySelectorAll('.bouquet').forEach((b,idx)=>{
  const count=Number(b.dataset.count||15);
  for(let i=0;i<count;i++){
    const r=document.createElement('i');r.className='mini-rose';
    const golden=i*2.399963229728653;
    const rad=Math.sqrt(i/(count-1))*92;
    const x=Math.cos(golden)*rad;
    const y=Math.sin(golden)*rad*.68-30;
    const s=.65+(1-i/count)*.5;
    r.style.left=`calc(50% + ${x}px - 29px)`;r.style.top=`calc(43% + ${y}px - 29px)`;r.style.setProperty('--s',s.toFixed(2));
    r.style.zIndex=String(2+Math.round(100-y));
    if((i+idx)%4===0) r.style.filter='brightness(.8) saturate(.85)';
    b.appendChild(r);
  }
});

// Interactive tilt while rose keeps spinning independently.
const scene=document.getElementById('roseScene');
const wrap=document.getElementById('roseWrap');
scene.addEventListener('pointermove',e=>{
  const r=scene.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5;
  const y=(e.clientY-r.top)/r.height-.5;
  wrap.style.transform=`rotateX(${-y*8}deg) rotateY(${x*10}deg) translateY(${-y*8}px)`;
});
scene.addEventListener('pointerleave',()=>wrap.style.transform='');

// Cursor light / parallax polish.
const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{glow.style.transform=`translate(${e.clientX-180}px,${e.clientY-180}px)`});
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  document.querySelector('.orbit-a').style.transform=`translateY(${y*.08}px)`;
  document.querySelector('.orbit-b').style.transform=`translateY(${-y*.05}px)`;
});
