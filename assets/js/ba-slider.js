/* DVS beta 1.9 — BA slider mobile scroll fix (focused patch)
   - Pointer Events for drag
   - Prevent page scroll ONLY while dragging
   - No visual changes (keeps existing CSS/HTML)
*/
(function(){
  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }

  // Accept both DOM shapes:
  // Shape A: figure.ba-compare > .ba-after-wrap > img.ba-after, plus .ba-handle, .ba-divider
  // Shape B: .ba-viewport with .after image and .ba-divider/.ba-knob (legacy)
  var roots = document.querySelectorAll('.ba-compare, [data-ba-root], .ba-viewport');
  if(!roots.length) return;

  roots.forEach(function(root){
    var isCompare = root.classList.contains('ba-compare') || root.matches('[data-ba-root]');
    var viewport  = isCompare ? root : root; // treat root as viewport
    var afterWrap = isCompare ? root.querySelector('.ba-after-wrap') : root.querySelector('.after-wrap, .after');
    var afterImg  = root.querySelector('.ba-after, .after img, .after');
    var handle    = root.querySelector('.ba-handle, .ba-knob') || root;
    var divider   = root.querySelector('.ba-divider') || root.querySelector('.divider');

    if(!(viewport && afterImg)) return;

    if(!afterWrap){
      afterWrap = document.createElement('div');
      afterWrap.className = 'ba-after-wrap';
      var parent = afterImg.parentNode;
      parent && parent.insertBefore(afterWrap, afterImg);
      afterWrap.appendChild(afterImg);
    }

    if(!handle || handle === root){
      handle = document.createElement('button');
      handle.className = 'ba-handle';
      handle.type = 'button';
      root.appendChild(handle);
    }
    if(!divider){
      divider = document.createElement('div');
      divider.className = 'ba-divider';
      root.appendChild(divider);
    }

    var cut = 0.5; // middle
    applyCut();

    var dragging = false;

    var optsActive = { passive: false };
    var optsPassive = { passive: true };

    try { handle.style.touchAction = 'none'; } catch(e){}

    function onStart(e){
      dragging = true;
      try { handle.setPointerCapture && handle.setPointerCapture(e.pointerId || 1); } catch(_){}
      onMove(e);
      e.preventDefault();
    }
    function onMove(e){
      if(!dragging) return;
      var rect = viewport.getBoundingClientRect();
      var x = (e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left));
      var pct = clamp((x - rect.left) / rect.width, 0.02, 0.98);
      cut = pct;
      applyCut();
      e.preventDefault(); // block page scroll while dragging
    }
    function onEnd(){
      dragging = false;
    }

    viewport.addEventListener('pointerdown', onStart, optsActive);
    viewport.addEventListener('pointermove', onMove,  optsActive);
    window.addEventListener('pointerup',     onEnd,   optsPassive);
    window.addEventListener('pointercancel', onEnd,   optsPassive);

    viewport.addEventListener('touchstart', onStart, optsActive);
    viewport.addEventListener('touchmove',  onMove,  optsActive);
    window.addEventListener('touchend',     onEnd,   optsPassive);
    window.addEventListener('touchcancel',  onEnd,   optsPassive);

    function applyCut(){
      var left = (cut*100).toFixed(3) + '%';
      if(afterWrap && afterWrap.style) afterWrap.style.clipPath = 'inset(0 0 0 '+left+')';
      if(handle && handle.style) handle.style.left = left;
      if(divider && divider.style) divider.style.left = left;
    }
  });
})();