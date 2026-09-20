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
      id: 'single',
      name: 'Single Occupancy',
      badge: 'Private & Quiet',
      priceMonthly: '₹8,000',
      priceNote: 'per month',
      features: [
        'Dedicated Private Room',
        'Individual Cot & Mattress',
        'Attached Private Bathroom',
        'Study Table & Chair',
        'Secure Cupboard Storage',
        'Free 60GB High-Speed Wi-Fi',
        'Solar Hot Water Facility'
      ]
    },
    {
      id: 'double',
      name: '2 Sharing',
      badge: 'Most Popular',
      recommended: true,
      priceMonthly: '₹5,900',
      priceNote: 'per person / month',
      features: [
        'Spacious Dual Room',
        'Two Individual Cots & Mattresses',
        'Attached Private Bathroom',
        'Dual Study Desks',
        'Individual Lockable Cupboards',
        'Free 60GB High-Speed Wi-Fi',
        'Solar Hot Water Facility'
      ]
    },
    {
      id: 'quad',
      name: '4 Sharing',
      badge: 'Best Value',
      priceMonthly: '₹4,900',
      priceNote: 'per person / month',
      features: [
        'Well-Ventilated Quad Room',
        'Four Individual Cots & Mattresses',
        'Attached Private Bathroom',
        'Individual Secure Storage',
        'Free 60GB High-Speed Wi-Fi',
        'Solar Hot Water Facility',
        'Laundry & Parking Access'
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
      monthly: '₹3,600',
      weekly: '₹900',
      tag: 'Pure Vegetarian'
    },
    {
      type: 'NON-VEG',
      monthly: '₹3,800',
      weekly: '₹950',
      tag: 'Veg + Non-Veg Specials'
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
      title: 'Main Building Elevation',
      category: 'Exterior',
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
      featured: true
    },
    {
      id: 'ext-angle',
      title: 'Facade & Covered Parking',
      category: 'Exterior',
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'room-bed',
      title: 'Comfortable Individual Room',
      category: 'Rooms',
      url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'study-desk',
      title: 'Dedicated Study & Work Desk',
      category: 'Interiors',
      url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'green-surroundings',
      title: 'Peaceful Natural Surroundings',
      category: 'Campus',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'bath-interior',
      title: 'Attached Clean Bathroom',
      category: 'Facilities',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85'
    }
  ]
};
