# Product Requirements Document - Property Strategy Builder

## Executive Summary

The Property Strategy Builder is a digital experience that provides personalized property strategy recommendations based on user inputs, property data, and intelligent scoring logic. The platform guides users through a multi-step process to analyze their current property situation, desired new property, and personal circumstances to recommend the optimal approach for buying and selling properties.

## Product Overview

### Core Value Proposition
- **Intelligent Strategy Matching**: Uses a sophisticated scoring algorithm to rank four property strategies (Buy Before You Sell, Sell Before You Buy, Simultaneous Settlement, Buy and Keep)
- **Real-time Property Data**: Integrates with PropTrack API to provide accurate property valuations, market trends, and suburb analytics
- **Personalized Recommendations**: Considers timeline, market dynamics, lifestyle preferences, and financial capacity
- **Comprehensive Analysis**: Provides detailed breakdowns of costs, financing needs, and suitability for each strategy

### Target Users
- Property owners looking to upgrade or relocate
- Investors considering buy-and-keep strategies
- First-time upgraders seeking guidance on property transition strategies
- Financial advisors and mortgage brokers helping clients with property decisions

## User Journey Overview

```
Landing Page → Current Property → New Property → About You → Strategy Recommendations
```

1. **Property Address Entry**: User provides their current property address
2. **Current Property Analysis**: Display property data with ability to modify details
3. **Target Property Selection**: Choose new property or suburb with relevant data display
4. **Personal Circumstances**: Capture timeline, progress, and lifestyle preferences
5. **Strategy Recommendations**: Display ranked strategies with detailed analysis

## Detailed Feature Requirements

### 1. Landing Page

#### Primary Purpose
Capture the user's existing property address to begin the analysis process with a welcoming, professional interface that builds trust and explains the value proposition.

#### Key Components
- **Navigation Placeholder**: Clean header area for future navigation elements
- **Hero Section**: 
  - Main headline: "Work out your next move"
  - Descriptive subheading explaining the tool's purpose and process
  - Center-aligned typography with clear hierarchy
- **PropTrack Branding**: "Powered by PropTrack" with logo for credibility
- **Address Search Input**: 
  - Single prominent input field with location icon
  - Placeholder text: "Enter your current property address to get started"
  - PropTrack-powered address autocomplete
- **Footer Placeholder**: Clean footer area for future content

#### Acceptance Criteria
- [ ] Landing page matches Figma design exactly
- [ ] Responsive layout works on desktop, tablet, and mobile
- [ ] Address autocomplete searches PropTrack database
- [ ] Minimum 3 characters required before search triggers
- [ ] Results show property addresses with property IDs
- [ ] Selected address navigates to Current Property page
- [ ] Form validation prevents submission without valid address selection
- [ ] Loading states during address search
- [ ] Error handling for API failures with fallback messaging
- [ ] PropTrack logo and branding displayed correctly
- [ ] Typography hierarchy matches design (large headline, medium subheading)
- [ ] Input field has location icon and proper placeholder text

#### UI/UX Requirements
- **Layout**: Centered content with ample white space
- **Typography**: Clear hierarchy with bold headline, readable subheading
- **Color Scheme**: Clean, minimal with subtle background
- **Input Design**: Prominent, easy to find and use
- **Branding**: PropTrack integration shows credibility
- **Mobile Responsive**: Maintains design integrity across devices
- **Accessibility**: WCAG 2.1 AA compliance with proper focus states

### 2. Current Property Analysis

#### Primary Purpose
Display retrieved property data and allow users to modify key attributes that affect valuation and equity calculations.

#### Key Components

##### 2.1 Property Information Display
- **Address**: Full property address (read-only)
- **Property Attributes**: Bedrooms, bathrooms, car spaces, land area, living area
- **Current Valuation**: PropTrack estimated value with confidence level
- **Property Images**: Display available property photos from PropTrack

##### 2.2 Editable Property Attributes
- **Bedrooms**: Dropdown (1-6+)
- **Bathrooms**: Dropdown (1-5+)
- **Car Spaces**: Dropdown (0-4+)
- **Land Area**: Input field (square meters)
- **Living Area**: Input field (square meters)
- **Manual Valuation Override**: Currency input to override PropTrack valuation

##### 2.3 Loan Information
- **Current Loan Balance**: Currency input field
- **Equity Calculation**: Auto-calculated (Property Value - Loan Balance)
- **Available Equity Display**: Show usable equity based on LVR constraints

##### 2.4 Lending Policy Integration
- **Postcode Validation**: Extract postcode from address
- **Maximum LVR Display**: Show maximum LVR for this property (default 85%)
- **Lending Eligibility**: Display "We lend in this area" status

#### Acceptance Criteria
- [ ] Property data populates from PropTrack API response
- [ ] Attribute changes trigger real-time valuation updates
- [ ] Manual valuation override replaces PropTrack estimate
- [ ] Loan balance input validates as positive currency
- [ ] Equity calculation updates automatically
- [ ] Maximum LVR displays correctly based on property type/location
- [ ] Form validation prevents negative values
- [ ] All currency fields format correctly (Australian dollars)
- [ ] Changes persist if user navigates back to this page

#### Technical Considerations
- Debounced API calls for valuation updates (500ms delay)
- Form state persistence in session storage
- Optimistic UI updates with fallback error handling
- Currency formatting and validation
- Real-time calculation updates

### 3. Target Property Selection

#### Primary Purpose
Capture new property address or suburb with relevant property data display and customization options.

#### Key Components

##### 3.1 Address/Suburb Search
- **Enhanced Search Input**: Supports both specific addresses and suburb searches
- **Search Type Detection**: Automatically determines if input is address vs. suburb
- **Visual Differentiation**: Icons and labels distinguish property addresses from suburbs

##### 3.2 Property-Specific Display (if address selected)
- **Property Details**: Same format as current property analysis
- **Property Attributes**: Editable bedrooms, bathrooms, car spaces, areas
- **Valuation**: PropTrack estimated value with ability to override
- **Market Data**: Recent sales, price trends, days on market

##### 3.3 Suburb-Specific Display (if suburb selected)
- **Suburb Statistics**: Median sale price, price growth (12 months), market trends
- **Property Type Selection**: Radio buttons (House, Unit)
- **Bedroom Selection**: Dropdown (1-4+)
- **Market Analysis**: Supply and demand data, potential buyers

##### 3.4 Financial Inputs
- **Savings for Purchase**: Currency input for deposit/costs
- **Additional Cash to Borrow**: Currency input for extra borrowing requirements

#### Acceptance Criteria
- [ ] Search supports both property addresses and suburbs
- [ ] Address results show property-specific data
- [ ] Suburb results show market statistics and require property type/bedroom selection
- [ ] Property type and bedroom selections update suburb-based valuations
- [ ] Financial inputs validate as positive currency values
- [ ] Market data displays with appropriate time periods
- [ ] All inputs persist across navigation
- [ ] Error handling for missing or invalid property data

#### Search Logic
```typescript
// Address detection logic
if (query.includes(number) && PropTrack.hasProperty(query)) {
  return PropertySpecificDisplay;
} else if (AustraliaPost.hasSuburb(query)) {
  return SuburbSpecificDisplay;
}
```

### 4. Personal Circumstances Collection

#### Primary Purpose
Gather information about user's timeline, progress, and preferences to inform strategy scoring.

#### Key Components

##### 4.1 Existing Property Sale Progress
- **Radio Button Options**:
  - "Not listed"
  - "Listed" → Settlement Date Input
  - "Sold" → Settlement Date Input
  - "Settled" → Settlement Date Input (past date)

##### 4.2 New Property Purchase Progress
- **Radio Button Options**:
  - "Looking"
  - "Bought" → Settlement Date Input
  - "Settled" → Settlement Date Input (past date)

##### 4.3 Lifestyle Impact Tolerance
- **Radio Button Options**:
  - "I want minimal disruption to my living situation"
  - "We could adapt for a few months if we needed to"
  - "We're comfortable with managing two moves and potential temporary living arrangements"

#### Acceptance Criteria
- [ ] Settlement date inputs appear conditionally based on progress selection
- [ ] Date inputs validate as realistic dates (not too far in past/future)
- [ ] Expected vs. actual settlement dates clearly labeled
- [ ] All selections required before proceeding
- [ ] Form state persists across navigation
- [ ] Clear explanation of why each question is asked

#### Conditional Logic
```typescript
// Settlement date visibility
if (existingProgress === 'listed' || 'sold' || 'settled') {
  showExistingSettlementDate = true;
}
if (newProgress === 'bought' || 'settled') {
  showNewSettlementDate = true;
}
```

### 5. Strategy Recommendations

#### Primary Purpose
Display ranked property strategies with comprehensive analysis of suitability, costs, and requirements.

#### Key Components

##### 5.1 Strategy Ranking Display
- **Ordered List**: Four strategies ranked by total score
- **Strategy Cards**: Each strategy as an interactive card with:
  - Strategy name and brief description
  - "Best match" label for highest score(s)
  - "Not possible" label for zero scores
  - Overall suitability indicator

##### 5.2 Detailed Strategy Analysis
For each strategy, display:

###### 5.2.1 Timing Suitability
- **Description**: Explanation of how timeline factors affect this strategy
- **Indicator**: Positive/Neutral/Negative visual indicator
- **Details**: Specific timeline considerations

###### 5.2.2 Market Dynamics
- **Description**: How current market conditions favor/oppose this strategy
- **Market Trend Data**: Price growth trends for both properties
- **Indicator**: Positive/Neutral/Negative visual indicator

###### 5.2.3 Lifestyle Impact
- **Description**: Expected lifestyle disruption level
- **Moving Requirements**: Number of moves, temporary accommodation needs
- **Indicator**: Low/Medium/High impact indicator

###### 5.2.4 Estimated Costs
- **Cost Breakdown**: Strategy-specific costs (bridging finance, moving, accommodation)
- **Cost Range**: Minimum to maximum estimated costs
- **Cost Categories**: Itemized list of relevant cost types

###### 5.2.5 Financing Requirements
- **Shortfall Calculation**: Estimated financing gap
- **Loan Amount**: Required borrowing for strategy execution
- **Action Required**: Specific next steps (refinance, pre-approval, top-up)
- **LVR Impact**: How this strategy affects loan-to-value ratios

#### Acceptance Criteria
- [ ] Strategies ranked correctly by scoring algorithm
- [ ] "Best match" labels applied to highest scores
- [ ] "Not possible" labels applied to zero scores
- [ ] All analysis dimensions display for each strategy
- [ ] Visual indicators clearly communicate positive/negative/neutral assessments
- [ ] Cost estimates realistic and strategy-appropriate
- [ ] Financing calculations account for current equity and new property costs
- [ ] Recommendations include specific next steps

## Scoring Algorithm Specification

### Strategy Definitions
1. **Buy Before You Sell (BBYS)**: Purchase new property before selling existing property
2. **Sell Before You Buy (SBYB)**: Sell existing property before purchasing new property
3. **Simultaneous Settlement (SS)**: Coordinate settlements to occur on the same day
4. **Buy and Keep (BK)**: Purchase new property while retaining existing property as investment

### Scoring Dimensions

#### 1. Timeline Scoring (Both Dates Known)
```typescript
interface TimelineBothKnown {
  sameSettlementDate: {
    SS: 1, BBYS: 0, SBYB: 0, BK: 0
  };
  purchaseAfterExisting: {
    SBYB: 1, BBYS: 0, SS: 0, BK: 0
  };
  existingAfterPurchase: {
    BBYS: 1, SBYB: 0, SS: 0, BK: 0
  };
  bothUnknown: {
    BBYS: 1, SBYB: 1, SS: 1, BK: 1
  };
}
```

#### 2. Timeline Scoring (One Date Known)
```typescript
interface TimelineOneKnown {
  newPropertyWithin30Days: {
    BBYS: 2, SBYB: -1, SS: 0, BK: 1
  };
  existingPropertyWithin30Days: {
    BBYS: -1, SBYB: 2, SS: 0, BK: 0
  };
  newPropertyAfter30Days: {
    BBYS: 2, SBYB: 0, SS: 1, BK: 1
  };
  existingPropertyAfter30Days: {
    BBYS: 0, SBYB: 2, SS: 1, BK: -1
  };
}
```

#### 3. Market Dynamics Scoring
```typescript
interface MarketDynamics {
  bothGrowing: {
    BBYS: 2, SBYB: 0, SS: 1, BK: 1
  };
  bothDeclining: {
    BBYS: 0, SBYB: 2, SS: 1, BK: 1
  };
  newGrowingCurrentDeclining: {
    BBYS: 0, SBYB: 0, SS: 1, BK: 1
  };
  newDecliningCurrentGrowing: {
    BBYS: 0, SBYB: 0, SS: 1, BK: 1
  };
}
```

#### 4. Lifestyle Impact Scoring
```typescript
interface LifestyleImpact {
  minimalDisruption: {
    BBYS: 2, SBYB: 0, SS: 2, BK: 1
  };
  adaptFewMonths: {
    BBYS: 1, SBYB: 1, SS: 1, BK: 1
  };
  comfortableWithMoves: {
    BBYS: 0, SBYB: 2, SS: 1, BK: 1
  };
}
```

### Final Score Calculation
```typescript
function calculateFinalScore(strategy: Strategy): number {
  const baseScore = 
    timelineScore[strategy] + 
    marketDynamicsScore[strategy] + 
    lifestyleScore[strategy];
  
  const timelineMultiplier = getTimelineMultiplier();
  return baseScore * timelineMultiplier;
}
```

## Data Schema Requirements

### Core Data Models

#### User Session Data
```typescript
interface UserSession {
  sessionId: string;
  currentStep: number;
  completedSteps: number[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}
```

#### Current Property Data
```typescript
interface CurrentProperty {
  // PropTrack Data
  propertyId: string;
  address: PropertyAddress;
  propTrackValuation: PropertyValuation;
  attributes: PropertyAttributes;
  images: PropertyImage[];
  marketData: PropertyMarketData;
  
  // User Inputs
  userValuationOverride?: number;
  currentLoanBalance: number;
  userAttributeOverrides?: Partial<PropertyAttributes>;
  
  // Calculated Fields
  equity: number;
  availableEquity: number;
  maxLVR: number;
  lendingEligible: boolean;
}
```

#### Target Property Data
```typescript
interface TargetProperty {
  // Property-specific (if address selected)
  propertyId?: string;
  address?: PropertyAddress;
  propTrackValuation?: PropertyValuation;
  attributes?: PropertyAttributes;
  images?: PropertyImage[];
  marketData?: PropertyMarketData;
  
  // Suburb-specific (if suburb selected)
  suburb?: SuburbData;
  selectedPropertyType?: PropertyType;
  selectedBedrooms?: number;
  estimatedValue?: number;
  
  // User Inputs
  savingsForPurchase: number;
  additionalCashToBorrow: number;
  userValuationOverride?: number;
  userAttributeOverrides?: Partial<PropertyAttributes>;
}
```

#### Personal Circumstances
```typescript
interface PersonalCircumstances {
  existingPropertyProgress: ExistingPropertyProgress;
  existingSettlementDate?: Date;
  newPropertyProgress: NewPropertyProgress;
  newSettlementDate?: Date;
  lifestyleImpactTolerance: LifestyleImpactLevel;
}

enum ExistingPropertyProgress {
  NotListed = 'not_listed',
  Listed = 'listed',
  Sold = 'sold',
  Settled = 'settled'
}

enum NewPropertyProgress {
  Looking = 'looking',
  Bought = 'bought',
  Settled = 'settled'
}

enum LifestyleImpactLevel {
  MinimalDisruption = 'minimal_disruption',
  AdaptFewMonths = 'adapt_few_months',
  ComfortableWithMoves = 'comfortable_with_moves'
}
```

#### Strategy Recommendations
```typescript
interface StrategyRecommendations {
  strategies: StrategyAnalysis[];
  calculatedAt: Date;
  inputSummary: AnalysisInputSummary;
}

interface StrategyAnalysis {
  strategy: PropertyStrategy;
  totalScore: number;
  ranking: number;
  label: StrategyLabel;
  
  analysis: {
    timingSuitability: AnalysisDimension;
    marketDynamics: AnalysisDimension;
    lifestyleImpact: AnalysisDimension;
    estimatedCosts: CostAnalysis;
    financingRequirements: FinancingAnalysis;
  };
}

enum PropertyStrategy {
  BuyBeforeYouSell = 'bbys',
  SellBeforeYouBuy = 'sbyb',
  SimultaneousSettlement = 'ss',
  BuyAndKeep = 'bk'
}

enum StrategyLabel {
  BestMatch = 'best_match',
  NotPossible = 'not_possible',
  Standard = 'standard'
}
```

### Supporting Data Models

#### Property Address
```typescript
interface PropertyAddress {
  fullAddress: string;
  unitNumber?: string;
  streetNumber: string;
  streetName: string;
  streetType: string;
  suburb: string;
  state: string;
  postcode: string;
}
```

#### Property Attributes
```typescript
interface PropertyAttributes {
  propertyType: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  carSpaces?: number;
  landArea?: number; // square meters
  livingArea?: number; // square meters
}

enum PropertyType {
  House = 'house',
  Unit = 'unit',
  Townhouse = 'townhouse',
  Apartment = 'apartment'
}
```

#### Property Valuation
```typescript
interface PropertyValuation {
  estimatedValue: number;
  upperRangeValue: number;
  lowerRangeValue: number;
  confidenceLevel: ConfidenceLevel;
  valuationDate: Date;
  disclaimer: string;
}

enum ConfidenceLevel {
  HighConfidence = 'HIGH CONFIDENCE',
  MediumConfidence = 'MEDIUM CONFIDENCE',
  LowConfidence = 'LOW CONFIDENCE',
  VeryLowConfidence = 'VERY LOW CONFIDENCE'
}
```

#### Market Data
```typescript
interface PropertyMarketData {
  medianSalePrice: number;
  priceGrowth12Months: number;
  medianDaysOnMarket: number;
  supplyAndDemand: SupplyDemandData;
  trend: MarketTrend;
}

interface SuburbData {
  suburb: string;
  state: string;
  postcode: string;
  medianSalePrice: number;
  priceGrowth12Months: number;
  marketData: PropertyMarketData;
  propertyTypeSplit: PropertyTypeSplit;
}

enum MarketTrend {
  Growing = 'growing',
  Declining = 'declining',
  Stable = 'stable'
}
```

#### Analysis Dimensions
```typescript
interface AnalysisDimension {
  score: number;
  indicator: SuitabilityIndicator;
  description: string;
  details: string[];
}

enum SuitabilityIndicator {
  Positive = 'positive',
  Neutral = 'neutral',
  Negative = 'negative'
}
```

#### Cost Analysis
```typescript
interface CostAnalysis {
  totalEstimatedCosts: CostRange;
  costBreakdown: CostItem[];
  relevantCostTypes: CostType[];
}

interface CostRange {
  minimum: number;
  maximum: number;
}

interface CostItem {
  type: CostType;
  description: string;
  estimatedCost: CostRange;
}

enum CostType {
  BridgingFinance = 'bridging_finance',
  MovingCosts = 'moving_costs',
  TemporaryAccommodation = 'temporary_accommodation',
  StampDuty = 'stamp_duty',
  LegalFees = 'legal_fees',
  RealEstateCommission = 'real_estate_commission',
  LoanEstablishmentFees = 'loan_establishment_fees'
}
```

#### Financing Analysis
```typescript
interface FinancingAnalysis {
  estimatedShortfall: number;
  requiredLoanAmount: number;
  recommendedAction: FinancingAction;
  lvrImpact: LVRAnalysis;
  borrowingCapacity: BorrowingCapacityAnalysis;
}

enum FinancingAction {
  Refinance = 'refinance',
  PreApproval = 'pre_approval',
  RefinanceAndTopUp = 'refinance_and_top_up',
  NewLoan = 'new_loan'
}

interface LVRAnalysis {
  currentLVR: number;
  projectedLVR: number;
  maxAllowableLVR: number;
  withinPolicy: boolean;
}
```

## Technical Implementation Requirements

### State Management
- Use React Context for global application state
- Session storage persistence for form data
- Cross-tab synchronization support
- Optimistic UI updates with error handling

### API Integration
- PropTrack API for property data and valuations
- Australia Post API for address/suburb search
- Real-time data updates with appropriate caching
- Comprehensive error handling and fallback strategies

### Backend Architecture
- Express.js server for secure API proxy functionality
- OAuth 2.0 Client Credentials Flow for PropTrack authentication
- In-memory token management with automatic refresh
- Environment-specific configuration (development/staging/production)
- CORS configuration for cross-origin requests
- Serverless deployment support (Vercel Functions, AWS Lambda)
- Comprehensive request/response logging and monitoring

### Performance Requirements
- Page load time < 2 seconds
- API response time < 1 second for property searches
- Smooth transitions between steps
- Responsive design for mobile/tablet/desktop

### Security & Privacy
- No sensitive data stored in browser
- API credentials properly secured
- User session management
- Data retention policies

## Success Metrics

### User Engagement
- Completion rate through all 5 steps
- Time spent on each step
- Return visit rate
- Strategy selection distribution

### Technical Performance
- Page load times
- API response times
- Error rates
- User satisfaction scores

### Business Impact
- Lead generation quality
- Conversion to mortgage applications
- User feedback scores
- Strategy recommendation accuracy

## Implementation Phases

### Phase 1: Core Journey (Current Scope)
- Landing page with address search
- Current property analysis and data display
- Basic strategy scoring and recommendations

### Phase 2: Enhanced Features
- Target property/suburb selection
- Personal circumstances collection
- Complete strategy analysis with costs and financing

### Phase 3: Advanced Capabilities
- Market data integration
- Real-time valuation updates
- Advanced cost modeling
- Integration with lending policies

### Phase 4: Optimization
- Machine learning for improved recommendations
- A/B testing framework
- Advanced analytics and reporting
- Mobile app development