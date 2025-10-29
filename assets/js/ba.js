
(function(){
  const gallery = document.querySelector('.ba-gallery');
  if(!gallery) return;

  // Discover pairs in assets/img/before-after: *-before.* and *-after.*
  // Pairs list will be injected server-side if available; fallback to DOM data-attrs
  let pairs = window.__BA_PAIRS__ || [];

  function buildFrame(pair){
    const frame = document.createElement('div');
    frame.className = 'ba-frame';
    frame.innerHTML = `
      <div class="ba-inner">
        <div class="ba-img ba-before"><img src="${pair.before}" alt="Before"></div>
        <div class="ba-img ba-after"><img src="${pair.after}" alt="After"></div>
        <div class="ba-divider"></div>
        <div class="ba-handle" role="slider" aria-label="Compare"></div>
      </div>
      <div class="ba-nav">
        <button class="ba-btn ba-btn-left" aria-label="Previous">
          <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>
        </button>
        <button class="ba-btn ba-btn-right" aria-label="Next">
          <svg viewBox="0 0 24 24"><path d="M9 19l7-7-7-7"/></svg>
        </button>
      </div>
      <div class="ba-labels"><span>Before</span><span>After</span></div>
    `;
    gallery.appendChild(frame);

    let cut = 0.5;
    const inner = frame.querySelector('.ba-inner');
    const divider = frame.querySelector('.ba-divider');
    const handle = frame.querySelector('.ba-handle');

    function applyCut(x){
      cut = Math.min(0.98, Math.max(0.02, x));
      inner.style.setProperty('--cut', (cut*100)+'%');
    }
    applyCut(0.5);

    let dragging = false;
    function start(e){ dragging = true; e.preventDefault(); }
    function move(e){
      if(!dragging) return;
      const rect = inner.getBoundingClientRect();
      const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
      const x = (clientX - rect.left)/rect.width;
      applyCut(x);
    }
    function end(){ dragging = false; }

    handle.addEventListener('mousedown', start);
    handle.addEventListener('touchstart', start, {passive:false});
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, {passive:false});
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);

    return frame;
  }

  // Simple carousel for multiple frames
  const list = document.createElement('div');
  list.style.display = 'contents';
  gallery.appendChild(list);

  let index = 0;
  const frames = pairs.map(buildFrame);
  if(frames.length === 0){
    // If no pairs detected, do nothing (keeps page intact, but no placeholders)
    return;
  }
  frames.forEach((f,i)=>{ if(i!==0) f.style.display='none'; });

  function show(i){
    frames[index].style.display='none';
    index = (i + frames.length) % frames.length;
    frames[index].style.display='';
  }

  frames.forEach((frame)=>{
    frame.querySelector('.ba-btn-left').addEventListener('click', ()=> show(index-1));
    frame.querySelector('.ba-btn-right').addEventListener('click', ()=> show(index+1));
  });

})();
