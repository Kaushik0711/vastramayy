/**
 * Indian Address Validation Rules & Helpers
 * Tailored for Indian e-commerce standards (PIN code, 10-digit mobile, States & UTs)
 */

export const INDIAN_STATES_AND_UTS = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;

export interface AddressFormData {
  fullName: string;
  phone: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: 'home' | 'office' | 'other';
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface AddressValidationErrors {
  fullName?: string;
  phone?: string;
  streetLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

/**
 * Validate standard Indian 6-digit postal PIN code
 * Format: 6 digits, first digit cannot be 0
 */
export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

/**
 * Validate Indian mobile numbers
 * Supports 10 digits starting with 6-9, optionally prefixed with +91 or 0
 */
export function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
}

/**
 * Estimate city and state based on Indian PIN code prefix (Simulation)
 */
export function lookupPincode(pincode: string): { city: string; state: string } | null {
  if (!isValidPincode(pincode)) return null;

  const prefix = pincode.substring(0, 3);
  const prefix2 = pincode.substring(0, 2);

  if (prefix.startsWith('11')) return { city: 'New Delhi', state: 'Delhi' };
  if (prefix.startsWith('40')) return { city: 'Mumbai', state: 'Maharashtra' };
  if (prefix.startsWith('41')) return { city: 'Pune', state: 'Maharashtra' };
  if (prefix.startsWith('56')) return { city: 'Bengaluru', state: 'Karnataka' };
  if (prefix.startsWith('60')) return { city: 'Chennai', state: 'Tamil Nadu' };
  if (prefix.startsWith('70')) return { city: 'Kolkata', state: 'West Bengal' };
  if (prefix.startsWith('50')) return { city: 'Hyderabad', state: 'Telangana' };
  if (prefix.startsWith('30')) return { city: 'Jaipur', state: 'Rajasthan' };
  if (prefix.startsWith('38')) return { city: 'Ahmedabad', state: 'Gujarat' };
  if (prefix.startsWith('22')) return { city: 'Varanasi', state: 'Uttar Pradesh' };
  if (prefix.startsWith('20')) return { city: 'Noida', state: 'Uttar Pradesh' };
  if (prefix.startsWith('16')) return { city: 'Chandigarh', state: 'Punjab' };
  if (prefix.startsWith('68')) return { city: 'Kochi', state: 'Kerala' };

  // Fallbacks by 2-digit zone
  switch (prefix2) {
    case '11':
      return { city: 'Delhi', state: 'Delhi' };
    case '12':
    case '13':
      return { city: 'Gurugram', state: 'Haryana' };
    case '14':
    case '15':
      return { city: 'Amritsar', state: 'Punjab' };
    case '16':
      return { city: 'Chandigarh', state: 'Chandigarh' };
    case '20':
    case '21':
    case '22':
    case '23':
      return { city: 'Lucknow', state: 'Uttar Pradesh' };
    case '30':
    case '31':
    case '32':
    case '33':
      return { city: 'Udaipur', state: 'Rajasthan' };
    case '36':
    case '37':
    case '38':
    case '39':
      return { city: 'Surat', state: 'Gujarat' };
    case '40':
    case '41':
    case '42':
    case '43':
    case '44':
      return { city: 'Mumbai', state: 'Maharashtra' };
    case '50':
    case '51':
    case '52':
    case '53':
      return { city: 'Hyderabad', state: 'Telangana' };
    case '56':
    case '57':
    case '58':
    case '59':
      return { city: 'Bengaluru', state: 'Karnataka' };
    case '60':
    case '61':
    case '62':
    case '63':
    case '64':
      return { city: 'Chennai', state: 'Tamil Nadu' };
    case '67':
    case '68':
    case '69':
      return { city: 'Thiruvananthapuram', state: 'Kerala' };
    case '70':
    case '71':
    case '72':
    case '73':
    case '74':
      return { city: 'Kolkata', state: 'West Bengal' };
    default:
      return null;
  }
}

/**
 * Validate an address form completely according to Indian standards
 */
export function validateAddress(data: Partial<AddressFormData>): {
  isValid: boolean;
  errors: AddressValidationErrors;
} {
  const errors: AddressValidationErrors = {};

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.fullName = 'Please enter your full name (at least 3 characters)';
  }

  if (!data.phone || !isValidIndianPhone(data.phone)) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number';
  }

  if (!data.streetLine1 || data.streetLine1.trim().length < 5) {
    errors.streetLine1 = 'Please enter flat/house number, building, and street name';
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'Please enter a valid city name';
  }

  if (!data.state || data.state.trim().length < 2) {
    errors.state = 'Please select a state or union territory';
  }

  if (!data.pincode || !isValidPincode(data.pincode)) {
    errors.pincode = 'Please enter a valid 6-digit postal PIN code';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
