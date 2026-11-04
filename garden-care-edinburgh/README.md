# Garden Care Edinburgh: website

A 5-page website for **Garden Care**, an Edinburgh gardening business. It's built from the details on its Yell listing: https://www.yell.com/biz/garden-care-edinburgh-901563828/

| Detail (from Yell) | Value |
|---|---|
| Business | Garden Care, Edinburgh |
| Address | 17/1 Polwarth Gardens, Edinburgh EH11 1JT |
| Phone | 07414 080999 |
| Hours | 8am – 8pm, 7 days a week |
| Services | Grass cutting, hedge trimming, full garden clearance |

**Pages:** Home `/`, About `/about/`, Services `/services/`, Our Work `/portfolio/`, Contact `/contact/`, plus a custom 404 page, `sitemap.xml`, `robots.txt`, Open Graph/Twitter tags and LocalBusiness structured data (address and opening hours).

## Run it

```bash
npm run build      # generates the pages from src/ (no dependencies needed)
npm start          # http://localhost:3000, chatbot in demo mode
```

```bash
ANTHROPIC_API_KEY=sk-ant-... npm start   # chatbot in live AI mode
```

You need Node 18 or newer.

## How things work

* **Business details** are all in `src/site.config.js`. Service content is in `src/services-data.js`, and page content is in `src/pages/*.html`. Run `npm run build` after editing.
* **Quote form and chatbot enquiries**
  * Yell lists **no email address**, so the form currently sends enquiries by **WhatsApp**. The visitor's request is pre-filled in a WhatsApp message to 07414 080999 and they tap Send. A text-message fallback link is also shown.
  * **To receive enquiries by email instead:** set `email: 'you@example.com'` in `src/site.config.js` and run `npm run build`. The form and chatbot then send through FormSubmit (formsubmit.co), and the email address appears on the site. The first submission sends a one-time **activation email** to that inbox; click its link once.
* **Chat assistant**
  * *Demo mode* (default): scripted answers about services, hours, address and contact details, plus quote capture. It is clearly labelled **"Demo assistant"** and is not connected to an AI service.
  * *Live AI mode*: run `server.js` with `ANTHROPIC_API_KEY` set. The key stays on the server, and the widget label changes to "AI assistant". The model can be set with `ANTHROPIC_MODEL` (default `claude-haiku-5-5`).
* **Map:** the contact page embeds a Google Map for 17/1 Polwarth Gardens, EH11 1JT.

## Deploying

* **With live AI chat:** deploy the whole folder to a Node host (Render, Railway, Fly.io or a VPS) using `npm start`, and set `ANTHROPIC_API_KEY`.
* **Static only:** upload `public/` to Netlify, Vercel, Cloudflare Pages or GitHub Pages.

Set the real domain (`url` in `site.config.js`) and rebuild before launch.

## ⚠️ Check these before launch

1. **Email address.** None is listed on Yell; add one to enable email delivery (see above).
2. **WhatsApp.** Confirm 07414 080999 is on WhatsApp. If it isn't, the form can fall back to SMS; ask the developer to switch it.
3. **Extra services.** Regular Maintenance, Weeding & Border Care and Seasonal Tidy-Ups were added alongside the three Yell services. Remove any the business doesn't offer (in `site.config.js` and `services-data.js`).
4. **Reviews.** The Yell listing has no reviews, so the reviews section invites customers to leave one on Yell. Add genuine reviews when you have them; a markup template is in `src/pages/portfolio.html`.
5. **Photos** are royalty-free Unsplash stock images, labelled on the site as illustrative. Replace them with photos of real jobs. The before/after slider is also an illustration.
6. **Social media.** None were provided. Add Facebook or Instagram links to `socials` in `site.config.js`.
7. **Domain** (`url` in `site.config.js`).
