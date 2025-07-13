import { BridgingCalculationEngine } from '../logic/bridgingCalculationEngine';
import { BridgingInputs } from '../types/bridgingCalculator';

// Test case from user
const testInputs: BridgingInputs = {
  // Existing property
  existingPropertyValue: 1500000,
  existingDebt: 300000,
  sellingCostsPercent: 2.5,
  existingPropertyValuationShading: 5,
  salesProceedsToRetain: 0,
  
  // New property
  newPropertyValue: 800001,
  purchaseCostsPercent: 5.5,
  purchaseCostsCapitalised: true,
  additionalBorrowings: 50000,
  savings: 300000,
  
  // Price guarantee
  pgIncluded: false,
  pgFeeCapitalised: false,
  pgFeeAmount: 0,
  
  // Bridging product
  bridgingTermMonths: 12,
  bridgingRepaymentType: 'ICAP',
  bridgingInterestRate: 7.5,
  bridgingFeesNoEndDebtPercent: 0.75,
  bridgingFeesEndDebtAmount: 1500,
  bridgingFeesCapitalised: true,
  bridgeDebtServicingBuffer: 1,
  
  // Additional parameters (standard assumptions)
  contractOfSaleProvided: false,
  peakDebtMaxLvrWithCos: 85,
  peakDebtMaxLvrWithoutCos: 80,
  newPropertyMaxLvr: 90,
  maximumLoanAmount: 3000000,
  minimumLoanAmount: 100000
};

console.log('Running bridging calculator with convergence fix...\n');

const engine = new BridgingCalculationEngine();
const results = engine.calculate(testInputs);

console.log('=== RESULTS ===');
console.log(`Converged: ${results.converged ? 'YES' : 'NO'}`);
console.log(`Iterations: ${results.iterations}`);
console.log(`\nBridge debt: ${new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(results.bridgeDebt)}`);
console.log(`End debt: ${new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(results.endDebt)}`);
console.log(`FCAP: ${new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(results.fcap)}`);
console.log(`Peak debt LVR (incl ICAP): ${(results.peakDebtLvrInclIcap * 100).toFixed(2)}%`);
console.log(`Additional cash required: ${new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(results.additionalCashRequired)}`);
console.log(`Shortfall: ${new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(results.shortfall)}`);

// Show relevant iteration logs
const iterationLines = results.iterationLog.split('\n');
const relevantLines = iterationLines.filter(line => 
  line.includes('=== Iteration') || 
  line.includes('endDebtCalc:') || 
  line.includes('endDebtNew:') ||
  line.includes('Converged after') ||
  line.includes('checkValue:')
);

console.log('\n=== ITERATION SUMMARY ===');
relevantLines.forEach(line => console.log(line));