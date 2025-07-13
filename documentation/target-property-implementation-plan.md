# Target Property Selection Page - Implementation Plan

## Overview

This document outlines the implementation plan for the Target Property Selection page, which allows users to search for either a specific property address or a suburb/postcode for their desired new property.

## Current State Analysis

### Existing Assets
- ✅ Enhanced address search hook (`useEnhancedAddressSearch`) that combines PropTrack and Australia Post APIs
- ✅ Backend proxy with OAuth 2.0 authentication for PropTrack API
- ✅ Australia Post PAC API integration for suburb/postcode search
- ✅ Basic property display components from Current Property page
- ✅ Form state management patterns and session storage

### Required Implementations
- ❌ Visual differentiation between property and suburb search results
- ❌ Conditional display logic based on selection type
- ❌ Suburb-specific display components
- ❌ Market data API integration endpoints
- ❌ Property type and bedroom selectors for suburb searches
- ❌ Financial input fields

## Architecture Design

### Component Structure

```
src/
├── pages/
│   └── TargetPropertyPage.tsx
├── components/
│   ├── inputs/
│   │   ├── EnhancedAddressAutocomplete.tsx
│   │   ├── PropertyTypeSelector.tsx
│   │   ├── BedroomSelector.tsx
│   │   └── FinancialInputs.tsx
│   ├── property/
│   │   ├── PropertySpecificDisplay.tsx
│   │   └── SuburbSpecificDisplay.tsx
│   └── market/
│       ├── SuburbStatistics.tsx
│       └── MarketAnalysisDisplay.tsx
├── hooks/
│   ├── useSuburbMarketData.ts
│   └── usePropertyEstimation.ts
└── types/
    ├── TargetProperty.ts
    └── MarketData.ts
```

### Data Flow

1. **Search Selection**
   - User types in enhanced address search
   - Results show both property addresses (with home icon) and suburbs (with location icon)
   - Selection determines the display mode

2. **Property-Specific Flow**
   ```typescript
   Address Selected → Fetch Property Data → Display Property Details
   ```

3. **Suburb-Specific Flow**
   ```typescript
   Suburb Selected → Display Market Stats → User Selects Type/Bedrooms → Show Estimated Value
   ```

## Implementation Phases

### Phase 1: Enhanced Address Search Integration
**Components:**
- Update `AddressAutocomplete` to use `useEnhancedAddressSearch`
- Add visual indicators (icons) for result types
- Implement selection type detection

**Type Definitions:**
```typescript
interface AddressSelection {
  type: 'address';
  propertyId: string;
  address: string;
  displayAddress: string;
}

interface SuburbSelection {
  type: 'suburb';
  suburb: string;
  state: string;
  postcode: string;
  displayName: string;
}

type SearchSelection = AddressSelection | SuburbSelection;
```

### Phase 2: Page Layout and Conditional Rendering
**Components:**
- Create `TargetPropertyPage` with conditional display logic
- Implement loading and error states
- Add navigation integration

**Key Logic:**
```typescript
const TargetPropertyPage = () => {
  const [selection, setSelection] = useState<SearchSelection | null>(null);
  
  return (
    <PageLayout>
      <EnhancedAddressAutocomplete onSelect={setSelection} />
      
      {selection?.type === 'address' && (
        <PropertySpecificDisplay propertyId={selection.propertyId} />
      )}
      
      {selection?.type === 'suburb' && (
        <SuburbSpecificDisplay suburb={selection} />
      )}
      
      <FinancialInputs />
    </PageLayout>
  );
};
```

### Phase 3: Property-Specific Display
**Reuse from Current Property Page:**
- Property details display
- Editable attributes (bedrooms, bathrooms, etc.)
- Valuation display with override capability
- Property images

**New Requirements:**
- Remove loan balance fields
- Add market trend data specific to the property

### Phase 4: Suburb-Specific Display
**New Components:**

1. **SuburbStatistics**
   - Median sale price
   - 12-month price growth
   - Market trend indicator

2. **PropertyTypeSelector**
   - Radio buttons: House / Unit
   - Updates estimated value on change

3. **BedroomSelector**
   - Dropdown: 1, 2, 3, 4+
   - Updates estimated value on change

4. **MarketAnalysisDisplay**
   - Supply and demand metrics
   - Days on market
   - Buyer demographics

### Phase 5: API Integration

**Backend Proxy Endpoints (Already Configured):**
The market data endpoints are already registered in `proptrack-proxy.ts` using the generic proxy pattern:
```typescript
// Already implemented in proptrack-proxy.ts
router.use('/v2/market/sale/historic/median-sale-price', propTrackApiProxy);
router.use('/v2/market/sale/historic/median-days-on-market', propTrackApiProxy);
router.use('/v2/market/supply-and-demand/potential-buyers', propTrackApiProxy);
```

**Data Fetching Strategy:**

1. **For Property Selection:**
   - Fetch property details via existing endpoints
   - Get suburb-level market data using property's suburb/state/postcode

2. **For Suburb Selection:**
   - Directly fetch market data using selected suburb/state/postcode
   - Calculate estimated values based on property type and bedrooms

**Service Layer Extensions:**

First, add market data methods to `PropTrackService` in `src/services/proptrack.ts`:
```typescript
// Add to PropTrackService class
static async getMedianSalePrice(params: MedianSalePriceRequest): Promise<MarketMetricResponse[]> {
  return this.makeRequest('/v2/market/sale/historic/median-sale-price', 'GET', params);
}

static async getMedianDaysOnMarket(params: MedianDaysOnMarketRequest): Promise<MarketMetricResponse[]> {
  return this.makeRequest('/v2/market/sale/historic/median-days-on-market', 'GET', params);
}

static async getPotentialBuyersSupplyDemand(params: PotentialBuyersRequest): Promise<MarketMetricResponse[]> {
  return this.makeRequest('/v2/market/supply-and-demand/potential-buyers', 'GET', params);
}
```

**Type Definitions:**

Add to `src/types/proptrack.ts`:
```typescript
export interface MedianSalePriceRequest {
  suburb: string;
  state: string;
  postcode: string;
  propertyTypes: string;
  startDate: string;
  endDate: string;
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
```

**Hook Implementation:**

Create `src/hooks/useMarketData.ts` following the established patterns:
```typescript
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

export const useMarketData = (
  suburb: string | null,
  state: string | null,
  postcode: string | null,
  propertyType: 'house' | 'unit' | null,
  bedrooms?: number
) => {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!suburb || !state || !postcode || !propertyType) {
      setData(null);
      return;
    }

    const fetchMarketData = async () => {
      // Check cache first
      const cacheKey = `${suburb}|${state}|${postcode}|${propertyType}`;
      if (cacheKey === cacheKeyRef.current && data) {
        return; // Use existing data
      }
      
      const cached = MarketDataCache.get(suburb, state, postcode, propertyType);
      if (cached) {
        setData(cached);
        cacheKeyRef.current = cacheKey;
        return;
      }

      // Cancel previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        // Parallel fetch all market data (following usePropertyData pattern)
        const [priceData, daysData, supplyDemandData] = await Promise.allSettled([
          PropTrackService.getMedianSalePrice({
            suburb: suburb.toUpperCase(),
            state,
            postcode,
            propertyTypes: propertyType,
            startDate: getStartDate(12), // Last 12 months
            endDate: getEndDate()
          }),
          PropTrackService.getMedianDaysOnMarket({
            suburb: suburb.toUpperCase(),
            state,
            postcode,
            propertyTypes: propertyType,
            startDate: getStartDate(3), // Last 3 months
            endDate: getEndDate()
          }),
          PropTrackService.getPotentialBuyersSupplyDemand({
            suburb: suburb.toUpperCase(),
            state,
            postcode,
            propertyTypes: propertyType
          })
        ]);

        // Process results
        let medianPrice = null;
        let priceGrowth = null;
        let medianDays = null;
        let supplyDemandRatio = null;

        // Extract median price and calculate growth
        if (priceData.status === 'fulfilled' && priceData.value?.[0]) {
          const propertyData = priceData.value[0];
          const latestRange = propertyData.dateRanges?.slice(-1)[0];
          const yearAgoRange = propertyData.dateRanges?.[0];
          
          const bedroomFilter = bedrooms ? String(bedrooms) : 'combined';
          const latestPrice = latestRange?.metricValues?.find(
            m => m.bedrooms === bedroomFilter
          )?.value;
          const yearAgoPrice = yearAgoRange?.metricValues?.find(
            m => m.bedrooms === bedroomFilter
          )?.value;

          medianPrice = latestPrice || null;
          if (latestPrice && yearAgoPrice) {
            priceGrowth = ((latestPrice - yearAgoPrice) / yearAgoPrice) * 100;
          }
        }

        // Extract median days on market
        if (daysData.status === 'fulfilled' && daysData.value?.[0]) {
          const propertyData = daysData.value[0];
          const latestRange = propertyData.dateRanges?.slice(-1)[0];
          medianDays = latestRange?.metricValues?.find(
            m => m.bedrooms === 'combined'
          )?.value || null;
        }

        // Calculate supply/demand ratio
        if (supplyDemandData.status === 'fulfilled' && supplyDemandData.value?.[0]) {
          const propertyData = supplyDemandData.value[0];
          const latestRange = propertyData.dateRanges?.slice(-1)[0];
          const metrics = latestRange?.metricValues?.find(
            m => m.bedrooms === 'combined'
          );
          
          if (metrics?.supply && metrics?.demand) {
            supplyDemandRatio = metrics.demand / metrics.supply;
          }
        }

        const marketData: MarketData = {
          medianPrice,
          priceGrowth12Months: priceGrowth,
          medianDaysOnMarket: medianDays,
          supplyDemandRatio,
          lastUpdated: new Date()
        };
        
        setData(marketData);
        cacheKeyRef.current = cacheKey;
        
        // Cache the results
        MarketDataCache.set(suburb, state, postcode, propertyType, marketData);

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
  }, [suburb, state, postcode, propertyType, bedrooms]);

  return { data, isLoading, error };
};

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
```

**Caching Implementation:**

```typescript
// Add to existing caching utilities or create new file
class MarketDataCache {
  private static getCacheKey(
    suburb: string, 
    state: string, 
    postcode: string, 
    propertyType: string
  ): string {
    return `marketData:${suburb}|${state}|${postcode}|${propertyType}`;
  }
  
  static get(
    suburb: string, 
    state: string, 
    postcode: string, 
    propertyType: string
  ): MarketData | null {
    try {
      const key = this.getCacheKey(suburb, state, postcode, propertyType);
      const cached = sessionStorage.getItem(key);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const cacheAge = Date.now() - new Date(data.lastUpdated).getTime();
      
      // Cache for 15 minutes
      if (cacheAge > 15 * 60 * 1000) {
        sessionStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  }
  
  static set(
    suburb: string, 
    state: string, 
    postcode: string, 
    propertyType: string,
    data: MarketData
  ): void {
    try {
      const key = this.getCacheKey(suburb, state, postcode, propertyType);
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to cache market data:', error);
    }
  }
}
```

### Phase 6: Financial Inputs
**Components:**
- Savings for purchase (currency input)
- Additional cash to borrow (currency input)
- Validation and formatting
- Integration with form context

## Technical Considerations

### Performance
- Debounce search requests (400ms)
- Cache market data (15 minutes)
- Lazy load market analysis components
- Optimize image loading for property displays

### Error Handling
- Graceful fallbacks for missing market data
- Clear error messages for API failures
- Maintain partial functionality if some APIs fail

### Accessibility
- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly result announcements
- Focus management on selection changes

### State Management
- Persist user selections in session storage
- Sync across browser tabs
- Clear previous property data on new selection
- Maintain form state on navigation

## Testing Strategy

### Unit Tests
- Search result type detection logic
- Market data calculations
- Currency formatting and validation
- Component conditional rendering

### Integration Tests
- API endpoint error scenarios
- Search to display flow
- Form state persistence
- Navigation between pages

### E2E Tests
- Complete user journey from search to financial inputs
- Both property and suburb selection flows
- Error recovery scenarios

## Success Criteria

1. Users can search for both specific addresses and suburbs
2. Search results clearly differentiate between property and suburb results  
3. Property selection shows detailed property information
4. Suburb selection shows market statistics and allows property type/bedroom selection
5. All data persists across page navigation
6. Page responds gracefully to API failures
7. Financial inputs validate and format correctly
8. Page matches Figma design specifications

## Implementation Status

### Completed Features

1. **Enhanced Address Search Integration**
   - ✅ Created `EnhancedAddressAutocomplete` component using existing hook
   - ✅ Combined PropTrack property search with Australia Post suburb search
   - ✅ Visual differentiation between property and suburb results
   - ✅ Mock data implementation for testing without API keys

2. **Target Property Page Layout**
   - ✅ Created `TargetPropertyPage.tsx` with progress timeline on left side
   - ✅ Conditional rendering for property vs suburb selection
   - ✅ Financial inputs section with currency formatting
   - ✅ Navigation buttons with validation

3. **Market Data Integration**
   - ✅ Added market data methods to `PropTrackService`
   - ✅ Created market data types and interfaces
   - ✅ Implemented `useMarketData` hook with caching and error handling
   - ✅ Market insights display with median price, growth, days on market, and supply/demand

4. **Australia Post API Updates**
   - ✅ Updated proxy to use correct `/shipping/v1/address` endpoint
   - ✅ Mock data fallback when API key not configured
   - ✅ Response transformation to match expected format

5. **Property-Specific Display**
   - ✅ Reused property data fetching from Current Property page
   - ✅ Display property details, type, bedrooms, and estimated value
   - ✅ Loading and error states

6. **Suburb-Specific Display**
   - ✅ Property type selector (House/Unit)
   - ✅ Bedroom selector dropdown
   - ✅ Market statistics display
   - ✅ Dynamic updates based on selections

### Pending Tasks

1. **API Authentication**
   - ⏳ Need valid Australia Post API key for production use
   - ⏳ Currently using mock data for suburb search

2. **Enhanced Features**
   - ⏳ Cross-tab synchronization for form state
   - ⏳ Session storage persistence
   - ⏳ More comprehensive market data visualizations

## Testing Summary

The enhanced address search is now fully functional with:
- Property address search via PropTrack API
- Suburb search via Australia Post API (with mock data fallback)
- Combined results with visual differentiation
- Proper error handling and loading states
- Market data fetching for both property and suburb selections