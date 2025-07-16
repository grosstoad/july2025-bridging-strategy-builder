# Property strategy playback page analysis

## Overview

The property strategy playback page presents users with four different property purchase/sale scenarios, showing financial implications and timing considerations for each approach. The page helps users make informed decisions about their property transition strategy.

## Page structure

### 1. Page header
- **Title**: "Choose your next move"
- **Subtitle**: "Compare how these strategies could help you meet your next move"
- **Purpose**: Sets context for the scenario comparison

### 2. Property filters and timing controls

#### Current property filter
- **Estimated value display**: Shows current property value from PropertyContext
- **Growth scenarios**: Three percentage inputs
  - Low: Default -5.00% (adjustable percentage for downside scenario)
  - Target: Default to current market growth rate for property's area
  - High: Default +5.00% (adjustable percentage for upside scenario)
- **Info tooltip**: Explains growth scenario impacts

#### New property filter  
- **Estimated value display**: Shows target property value from PropertyContext
- **Growth scenarios**: Three percentage inputs
  - Low: Default -5.00% (adjustable percentage for downside scenario)
  - Target: Default to current market growth rate for property's area
  - High: Default +5.00% (adjustable percentage for upside scenario)
- **Info tooltip**: Explains growth scenario impacts

#### Timing controls
- **Ready to go dropdown**: 
  - Lists next 12 months from current month (MMM YYYY format)
  - Default: Current month
  - Example: July 2025 to June 2026
- **Time between dropdown**:
  - Range: 0 to 12 months
  - Default: 6 months
  - Represents gap between being ready and completing transaction
- **Timeline slider**:
  - Dual-handle range slider
  - Range: Current month to 24 months in future
  - Left handle: "Ready to go" date position
  - Right handle: Calculated from "Ready to go" + "Time between"
  - Min/max labels: MMM YYYY format below track
  - Visual connection line between handles
- **Timeline period indicator**: Shows colored section between the two dates

### 3. Property scenarios grid (4 cards)

Each scenario card contains:

#### a. Buy first, then sell
- **Scenario description**: Explains the buy-first approach
- **Financial summary**:
  - Current property details (value, selling costs)
  - New property details (purchase price, costs)
  - Bridging finance requirements
  - Total costs breakdown
- **Indicative costs**: Mortgage, selling, buying totals
- **Timeline visualization**

#### b. Sell first, then buy
- **Scenario description**: Explains the sell-first approach
- **Financial summary**:
  - Current property sale proceeds
  - Temporary accommodation costs
  - New property purchase details
  - Total costs breakdown
- **Indicative costs**: Rental, moving, buying totals
- **Timeline visualization**

#### c. Keep both
- **Scenario description**: Explains keeping both properties
- **Financial summary**:
  - Current property refinancing
  - New property purchase
  - Combined loan details
  - Rental income projections
- **Indicative costs**: Both mortgages, maintenance
- **Timeline visualization**

#### d. Settle same day
- **Scenario description**: Explains simultaneous settlement
- **Financial summary**:
  - Coordinated settlement details
  - Bridging finance (if needed)
  - Risk mitigation costs
  - Total transaction costs
- **Indicative costs**: All transaction costs
- **Timeline visualization**

### 4. Property market outlook sections

For each property:
- **Market trend indicator**: Visual representation (rising/falling/stable)
- **Key metrics**:
  - Median price growth
  - Days on market
  - Supply vs demand
- **Confidence level**: Based on data quality

### 5. Things to consider sections

For each scenario:
- **Risk factors**: Listed with severity indicators
- **Benefits**: Key advantages highlighted
- **Market conditions**: Relevant market factors
- **Personal circumstances**: Lifestyle considerations

### 6. Action buttons
- **Primary CTA**: For preferred scenario
- **Secondary CTAs**: For alternative scenarios

## Data schema correlation

### Existing data we have:

From `PropertyContext.tsx`:
- `propertyValue` → Maps to current/new property values
- `loanBalance` → Current debt amount
- `equity` → Calculated from value - loan
- `address` → Property location data
- `attributes` → Property characteristics
- `valuation` → Maps to estimated values shown

From `BridgingCalculator.ts`:
- `existingPropertyValue` → Current property card value
- `existingDebt` → Shown in financial summaries
- `sellingCostsPercent` → Selling costs calculations
- `newPropertyValue` → New property purchase price
- `purchaseCostsPercent` → Purchase costs shown
- `bridgingTermMonths` → Timeline calculations
- `bridgingInterestRate` → Bridging finance costs

From `PropertyMarketData`:
- `medianSalePrice` → Market outlook sections
- `priceGrowth12Months` → Growth indicators
- `medianDaysOnMarket` → Market speed indicator
- `trend` → Market trend visualization

### New data elements needed:

1. **Scenario calculations**:
   - Rental costs for "sell first" scenario
   - Moving costs estimates
   - Temporary accommodation duration
   - Risk premium calculations
   - Simultaneous settlement coordination fees

2. **Timeline data**:
   - Settlement date projections
   - Contract exchange dates
   - Bridging loan periods
   - Overlap/gap periods between properties

3. **Cost breakdowns**:
   - Legal fees itemization
   - Stamp duty calculations
   - Insurance costs during transitions
   - Utility connection/disconnection fees

4. **Market timing factors**:
   - Seasonal market variations
   - Interest rate projections
   - Market velocity indicators
   - Competition levels

5. **Risk assessments**:
   - Settlement risk scores
   - Market volatility indicators
   - Finance approval confidence
   - Contingency requirements

## Implementation priority

1. **Phase 1**: Property strategy cards
   - Create basic card layout with navigation
   - Implement responsive grid
   - Add click handlers for routing

2. **Phase 2**: Scenario section with dynamic text
   - Create scenario text templates
   - Implement dynamic value insertion
   - Add strategy selection state

3. **Phase 3**: Financial calculations
   - Implement PMT function
   - Create calculation functions for each scenario
   - Handle edge cases (negative end debt)

4. **Phase 4**: Timeline visualization
   - Create timeline component
   - Add chip positioning
   - Display financial breakdowns

5. **Phase 5**: Integration and polish
   - Connect all components
   - Add loading states
   - Implement error handling
   - Add transitions and animations

## Design system alignment

- Follow existing button patterns (contained primary, outlined secondary)
- Use consistent spacing (theme.spacing)
- Match existing card elevation patterns
- Use existing color palette
- Follow typography hierarchy

## Clarifying questions

### Data and calculations

1. **Rental cost estimation**: How should we calculate temporary accommodation costs for the "sell first" scenario? Should we use:
   - Median rental prices from PropTrack API?
   - User-provided estimates?
   - Calculated percentage of property value?

2. **Growth scenarios**: The percentage inputs (-5%, target, +5%) represent:
   - Property value growth/decline projections
   - Used to calculate future property values for each scenario
   - Should target percentage default to actual market growth data?

3. **Risk scoring**: How should we calculate and present risk levels for each scenario?
   - Qualitative (High/Medium/Low)?
   - Numerical score (1-10)?
   - Multiple risk dimensions?

4. **Market outlook integration**: Should the market outlook data:
   - Come from PropTrack API real-time data?
   - Use historical trends?
   - Include user adjustments/overrides?

### User experience

5. **Scenario selection**: How does the user indicate their preferred scenario?
   - Single selection only?
   - Ranking/ordering options?
   - Side-by-side detailed comparison?

6. **Data persistence**: Should scenario comparisons be:
   - Saved to user session?
   - Exportable as PDF/report?
   - Shareable with advisors?

7. **Interactivity level**: Should users be able to:
   - Adjust all financial inputs?
   - Only adjust key parameters?
   - View but not modify calculations?

### Business logic

8. **Calculation accuracy**: What level of detail for financial calculations?
   - Include all government fees/taxes?
   - Estimate or exact calculations?
   - Regional variations?

9. **Scenario constraints**: Are there scenarios we should prevent/warn about?
   - Insufficient equity situations?
   - Unrealistic timeline combinations?
   - Market condition mismatches?

10. **Professional services integration**: Should scenarios include:
    - Mortgage broker fees?
    - Legal/conveyancing costs?
    - Building inspection costs?
    - Financial advisor fees?

### Technical implementation

11. **State management**: Should we:
    - Extend PropertyContext for scenarios?
    - Create new ScenarioContext?
    - Use local component state?

12. **API requirements**: Do we need new endpoints for:
    - Rental market data?
    - Transaction cost calculations?
    - Timeline estimations?
    - Risk assessments?

13. **Responsive design**: How should the 4-card layout adapt for:
    - Tablet views (2x2 grid)?
    - Mobile views (vertical stack)?
    - Print layouts?

14. **Performance**: With complex calculations, should we:
    - Calculate all scenarios upfront?
    - Lazy-load scenario details?
    - Cache calculation results?

## Implementation plan for property strategy cards

### Component architecture

#### 1. PropertyStrategyCard component
```typescript
interface PropertyStrategyCardProps {
  title: string;
  subtitle: string;
  scenario: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  scenarioData: ScenarioCalculations;
  onClick: () => void;
  isRecommended?: boolean;
}
```

Key features:
- Clickable card with hover state
- Visual indicator for recommended strategy
- Summary financial metrics display
- Compact timeline visualization
- Responsive layout (4 cards horizontal on desktop, 2x2 on tablet, vertical stack on mobile)

#### 2. ScenarioSection component (for detailed view)
```typescript
interface ScenarioSectionProps {
  scenario: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  propertyData: {
    currentProperty: PropertyData;
    targetProperty: PropertyData;
  };
  timing: TimingData;
  calculations: ScenarioCalculations;
}
```

Key features:
- Dynamic text generation based on property values and timing
- Timeline component with buy/sell date chips
- Financial calculations display
- Monthly repayment information
- Context-aware messaging

### Data schema for scenarios

#### ScenarioCalculations interface
```typescript
interface ScenarioCalculations {
  // Common fields
  totalTransactionCosts: number;
  endDebt: number;
  monthlyRepayment: number;
  
  // BBYS specific
  bridgingLoanAmount?: number;
  bridgingLoanDuration?: number;
  bridgingLoanCosts?: number;
  totalBridgingPeriodCosts?: number;
  
  // SBYB specific
  temporaryAccommodationCosts?: number;
  rentalPeriodMonths?: number;
  movingCosts?: number;
  storageCosts?: number;
  
  // KB specific
  combinedLoanAmount?: number;
  rentalIncome?: number;
  negativeGearing?: number;
  totalHoldingCosts?: number;
  
  // SS specific
  coordinationRisk?: 'low' | 'medium' | 'high';
  contingencyAmount?: number;
  settlementAgentFees?: number;
}
```

### Financial calculation formulas

#### 1. Buy first, then sell (BBYS)
```typescript
// Bridging loan amount
bridgingLoanAmount = newPropertyValue + purchaseCosts - availableEquity - savings

// Bridging period (months between buy and sell)
bridgingLoanDuration = timeBetween

// Bridging costs (using existing calculation engine)
bridgingLoanCosts = bridgingLoanAmount * (bridgingRate / 12) * bridgingLoanDuration

// End debt after selling current property
endDebt = bridgingLoanAmount + bridgingLoanCosts - (currentPropertyValue - sellingCosts - existingLoan)

// Monthly repayment (30 years @ 5.50% P&I)
monthlyRepayment = PMT(0.055/12, 360, endDebt)
```

#### 2. Sell first, then buy (SBYB)
```typescript
// Rental costs (based on median rent for similar property)
monthlyRent = currentPropertyValue * 0.004 // Approximate 4.8% annual rental yield
temporaryAccommodationCosts = monthlyRent * timeBetween

// Moving and storage
movingCosts = 3000 // Base estimate
storageCosts = 200 * timeBetween // Monthly storage

// End debt (no bridging required)
endDebt = newPropertyValue + purchaseCosts - proceedsFromSale - savings

// Monthly repayment
monthlyRepayment = PMT(0.055/12, 360, endDebt)
```

#### 3. Keep both (KB)
```typescript
// Combined loan amount
combinedLoanAmount = existingLoan + (newPropertyValue + purchaseCosts - savings)

// Rental income estimate
rentalIncome = currentPropertyValue * 0.004 // Monthly rental yield

// Total holding costs
propertyManagement = rentalIncome * 0.08
maintenance = currentPropertyValue * 0.001 // Annual 1% maintenance
insurance = 1500 / 12 // Monthly insurance
totalHoldingCosts = propertyManagement + maintenance + insurance

// Monthly repayment (both properties)
monthlyRepayment = PMT(0.055/12, 360, combinedLoanAmount) - rentalIncome
```

#### 4. Settle same day (SS)
```typescript
// Similar to BBYS but with contingency
contingencyAmount = 50000 // Default contingency for failed settlement
settlementAgentFees = 2500 // Coordination fees

// End debt calculation
endDebt = newPropertyValue + purchaseCosts - (currentPropertyValue - sellingCosts - existingLoan) - savings

// Monthly repayment
monthlyRepayment = PMT(0.055/12, 360, endDebt)
```

### Timeline component design

#### TimelineVisualization component
```typescript
interface TimelineVisualizationProps {
  startDate: Date;
  events: TimelineEvent[];
  duration: number; // Total months to display
}

interface TimelineEvent {
  date: Date;
  type: 'buy' | 'sell' | 'settle' | 'move';
  label: string;
  color: string;
}
```

Features:
- Horizontal timeline with month markers
- Event chips positioned at appropriate dates
- Visual connection between related events
- Responsive sizing
- Clear labeling of key dates

### Navigation strategy

1. Each card click navigates to strategy-specific route:
   - `/strategy/buy-first-then-sell`
   - `/strategy/sell-first-then-buy`
   - `/strategy/keep-both`
   - `/strategy/settle-same-day`

2. Strategy detail pages include:
   - Full scenario explanation
   - Detailed financial breakdown
   - Interactive timeline
   - Risk factors and considerations
   - Action buttons (Get pre-approval, Find agent, etc.)
   - Back navigation to comparison view

### Dynamic text templates

#### BBYS scenario text
```typescript
`By purchasing in ${targetLocation} first, you'll need a bridging loan of approximately ${formatCurrency(bridgingLoanAmount)} for ${bridgingLoanDuration} months while you sell your ${currentLocation} property. Once sold, your end debt will be ${formatCurrency(endDebt)} with monthly repayments of ${formatCurrency(monthlyRepayment)}.`
```

#### SBYB scenario text
```typescript
`Selling your ${currentLocation} property first means you'll need temporary accommodation for approximately ${timeBetween} months, costing around ${formatCurrency(temporaryAccommodationCosts)}. After purchasing in ${targetLocation}, your end debt will be ${formatCurrency(endDebt)} with monthly repayments of ${formatCurrency(monthlyRepayment)}.`
```

### Responsive layout patterns

1. Desktop (>1200px): 4 cards in single row
2. Tablet (768-1200px): 2x2 grid
3. Mobile (<768px): Vertical stack

Card heights should be equal using CSS Grid or Flexbox with `align-items: stretch`.

### Material-UI implementation notes

1. Use `Card` component with `CardActionArea` for clickable cards
2. Implement `sx` prop for styling (no custom CSS)
3. Use `Chip` components for timeline events
4. Use `LinearProgress` or custom SVG for timeline visualization
5. Leverage `useTheme` and `useMediaQuery` for responsive behavior
6. Use `Skeleton` components for loading states

### Detailed component specifications

#### PropertyStrategyCard layout structure
```typescript
<Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
  <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header with title and recommended badge */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        </Box>
        {isRecommended && <Chip label="Recommended" size="small" color="primary" />}
      </Box>
      
      {/* Key metrics */}
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        <MetricRow label="Bridging loan" value={bridgingLoanAmount} highlight />
        <MetricRow label="End debt" value={endDebt} />
        <MetricRow label="Monthly repayment" value={monthlyRepayment} />
      </Stack>
      
      {/* Mini timeline */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <MiniTimeline events={timelineEvents} />
      </Box>
    </CardContent>
  </CardActionArea>
</Card>
```

#### ScenarioSection detailed layout
```typescript
<Box sx={{ mb: 4 }}>
  {/* Scenario header */}
  <Typography variant="h4" fontWeight={600} gutterBottom>
    {scenarioTitle}
  </Typography>
  
  {/* Dynamic scenario description */}
  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
    {generateScenarioDescription(scenario, propertyData, timing)}
  </Typography>
  
  {/* Timeline visualization */}
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" gutterBottom>Your timeline</Typography>
    <TimelineVisualization 
      startDate={timing.readyToGo}
      events={generateTimelineEvents(scenario, timing)}
      duration={24} // Show 24 months
    />
  </Paper>
  
  {/* Financial breakdown */}
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>Transaction costs</Typography>
        <Stack spacing={2}>
          {generateCostBreakdown(scenario, calculations)}
        </Stack>
      </Paper>
    </Grid>
    
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>Your new loan</Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">End debt</Typography>
            <Typography variant="h4">{formatCurrency(calculations.endDebt)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Monthly repayment</Typography>
            <Typography variant="h5">{formatCurrency(calculations.monthlyRepayment)}</Typography>
            <Typography variant="caption" color="text.secondary">
              30 years @ 5.50% P&I
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Grid>
  </Grid>
</Box>
```

### Helper functions and utilities

#### Timeline event generation
```typescript
const generateTimelineEvents = (scenario: ScenarioType, timing: TimingData): TimelineEvent[] => {
  const { readyToGo, timeBetween } = timing;
  const events: TimelineEvent[] = [];
  
  switch (scenario) {
    case 'BBYS':
      events.push({
        date: readyToGo,
        type: 'buy',
        label: 'Buy new property',
        color: theme.palette.primary.main
      });
      events.push({
        date: addMonths(readyToGo, timeBetween),
        type: 'sell',
        label: 'Sell current property',
        color: theme.palette.secondary.main
      });
      break;
      
    case 'SBYB':
      events.push({
        date: readyToGo,
        type: 'sell',
        label: 'Sell current property',
        color: theme.palette.secondary.main
      });
      events.push({
        date: addMonths(readyToGo, 1),
        type: 'move',
        label: 'Move to rental',
        color: theme.palette.warning.main
      });
      events.push({
        date: addMonths(readyToGo, timeBetween),
        type: 'buy',
        label: 'Buy new property',
        color: theme.palette.primary.main
      });
      break;
      
    // Additional cases for KB and SS
  }
  
  return events;
};
```

#### Cost breakdown generation
```typescript
const generateCostBreakdown = (scenario: ScenarioType, calculations: ScenarioCalculations) => {
  const items: CostItem[] = [];
  
  // Common costs
  items.push({
    label: 'Selling costs',
    value: calculations.sellingCosts,
    tooltip: 'Agent fees, marketing, legal'
  });
  items.push({
    label: 'Purchase costs',
    value: calculations.purchaseCosts,
    tooltip: 'Stamp duty, legal, inspections'
  });
  
  // Scenario-specific costs
  switch (scenario) {
    case 'BBYS':
      items.push({
        label: 'Bridging loan interest',
        value: calculations.bridgingLoanCosts,
        tooltip: `${calculations.bridgingLoanDuration} months @ current rates`
      });
      break;
      
    case 'SBYB':
      items.push({
        label: 'Temporary accommodation',
        value: calculations.temporaryAccommodationCosts,
        tooltip: `${calculations.rentalPeriodMonths} months rental`
      });
      items.push({
        label: 'Moving & storage',
        value: calculations.movingCosts + calculations.storageCosts,
        tooltip: 'Removalist and storage fees'
      });
      break;
  }
  
  return items;
};
```

### State management considerations

#### Extended PropertyContext
```typescript
interface PropertyContextType {
  // Existing properties
  currentProperty: PropertyData;
  targetProperty: PropertyData;
  setCurrentProperty: (property: Partial<PropertyData>) => void;
  setTargetProperty: (property: Partial<PropertyData>) => void;
  calculateEquity: () => void;
  
  // New scenario-related properties
  scenarioPreferences: ScenarioPreferences;
  setScenarioPreferences: (prefs: Partial<ScenarioPreferences>) => void;
  selectedScenario?: ScenarioType;
  setSelectedScenario: (scenario: ScenarioType) => void;
}

interface ScenarioPreferences {
  savings: number;
  riskTolerance: 'low' | 'medium' | 'high';
  preferredStrategy?: ScenarioType;
  bridgingInterestRate: number;
  assumedGrowthRates: {
    current: { low: number; target: number; high: number };
    target: { low: number; target: number; high: number };
  };
}
```

### PMT function implementation
```typescript
const PMT = (rate: number, nper: number, pv: number): number => {
  // Excel PMT function implementation
  if (rate === 0) return -pv / nper;
  const pvif = Math.pow(1 + rate, nper);
  return -rate * pv * pvif / (pvif - 1);
};
```

### Accessibility considerations

1. **Keyboard navigation**: Ensure all cards are keyboard accessible with proper focus indicators
2. **Screen reader support**: Add descriptive aria-labels for all interactive elements
3. **Color contrast**: Ensure all text meets WCAG AA standards
4. **Focus management**: Properly manage focus when navigating between views
5. **Loading states**: Announce loading and completion to screen readers

### Data mapping from PropertyContext

#### Input data requirements for calculations
```typescript
interface ScenarioCalculationInputs {
  // From currentProperty
  currentPropertyValue: number; // propertyValue or valuation.estimate
  currentPropertyLocation: string; // address.suburb + address.state
  existingLoan: number; // loanBalance
  currentEquity: number; // equity or calculated
  
  // From targetProperty  
  newPropertyValue: number; // propertyValue or valuation.estimate
  newPropertyLocation: string; // address.suburb + address.state
  
  // From user preferences (need to add to context or local state)
  savings: number;
  sellingCostsPercent: number; // Default 2.5%
  purchaseCostsPercent: number; // Default 5.5%
  bridgingInterestRate: number; // Default 7.5%
  endLoanRate: number; // Default 5.5%
  loanTerm: number; // Default 30 years
  
  // From timing state
  readyToGoDate: Date;
  timeBetweenMonths: number;
  
  // From growth scenarios
  currentPropertyGrowthRate: number; // Based on selected scenario
  newPropertyGrowthRate: number; // Based on selected scenario
}
```

#### Calculation output structure
```typescript
interface ScenarioCalculationOutputs {
  // Common outputs for all scenarios
  sellingCosts: number;
  purchaseCosts: number;
  netSaleProceeds: number;
  totalCashRequired: number;
  endDebt: number;
  monthlyRepayment: number;
  totalInterestPaid: number; // Over loan term
  
  // BBYS specific outputs
  bridgingLoanRequired: number;
  bridgingInterestCosts: number;
  bridgingLoanFees: number;
  peakDebt: number;
  
  // SBYB specific outputs
  rentalCosts: number;
  movingCosts: number;
  storageCosts: number;
  totalTemporaryCosts: number;
  
  // KB specific outputs
  totalLoanAmount: number;
  rentalIncome: number;
  netCashFlow: number;
  taxBenefit: number;
  
  // SS specific outputs
  settlementRisk: 'low' | 'medium' | 'high';
  contingencyRequired: number;
  coordinationFees: number;
}
```

### Detailed calculation breakdown

#### Common calculations (all scenarios)
```typescript
// Selling costs
sellingCosts = currentPropertyValue * (sellingCostsPercent / 100);
// Typically includes: Agent commission (2-2.5%), Marketing (0.2-0.5%), Legal fees ($1,500-$3,000)

// Purchase costs  
purchaseCosts = newPropertyValue * (purchaseCostsPercent / 100);
// Typically includes: Stamp duty (varies by state), Legal fees, Building inspection, Pest inspection

// Net sale proceeds
netSaleProceeds = currentPropertyValue - sellingCosts - existingLoan;

// Monthly repayment calculation (PMT function)
monthlyRepayment = PMT(endLoanRate / 12, loanTerm * 12, -endDebt);
```

#### BBYS (Buy Before You Sell) specific calculations
```typescript
// Available funds
availableFunds = currentEquity * 0.8 + savings; // 80% of equity accessible via bridging

// Bridging loan amount needed
bridgingLoanRequired = newPropertyValue + purchaseCosts - availableFunds;

// Bridging interest (interest-only during bridging period)
monthlyBridgingInterest = bridgingLoanRequired * (bridgingInterestRate / 100 / 12);
bridgingInterestCosts = monthlyBridgingInterest * timeBetweenMonths;

// Bridging loan fees (typically 0.5-1% establishment fee)
bridgingLoanFees = bridgingLoanRequired * 0.0075; // 0.75% average

// Peak debt (maximum debt during transition)
peakDebt = existingLoan + bridgingLoanRequired;

// End debt after selling current property
endDebt = bridgingLoanRequired + bridgingInterestCosts + bridgingLoanFees - netSaleProceeds;
```

#### SBYB (Sell Before You Buy) specific calculations
```typescript
// Rental costs (based on comparable properties)
monthlyRent = currentPropertyValue * 0.004; // ~4.8% annual yield
rentalCosts = monthlyRent * timeBetweenMonths;

// Moving costs
movingCosts = 3000; // Base estimate, could vary by distance/volume

// Storage costs
monthlyStorage = 200; // Standard 3-bedroom storage unit
storageCosts = monthlyStorage * timeBetweenMonths;

// Total temporary costs
totalTemporaryCosts = rentalCosts + movingCosts + storageCosts;

// End debt (simpler as no bridging required)
endDebt = newPropertyValue + purchaseCosts - netSaleProceeds - savings;
```

#### KB (Keep Both) specific calculations
```typescript
// Total loan amount (refinance current + new property loan)
refinanceAmount = currentPropertyValue * 0.8; // Max 80% LVR
newPropertyLoan = newPropertyValue + purchaseCosts - savings;
totalLoanAmount = refinanceAmount + newPropertyLoan;

// Rental income (conservative estimate)
monthlyRentalIncome = currentPropertyValue * 0.0035; // ~4.2% gross yield
annualRentalIncome = monthlyRentalIncome * 12;

// Property management and maintenance
propertyManagementFees = monthlyRentalIncome * 0.08; // 8% of rent
annualMaintenance = currentPropertyValue * 0.01; // 1% of value
annualInsurance = 1500; // Landlord insurance

// Net rental income
netMonthlyIncome = monthlyRentalIncome - propertyManagementFees - (annualMaintenance / 12) - (annualInsurance / 12);

// Combined monthly repayment
totalMonthlyRepayment = PMT(endLoanRate / 12, loanTerm * 12, -totalLoanAmount);
netMonthlyCashFlow = totalMonthlyRepayment - netMonthlyIncome;

// Tax considerations (negative gearing)
annualTaxableIncome = annualRentalIncome - (totalMonthlyRepayment * 12) - annualMaintenance - annualInsurance;
taxBenefit = annualTaxableIncome < 0 ? Math.abs(annualTaxableIncome) * 0.37 : 0; // Assuming 37% tax bracket
```

#### SS (Settle Same Day) specific calculations
```typescript
// Similar to BBYS but with additional considerations
contingencyAmount = 50000; // In case settlement doesn't align
settlementCoordinationFees = 2500; // Legal fees for coordination

// Risk assessment based on market conditions
daysOnMarket = 45; // From PropTrack data
settlementRisk = daysOnMarket > 60 ? 'high' : daysOnMarket > 30 ? 'medium' : 'low';

// May need short-term bridging if settlements don't align perfectly
potentialBridgingDays = 7; // Typical settlement mismatch
shortTermBridgingCost = bridgingLoanRequired * (bridgingInterestRate / 100 / 365) * potentialBridgingDays;

// End debt calculation
endDebt = newPropertyValue + purchaseCosts - netSaleProceeds - savings + settlementCoordinationFees + shortTermBridgingCost;
```

### Timeline chip positioning algorithm
```typescript
const calculateChipPosition = (eventDate: Date, startDate: Date, totalMonths: number, containerWidth: number): number => {
  const monthsDiff = differenceInMonths(eventDate, startDate);
  const position = (monthsDiff / totalMonths) * containerWidth;
  return Math.max(0, Math.min(containerWidth - CHIP_WIDTH, position));
};
```

### Responsive grid layout for cards
```typescript
<Grid container spacing={2} sx={{ mb: 4 }}>
  {scenarios.map((scenario) => (
    <Grid 
      item 
      xs={12} 
      sm={6} 
      lg={3} 
      key={scenario.id}
    >
      <PropertyStrategyCard {...scenario} />
    </Grid>
  ))}
</Grid>
```

## Next steps

1. Create ScenarioCalculationEngine class extending existing BridgingCalculationEngine
2. Implement PropertyStrategyCard component with Material-UI
3. Build TimelineVisualization component
4. Create individual strategy detail pages
5. Implement navigation routing
6. Add loading states and error handling
7. Create unit tests for calculation logic
8. Implement responsive layout breakpoints
9. Add accessibility features (ARIA labels, keyboard navigation)
10. Performance optimization with React.memo for cards

## Refined implementation plan for property cards and scenarios

### Property strategy cards requirements

#### Layout
- 4 cards displayed side by side as columns on desktop
- Cards in specific order: BBYS, SBYB, KB, SS
- Each card is clickable and navigates to strategy-specific "next actions" page
- Card height should be equal using flexbox/grid

#### Card content
- Title (e.g., "Buy first, then sell")
- Brief description
- Key financial metrics (optional - to be determined)
- Visual indicator for recommended option (if applicable)

#### Navigation routes
- `/next-actions/buy-first-then-sell`
- `/next-actions/sell-first-then-buy`
- `/next-actions/keep-both`
- `/next-actions/settle-same-day`

### Scenario section requirements

#### Section structure
- Title: "Scenario"
- Dynamic text for each strategy (one at a time, based on selected/highlighted card)
- Timeline visualization with chips
- Financial breakdown

#### Dynamic text templates

**Buy first, then sell (BBYS)**
```
You would be buying your new property for $[newPropertyValue], [timeBetween] months before you sell your current property for $[currentPropertyValue]. You'll need a bridging loan to support this.
```

**Sell first, then buy (SBYB)**
```
You would be selling your current property for $[currentPropertyValue], [timeBetween] months before you buy your new property for $[newPropertyValue].
```

**Keep both (KB)**
```
You would be buying your new property in [readyToGoMonth] [readyToGoYear] for $[newPropertyValue] and keeping your current property.
```

**Settle same day (SS)**
```
You would be selling your current property for $[currentPropertyValue], and buying your new property for $[newPropertyValue] at the same time in [readyToGoMonth] [readyToGoYear].
```

#### Timeline visualization requirements

**BBYS timeline**
- Chip 1: "Buy" in ready-to-go month
- Show: Bought price of new property
- Show: Get a bridging loan (with calculated amount)
- Chip 2: "Sell" in ready-to-go month + time between months
- Show: Sell current property (with value)
- Show: End debt (calculated)
- Show: Estimated repayments (monthly)

**SBYB timeline**
- Chip 1: "Sell" in ready-to-go month
- Show: Sell current property (with value)
- Chip 2: "Buy" in ready-to-go month + time between months
- Show: Buy new property (with value)
- Show: End debt (if positive) or "No loan required" (if negative)
- Show: Estimated repayments (if applicable)

**KB timeline**
- Chip: "Buy" in ready-to-go month
- Show: Buy new property (with value)
- Show: Keep current property
- Show: End debt (calculated)
- Show: Estimated repayments per month

**SS timeline**
- Chip: "Buy & Sell" in ready-to-go month
- Show: Sell current property (with value)
- Show: Buy new property (with value)
- Show: End debt (if positive) or "No loan required" (if negative)
- Show: Estimated repayments (if applicable)

### Financial calculations

#### Common assumptions
- Loan term: 30 years
- Interest rate: 5.50% per annum
- Payment type: Principal & Interest
- Repayment frequency: Monthly

#### BBYS calculations
```typescript
bridgingLoanAmount = calculate from existing bridging calculator
endDebt = newPropertyValue - currentPropertyValue + existingDebt - savings + bridgingLoanCosts
monthlyRepayment = PMT(0.055/12, 360, endDebt)
```

#### SBYB calculations
```typescript
endDebt = newPropertyValue - currentPropertyValue + existingDebt - savings
if (endDebt <= 0) {
  display "No loan required"
} else {
  monthlyRepayment = PMT(0.055/12, 360, endDebt)
}
```

#### KB calculations
```typescript
endDebt = newPropertyValue + existingDebt - savings
monthlyRepayment = PMT(0.055/12, 360, endDebt)
```

#### SS calculations
```typescript
endDebt = newPropertyValue - currentPropertyValue + existingDebt - savings
if (endDebt <= 0) {
  display "No loan required"
} else {
  monthlyRepayment = PMT(0.055/12, 360, endDebt)
}
```

### Component implementation approach

#### PropertyStrategyCard
```typescript
interface PropertyStrategyCardProps {
  strategy: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  title: string;
  description: string;
  onClick: () => void;
  isSelected?: boolean;
}
```

#### ScenarioSection
```typescript
interface ScenarioSectionProps {
  selectedStrategy: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  currentPropertyValue: number;
  newPropertyValue: number;
  existingDebt: number;
  savings: number;
  readyToGoDate: Date;
  timeBetween: number;
}
```

#### TimelineVisualization
```typescript
interface TimelineVisualizationProps {
  strategy: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  events: TimelineEvent[];
  financialInfo: FinancialBreakdown[];
}

interface TimelineEvent {
  date: Date;
  label: string;
  type: 'buy' | 'sell' | 'buysell';
}

interface FinancialBreakdown {
  label: string;
  value: number | string;
  position: 'start' | 'middle' | 'end';
}
```

### Material-UI implementation notes

1. Use `Card` with `CardActionArea` for clickable cards
2. Use `Grid` container with responsive breakpoints
3. Use `Typography` for all text elements
4. Use `Chip` components for timeline events
5. Use `Box` and `Stack` for layout
6. Use theme spacing and avoid custom CSS
7. Implement hover states for interactive elements

### State management

- Property values come from PropertyContext
- Timing values (readyToGo, timeBetween) from local state
- Selected strategy tracked in local state
- Calculations performed on-demand when values change