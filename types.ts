
export interface JobFormData {
  companyName: string;
  companyEmail: string;
  whatsapp: string;
  hiringPreference: string;
  // Hidden fields for the AI logic to still work if needed internally
  jobTitle?: string;
  category?: string;
  description?: string;
}

export const CATEGORIES = [
  'Software Development',
  'Marketing & Communications',
  'Design & Creative',
  'Data Science & Analytics',
  'Human Resources',
  'Business Development',
  'Finance & Accounting',
  'Other'
];

export const LOCATIONS = [
  'Remote',
  'Kuala Lumpur, Malaysia',
  'Singapore',
  'Jakarta, Indonesia',
  'Bangkok, Thailand',
  'Manila, Philippines',
  'Ho Chi Minh City, Vietnam'
];
