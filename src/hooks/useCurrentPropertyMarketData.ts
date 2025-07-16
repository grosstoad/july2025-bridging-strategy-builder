// Hook for fetching market data for current property
// Simplified version of useTargetMarketData specifically for growth rate display

import { useState, useEffect, useRef } from 'react';
import { PropTrackService } from '../services/proptrack';

interface CurrentPropertyMarketData {
  growthRate12Months: number | null;
  lastUpdated: Date;
}

// Utility functions
function getStartDate(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  date.setDate(1);
  return date.toISOString().slice(0, 10);
}

function getEndDate(): string {
  const date = new Date();
  date.setDate(1);
  return date.toISOString().slice(0, 10);
}

// Cache for market data
class CurrentPropertyMarketCache {
  private static getCacheKey(
    suburb: string, 
    state: string, 
    postcode: string,
    propertyType: string
  ): string {
    return `currentPropertyMarket:${suburb}|${state}|${postcode}|${propertyType}`;
  }
  
  static get(
    suburb: string, 
    state: string, 
    postcode: string,
    propertyType: string
  ): CurrentPropertyMarketData | null {
    try {
      const key = this.getCacheKey(suburb, state, postcode, propertyType);
      const cached = sessionStorage.getItem(key);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const cacheAge = Date.now() - new Date(data.timestamp).getTime();
      
      // Cache for 15 minutes
      if (cacheAge > 15 * 60 * 1000) {
        sessionStorage.removeItem(key);
        return null;
      }
      
      return data.marketData;
    } catch {
      return null;
    }
  }
  
  static set(
    suburb: string, 
    state: string, 
    postcode: string,
    propertyType: string,
    marketData: CurrentPropertyMarketData
  ): void {
    try {
      const key = this.getCacheKey(suburb, state, postcode, propertyType);
      const cacheData = {
        marketData,
        timestamp: new Date()
      };
      sessionStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache current property market data:', error);
    }
  }
}

// Mock data for development/demo
const MOCK_GROWTH_RATE = 2.23;
const MOCK_SUBURB_DATA: Record<string, number> = {
  'SUBURBIA': 2.23,
  'MELBOURNE': 1.85,
  'SYDNEY': 3.42,
  'BRISBANE': 2.91,
  // Add more as needed
};

export const useCurrentPropertyMarketData = (
  suburb: string | null,
  state: string | null,
  postcode: string | null,
  propertyType: 'house' | 'unit' | null
) => {
  const [data, setData] = useState<CurrentPropertyMarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Check for mock suburbs first
    if (suburb && MOCK_SUBURB_DATA[suburb.toUpperCase()]) {
      setData({
        growthRate12Months: MOCK_SUBURB_DATA[suburb.toUpperCase()],
        lastUpdated: new Date()
      });
      setIsLoading(false);
      return;
    }

    if (!suburb || !state || !postcode || !propertyType) {
      // Return mock data for development/demo purposes when data is incomplete
      setData({
        growthRate12Months: MOCK_GROWTH_RATE,
        lastUpdated: new Date()
      });
      return;
    }

    const fetchMarketData = async () => {
      // Check cache first
      const cachedData = CurrentPropertyMarketCache.get(suburb, state, postcode, propertyType);
      if (cachedData) {
        console.log('Using cached current property market data');
        setData(cachedData);
        return;
      }

      // Cancel previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      console.log(`Fetching market growth data for ${suburb}, ${state} ${postcode} - ${propertyType}`);

      try {
        // Fetch median price data for the last 13 months
        const response = await PropTrackService.getMedianSalePrice({
          suburb: suburb.toUpperCase(),
          state,
          postcode,
          propertyTypes: propertyType,
          startDate: getStartDate(13), // 13 months for YoY comparison
          endDate: getEndDate(),
          frequency: 'monthly'
        });

        console.log('Current property market data response:', response);

        // Process the response to calculate growth rate
        let growthRate = null;
        
        if (response && response.length > 0) {
          const propertyData = response[0]; // Should only have one property type
          const dateRanges = propertyData.dateRanges;
          
          if (dateRanges && dateRanges.length >= 12) {
            // Get the latest month and 12 months ago
            const latestMonthData = dateRanges[dateRanges.length - 1];
            const yearAgoMonthData = dateRanges[dateRanges.length - 13] || dateRanges[0];
            
            // Use 'combined' bedroom filter
            const latestPrice = latestMonthData?.metricValues?.find(
              (m: any) => m.bedrooms === 'combined'
            )?.value;
            const yearAgoPrice = yearAgoMonthData?.metricValues?.find(
              (m: any) => m.bedrooms === 'combined'
            )?.value;

            if (latestPrice && yearAgoPrice) {
              growthRate = ((latestPrice - yearAgoPrice) / yearAgoPrice) * 100;
              console.log('Calculated growth rate:', { 
                latestPrice, 
                yearAgoPrice, 
                growthRate,
                latestMonth: latestMonthData.startDate,
                yearAgoMonth: yearAgoMonthData.startDate
              });
            }
          }
        }

        const marketData: CurrentPropertyMarketData = {
          growthRate12Months: growthRate,
          lastUpdated: new Date()
        };

        setData(marketData);
        
        // Cache the result
        CurrentPropertyMarketCache.set(suburb, state, postcode, propertyType, marketData);

      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch market data');
          console.error('Current property market data fetch error:', err);
          
          // Use mock data as fallback
          setData({
            growthRate12Months: MOCK_GROWTH_RATE,
            lastUpdated: new Date()
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [suburb, state, postcode, propertyType]);

  return { data, isLoading, error };
};