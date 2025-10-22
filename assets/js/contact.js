
// v6.2.4 contact-page JS tweaks
(function () {
  // Defensive: hide any fixed-position WhatsApp ghost bubbles
  const suspects = Array.from(document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="whatsapp"]'));
  suspects.forEach(a => {
    const s = getComputedStyle(a);
    const p = a.parentElement ? getComputedStyle(a.parentElement) : null;
    if (s.position === 'fixed' || (p && p.position === 'fixed')) {
      // If it looks like a floating bubble, remove
      if ((parseInt(s.width)||0) <= 72 || (parseInt(s.height)||0) <= 72 || a.innerText.trim() === '') {
        (a.parentElement && a.parentElement.children.length === 1 ? a.parentElement : a).remove();
      }
    }
  });

  // Also hide any element with class names commonly used by float widgets
  const floatClasses = ['whatsapp-float', 'wa-float', 'float-chat', 'whatsapp-chat', 'whatsapp-widget'];
  floatClasses.forEach(cls => {
    document.querySelectorAll('.' + cls).forEach(el => el.remove());
  });
})();
