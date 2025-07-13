import { useState, useEffect, useCallback, useRef } from 'react';
import { getMockPropertyData, getMockValuation, shouldUseMockData } from '../services/mockPropTrackData';
import { PropertyData, PropertyValuation } from '../types/property';

// Simple cache to prevent duplicate API calls for the same property
const propertyDataCache = new Map<string, {
  data: {
    propertyData: PropertySummary | null;
    listings: PropertyListings | null;
    valuations: PropertyValuations | null;
  };
  timestamp: number;
}>;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface PropTrackValue {
  value: any;
  sourceDate: string;
}

interface PropertySummary {
  propertyId: number;
  address: {
    fullAddress: string;
    unitNumber?: string;
    streetNumber: string;
    streetName: string;
    streetType: string;
    suburb: string;
    state: string;
    postcode: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  parcels: Array<{
    planNumber: string;
    lotNumber: string;
  }>;
  attributes: {
    bedrooms?: PropTrackValue;
    bathrooms?: PropTrackValue;
    carSpaces?: PropTrackValue;
    livingArea?: PropTrackValue;
    landArea?: PropTrackValue;
    propertyType?: PropTrackValue;
  };
  recentSale?: any;
  image?: string | null;
  activeListings: any[];
  marketStatus: string[];
}

interface PropertyListings {
  listings: any[]; // Can be empty array for off-market properties
}

interface PropertyValuations {
  fsd: number;
  propertyId: number;
  valuationId: string;
  effectiveDate: string;
  valuationDate: string;
  estimatedValue: number;
  confidenceLevel: string;
  lowerRangeValue: number;
  upperRangeValue: number;
  usedAttributes: {
    bedrooms?: number;
    landArea?: number;
    bathrooms?: number;
    carSpaces?: number;
    floorArea?: number;
    yearBuilt?: number;
    livingArea?: number;
    propertyType?: string;
  };
  additionalInformation: any;
}

interface UsePropertyDataReturn {
  propertyData: PropertySummary | null;
  listings: PropertyListings | null;
  valuations: PropertyValuations | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isUsingMockData: boolean;
}

export const usePropertyData = (propertyId?: string): UsePropertyDataReturn => {
  const [propertyData, setPropertyData] = useState<PropertySummary | null>(null);
  const [listings, setListings] = useState<PropertyListings | null>(null);
  const [valuations, setValuations] = useState<PropertyValuations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const isMountedRef = useRef(true);
  const activeRequestRef = useRef<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchPropertyData = useCallback(async () => {
    console.log('fetchPropertyData called with propertyId:', propertyId);
    
    if (!propertyId || propertyId === 'manual') {
      console.log('No propertyId or manual mode, clearing data');
      setPropertyData(null);
      setListings(null);
      setValuations(null);
      setIsLoading(false);
      return;
    }

    // Cancel any previous request
    if (activeRequestRef.current === propertyId) {
      console.log('Request already in progress for:', propertyId);
      return;
    }

    // Check cache first
    const cached = propertyDataCache.get(propertyId);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('Using cached property data for:', propertyId);
      setPropertyData(cached.data.propertyData);
      setListings(cached.data.listings);
      setValuations(cached.data.valuations);
      setIsLoading(false);
      console.log('Set isLoading to false (cached)');
      return;
    }

    // Mark request as active
    activeRequestRef.current = propertyId;
    console.log('Fetching fresh property data for:', propertyId);
    setIsLoading(true);
    console.log('Set isLoading to true');
    setError(null);

    try {
      // Fetch all three endpoints in parallel
      const [summaryResponse, listingsResponse, valuationsResponse] = await Promise.allSettled([
        fetch(`/api/v2/properties/${propertyId}/summary`),
        fetch(`/api/v2/properties/${propertyId}/listings`),
        fetch(`/api/v1/properties/${propertyId}/valuations/sale`)
      ]);

      let summaryData = null;
      let listingsData = null;
      let valuationsData = null;

      // Process summary data
      if (summaryResponse.status === 'fulfilled' && summaryResponse.value.ok) {
        summaryData = await summaryResponse.value.json();
        setPropertyData(summaryData);
        console.log('Set propertyData:', summaryData?.propertyId);
      } else {
        console.warn('Failed to fetch property summary:', 
          summaryResponse.status === 'fulfilled' ? summaryResponse.value.statusText : summaryResponse.reason);
      }

      // Process listings data
      if (listingsResponse.status === 'fulfilled' && listingsResponse.value.ok) {
        listingsData = await listingsResponse.value.json();
        setListings(listingsData);
        console.log('Set listings:', listingsData?.listings?.length || 0, 'items');
      } else {
        console.warn('Failed to fetch property listings:', 
          listingsResponse.status === 'fulfilled' ? listingsResponse.value.statusText : listingsResponse.reason);
      }

      // Process valuations data
      if (valuationsResponse.status === 'fulfilled' && valuationsResponse.value.ok) {
        valuationsData = await valuationsResponse.value.json();
        setValuations(valuationsData);
        console.log('Set valuations:', valuationsData?.estimatedValue);
      } else {
        console.warn('Failed to fetch property valuations:', 
          valuationsResponse.status === 'fulfilled' ? valuationsResponse.value.statusText : valuationsResponse.reason);
      }

      // Cache the results if we got at least summary data
      if (summaryData) {
        console.log('Caching property data for:', propertyId);
        propertyDataCache.set(propertyId, {
          data: {
            propertyData: summaryData,
            listings: listingsData,
            valuations: valuationsData
          },
          timestamp: Date.now()
        });
      } else {
        console.log('No summary data received for:', propertyId);
      }

    } catch (err) {
      console.error('Error fetching property data:', err);
      
      // Check if we should use mock data (e.g., 429 error)
      if (shouldUseMockData(err) && propertyId) {
        console.log('Using mock data due to API rate limit for property:', propertyId);
        
        // Check if this is a mock property ID
        if (propertyId.startsWith('mock-')) {
          const mockData = getMockPropertyData(propertyId);
          const mockValuation = getMockValuation(propertyId);
          
          if (mockData) {
            // Transform mock data to match API format
            const transformedPropertyData: PropertySummary = {
              propertyId: parseInt(propertyId.replace('mock-prop-', '')),
              address: mockData.address,
              parcels: [],
              attributes: {
                propertyType: mockData.attributes.propertyType ? 
                  { value: mockData.attributes.propertyType, sourceDate: new Date().toISOString() } : undefined,
                bedrooms: mockData.attributes.bedrooms ? 
                  { value: mockData.attributes.bedrooms, sourceDate: new Date().toISOString() } : undefined,
                bathrooms: mockData.attributes.bathrooms ? 
                  { value: mockData.attributes.bathrooms, sourceDate: new Date().toISOString() } : undefined,
                carSpaces: mockData.attributes.carSpaces ? 
                  { value: mockData.attributes.carSpaces, sourceDate: new Date().toISOString() } : undefined,
                landArea: mockData.attributes.landArea ? 
                  { value: mockData.attributes.landArea, sourceDate: new Date().toISOString() } : undefined,
                livingArea: mockData.attributes.livingArea ? 
                  { value: mockData.attributes.livingArea, sourceDate: new Date().toISOString() } : undefined,
              },
              image: mockData.primaryImageUrl || null,
              activeListings: mockData.activeListings || [],
              marketStatus: mockData.marketStatus || []
            };
            
            setPropertyData(transformedPropertyData);
            setListings({ listings: mockData.activeListings || [] });
            
            if (mockValuation) {
              const transformedValuation: PropertyValuations = {
                fsd: 0,
                propertyId: parseInt(propertyId.replace('mock-prop-', '')),
                valuationId: mockValuation.valuationId,
                effectiveDate: mockValuation.valuationDate,
                valuationDate: mockValuation.valuationDate,
                estimatedValue: mockValuation.estimatedValue,
                confidenceLevel: mockValuation.confidenceLevel,
                lowerRangeValue: mockValuation.lowerRangeValue,
                upperRangeValue: mockValuation.upperRangeValue,
                usedAttributes: {},
                additionalInformation: {}
              };
              setValuations(transformedValuation);
            }
            
            setIsUsingMockData(true);
            setError(null);
          }
        }
      } else if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property data');
        setIsUsingMockData(false);
      }
    } finally {
      console.log('fetchPropertyData finally block for:', propertyId);
      // Clear active request
      if (activeRequestRef.current === propertyId) {
        activeRequestRef.current = null;
        console.log('Cleared active request for:', propertyId);
      }
      // Always set loading to false, even if unmounted (to prevent stuck loading states)
      setIsLoading(false);
      console.log('Set isLoading to false (finally) - mounted:', isMountedRef.current);
    }
  }, [propertyId]);

  const refetch = useCallback(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

  useEffect(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

  return {
    propertyData,
    listings,
    valuations,
    isLoading,
    error,
    refetch,
    isUsingMockData
  };
};