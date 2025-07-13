// Custom hook for address suggestions

import { useState, useEffect, useCallback, useRef } from 'react';
import { PropTrackService } from '../services/proptrack';
import { AddressSuggestion } from '../types/proptrack';
import { filterMockSuggestions, shouldUseMockData } from '../services/mockPropTrackData';

interface UseAddressSuggestionsReturn {
  suggestions: AddressSuggestion[];
  isLoading: boolean;
  error: string | null;
  searchAddresses: (query: string) => void;
  clearSuggestions: () => void;
  isUsingMockData: boolean;
}

export const useAddressSuggestions = (): UseAddressSuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const searchAddresses = useCallback((query: string) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    // Clear previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear error state
    setError(null);

    // Handle empty input
    if (query.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Set loading state
    setIsLoading(true);

    // Debounce the search
    timeoutRef.current = window.setTimeout(async () => {
      try {
        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();

        const response = await PropTrackService.getAddressSuggestions(query);
        
        // Only update state if request wasn't aborted
        if (!abortControllerRef.current.signal.aborted) {
          setSuggestions(response.results || []);
          setIsLoading(false);
          setIsUsingMockData(false);
        }
      } catch (err) {
        // Only handle error if request wasn't aborted
        if (!abortControllerRef.current?.signal.aborted) {
          console.error('Address search error:', err);
          
          // Check if we should use mock data (e.g., 429 error)
          if (shouldUseMockData(err)) {
            console.log('Using mock data due to API rate limit');
            const mockResults = filterMockSuggestions(query);
            setSuggestions(mockResults);
            setIsUsingMockData(true);
            setError(null); // Clear error when using mock data
          } else {
            setError(err instanceof Error ? err.message : 'Failed to search addresses');
            setSuggestions([]);
            setIsUsingMockData(false);
          }
          setIsLoading(false);
        }
      }
    }, 400); // 400ms debounce
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
    setIsUsingMockData(false);
    
    // Clear any pending requests
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    searchAddresses,
    clearSuggestions,
    isUsingMockData
  };
};