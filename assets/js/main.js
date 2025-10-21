
// Phone confirm + service validation
document.addEventListener('DOMContentLoaded', function(){
  const form = document.querySelector('#contact-form');
  if(!form) return;
  const phone = document.querySelector('#phone');
  const phone2 = document.querySelector('#confirm-phone');
  const checks = document.querySelectorAll('input[name="service[]"]');
  function validatePhones(){
    if (phone.value.trim() !== phone2.value.trim()){
      phone2.setCustomValidity("Phone numbers must match.");
    } else {
      phone2.setCustomValidity("");
    }
  }
  phone.addEventListener('input', validatePhones);
  phone2.addEventListener('input', validatePhones);
  form.addEventListener('submit', function(e){
    const anyChecked = Array.from(checks).some(c=>c.checked);
    if(!anyChecked){ alert("Please select at least one service."); e.preventDefault(); }
  });
});
