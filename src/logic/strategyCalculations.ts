import { BridgingCalculationEngine } from './bridgingCalculationEngine';
import { BridgingInputs } from '../types/bridgingCalculator';

export interface StrategyCalculationInputs {
  currentPropertyValue: number;
  newPropertyValue: number;
  existingDebt: number;
  savings: number;
  timeBetween: number;
  additionalBorrowings?: number;
  sellingCostsPercent?: number;
  purchaseCostsPercent?: number;
  bridgingInterestRate?: number;
  endLoanRate?: number;
  loanTerm?: number;
}

export interface StrategyCalculationOutputs {
  endDebt: number;
  monthlyRepayment: number;
  bridgingLoanAmount: number;
  bridgingLoanCosts?: number;
  noLoanRequired: boolean;
}

// PMT function implementation (Excel-compatible)
const PMT = (rate: number, nper: number, pv: number): number => {
  if (rate === 0) return -pv / nper;
  const pvif = Math.pow(1 + rate, nper);
  return -rate * pv * pvif / (pvif - 1);
};

// Buy Before You Sell (BBYS) calculation
export const calculateBBYS = (inputs: StrategyCalculationInputs): StrategyCalculationOutputs => {
  // Use default values if not provided
  const sellingCostsPercent = inputs.sellingCostsPercent ?? 2.5;
  const purchaseCostsPercent = inputs.purchaseCostsPercent ?? 5.5;
  const bridgingInterestRate = inputs.bridgingInterestRate ?? 7.5;
  const endLoanRate = inputs.endLoanRate ?? 5.5;
  const loanTerm = inputs.loanTerm ?? 30;

  // Create inputs for bridging calculator
  const bridgingInputs: BridgingInputs = {
    existingPropertyValue: inputs.currentPropertyValue,
    existingDebt: inputs.existingDebt,
    sellingCostsPercent,
    newPropertyValue: inputs.newPropertyValue,
    purchaseCostsPercent,
    purchaseCostsCapitalised: true,
    additionalBorrowings: inputs.additionalBorrowings || 0,
    savings: inputs.savings,
    contractOfSaleProvided: false,
    bridgingTermMonths: inputs.timeBetween,
    bridgingInterestRate,
    bridgingRepaymentType: 'ICAP', // Interest capitalised
    bridgingFeesCapitalised: true,
    bridgingFeesNoEndDebtPercent: 0.8,
    bridgingFeesEndDebtAmount: 5000,
    pgIncluded: false,
    pgFeeCapitalised: false,
    pgFeeAmount: 0,
    existingPropertyValuationShading: 10,
    salesProceedsToRetain: 0,
    peakDebtMaxLvrWithCos: 80,
    peakDebtMaxLvrWithoutCos: 70,
    newPropertyMaxLvr: 80,
    maximumLoanAmount: 5000000,
    minimumLoanAmount: 50000,
    bridgeDebtServicingBuffer: 2
  };

  // Use existing bridging calculator for BBYS
  const calculator = new BridgingCalculationEngine();
  const results = calculator.calculate(bridgingInputs);

  // For BBYS, the end debt is simply the end debt from the bridging calculator
  // The bridging calculator already accounts for everything:
  // - Purchase of new property
  // - Sale of existing property
  // - All costs and fees
  // - Bridge loan and its costs
  const endDebt = Math.max(0, results.endDebt);
  
  // Calculate monthly repayment
  const monthlyRepayment = endDebt > 0 ? PMT(endLoanRate / 100 / 12, loanTerm * 12, endDebt) : 0;

  return {
    endDebt,
    monthlyRepayment,
    bridgingLoanAmount: results.bridgeDebt,
    bridgingLoanCosts: results.fcap,
    noLoanRequired: endDebt <= 0
  };
};

// Sell Before You Buy (SBYB) calculation
export const calculateSBYB = (inputs: StrategyCalculationInputs): StrategyCalculationOutputs => {
  const sellingCostsPercent = inputs.sellingCostsPercent ?? 2.5;
  const purchaseCostsPercent = inputs.purchaseCostsPercent ?? 5.5;
  const endLoanRate = inputs.endLoanRate ?? 5.5;
  const loanTerm = inputs.loanTerm ?? 30;

  // Calculate net proceeds from sale
  const sellingCosts = inputs.currentPropertyValue * (sellingCostsPercent / 100);
  const netSaleProceeds = inputs.currentPropertyValue - sellingCosts - inputs.existingDebt;

  // Calculate purchase costs
  const purchaseCosts = inputs.newPropertyValue * (purchaseCostsPercent / 100);

  // End debt calculation
  const endDebt = Math.max(0, inputs.newPropertyValue + purchaseCosts - netSaleProceeds - inputs.savings + (inputs.additionalBorrowings || 0));

  // Calculate monthly repayment
  const monthlyRepayment = endDebt > 0 ? PMT(endLoanRate / 100 / 12, loanTerm * 12, endDebt) : 0;

  return {
    endDebt,
    monthlyRepayment,
    bridgingLoanAmount: 0,
    noLoanRequired: endDebt <= 0
  };
};

// Keep Both (KB) calculation
export const calculateKB = (inputs: StrategyCalculationInputs): StrategyCalculationOutputs => {
  const purchaseCostsPercent = inputs.purchaseCostsPercent ?? 5.5;
  const endLoanRate = inputs.endLoanRate ?? 5.5;
  const loanTerm = inputs.loanTerm ?? 30;

  // Calculate purchase costs
  const purchaseCosts = inputs.newPropertyValue * (purchaseCostsPercent / 100);

  // End debt = existing debt + new property + costs - savings + additional borrowings
  const endDebt = inputs.existingDebt + inputs.newPropertyValue + purchaseCosts - inputs.savings + (inputs.additionalBorrowings || 0);

  // Calculate monthly repayment
  const monthlyRepayment = PMT(endLoanRate / 100 / 12, loanTerm * 12, endDebt);

  return {
    endDebt,
    monthlyRepayment,
    bridgingLoanAmount: 0,
    noLoanRequired: false // Always need a loan when keeping both
  };
};

// Settle Same Day (SS) calculation
export const calculateSS = (inputs: StrategyCalculationInputs): StrategyCalculationOutputs => {
  // Same calculation as SBYB
  return calculateSBYB(inputs);
};

// Main calculation function that routes to the appropriate calculator
export const calculateScenario = (
  strategy: 'BBYS' | 'SBYB' | 'KB' | 'SS',
  inputs: StrategyCalculationInputs
): StrategyCalculationOutputs => {
  console.log(`\n=== Calculating ${strategy} Strategy ===`);
  console.log('Inputs:', {
    currentPropertyValue: inputs.currentPropertyValue.toLocaleString(),
    newPropertyValue: inputs.newPropertyValue.toLocaleString(),
    existingDebt: inputs.existingDebt.toLocaleString(),
    savings: inputs.savings.toLocaleString(),
    timeBetween: `${inputs.timeBetween} months`,
    sellingCostsPercent: inputs.sellingCostsPercent ?? 2.5,
    purchaseCostsPercent: inputs.purchaseCostsPercent ?? 5.5,
    bridgingInterestRate: inputs.bridgingInterestRate ?? 7.5,
    endLoanRate: inputs.endLoanRate ?? 5.5,
    loanTerm: inputs.loanTerm ?? 30
  });

  let result: StrategyCalculationOutputs;
  
  switch (strategy) {
    case 'BBYS':
      result = calculateBBYS(inputs);
      break;
    case 'SBYB':
      result = calculateSBYB(inputs);
      break;
    case 'KB':
      result = calculateKB(inputs);
      break;
    case 'SS':
      result = calculateSS(inputs);
      break;
    default:
      throw new Error(`Unknown strategy: ${strategy}`);
  }

  console.log('Outputs:', {
    endDebt: result.endDebt.toLocaleString(),
    monthlyRepayment: result.monthlyRepayment.toFixed(2),
    bridgingLoanAmount: result.bridgingLoanAmount.toLocaleString(),
    bridgingLoanCosts: result.bridgingLoanCosts?.toLocaleString() ?? 'N/A',
    noLoanRequired: result.noLoanRequired
  });

  return result;
};