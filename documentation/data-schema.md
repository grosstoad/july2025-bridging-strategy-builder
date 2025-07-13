# Data Schema - Property Strategy Builder

## Overview

This document defines the complete data schema for the Property Strategy Builder application, including all input and output data structures, API response models, and internal application state.

## Core Application Data Models

### 1. Application State

#### UserSession
```typescript
interface UserSession {
  sessionId: string;                    // Unique session identifier
  userId?: string;                      // Optional user ID for authenticated sessions
  currentStep: ApplicationStep;         // Current step in the user journey
  completedSteps: ApplicationStep[];    // Array of completed steps
  startedAt: Date;                      // Session start timestamp
  lastActivityAt: Date;                 // Last user interaction timestamp
  expiresAt: Date;                      // Session expiration timestamp
  deviceInfo?: DeviceInfo;              // Optional device/browser information
}

enum ApplicationStep {
  Landing = 1,
  CurrentProperty = 2,
  TargetProperty = 3,
  PersonalCircumstances = 4,
  StrategyRecommendations = 5
}

interface DeviceInfo {
  userAgent: string;
  screenResolution: string;
  browserName: string;
  browserVersion: string;
}
```

#### ApplicationContext
```typescript
interface ApplicationContext {
  session: UserSession;
  currentProperty?: CurrentPropertyData;
  targetProperty?: TargetPropertyData;
  personalCircumstances?: PersonalCircumstancesData;
  strategyRecommendations?: StrategyRecommendationsData;
  uiState: UIState;
  errors: ApplicationError[];
}

interface UIState {
  isLoading: boolean;
  activeAutocomplete?: 'current' | 'target';
  lastSavedAt?: Date;
  hasUnsavedChanges: boolean;
  navigationHistory: ApplicationStep[];
}

interface ApplicationError {
  id: string;
  type: ErrorType;
  message: string;
  timestamp: Date;
  step?: ApplicationStep;
  severity: ErrorSeverity;
  resolved: boolean;
}

enum ErrorType {
  API_ERROR = 'api_error',
  VALIDATION_ERROR = 'validation_error',
  NETWORK_ERROR = 'network_error',
  SESSION_EXPIRED = 'session_expired'
}

enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}
```

### 2. Property Data Models

#### CurrentPropertyData
```typescript
interface CurrentPropertyData {
  // PropTrack Retrieved Data
  propertyId: string;                   // PropTrack property identifier
  address: PropertyAddress;            // Full address details
  propTrackData: PropTrackPropertyData; // Original PropTrack response
  
  // User Modifications
  userInputs: CurrentPropertyUserInputs;
  
  // Calculated Values
  calculations: CurrentPropertyCalculations;
  
  // Metadata
  lastUpdated: Date;
  dataSource: 'proptrack' | 'user_override';
}

interface CurrentPropertyUserInputs {
  attributeOverrides?: Partial<PropertyAttributes>;
  valuationOverride?: number;          // User's manual valuation
  currentLoanBalance: number;          // Outstanding mortgage balance
  manualPostcode?: string;             // If user needs to override postcode
}

interface CurrentPropertyCalculations {
  currentValuation: number;            // Final valuation (PropTrack or user override)
  equity: number;                      // Property value - loan balance
  availableEquity: number;             // Usable equity at max LVR
  maxLVR: number;                      // Maximum loan-to-value ratio for this property
  lendingEligible: boolean;            // Whether we lend in this area
  lvr: number;                         // Current loan-to-value ratio
}
```

#### TargetPropertyData
```typescript
interface TargetPropertyData {
  searchType: 'address' | 'suburb';    // How user searched for target
  
  // Address-based data (if searchType === 'address')
  propertySpecific?: {
    propertyId: string;
    address: PropertyAddress;
    propTrackData: PropTrackPropertyData;
    userInputs: TargetPropertyUserInputs;
  };
  
  // Suburb-based data (if searchType === 'suburb')
  suburbSpecific?: {
    suburb: string;
    state: string;
    postcode: string;
    suburbData: SuburbMarketData;
    userSelections: SuburbUserSelections;
  };
  
  // Common user inputs
  financialInputs: TargetPropertyFinancialInputs;
  
  // Calculated values
  calculations: TargetPropertyCalculations;
  
  lastUpdated: Date;
}

interface TargetPropertyUserInputs {
  attributeOverrides?: Partial<PropertyAttributes>;
  valuationOverride?: number;
}

interface SuburbUserSelections {
  propertyType: PropertyType;          // House or Unit
  bedrooms: number;                    // 1-4+
  estimatedValue?: number;             // Calculated based on selections
}

interface TargetPropertyFinancialInputs {
  savingsForPurchase: number;          // Available cash for deposit/costs
  additionalCashToBorrow: number;      // Extra borrowing needs
}

interface TargetPropertyCalculations {
  estimatedValue: number;              // Final estimated property value
  requiredDeposit: number;             // Minimum deposit needed
  totalPurchaseCosts: number;          // Stamp duty + fees + other costs
  totalCashRequired: number;           // Deposit + costs
  shortfall: number;                   // Gap between available funds and required
}
```

#### PropertyAddress
```typescript
interface PropertyAddress {
  fullAddress: string;                 // Complete formatted address
  unitNumber?: string;                 // Unit/apartment number
  streetNumber: string;                // Street number
  streetName: string;                  // Street name
  streetType: string;                  // Street type (St, Ave, Rd, etc.)
  suburb: string;                      // Suburb name
  state: string;                       // State abbreviation (NSW, VIC, etc.)
  postcode: string;                    // Postal code
  coordinate?: {                       // Optional GPS coordinates
    latitude: number;
    longitude: number;
  };
}
```

#### PropertyAttributes
```typescript
interface PropertyAttributes {
  propertyType: PropertyType;
  bedrooms?: number;                   // Number of bedrooms (1-10+)
  bathrooms?: number;                  // Number of bathrooms (1-5+)
  carSpaces?: number;                  // Number of car spaces (0-4+)
  landArea?: number;                   // Land area in square meters
  livingArea?: number;                 // Internal living area in square meters
  buildYear?: number;                  // Year property was built
  lotSize?: number;                    // Lot size (alternative to landArea)
}

enum PropertyType {
  House = 'house',
  Unit = 'unit',
  Townhouse = 'townhouse',
  Apartment = 'apartment',
  Villa = 'villa',
  Studio = 'studio',
  Duplex = 'duplex'
}
```

### 3. PropTrack API Response Models

#### PropTrackPropertyData
```typescript
interface PropTrackPropertyData {
  propertyId: string;
  address: PropertyAddress;
  attributes: PropertyAttributes;
  valuation: PropertyValuation;
  marketData: PropertyMarketData;
  images: PropertyImage[];
  floorplans: PropertyFloorplan[];
  listings: PropertyListing[];
  lastUpdated: Date;
  dataReliability: DataReliability;
}

interface PropertyValuation {
  estimatedValue: number;              // PropTrack AVM estimate
  upperRangeValue: number;             // Upper confidence range
  lowerRangeValue: number;             // Lower confidence range
  confidenceLevel: ConfidenceLevel;    // Confidence in estimate
  valuationDate: Date;                 // When valuation was generated
  methodology: string;                 // Valuation method used
  disclaimer: string;                  // Required disclaimer text
}

enum ConfidenceLevel {
  HighConfidence = 'HIGH CONFIDENCE',
  MediumConfidence = 'MEDIUM CONFIDENCE',
  LowConfidence = 'LOW CONFIDENCE',
  VeryLowConfidence = 'VERY LOW CONFIDENCE'
}

interface PropertyMarketData {
  marketStatus: MarketStatus[];        // Current market status
  medianSalePrice?: number;            // Suburb median (last 12 months)
  priceGrowth12Months?: number;        // Price growth percentage
  priceGrowth3Years?: number;          // 3-year price growth
  medianDaysOnMarket?: number;         // Average days to sell
  salesVolume12Months?: number;        // Number of sales
  trend: MarketTrend;                  // Overall market trend
  lastUpdated: Date;
}

enum MarketStatus {
  OffMarket = 'offMarket',
  ForSale = 'forSale',
  ForRent = 'forRent',
  RecentlySold = 'recentlySold'
}

enum MarketTrend {
  StrongGrowth = 'strong_growth',      // >10% annual growth
  ModerateGrowth = 'moderate_growth',  // 5-10% annual growth
  SlowGrowth = 'slow_growth',          // 0-5% annual growth
  Flat = 'flat',                       // -2% to 2% annual change
  Declining = 'declining'              // <-2% annual change
}

interface PropertyImage {
  id: string;
  url: string;
  type: ImageType;
  orderIndex: number;
  dateUploaded: Date;
  caption?: string;
}

enum ImageType {
  Property = 'property',
  Floorplan = 'floorplan',
  AgencyLogo = 'agency_logo'
}

interface PropertyListing {
  id: string;
  listingType: ListingType;
  priceDescription: string;
  listingDate: Date;
  agency?: string;
  agent?: string;
  status: ListingStatus;
}

enum ListingType {
  Sale = 'sale',
  Rent = 'rent'
}

enum ListingStatus {
  Active = 'active',
  Sold = 'sold',
  Withdrawn = 'withdrawn',
  Leased = 'leased'
}
```

#### SuburbMarketData
```typescript
interface SuburbMarketData {
  suburb: string;
  state: string;
  postcode: string;
  
  // Price data
  medianSalePrices: MedianPriceByType;
  priceGrowth: PriceGrowthData;
  
  // Market activity
  salesData: SalesActivityData;
  supplyDemand: SupplyDemandData;
  
  // Property composition
  propertyTypeSplit: PropertyTypeSplit;
  bedroomSplit: BedroomSplit;
  
  // Market insights
  marketInsights: MarketInsights;
  
  lastUpdated: Date;
}

interface MedianPriceByType {
  house?: number;
  unit?: number;
  townhouse?: number;
  apartment?: number;
  overall: number;
}

interface PriceGrowthData {
  growth3Months: number;               // 3-month price change %
  growth6Months: number;               // 6-month price change %
  growth12Months: number;              // 12-month price change %
  growth3Years: number;                // 3-year price change %
  annualizedGrowth: number;            // Annualized growth rate
}

interface SalesActivityData {
  salesVolume12Months: number;         // Number of sales
  medianDaysOnMarket: number;          // Average time to sell
  clearanceRate?: number;              // Auction clearance rate
  priceDiscountRate?: number;          // Average discount from listing
}

interface SupplyDemandData {
  totalListings: number;               // Current active listings
  newListings30Days: number;           // New listings last 30 days
  potentialBuyers?: number;            // Estimated buyer interest
  inventoryMonths?: number;            // Months of inventory
}

interface PropertyTypeSplit {
  house: number;                       // Percentage houses
  unit: number;                        // Percentage units
  townhouse: number;                   // Percentage townhouses
  other: number;                       // Other property types
}

interface BedroomSplit {
  oneBedroom: number;                  // Percentage 1br properties
  twoBedroom: number;                  // Percentage 2br properties
  threeBedroom: number;                // Percentage 3br properties
  fourPlusBedroom: number;             // Percentage 4+ br properties
}

interface MarketInsights {
  outlook: MarketOutlook;              // Market direction prediction
  seasonality: SeasonalityData;        // Seasonal patterns
  demographicTrends: DemographicData;  // Population and demographic trends
  investmentMetrics?: InvestmentMetrics; // Rental yields, etc.
}

enum MarketOutlook {
  VeryPositive = 'very_positive',
  Positive = 'positive',
  Neutral = 'neutral',
  Negative = 'negative',
  VeryNegative = 'very_negative'
}
```

### 4. Personal Circumstances

#### PersonalCircumstancesData
```typescript
interface PersonalCircumstancesData {
  existingProperty: ExistingPropertyProgress;
  targetProperty: TargetPropertyProgress;
  lifestyle: LifestylePreferences;
  timeline: TimelineData;
  lastUpdated: Date;
}

interface ExistingPropertyProgress {
  status: ExistingPropertyStatus;
  settlementDate?: Date;               // If listed, sold, or settled
  expectedSettlementDate?: Date;       // If estimated
  marketingStrategy?: string;          // How they plan to sell
  agentEngaged: boolean;               // Whether agent is engaged
}

enum ExistingPropertyStatus {
  NotListed = 'not_listed',
  Listed = 'listed',
  Sold = 'sold',
  Settled = 'settled'
}

interface TargetPropertyProgress {
  status: TargetPropertyStatus;
  settlementDate?: Date;               // If bought or settled
  expectedSettlementDate?: Date;       // If estimated
  searchDuration?: number;             // How long they've been looking (months)
  preApprovalStatus?: PreApprovalStatus;
}

enum TargetPropertyStatus {
  Looking = 'looking',
  Bought = 'bought',
  Settled = 'settled'
}

enum PreApprovalStatus {
  None = 'none',
  InProgress = 'in_progress',
  Approved = 'approved',
  Expired = 'expired'
}

interface LifestylePreferences {
  disruptionTolerance: LifestyleDisruptionLevel;
  familyConsiderations?: FamilyConsiderations;
  workConsiderations?: WorkConsiderations;
  housingPreferences?: HousingPreferences;
}

enum LifestyleDisruptionLevel {
  MinimalDisruption = 'minimal_disruption',     // Want to avoid moves/disruption
  AdaptFewMonths = 'adapt_few_months',          // Can handle short-term changes
  ComfortableWithMoves = 'comfortable_with_moves' // OK with multiple moves
}

interface FamilyConsiderations {
  hasChildren: boolean;
  childrenAges?: number[];
  schoolConsiderations: boolean;
  elderlyParents: boolean;
}

interface TimelineData {
  preferredTimeframe?: PreferredTimeframe;
  constraints: TimelineConstraint[];
  flexibility: TimelineFlexibility;
}

enum PreferredTimeframe {
  ASAP = 'asap',                       // As soon as possible
  ThreeMonths = 'three_months',        // Within 3 months
  SixMonths = 'six_months',            // Within 6 months
  TwelveMonths = 'twelve_months',      // Within 12 months
  Flexible = 'flexible'                // No specific timeline
}

interface TimelineConstraint {
  type: ConstraintType;
  description: string;
  impact: ConstraintImpact;
}

enum ConstraintType {
  SchoolTerm = 'school_term',
  WorkCommitments = 'work_commitments',
  LeaseExpiry = 'lease_expiry',
  FamilyEvents = 'family_events',
  Financial = 'financial',
  Seasonal = 'seasonal'
}

enum ConstraintImpact {
  MustAvoid = 'must_avoid',            // Hard constraint
  PreferAvoid = 'prefer_avoid',        // Soft constraint
  Neutral = 'neutral',                 // No impact
  PreferAlign = 'prefer_align',        // Beneficial timing
  MustAlign = 'must_align'             // Required timing
}
```

### 5. Strategy Analysis Models

#### StrategyRecommendationsData
```typescript
interface StrategyRecommendationsData {
  strategies: StrategyAnalysis[];
  inputSummary: AnalysisInputSummary;
  calculationMetadata: CalculationMetadata;
  generatedAt: Date;
  expiresAt: Date;                     // When recommendations should be recalculated
}

interface StrategyAnalysis {
  strategy: PropertyStrategy;
  totalScore: number;                  // Final calculated score
  rawScores: DimensionScores;          // Scores before timeline multiplier
  ranking: number;                     // 1-4 ranking
  label: StrategyLabel;                // Display label
  
  // Analysis dimensions
  analysis: {
    timingSuitability: AnalysisDimension;
    marketDynamics: AnalysisDimension;
    lifestyleImpact: AnalysisDimension;
    estimatedCosts: CostAnalysis;
    financingRequirements: FinancingAnalysis;
    riskAssessment: RiskAnalysis;
  };
  
  // Additional insights
  pros: string[];                      // Strategy advantages
  cons: string[];                      // Strategy disadvantages
  keyConsiderations: string[];         // Important points to consider
}

enum PropertyStrategy {
  BuyBeforeYouSell = 'bbys',           // Buy Before You Sell
  SellBeforeYouBuy = 'sbyb',           // Sell Before You Buy
  SimultaneousSettlement = 'ss',       // Simultaneous Settlement
  BuyAndKeep = 'bk'                    // Buy and Keep
}

enum StrategyLabel {
  BestMatch = 'best_match',            // Highest score(s)
  NotPossible = 'not_possible',        // Zero score
  Standard = 'standard'                // Regular option
}

interface DimensionScores {
  timelineScore: number;               // Timeline dimension score
  marketDynamicsScore: number;         // Market dynamics score
  lifestyleScore: number;              // Lifestyle impact score
  timelineMultiplier: number;          // Applied multiplier
}

interface AnalysisDimension {
  score: number;                       // Numeric score for this dimension
  indicator: SuitabilityIndicator;     // Visual indicator
  title: string;                       // Dimension title
  description: string;                 // Main description
  details: string[];                   // Detailed explanations
  reasoning: string;                   // Why this score was assigned
}

enum SuitabilityIndicator {
  VeryPositive = 'very_positive',      // Strong advantage
  Positive = 'positive',               // Advantage
  Neutral = 'neutral',                 // No strong advantage/disadvantage
  Negative = 'negative',               // Disadvantage
  VeryNegative = 'very_negative'       // Strong disadvantage
}
```

#### Cost Analysis Models
```typescript
interface CostAnalysis {
  totalEstimatedCosts: CostRange;
  costBreakdown: CostItem[];
  comparisonToOtherStrategies: CostComparison[];
  sensitivityAnalysis?: SensitivityData;
}

interface CostRange {
  minimum: number;                     // Best case scenario
  expected: number;                    // Most likely scenario
  maximum: number;                     // Worst case scenario
  confidence: ConfidenceLevel;         // Confidence in estimates
}

interface CostItem {
  category: CostCategory;
  description: string;
  estimatedCost: CostRange;
  frequency: CostFrequency;
  timing: CostTiming;
  optional: boolean;                   // Whether cost can be avoided
  details: string[];                   // Additional cost details
}

enum CostCategory {
  // Transaction costs
  StampDuty = 'stamp_duty',
  LegalFees = 'legal_fees',
  InspectionFees = 'inspection_fees',
  LoanEstablishmentFees = 'loan_establishment_fees',
  
  // Financing costs
  BridgingFinance = 'bridging_finance',
  InterestRateDifferential = 'interest_rate_differential',
  EarlyRepaymentPenalty = 'early_repayment_penalty',
  
  // Moving and temporary costs
  MovingCosts = 'moving_costs',
  TemporaryAccommodation = 'temporary_accommodation',
  StorageFees = 'storage_fees',
  
  // Selling costs
  RealEstateCommission = 'real_estate_commission',
  MarketingCosts = 'marketing_costs',
  StylingCosts = 'styling_costs',
  
  // Maintenance and holding costs
  CouncilRates = 'council_rates',
  InsurancePremiums = 'insurance_premiums',
  UtilityCosts = 'utility_costs',
  MaintenanceCosts = 'maintenance_costs'
}

enum CostFrequency {
  OneOff = 'one_off',                  // Single payment
  Monthly = 'monthly',                 // Monthly payment
  Quarterly = 'quarterly',             // Quarterly payment
  Annual = 'annual'                    // Annual payment
}

enum CostTiming {
  Upfront = 'upfront',                 // At start of strategy
  Settlement = 'settlement',           // At settlement
  Ongoing = 'ongoing',                 // Throughout strategy period
  Exit = 'exit'                        // When strategy completes
}

interface CostComparison {
  compareToStrategy: PropertyStrategy;
  costDifference: number;              // Positive = more expensive
  percentageDifference: number;        // Percentage difference
  significantDifferences: string[];    // Key cost differences
}
```

#### Financing Analysis Models
```typescript
interface FinancingAnalysis {
  estimatedShortfall: number;          // Funding gap
  requiredLoanAmount: number;          // Total borrowing needed
  recommendedActions: FinancingAction[];
  lvrAnalysis: LVRAnalysis;
  borrowingCapacity: BorrowingCapacityAnalysis;
  repaymentAnalysis: RepaymentAnalysis;
  risks: FinancingRisk[];
}

interface FinancingAction {
  type: FinancingActionType;
  description: string;
  urgency: ActionUrgency;
  estimatedTimeframe: string;
  requirements: string[];
  estimatedCosts?: CostRange;
}

enum FinancingActionType {
  Refinance = 'refinance',             // Refinance existing loan
  PreApproval = 'pre_approval',        // Get pre-approval for new loan
  TopUp = 'top_up',                    // Increase existing loan
  BridgingLoan = 'bridging_loan',      // Short-term bridging finance
  ConstructionLoan = 'construction_loan', // If building involved
  InvestmentLoan = 'investment_loan'   // For buy-and-keep strategy
}

enum ActionUrgency {
  Immediate = 'immediate',             // Needed now
  Soon = 'soon',                       // Needed within 30 days
  Planning = 'planning',               // Can plan ahead
  Future = 'future'                    // Needed later in process
}

interface LVRAnalysis {
  currentProperty: {
    currentLVR: number;
    projectedLVR: number;              // After strategy implementation
    maxAllowableLVR: number;
    lvrBuffer: number;                 // Buffer below max LVR
  };
  targetProperty: {
    requiredLVR: number;
    maxAllowableLVR: number;
    depositRequired: number;
    lvrCompliant: boolean;
  };
  combined?: {                         // For buy-and-keep strategy
    totalDebt: number;
    totalPropertyValue: number;
    combinedLVR: number;
    policyCompliant: boolean;
  };
}

interface BorrowingCapacityAnalysis {
  estimatedBorrowingCapacity: number;
  currentCommitments: number;
  availableCapacity: number;
  utilizationPercentage: number;
  assumptions: BorrowingAssumption[];
  sensitivityFactors: SensitivityFactor[];
}

interface BorrowingAssumption {
  factor: string;                      // What was assumed
  value: string | number;              // Assumed value
  impact: string;                      // How it affects capacity
}

interface RepaymentAnalysis {
  currentRepayments: number;
  projectedRepayments: number;
  repaymentIncrease: number;
  affordabilityRatio: number;          // Repayments as % of income
  paymentScheduleOptions: PaymentOption[];
}

interface PaymentOption {
  type: PaymentType;
  monthlyPayment: number;
  totalInterest: number;
  payoffTime: number;                  // Months
  suitability: SuitabilityIndicator;
}

enum PaymentType {
  PrincipalAndInterest = 'principal_and_interest',
  InterestOnly = 'interest_only',
  InterestOnlyThenPI = 'interest_only_then_pi',
  OffsetAccount = 'offset_account'
}
```

#### Risk Analysis Models
```typescript
interface RiskAnalysis {
  overallRiskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  mitigationStrategies: MitigationStrategy[];
  riskComparison: StrategyRiskComparison;
}

enum RiskLevel {
  VeryLow = 'very_low',
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  VeryHigh = 'very_high'
}

interface RiskFactor {
  category: RiskCategory;
  description: string;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  severity: RiskSeverity;
  explanation: string;
}

enum RiskCategory {
  Market = 'market',                   // Market volatility risks
  Financing = 'financing',             // Loan/credit risks
  Timing = 'timing',                   // Timeline coordination risks
  Legal = 'legal',                     // Contract/legal risks
  Personal = 'personal',               // Personal circumstance risks
  Property = 'property'                // Property-specific risks
}

enum RiskLikelihood {
  VeryUnlikely = 'very_unlikely',      // <5% chance
  Unlikely = 'unlikely',               // 5-20% chance
  Possible = 'possible',               // 20-50% chance
  Likely = 'likely',                   // 50-80% chance
  VeryLikely = 'very_likely'           // >80% chance
}

enum RiskImpact {
  Minimal = 'minimal',                 // <$5K impact
  Minor = 'minor',                     // $5K-$20K impact
  Moderate = 'moderate',               // $20K-$50K impact
  Major = 'major',                     // $50K-$100K impact
  Severe = 'severe'                    // >$100K impact
}

interface MitigationStrategy {
  riskCategory: RiskCategory;
  strategy: string;
  effectiveness: MitigationEffectiveness;
  cost: CostRange;
  implementation: string;
}

enum MitigationEffectiveness {
  Low = 'low',                         // Reduces risk by <25%
  Medium = 'medium',                   // Reduces risk by 25-50%
  High = 'high',                       // Reduces risk by 50-75%
  VeryHigh = 'very_high'               // Reduces risk by >75%
}
```

### 6. Supporting Data Models

#### Calculation Metadata
```typescript
interface CalculationMetadata {
  version: string;                     // Algorithm version
  inputHash: string;                   // Hash of input data
  calculationId: string;               // Unique calculation ID
  processingTime: number;              // Time taken (milliseconds)
  dataSourceVersions: DataSourceVersion[];
  assumptions: CalculationAssumption[];
  disclaimers: string[];
}

interface DataSourceVersion {
  source: DataSource;
  version: string;
  lastUpdated: Date;
}

enum DataSource {
  PropTrack = 'proptrack',
  AustraliaPost = 'australia_post',
  InternalLogic = 'internal_logic',
  MarketData = 'market_data',
  LendingPolicy = 'lending_policy'
}

interface CalculationAssumption {
  category: AssumptionCategory;
  description: string;
  value: string | number;
  rationale: string;
  sensitivity: SensitivityLevel;       // How much this affects results
}

enum AssumptionCategory {
  InterestRates = 'interest_rates',
  PropertyGrowth = 'property_growth',
  TransactionCosts = 'transaction_costs',
  LendingCriteria = 'lending_criteria',
  MarketConditions = 'market_conditions',
  Timeframes = 'timeframes'
}

enum SensitivityLevel {
  Low = 'low',                         // <5% impact on results
  Medium = 'medium',                   // 5-15% impact on results
  High = 'high'                        // >15% impact on results
}
```

#### Analysis Input Summary
```typescript
interface AnalysisInputSummary {
  currentProperty: {
    address: string;
    estimatedValue: number;
    loanBalance: number;
    equity: number;
  };
  targetProperty: {
    type: 'address' | 'suburb';
    location: string;
    estimatedValue: number;
    requiredFunding: number;
  };
  circumstances: {
    existingPropertyStatus: ExistingPropertyStatus;
    targetPropertyStatus: TargetPropertyStatus;
    lifestylePreference: LifestyleDisruptionLevel;
  };
  timeline: {
    existingSettlement?: Date;
    targetSettlement?: Date;
    timelineScenario: TimelineScenario;
  };
  market: {
    currentPropertyTrend: MarketTrend;
    targetPropertyTrend: MarketTrend;
    marketScenario: MarketScenario;
  };
}

enum TimelineScenario {
  BothKnown = 'both_known',
  OneKnown = 'one_known',
  NeitherKnown = 'neither_known',
  SameDate = 'same_date',
  SequentialKnown = 'sequential_known'
}

enum MarketScenario {
  BothGrowing = 'both_growing',
  BothDeclining = 'both_declining',
  MixedGrowth = 'mixed_growth',
  StableMarkets = 'stable_markets'
}
```

## API Response Models

### PropTrack API Responses

#### Address Suggestions Response
```typescript
interface AddressSuggestionsResponse {
  results: AddressSuggestion[];
  metadata: {
    query: string;
    resultCount: number;
    maxResults: number;
    processingTime: number;
  };
}

interface AddressSuggestion {
  id: string;
  propertyId?: string;
  address: {
    fullAddress: string;
    unitNumber?: string;
    streetNumber: string;
    streetName: string;
    streetType: string;
    suburb: string;
    state: string;
    postcode: string;
  };
  relevanceScore: number;              // 0-1 relevance score
}
```

#### Property Summary Response
```typescript
interface PropertySummaryResponse {
  propertyId: string;
  address: PropertyAddress;
  attributes: PropertyAttributes;
  valuation: PropertyValuation;
  marketData: PropertyMarketData;
  images: PropertyImage[];
  floorplans: PropertyImage[];
  marketStatus: MarketStatus[];
  activeListings: PropertyListing[];
  metadata: {
    dataQuality: DataQuality;
    lastUpdated: Date;
    sources: string[];
  };
}

interface DataQuality {
  completeness: number;                // 0-1 completeness score
  freshness: number;                   // 0-1 freshness score
  accuracy: number;                    // 0-1 accuracy score
  reliability: DataReliability;
}

enum DataReliability {
  VeryHigh = 'very_high',              // Government records, recent sales
  High = 'high',                       // Multiple verified sources
  Medium = 'medium',                   // Some verified sources
  Low = 'low',                         // Limited sources
  VeryLow = 'very_low'                 // Estimated/modeled data
}
```

### Australia Post API Responses

#### Suburb Search Response
```typescript
interface SuburbSearchResponse {
  localities: {
    locality: AustraliaPostLocalityItem[];
  };
}

interface AustraliaPostLocalityItem {
  location: string;                    // Suburb name
  postcode: string;
  state: string;
  latitude?: number;
  longitude?: number;
  category: string;                    // Type of locality
}
```

## Form Validation Schema

### Validation Rules
```typescript
interface ValidationSchema {
  currentProperty: {
    loanBalance: {
      required: true;
      min: 0;
      max: 10000000;                   // $10M max
      type: 'currency';
    };
    valuationOverride: {
      required: false;
      min: 100000;                     // $100K min
      max: 50000000;                   // $50M max
      type: 'currency';
    };
    attributes: {
      bedrooms: { min: 1, max: 10 };
      bathrooms: { min: 1, max: 8 };
      carSpaces: { min: 0, max: 10 };
      landArea: { min: 50, max: 100000 }; // 50sqm to 100 hectares
      livingArea: { min: 30, max: 5000 }; // 30sqm to 5000sqm
    };
  };
  targetProperty: {
    savingsForPurchase: {
      required: true;
      min: 0;
      max: 10000000;
      type: 'currency';
    };
    additionalCashToBorrow: {
      required: false;
      min: 0;
      max: 5000000;
      type: 'currency';
    };
  };
  personalCircumstances: {
    settlementDates: {
      minDate: () => new Date();       // Cannot be in past
      maxDate: () => addYears(new Date(), 2); // Max 2 years future
    };
  };
}
```

## Error Handling Schema

### API Error Responses
```typescript
interface APIErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: Date;
    requestId: string;
  };
  retryable: boolean;
  suggestedAction?: string;
}

enum APIErrorCode {
  // PropTrack errors
  PROPERTY_NOT_FOUND = 'PROPERTY_NOT_FOUND',
  INVALID_PROPERTY_ID = 'INVALID_PROPERTY_ID',
  VALUATION_UNAVAILABLE = 'VALUATION_UNAVAILABLE',
  
  // Australia Post errors
  SUBURB_NOT_FOUND = 'SUBURB_NOT_FOUND',
  INVALID_POSTCODE = 'INVALID_POSTCODE',
  
  // Application errors
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CALCULATION_ERROR = 'CALCULATION_ERROR',
  
  // System errors
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  NETWORK_ERROR = 'NETWORK_ERROR'
}
```

## Data Migration and Versioning

### Schema Versioning
```typescript
interface SchemaVersion {
  version: string;                     // Semantic version (e.g., "1.2.0")
  releaseDate: Date;
  changes: SchemaChange[];
  backwardCompatible: boolean;
  migrationRequired: boolean;
}

interface SchemaChange {
  type: ChangeType;
  description: string;
  affectedModels: string[];
  breakingChange: boolean;
}

enum ChangeType {
  Added = 'added',
  Modified = 'modified',
  Deprecated = 'deprecated',
  Removed = 'removed'
}
```

This comprehensive data schema provides the foundation for implementing the Property Strategy Builder with full type safety, proper error handling, and extensibility for future enhancements.