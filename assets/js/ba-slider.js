/* Before/After slider – mobile-smooth, non-blocking scroll */
(() => {
  const comps = document.querySelectorAll('.ba-comparison');
  if (!comps.length) return;

  comps.forEach((root) => {
    const before = root.querySelector('.ba-before img, .ba-before');
    const after  = root.querySelector('.ba-after  img, .ba-after');
    const handle = root.querySelector('.ba-handle');     // הקו האנכי
    const knob   = root.querySelector('.ba-knob');       // העיגול במרכז

    if (!before || !after || !handle || !knob) return;

    let dragging = false;
    let rect = null;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const percentToLeft = (p) => `${p}%`;

    const setPos = (p) => {
      const pct = clamp(p, 0, 100);
      after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = percentToLeft(pct);
      knob.style.left   = percentToLeft(pct);
      root.dataset.position = pct.toFixed(1);
    };

    const posFromEvent = (e) => {
      const x = (e.clientX ?? (e.touches && e.touches[0]?.clientX));
      return clamp(((x - rect.left) / rect.width) * 100, 0, 100);
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      setPos(posFromEvent(e));
      // בזמן גרירה בטאץ' – מניעת גלילה אנכית
      if (e.pointerType === 'touch') e.preventDefault();
    };

    const onPointerDown = (e) => {
      rect = root.getBoundingClientRect();
      dragging = true;
      root.classList.add('is-dragging');
      // לאפשר לכידת מצביע כדי לשמור על גרירה רציפה
      if (e.target.setPointerCapture) {
        try { e.target.setPointerCapture(e.pointerId); } catch {}
      }
      setPos(posFromEvent(e));
    };

    const onPointerUp = () => {
      dragging = false;
      root.classList.remove('is-dragging');
    };

    // מאזינים
    [root, knob, handle].forEach(el => {
      el.addEventListener('pointerdown', onPointerDown, { passive: true });
    });
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup',   onPointerUp,   { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    // קליקים מהירים להזזה ב-10% בעזרת החיצים (אם קיימים)
    const prevBtn = root.querySelector('.ba-prev');
    const nextBtn = root.querySelector('.ba-next');
    const nudge = (delta) => {
      const cur = parseFloat(root.dataset.position || '50');
      setPos(cur + delta);
    };
    if (prevBtn) prevBtn.addEventListener('click', () => nudge(-10), { passive: true });
    if (nextBtn) nextBtn.addEventListener('click', () => nudge(+10), { passive: true });

    // התחלה באמצע
    setPos(50);

    // רסייז שומר פרופורציה
    const ro = new ResizeObserver(() => { rect = root.getBoundingClientRect(); });
    ro.observe(root);
  });
})();