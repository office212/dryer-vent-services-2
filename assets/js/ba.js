(function(){
  function initBA(section){
    const viewport = section.querySelector('.ba-viewport');
    const afterClip = section.querySelector('.ba-afterClip');
    const divider = section.querySelector('.ba-divider');
    const knob = section.querySelector('.ba-knob');
    let pct = 0.5;

    function setPct(p){
      pct = Math.max(0, Math.min(1, p));
      const w = viewport.clientWidth;
      const x = Math.round(pct * w);
      afterClip.style.clipPath = `polygon(0 0, ${x}px 0, ${x}px 100%, 0 100%)`;
      divider.style.left = x + 'px';
      knob.style.left = x + 'px';
    }

    function onDrag(e){
      const rect = viewport.getBoundingClientRect();
      const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
      setPct((clientX - rect.left) / rect.width);
    }
    let dragging=false;
    viewport.addEventListener('mousedown', (e)=>{ dragging=true; onDrag(e); });
    viewport.addEventListener('touchstart', (e)=>{ dragging=true; onDrag(e); }, {passive:true});
    window.addEventListener('mousemove', (e)=> dragging && onDrag(e));
    window.addEventListener('touchmove', (e)=> dragging && onDrag(e), {passive:true});
    window.addEventListener('mouseup', ()=> dragging=false);
    window.addEventListener('touchend', ()=> dragging=false);

    setPct(.5);
  }

  function initCarousel(root){
    const items = JSON.parse(root.dataset.items || "[]");
    let idx = 0;
    const imgBefore = root.querySelector('.ba-img.before');
    const imgAfter  = root.querySelector('.ba-img.after');
    function set(idxNew){
      idx = (idxNew + items.length) % items.length;
      imgBefore.src = items[idx].before;
      imgAfter.src  = items[idx].after;
    }
    root.querySelector('.ba-arrow.left').addEventListener('click', ()=> set(idx-1));
    root.querySelector('.ba-arrow.right').addEventListener('click', ()=> set(idx+1));
    set(0);
  }

  document.querySelectorAll('.ba-section').forEach(function(sec){
    initCarousel(sec);
    initBA(sec);
  });
})();