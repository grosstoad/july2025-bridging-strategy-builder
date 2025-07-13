import { useState, useCallback } from 'react';

interface PropertyAttributes {
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  carSpaces: number;
}

interface CreateValuationResponse {
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

interface UseCreateValuationReturn {
  createValuation: (propertyId: string, fullAddress: string, attributes: PropertyAttributes) => Promise<CreateValuationResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export const useCreateValuation = (): UseCreateValuationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createValuation = useCallback(async (
    propertyId: string,
    fullAddress: string,
    attributes: PropertyAttributes
  ): Promise<CreateValuationResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating valuation for:', fullAddress, 'with attributes:', attributes);

      const response = await fetch('/api/v1/properties/valuations/sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullAddress: fullAddress,
          effectiveDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
          updatedAttributes: {
            propertyType: attributes.propertyType,
            bedrooms: attributes.bedrooms,
            bathrooms: attributes.bathrooms,
            carSpaces: attributes.carSpaces
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`PropTrack API error: ${response.status} - ${errorData}`);
      }

      const valuationData = await response.json() as CreateValuationResponse;
      console.log('Valuation created successfully:', valuationData);
      
      return valuationData;
    } catch (err) {
      console.error('PropTrack API error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create valuation');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createValuation,
    isLoading,
    error
  };
};