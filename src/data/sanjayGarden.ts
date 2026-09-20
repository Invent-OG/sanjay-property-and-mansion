import { CONTACT_CONFIG } from './contact';

export interface ProjectCategory {
  id: string;
  num: string;
  label: string;
  title: string;
  specs: string;
  imageMain: string;
  imageSecondary: string;
  description: string;
}

export interface ProjectStatCard {
  id: string;
  title: string;
  subtitle: string;
  isAccent?: boolean;
  icon: 'location' | 'folder' | 'document';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const PROJECT_STAT_CARDS: ProjectStatCard[] = [
  {
    id: 'stat-location',
    title: 'SARAVANAMPATTI',
    subtitle: 'Coimbatore',
    isAccent: false,
    icon: 'location'
  },
  {
    id: 'stat-project',
    title: 'SANJAY GARDEN',
    subtitle: 'Residential Layout',
    isAccent: true, // Neon lime accent #d2f831
    icon: 'folder'
  },
  {
    id: 'stat-reference',
    title: '42/2008',
    subtitle: 'Historical Layout Reference',
    isAccent: false,
    icon: 'document'
  }
];

export const SANJAY_GARDEN_CATEGORIES: ProjectCategory[] = [
  {
    id: 'overview',
    num: '01',
    label: 'Overview',
    title: 'Sanjay Garden Residential Layout',
    specs: 'Planned Layout • Saravanampatti • Coimbatore North',
    imageMain: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    imageSecondary: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    description: 'A planned residential enclave in Saravanampatti designed with generous road networks and community spaces.'
  },
  {
    id: 'location',
    num: '02',
    label: 'Location',
    title: 'PNT Colony, Saravanampatti',
    specs: 'Prime Coimbatore Corridor • 641035',
    imageMain: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
    imageSecondary: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    description: 'Direct proximity to Saravanampatti IT hub, educational institutions, healthcare centers, and transport links.'
  },
  {
    id: 'layout',
    num: '03',
    label: 'Layout',
    title: 'Historical Approval Ref: 42/2008',
    specs: 'Residential Sites • Internal Roads • Open Parks',
    imageMain: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
    imageSecondary: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
    description: 'Detailed layout planning encompassing residential plots, multiple road widths, and commercial reserve spaces.'
  },
  {
    id: 'gallery',
    num: '04',
    label: 'Gallery',
    title: 'Community Environment & Green Spaces',
    specs: 'Residential Neighborhood • Saravanampatti',
    imageMain: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80',
    imageSecondary: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
    description: 'Peaceful residential living with natural ventilation and tree-lined neighborhood roadways.'
  }
];

// Connected to the places that matter (Location & Network categories)
export const LOCATION_NETWORK_PILLS: { id: string; name: string; category: string }[][] = [
  [
    { id: '1', name: 'Education', category: 'Schools & Colleges' },
    { id: '2', name: 'Healthcare', category: 'Multispecialty Hospitals' },
    { id: '3', name: 'Technology', category: 'Saravanampatti IT Park' },
    { id: '4', name: 'Shopping', category: 'Retail & Markets' },
    { id: '5', name: 'Connectivity', category: 'Sathy Road Arterial' }
  ],
  [
    { id: '6', name: 'Coimbatore North', category: 'Key Growth Belt' },
    { id: '7', name: 'Transportation', category: 'Bus & Rail Access' },
    { id: '8', name: 'PNT Colony', category: 'Established Neighborhood' },
    { id: '9', name: 'Open Reserves', category: 'Parks & Greenery' },
    { id: '10', name: 'Commercial Area', category: 'Shops & Convenience' }
  ]
];

// 4 non-collapsing Discover items
export const SANJAY_DISCOVER_ITEMS = [
  {
    id: 'project-overview',
    title: 'Project Overview',
    subtitle: 'Sanjay Garden Residential Enclave',
    location: 'Saravanampatti, Coimbatore',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sanjay-garden-phase-1',
    title: 'Sanjay Garden Phase 1',
    subtitle: 'Residential Layout Reference 42/2008',
    location: 'PNT Colony, Saravanampatti, Coimbatore',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    featured: true
  },
  {
    id: 'location-connectivity',
    title: 'Location Connectivity',
    subtitle: 'Close to Major IT & Educational Hubs',
    location: 'Coimbatore North Corridor',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'green-surroundings',
    title: 'Green Surroundings',
    subtitle: 'Peaceful Living Environment',
    location: 'Saravanampatti 641035',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80'
  }
];

export const SANJAY_FAQS: FaqItem[] = [
  {
    id: '01',
    question: '1. What is Sanjay Garden?',
    answer:
      'Sanjay Garden is a residential layout developed in Saravanampatti, Coimbatore North, providing residential plots in an established and rapidly growing neighborhood.'
  },
  {
    id: '02',
    question: '2. Where is Sanjay Garden located?',
    answer:
      'Sanjay Garden is located at PNT Colony, Saravanampatti, Coimbatore, Tamil Nadu – 641035, with direct access to Saravanampatti-Sathy Road and major commercial conveniences.'
  },
  {
    id: '03',
    question: '3. What type of property is available?',
    answer:
      'The layout historically comprises residential house sites, internal road networks, designated open space reserve areas, and shop/commercial provisions.'
  },
  {
    id: '04',
    question: '4. What are the available plot sizes?',
    answer:
      'Please contact Sanjay Properties for the latest information on current plot availability, facing directions, and dimensional details.'
  },
  {
    id: '05',
    question: '5. What is the current price?',
    answer:
      'Please contact Sanjay Properties for the latest information on current pricing, payment schedules, and documentation assistance.'
  },
  {
    id: '06',
    question: '6. What is the historical layout reference?',
    answer:
      'The historical layout approval reference is D.D.T.P / C.L.P.A No. 42/2008, corresponding to survey numbers S.F. No. 402/2pt, 402/3pt, and 402/4pt in Saravanampatti, Coimbatore North.'
  },
  {
    id: '07',
    question: '7. How can I schedule a site visit?',
    answer:
      'You can schedule a site visit by clicking "Schedule a Site Visit" on this website, sending us a message on WhatsApp, or reaching out to Sanjay Properties directly.'
  },
  {
    id: '08',
    question: '8. How can I request project documents?',
    answer:
      'To request project layout copies, title details, and survey references, please fill out our enquiry form or contact our office in Saravanampatti.'
  }
];

export const EDITORIAL_STACK_CARDS = [
  {
    id: 'card-1',
    addressLine1: 'Sanjay Garden, PNT Colony',
    addressLine2: 'Saravanampatti, Coimbatore – 641035',
    tag: 'Residential Plots · Approved Layout',
    time: 'Verified Location',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    buttonBg: 'bg-[#d2f831] text-black'
  },
  {
    id: 'card-2',
    addressLine1: 'S.F. No. 402/2pt, 402/3pt, 402/4pt',
    addressLine2: 'Layout Ref: 42/2008 · Coimbatore North',
    tag: 'Survey & Legal Records',
    time: 'PNT Colony Belt',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    buttonBg: 'bg-neutral-900 text-white'
  },
  {
    id: 'card-3',
    addressLine1: 'Saravanampatti Growth Hub',
    addressLine2: 'IT Corridor · Sathy Road Connectivity',
    tag: 'Residential Enclave',
    time: 'Coimbatore 641035',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    buttonBg: 'bg-neutral-400 text-white'
  }
];
