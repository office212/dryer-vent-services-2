// DVS Before/After 2.0.2 – drag-friendly on mobile
(() => {
  const PAIRS = [
    { before: "assets/img/ba/before-01.jpg", after: "assets/img/ba/after-01.jpg" },
    { before: "assets/img/ba/before-02.jpg", after: "assets/img/ba/after-02.jpg" },
    { before: "assets/img/ba/before-03.jpg", after: "assets/img/ba/after-03.jpg" }
  ];
  const root = document.getElementById('dvsBA'); if(!root) return;
  const imgB = document.getElementById('baImgBefore');
  const imgA = document.getElementById('baImgAfter');
  const knob = document.getElementById('baKnob');
  const prev = document.getElementById('baPrev');
  const next = document.getElementById('baNext');
  const divider = root.querySelector('.dvs-divider');

  let idx=0, dragging=false, startX=0, startY=0, decided=null;
  const TH=8;
  function setPair(i){
    idx = (i+PAIRS.length)%PAIRS.length;
    imgB.src=PAIRS[idx].before; imgA.src=PAIRS[idx].after; setCut(50);
  }
  function setCut(p){ p=Math.max(0,Math.min(100,p)); root.style.setProperty('--cut',p+'%'); divider.style.left='calc('+p+'% - 1px)'; knob.style.left=p+'%'; }
  function cutFromClientX(cx){
    const r=root.getBoundingClientRect(); const x=Math.min(Math.max(cx-r.left,0),r.width); setCut((x/r.width)*100);
  }
  function down(e){ const t=e.touches?e.touches[0]:e; dragging=true; decided=null; startX=t.clientX; startY=t.clientY; cutFromClientX(t.clientX); }
  function move(e){ if(!dragging) return; const t=e.touches?e.touches[0]:e; const dx=Math.abs(t.clientX-startX), dy=Math.abs(t.clientY-startY); if(!decided && (dx>TH||dy>TH)) decided = dx>dy ? 'x':'y'; if(decided==='x'){ if(e.cancelable) e.preventDefault(); cutFromClientX(t.clientX);} }
  function up(){ dragging=false; decided=null; }

  knob.addEventListener('pointerdown', down, {passive:true});
  window.addEventListener('pointermove', move, {passive:false});
  window.addEventListener('pointerup', up, {passive:true});
  knob.addEventListener('touchstart', down, {passive:true});
  window.addEventListener('touchmove', move, {passive:false});
  window.addEventListener('touchend', up, {passive:true});
  prev.addEventListener('click', ()=>setPair(idx-1), {passive:true});
  next.addEventListener('click', ()=>setPair(idx+1), {passive:true});
  root.addEventListener('click', (e)=>{ if(e.target!==knob && e.clientX!=null) cutFromClientX(e.clientX); });
  setPair(0);
})();