/* assets/js/ba-slider.js — drop-in fix for v1.8
   - Smooth mobile drag (pointer events + prevent-scroll)
   - Transparent side arrows, centered round handle
   - No extra “middle bar”; the handle itself is the divider
   - CSS is injected here so you don't have to edit stylesheets
*/
(function () {
  // ---------- Inject minimal, scoped CSS ----------
  const css = `
  :root { --ba-accent: rgba(15,35,64,.85); --ba-shadow: 0 6px 18px rgba(0,0,0,.18); }
  .ba-slider{position:relative;width:100%;max-width:780px;margin-inline:auto;border-radius:22px;overflow:hidden;touch-action:none;isolation:isolate; background:#f6f8fb;}
  .ba-track{position:relative;width:100%;height:100%;aspect-ratio:2/3;}
  .ba-track img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;}
  .ba-before{z-index:1;}
  .ba-after{z-index:2;clip-path:inset(0 0 0 50%);} /* start at center */
  .ba-handle{position:absolute;inset:0;pointer-events:none}
  .ba-divider{position:absolute;top:0;bottom:0;left:50%;width:2px;background:#fff;box-shadow:var(--ba-shadow);border-radius:2px;transform:translateX(-1px);}
  .ba-knob{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:56px;height:56px;border-radius:999px;background:rgba(255,255,255,.22);backdrop-filter:saturate(150%) blur(4px);border:2px solid rgba(255,255,255,.9);box-shadow:var(--ba-shadow);}
  .ba-arrow{position:absolute;top:50%;transform:translateY(-50%);width:56px;height:56px;border-radius:999px;
    background:rgba(255,255,255,.18);backdrop-filter:saturate(150%) blur(4px);border:2px solid rgba(255,255,255,.9);
    box-shadow:var(--ba-shadow);display:grid;place-items:center;cursor:pointer}
  .ba-arrow svg{width:22px;height:22px;fill:none;stroke:#0f2340;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;opacity:.9}
  .ba-prev{left:14px} .ba-next{right:14px}
  .ba-labels{position:absolute;inset:auto 0 12px 0;display:flex;justify-content:space-between;padding:0 14px;z-index:5;pointer-events:none}
  .ba-labels span{font-weight:800;font-size:18px;color:#0f2340;text-shadow:0 2px 8px rgba(255,255,255,.65)}
  @media (min-width:768px){ .ba-track{aspect-ratio:5/8} .ba-labels span{font-size:20px}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- Utils ----------
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // Arrow icon
  const icon = (dir) => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox','0 0 24 24');
    const p = document.createElementNS(svgNS, 'path');
    p.setAttribute('d', dir === 'left' ? 'M15 6 L9 12 L15 18' : 'M9 6 L15 12 L9 18');
    svg.appendChild(p);
    return svg;
  };

  // ---------- Init all sliders ----------
  function initSlider(root) {
    // Build structure if needed
    let track = root.querySelector('.ba-track');
    if (!track) {
      const before = root.querySelector('img.ba-before');
      const after  = root.querySelector('img.ba-after');
      track = document.createElement('div'); track.className = 'ba-track';
      root.appendChild(track);
      if (before) track.appendChild(before);
      if (after)  track.appendChild(after);
    }

    // Handle layer
    const handle = document.createElement('div'); handle.className = 'ba-handle';
    const divider = document.createElement('div'); divider.className = 'ba-divider';
    const knob    = document.createElement('div'); knob.className = 'ba-knob';
    handle.appendChild(divider); handle.appendChild(knob); root.appendChild(handle);

    // Arrows
    const prev = document.createElement('button'); prev.type='button'; prev.className='ba-arrow ba-prev'; prev.appendChild(icon('left'));
    const next = document.createElement('button'); next.type='button'; next.className='ba-arrow ba-next'; next.appendChild(icon('right'));
    root.appendChild(prev); root.appendChild(next);

    // Labels
    const labels = document.createElement('div'); labels.className='ba-labels';
    const l = document.createElement('span'); l.textContent='Before';
    const r = document.createElement('span'); r.textContent='After';
    labels.appendChild(l); labels.appendChild(r); root.appendChild(labels);

    // Position state (0..1)
    let pos = 0.5;
    const afterImg = root.querySelector('img.ba-after');

    function apply() {
      const pct = (pos * 100).toFixed(3) + '%';
      divider.style.left = pct;
      knob.style.left    = pct;
      afterImg.style.clipPath = `inset(0 0 0 ${pct})`;
    }
    apply();

    // Pointer interactions
    let dragging = false;
    function clientX(ev){ return ev.clientX ?? (ev.touches && ev.touches[0].clientX) ?? 0; }

    function start(ev){
      dragging = true;
      root.setPointerCapture?.(ev.pointerId ?? 1);
      document.body.style.touchAction = 'none';
      move(ev);
    }
    function move(ev){
      if(!dragging) return;
      const rect = track.getBoundingClientRect();
      const x = clamp(clientX(ev) - rect.left, 0, rect.width);
      pos = x / rect.width;
      apply();
      ev.preventDefault();
    }
    function end(){
      dragging = false;
      document.body.style.touchAction = '';
    }

    // Attach events
    track.addEventListener('pointerdown', start, {passive:false});
    track.addEventListener('pointermove',  move,  {passive:false});
    window.addEventListener('pointerup',   end,   {passive:true});
    knob.addEventListener('pointerdown',   start, {passive:false});
    knob.addEventListener('pointermove',   move,  {passive:false});

    // Arrows nudge 18%
    const nudge = 0.18;
    prev.addEventListener('click', () => { pos = clamp(pos - nudge, 0, 1); apply(); });
    next.addEventListener('click', () => { pos = clamp(pos + nudge, 0, 1); apply(); });

    // Resize safety
    window.addEventListener('resize', apply);
  }

  // Auto-init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ba-slider').forEach(initSlider);
  });
})();