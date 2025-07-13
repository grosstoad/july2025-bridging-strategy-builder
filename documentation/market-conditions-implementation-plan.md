# Market conditions implementation plan

## Overview

This document outlines the implementation plan for retrieving suburb market data for the current property and creating market condition metrics that compare both current and target property markets.

## Current state analysis

### Current property data flow

The `CurrentPropertyPage` component already has access to suburb information through the property data:

```typescript
propertyData.address = {
  suburb: string;
  state: string;
  postcode: string;
  // ... other address fields
}
```

### Target property market data

The `TargetPropertyPage` successfully retrieves market data using the `useTargetMarketData` hook, which:
- Fetches median sale prices (13 months for YoY comparison)
- Fetches median days on market
- Fetches supply and demand metrics
- Calculates 12-month price growth: `((Latest Price - Year Ago Price) / Year Ago Price) × 100`
- Caches results in sessionStorage for 15 minutes

## Implementation approach

### 1. Add market data to current property

Reuse the existing `useTargetMarketData` hook in `CurrentPropertyPage`:

```typescript
// In CurrentPropertyPage.tsx
const marketData = useTargetMarketData(
  propertyData?.address.suburb || null,
  propertyData?.address.state || null,
  propertyData?.address.postcode || null,
  propertyData?.propertyType || 'house',
  propertyData?.bedrooms?.toString() || 'combined'
);
```

This will enable:
- Populating the growth alert message with real data
- Showing actual property value changes
- Displaying suburb-level growth rates

### 2. Market conditions classification

Define market condition types based on 12-month price growth:

```typescript
type MarketCondition = 'strong-growth' | 'moderate-growth' | 'stable' | 'declining';

interface MarketAnalysis {
  currentMarket: {
    condition: MarketCondition;
    growthRate: number;
    suburb: string;
  };
  targetMarket: {
    condition: MarketCondition;
    growthRate: number;
    suburb: string;
  };
  comparison: 'both-growing' | 'both-declining' | 'current-better' | 'target-better' | 'diverging';
  recommendation: string;
}
```

#### Classification thresholds

- **Strong growth**: > 10% annual growth
- **Moderate growth**: 3% to 10% annual growth
- **Stable**: -3% to 3% annual growth
- **Declining**: < -3% annual growth

### 3. Market comparison logic

```typescript
function getMarketCondition(growthRate: number): MarketCondition {
  if (growthRate > 10) return 'strong-growth';
  if (growthRate > 3) return 'moderate-growth';
  if (growthRate >= -3) return 'stable';
  return 'declining';
}

function compareMarkets(currentGrowth: number, targetGrowth: number): string {
  const currentCondition = getMarketCondition(currentGrowth);
  const targetCondition = getMarketCondition(targetGrowth);
  
  if (currentGrowth > 3 && targetGrowth > 3) return 'both-growing';
  if (currentGrowth < -3 && targetGrowth < -3) return 'both-declining';
  if (currentGrowth > targetGrowth + 5) return 'current-better';
  if (targetGrowth > currentGrowth + 5) return 'target-better';
  return 'diverging';
}
```

### 4. Implementation steps

1. **Update CurrentPropertyPage**
   - Add `useTargetMarketData` hook
   - Replace placeholder text in growth alert
   - Calculate property value changes

2. **Extend PropertyContext**
   - Store current property market data
   - Store target property market data
   - Make both available for comparison

3. **Create market analysis utility**
   - Add functions to `src/logic/` directory
   - Implement market condition classification
   - Generate comparison insights

4. **Display market insights**
   - Add market condition indicators to both property pages
   - Create comparison summary for strategy recommendations
   - Show market trends visualization

### 5. Data flow

```
User selects current property address
    ↓
CurrentPropertyPage extracts suburb info
    ↓
useTargetMarketData fetches market data
    ↓
Market data stored in PropertyContext
    ↓
User selects target property/suburb
    ↓
TargetPropertyPage fetches market data
    ↓
Both markets available for comparison
    ↓
Market analysis generates insights
```

## Benefits

- **No additional API calls**: Reuses existing market data infrastructure
- **Consistent data source**: Both properties use same PropTrack endpoints
- **Real-time insights**: Helps users understand market dynamics
- **Strategic guidance**: Recommendations based on market alignment
- **Performance optimized**: Leverages existing caching mechanism

## Example use cases

### Both markets growing
"Both your current property in Greensborough and target property in Fitzroy are experiencing strong growth (8.5% and 12.3% respectively). This is an ideal time to consider bridging as both markets are performing well."

### Diverging markets
"Your current property in Greensborough is declining (-4.2%) while your target in Fitzroy is growing (6.8%). Consider timing your bridge carefully to minimize exposure to the declining market."

### Current market outperforming
"Your current property in Toorak is experiencing exceptional growth (15.2%) compared to your target in Preston (3.1%). You may want to hold your current property longer to maximize gains."

## Technical considerations

- Market data is already typed through `MarketData` interface
- PropTrack API proxy handles authentication
- 15-minute cache prevents excessive API calls
- Error handling already implemented in hooks
- Loading states managed by existing patterns