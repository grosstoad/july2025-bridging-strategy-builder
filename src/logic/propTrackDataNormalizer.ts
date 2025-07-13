/**
 * Normalizes PropTrack API response data to handle their {value, sourceDate} structure
 */

interface PropTrackValue {
  value: any;
  sourceDate: string;
}

// Raw PropTrack API response structure (matches actual API)
interface PropTrackResponse {
  propertyId: number;
  address: {
    fullAddress: string;
    suburb: string;
    state: string;
    postcode: string;
  };
  attributes: {
    propertyType?: PropTrackValue;
    bedrooms?: PropTrackValue;
    bathrooms?: PropTrackValue;
    carSpaces?: PropTrackValue;
    landArea?: PropTrackValue;
    livingArea?: PropTrackValue;
  };
  image?: {
    id: string;
    extension: string;
    type: string;
    sha: string;
  } | null;
  activeListings: Array<{
    listingId: string;
    priceDescription: string;
    listingType: string;
  }>;
  marketStatus: string[];
}

// Raw PropTrack valuations response (single object, not array)
interface PropTrackValuationsResponse {
  propertyId: number;
  valuationId: string;
  effectiveDate: string;
  valuationDate: string;
  estimatedValue: number;
  confidenceLevel: string;
  lowerRangeValue: number;
  upperRangeValue: number;
  usedAttributes: any;
}

// Normalized data structure for components to use
interface NormalizedPropertyData {
  propertyId: number;
  address: {
    fullAddress: string;
    suburb: string;
    state: string;
    postcode: string;
  };
  attributes: {
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    carSpaces?: number;
    landSize?: number;
    floorPlanSize?: number;
  };
  images: Array<{
    url: string;
  }>;
  marketStatus: string;
  activeListings: Array<{
    listingId: string;
    priceDescription: string;
    listingType: string;
  }>;
}

// Normalized valuations (convert single object to array for consistency)
interface NormalizedValuations {
  valuations: Array<{
    estimate: number;
    lowEstimate: number;
    highEstimate: number;
    confidence: string;
    valuationDate: string;
  }>;
}

/**
 * Extracts numeric value from PropTrack's {value, sourceDate} structure
 */
export const extractValue = (value: any): number | undefined => {
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && value?.value !== undefined) return value.value;
  return undefined;
};

/**
 * Normalizes PropTrack property data to simple numeric values
 */
export const normalizePropertyData = (data: PropTrackResponse): NormalizedPropertyData => {
  // Determine market status from activeListings and marketStatus
  const hasActiveListings = data.activeListings && data.activeListings.length > 0;
  const isForSale = data.marketStatus.includes('forSale');
  const marketStatus = hasActiveListings || isForSale ? 'For Sale' : 'Off market';
  
  // Handle PropTrack image object structure
  // URL format: https://insights.proptrack.com/imagery/{imageSize}/{sha}/image.{extension}
  const imageUrl = data.image ? 
    `https://insights.proptrack.com/imagery/400x300/${data.image.sha}/image.${data.image.extension}` : 
    null;
  
  return {
    propertyId: data.propertyId,
    address: data.address,
    attributes: {
      propertyType: extractValue(data.attributes.propertyType),
      bedrooms: extractValue(data.attributes.bedrooms),
      bathrooms: extractValue(data.attributes.bathrooms),
      carSpaces: extractValue(data.attributes.carSpaces),
      landSize: extractValue(data.attributes.landArea), // Note: landArea in API, landSize in our interface
      floorPlanSize: extractValue(data.attributes.livingArea), // Use livingArea as floorPlanSize equivalent
    },
    images: imageUrl ? [{ url: imageUrl }] : [], // Convert PropTrack image object to URL
    marketStatus,
    activeListings: data.activeListings || []
  };
};

/**
 * Normalizes PropTrack valuations data to simple numeric values
 * Converts single valuation object to array format for consistency
 */
export const normalizeValuations = (data: PropTrackValuationsResponse): NormalizedValuations => {
  return {
    valuations: [{
      estimate: data.estimatedValue,
      lowEstimate: data.lowerRangeValue,
      highEstimate: data.upperRangeValue,
      confidence: data.confidenceLevel,
      valuationDate: data.valuationDate
    }]
  };
};