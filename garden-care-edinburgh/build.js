#!/usr/bin/env node
/**
 * Tiny static-site builder.
 * Each file in src/pages/*.html starts with a JSON block inside <!--meta ... -->
 * and is wrapped with the shared layout (head, header, footer, chatbot) below.
 * Output goes to public/<slug>/index.html so URLs are clean: /about/, /services/ …
 *
 *   node build.js
 */
const fs = require('fs');
const path = require('path');
const site = require('./src/site.config.js');

const SRC = path.join(__dirname, 'src', 'pages');
const OUT = path.join(__dirname, 'public');

const nav = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/about/', label: 'About', key: 'about' },
  { href: '/services/', label: 'Services', key: 'services' },
  { href: '/portfolio/', label: 'Our Work', key: 'portfolio' },
  { href: '/contact/', label: 'Contact', key: 'contact' },
];

const icon = (name) => `<svg class="i" aria-hidden="true"><use href="/assets/img/icons.svg#${name}"/></svg>`;

function header(active) {
  const links = nav
    .map((n) => `<li><a href="${n.href}" class="nav-link${n.key === active ? ' is-active' : ''}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a></li>`)
    .join('');
  return `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" id="top">
  <div class="topbar">
    <div class="container topbar-inner">
      <span>${icon('pin')} ${site.addressLine}</span>
      <span class="topbar-right">
        <a href="${site.phoneHref}">${icon('phone')} ${site.phone}</a>
        <span>${icon('clock')} ${site.hoursShort}</span>
      </span>
    </div>
  </div>
  <nav class="navbar" aria-label="Main">
    <div class="container nav-inner">
      <a href="/" class="brand" aria-label="${site.name} – home">
        <img src="/assets/img/logo-mark.svg" alt="" width="40" height="40">
        <span class="brand-text"><strong>${site.shortName}</strong><small>Edinburgh Gardeners</small></span>
      </a>
      <ul class="nav-links" id="nav-menu">${links}
        <li class="nav-cta-mobile"><a href="/contact/#quote" class="btn btn-gold btn-block">Get a free quote</a></li>
      </ul>
      <div class="nav-actions">
        <a href="${site.phoneHref}" class="nav-phone" aria-label="Call ${site.phone}">${icon('phone')}<span>${site.phone}</span></a>
        <a href="/contact/#quote" class="btn btn-gold btn-sm nav-cta"><span>Free quote</span>${icon('arrow')}</a>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-menu"><span></span><span></span><span></span></button>
      </div>
    </div>
  </nav>
</header>`;
}

function footer() {
  const year = new Date().getFullYear();
  return `
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a href="/" class="brand brand-light">
        <img src="/assets/img/logo-mark.svg" alt="" width="44" height="44" loading="lazy">
        <span class="brand-text"><strong>${site.shortName}</strong><small>Edinburgh Gardeners</small></span>
      </a>
      <p>Grass cutting, hedge trimming and full garden clearances across ${site.area}. Open 7 days a week, 8am – 8pm.</p>
      <div class="footer-social">
        <a href="${site.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon('whatsapp')}</a>
        <a href="${site.phoneHref}" aria-label="Call us">${icon('phone')}</a>
        ${site.email ? `<a href="mailto:${site.email}" aria-label="Email us">${icon('mail')}</a>` : ''}
        ${site.socials.map((s) => `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}">${icon(s.icon)}</a>`).join('')}
      </div>
    </div>
    <div>
      <h2 class="footer-h">Explore</h2>
      <ul class="footer-links">${nav.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2 class="footer-h">Services</h2>
      <ul class="footer-links">
        ${site.services.slice(0, 6).map((s) => `<li><a href="/services/#${s.id}">${s.title}</a></li>`).join('')}
      </ul>
    </div>
    <div>
      <h2 class="footer-h">Get in touch</h2>
      <ul class="footer-contact">
        <li>${icon('phone')}<a href="${site.phoneHref}">${site.phone}</a></li>
        ${site.email ? `<li>${icon('mail')}<a href="mailto:${site.email}">${site.email}</a></li>` : ''}
        <li>${icon('pin')}<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}" target="_blank" rel="noopener">${site.addressLine}</a></li>
        <li>${icon('whatsapp')}<a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a></li>
        <li>${icon('clock')}<span>${site.hoursShort}</span></li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>© ${year} ${site.name}. All rights reserved.</p>
    <a href="#top" class="to-top">Back to top ${icon('arrow-up')}</a>
  </div>
</footer>
<a href="${site.whatsapp}" class="wa-float" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icon('whatsapp')}</a>
<div id="chatbot-root"></div>`;
}

function layout(meta, body) {
  const url = site.url + meta.path;
  const title = meta.title;
  const img = site.url + (meta.image || '/assets/img/og-image.jpg');
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    description: 'Gardening services in Edinburgh: grass cutting, hedge trimming and full garden clearance.',
    name: site.name,
    url: site.url,
    telephone: site.phoneIntl,
    ...(site.email ? { email: site.email } : {}),
    openingHours: 'Mo-Su 08:00-20:00',
    areaServed: site.area,
    address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.city, postalCode: site.address.postcode, addressCountry: 'GB' },
    image: img,
    sameAs: [...new Set([site.yell, ...site.socials.map((s) => s.url)])],
  };
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${meta.description}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0f2419">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${meta.description}">
<meta name="twitter:image" content="${img}">
<link rel="icon" href="/assets/img/logo-mark.svg" type="image/svg+xml">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/styles.css">
${meta.preload ? `<link rel="preload" as="image" href="${meta.preload}">` : ''}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script defer src="/assets/js/site-config.js"></script>
<script defer src="/assets/js/main.js"></script>
<script defer src="/assets/js/chatbot.js"></script>
</head>
<body class="page-${meta.key}">
${header(meta.key)}
<main id="main">
${body.trim()}
</main>
${footer()}
</body>
</html>
`;
}

// Very small template helpers usable inside pages: {{site.phone}}, {{icon:name}}
function render(str) {
  const emailItem = site.email
    ? `<li><a href="mailto:${site.email}?subject=Garden%20quote%20request"><span class="ic">${icon('mail')}</span><span><small>Email</small><strong>${site.email}</strong></span></a></li>`
    : '';
  return str
    .replace(/\{\{emailItem\}\}/g, emailItem)
    .replace(/\{\{icon:([\w-]+)\}\}/g, (_, n) => icon(n))
    .replace(/\{\{site\.(\w+)\}\}/g, (_, k) => site[k]);
}

const pages = [];
for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith('.html'))) {
  const raw = fs.readFileSync(path.join(SRC, file), 'utf8');
  const m = raw.match(/^<!--meta\s*([\s\S]*?)-->/);
  if (!m) throw new Error(`Missing meta block in ${file}`);
  const meta = JSON.parse(m[1]);
  const body = render(raw.slice(m[0].length));
  const html = layout(meta, body);
  const outFile = meta.path === '/' ? path.join(OUT, 'index.html')
    : meta.path === '/404' ? path.join(OUT, '404.html')
    : path.join(OUT, meta.path, 'index.html');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  if (meta.path !== '/404') pages.push(meta);
  console.log('built', path.relative(__dirname, outFile));
}

// sitemap.xml + robots.txt
const today = new Date().toISOString().slice(0, 10);
const order = ['/', '/about/', '/services/', '/portfolio/', '/contact/'];
pages.sort((a, b) => order.indexOf(a.path) - order.indexOf(b.path));
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${site.url}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.path === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

// Public, non-secret config consumed by the browser scripts
fs.writeFileSync(path.join(OUT, 'assets', 'js', 'site-config.js'),
  `window.SITE = ${JSON.stringify({
    name: site.name, shortName: site.shortName, addressLine: site.addressLine, openFrom: site.openFrom, openTo: site.openTo, phone: site.phone, phoneHref: site.phoneHref, email: site.email,
    whatsapp: site.whatsapp, whatsappNumber: site.whatsappNumber, area: site.area, hours: site.hours, formEndpoint: site.formEndpoint,
    services: site.services.map(({ id, title, short }) => ({ id, title, short })),
  }, null, 2)};\n`);
console.log('built sitemap.xml, robots.txt, site-config.js');
