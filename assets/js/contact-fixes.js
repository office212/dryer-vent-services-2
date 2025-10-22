/* v6.1.9 - Contact page fixes (non-destructive) */
(function(){
  document.documentElement.classList.add('js');

  // Mark body for scoped CSS without touching site-wide header/nav
  document.body.classList.add('contact-page');

  // Remove floating WhatsApp bubble injected by third parties
  var bubbleSelectors = [
    '.whatsapp-float', '.wa-chat-widget', '.floating-whatsapp', '.whatsapp-button',
    '[data-whatsapp-float]', '.callbell-widget', '.joinchat__button', '.getbutton-widget'
  ];
  setTimeout(function(){
    bubbleSelectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){ el.remove(); });
    });
  }, 250);

  // Simple validations
  function val(q){ return document.querySelector(q); }
  var phone = val('input[name="phone"], input[type="tel"][name="Phone"], input[type="tel"]:not([name="Confirm"])');
  var confirmPhone = val('input[name="confirm_phone"], input[name="Confirm Phone"], input[placeholder*="Re-enter"]');
  var services = Array.from(document.querySelectorAll('input[type="checkbox"][name="service[]"], .options input[type="checkbox"], input[type="checkbox"][value*="Cleaning"], input[type="checkbox"][value*="Repair"], input[type="checkbox"][value*="Installation"]'));
  var form = document.querySelector('form');

  if(form){
    form.addEventListener('submit', function(e){
      var okService = services.some(cb => cb.checked);
      if(!okService){
        e.preventDefault();
        alert('Please select at least one service.');
        return false;
      }
      if(phone && confirmPhone){
        var p1 = phone.value.replace(/\D/g,'');
        var p2 = confirmPhone.value.replace(/\D/g,'');
        if(p1 !== p2){
          e.preventDefault();
          alert('Phone numbers do not match.');
          confirmPhone.focus();
          return false;
        }
      }
    });
  }
})();