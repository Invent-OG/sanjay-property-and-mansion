export interface Property {
  id: string;
  title: string;
  category: 'house' | 'apartment' | 'villa' | 'residential';
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  tag?: string;
  featured?: boolean;
}

export interface BrandPartner {
  id: string;
  name: string;
  iconType: 'invert' | 'compass' | 'glossy' | 'starburst' | 'hues' | 'snowflake' | 'apex' | 'flash' | 'flow' | 'luminous';
}

export const METRICS = [
  {
    id: 'clients',
    value: '189K+',
    label: 'HAPPY CLIENTS SERVED',
    bg: 'bg-[#f0f2f4]',
    textColor: 'text-neutral-950',
    icon: 'share'
  },
  {
    id: 'sold',
    value: '16K+',
    label: 'PROPERTIES SOLD',
    bg: 'bg-[#d2f831]',
    textColor: 'text-black',
    icon: 'folder'
  },
  {
    id: 'available',
    value: '338+',
    label: 'AVAILABLE PROPERTIES',
    bg: 'bg-[#f0f2f4]',
    textColor: 'text-neutral-950',
    icon: 'building'
  }
];

export const CATEGORIES = [
  {
    id: 'house',
    num: '01',
    label: 'House',
    count: 142,
    icon: 'home',
    imageMain: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    imageSecondary: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    title: 'Minimalist Sunset Haven',
    specs: '4 Beds • 3.5 Baths • 3,850 sq ft'
  },
  {
    id: 'apartment',
    num: '02',
    label: 'Apartment',
    count: 98,
    icon: 'building-2',
    imageMain: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
    imageSecondary: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    title: 'Skyline Penthouse Suites',
    specs: '3 Beds • 2.5 Baths • 2,400 sq ft'
  },
  {
    id: 'villa',
    num: '03',
    label: 'Villa',
    count: 64,
    icon: 'castle',
    imageMain: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
    imageSecondary: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
    title: 'Ocean Horizon Villa',
    specs: '5 Beds • 6 Baths • 5,600 sq ft'
  },
  {
    id: 'residential',
    num: '04',
    label: 'Residential',
    count: 34,
    icon: 'hotel',
    imageMain: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80',
    imageSecondary: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
    title: 'Cubic Forest Sanctuary',
    specs: '4 Beds • 4 Baths • 4,100 sq ft'
  }
];

export const BRAND_PARTNERS: BrandPartner[][] = [
  [
    { id: '1', name: 'Invert', iconType: 'invert' },
    { id: '2', name: 'Invert', iconType: 'invert' },
    { id: '3', name: '', iconType: 'compass' },
    { id: '4', name: 'Glossy', iconType: 'glossy' },
    { id: '5', name: '', iconType: 'starburst' },
    { id: '6', name: 'hues', iconType: 'hues' }
  ],
  [
    { id: '7', name: 'Snowflake', iconType: 'snowflake' },
    { id: '8', name: '', iconType: 'apex' },
    { id: '9', name: 'Flash', iconType: 'flash' },
    { id: '10', name: 'Flash', iconType: 'flash' },
    { id: '11', name: '', iconType: 'flow' },
    { id: '12', name: 'luminous', iconType: 'luminous' }
  ]
];

export const DISCOVER_PROPERTIES: Property[] = [
  {
    id: 'elite-advisors',
    title: 'Elite estate advisors',
    category: 'house',
    location: 'Bavaria Ridge, Munich',
    price: '$2,850,000',
    beds: 4,
    baths: 3,
    sqft: '3,450',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'grand-kalijaga',
    title: 'Grand Kalijaga',
    category: 'villa',
    location: 'Street 136 Road united kingdom of London',
    price: '$4,650,000',
    beds: 5,
    baths: 4.5,
    sqft: '4,890',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    featured: true
  },
  {
    id: 'skyline-reality',
    title: 'Skyline reality',
    category: 'house',
    location: 'Palm Desert Escarpment, California',
    price: '$3,150,000',
    beds: 4,
    baths: 4,
    sqft: '3,920',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'vista-lux-reality',
    title: 'Vista lux-reality',
    category: 'residential',
    location: 'Costa Smeralda, Sardinia',
    price: '$3,900,000',
    beds: 5,
    baths: 5,
    sqft: '4,300',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80'
  }
];

export const TESTIMONIALS = [
  {
    quote:
      "I was very impressed with the service I received from Plumco. The plumber was on time, professional, and did an excellent job. I would highly recommend them to anyone looking for a reliable plumber.",
    author: 'Albert Addison',
    role: 'CEO at this company',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80'
    ]
  },
  {
    quote:
      "Realtxo made our international property purchase seamless. Their transparency, attention to architectural nuance, and negotiation guidance saved us hundreds of thousands.",
    author: 'Elena Rostova',
    role: 'Managing Partner, Horizon Fund',
    avatars: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80'
    ]
  }
];

export const FAQS = [
  {
    id: '01',
    question: 'What should I consider before buying a property?',
    answer:
      'Refresh your wardrobe with the latest trends and timeless classics. At Fragile base, we bring you high-quality, stylish clothing and accessories that make every day a fashion statement. In real estate terms, prioritize location orientation, architectural build durability, zoning restrictions, tax efficiency, and long-term resale equity.'
  },
  {
    id: '02',
    question: 'How long does the home-buying process usually take?',
    answer:
      'On average, purchasing a luxury residential property takes between 30 to 60 days from accepted offer through escrow closing, contingent on title searches, architectural inspections, and financial underwriting.'
  },
  {
    id: '03',
    question: 'How long does the home-buying process usually ?',
    answer:
      'Cash transactions can close in as little as 10 to 14 business days, whereas specialized cross-border escrow and structured financing usually span 4 to 8 weeks with concierge support.'
  },
  {
    id: '04',
    question: 'What are closing costs in real estate?',
    answer:
      'Closing costs typically range from 2% to 5% of the total purchase price, encompassing title insurance, escrow fees, appraisal charges, recording fees, transfer taxes, and legal review.'
  },
  {
    id: '05',
    question: 'How can I increase the value of my home before selling?',
    answer:
      'High-return investments include architectural lighting upgrades, minimalist landscaping, floor-to-ceiling glass patio integration, smart climate infrastructure, and certified structural wellness audits.'
  }
];

export const STACKED_CARDS = [
  {
    id: 'card-1',
    address: '1802 (From 1082 to 1899 Odd) Forest City RD, Forest City TWP, ME',
    time: 'Today, 9 hours ago',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    specs: '216 m² living space • Cubist floor plan',
    badge: 'Trending'
  },
  {
    id: 'card-2',
    address: '942 Lakefront Promenade, Geneva Lakes, WI',
    time: 'Today, 14 hours ago',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    specs: '195 m² terrace • Panoramic views',
    badge: 'Exclusive'
  },
  {
    id: 'card-3',
    address: '44 Alpine Terrace, Aspen Ridge, CO',
    time: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    specs: '310 m² timber & glass pavilion',
    badge: 'New'
  }
];
