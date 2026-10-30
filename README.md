# Dryer Vent Services — Website Repository

This repository contains the source code for the official business website of **Dryer Vent Services**, a dryer vent cleaning, repair, and installation business based in Staten Island, New York.

- **Live website:** https://www.dryer-ventservices.com
- **Phone:** 347-244-9382
- **Email:** office@dryer-ventservices.com
- **Service model:** a service-area business. Customers are served at their homes or properties; there is no public street address and no walk-in storefront.
- **Hosting:** GitHub Pages. The site is a static website built with HTML, CSS, and JavaScript. There is no build step, no framework, and no server-side code in this repository. Pushing a change to `main` publishes it to the live site.

## What the business does

Dryer Vent Services helps homes and properties stay safer and run more efficiently by keeping dryer vents clear, connected, and working properly. A blocked or damaged dryer vent can make drying slower, raise energy use, leave clothes damp, and increase the risk of overheating and fire. The work on this site is therefore presented first as a safety and performance service, and second as a practical home service: clear the vent, check the full run, fix what is broken, and protect the vent opening.

The business serves Staten Island, NY, as its home base, together with nearby areas in New York and New Jersey. See [Service areas](#service-areas) below.

## Business facts

| Item | Detail |
| --- | --- |
| Business | Dryer Vent Services |
| Based in | Staten Island, NY |
| Services | Dryer vent cleaning, repairs, installations, inspections, bird nest removal, and bird guard installation |
| Phone | 347-244-9382 |
| Email | office@dryer-ventservices.com |
| Website | https://www.dryer-ventservices.com |
| Public street address | None — service-area business |

### Opening hours

| Day | Hours |
| --- | --- |
| Sunday–Thursday | 24 hours |
| Friday | 12:00 AM–3:00 PM |
| Saturday | 9:30 PM–12:00 AM |

Customers can also use the booking and contact pages at any time; a booking request does not itself choose an appointment time (see [Booking flow](#booking-flow)).

## Services and prices

### Dryer vent cleaning

Cleaning is the core service. Lint and debris are removed from the full vent run, from the dryer connection to the outside vent, so air can move freely again.

| Cleaning price | Amount |
| --- | --- |
| Basement or 1st floor | $175 |
| 2nd floor | $225 |

The higher price for a 2nd-floor dryer reflects the longer, harder-to-reach vent run that this work usually involves.

### Repairs

Dryer vent repairs cover damaged, disconnected, crushed, or poorly routed venting. The goal is a secure, correctly connected vent that exhausts safely outside, with no leaks into walls, attics, or living spaces.

### Installations

Dryer vent installations cover new vent runs and replacement venting, including the exterior vent termination. Installation work is presented alongside cleaning and repairs because many customers need a vent corrected or replaced after it is found to be unsafe or ineffective during a cleaning or inspection.

### Inspections

Inspections check the condition and airflow of an existing dryer vent system. An inspection can identify blockages, damage, disconnections, bird nesting, and routing problems, and it helps a customer decide whether cleaning, repair, or installation is the right next step.

### Bird nest removal

Birds can nest inside an open dryer vent, blocking airflow almost completely. Bird nest removal clears the nesting material from the vent so the dryer can exhaust safely again.

### Bird guard installation

A bird guard is fitted over the exterior vent opening after the vent is clear. It helps keep birds and nesting material out of the vent while still allowing dryer air to exhaust, reducing the chance that the same blockage returns.

## Site structure

The site has about 58 pages in total. The counts below were checked against the repository file tree.

### Main pages

- **Homepage** — `/` (`index.html`): an introduction to the business, its services, service areas, reviews, and booking options.
- **Services index** — `/services/` (`services.html`): an overview of all services.
- **Gallery** — `/gallery.html`: photos of completed work.
- **Reviews** — `/reviews.html`: customer reviews, including the Housecall Pro reviews widget.
- **FAQ** — `/faq.html`: answers to common questions about dryer vents.
- **About** — `/about.html`: information about the business.
- **Booking** — `/booking.html`: the Housecall Pro booking page.
- **Contact** — `/contact.html`: the contact form.
- **Thanks page** — `/thanks/`: shown after a completed booking.
- **Custom 404 page** — `404.html`: shown when a visitor reaches a page that does not exist.

### Service pages (6)

The services index links to six dedicated service pages:

1. Cleaning — `/services/cleaning/`
2. Repairs — `/services/repairs/`
3. Installations — `/services/installations/`
4. Inspection — `/services/inspection/`
5. Bird nest removal — `/services/bird-nest/`
6. Bird guard installation — `/services/bird-guard/`

### Service areas

The service areas index (`/areas/`, `areas.html`) links to 12 area pages:

1. Staten Island — `/areas/staten-island/`
2. Brooklyn — `/areas/brooklyn/`
3. Queens — `/areas/queens/`
4. Clifton — `/areas/clifton/`
5. Edison — `/areas/edison/`
6. Fair Lawn — `/areas/fair-lawn/`
7. Five Towns — `/areas/five-towns/`
8. Lakewood — `/areas/lakewood/`
9. Linden — `/areas/linden/`
10. Monsey — `/areas/monsey/`
11. Teaneck — `/areas/teaneck/`
12. Upstate NY — `/areas/upstate-ny/`

Each area page describes dryer vent services for that area, so visitors can confirm that the business serves their location.

### Articles (28)

The articles index (`/articles/`, `articles.html`) links to 28 articles. The articles explain dryer vent safety, warning signs, maintenance, and common problems in plain language — for example, how often a vent should be cleaned, what a burning smell can mean, why a room feels hot, how lint traps and vent covers work, and what to watch for in older homes, stacked dryers, large families, and homes with pets.

### Page count, at a glance

1 homepage + 1 services index + 6 service pages + gallery + reviews + FAQ + about + booking + contact (14 pages in total) + 1 service areas index + 12 area pages (27 pages in total) + 1 articles index + 28 articles (56 pages in total) + thanks page + custom 404 page = about 58 pages.

## Design system

The site uses a warm, light, editorial look: ivory and paper backgrounds, deep navy headings, and a single strong orange for calls to action.

### Colors

| Name | Hex | Use |
| --- | --- | --- |
| Ivory | `#faf7f1` | Main background |
| Paper | `#fffdf8` | Cards and light panels |
| Navy | `#1b365d` | Headings, brand text, and dark sections |
| Navy deep | `#0c1a2e` | Darkest backgrounds and footer tones |
| Orange | `#f47c20` | Calls to action, accents, and the first line of the header tagline |
| Cream | `#fdf8f0` | Soft section backgrounds |
| Hairlines | `#e5dcc9` | Borders and dividers |

### Fonts

- **Titles:** Playfair Display — used for headings and the brand name, giving the site a classic, trustworthy feel.
- **Body text:** Manrope and Inter — used for paragraphs, navigation, buttons, and forms, keeping the site easy to read on phones and desktops.

### Shared components

The same components appear across the site, so every page feels like part of one website:

- **Header** — brand, tagline, and navigation (see below).
- **Heroes** — the large opening section at the top of each page, with a headline and a call to action.
- **Booking-style closing strips** — a closing section at the end of pages that invites the visitor to book or call, in the same style as the booking page.
- **Site footer** — contact details, hours, service links, and area links.
- **Floating capsule sticky bar (mobile only)** — a compact call-and-book bar that stays visible on small screens so visitors can act without scrolling back to the top.
- **Back-to-top control** — returns the visitor to the top of a long page.
- **Progress bar** — shows reading progress as the visitor scrolls down a page.

## Header treatment

The header is the same on every page, with one brand block and a two-line navigation button style.

- **Brand:** “Dryer Vent Services” appears on one line.
- **Tagline, on desktop:** the tagline is shown in two lines, centered under the brand name. The top line is “Cleaning”, in orange (`#f47c20`). The line below is “Repairs - Installations”, in navy (`#1b365d`).
- **Tagline, on mobile:** the tagline stays on one line, with the same word colors — “Cleaning” in orange and “Repairs - Installations” in navy.
- **Navigation:** the header navigation uses two-line buttons, so each link can carry a short label and a supporting line.

The tagline styling lives in the shared stylesheet, `styles.css`, so a change there updates the header on all pages at once.

## Booking flow

Booking is provided through Housecall Pro.

1. The visitor opens the booking page or a booking button anywhere on the site.
2. Housecall Pro captures the customer's information.
3. Customers do **not** pick a date or time in the booking flow. There is no calendar or time-slot choice.
4. The business contacts the customer afterwards to schedule the visit.
5. A completed booking redirects to the thanks page at `/thanks/`, with `utm_source=housecallpro` in the URL, so the booking source can be recognised.

The booking page, the floating capsule sticky bar on mobile, and the closing strips all lead into this same flow.

## Contact form

The contact page (`/contact.html`) offers an alternative to booking for questions, quotes, and messages that do not need an immediate visit. The form asks for:

- Full Name
- Email
- Phone
- Confirm Phone
- ZIP
- Service selection (which service the visitor needs)
- Message
- reCAPTCHA verification, to reduce spam submissions

Asking for the phone number twice helps catch typing errors before the business tries to call the customer back.

## Analytics, structured data, and search

### Analytics

The site uses **Google Analytics 4 (GA4)** — not Google Tag Manager — with:

- **Property:** p509604839
- **Measurement ID:** `G-X77CVTW1CD`

The measurement ID appears in the site's public code, so it is safe to record here. No other analytics or tracking account identifiers are listed in this README.

### Structured data

Every page carries one unified `HomeAndConstructionBusiness` schema entity, so search engines see a single, consistent business identity across the whole site rather than a different business description on each page.

The schema includes a Google-only `AggregateRating` of 5.0. That rating is provided for Google's use; it is not presented as a separate on-page rating system.

### Search and site files

- `sitemap.xml` lists the site's pages for search engines.
- `robots.txt` gives crawling guidance for search engines.
- `CNAME` sets the custom domain for GitHub Pages: `www.dryer-ventservices.com`.
- Each page has its own title and description, and internal links use absolute paths starting with `/`, so links, styles, scripts, and images keep working no matter how deep a page sits in the folder tree.

## How to update the site

There is no build command, no package installation, and no deployment script to run.

1. **Edit the HTML files directly.** Each page is a plain `.html` file. The homepage is `index.html` in the repository root; service pages live under `services/`, area pages under `areas/`, and articles under `articles/`.
2. **Use the shared stylesheet for design changes.** Shared styles live in `styles.css` in the repository root. Changing a shared rule there — for example, a header, button, or color rule — updates every page that uses it. Page-specific styling, where it exists, should not be used to override shared header or footer rules.
3. **Put images under `images/`.** Gallery images live under `images/gallery/`; other site images live under `images/` or the relevant section folder. Prefer `.webp` images where possible to keep pages fast.
4. **Keep the shared header and footer consistent.** Every page should carry the same header and footer as the homepage, so navigation, contact details, and booking options never differ from page to page.
5. **Keep the sitemap in step.** When a page is added or removed, update `sitemap.xml` to match.
6. **Publish by pushing to `main`.** GitHub Pages serves the site from `main`, so a change pushed to `main` is what visitors see at https://www.dryer-ventservices.com. Changes should therefore be reviewed on a separate branch and merged through a pull request before they reach `main`.

### Repository layout

```
.
├── index.html            # Homepage
├── about.html             # About page
├── areas.html             # Service areas index
├── articles.html          # Articles index
├── booking.html           # Booking page
├── contact.html           # Contact page
├── faq.html               # FAQ page
├── gallery.html           # Gallery page
├── reviews.html           # Reviews page
├── services.html          # Services index
├── 404.html               # Custom 404 page
├── styles.css             # Shared stylesheet (design system, header, components)
├── script.js              # Shared JavaScript (sticky bar, back-to-top, progress bar)
├── sitemap.xml            # Search-engine sitemap
├── robots.txt             # Search-engine crawling guidance
├── CNAME                  # Custom domain for GitHub Pages
├── about/                 # About section files
├── areas/                 # 12 service area pages + index
├── articles/              # 28 articles + index
├── assets/                # Site assets
├── booking/               # Booking section files
├── contact/               # Contact section files
├── faq/                   # FAQ section files
├── gallery/               # Gallery section files
├── images/                # Site images, including images/gallery/
├── reviews/               # Reviews section files
├── services/              # 6 service pages + index
└── thanks/                # Thanks page shown after booking
```

## Keeping this README accurate

This README describes the site as it currently stands. If a price, phone number, email address, opening hour, service, area, page count, color, or tracking identifier changes on the live site, update the matching section of this README in the same change, so the repository description and the published website never drift apart.
