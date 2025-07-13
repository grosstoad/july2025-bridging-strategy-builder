// Default configuration values for the Bridging Calculator
// These values are used when no user input is provided or when resetting to defaults

import { CalculationConfig } from '../types/bridgingCalculator';

export const BRIDGING_CALCULATOR_CONFIG: CalculationConfig = {
  solver: {
    maxIterations: 100,
    convergenceTolerance: 0.01,
    infinityProxy: 999999999
  },
  defaults: {
    // Costs and fees
    sellingCostsPercent: 2.5, // Real estate agent fees and other selling costs
    purchaseCostsPercent: 5.5, // Stamp duty, legal fees, and other purchase costs
    
    // Bridging product defaults
    bridgingInterestRate: 7.50, // Annual interest rate for bridge loan
    bridgingFeesNoEndDebtPercent: 0.75, // Fee percentage when no end debt exists
    bridgingFeesEndDebtAmount: 1500, // Fixed fee amount when end debt exists
    
    // LVR assumptions
    peakDebtMaxLvrWithCos: 85, // Maximum LVR when contract of sale exists
    peakDebtMaxLvrWithoutCos: 80, // Maximum LVR when no contract of sale
    existingPropertyValuationShading: 5, // Conservative discount on existing property value
    newPropertyMaxLvr: 85, // Maximum LVR for end debt on new property
    
    // Other assumptions
    bridgeDebtServicingBuffer: 1.00, // Additional rate buffer for ICAP calculations
    minimumLoanAmount: 100000, // Minimum allowable loan size
    maximumLoanAmount: 3000000 // Maximum allowable loan size
  },
  validation: {
    bridgingTermMin: 1, // Minimum bridging term in months
    bridgingTermMax: 12, // Maximum bridging term in months
    currencyTolerance: 0.01, // Tolerance for currency comparisons
    percentageTolerance: 0.0001 // Tolerance for percentage comparisons (0.01%)
  },
  repaymentTypes: {
    interestOnly: 'Interest Only',
    icap: 'ICAP'
  },
  booleanValues: {
    yes: 'Yes',
    no: 'No'
  }
};

// Helper function to get default inputs with all assumptions
export function getDefaultBridgingInputs() {
  return {
    // These will be populated from existing data
    existingPropertyValue: 0,
    existingDebt: 0,
    newPropertyValue: 0,
    additionalBorrowings: 0,
    savings: 0,
    
    // These use config defaults
    sellingCostsPercent: BRIDGING_CALCULATOR_CONFIG.defaults.sellingCostsPercent,
    contractOfSaleProvided: false,
    salesProceedsToRetain: 0,
    
    pgIncluded: false,
    pgFeeAmount: 0,
    pgFeeCapitalised: false,
    
    purchaseCostsPercent: BRIDGING_CALCULATOR_CONFIG.defaults.purchaseCostsPercent,
    purchaseCostsCapitalised: true,
    
    bridgingTermMonths: 6, // Default to 6 months
    bridgingRepaymentType: BRIDGING_CALCULATOR_CONFIG.repaymentTypes.icap as 'ICAP',
    bridgingInterestRate: BRIDGING_CALCULATOR_CONFIG.defaults.bridgingInterestRate,
    bridgingFeesNoEndDebtPercent: BRIDGING_CALCULATOR_CONFIG.defaults.bridgingFeesNoEndDebtPercent,
    bridgingFeesEndDebtAmount: BRIDGING_CALCULATOR_CONFIG.defaults.bridgingFeesEndDebtAmount,
    bridgingFeesCapitalised: true,
    
    peakDebtMaxLvrWithCos: BRIDGING_CALCULATOR_CONFIG.defaults.peakDebtMaxLvrWithCos,
    peakDebtMaxLvrWithoutCos: BRIDGING_CALCULATOR_CONFIG.defaults.peakDebtMaxLvrWithoutCos,
    existingPropertyValuationShading: BRIDGING_CALCULATOR_CONFIG.defaults.existingPropertyValuationShading,
    newPropertyMaxLvr: BRIDGING_CALCULATOR_CONFIG.defaults.newPropertyMaxLvr,
    bridgeDebtServicingBuffer: BRIDGING_CALCULATOR_CONFIG.defaults.bridgeDebtServicingBuffer,
    minimumLoanAmount: BRIDGING_CALCULATOR_CONFIG.defaults.minimumLoanAmount,
    maximumLoanAmount: BRIDGING_CALCULATOR_CONFIG.defaults.maximumLoanAmount
  };
}

// Helper function to estimate bridging term based on timeline selections
export function estimateBridgingTerm(
  preferredTimeToSell?: string,
  preferredTimeToBuy?: string
): number {
  // Map timeline options to approximate months
  const timelineToMonths: Record<string, number> = {
    'already_sold': 0,
    'already_bought': 0,
    'next_1_month': 1,
    'next_3_months': 3,
    'next_6_months': 6,
    'next_9_months': 9,
    'next_12_months': 12,
    'not_sure': 6 // Default to 6 months for uncertainty
  };
  
  const sellMonths = timelineToMonths[preferredTimeToSell || 'not_sure'] || 6;
  const buyMonths = timelineToMonths[preferredTimeToBuy || 'not_sure'] || 6;
  
  // Calculate bridging term
  let bridgingTerm: number;
  
  if (preferredTimeToSell === 'already_sold' && preferredTimeToBuy === 'already_bought') {
    bridgingTerm = 1; // Minimal bridging period
  } else if (preferredTimeToSell === 'already_sold') {
    bridgingTerm = Math.max(1, buyMonths + 1); // Add buffer for settlement
  } else if (preferredTimeToBuy === 'already_bought') {
    bridgingTerm = Math.max(1, sellMonths + 1); // Add buffer for settlement
  } else {
    // General case: difference between sell and buy timelines
    bridgingTerm = Math.max(1, Math.abs(buyMonths - sellMonths) + 2); // Add 2 months buffer
  }
  
  // Ensure within valid range
  return Math.min(
    BRIDGING_CALCULATOR_CONFIG.validation.bridgingTermMax,
    Math.max(BRIDGING_CALCULATOR_CONFIG.validation.bridgingTermMin, bridgingTerm)
  );
}