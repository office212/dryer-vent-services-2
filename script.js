
// Mobile nav toggle and active link highlight
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('site-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  const page = document.body.getAttribute('data-page');
  if (page) {
    document.querySelectorAll('[data-nav]').forEach(a => {
      if (a.getAttribute('data-nav') === page) a.classList.add('active');
    });
  }
});


/**
 * Optional Google Sheets capture:
 * 1) Create a Google Apps Script (New project) with a Web App that accepts POST.
 * 2) Deploy and copy the Web App URL.
 * 3) Put that URL into contact.html on the form element as data-webhook="YOUR_URL".
 * This script will POST JSON to that URL before submitting to email service.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form.lead-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    try {
      const webhook = form.getAttribute('data-webhook');
      if (!webhook || webhook.includes('PUT_YOUR_APPS_SCRIPT_URL_HERE')) return; // no webhook configured
      const formData = new FormData(form);
      const obj = {};
      formData.forEach((v, k) => obj[k] = v);
      // Fire-and-forget fetch; do not block real submit
      fetch(webhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      });
    } catch (err) {
      console.warn('Webhook send failed (non-blocking):', err);
    }
  }, { capture: true });
});

document.addEventListener('DOMContentLoaded', () => {
  const t = document.getElementById('submittedAt');
  if (t) t.value = new Date().toISOString();
});
