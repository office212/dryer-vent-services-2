PATCH v6.2.2 — Contact page fixes (drop-in, no design changes to the rest of the site)

FILES INCLUDED
- assets/css/contact-fixes.css
- assets/js/contact-fixes.js
- thank-you.html

HOW TO INSTALL (2 minutes)
1) Upload `assets/css/contact-fixes.css` and `assets/js/contact-fixes.js` to your site (keep same paths).
2) In `contact.html`:
   - Ensure `<body>` has class `contact-page` (add it if missing).
   - In the <head> add:
       <link rel="stylesheet" href="/assets/css/contact-fixes.css">
   - Just before </body> add:
       <script src="/assets/js/contact-fixes.js"></script>
3) Make sure `thank-you.html` is at the site root (same level as index.html).
4) FormSubmit: the JS adds a hidden `_next` field pointing to /thank-you.html if missing.
5) WhatsApp:
   - The ghost floating bubble is force-removed on Contact only.
   - The real WhatsApp button should live inside an element with id="other-ways" or class="other-ways".
   - If you want a different number, edit the wa.me link inside `assets/js/contact-fixes.js`.

WHAT THIS PATCH DOES
- Modernizes Contact inputs + makes the submit button big & orange.
- Removes WhatsApp ghost bubble on Contact (keeps your legit button in Other ways).
- Hides the sticky bottom bar **only on Contact** (it remains on all other pages).
- Restores Thank-You page with a 10s auto-redirect to the homepage.

If you’d like me to bundle these lines directly into your existing files and return a full-site ZIP,
just send me your current ZIP and I’ll merge them in-line.