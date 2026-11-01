/** Contact details and navigation shared by the header, menu, contact block and footer. */

export const CONTACT = {
  phone: '+917900530090',
  phoneDisplay: '+91 79005 30090',
  email: 'poesiaindia96@gmail.com',
  whatsapp: 'https://wa.me/917900530090',
  instagram: 'https://www.instagram.com/poesia_india/',
  instagramHandle: '@poesia_india',
  address: 'H No. 839/16(3), Shetye Residency, Alto Porvorim, Socorro, Bardez, Goa',
  addressShort: 'Alto Porvorim, Bardez, Goa',
  directions: 'https://www.google.com/maps/search/?api=1&query=Shetye+Residency+Alto+Porvorim+Socorro+Bardez+Goa',
};

const waLink = (text) => `${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

/** Pre-filled WhatsApp enquiries. */
export const WHATSAPP = {
  enquiry: waLink('Hi Poesia, I found you through your website and would like to know more about your coffee for my café / hotel.'),
  tasting: waLink("Hi Poesia, I'd like to request a coffee tasting for my café / hotel."),
};

/** Header links (wide screens). The menu adds "Get in touch". */
export const NAV_LINKS = [
  { href: '#blends', label: 'Blends' },
  { href: '#equipment', label: 'Equipment' },
  { href: '#partner', label: 'Partnership' },
];

export const MENU_LINKS = [...NAV_LINKS, { href: '#contact', label: 'Get in', accent: 'touch' }];

export const MENU_FOOT = [
  { href: CONTACT.whatsapp, label: 'WhatsApp', external: true },
  { href: `mailto:${CONTACT.email}`, label: 'Email' },
  { href: CONTACT.instagram, label: 'Instagram', external: true },
];

export const FOOTER_EXPLORE = [
  { href: '#origin', label: 'The origin' },
  { href: '#craft', label: 'Crafted in Goa' },
  { href: '#blends', label: 'Our blends' },
  { href: '#journey', label: 'The journey' },
  { href: '#equipment', label: 'Equipment' },
  { href: '#partner', label: 'Partnership' },
  { href: '#contact', label: 'Get in touch' },
];

export const FOOTER_CONTACT = [
  { href: CONTACT.whatsapp, label: 'WhatsApp', external: true },
  { href: `tel:${CONTACT.phone}`, label: CONTACT.phoneDisplay },
  { href: `mailto:${CONTACT.email}`, label: CONTACT.email },
  { href: CONTACT.instagram, label: `Instagram · ${CONTACT.instagramHandle}`, external: true },
];

export const COPYRIGHT_YEAR = 2026;

/** The business behind the site, as named on the legal pages. */
export const BUSINESS = {
  name: 'Poesia India',
  site: 'this website',
  jurisdiction: 'Goa, India',
};

/** Pages of their own (routes), not chapters of the story. */
export const LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms & conditions' },
];
