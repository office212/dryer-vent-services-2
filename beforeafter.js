
/* v6.0 Before/After slider */
(function(){
  function initSlider(root){
    const before = root.querySelector('.ba-before img');
    const after = root.querySelector('.ba-after img');
    const handle = root.querySelector('.ba-handle');
    const divider = root.querySelector('.ba-divider');
    const input = root.querySelector('.ba-range');

    function setPos(p){
      p = Math.max(0, Math.min(100, p));
      divider.style.left = p + '%';
      handle.style.left = p + '%';
      after.style.clipPath = 'inset(0 0 0 ' + p + '%)';
      input.value = p;
    }

    let dragging = false;
    function pointerToPercent(clientX){
      const rect = root.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    handle.addEventListener('pointerdown', (e)=>{ dragging=true; handle.setPointerCapture(e.pointerId); });
    window.addEventListener('pointerup', ()=> dragging=false);
    window.addEventListener('pointermove', (e)=>{ if(dragging){ setPos(pointerToPercent(e.clientX)); }});
    root.addEventListener('click', (e)=>{
      if(e.target === input) return;
      setPos(pointerToPercent(e.clientX));
    });

    // Keyboard support
    input.addEventListener('input', ()=> setPos(parseFloat(input.value)));
    
    // create nav arrows
    const prevBtn = document.createElement('button');
    prevBtn.className = 'ba-nav ba-prev';
    prevBtn.setAttribute('aria-label','Previous photo');
    prevBtn.innerHTML = '&#10094;';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'ba-nav ba-next';
    nextBtn.setAttribute('aria-label','Next photo');
    nextBtn.innerHTML = '&#10095;';
    root.appendChild(prevBtn);
    root.appendChild(nextBtn);
    // position default
    prevBtn.addEventListener('click', ()=> setPos(parseFloat(input.value) - 15));
    nextBtn.addEventListener('click', ()=> setPos(parseFloat(input.value) + 15));

    input.addEventListener('keydown', (e)=>{
      const step = (e.shiftKey? 10 : 2);
      if(e.key === 'ArrowLeft') setPos(parseFloat(input.value) - step);
      if(e.key === 'ArrowRight') setPos(parseFloat(input.value) + step);
    });

    setPos(50);
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.before-after').forEach(initSlider);
  });
})();
