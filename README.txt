Drop-in patch for Contact page WITHOUT removing your site header/nav.

1) In your existing contact.html, inside <head> add:
   <link rel="stylesheet" href="assets/css/contact-fixes.css">
   <script defer src="assets/js/contact-fixes.js"></script>

2) Ensure your form action still points to FormSubmit. After submit, send users to /thank-you.html.
   Example: <input type="hidden" name="_next" value="https://www.dryer-ventservices.com/thank-you.html">

3) Upload thank-you.html to your site root.