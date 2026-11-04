/**
 * Single source of truth for business details.
 * Source: Yell listing https://www.yell.com/biz/garden-care-edinburgh-901563828/
 * Edit here, then run `npm run build`. Items marked CONFIRM should be checked with the owner.
 */
module.exports = {
  name: 'Garden Care Edinburgh',
  shortName: 'Garden Care',
  tagline: 'Gardening Services',
  url: 'https://www.gardencare-edinburgh.co.uk', // CONFIRM: final domain
  area: 'Edinburgh & surrounding areas',
  phone: '07414 080999',
  phoneIntl: '+447414080999',
  phoneHref: 'tel:+447414080999',
  // CONFIRM: that this mobile number is on WhatsApp
  whatsapp: 'https://wa.me/447414080999?text=' + encodeURIComponent("Hi Garden Care! I'd like a quote for some garden work."),
  whatsappNumber: '447414080999',
  address: { street: '17/1 Polwarth Gardens', city: 'Edinburgh', postcode: 'EH11 1JT', country: 'GB' },
  addressLine: '17/1 Polwarth Gardens, Edinburgh EH11 1JT',
  mapQuery: '17/1 Polwarth Gardens, Edinburgh EH11 1JT',
  yell: 'https://www.yell.com/biz/garden-care-edinburgh-901563828/',
  // From the Yell listing: open 8am–8pm every day
  hours: [
    ['Monday – Friday', '8:00am – 8:00pm'],
    ['Saturday', '8:00am – 8:00pm'],
    ['Sunday', '8:00am – 8:00pm'],
  ],
  openFrom: 8, openTo: 20, // used by the "open now" badge (every day)
  hoursShort: 'Open 7 days · 8am – 8pm',

  // Business email: not listed on Yell. ADD IT HERE to enable email delivery of the quote form + chatbot leads.
  // e.g. email: 'hello@gardencare-edinburgh.co.uk'
  email: '',
  // When an email is set, submissions are emailed via FormSubmit (formsubmit.co). Leave null to auto-derive.
  formEndpoint: null,

  socials: [
    { label: 'Garden Care on Yell', icon: 'star', url: 'https://www.yell.com/biz/garden-care-edinburgh-901563828/' },
  ],
  services: [
    { id: 'grass-cutting', title: 'Grass Cutting & Lawn Care', short: 'Neat, healthy lawns with regular or one-off cuts, edging included.' },
    { id: 'hedge-trimming', title: 'Hedge Trimming', short: 'Tidy, shaped hedges and shrubs, with all clippings cleared away.' },
    { id: 'garden-clearance', title: 'Full Garden Clearance', short: 'Overgrown or neglected gardens cleared and brought back to life.' },
    { id: 'garden-maintenance', title: 'Regular Garden Maintenance', short: 'Weekly, fortnightly or monthly visits to keep everything in shape.' },
    { id: 'weeding-borders', title: 'Weeding & Border Care', short: 'Weed-free beds, borders, paths and patios.' },
    { id: 'seasonal-tidy', title: 'Seasonal Tidy-Ups', short: 'Spring and autumn tidies, leaf clearance and pre-sale makeovers.' },
  ],
};
if (!module.exports.formEndpoint && module.exports.email) {
  module.exports.formEndpoint = 'https://formsubmit.co/ajax/' + module.exports.email;
}
