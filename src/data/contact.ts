// Centralized contact configuration for Sanjay Properties & Sanjay Garden
export interface ContactConfig {
  companyName: string;
  projectName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  location: {
    locality: string;
    city: string;
    district: string;
    state: string;
    country: string;
    pincode: string;
    fullAddress: string;
    landmark: string;
  };
  surveyDetails: {
    historicalSurveyNumbers: string;
    layoutReference: string;
    corporationReference: string;
  };
}

export const CONTACT_CONFIG: ContactConfig = {
  companyName: 'SANJAY PROPERTIES',
  projectName: 'SANJAY GARDEN',
  tagline: 'A Better Address Begins With Better Planning',
  email: 'enquiries@sanjayproperties.in',
  phone: '+91 94430 00000', // Configurable client contact
  whatsappNumber: '919443000000',
  location: {
    locality: 'PNT Colony, Saravanampatti',
    city: 'Coimbatore',
    district: 'Coimbatore North',
    state: 'Tamil Nadu',
    country: 'India',
    pincode: '641035',
    fullAddress: 'Sanjay Garden, PNT Colony, Saravanampatti, Coimbatore, Tamil Nadu – 641035',
    landmark: 'Near Saravanampatti Tech Corridor'
  },
  surveyDetails: {
    historicalSurveyNumbers: 'S.F. No. 402/2pt, 402/3pt, 402/4pt',
    layoutReference: 'D.D.T.P / C.L.P.A No. 42/2008',
    corporationReference: 'Coimbatore Corporation Saravanampatti Record (Layout 42/2008)'
  }
};
