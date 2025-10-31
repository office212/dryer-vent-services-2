
/* Beta 1.9 mobile drag fix */
(function(){
  const root = document;
  const addListener = (el, type, fn, opts) => {
    try { el.addEventListener(type, fn, Object.assign({passive:false}, opts||{})); }
    catch(err){ el.addEventListener(type, fn, false); }
  };
  function enhanceSlider(slider){
    let dragging = false;
    const handle = slider.querySelector('.ba-handle, .handle, .twentytwenty-handle, .icv__controller');
    const track  = slider;
    if(!handle) return;
    const start = (ev) => {
      dragging = true;
      ev.preventDefault();
      slider.classList.add('ba-dragging');
    };
    const move = (ev) => {
      if(!dragging) return;
      ev.preventDefault();
    };
    const end = () => { dragging = false; slider.classList.remove('ba-dragging'); };
    [handle, track].forEach(el=>{
      if(!el) return;
      addListener(el,'pointerdown',start);
      addListener(root,'pointermove',move);
      addListener(root,'pointerup',end);
      addListener(el,'touchstart',start);
      addListener(root,'touchmove',move);
      addListener(root,'touchend',end);
      addListener(el,'mousedown',start);
      addListener(root,'mousemove',move);
      addListener(root,'mouseup',end);
    });
  }
  root.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('.ba-slider, .before-after, .twentytwenty-container, .icv').forEach(enhanceSlider);
  });
})();


(function(){
  const root = document.querySelector('[data-ba-root]');
  if(!root) return;

  const slides = [...root.querySelectorAll('.ba-slide')];
  let idx = 0;

  function show(i){
    idx = (i+slides.length)%slides.length;
    slides.forEach((s,si)=>{ s.style.display = si===idx ? 'block':'none'; });
    updateDots();
  }

  function updateDots(){
    const dots = root.querySelectorAll('.ba-dot');
    dots.forEach((d,i)=>{ d.classList.toggle('active', i===idx); });
  }

  function setupSlide(slide){
    const viewport = slide.querySelector('.ba-viewport');
    const divider = slide.querySelector('.ba-divider');
    const knob = slide.querySelector('.ba-knob');
    let cut = 0.5;

    function setCut(x){
      cut = Math.max(0.05, Math.min(0.95, x));
      viewport.style.setProperty('--ba-cut', (cut*100)+'%');
    }
    setCut(0.5);

    function handlePointer(clientX){
      const rect = viewport.getBoundingClientRect();
      const rel = (clientX - rect.left) / rect.width;
      // Natural direction: moving right reveals AFTER (right) more
      setCut(rel);
    }

    function down(e){
      e.preventDefault();
      const move = (ev)=>handlePointer(ev.touches?ev.touches[0].clientX:ev.clientX);
      const up = ()=>{
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('touchmove', move);
        window.removeEventListener('touchend', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('touchmove', move, {passive:false});
      window.addEventListener('touchend', up);
    }
    [viewport, divider, knob].forEach(el=>{
      el.addEventListener('pointerdown', down);
      el.addEventListener('touchstart', down, {passive:false});
    });
  }

  slides.forEach(setupSlide);

  root.querySelector('.ba-arrow.left')?.addEventListener('click', ()=>show(idx-1));
  root.querySelector('.ba-arrow.right')?.addEventListener('click', ()=>show(idx+1));

  // dots
  root.querySelectorAll('.ba-dot').forEach((d,i)=>d.addEventListener('click', ()=>show(i)));

  show(0);
})();
