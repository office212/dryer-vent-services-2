/* === DVS Before/After – JS מלא, חלק במובייל, בלי התנגשויות === */
(() => {
  const sliders = document.querySelectorAll('.dvs-ba');
  if (!sliders.length) return;

  sliders.forEach((el) => {
    const after  = el.querySelector('.dvs-after');
    const handle = el.querySelector('.dvs-handle');
    const knob   = el.querySelector('.dvs-knob');
    const prev   = el.querySelector('.dvs-prev');
    const next   = el.querySelector('.dvs-next');
    if (!after || !handle || !knob) return;

    let dragging = false;
    let rect = el.getBoundingClientRect();

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const setPos = (pct) => {
      const p = clamp(pct, 0, 100);
      after.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
      handle.style.left = `${p}%`;
      knob.style.left = `${p}%`;
      el.dataset.position = p.toFixed(1);
    };
    const fromEvent = (e) => {
      const x = (e.clientX ?? (e.touches && e.touches[0]?.clientX));
      return clamp(((x - rect.left) / rect.width) * 100, 0, 100);
    };

    const onDown = (e) => {
      rect = el.getBoundingClientRect();
      dragging = true;
      el.classList.add('is-dragging');
      // בזמן גרירה – לנטרל גלילת דף (רק באזור הסליידר)
      el.style.touchAction = 'none';
      if (e.target.setPointerCapture) { try { e.target.setPointerCapture(e.pointerId); } catch{} }
      setPos(fromEvent(e));
    };
    const onMove = (e) => {
      if (!dragging) return;
      setPos(fromEvent(e));
      if (e.pointerType === 'touch') e.preventDefault();
    };
    const onUp = () => {
      dragging = false;
      el.classList.remove('is-dragging');
      el.style.touchAction = 'pan-y'; // להחזיר גלילה
    };

    [el, knob, handle].forEach(n => n.addEventListener('pointerdown', onDown, { passive:true }));
    window.addEventListener('pointermove', onMove, { passive:false });
    window.addEventListener('pointerup', onUp, { passive:true });
    window.addEventListener('pointercancel', onUp, { passive:true });

    // חיצים – קפיצה 10%
    const nudge = d => setPos(parseFloat(el.dataset.position || '50') + d);
    if (prev) prev.addEventListener('click', () => nudge(-10), { passive:true });
    if (next) next.addEventListener('click', () => nudge( 10), { passive:true });

    setPos(50);
    new ResizeObserver(() => { rect = el.getBoundingClientRect(); }).observe(el);
  });
})();