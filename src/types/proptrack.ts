// PropTrack API response types

import { PropertyAddress, PropertyAttributes, PropertyValuation } from './property';

export interface AddressSuggestion {
  id: string;
  propertyId?: string;
  address: PropertyAddress;
}

export interface AddressSuggestionsResponse {
  results?: AddressSuggestion[];
}

export interface PropTrackPropertySummary {
  propertyId: string;
  fullAddress: string;
  unitNumber?: string;
  streetNumber: string;
  streetName: string;
  streetType: string;
  suburb: string;
  postcode: string;
  state: string;
  attributes: {
    propertyType: string;
    bedrooms?: number;
    bathrooms?: number;
    carSpaces?: number;
    landArea?: number;
    livingArea?: number;
  };
  images: PropertyImage[];
  floorplans: PropertyImage[];
  marketStatus: string[];
  activeListings: PropertyListing[];
  valuationDate: string;
  estimatedValue: number;
  upperRangeValue: number;
  lowerRangeValue: number;
  confidenceLevel: string;
  disclaimer: string;
}

export interface PropertyImage {
  id: string;
  extension: string;
  type: string;
  orderIndex: number;
  date: string;
  sha: string;
}

export interface PropertyListing {
  priceDescription: string;
  listingType: string;
}

// Market Data API Types
export interface MedianSalePriceRequest {
  suburb: string;
  state: string;
  postcode: string;
  propertyTypes: string;
  startDate: string;
  endDate: string;
  frequency?: string;
}

export interface MedianDaysOnMarketRequest {
  suburb: string;
  state: string;
  postcode: string;
  propertyTypes: string;
  startDate: string;
  endDate: string;
  frequency?: string;
}

export interface PotentialBuyersRequest {
  suburb: string;
  state: string;
  postcode: string;
  propertyTypes: string;
  frequency?: string;
}

export interface MarketMetricResponse {
  propertyType: string;
  dateRanges: MarketDateRange[];
}

export interface MarketDateRange {
  startDate: string;
  endDate: string;
  metricValues: MarketMetricValue[];
}

export interface MarketMetricValue {
  bedrooms: string;
  value?: number;
  supply?: number;
  demand?: number;
  supplyChangePercentage?: number | null;
  demandChangePercentage?: number | null;
}