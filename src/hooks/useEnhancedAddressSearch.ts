import { useState, useCallback, useRef, useEffect } from 'react';
import { PropTrackService } from '../services/proptrack';
import { AddressSuggestion } from '../types/proptrack';
import { filterMockSuggestions, filterMockSuburbs, shouldUseMockData } from '../services/mockPropTrackData';

export interface SuburbSuggestion {
  name: string;
  state: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
}

interface PropertySearchData {
  propertyId?: string;
  fullAddress: string;
  suburb?: string;
  state?: string;
  postcode?: string;
}

export interface EnhancedSearchResult {
  type: 'property' | 'suburb';
  data: PropertySearchData | SuburbSuggestion;
  displayText: string;
  secondaryText?: string;
}

interface UseEnhancedAddressSearchReturn {
  results: EnhancedSearchResult[];
  isLoading: boolean;
  error: string | null;
  searchAddresses: (query: string) => Promise<void>;
  clearResults: () => void;
}

export const useEnhancedAddressSearch = (): UseEnhancedAddressSearchReturn => {
  const [results, setResults] = useState<EnhancedSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Internal search implementation
  const performSearch = useCallback(async (query: string) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Trim whitespace and check minimum length
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const [propertyResults, suburbResults] = await Promise.allSettled([
        searchPropertyAddresses(trimmedQuery, abortController.signal),
        searchSuburbs(trimmedQuery, abortController.signal)
      ]);

      // Check if request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      const combinedResults: EnhancedSearchResult[] = [];

      // Add property results
      if (propertyResults.status === 'fulfilled' && propertyResults.value) {
        const propertyMappedResults = propertyResults.value.map((suggestion: AddressSuggestion) => ({
          type: 'property' as const,
          data: {
            propertyId: suggestion.propertyId,
            fullAddress: suggestion.address.fullAddress,
            suburb: suggestion.address.suburb,
            state: suggestion.address.state,
            postcode: suggestion.address.postcode
          },
          displayText: suggestion.address.fullAddress,
          secondaryText: 'Property'
        }));
        combinedResults.push(...propertyMappedResults);
      }

      // Add suburb results
      if (suburbResults.status === 'fulfilled' && suburbResults.value) {
        console.log('Raw suburb results:', suburbResults.value);
        const suburbMappedResults = suburbResults.value.map((suburb: SuburbSuggestion) => {
          console.log('Mapping suburb:', suburb);
          const result = {
            type: 'suburb' as const,
            data: suburb,
            displayText: `${suburb.name}, ${suburb.state} ${suburb.postcode}`,
            secondaryText: 'Suburb'
          };
          console.log('Mapped result:', result);
          return result;
        });
        combinedResults.push(...suburbMappedResults);
      }

      // Sort results: suburbs first, then properties
      combinedResults.sort((a, b) => {
        if (a.type === 'suburb' && b.type === 'property') return -1;
        if (a.type === 'property' && b.type === 'suburb') return 1;
        return 0;
      });

      setResults(combinedResults);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      
      console.error('Enhanced address search error:', err);
      setError('Failed to search addresses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search function exposed to components
  const searchAddresses = useCallback(async (query: string) => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Handle empty or short queries immediately
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Show loading state immediately for better UX
    setIsLoading(true);

    // Set up new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      performSearch(query);
    }, 300); // 300ms debounce - balanced for responsive search
  }, [performSearch]);

  const clearResults = useCallback(() => {
    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // Cancel any pending API request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setResults([]);
    setError(null);
    setIsLoading(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    results,
    isLoading,
    error,
    searchAddresses,
    clearResults
  };
};

// Helper function to search property addresses using PropTrack API
async function searchPropertyAddresses(query: string, signal: AbortSignal): Promise<AddressSuggestion[]> {
  try {
    // Use the PropTrackService which handles response formatting
    const response = await PropTrackService.getAddressSuggestions(query);
    return response.results || [];
  } catch (error) {
    // Check if it was an abort error
    if (error instanceof Error && error.name === 'AbortError') {
      throw error; // Re-throw abort errors to handle them properly
    }
    
    // Check if we should use mock data (e.g., 429 error)
    if (shouldUseMockData(error)) {
      console.log('Using mock property data due to API rate limit');
      return filterMockSuggestions(query);
    }
    
    console.warn('PropTrack address search failed:', error);
    return [];
  }
}

// Helper function to search suburbs using Australia Post API
async function searchSuburbs(query: string, signal: AbortSignal): Promise<SuburbSuggestion[]> {
  try {
    const response = await fetch(`/api/auspost/search?q=${encodeURIComponent(query)}`, {
      signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Australia Post API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Australia Post API response:', data);
    
    // Transform Australia Post response to our format
    if (data.localities && Array.isArray(data.localities)) {
      // New format from shipping API
      console.log('Processing localities array:', data.localities);
      return data.localities.map((locality: any) => {
        console.log('Processing locality:', locality);
        const mapped = {
          name: locality.name || locality.location || '',
          state: locality.state || 'VIC', // Default if not provided
          postcode: locality.postcode || '',
          latitude: locality.latitude,
          longitude: locality.longitude
        };
        console.log('Mapped locality:', mapped);
        return mapped;
      });
    } else if (data.localities?.locality) {
      // Legacy format support
      const localities = Array.isArray(data.localities.locality) 
        ? data.localities.locality 
        : [data.localities.locality];
        
      return localities.map((locality: any) => ({
        name: locality.name || query.toUpperCase(),
        state: locality.state,
        postcode: locality.postcode,
        latitude: locality.latitude,
        longitude: locality.longitude
      }));
    }
    
    return [];
  } catch (error) {
    // Check if we should use mock data (e.g., network error)
    if (shouldUseMockData(error)) {
      console.log('Using mock suburb data due to API failure');
      return filterMockSuburbs(query);
    }
    
    console.warn('Australia Post suburb search failed:', error);
    return [];
  }
}