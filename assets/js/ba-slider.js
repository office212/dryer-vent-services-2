
// Build slides from filenames.json then attach slider behavior
(async function(){
  try{
    const resp = await fetch('assets/img/before-after/filenames.json');
    const data = await resp.json();
    const slides = (data && data.slides) || [];
    const root = document.getElementById('ba-carousel');
    if(!root || !slides.length) return;

    let index = 0;
    const wrap = document.createElement('div');
    wrap.className = 'ba-wrap';
    root.prepend(wrap);

    function applyEXIF(img){
      // Render respecting EXIF orientation by drawing to canvas and replacing src (mobile-friendly)
      return new Promise(resolve=>{
        const _img = new Image();
        _img.onload = ()=>{
          // draw to canvas same size so orientation respected in tag
          const canvas = document.createElement('canvas');
          canvas.width = _img.naturalWidth;
          canvas.height = _img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(_img,0,0);
          img.src = canvas.toDataURL('image/jpeg', 0.92);
          resolve();
        };
        _img.src = img.src;
      });
    }

    const imgBefore = document.createElement('img');
    const imgAfter  = document.createElement('img');
    imgBefore.className = 'ba-img ba-before';
    imgAfter.className  = 'ba-img ba-after';

    const handle = document.createElement('div');
    handle.className = 'ba-handle';
    const thumb = document.createElement('button');
    thumb.className = 'ba-thumb';
    thumb.setAttribute('aria-label','Drag to compare');
    thumb.type = 'button';

    wrap.append(imgBefore, imgAfter, handle, thumb);

    function setSlide(i){
      index = (i+slides.length)%slides.length;
      const s = slides[index];
      imgBefore.src = 'assets/img/before-after/' + s.before;
      imgAfter.src  = 'assets/img/before-after/' + s.after;
      // force portrait containment
      imgBefore.style.objectFit = 'contain';
      imgAfter.style.objectFit  = 'contain';
      // kick EXIF normalization (non-blocking)
      applyEXIF(imgBefore); applyEXIF(imgAfter);
      setSplit(50);
    }

    function setSplit(pct){
      pct = Math.max(0, Math.min(100, pct));
      wrap.style.setProperty('--split', pct + '%');
    }

    let dragging = false;
    function posToPct(clientX){
      const rect = wrap.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }
    thumb.addEventListener('pointerdown', e=>{ dragging=true; thumb.setPointerCapture(e.pointerId); e.preventDefault(); });
    window.addEventListener('pointermove', e=>{ if(dragging) setSplit(posToPct(e.clientX)); });
    window.addEventListener('pointerup',   e=>{ dragging=false; });

    // Arrows
    const prev = root.querySelector('.ba-arrow.prev');
    const next = root.querySelector('.ba-arrow.next');
    prev.addEventListener('click', ()=>setSlide(index-1));
    next.addEventListener('click', ()=>setSlide(index+1));

    setSlide(0);
  }catch(e){ console.error(e); }
})();
