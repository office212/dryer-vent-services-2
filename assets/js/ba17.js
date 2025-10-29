
// DVS 1.7 – BA slider logic
(function(){
  const root = document.querySelector('#before-after .ba17');
  if(!root) return;
  const stage = root.querySelector('.stage');
  const pair  = root.querySelector('.pair');
  const before = pair.querySelector('.before');
  const after  = pair.querySelector('.after');
  const afterWrap = root.querySelector('.afterWrap');
  const handle   = root.querySelector('.handle');
  const knob     = root.querySelector('.knob');
  const prevBtn  = root.querySelector('.prev');
  const nextBtn  = root.querySelector('.next');

  // Pairs from inline data on the script tag (set by server), fallback to dataset on root
  let PAIRS = window.__DVS_BA__ || [];
  let i = 0;

  function setPair(n){
    i = (n + PAIRS.length) % PAIRS.length;
    before.src = PAIRS[i][0];
    after.src  = PAIRS[i][1];
    setPos(0.5);
  }
  function setPos(p){
    p = Math.max(0.05, Math.min(0.95, p));
    const percent = (p*100).toFixed(2) + '%';
    afterWrap.style.width = percent;
    handle.style.left = percent;
    knob.style.left = percent;
  }

  function startDrag(e){
    e.preventDefault();
    const move = (ev)=>{
      const clientX = (ev.touches && ev.touches[0]) ? ev.touches[0].clientX : ev.clientX;
      const r = stage.getBoundingClientRect();
      setPos((clientX - r.left) / r.width);
    };
    const up = ()=>{
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, {passive:false});
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
  }

  handle.addEventListener('mousedown', startDrag);
  handle.addEventListener('touchstart', startDrag, {passive:false});
  knob.addEventListener('mousedown', startDrag);
  knob.addEventListener('touchstart', startDrag, {passive:false});

  prevBtn.addEventListener('click', ()=> setPair(i-1));
  nextBtn.addEventListener('click', ()=> setPair(i+1));

  if(PAIRS.length){ setPair(0); }
})();
