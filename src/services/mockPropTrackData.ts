// Mock PropTrack data for development and API rate limit scenarios

import { AddressSuggestion } from '../types/proptrack';
import { PropertyData, PropertyValuation } from '../types/property';

// Mock suburbs for development
export const mockSuburbs = [
  { name: 'Melbourne', state: 'VIC', postcode: '3000', latitude: -37.8136, longitude: 144.9631 },
  { name: 'South Yarra', state: 'VIC', postcode: '3141', latitude: -37.8456, longitude: 144.9934 },
  { name: 'Armadale', state: 'VIC', postcode: '3143', latitude: -37.8556, longitude: 145.0195 },
  { name: 'Brighton', state: 'VIC', postcode: '3186', latitude: -37.9180, longitude: 144.9938 },
  { name: 'Toorak', state: 'VIC', postcode: '3142', latitude: -37.8401, longitude: 145.0166 },
  { name: 'Richmond', state: 'VIC', postcode: '3121', latitude: -37.8182, longitude: 145.0007 },
  { name: 'Carlton', state: 'VIC', postcode: '3053', latitude: -37.8001, longitude: 144.9673 },
  { name: 'Fitzroy', state: 'VIC', postcode: '3065', latitude: -37.8031, longitude: 144.9780 },
  { name: 'St Kilda', state: 'VIC', postcode: '3182', latitude: -37.8678, longitude: 144.9819 },
  { name: 'Prahran', state: 'VIC', postcode: '3181', latitude: -37.8501, longitude: 144.9897 }
];

// Mock address suggestions for common Melbourne suburbs
export const mockAddressSuggestions: AddressSuggestion[] = [
  {
    id: 'mock-1',
    propertyId: 'mock-prop-1',
    address: {
      fullAddress: '123 Collins Street, Melbourne VIC 3000',
      streetNumber: '123',
      streetName: 'Collins',
      streetType: 'Street',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      latitude: -37.8136,
      longitude: 144.9631
    }
  },
  {
    id: 'mock-2',
    propertyId: 'mock-prop-2',
    address: {
      fullAddress: '456 Chapel Street, South Yarra VIC 3141',
      streetNumber: '456',
      streetName: 'Chapel',
      streetType: 'Street',
      suburb: 'South Yarra',
      state: 'VIC',
      postcode: '3141',
      latitude: -37.8456,
      longitude: 144.9934
    }
  },
  {
    id: 'mock-3',
    propertyId: 'mock-prop-3',
    address: {
      fullAddress: '789 High Street, Armadale VIC 3143',
      streetNumber: '789',
      streetName: 'High',
      streetType: 'Street',
      suburb: 'Armadale',
      state: 'VIC',
      postcode: '3143',
      latitude: -37.8556,
      longitude: 145.0195
    }
  },
  {
    id: 'mock-4',
    propertyId: 'mock-prop-4',
    address: {
      fullAddress: '12 Beach Road, Brighton VIC 3186',
      streetNumber: '12',
      streetName: 'Beach',
      streetType: 'Road',
      suburb: 'Brighton',
      state: 'VIC',
      postcode: '3186',
      latitude: -37.9180,
      longitude: 144.9938
    }
  },
  {
    id: 'mock-5',
    propertyId: 'mock-prop-5',
    address: {
      fullAddress: '34 Toorak Road, Toorak VIC 3142',
      streetNumber: '34',
      streetName: 'Toorak',
      streetType: 'Road',
      suburb: 'Toorak',
      state: 'VIC',
      postcode: '3142',
      latitude: -37.8401,
      longitude: 145.0166
    }
  }
];

// Mock property data for the suggestions above
export const mockPropertyData: Record<string, PropertyData> = {
  'mock-prop-1': {
    propertyId: 'mock-prop-1',
    address: mockAddressSuggestions[0].address,
    attributes: {
      propertyType: 'unit',
      bedrooms: 2,
      bathrooms: 1,
      carSpaces: 1,
      landArea: 0,
      livingArea: 85
    },
    primaryImageUrl: '/placeholder-apartment.jpg',
    activeListings: [],
    marketStatus: []
  },
  'mock-prop-2': {
    propertyId: 'mock-prop-2',
    address: mockAddressSuggestions[1].address,
    attributes: {
      propertyType: 'house',
      bedrooms: 3,
      bathrooms: 2,
      carSpaces: 2,
      landArea: 450,
      livingArea: 180
    },
    primaryImageUrl: '/placeholder-house.jpg',
    activeListings: [
      {
        listingId: 'mock-listing-1',
        priceDescription: '$1,200,000 - $1,320,000',
        listingType: 'sale'
      }
    ],
    marketStatus: ['For Sale']
  },
  'mock-prop-3': {
    propertyId: 'mock-prop-3',
    address: mockAddressSuggestions[2].address,
    attributes: {
      propertyType: 'house',
      bedrooms: 4,
      bathrooms: 2,
      carSpaces: 2,
      landArea: 650,
      livingArea: 220
    },
    primaryImageUrl: '/placeholder-house.jpg',
    activeListings: [],
    marketStatus: []
  },
  'mock-prop-4': {
    propertyId: 'mock-prop-4',
    address: mockAddressSuggestions[3].address,
    attributes: {
      propertyType: 'house',
      bedrooms: 5,
      bathrooms: 3,
      carSpaces: 3,
      landArea: 850,
      livingArea: 320
    },
    primaryImageUrl: '/placeholder-house.jpg',
    activeListings: [],
    marketStatus: []
  },
  'mock-prop-5': {
    propertyId: 'mock-prop-5',
    address: mockAddressSuggestions[4].address,
    attributes: {
      propertyType: 'unit',
      bedrooms: 3,
      bathrooms: 2,
      carSpaces: 2,
      landArea: 0,
      livingArea: 150
    },
    primaryImageUrl: '/placeholder-apartment.jpg',
    activeListings: [],
    marketStatus: []
  }
};

// Mock valuations for the properties
export const mockValuations: Record<string, PropertyValuation> = {
  'mock-prop-1': {
    propertyId: 'mock-prop-1',
    valuationId: 'mock-val-1',
    valuationDate: new Date().toISOString(),
    estimatedValue: 850000,
    lowerRangeValue: 765000,
    upperRangeValue: 935000,
    confidenceLevel: 'HIGH'
  },
  'mock-prop-2': {
    propertyId: 'mock-prop-2',
    valuationId: 'mock-val-2',
    valuationDate: new Date().toISOString(),
    estimatedValue: 1260000,
    lowerRangeValue: 1134000,
    upperRangeValue: 1386000,
    confidenceLevel: 'HIGH'
  },
  'mock-prop-3': {
    propertyId: 'mock-prop-3',
    valuationId: 'mock-val-3',
    valuationDate: new Date().toISOString(),
    estimatedValue: 1850000,
    lowerRangeValue: 1665000,
    upperRangeValue: 2035000,
    confidenceLevel: 'MEDIUM'
  },
  'mock-prop-4': {
    propertyId: 'mock-prop-4',
    valuationId: 'mock-val-4',
    valuationDate: new Date().toISOString(),
    estimatedValue: 3200000,
    lowerRangeValue: 2880000,
    upperRangeValue: 3520000,
    confidenceLevel: 'HIGH'
  },
  'mock-prop-5': {
    propertyId: 'mock-prop-5',
    valuationId: 'mock-val-5',
    valuationDate: new Date().toISOString(),
    estimatedValue: 1450000,
    lowerRangeValue: 1305000,
    upperRangeValue: 1595000,
    confidenceLevel: 'HIGH'
  }
};

// Mock market data for different suburbs
export const mockMarketData = {
  'Melbourne_VIC_3000': {
    house: {
      '3': { medianPrice: 1500000, priceGrowth12Months: 5.2 },
      '4': { medianPrice: 2100000, priceGrowth12Months: 4.8 },
      'combined': { medianPrice: 1800000, priceGrowth12Months: 5.0 }
    },
    unit: {
      '1': { medianPrice: 450000, priceGrowth12Months: 2.1 },
      '2': { medianPrice: 750000, priceGrowth12Months: 3.5 },
      '3': { medianPrice: 1200000, priceGrowth12Months: 4.2 },
      'combined': { medianPrice: 800000, priceGrowth12Months: 3.3 }
    }
  },
  'South Yarra_VIC_3141': {
    house: {
      '3': { medianPrice: 1350000, priceGrowth12Months: 6.1 },
      '4': { medianPrice: 1850000, priceGrowth12Months: 5.8 },
      'combined': { medianPrice: 1600000, priceGrowth12Months: 5.9 }
    },
    unit: {
      '1': { medianPrice: 420000, priceGrowth12Months: 1.8 },
      '2': { medianPrice: 680000, priceGrowth12Months: 2.9 },
      '3': { medianPrice: 1100000, priceGrowth12Months: 3.7 },
      'combined': { medianPrice: 733000, priceGrowth12Months: 2.8 }
    }
  },
  'Armadale_VIC_3143': {
    house: {
      '3': { medianPrice: 1750000, priceGrowth12Months: 7.2 },
      '4': { medianPrice: 2300000, priceGrowth12Months: 6.8 },
      '5': { medianPrice: 3100000, priceGrowth12Months: 6.5 },
      'combined': { medianPrice: 2383000, priceGrowth12Months: 6.8 }
    },
    unit: {
      '2': { medianPrice: 780000, priceGrowth12Months: 3.2 },
      '3': { medianPrice: 1250000, priceGrowth12Months: 4.1 },
      'combined': { medianPrice: 1015000, priceGrowth12Months: 3.7 }
    }
  },
  'Brighton_VIC_3186': {
    house: {
      '3': { medianPrice: 2100000, priceGrowth12Months: 8.1 },
      '4': { medianPrice: 2800000, priceGrowth12Months: 7.5 },
      '5': { medianPrice: 3500000, priceGrowth12Months: 7.2 },
      'combined': { medianPrice: 2800000, priceGrowth12Months: 7.6 }
    },
    unit: {
      '2': { medianPrice: 850000, priceGrowth12Months: 3.8 },
      '3': { medianPrice: 1400000, priceGrowth12Months: 4.5 },
      'combined': { medianPrice: 1125000, priceGrowth12Months: 4.2 }
    }
  },
  'Toorak_VIC_3142': {
    house: {
      '4': { medianPrice: 3500000, priceGrowth12Months: 6.2 },
      '5': { medianPrice: 4800000, priceGrowth12Months: 5.8 },
      'combined': { medianPrice: 4150000, priceGrowth12Months: 6.0 }
    },
    unit: {
      '2': { medianPrice: 950000, priceGrowth12Months: 3.5 },
      '3': { medianPrice: 1600000, priceGrowth12Months: 4.3 },
      'combined': { medianPrice: 1275000, priceGrowth12Months: 3.9 }
    }
  }
};

// Helper function to filter suggestions based on search query
export function filterMockSuggestions(query: string): AddressSuggestion[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (normalizedQuery.length < 3) {
    return [];
  }
  
  return mockAddressSuggestions.filter(suggestion => 
    suggestion.address.fullAddress.toLowerCase().includes(normalizedQuery) ||
    suggestion.address.suburb.toLowerCase().includes(normalizedQuery) ||
    suggestion.address.postcode.includes(normalizedQuery)
  );
}

// Helper function to filter mock suburbs based on search query
export function filterMockSuburbs(query: string) {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (normalizedQuery.length < 2) {
    return [];
  }
  
  return mockSuburbs.filter(suburb => 
    suburb.name.toLowerCase().includes(normalizedQuery) ||
    suburb.postcode.includes(normalizedQuery)
  );
}

// Helper to check if we should use mock data based on error
export function shouldUseMockData(error: any): boolean {
  // Use mock data for rate limit errors (429) or when explicitly in mock mode
  if (error?.status === 429 || 
      error?.message?.includes('429') || 
      error?.message?.includes('Too Many Requests')) {
    return true;
  }
  
  // Also use mock data if explicitly enabled via env variable or localStorage
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true' || 
      localStorage.getItem('useMockData') === 'true') {
    return true;
  }
  
  return false;
}

// Helper to get mock property data
export function getMockPropertyData(propertyId: string): PropertyData | null {
  return mockPropertyData[propertyId] || null;
}

// Helper to get mock valuation
export function getMockValuation(propertyId: string): PropertyValuation | null {
  return mockValuations[propertyId] || null;
}

// Helper to get mock market data
export function getMockMarketData(
  suburb: string, 
  state: string, 
  postcode: string,
  propertyType: 'house' | 'unit',
  bedrooms?: number
): { medianPrice: number | null; priceGrowth12Months: number | null } {
  const key = `${suburb}_${state}_${postcode}`;
  const suburbData = mockMarketData[key as keyof typeof mockMarketData];
  
  if (!suburbData || !suburbData[propertyType]) {
    return { medianPrice: null, priceGrowth12Months: null };
  }
  
  const bedroomKey = bedrooms ? bedrooms.toString() : 'combined';
  const data = suburbData[propertyType][bedroomKey as keyof typeof suburbData.house] || 
                suburbData[propertyType]['combined'];
  
  return data || { medianPrice: null, priceGrowth12Months: null };
}