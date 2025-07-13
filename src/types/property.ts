// Core property data types

export interface PropertyAddress {
  fullAddress: string;
  unitNumber?: string;
  streetNumber: string;
  streetName: string;
  streetType: string;
  suburb: string;
  state: string;
  postcode: string;
}

export interface PropertyAttributes {
  propertyType: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  carSpaces?: number;
  landArea?: number; // square meters
  livingArea?: number; // square meters
}

export enum PropertyType {
  House = 'house',
  Unit = 'unit',
  Townhouse = 'townhouse',
  Apartment = 'apartment'
}

export interface PropertyValuation {
  estimatedValue: number;
  upperRangeValue: number;
  lowerRangeValue: number;
  confidenceLevel: ConfidenceLevel;
  valuationDate: Date;
  disclaimer: string;
}

export enum ConfidenceLevel {
  HighConfidence = 'HIGH CONFIDENCE',
  MediumConfidence = 'MEDIUM CONFIDENCE',
  LowConfidence = 'LOW CONFIDENCE',
  VeryLowConfidence = 'VERY LOW CONFIDENCE'
}

export interface PropertyMarketData {
  medianSalePrice?: number;
  priceGrowth12Months?: number;
  medianDaysOnMarket?: number;
  trend: MarketTrend;
  lastUpdated: Date;
}

export enum MarketTrend {
  Growing = 'growing',
  Declining = 'declining',
  Stable = 'stable'
}