
/* === Before/After Slider (drop-in) === */
(function(){
  const stage = document.querySelector('.ba-stage');
  if(!stage) return;

  const before = stage.querySelector('.ba-before');
  const after  = stage.querySelector('.ba-after');
  const handle = stage.querySelector('.ba-handle');
  const divider= stage.querySelector('.ba-divider');
  const prev   = stage.querySelector('.ba-prev');
  const next   = stage.querySelector('.ba-next');
  const gallery = JSON.parse(stage.dataset.items || '[]');
  let idx = 0;
  let pos = .5;

  function layout(){
    const pct = (pos*100).toFixed(3)+'%';
    before.style.clipPath = `inset(0 calc(100% - ${pct}) 0 0)`;
    divider.style.left = pct;
    handle.style.left = pct;
  }

  function load(i){
    idx = (i + gallery.length) % gallery.length;
    const item = gallery[idx];
    before.src = item.before;
    after.src  = item.after;
    // Reset split to center
    pos = .5; layout();
  }

  function onDrag(e){
    e.preventDefault();
    const rect = stage.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX : e.clientX;
    pos = Math.min(0.98, Math.max(0.02, (x - rect.left) / rect.width));
    layout();
  }

  let dragging = false;
  const start = (e)=>{ dragging = true; onDrag(e); };
  const move  = (e)=>{ if(dragging) onDrag(e); };
  const end   = ()=>{ dragging = false; };

  handle.addEventListener('mousedown', start);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);

  handle.addEventListener('touchstart', start, {passive:false});
  window.addEventListener('touchmove', move, {passive:false});
  window.addEventListener('touchend', end);
  window.addEventListener('touchcancel', end);

  prev.addEventListener('click', ()=> load(idx-1));
  next.addEventListener('click', ()=> load(idx+1));

  // Initialize
  if(gallery.length){
    load(0);
  }
  layout();
})();
