
// v6.1.5-fixed — confirm phone + at least one service selected
document.addEventListener('DOMContentLoaded', function(){
  const form = document.querySelector('#contact-form');
  if(!form) return;
  const p1 = form.querySelector('#phone');
  const p2 = form.querySelector('#phone2');
  function digits(s){ return (s||'').replace(/\D+/g,''); }
  form.addEventListener('submit', function(e){
    const d1 = digits(p1.value), d2 = digits(p2.value);
    if(d1 !== d2){ alert('Phone numbers must match.'); e.preventDefault(); return; }
    const any = ['service_cleaning','service_repair','service_install'].some(n => form.querySelector('[name='+n+']')?.checked);
    if(!any){ alert('Please select at least one service.'); e.preventDefault(); }
  });
});
