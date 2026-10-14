# Dryer Vent Services - Website Repository

## 🛠 Project Overview
This repository contains the source code for the official website of **Dryer Vent Services**, owned and operated by Chanoch Hasson. The business provides professional dryer vent cleaning, repair, and installation services across Staten Island, NY, and various regions in New Jersey.

The site is built as a high-performance static website hosted via GitHub Pages, with a focus on local SEO, rapid loading times, and a conversion-oriented user experience.

---

## 🤖 Instructions for AI Models
When assisting with this project (editing code, adding pages, or optimizing performance), you **must** adhere to the following architectural and design rules:

### 1. Path Management (Strict Rule)
* **Absolute Paths Only:** All internal links to CSS, JS, images, and the logo MUST begin with a forward slash (`/`).
    * **Correct:** `<link rel="stylesheet" href="/styles.css">`
    * **Incorrect:** `<link rel="stylesheet" href="../../styles.css">`
* This ensures that layout and assets remain intact regardless of folder depth (e.g., in articles or nested service areas).

### 2. Branding & Design Standards
* **Color Palette:**
    * **Brand Blue:** `#1B365D` (Used for headers, primary headings, and dark backgrounds).
    * **Brand Orange:** `#F47C20` (Used for CTA buttons, decorative accents, and icons).
* **Typography:** Uses the `Inter` font family via Google Fonts.
* **Consistency:** Every new page must include the identical `<header>` and `<footer>` sections found in the root `index.html`.

### 3. SEO & Metadata Requirements
* **Schema.org:**
    * Service pages must use the `Service` type.
    * Service Area pages must use the `LocalBusiness` type.
    * Contact/Booking pages must use `ContactPage` or `WebPage`.
* **Meta Tags:** Every page requires a unique `<title>` and a `<meta name="description">` (150-160 characters).
* **Canonical Tags:** Must point to the absolute URL of the page.
* **Social Preview:** Use the default Open Graph image: `/images/gallery/social-preview.jpg`.

---

## 📂 Repository Structure
* `/` (Root): Home page (`index.html`), configuration files (`sitemap.xml`, `robots.txt`, `404.html`), and core assets (`styles.css`, `script.js`).
* `/services/`: Main services landing page and sub-directories for specific services (`cleaning`, `repairs`, `installations`, `inspection`, `bird-nest`, `bird-guard`).
* `/areas/`: Service area index and local landing pages (Staten Island, Brooklyn, Monsey, etc.).
* `/articles/`: SEO content repository and blog posts.
* `/images/`: Site-wide images including gallery, logos, and graphics.
    * **Preference:** Use `.webp` format whenever possible to minimize load times.
* `/booking/` & `/contact/`: Direct conversion pages with Housecall Pro integrations.

---

## 🔌 External Integrations
* **Housecall Pro:**
    * Floating Chat Bubble (Footer).
    * Online Booking Modal (Triggered via `.hcp-button`).
    * Reviews Widget (Embedded in the Reviews page).
* **Google Tag Manager:** Enabled in the `<head>` (ID: `G-X77CVTW1CD`).

---

## 📈 Performance & Quality Checklist
1. **Image Optimization:** No single image should exceed 200KB. Use tools like TinyPNG or Squoosh before committing.
2. **Mobile First:** Ensure the `mobile-cta` bar at the bottom of the screen is never obscured by the Housecall Pro chat bubble (Z-index and padding adjustments).
3. **Lazy Loading:** Apply `loading="lazy"` to all images below the "fold" to improve initial PageSpeed scores.

---

## 🛠 Maintenance Workflow
When adding a new page to the site:
1. Append the new URL to `sitemap.xml` with appropriate priority.
2. Verify the navigation links in the header are consistent across the site.
3. Submit the new URL for manual indexing via Google Search Console.
