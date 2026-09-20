export type LeadSource = 'Sanjay Properties' | 'Sanjay Mansion';

export type LeadType =
  | 'General Enquiry'
  | 'Plot Dimensions & Availability'
  | 'Pricing & Commercial Terms'
  | 'Layout Ref: 42/2008 & Survey Documents'
  | 'Site Visit Request'
  | 'Mansion Room Booking'
  | 'Meal Plan Enquiry'
  | 'Direct Contact';

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'In Discussion'
  | 'Visit Scheduled'
  | 'Converted'
  | 'Lost';

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  author?: string;
}

export interface LeadDetails {
  message?: string;
  preferredDate?: string;
  timeSlot?: string;
  roomType?: string; // 'Single Room' | '2 Sharing' | '3 Sharing' | '4 Sharing'
  mealPlan?: string; // 'Veg Plan' | 'Non-Veg Plan' | 'No Meal'
  targetProperty?: string; // 'Sanjay Garden' | 'Western Stay – Sanjay Mansion'
  budget?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  type: LeadType | string;
  status: LeadStatus;
  details: LeadDetails;
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'sanjay_crm_leads_v1';
const UPDATE_EVENT = 'sanjay_leads_store_updated';

// Realistic sample seed leads to demonstrate immediate multi-source capability
const SAMPLE_LEADS: Lead[] = [
  {
    id: 'LD-1001',
    name: 'Karthik Subramanian',
    phone: '+91 98421 55678',
    email: 'karthik.subramanian@techmail.com',
    source: 'Sanjay Properties',
    type: 'Plot Dimensions & Availability',
    status: 'New',
    details: {
      message: 'Interested in a 1,500 sq.ft North-facing residential plot in Sanjay Garden. Need document copies.',
      targetProperty: 'Sanjay Garden, Saravanampatti',
      budget: '₹45L - ₹55L'
    },
    notes: [
      {
        id: 'n1',
        text: 'Lead submitted via Web Enquiry Desk. Customer works at Keeranatham IT corridor.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        author: 'System'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'LD-1002',
    name: 'Praveen Raj',
    phone: '+91 97890 12345',
    email: 'praveen.raj@kct.edu.in',
    source: 'Sanjay Mansion',
    type: 'Mansion Room Booking',
    status: 'Contacted',
    details: {
      message: 'Looking for a Single Room with attached bath and Veg Meal Plan starting from next month.',
      roomType: 'Single Room (Deluxe)',
      mealPlan: 'Veg Plan (Monthly)',
      targetProperty: 'Western Stay – Sanjay Mansion',
      preferredDate: '2026-10-01'
    },
    notes: [
      {
        id: 'n2',
        text: 'Spoke over phone. Sent room photos on WhatsApp. Customer will visit tomorrow morning.',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        author: 'Admin'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'LD-1003',
    name: 'Dr. Anandhakrishnan M.',
    phone: '+91 94432 89012',
    email: 'dr.anandhakrishnan@hospital.org',
    source: 'Sanjay Properties',
    type: 'Site Visit Request',
    status: 'Visit Scheduled',
    details: {
      message: 'Scheduled on-site visit to inspect survey stone boundary markers on Layout Ref 42/2008.',
      preferredDate: '2026-09-24',
      timeSlot: 'Morning (10:00 AM - 1:00 PM)',
      targetProperty: 'Sanjay Garden, Saravanampatti'
    },
    notes: [
      {
        id: 'n3',
        text: 'Visit confirmed. Executive assigned for on-site layout walkthrough.',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        author: 'Admin'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'LD-1004',
    name: 'Vigneshwaran G.',
    phone: '+91 99524 33211',
    email: 'vignesh.g@cognizant.com',
    source: 'Sanjay Mansion',
    type: 'Mansion Room Booking',
    status: 'In Discussion',
    details: {
      message: '2 Sharing room inquiry for 2 colleagues joining KCT Tech Park office.',
      roomType: '2 Sharing Room',
      mealPlan: 'Non-Veg Plan',
      targetProperty: 'Western Stay – Sanjay Mansion'
    },
    notes: [
      {
        id: 'n4',
        text: 'Shared tariff card and Wi-Fi / Laundry amenities list.',
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
        author: 'Admin'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'LD-1005',
    name: 'Suresh Kumar Velusamy',
    phone: '+91 98940 77123',
    email: 'suresh.velusamy@globalinvest.in',
    source: 'Sanjay Properties',
    type: 'Pricing & Commercial Terms',
    status: 'Converted',
    details: {
      message: 'Finalized Corner Plot. Advance documentation completed.',
      targetProperty: 'Sanjay Garden, Saravanampatti',
      budget: '₹62L'
    },
    notes: [
      {
        id: 'n5',
        text: 'Client paid token advance. Legal document verification completed successfully.',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        author: 'Admin'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

export const leadStore = {
  // Get all leads
  getLeads(): Lead[] {
    if (typeof window === 'undefined') return SAMPLE_LEADS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Seed initial sample leads
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_LEADS));
        return SAMPLE_LEADS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading leads from storage', e);
      return SAMPLE_LEADS;
    }
  },

  // Save new lead
  saveLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'notes'> & { notes?: LeadNote[] }): Lead {
    const leads = this.getLeads();
    const newId = `LD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newLead: Lead = {
      ...leadData,
      id: newId,
      notes: leadData.notes || [
        {
          id: `n-${Date.now()}`,
          text: `Lead captured from ${leadData.source} website.`,
          createdAt: now,
          author: 'System'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    const updatedLeads = [newLead, ...leads];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
        window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: newLead }));
      } catch (e) {
        console.error('Error saving lead', e);
      }
    }
    return newLead;
  },

  // Update an existing lead's status or details
  updateLead(id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt'>>): Lead | null {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const updatedLead: Lead = {
      ...leads[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    leads[index] = updatedLead;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
        window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: updatedLead }));
      } catch (e) {
        console.error('Error updating lead', e);
      }
    }
    return updatedLead;
  },

  // Add internal note to lead
  addNote(leadId: string, noteText: string, author = 'Admin'): Lead | null {
    const leads = this.getLeads();
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return null;

    const newNote: LeadNote = {
      id: `n-${Date.now()}`,
      text: noteText,
      createdAt: new Date().toISOString(),
      author
    };

    const updatedNotes = [newNote, ...(lead.notes || [])];
    return this.updateLead(leadId, { notes: updatedNotes });
  },

  // Delete lead
  deleteLead(id: string): boolean {
    const leads = this.getLeads();
    const filtered = leads.filter((l) => l.id !== id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
      } catch (e) {
        console.error('Error deleting lead', e);
      }
    }
    return true;
  },

  // Reset / Seed sample data
  resetSampleData(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_LEADS));
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
    }
  },

  // Clear all leads
  clearAllLeads(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
    }
  },

  // Export leads as CSV
  exportCSV(leadsToExport?: Lead[]): void {
    const leads = leadsToExport || this.getLeads();
    if (!leads.length) return;

    const headers = [
      'Lead ID',
      'Source',
      'Customer Name',
      'Phone Number',
      'Email',
      'Enquiry Type',
      'Status',
      'Target Property',
      'Preferred Date / Time',
      'Room Type',
      'Meal Plan',
      'Customer Message',
      'Created At'
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.source}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.type}"`,
      `"${l.status}"`,
      `"${l.details.targetProperty || ''}"`,
      `"${[l.details.preferredDate, l.details.timeSlot].filter(Boolean).join(' ') || ''}"`,
      `"${l.details.roomType || ''}"`,
      `"${l.details.mealPlan || ''}"`,
      `"${(l.details.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${new Date(l.createdAt).toLocaleString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Sanjay_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Subscribe to updates across components
  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => callback();
    window.addEventListener(UPDATE_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }
};
