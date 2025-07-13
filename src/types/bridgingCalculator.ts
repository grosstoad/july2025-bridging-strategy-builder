// Type definitions for the Bridging Calculator

export interface BridgingInputs {
  // Existing Property
  existingPropertyValue: number;
  existingDebt: number;
  sellingCostsPercent: number;
  contractOfSaleProvided: boolean;
  salesProceedsToRetain: number;
  
  // Price Guarantee
  pgIncluded: boolean;
  pgFeeAmount: number;
  pgFeeCapitalised: boolean;
  
  // New Property
  newPropertyValue: number;
  purchaseCostsPercent: number;
  purchaseCostsCapitalised: boolean;
  additionalBorrowings: number;
  savings: number;
  
  // Bridging Product
  bridgingTermMonths: number;
  bridgingRepaymentType: 'Interest Only' | 'ICAP';
  bridgingInterestRate: number;
  bridgingFeesNoEndDebtPercent: number;
  bridgingFeesEndDebtAmount: number;
  bridgingFeesCapitalised: boolean;
  
  // Assumptions
  peakDebtMaxLvrWithCos: number;
  peakDebtMaxLvrWithoutCos: number;
  existingPropertyValuationShading: number;
  newPropertyMaxLvr: number;
  bridgeDebtServicingBuffer: number;
  minimumLoanAmount: number;
  maximumLoanAmount: number;
}

export interface BridgingResults {
  // Basic calculations
  sellingCostsAmount: number;
  existingPropertyEquity: number;
  shadedValuation: number;
  shadedNetSalesProceeds: number;
  purchaseCostsAmount: number;
  additionalFundsRequired: number;
  peakDebtBeforeCap: number;
  peakShadedValuation: number;
  maxPeakDebtBeforeCap: number;
  
  // Iterative results
  bridgeDebt: number;
  bridgeDebtExcludingFcap: number;
  fcap: number;
  assessedIcap: number;
  peakDebtIncludingIcap: number;
  endDebt: number;
  
  // Final metrics
  shortfall: number;
  additionalCashRequired: number;
  peakDebtLvrExclIcap: number;
  peakDebtLvrInclIcap: number;
  endDebtLvr: number;
  checkValue: number;
  
  // Meta
  iterations: number;
  converged: boolean;
  iterationLog: string;
}

export interface CalculationConfig {
  solver: {
    maxIterations: number;
    convergenceTolerance: number;
    infinityProxy: number;
  };
  defaults: {
    sellingCostsPercent: number;
    purchaseCostsPercent: number;
    bridgingInterestRate: number;
    bridgingFeesNoEndDebtPercent: number;
    bridgingFeesEndDebtAmount: number;
    peakDebtMaxLvrWithCos: number;
    peakDebtMaxLvrWithoutCos: number;
    existingPropertyValuationShading: number;
    newPropertyMaxLvr: number;
    bridgeDebtServicingBuffer: number;
    minimumLoanAmount: number;
    maximumLoanAmount: number;
  };
  validation: {
    bridgingTermMin: number;
    bridgingTermMax: number;
    currencyTolerance: number;
    percentageTolerance: number;
  };
  repaymentTypes: {
    interestOnly: 'Interest Only';
    icap: 'ICAP';
  };
  booleanValues: {
    yes: 'Yes';
    no: 'No';
  };
}

export interface BasicCalculations {
  sellingCostsAmount: number;
  existingPropertyEquity: number;
  shadedValuation: number;
  shadedNetSalesProceeds: number;
  purchaseCostsAmount: number;
  additionalFundsRequired: number;
  peakDebtBeforeCap: number;
  peakShadedValuation: number;
  maxPeakDebtBeforeCap: number;
}

export interface IterativeCalculations {
  bridgeDebt: number;
  bridgeDebtExcludingFcap: number;
  fcap: number;
  assessedIcap: number;
  peakDebtIncludingIcap: number;
  endDebt: number;
  iterations: number;
  converged: boolean;
}

export interface BridgeDebtComponents {
  bridgeDebtExcludingFcap: number;
  fcap: number;
  assessedIcap: number;
}