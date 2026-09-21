import { getSupabaseClient } from '../lib/supabase';
import type {
  WesternStaySettingsRecord,
  WesternStayRoomTypeRecord,
  WesternStayRoomRecord,
  WesternStayOccupantRecord,
  WesternStayBookingRecord,
  WesternStayFacilityRecord,
  WesternStayMealPlanRecord,
  WesternStayMenuRecord,
  WesternStayImageRecord,
  WesternStayEnquiryRecord,
  PublicWesternStayData,
  WesternStayDashboardStats,
  RoomStatus,
  WesternStayEnquiryStatus,
  DayOfWeek
} from '../types/database';

// =============================================================================
// WESTERN STAY COMPLETE SAMPLE DATA
// =============================================================================

export const SAMPLE_SETTINGS: WesternStaySettingsRecord = {
  id: 'singleton',
  business_name: 'WESTERN STAY – SANJAY MANSION',
  tagline: 'Your Home Away From Home',
  description: 'Premier residential PG & hostel accommodation in Saravanampatti, Coimbatore, opposite KCT Tech Park with attached bathrooms, Wi-Fi, and homestyle food.',
  address_line1: 'No. 6, Sanjay Garden',
  address_line2: 'Opp. KCT Tech Park',
  area: 'Saravanampatti',
  city: 'Coimbatore',
  pincode: '641 035',
  full_address: 'No. 6, Sanjay Garden, Opp. KCT Tech Park, Saravanampatti, Coimbatore – 641 035',
  primary_phone: '8056889900',
  secondary_phone: '8110889900',
  whatsapp_number: '918056889900',
  email: 'enquiries@sanjayproperties.in',
  google_maps_url: 'https://maps.app.goo.gl/AJSivYbLohUfKxEA7',
  embed_map_url: 'https://maps.google.com/maps?q=11.0827,76.9942+(Western%20Stay%20-%20Sanjay%20Mansion)&t=&z=16&ie=UTF8&iwloc=&output=embed',
  hero_title: 'WESTERN STAY – SANJAY MANSION',
  hero_subtitle: 'Premium Gents & Executive Accommodation',
  hero_description: 'A peaceful, secure, and fully equipped stay in Saravanampatti. High-speed Wi-Fi, attached bathrooms, homestyle South Indian dining, and 24x7 security.',
  hero_image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
  seo_title: 'Western Stay – Sanjay Mansion | Hostel in Saravanampatti, Coimbatore',
  seo_description: 'Western Stay – Sanjay Mansion offers premium PG & hostel accommodation near KCT Tech Park, Saravanampatti, Coimbatore.',
  updated_at: new Date().toISOString()
};

export const SAMPLE_ROOM_TYPES: WesternStayRoomTypeRecord[] = [
  {
    id: 'rt-single-001',
    name: 'Single Occupancy',
    slug: 'single-occupancy',
    description: 'Private, quiet room ideal for working IT professionals and students wanting complete personal space and privacy.',
    max_occupants: 1,
    monthly_price: 8000,
    price_display: '₹8,000',
    weekly_price: '₹2,500',
    daily_price: '₹500',
    security_deposit: '₹10,000',
    ac_available: true,
    ac_surcharge: '₹1,500 / month',
    features: ['Private Attached Bathroom', 'Individual Study Desk & Chair', 'Large Wardrobe with Lock', 'High-Speed 60GB Wi-Fi', 'Balcony Access'],
    is_recommended: true,
    badge: 'Most Popular',
    display_order: 1,
    sort_order: 1,
    is_active: true,
    totalRooms: 4,
    availableRooms: 1,
    occupiedRooms: 3,
    isFull: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'rt-double-002',
    name: '2 Sharing',
    slug: '2-sharing',
    description: 'Spacious shared room with twin individual beds, separated study spaces, and individual steel cupboards.',
    max_occupants: 2,
    monthly_price: 6000,
    price_display: '₹6,000',
    weekly_price: '₹1,800',
    daily_price: '₹400',
    security_deposit: '₹8,000',
    ac_available: true,
    ac_surcharge: '₹1,000 / month',
    features: ['Twin Individual Beds', 'Attached Bathroom with Geyser', 'Separate Study Desks', 'High-Speed Wi-Fi', 'Dedicated Cupboards'],
    is_recommended: false,
    badge: 'Great Value',
    display_order: 2,
    sort_order: 2,
    is_active: true,
    totalRooms: 5,
    availableRooms: 2,
    occupiedRooms: 3,
    isFull: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'rt-four-003',
    name: '4 Sharing',
    slug: '4-sharing',
    description: 'Budget-friendly community sharing room with great ventilation, individual lockers, and attached washroom.',
    max_occupants: 4,
    monthly_price: 4900,
    price_display: '₹4,900',
    weekly_price: '₹1,400',
    daily_price: '₹300',
    security_deposit: '₹5,000',
    ac_available: false,
    features: ['Bunk / Twin Beds', 'Attached Restroom', 'Personal Steel Locker', 'High-Speed Wi-Fi', 'Daily Housekeeping'],
    is_recommended: false,
    badge: 'Budget Friendly',
    display_order: 3,
    sort_order: 3,
    is_active: true,
    totalRooms: 3,
    availableRooms: 1,
    occupiedRooms: 2,
    isFull: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const SAMPLE_ROOMS: WesternStayRoomRecord[] = [
  {
    id: 'room-101',
    room_number: '101',
    room_type_id: 'rt-single-001',
    room_type_name: 'Single Occupancy',
    floor: 'Ground Floor',
    monthly_price: 8000,
    status: 'OCCUPIED',
    notes: 'Facing east with quiet garden view',
    images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'],
    current_occupant_name: 'Rahul Sharma',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'room-102',
    room_number: '102',
    room_type_id: 'rt-double-002',
    room_type_name: '2 Sharing',
    floor: 'Ground Floor',
    monthly_price: 6000,
    status: 'AVAILABLE',
    notes: 'Ready for immediate check-in',
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'room-103',
    room_number: '103',
    room_type_id: 'rt-double-002',
    room_type_name: '2 Sharing',
    floor: 'Ground Floor',
    monthly_price: 6000,
    status: 'RESERVED',
    notes: 'Booking advance received from TCS employee',
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'room-201',
    room_number: '201',
    room_type_id: 'rt-single-001',
    room_type_name: 'Single Occupancy',
    floor: '1st Floor',
    monthly_price: 8000,
    status: 'OCCUPIED',
    notes: 'AC installed',
    images: ['https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80'],
    current_occupant_name: 'Karthik Raja',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'room-202',
    room_number: '202',
    room_type_id: 'rt-double-002',
    room_type_name: '2 Sharing',
    floor: '1st Floor',
    monthly_price: 6000,
    status: 'OCCUPIED',
    notes: 'Corner room with dual windows',
    images: [],
    current_occupant_name: 'Arun Prakash',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'room-203',
    room_number: '203',
    room_type_id: 'rt-four-003',
    room_type_name: '4 Sharing',
    floor: '1st Floor',
    monthly_price: 4900,
    status: 'AVAILABLE',
    notes: '2 beds currently free',
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'room-301',
    room_number: '301',
    room_type_id: 'rt-single-001',
    room_type_name: 'Single Occupancy',
    floor: '2nd Floor',
    monthly_price: 8000,
    status: 'OCCUPIED',
    notes: 'Terrace access room',
    images: [],
    current_occupant_name: 'Vignesh Kumar',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'room-302',
    room_number: '302',
    room_type_id: 'rt-double-002',
    room_type_name: '2 Sharing',
    floor: '2nd Floor',
    monthly_price: 6000,
    status: 'MAINTENANCE',
    notes: 'Routine wall painting & bathroom fitting maintenance',
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'room-303',
    room_number: '303',
    room_type_id: 'rt-four-003',
    room_type_name: '4 Sharing',
    floor: '2nd Floor',
    monthly_price: 4900,
    status: 'AVAILABLE',
    notes: 'Freshly sanitized and ready',
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'room-304',
    room_number: '304',
    room_type_id: 'rt-single-001',
    room_type_name: 'Single Occupancy',
    floor: '2nd Floor',
    monthly_price: 8000,
    status: 'OCCUPIED',
    notes: 'South facing, quiet corridor',
    images: [],
    current_occupant_name: 'Deepak Mohan',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'room-305',
    room_number: '305',
    room_type_id: 'rt-double-002',
    room_type_name: '2 Sharing',
    floor: '2nd Floor',
    monthly_price: 6000,
    status: 'OCCUPIED',
    notes: 'Attached balcony with green views',
    images: [],
    current_occupant_name: 'Siddharth V.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'room-306',
    room_number: '306',
    room_type_id: 'rt-four-003',
    room_type_name: '4 Sharing',
    floor: '2nd Floor',
    monthly_price: 4900,
    status: 'OCCUPIED',
    notes: 'Occupied by college engineering students',
    images: [],
    current_occupant_name: 'Praveen Chandran',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const SAMPLE_OCCUPANTS: WesternStayOccupantRecord[] = [
  {
    id: 'occ-001',
    room_id: 'room-101',
    room_number: '101',
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.s@cognizant.com',
    occupancy_type: 'Single Occupancy',
    check_in_date: '2026-01-15',
    expected_check_out_date: '2026-12-31',
    monthly_rent: 8000,
    security_deposit: 10000,
    id_proof_type: 'Aadhaar Card',
    id_proof_number: 'XXXX-XXXX-4512',
    notes: 'Paid via UPI on 1st of every month',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'occ-002',
    room_id: 'room-201',
    room_number: '201',
    name: 'Karthik Raja',
    phone: '9845671230',
    email: 'karthik.raja@zoho.com',
    occupancy_type: 'Single Occupancy',
    check_in_date: '2026-02-01',
    expected_check_out_date: '2026-10-31',
    monthly_rent: 8000,
    security_deposit: 10000,
    id_proof_type: 'PAN Card',
    id_proof_number: 'ABCDE1234F',
    notes: 'AC opt-in requested and active',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 45).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'occ-003',
    room_id: 'room-202',
    room_number: '202',
    name: 'Arun Prakash',
    phone: '9789012345',
    email: 'arun.prakash@tcs.com',
    occupancy_type: '2 Sharing',
    check_in_date: '2026-02-10',
    expected_check_out_date: '2026-08-31',
    monthly_rent: 6000,
    security_deposit: 8000,
    id_proof_type: 'Aadhaar Card',
    id_proof_number: 'XXXX-XXXX-8921',
    notes: 'Veg meal plan subscribed',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 35).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'occ-004',
    room_id: 'room-301',
    room_number: '301',
    name: 'Vignesh Kumar',
    phone: '9952433211',
    email: 'vignesh.k@bosch.com',
    occupancy_type: 'Single Occupancy',
    check_in_date: '2026-03-01',
    expected_check_out_date: '2027-02-28',
    monthly_rent: 8000,
    security_deposit: 10000,
    id_proof_type: 'Driving License',
    id_proof_number: 'TN-37-20210045',
    notes: 'Company relocation candidate',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 20).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'occ-005',
    room_id: 'room-304',
    room_number: '304',
    name: 'Deepak Mohan',
    phone: '9894012345',
    email: 'deepak.m@infosys.com',
    occupancy_type: 'Single Occupancy',
    check_in_date: '2026-03-05',
    expected_check_out_date: '2026-12-31',
    monthly_rent: 8000,
    security_deposit: 10000,
    id_proof_type: 'Aadhaar Card',
    id_proof_number: 'XXXX-XXXX-3341',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'occ-006',
    room_id: 'room-305',
    room_number: '305',
    name: 'Siddharth V.',
    phone: '9791234567',
    email: 'siddharth.v@hcl.com',
    occupancy_type: '2 Sharing',
    check_in_date: '2026-03-10',
    expected_check_out_date: '2026-09-30',
    monthly_rent: 6000,
    security_deposit: 8000,
    id_proof_type: 'Aadhaar Card',
    id_proof_number: 'XXXX-XXXX-9912',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'occ-007',
    room_id: 'room-306',
    room_number: '306',
    name: 'Praveen Chandran',
    phone: '9843210987',
    email: 'praveen.c@kct.ac.in',
    occupancy_type: '4 Sharing',
    check_in_date: '2026-03-12',
    expected_check_out_date: '2026-07-31',
    monthly_rent: 4900,
    security_deposit: 5000,
    id_proof_type: 'College ID',
    id_proof_number: 'KCT-MECH-2024-88',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const SAMPLE_FACILITIES: WesternStayFacilityRecord[] = [
  { id: 'wf-1', title: 'Free 60GB High-Speed Wi-Fi', description: 'Dedicated high-speed wireless connection on all floors with uninterruptible battery backup.', icon_name: 'wifi', sort_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'wf-2', title: '24×7 Solar & Geyser Hot Water', description: 'Solar water heating system backed by electric geysers for continuous, uninterrupted hot water.', icon_name: 'sun', sort_order: 2, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'wf-3', title: 'Attached Bathrooms', description: 'Spacious, sparkling clean attached western-style bathrooms in every individual room.', icon_name: 'sparkles', sort_order: 3, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'wf-4', title: 'RO Purified Drinking Water', description: 'Commercial multi-stage RO water purification plant with chilled and room-temperature dispensing on all floors.', icon_name: 'droplets', sort_order: 4, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'wf-5', title: 'Covered Bike Parking', description: 'Safe, covered basement and ground-level two-wheeler parking spaces inside the gated boundary.', icon_name: 'bike', sort_order: 5, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'wf-6', title: '24×7 CCTV Security Surveillance', description: 'Campus perimeter, hallway, staircase, and entrance monitoring with round-the-clock security staff.', icon_name: 'shield-check', sort_order: 6, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'wf-7', title: 'Quiet Study Hall', description: 'Dedicated air-conditioned study hall with charging sockets, reading lamps, and silent zone rules.', icon_name: 'book-open', sort_order: 7, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'wf-8', title: 'Laundry Facility Access', description: 'Automatic washing machines and dedicated covered rooftop clothes drying area.', icon_name: 'waves', sort_order: 8, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

export const SAMPLE_MEAL_PLANS: WesternStayMealPlanRecord[] = [
  { id: 'mp-1', frequency: 'Monthly (26 Days)', duration_days: '26 Days', price_approx: '₹3,500', daily_rate_approx: '₹135 / day', description: 'Complete monthly meal subscription covering hot breakfast, wholesome South Indian lunch, and healthy dinner.', sort_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'mp-2', frequency: 'Weekly Trial Plan', duration_days: '7 Days', price_approx: '₹1,000', daily_rate_approx: '₹142 / day', description: 'Flexible 7-day trial plan for new residents to experience our authentic homestyle cooking.', sort_order: 2, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'mp-3', frequency: 'Weekend Non-Veg Special Add-on', duration_days: 'Per Month', price_approx: '₹700', daily_rate_approx: 'Sunday Special', description: 'Special Chicken / Egg Biryani and Chettinad gravies served every Sunday afternoon.', sort_order: 3, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

export const SAMPLE_WEEKLY_MENU: WesternStayMenuRecord[] = [
  { id: 'm-mon', day_of_week: 'Monday', breakfast: 'Idli, Sambar, Coconut Chutney & Filter Coffee / Tea', lunch: 'South Indian Meals: Rice, Sambar, Poriyal, Rasam, Curd & Appalam', dinner: 'Soft Chapathi, Mixed Veg Kurma & Warm Milk', is_holiday: false, sort_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm-tue', day_of_week: 'Tuesday', breakfast: 'Ghee Ven Pongal, Medu Vada, Coconut Chutney & Sambar', lunch: 'Rice, Karakuzhambu, Kootu, Thuvaiyal, Buttermilk & Fryums', dinner: 'Phulka Roti, Dal Tadka, Aloo Gobi Subzi', is_holiday: false, sort_order: 2, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm-wed', day_of_week: 'Wednesday', breakfast: 'Poori with Potato Masala & Tomato Onion Chutney', lunch: 'South Indian Meals: Keerai Kootu, Vatha Kuzhambu, Rasam & Curd', dinner: 'Veg Fried Rice with Gobi Manchurian Gravy', is_holiday: false, sort_order: 3, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm-thu', day_of_week: 'Thursday', breakfast: 'Rava Kichadi / Upma, Peanut Chutney & Sambar', lunch: 'Variety Rice: Lemon Rice, Curd Rice with Potato Fry & Pickle', dinner: 'Malabar Parotta with Veg Salna', is_holiday: false, sort_order: 4, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm-fri', day_of_week: 'Friday', breakfast: 'Crispy Dosa with Tomato Chutney, Mint Chutney & Sambar', lunch: 'Traditional Friday Feast: Sambar, Mor Kuzhambu, Aviyal, Payasam', dinner: 'Idiyappam with Coconut Milk & Veg Kurma', is_holiday: false, sort_order: 5, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm-sat', day_of_week: 'Saturday', breakfast: 'Semiya Upma, Coconut Chutney & Sambar', lunch: 'Rice, Drumstick Sambar, Yam Roast, Tomato Rasam & Curd', dinner: 'Poori with Chana Masala', is_holiday: false, sort_order: 6, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm-sun', day_of_week: 'Sunday', breakfast: 'Masala Dosa with Sambar & Pudina Chutney', lunch: 'Special Sunday Feast: Paneer Butter Masala / Chicken Curry with Jeera Rice', dinner: 'Uttapam / Dosa with Onion Tomato Chutney', is_holiday: true, sort_order: 7, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

export const SAMPLE_GALLERY: WesternStayImageRecord[] = [
  { id: 'gal-1', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85', title: 'Main Hostel Elevation', category: 'Exterior', alt_text: 'Main Building Front View', sort_order: 1, is_featured: true, created_at: new Date().toISOString() },
  { id: 'gal-2', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85', title: 'Deluxe Single Study Room', category: 'Rooms', alt_text: 'Single Room with Study Table', sort_order: 2, is_featured: true, created_at: new Date().toISOString() },
  { id: 'gal-3', url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85', title: '2 Sharing Furnished Bedroom', category: 'Rooms', alt_text: '2 Sharing Room', sort_order: 3, is_featured: false, created_at: new Date().toISOString() },
  { id: 'gal-4', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85', title: 'Attached Western Bathroom', category: 'Facilities', alt_text: 'Clean Bathroom with Geyser', sort_order: 4, is_featured: false, created_at: new Date().toISOString() },
  { id: 'gal-5', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85', title: 'Clean & Hygienic Dining Hall', category: 'Dining', alt_text: 'Hostel Dining Hall', sort_order: 5, is_featured: false, created_at: new Date().toISOString() },
  { id: 'gal-6', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85', title: 'Quiet Reading & Study Lounge', category: 'Campus', alt_text: 'Study Zone', sort_order: 6, is_featured: false, created_at: new Date().toISOString() },
  { id: 'gal-7', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85', title: 'Covered Parking & Entrance', category: 'Facilities', alt_text: 'Parking Area', sort_order: 7, is_featured: false, created_at: new Date().toISOString() },
  { id: 'gal-8', url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85', title: 'Rooftop Open Terrace Garden', category: 'Campus', alt_text: 'Rooftop View', sort_order: 8, is_featured: false, created_at: new Date().toISOString() }
];

export const SAMPLE_ENQUIRIES: WesternStayEnquiryRecord[] = [
  { id: 'enq-101', name: 'Gokulnath Selvam', phone: '9840123890', email: 'gokul.s@kct.ac.in', room_type: 'Single Occupancy', preferred_date: '2026-04-01', message: 'Looking for a single room starting next month. Need AC and Wi-Fi.', status: 'NEW', notes: [{ id: 'n1', date: new Date().toISOString(), text: 'Received from website booking popup. Needs call back in evening.', author: 'System' }], created_at: new Date(Date.now() - 3600000 * 2).toISOString(), updated_at: new Date().toISOString() },
  { id: 'enq-102', name: 'Dinesh Kumar M.', phone: '9952098765', email: 'dinesh.km@zoho.com', room_type: '2 Sharing', preferred_date: '2026-03-25', message: 'Enquiring for myself and colleague joining KCT Tech Park office.', status: 'CONTACTED', notes: [{ id: 'n2', date: new Date().toISOString(), text: 'Spoke with candidate. Shared photos and room 102 availability.', author: 'Admin' }], created_at: new Date(Date.now() - 3600000 * 18).toISOString(), updated_at: new Date().toISOString() },
  { id: 'enq-103', name: 'Manikandan V.', phone: '9789123450', email: 'mani.v@gmail.com', room_type: '4 Sharing', preferred_date: '2026-04-05', message: 'Budget sharing room enquiry for 6 months internship period.', status: 'FOLLOW-UP', notes: [{ id: 'n3', date: new Date().toISOString(), text: 'Visiting property this Saturday at 11 AM.', author: 'Admin' }], created_at: new Date(Date.now() - 3600000 * 36).toISOString(), updated_at: new Date().toISOString() },
  { id: 'enq-104', name: 'Srinivasan K.', phone: '9894567891', email: 'srini.k@accenture.com', room_type: 'Single Occupancy', preferred_date: '2026-03-20', message: 'Confirmed single occupancy. Need early check-in.', status: 'BOOKED', notes: [{ id: 'n4', date: new Date().toISOString(), text: 'Advance of ₹2,000 received via GPay. Room 103 reserved.', author: 'Admin' }], created_at: new Date(Date.now() - 3600000 * 72).toISOString(), updated_at: new Date().toISOString() },
  { id: 'enq-105', name: 'Naveen Prasath', phone: '9790812345', email: 'naveen.p@kct.ac.in', room_type: '2 Sharing', preferred_date: '2026-05-01', message: 'Enquiring for upcoming college semester hostel admission.', status: 'NEW', notes: [], created_at: new Date(Date.now() - 3600000 * 96).toISOString(), updated_at: new Date().toISOString() }
];

export const SAMPLE_BOOKINGS: WesternStayBookingRecord[] = [
  { id: 'b-001', room_id: 'room-103', room_type_id: 'rt-double-002', occupant_name: 'Srinivasan K.', phone: '9894567891', email: 'srini.k@accenture.com', check_in_date: '2026-03-25', advance_amount: 2000, status: 'confirmed', notes: 'GPay token paid', created_at: new Date().toISOString() },
  { id: 'b-002', room_id: 'room-101', room_type_id: 'rt-single-001', occupant_name: 'Rahul Sharma', phone: '9876543210', email: 'rahul.s@cognizant.com', check_in_date: '2026-01-15', advance_amount: 5000, status: 'active', notes: 'Active occupant', created_at: new Date().toISOString() }
];

// In-memory fallback caches
let localRooms = [...SAMPLE_ROOMS];
let localRoomTypes = [...SAMPLE_ROOM_TYPES];
let localOccupants = [...SAMPLE_OCCUPANTS];
let localFacilities = [...SAMPLE_FACILITIES];
let localMealPlans = [...SAMPLE_MEAL_PLANS];
let localWeeklyMenu = [...SAMPLE_WEEKLY_MENU];
let localGallery = [...SAMPLE_GALLERY];
let localEnquiries = [...SAMPLE_ENQUIRIES];
let localSettings = { ...SAMPLE_SETTINGS };

export const westernStayService = {
  // ===========================================================================
  // PUBLIC AGGREGATE VIEW
  // ===========================================================================

  getPublicWesternStayDataSync(): PublicWesternStayData {
    return {
      settings: localSettings,
      roomTypes: localRoomTypes,
      facilities: localFacilities,
      mealPlans: localMealPlans,
      weeklyMenu: localWeeklyMenu,
      gallery: localGallery,
      availabilitySummary: {
        totalRooms: localRooms.length,
        availableRooms: localRooms.filter((r) => r.status === 'AVAILABLE').length,
        occupiedRooms: localRooms.filter((r) => r.status === 'OCCUPIED').length,
        reservedRooms: localRooms.filter((r) => r.status === 'RESERVED').length,
        maintenanceRooms: localRooms.filter((r) => r.status === 'MAINTENANCE').length,
        byType: {
          'rt-single-001': { name: 'Single Occupancy', available: 1, total: 4, isFull: false },
          'rt-double-002': { name: '2 Sharing', available: 2, total: 5, isFull: false },
          'rt-four-003': { name: '4 Sharing', available: 1, total: 3, isFull: false }
        }
      },
      property: {
        name: localSettings.business_name,
        short_name: 'Sanjay Mansion',
        tagline: localSettings.tagline,
        description: localSettings.description,
        address_line1: localSettings.address_line1,
        address_line2: localSettings.address_line2,
        area: localSettings.area,
        city: localSettings.city,
        pincode: localSettings.pincode,
        full_address: localSettings.full_address,
        primary_phone: localSettings.primary_phone,
        secondary_phone: localSettings.secondary_phone,
        whatsapp_number: localSettings.whatsapp_number,
        email: localSettings.email,
        google_maps_url: localSettings.google_maps_url,
        embed_map_url: localSettings.embed_map_url,
        hero_title: localSettings.hero_title,
        hero_subtitle: localSettings.hero_subtitle,
        hero_description: localSettings.hero_description,
        hero_image_url: localSettings.hero_image_url,
        pricing_start: '₹4,900',
        status: 'active',
        is_featured_homepage: true,
        seo_title: localSettings.seo_title,
        seo_description: localSettings.seo_description
      },
      accommodations: localRoomTypes,
      mealSubscriptionRates: [
        { plan_type: 'VEG', duration: 'Monthly', rate: 3500, price_display: '₹3,500', monthly_price: '₹3,500', weekly_price: '₹1,000' },
        { plan_type: 'NON-VEG', duration: 'Monthly', rate: 4200, price_display: '₹4,200', monthly_price: '₹4,200', weekly_price: '₹1,200' }
      ],
      images: localGallery.map((img) => ({
        id: img.id,
        url: img.url,
        title: img.title,
        alt_text: img.alt_text,
        category: img.category
      }))
    };
  },

  async getPublicWesternStayData(): Promise<PublicWesternStayData> {
    const client = getSupabaseClient();
    if (!client) {
      return this.getPublicWesternStayDataSync();
    }

    try {
      const [
        { data: settingsData },
        { data: roomTypesData },
        { data: roomsData },
        { data: facilitiesData },
        { data: mealPlansData },
        { data: menuData },
        { data: galleryData }
      ] = await Promise.all([
        client.from('western_stay_settings').select('*').maybeSingle(),
        client.from('western_stay_room_types').select('*').order('display_order', { ascending: true }),
        client.from('western_stay_rooms').select('*'),
        client.from('western_stay_facilities').select('*').order('sort_order', { ascending: true }),
        client.from('western_stay_meal_plans').select('*').order('sort_order', { ascending: true }),
        client.from('western_stay_menu').select('*').order('sort_order', { ascending: true }),
        client.from('western_stay_images').select('*').order('sort_order', { ascending: true })
      ]);

      const settings = (settingsData as WesternStaySettingsRecord) || localSettings;
      const roomTypes = (roomTypesData && roomTypesData.length > 0 ? roomTypesData : localRoomTypes) as WesternStayRoomTypeRecord[];
      const rooms = (roomsData && roomsData.length > 0 ? roomsData : localRooms) as WesternStayRoomRecord[];

      let totalRooms = rooms.length;
      let availableRooms = 0;
      let occupiedRooms = 0;
      let reservedRooms = 0;
      let maintenanceRooms = 0;

      const byType: Record<string, { name: string; available: number; total: number; isFull: boolean }> = {};
      for (const rt of roomTypes) {
        byType[rt.id] = { name: rt.name, available: 0, total: 0, isFull: false };
      }

      for (const room of rooms) {
        if (byType[room.room_type_id]) {
          byType[room.room_type_id].total++;
        }
        if (room.status === 'AVAILABLE') {
          availableRooms++;
          if (byType[room.room_type_id]) byType[room.room_type_id].available++;
        } else if (room.status === 'OCCUPIED') occupiedRooms++;
        else if (room.status === 'RESERVED') reservedRooms++;
        else if (room.status === 'MAINTENANCE') maintenanceRooms++;
      }

      const roomTypesWithAvailability = roomTypes.map((rt) => {
        const stats = byType[rt.id] || { available: 0, total: 0 };
        return {
          ...rt,
          totalRooms: stats.total,
          availableRooms: stats.available,
          occupiedRooms: stats.total - stats.available,
          isFull: stats.total > 0 && stats.available === 0
        };
      });

      const propertyObj = {
        name: settings.business_name || 'Western Stay – Sanjay Mansion',
        short_name: 'Sanjay Mansion',
        tagline: settings.tagline,
        description: settings.description,
        address_line1: settings.address_line1,
        address_line2: settings.address_line2,
        area: settings.area,
        city: settings.city,
        pincode: settings.pincode,
        full_address: settings.full_address,
        primary_phone: settings.primary_phone,
        secondary_phone: settings.secondary_phone,
        whatsapp_number: settings.whatsapp_number,
        email: settings.email,
        google_maps_url: settings.google_maps_url,
        embed_map_url: settings.embed_map_url,
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        hero_description: settings.hero_description,
        hero_image_url: settings.hero_image_url,
        pricing_start: '₹4,900',
        status: 'active',
        is_featured_homepage: true,
        seo_title: settings.seo_title,
        seo_description: settings.seo_description
      };

      const galleryList = (galleryData && galleryData.length > 0 ? galleryData : localGallery) as WesternStayImageRecord[];

      return {
        settings,
        roomTypes: roomTypesWithAvailability,
        facilities: (facilitiesData && facilitiesData.length > 0 ? facilitiesData : localFacilities) as WesternStayFacilityRecord[],
        mealPlans: (mealPlansData && mealPlansData.length > 0 ? mealPlansData : localMealPlans) as WesternStayMealPlanRecord[],
        weeklyMenu: (menuData && menuData.length > 0 ? menuData : localWeeklyMenu) as WesternStayMenuRecord[],
        gallery: galleryList,
        availabilitySummary: {
          totalRooms,
          availableRooms,
          occupiedRooms,
          reservedRooms,
          maintenanceRooms,
          byType
        },
        property: propertyObj,
        accommodations: roomTypesWithAvailability,
        mealSubscriptionRates: [
          { plan_type: 'VEG' as const, duration: 'Monthly', rate: 3500, price_display: '₹3,500', monthly_price: '₹3,500', weekly_price: '₹1,000' },
          { plan_type: 'NON-VEG' as const, duration: 'Monthly', rate: 4200, price_display: '₹4,200', monthly_price: '₹4,200', weekly_price: '₹1,200' }
        ],
        images: galleryList.map((img) => ({
          id: img.id,
          url: img.url,
          title: img.title,
          alt_text: img.alt_text,
          category: img.category
        }))
      };
    } catch (err) {
      console.error('Error in getPublicWesternStayData:', err);
      return this.getPublicWesternStayDataSync();
    }
  },

  // ===========================================================================
  // OPERATIONAL KPIS & DASHBOARD
  // ===========================================================================

  async getDashboardStats(): Promise<WesternStayDashboardStats> {
    const defaultStats: WesternStayDashboardStats = {
      totalRooms: localRooms.length,
      availableRooms: localRooms.filter((r) => r.status === 'AVAILABLE').length,
      occupiedRooms: localRooms.filter((r) => r.status === 'OCCUPIED').length,
      reservedRooms: localRooms.filter((r) => r.status === 'RESERVED').length,
      maintenanceRooms: localRooms.filter((r) => r.status === 'MAINTENANCE').length,
      currentMonthlyRevenue: localOccupants.reduce((sum, o) => sum + (o.monthly_rent || 0), 0),
      pendingEnquiries: localEnquiries.filter((e) => e.status === 'NEW').length,
      totalActiveBookings: 2,
      occupancyRate: Math.round((localRooms.filter((r) => r.status === 'OCCUPIED').length / localRooms.length) * 100)
    };

    const client = getSupabaseClient();
    if (!client) return defaultStats;

    try {
      const [{ data: rooms }, { data: occupants }, { data: enquiries }, { data: bookings }] = await Promise.all([
        client.from('western_stay_rooms').select('id, status, monthly_price'),
        client.from('western_stay_occupants').select('monthly_rent, is_active').eq('is_active', true),
        client.from('western_stay_enquiries').select('id').eq('status', 'NEW'),
        client.from('western_stay_bookings').select('id').eq('status', 'confirmed')
      ]);

      const roomList = (rooms && rooms.length > 0 ? rooms : localRooms);
      const totalRooms = roomList.length;
      let availableRooms = 0;
      let occupiedRooms = 0;
      let reservedRooms = 0;
      let maintenanceRooms = 0;

      for (const r of roomList) {
        if (r.status === 'AVAILABLE') availableRooms++;
        else if (r.status === 'OCCUPIED') occupiedRooms++;
        else if (r.status === 'RESERVED') reservedRooms++;
        else if (r.status === 'MAINTENANCE') maintenanceRooms++;
      }

      const activeOccupants = (occupants && occupants.length > 0 ? occupants : localOccupants);
      const currentMonthlyRevenue = activeOccupants.reduce((sum: number, occ: any) => sum + (Number(occ.monthly_rent) || 0), 0);
      const pendingEnquiries = enquiries ? enquiries.length : defaultStats.pendingEnquiries;
      const totalActiveBookings = bookings ? bookings.length : defaultStats.totalActiveBookings;
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

      return {
        totalRooms,
        availableRooms,
        occupiedRooms,
        reservedRooms,
        maintenanceRooms,
        currentMonthlyRevenue,
        pendingEnquiries,
        totalActiveBookings,
        occupancyRate
      };
    } catch (err) {
      console.error('Error in getDashboardStats:', err);
      return defaultStats;
    }
  },

  // ===========================================================================
  // ROOM INVENTORY MANAGEMENT
  // ===========================================================================

  async getRooms(): Promise<WesternStayRoomRecord[]> {
    const client = getSupabaseClient();
    if (!client) return localRooms;

    try {
      const { data, error } = await client
        .from('western_stay_rooms')
        .select(`*, western_stay_room_types:room_type_id (name)`)
        .order('room_number', { ascending: true });

      if (error || !data || data.length === 0) return localRooms;

      return data.map((row: any) => ({
        ...row,
        room_type_name: row.western_stay_room_types?.name || 'Standard Room',
        monthly_price: Number(row.monthly_price)
      }));
    } catch {
      return localRooms;
    }
  },

  async updateRoomStatus(roomId: string, status: RoomStatus): Promise<boolean> {
    localRooms = localRooms.map((r) => (r.id === roomId ? { ...r, status, updated_at: new Date().toISOString() } : r));

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client
      .from('western_stay_rooms')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', roomId);

    return !error;
  },

  async updateRoom(roomId: string, updates: Partial<WesternStayRoomRecord>): Promise<boolean> {
    localRooms = localRooms.map((r) => (r.id === roomId ? { ...r, ...updates, updated_at: new Date().toISOString() } : r));

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client
      .from('western_stay_rooms')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', roomId);

    return !error;
  },

  async createRoom(room: {
    room_number: string;
    room_type_id: string;
    floor: string;
    monthly_price: number;
    status: RoomStatus;
    notes?: string;
  }): Promise<WesternStayRoomRecord | null> {
    const matchedType = localRoomTypes.find((rt) => rt.id === room.room_type_id);
    const newRoom: WesternStayRoomRecord = {
      id: 'room-' + Date.now(),
      room_number: room.room_number,
      room_type_id: room.room_type_id,
      room_type_name: matchedType?.name || 'Room',
      floor: room.floor,
      monthly_price: room.monthly_price,
      status: room.status,
      notes: room.notes || null,
      images: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localRooms = [...localRooms, newRoom];

    const client = getSupabaseClient();
    if (!client) return newRoom;

    try {
      const { data, error } = await client.from('western_stay_rooms').insert(room).select().single();
      if (error || !data) return newRoom;
      return data;
    } catch {
      return newRoom;
    }
  },

  async deleteRoom(roomId: string): Promise<boolean> {
    localRooms = localRooms.filter((r) => r.id !== roomId);

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client.from('western_stay_rooms').delete().eq('id', roomId);
    return !error;
  },

  // ===========================================================================
  // ROOM TYPES (TARIFFS & SPECS)
  // ===========================================================================

  async getRoomTypes(): Promise<WesternStayRoomTypeRecord[]> {
    const client = getSupabaseClient();
    if (!client) return localRoomTypes;

    try {
      const { data, error } = await client
        .from('western_stay_room_types')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) return localRoomTypes;
      return data.map((d: any) => ({
        ...d,
        monthly_price: Number(d.monthly_price)
      }));
    } catch {
      return localRoomTypes;
    }
  },

  async updateRoomType(id: string, updates: Partial<WesternStayRoomTypeRecord>): Promise<boolean> {
    localRoomTypes = localRoomTypes.map((rt) => (rt.id === id ? { ...rt, ...updates, updated_at: new Date().toISOString() } : rt));

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client
      .from('western_stay_room_types')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  },

  // ===========================================================================
  // OCCUPANTS & BOOKINGS
  // ===========================================================================

  async getOccupants(): Promise<WesternStayOccupantRecord[]> {
    const client = getSupabaseClient();
    if (!client) return localOccupants;

    try {
      const { data, error } = await client
        .from('western_stay_occupants')
        .select(`*, western_stay_rooms:room_id (room_number)`)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return localOccupants;
      return data.map((d: any) => ({
        ...d,
        room_number: d.western_stay_rooms?.room_number || 'Not Assigned',
        monthly_rent: Number(d.monthly_rent),
        security_deposit: Number(d.security_deposit)
      }));
    } catch {
      return localOccupants;
    }
  },

  async createOccupant(occ: {
    room_id?: string;
    name: string;
    phone: string;
    email?: string;
    occupancy_type: string;
    check_in_date: string;
    expected_check_out_date?: string;
    monthly_rent: number;
    security_deposit?: number;
    notes?: string;
  }): Promise<boolean> {
    const matchedRoom = localRooms.find((r) => r.id === occ.room_id);
    const newOccupant: WesternStayOccupantRecord = {
      id: 'occ-' + Date.now(),
      room_id: occ.room_id || null,
      room_number: matchedRoom?.room_number || null,
      name: occ.name,
      phone: occ.phone,
      email: occ.email || null,
      occupancy_type: occ.occupancy_type,
      check_in_date: occ.check_in_date,
      expected_check_out_date: occ.expected_check_out_date || null,
      monthly_rent: occ.monthly_rent,
      security_deposit: occ.security_deposit || 0,
      notes: occ.notes || null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localOccupants = [newOccupant, ...localOccupants];
    if (occ.room_id) {
      localRooms = localRooms.map((r) => (r.id === occ.room_id ? { ...r, status: 'OCCUPIED' as RoomStatus, current_occupant_name: occ.name } : r));
    }

    const client = getSupabaseClient();
    if (!client) return true;

    try {
      const { error } = await client.from('western_stay_occupants').insert(occ);
      if (!error && occ.room_id) {
        await client.from('western_stay_rooms').update({ status: 'OCCUPIED' }).eq('id', occ.room_id);
      }
      return !error;
    } catch {
      return true;
    }
  },

  async updateOccupant(id: string, updates: Partial<WesternStayOccupantRecord>): Promise<boolean> {
    localOccupants = localOccupants.map((o) => (o.id === id ? { ...o, ...updates, updated_at: new Date().toISOString() } : o));

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client
      .from('western_stay_occupants')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  },

  async deleteOccupant(id: string): Promise<boolean> {
    localOccupants = localOccupants.filter((o) => o.id !== id);

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client.from('western_stay_occupants').delete().eq('id', id);
    return !error;
  },

  async getBookings(): Promise<WesternStayBookingRecord[]> {
    const client = getSupabaseClient();
    if (!client) return SAMPLE_BOOKINGS;

    try {
      const { data, error } = await client.from('western_stay_bookings').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) return SAMPLE_BOOKINGS;
      return data;
    } catch {
      return SAMPLE_BOOKINGS;
    }
  },

  // ===========================================================================
  // FACILITIES, MEALS & MENU
  // ===========================================================================

  async getFacilities(): Promise<WesternStayFacilityRecord[]> {
    const client = getSupabaseClient();
    if (!client) return localFacilities;

    try {
      const { data, error } = await client
        .from('western_stay_facilities')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) return localFacilities;
      return data;
    } catch {
      return localFacilities;
    }
  },

  async updateFacility(id: string, updates: Partial<WesternStayFacilityRecord>): Promise<boolean> {
    localFacilities = localFacilities.map((f) => (f.id === id ? { ...f, ...updates, updated_at: new Date().toISOString() } : f));

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client
      .from('western_stay_facilities')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  },

  async createFacility(facility: { title: string; description?: string; icon_name: string; sort_order?: number }): Promise<boolean> {
    const newFac: WesternStayFacilityRecord = {
      id: 'wf-' + Date.now(),
      title: facility.title,
      description: facility.description || null,
      icon_name: facility.icon_name,
      sort_order: facility.sort_order || localFacilities.length + 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localFacilities = [...localFacilities, newFac];

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client.from('western_stay_facilities').insert(facility);
    return !error;
  },

  async deleteFacility(id: string): Promise<boolean> {
    localFacilities = localFacilities.filter((f) => f.id !== id);

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client.from('western_stay_facilities').delete().eq('id', id);
    return !error;
  },

  async getMealPlans(): Promise<WesternStayMealPlanRecord[]> {
    const client = getSupabaseClient();
    if (!client) return localMealPlans;

    try {
      const { data, error } = await client
        .from('western_stay_meal_plans')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) return localMealPlans;
      return data;
    } catch {
      return localMealPlans;
    }
  },

  async updateMealPlan(id: string, updates: Partial<WesternStayMealPlanRecord>): Promise<boolean> {
    localMealPlans = localMealPlans.map((mp) => (mp.id === id ? { ...mp, ...updates, updated_at: new Date().toISOString() } : mp));

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client
      .from('western_stay_meal_plans')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  },

  async createMealPlan(plan: { frequency: string; duration_days: string; price_approx: string; daily_rate_approx?: string; description?: string }): Promise<boolean> {
    const newPlan: WesternStayMealPlanRecord = {
      id: 'mp-' + Date.now(),
      frequency: plan.frequency,
      duration_days: plan.duration_days,
      price_approx: plan.price_approx,
      daily_rate_approx: plan.daily_rate_approx || null,
      description: plan.description || null,
      sort_order: localMealPlans.length + 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localMealPlans = [...localMealPlans, newPlan];

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client.from('western_stay_meal_plans').insert(plan);
    return !error;
  },

  async deleteMealPlan(id: string): Promise<boolean> {
    localMealPlans = localMealPlans.filter((mp) => mp.id !== id);

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client.from('western_stay_meal_plans').delete().eq('id', id);
    return !error;
  },

  async getWeeklyMenu(): Promise<WesternStayMenuRecord[]> {
    const client = getSupabaseClient();
    if (!client) return localWeeklyMenu;

    try {
      const { data, error } = await client.from('western_stay_menu').select('*').order('sort_order', { ascending: true });
      if (error || !data || data.length === 0) return localWeeklyMenu;
      return data;
    } catch {
      return localWeeklyMenu;
    }
  },

  async updateMenuDay(id: string, updates: Partial<WesternStayMenuRecord>): Promise<boolean> {
    localWeeklyMenu = localWeeklyMenu.map((m) => (m.id === id ? { ...m, ...updates, updated_at: new Date().toISOString() } : m));

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client
      .from('western_stay_menu')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  },

  // ===========================================================================
  // GALLERY
  // ===========================================================================

  async getGallery(): Promise<WesternStayImageRecord[]> {
    const client = getSupabaseClient();
    if (!client) return localGallery;

    try {
      const { data, error } = await client.from('western_stay_images').select('*').order('sort_order', { ascending: true });
      if (error || !data || data.length === 0) return localGallery;
      return data;
    } catch {
      return localGallery;
    }
  },

  async uploadGalleryImage(image: { url: string; title: string; category?: string; sort_order?: number }): Promise<boolean> {
    const newImage: WesternStayImageRecord = {
      id: 'gal-' + Date.now(),
      url: image.url,
      title: image.title,
      category: (image.category as any) || 'Exterior',
      alt_text: image.title,
      sort_order: image.sort_order || localGallery.length + 1,
      is_featured: false,
      created_at: new Date().toISOString()
    };

    localGallery = [...localGallery, newImage];

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client.from('western_stay_images').insert(image);
    return !error;
  },

  async deleteGalleryImage(id: string): Promise<boolean> {
    localGallery = localGallery.filter((g) => g.id !== id);

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client.from('western_stay_images').delete().eq('id', id);
    return !error;
  },

  // ===========================================================================
  // ENQUIRIES CRM
  // ===========================================================================

  async getEnquiries(): Promise<WesternStayEnquiryRecord[]> {
    const client = getSupabaseClient();
    if (!client) return localEnquiries;

    try {
      const { data, error } = await client
        .from('western_stay_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return localEnquiries;
      return data;
    } catch {
      return localEnquiries;
    }
  },

  async submitEnquiry(enquiry: {
    name: string;
    phone: string;
    email?: string;
    room_type: string;
    preferred_date?: string;
    message?: string;
  }): Promise<boolean> {
    const newEnq: WesternStayEnquiryRecord = {
      id: 'enq-' + Date.now(),
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email || null,
      room_type: enquiry.room_type,
      preferred_date: enquiry.preferred_date || null,
      message: enquiry.message || null,
      status: 'NEW',
      notes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localEnquiries = [newEnq, ...localEnquiries];

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client.from('western_stay_enquiries').insert({
      ...enquiry,
      status: 'NEW'
    });

    return !error;
  },

  async updateEnquiryStatus(id: string, status: WesternStayEnquiryStatus): Promise<boolean> {
    localEnquiries = localEnquiries.map((e) => (e.id === id ? { ...e, status, updated_at: new Date().toISOString() } : e));

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client
      .from('western_stay_enquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  },

  // ===========================================================================
  // SETTINGS
  // ===========================================================================

  async getSettings(): Promise<WesternStaySettingsRecord> {
    const client = getSupabaseClient();
    if (!client) return localSettings;

    try {
      const { data, error } = await client.from('western_stay_settings').select('*').maybeSingle();
      if (error || !data) return localSettings;
      return data;
    } catch {
      return localSettings;
    }
  },

  async updateSettings(updates: Partial<WesternStaySettingsRecord>): Promise<boolean> {
    localSettings = { ...localSettings, ...updates, updated_at: new Date().toISOString() };

    const client = getSupabaseClient();
    if (!client) return true;

    const { error } = await client
      .from('western_stay_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', 'singleton');

    return !error;
  }
};
