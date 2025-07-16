// Hook for fetching market data from PropTrack API

import { useState, useEffect, useRef } from 'react';
import { PropTrackService } from '../services/proptrack';
import { MarketMetricResponse } from '../types/proptrack';

interface MarketData {
  medianPrice: number | null;
  priceGrowth12Months: number | null;
  medianDaysOnMarket: number | null;
  supplyDemandRatio: number | null;
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

// Raw API response cache (stores unprocessed data for all property types)
class RawMarketDataCache {
  private static getCacheKey(
    suburb: string, 
    state: string, 
    postcode: string
  ): string {
    return `rawMarketData:${suburb}|${state}|${postcode}`;
  }
  
  static get(
    suburb: string, 
    state: string, 
    postcode: string
  ): any | null {
    try {
      const key = this.getCacheKey(suburb, state, postcode);
      const cached = sessionStorage.getItem(key);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const cacheAge = Date.now() - new Date(data.timestamp).getTime();
      
      // Cache for 15 minutes
      if (cacheAge > 15 * 60 * 1000) {
        sessionStorage.removeItem(key);
        return null;
      }
      
      return data.rawApiResponse;
    } catch {
      return null;
    }
  }
  
  static set(
    suburb: string, 
    state: string, 
    postcode: string,
    rawApiResponse: any
  ): void {
    try {
      const key = this.getCacheKey(suburb, state, postcode);
      const cacheData = {
        rawApiResponse,
        timestamp: new Date()
      };
      sessionStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache raw market data:', error);
    }
  }
}

// Helper function to process raw API data into MarketData
function processMarketData(
  rawApiResponse: any,
  propertyType: 'house' | 'unit',
  bedrooms?: number
): { marketData: MarketData; availableBedroomOptions: string[] } {
  let medianPrice = null;
  let priceGrowth = null;
  let medianDays = null;
  let supplyDemandRatio = null;
  const bedroomOptionsSet = new Set<string>();

  const [priceData, daysData, supplyDemandData] = rawApiResponse;

  // Extract median price and calculate growth - filter by property type
  if (priceData?.status === 'fulfilled' && priceData.value) {
    const propertyData = priceData.value.find((item: any) => item.propertyType === propertyType);
    
    if (propertyData) {
      const dateRanges = propertyData.dateRanges;
      
      // Extract bedroom options from latest data
      const latestMonthData = dateRanges?.[dateRanges.length - 1];
      latestMonthData?.metricValues?.forEach((metric: any) => {
        if (metric.bedrooms !== 'combined') {
          bedroomOptionsSet.add(metric.bedrooms);
        }
      });
      
      // Calculate prices and growth
      const yearAgoMonthData = dateRanges?.[0];
      const bedroomFilter = bedrooms ? String(bedrooms) : 'combined';
      
      const latestPrice = latestMonthData?.metricValues?.find(
        (m: any) => m.bedrooms === bedroomFilter
      )?.value;
      const yearAgoPrice = yearAgoMonthData?.metricValues?.find(
        (m: any) => m.bedrooms === bedroomFilter
      )?.value;

      medianPrice = latestPrice || null;
      if (latestPrice && yearAgoPrice) {
        priceGrowth = ((latestPrice - yearAgoPrice) / yearAgoPrice) * 100;
      }

      // console.log('Processed median price data:', { 
      //   propertyType,
      //   bedrooms: bedroomFilter,
      //   latestMonth: latestMonthData?.startDate,
      //   yearAgoMonth: yearAgoMonthData?.startDate,
      //   latestPrice, 
      //   yearAgoPrice, 
      //   priceGrowth,
      //   availableBedrooms: Array.from(bedroomOptionsSet)
      // });
    }
  }

  // Extract median days on market - filter by property type
  if (daysData?.status === 'fulfilled' && daysData.value) {
    const propertyData = daysData.value.find((item: any) => item.propertyType === propertyType);
    
    if (propertyData) {
      const latestRange = propertyData.dateRanges?.slice(-1)[0];
      medianDays = latestRange?.metricValues?.find(
        (m: any) => m.bedrooms === 'combined'
      )?.value || null;

      console.log('Processed days on market:', { propertyType, medianDays });
    }
  }

  // Calculate supply/demand ratio - filter by property type
  if (supplyDemandData?.status === 'fulfilled' && supplyDemandData.value) {
    const propertyData = supplyDemandData.value.find((item: any) => item.propertyType === propertyType);
    
    if (propertyData) {
      const latestRange = propertyData.dateRanges?.slice(-1)[0];
      const metrics = latestRange?.metricValues?.find(
        (m: any) => m.bedrooms === 'combined'
      );
      
      if (metrics?.supply && metrics?.demand) {
        supplyDemandRatio = metrics.demand / metrics.supply;
      }

      console.log('Processed supply/demand data:', { propertyType, supply: metrics?.supply, demand: metrics?.demand, ratio: supplyDemandRatio });
    }
  }

  const marketData: MarketData = {
    medianPrice,
    priceGrowth12Months: priceGrowth,
    medianDaysOnMarket: medianDays,
    supplyDemandRatio,
    lastUpdated: new Date()
  };

  return {
    marketData,
    availableBedroomOptions: Array.from(bedroomOptionsSet).sort()
  };
}

export const useTargetMarketData = (
  suburb: string | null,
  state: string | null,
  postcode: string | null,
  propertyType: 'house' | 'unit' | null,
  bedrooms?: number
) => {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableBedroomOptions, setAvailableBedroomOptions] = useState<string[]>([]);
  const [rawApiResponse, setRawApiResponse] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheKeyRef = useRef<string | null>(null);

  // Process data whenever propertyType or bedrooms change
  useEffect(() => {
    if (!propertyType || !rawApiResponse) {
      setData(null);
      setAvailableBedroomOptions([]);
      return;
    }

    // console.log('Processing market data for:', { propertyType, bedrooms });
    const processed = processMarketData(rawApiResponse, propertyType, bedrooms);
    setData(processed.marketData);
    setAvailableBedroomOptions(processed.availableBedroomOptions);
  }, [propertyType, bedrooms, rawApiResponse]);

  // Fetch raw data when location changes
  useEffect(() => {
    if (!suburb || !state || !postcode) {
      setRawApiResponse(null);
      setData(null);
      setAvailableBedroomOptions([]);
      return;
    }

    const fetchMarketData = async () => {
      // Check if we need to fetch new data for this location
      const cacheKey = `${suburb}|${state}|${postcode}`;
      
      // Check raw cache first
      const cachedRawData = RawMarketDataCache.get(suburb, state, postcode);
      if (cachedRawData) {
        console.log('Using cached raw market data for:', cacheKey);
        setRawApiResponse(cachedRawData);
        cacheKeyRef.current = cacheKey;
        return;
      }

      // Only fetch if cache key changed
      if (cacheKey === cacheKeyRef.current && rawApiResponse) {
        return;
      }

      // Cancel previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      console.log(`Fetching raw market data for ${suburb}, ${state} ${postcode} - both house and unit`);

      try {
        // Parallel fetch all market data for both property types
        const rawData = await Promise.allSettled([
          PropTrackService.getMedianSalePrice({
            suburb: suburb.toUpperCase(),
            state,
            postcode,
            propertyTypes: 'house,unit', // Fetch both types in one request
            startDate: getStartDate(13), // Last 13 months for YoY comparison
            endDate: getEndDate(),
            frequency: 'monthly'
          }),
          PropTrackService.getMedianDaysOnMarket({
            suburb: suburb.toUpperCase(),
            state,
            postcode,
            propertyTypes: 'house,unit', // Fetch both types in one request
            startDate: getStartDate(3), // Last 3 months
            endDate: getEndDate()
          }),
          PropTrackService.getPotentialBuyersSupplyDemand({
            suburb: suburb.toUpperCase(),
            state,
            postcode,
            propertyTypes: 'house,unit' // Fetch both types in one request
          })
        ]);

        console.log('Raw market data API responses:', rawData);

        // Store raw data for processing
        setRawApiResponse(rawData);
        cacheKeyRef.current = cacheKey;
        
        // Cache the raw response
        RawMarketDataCache.set(suburb, state, postcode, rawData);

      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch market data');
          console.error('Market data fetch error:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [suburb, state, postcode]); // Only fetch when location changes

  return { data, isLoading, error, availableBedroomOptions };
};