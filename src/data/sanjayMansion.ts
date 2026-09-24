export interface AccommodationOption {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: string;
  priceNote?: string;
  features: string[];
  recommended?: boolean;
}

export interface FacilityItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface MealOption {
  frequency: string;
  days: string;
  priceApprox: string;
  dailyRateApprox?: string;
  description: string;
}

export interface DayMealMenu {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  isHoliday?: boolean;
}

export const SANJAY_MANSION_DATA = {
  propertyName: 'WESTERN STAY – SANJAY MANSION',
  shortTitle: 'Sanjay Mansion',
  tagline: 'Your Home Away From Home',
  location: {
    addressLine1: 'No. 6, Sanjay Garden',
    landmark: 'Opp. KCT Tech Park',
    area: 'Saravanampatti',
    city: 'Coimbatore',
    pincode: '641 035',
    fullAddress: 'No. 6, Sanjay Garden, Opp. KCT Tech Park, Saravanampatti, Coimbatore – 641 035',
    googleMapsUrl: 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
    embedMapUrl: 'https://maps.google.com/maps?q=11.0827,76.9942+(Western%20Stay%20-%20Sanjay%20Mansion)&t=&z=16&ie=UTF8&iwloc=&output=embed'
  },
  phones: [
    { display: '8056889900', href: 'tel:8056889900' },
    { display: '8110889900', href: 'tel:8110889900' }
  ],
  pricingStart: '₹4,900',
  description:
    'A peaceful and comfortable stay in Saravanampatti, Coimbatore, designed with essential facilities, clean surroundings and convenient accommodation options.',
  longDescription:
    'Western Stay – Sanjay Mansion offers a peaceful and comfortable accommodation experience in Saravanampatti, Coimbatore. Located near KCT Tech Park, the property is designed for convenient living with essential facilities, individual accommodation options, clean surroundings and a secure environment.',
  highlights: [
    { title: 'Quality & Comfort', desc: 'Thoughtfully designed rooms for relaxing daily living.' },
    { title: 'Peaceful Address', desc: 'Quiet residential surroundings inside Sanjay Garden.' },
    { title: 'Wake Up To Nature', desc: 'Greenery and fresh airflow away from city congestion.' },
    { title: 'Your Home Away From Home', desc: 'Secure, welcoming atmosphere with attentive management.' }
  ],
  accommodations: [
    {
      id: 'four-sharing',
      name: 'Four Sharing Room',
      badge: 'Budget Friendly',
      priceMonthly: '₹4,900',
      priceNote: 'per person / month',
      features: [
        'Individual Bed & Storage Wardrobe',
        'Solar Heated 24×7 Hot Water',
        'High-Speed Wi-Fi Internet Included',
        'Clean Regular Housekeeping Included'
      ]
    },
    {
      id: 'double-sharing',
      name: 'Double Sharing Room',
      badge: 'Most Popular',
      recommended: true,
      priceMonthly: '₹6,500',
      priceNote: 'per person / month',
      features: [
        'Spacious Double Bed Configuration',
        'Attached Clean Restroom',
        'Study Desk Space & Power Points',
        'Peaceful & Quiet Environment'
      ]
    },
    {
      id: 'single-private',
      name: 'Single Private Room',
      badge: 'Maximum Privacy',
      priceMonthly: '₹9,500',
      priceNote: 'per month',
      features: [
        'Complete Single Private Room',
        'Dedicated Workspace & Storage',
        'Premium Natural Ventilation',
        'Full Access to All Mansion Amenities'
      ]
    }
  ] as AccommodationOption[],
  accommodationNotes: [
    'AC rooms available on request.',
    'Additional discount may be available for bulk booking.'
  ],
  facilities: [
    {
      id: 'wifi',
      title: 'Free Wi-Fi',
      description: 'Individual 60GB high-speed data access for work, study and streaming.',
      iconName: 'wifi'
    },
    {
      id: 'solar',
      title: 'Solar Hot Water',
      description: 'Reliable, energy-efficient hot water facility round the clock.',
      iconName: 'sun'
    },
    {
      id: 'bathroom',
      title: 'Attached Bathroom',
      description: 'Convenient, clean private bathroom facilities for every room.',
      iconName: 'shower-head'
    },
    {
      id: 'maintenance',
      title: 'Regular Room Maintenance',
      description: 'Regular professional room cleaning and clean bedsheet change.',
      iconName: 'sparkles'
    },
    {
      id: 'water',
      title: 'RO Treated Water',
      description: 'Multi-stage purified drinking water accessible on every floor.',
      iconName: 'droplets'
    },
    {
      id: 'cot',
      title: 'Individual Cot',
      description: 'Personal sleeping arrangement with comfortable quality mattress.',
      iconName: 'bed'
    },
    {
      id: 'study',
      title: 'Study Table',
      description: 'Dedicated workspace for study, laptop usage and reading.',
      iconName: 'book-open'
    },
    {
      id: 'storage',
      title: 'Secure Storage Cupboard',
      description: 'Individual lockable storage wardrobe for belongings.',
      iconName: 'shield-check'
    },
    {
      id: 'laundry',
      title: 'Laundry Access',
      description: 'Free convenient access to automatic washing machine.',
      iconName: 'waves'
    },
    {
      id: 'parking',
      title: 'Covered Two-Wheeler Parking',
      description: 'Secure covered on-site parking facility for bikes and scooters.',
      iconName: 'bike'
    },
    {
      id: 'cctv',
      title: '24×7 CCTV Surveillance',
      description: 'Continuous security camera monitoring throughout common premises.',
      iconName: 'video'
    },
    {
      id: 'nature',
      title: 'Peaceful Environment',
      description: 'Clean, serene and natural surroundings inside Sanjay Garden.',
      iconName: 'trees'
    }
  ] as FacilityItem[],
  whyChooseUs: [
    {
      id: 'comfort',
      title: 'COMFORT',
      desc: 'Designed for convenient everyday living with premium beds, cross-ventilation, and spacious rooms.'
    },
    {
      id: 'safety',
      title: 'SAFETY',
      desc: '24×7 CCTV surveillance, individual secure storage, and a monitored residential entrance.'
    },
    {
      id: 'convenience',
      title: 'CONVENIENCE',
      desc: 'High-speed Wi-Fi, laundry access, covered parking, and essential amenities included.'
    },
    {
      id: 'peaceful',
      title: 'PEACEFUL ENVIRONMENT',
      desc: 'Clean, natural and comfortable surroundings opposite KCT Tech Park in Saravanampatti.'
    }
  ],
  mealsSummary: [
    {
      frequency: '1 TIME',
      days: '26 Days',
      priceApprox: '₹1,300 approx.',
      description: 'Ideal for residents needing only dinner or lunch daily.'
    },
    {
      frequency: '2 TIMES',
      days: '26 Days',
      priceApprox: '₹2,350 approx.',
      description: 'Includes two wholesome, freshly prepared meals per day.'
    },
    {
      frequency: '3 TIMES',
      days: '26 Days',
      priceApprox: '₹3,600 approx.',
      dailyRateApprox: '₹140 per day approximately',
      description: 'Complete 3-meal plan covering breakfast, lunch and dinner.'
    }
  ] as MealOption[],
  mealsDisclaimer: 'Meal pricing is vendor-based and may be subject to change.',
  basicMealPlanPlans: [
    {
      type: 'VEG',
      monthly: '₹3,500',
      weekly: '₹950',
      tag: 'Pure Veg Homestyle'
    },
    {
      type: 'NON-VEG',
      monthly: '₹4,200',
      weekly: '₹1,150',
      tag: 'Includes Non-Veg Specials'
    }
  ],
  weeklyMenu: [
    {
      day: 'Monday',
      breakfast: 'Idli (4), Sambar, Chutney',
      lunch: 'White Rice, Sambar, Poriyal, Rasam, Curd, Pulikulambu',
      dinner: 'Chapathi + Kurma'
    },
    {
      day: 'Tuesday',
      breakfast: 'Dosa (3), Sambar, Chutney',
      lunch: 'Meals, Paneer / Mushroom Pulav',
      dinner: 'Paniyaram (12 pcs) + Chutney'
    },
    {
      day: 'Wednesday',
      breakfast: 'Poori (3), Kurma',
      lunch: 'Meals, Veg Biryani / Chicken Biryani + Raita',
      dinner: 'Idli (4) + Chutney + Sambar'
    },
    {
      day: 'Thursday',
      breakfast: 'Chapathi + Gravy',
      lunch: 'Rice, Sambar, Poriyal, Curd, Rasam',
      dinner: 'Variety Rice / Dosa'
    },
    {
      day: 'Friday',
      breakfast: 'Sevai (Tomato / Lemon / Pudina / Coconut)',
      lunch: 'Rice, Sambar, Poriyal, Rasam, Curd, Pulikulambu, Payasam',
      dinner: 'Palak Chapathi'
    },
    {
      day: 'Saturday',
      breakfast: 'Idli (4), Sambar, Chutney',
      lunch: 'Meals, 2 Variety Rice + Poriyal',
      dinner: 'Idiyappam + Kurma'
    },
    {
      day: 'Sunday',
      breakfast: 'Holiday',
      lunch: 'Holiday',
      dinner: 'Holiday',
      isHoliday: true
    }
  ] as DayMealMenu[],
  gallery: [
    {
      id: 'ext-main',
      title: 'Main Building & Entrance Gate',
      category: 'Exterior',
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.20.jpeg',
      featured: true
    },
    {
      id: 'rec-lounge',
      title: 'Reception & Waiting Lounge',
      category: 'Reception',
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.45.jpeg',
      featured: true
    },
    {
      id: 'room-double',
      title: 'Spacious 2-Sharing Bedroom',
      category: 'Rooms',
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.47.jpeg',
      featured: true
    },
    {
      id: 'room-multi',
      title: 'Comfortable Multi-Sharing Room',
      category: 'Rooms',
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.37.10.jpeg',
      featured: true
    },
    {
      id: 'room-single',
      title: 'Single Private Room with Study Desk',
      category: 'Rooms',
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.57.jpeg'
    },
    {
      id: 'room-bunk',
      title: 'Spacious Dormitory with Bunk Beds',
      category: 'Rooms',
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.37.12.jpeg'
    },
    {
      id: 'fac-laundry-1',
      title: 'In-House Laundry Facility',
      category: 'Facilities',
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.43.jpeg'
    },
    {
      id: 'fac-laundry-2',
      title: 'Automated Washing Machines',
      category: 'Facilities',
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.44.jpeg'
    },
    {
      id: 'int-corridor',
      title: 'Clean Granite Hallway & Corridors',
      category: 'Interiors',
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.37.13.jpeg'
    },
    {
      id: 'ext-elevation',
      title: 'Building Elevation & Frontage',
      category: 'Exterior',
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.37.jpeg'
    },
    {
      id: 'ext-entrance-gate',
      title: 'Front Entrance & Signboard',
      category: 'Exterior',
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.42.jpeg'
    },
    {
      id: 'surroundings-parking',
      title: 'Avenue Trees & Two-Wheeler Parking',
      category: 'Campus',
      url: '/sanjay%20mansion%20photos/WhatsApp%20Image%202026-09-23%20at%2013.36.35.jpeg'
    }
  ]
};
