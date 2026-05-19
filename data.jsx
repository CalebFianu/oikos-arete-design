// Seed data for vendors, categories, and event types

const CATEGORIES = [
  { id: 'planners', label: 'Planners', plural: 'Event Planners' },
  { id: 'caterers', label: 'Caterers', plural: 'Caterers' },
  { id: 'hmua', label: 'Hair & Makeup', plural: 'Hair & Makeup Artists' },
  { id: 'photo', label: 'Photo & Video', plural: 'Photographers & Videographers' },
  { id: 'decor', label: 'Decorators', plural: 'Decorators & Florists' },
  { id: 'djs', label: 'DJs', plural: 'DJs' },
  { id: 'mcs', label: 'MCs', plural: 'Masters of Ceremony' },
  { id: 'mixology', label: 'Mixologists', plural: 'Mixologists' },
];

const EVENT_TYPES = [
  { id: 'wedding',    label: 'Weddings',                 num: '01', sub: 'Ceremonies & receptions of every scale.' },
  { id: 'corporate',  label: 'Corporate',                num: '02', sub: 'Galas, launches, retreats, summits.' },
  { id: 'birthday',   label: 'Birthdays',                num: '03', sub: 'From milestone dinners to grand affairs.' },
  { id: 'private',    label: 'Private Gatherings',       num: '04', sub: 'Discreet, intimate, by invitation only.' },
  { id: 'anniversary',label: 'Anniversaries',            num: '05', sub: 'Quiet luxury, marked in years.' },
  { id: 'fundraiser', label: 'Fundraisers',              num: '06', sub: 'Galas, auctions, and cause-driven events.' },
];

const CITIES = ['Lagos', 'Abuja', 'Accra', 'Nairobi', 'Cape Town', 'Marrakech', 'Dubai', 'London', 'Paris', 'New York'];

const VENDORS = [
  // Planners
  { id: 'v01', name: 'Maison Adaeze', cat: 'planners', city: 'Lagos', tier: 3, rating: 4.9, tags: ['weddings','luxury','destination'], blurb: 'Full-service production for couture weddings and milestone galas. Twelve years of staging events that quietly become legend.', phone: '+234 802 119 0044', email: 'concierge@maisonadaeze.co', web: 'maisonadaeze.co', ig: '@maisonadaeze', tile: ['#1a1612','#a88a4a'] },
  { id: 'v02', name: 'Ile Studio', cat: 'planners', city: 'Accra', tier: 2, rating: 4.7, tags: ['corporate','intimate','minimal'], blurb: 'A tightly-edited practice. We plan fewer events, more carefully.', phone: '+233 24 555 8810', email: 'studio@ile.events', web: 'ile.events', ig: '@ile.studio', tile: ['#0e0e0c','#5C1A2B'] },
  { id: 'v03', name: 'Atelier Verre', cat: 'planners', city: 'Marrakech', tier: 3, rating: 4.95, tags: ['destination','weddings','heritage'], blurb: 'Riads, ksour, and oases — staged for the discerning.', phone: '+212 524 33 21 90', email: 'salon@atelierverre.ma', web: 'atelierverre.ma', ig: '@atelier.verre', tile: ['#2a1810','#a88a4a'] },

  // Caterers
  { id: 'v04', name: 'The Long Table', cat: 'caterers', city: 'Lagos', tier: 3, rating: 4.85, tags: ['fine dining','seasonal','tasting'], blurb: 'Tasting-menu catering led by a former two-Michelin sous chef. Provenance traceable to the plate.', phone: '+234 815 220 4471', email: 'reservations@longtable.co', web: 'longtable.co', ig: '@thelongtable', tile: ['#3a1a22','#d4b06a'] },
  { id: 'v05', name: 'Saffron & Smoke', cat: 'caterers', city: 'Dubai', tier: 3, rating: 4.8, tags: ['levantine','live fire','grand'], blurb: 'Open-fire feasts and the gentlest spice. Always theatre.', phone: '+971 4 220 1188', email: 'book@saffronsmoke.ae', web: 'saffronandsmoke.ae', ig: '@saffronandsmoke', tile: ['#1a0f0a','#c89544'] },
  { id: 'v06', name: 'Mère & Fille', cat: 'caterers', city: 'Paris', tier: 3, rating: 4.92, tags: ['french','heritage','dessert'], blurb: 'Two generations, one kitchen. Patisserie at the level of art objects.', phone: '+33 1 42 60 11 22', email: 'concierge@mereetfille.fr', web: 'mereetfille.fr', ig: '@mere.et.fille', tile: ['#2a1a1a','#b4894a'] },
  { id: 'v07', name: 'Harvest Room', cat: 'caterers', city: 'Cape Town', tier: 2, rating: 4.6, tags: ['seasonal','farm','intimate'], blurb: 'Farm-to-table for sit-down dinners up to 80.', phone: '+27 21 555 0142', email: 'hello@harvestroom.za', web: 'harvestroom.za', ig: '@harvest.room', tile: ['#1a1410','#9a7838'] },

  // HMUA
  { id: 'v08', name: 'House of Lumière', cat: 'hmua', city: 'Lagos', tier: 3, rating: 4.95, tags: ['bridal','editorial','runway'], blurb: 'Editorial-grade hair and makeup for the day you intend to remember.', phone: '+234 803 901 2241', email: 'studio@houseoflumiere.co', web: 'houseoflumiere.co', ig: '@house.of.lumiere', tile: ['#2a2018','#d4b66c'] },
  { id: 'v09', name: 'Atelier Noir', cat: 'hmua', city: 'London', tier: 3, rating: 4.85, tags: ['bridal','soft glam','natural'], blurb: 'Quiet luxury, applied. Skin first. Always.', phone: '+44 20 7946 0044', email: 'bookings@ateliernoir.uk', web: 'ateliernoir.uk', ig: '@ateliernoir.uk', tile: ['#0e0e0c','#a88a4a'] },
  { id: 'v10', name: 'Studio Ọ̀là', cat: 'hmua', city: 'Abuja', tier: 2, rating: 4.7, tags: ['bridal','traditional','party'], blurb: 'Modern face, traditional language. We speak both.', phone: '+234 814 770 9920', email: 'team@studio-ola.com', web: 'studio-ola.com', ig: '@studio.ola', tile: ['#3a1a22','#c89544'] },

  // Photo
  { id: 'v11', name: 'Folio by Idris', cat: 'photo', city: 'Lagos', tier: 3, rating: 4.95, tags: ['wedding','documentary','film'], blurb: 'Documentary photography that ages like a Magnum print.', phone: '+234 809 220 1118', email: 'studio@folio.id', web: 'folio.id', ig: '@folio.idris', tile: ['#0e0e0c','#a88a4a'] },
  { id: 'v12', name: 'Northlight Co.', cat: 'photo', city: 'New York', tier: 3, rating: 4.88, tags: ['editorial','corporate','film'], blurb: 'Quiet observers with very expensive cameras.', phone: '+1 212 555 0190', email: 'office@northlight.co', web: 'northlight.co', ig: '@northlight.co', tile: ['#1a1612','#9a7838'] },
  { id: 'v13', name: 'Ode Cinema', cat: 'photo', city: 'Accra', tier: 2, rating: 4.7, tags: ['cinema','wedding','aerial'], blurb: 'Cinematic films, scored bespoke. Six-week delivery.', phone: '+233 24 880 1145', email: 'films@odecinema.gh', web: 'odecinema.gh', ig: '@ode.cinema', tile: ['#2a1810','#b4894a'] },

  // Decor
  { id: 'v14', name: 'Rosewood & Brass', cat: 'decor', city: 'Lagos', tier: 3, rating: 4.9, tags: ['florals','tablescapes','installation'], blurb: 'Florals at the scale of architecture. Brass at the scale of jewellery.', phone: '+234 802 451 0098', email: 'concierge@rosewoodbrass.co', web: 'rosewoodbrass.co', ig: '@rosewoodbrass', tile: ['#3a1a22','#d4b06a'] },
  { id: 'v15', name: 'Maison Verte', cat: 'decor', city: 'Paris', tier: 3, rating: 4.85, tags: ['florals','european','heirloom'], blurb: 'Heirloom blooms, sourced at dawn from Rungis.', phone: '+33 1 45 22 90 11', email: 'salon@maisonverte.fr', web: 'maisonverte.fr', ig: '@maison.verte', tile: ['#1a1612','#a88a4a'] },
  { id: 'v16', name: 'The Setting', cat: 'decor', city: 'Nairobi', tier: 2, rating: 4.6, tags: ['installation','modern','minimal'], blurb: 'Architectural decor for those who already have flowers.', phone: '+254 20 555 0193', email: 'office@thesetting.ke', web: 'thesetting.ke', ig: '@the.setting', tile: ['#0e0e0c','#5C1A2B'] },

  // DJs
  { id: 'v17', name: 'DJ Kola', cat: 'djs', city: 'Lagos', tier: 3, rating: 4.92, tags: ['afrobeats','house','wedding'], blurb: 'Reads a room before walking into it. Twelve-hour sets without fatigue.', phone: '+234 803 144 7700', email: 'bookings@kola.fm', web: 'kola.fm', ig: '@dj.kola', tile: ['#0e0e0c','#a88a4a'] },
  { id: 'v18', name: 'Selectah Ré', cat: 'djs', city: 'Abuja', tier: 2, rating: 4.7, tags: ['soul','classics','intimate'], blurb: 'Vinyl-first. Soul, jazz, lover\u2019s rock. Dinner-to-dancefloor specialist.', phone: '+234 815 220 1144', email: 'mgmt@selectah-re.com', web: 'selectah-re.com', ig: '@selectah.re', tile: ['#3a1a22','#c89544'] },

  // MCs
  { id: 'v19', name: 'Olu Adesanya', cat: 'mcs', city: 'Lagos', tier: 3, rating: 4.9, tags: ['bilingual','formal','warm'], blurb: 'Hosts in three languages, never overstays the moment.', phone: '+234 809 117 4400', email: 'mgmt@oluadesanya.co', web: 'oluadesanya.co', ig: '@olu.adesanya', tile: ['#1a1612','#9a7838'] },
  { id: 'v20', name: 'Ms. Adwoa Mensah', cat: 'mcs', city: 'Accra', tier: 2, rating: 4.75, tags: ['corporate','english','french'], blurb: 'Corporate hosting with a vanishingly light touch.', phone: '+233 24 778 0033', email: 'hello@adwoa.co', web: 'adwoa.co', ig: '@adwoa.host', tile: ['#2a1810','#b4894a'] },

  // Mixology
  { id: 'v21', name: 'The Velvet Bar', cat: 'mixology', city: 'Lagos', tier: 3, rating: 4.88, tags: ['bespoke menu','tableside','rare spirits'], blurb: 'Cocktails as portraits — built for your guests, not your party.', phone: '+234 802 880 1199', email: 'salon@velvetbar.co', web: 'velvetbar.co', ig: '@thevelvetbar', tile: ['#0e0e0c','#5C1A2B'] },
  { id: 'v22', name: 'Highball & Co.', cat: 'mixology', city: 'Cape Town', tier: 2, rating: 4.65, tags: ['classics','low-abv','fast'], blurb: 'A fast, accurate bar program for events of 200+.', phone: '+27 21 555 0148', email: 'hello@highball.za', web: 'highball.za', ig: '@highball.co', tile: ['#1a1410','#a88a4a'] },
];

window.OA_DATA = { CATEGORIES, EVENT_TYPES, CITIES, VENDORS };
