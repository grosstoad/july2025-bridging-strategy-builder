import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AddressSuggestion } from '../types/proptrack';

interface PropertyData {
  propertyId?: string;
  address?: AddressSuggestion;
  propertyValue?: number;
  loanBalance?: number;
  equity?: number;
  attributes?: {
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    carSpaces?: number;
    landSize?: number;
    floorPlanSize?: number;
  };
  valuation?: {
    estimate?: number;
    lowEstimate?: number;
    highEstimate?: number;
    confidence?: string;
  };
  images?: string[];
}

interface PropertyContextType {
  currentProperty: PropertyData;
  targetProperty: PropertyData;
  setCurrentProperty: (property: Partial<PropertyData>) => void;
  setTargetProperty: (property: Partial<PropertyData>) => void;
  calculateEquity: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [currentProperty, setCurrentPropertyState] = useState<PropertyData>({});
  const [targetProperty, setTargetPropertyState] = useState<PropertyData>({});

  // Load from session storage on mount
  useEffect(() => {
    try {
      const savedCurrentProperty = sessionStorage.getItem('currentProperty');
      const savedTargetProperty = sessionStorage.getItem('targetProperty');
      
      if (savedCurrentProperty) {
        setCurrentPropertyState(JSON.parse(savedCurrentProperty));
      }
      if (savedTargetProperty) {
        setTargetPropertyState(JSON.parse(savedTargetProperty));
      }
    } catch (error) {
      console.error('Error loading property data from session storage:', error);
    }
  }, []);

  // Save to session storage on changes
  useEffect(() => {
    try {
      sessionStorage.setItem('currentProperty', JSON.stringify(currentProperty));
    } catch (error) {
      console.error('Error saving current property to session storage:', error);
    }
  }, [currentProperty]);

  useEffect(() => {
    try {
      sessionStorage.setItem('targetProperty', JSON.stringify(targetProperty));
    } catch (error) {
      console.error('Error saving target property to session storage:', error);
    }
  }, [targetProperty]);

  const setCurrentProperty = (property: Partial<PropertyData>) => {
    setCurrentPropertyState(prev => {
      const updated = { ...prev, ...property };
      // Recalculate equity when property value or loan balance changes
      if (property.propertyValue !== undefined || property.loanBalance !== undefined) {
        const equity = (updated.propertyValue || 0) - (updated.loanBalance || 0);
        updated.equity = Math.max(0, equity);
      }
      return updated;
    });
  };

  const setTargetProperty = (property: Partial<PropertyData>) => {
    setTargetPropertyState(prev => ({ ...prev, ...property }));
  };

  const calculateEquity = () => {
    const equity = (currentProperty.propertyValue || 0) - (currentProperty.loanBalance || 0);
    setCurrentProperty({ equity: Math.max(0, equity) });
  };

  return (
    <PropertyContext.Provider
      value={{
        currentProperty,
        targetProperty,
        setCurrentProperty,
        setTargetProperty,
        calculateEquity
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};