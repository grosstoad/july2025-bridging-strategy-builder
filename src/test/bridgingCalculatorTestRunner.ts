// Test runner for bridging calculator validation
import { BridgingCalculationEngine } from '../logic/bridgingCalculationEngine';
import { BridgingInputs, BridgingResults } from '../types/bridgingCalculator';

interface TestCase {
  name: string;
  inputs: BridgingInputs;
  expected: {
    sellingCostsAmount: number;
    existingPropertyEquity: number;
    shadedValuation: number;
    shadedNetSalesProceeds: number;
    purchaseCostsAmount: number;
    additionalFundsRequired: number;
    peakDebtBeforeCap: number;
    maxPeakDebtBeforeCap: number;
    bridgeDebt: number;
    bridgeDebtExcludingFcap: number;
    fcap: number;
    assessedIcap: number;
    peakDebtIncludingIcap: number;
    peakShadedValuation: number;
    peakDebtLvrExclIcap: number;
    peakDebtLvrInclIcap: number;
    endDebt: number;
    shortfall: number;
    additionalCashRequired: number;
    endDebtLvr: number;
    checkValue: number;
  };
}

// Test cases from CSV
export const testCases: TestCase[] = [
  {
    name: "Test case - initial debt >0 and <100",
    inputs: {
      existingPropertyValue: 1000000,
      existingDebt: 400000,
      sellingCostsPercent: 0,
      contractOfSaleProvided: false,
      salesProceedsToRetain: 0,
      pgIncluded: false,
      pgFeeAmount: 7500,
      pgFeeCapitalised: true,
      newPropertyValue: 800001,
      purchaseCostsPercent: 0,
      purchaseCostsCapitalised: true,
      additionalBorrowings: 50000,
      savings: 300000,
      bridgingTermMonths: 12,
      bridgingRepaymentType: 'ICAP',
      bridgingInterestRate: 7,
      bridgingFeesNoEndDebtPercent: 0.75,
      bridgingFeesEndDebtAmount: 1500,
      bridgingFeesCapitalised: false,
      peakDebtMaxLvrWithCos: 85,
      peakDebtMaxLvrWithoutCos: 80,
      existingPropertyValuationShading: 5,
      newPropertyMaxLvr: 85,
      bridgeDebtServicingBuffer: 1,
      minimumLoanAmount: 100000,
      maximumLoanAmount: 3000000
    },
    expected: {
      sellingCostsAmount: 0,
      existingPropertyEquity: 450000,
      shadedValuation: 950000,
      shadedNetSalesProceeds: 950000,
      purchaseCostsAmount: 0,
      additionalFundsRequired: 550001,
      peakDebtBeforeCap: 950001,
      maxPeakDebtBeforeCap: 1400000.8,
      bridgeDebt: 850000,
      bridgeDebtExcludingFcap: 850000,
      fcap: 0,
      assessedIcap: 70549.58079,
      peakDebtIncludingIcap: 1020550.581,
      peakShadedValuation: 1750001,
      peakDebtLvrExclIcap: 0.542857404,
      peakDebtLvrInclIcap: 0.583171427,
      endDebt: 100001,
      shortfall: 0,
      additionalCashRequired: 1500,
      endDebtLvr: 0.125001094,
      checkValue: 0
    }
  },
  {
    name: "No end debt (exact)",
    inputs: {
      existingPropertyValue: 1000000,
      existingDebt: 400000,
      sellingCostsPercent: 0,
      contractOfSaleProvided: false,
      salesProceedsToRetain: 0,
      pgIncluded: false,
      pgFeeAmount: 7500,
      pgFeeCapitalised: true,
      newPropertyValue: 800000,
      purchaseCostsPercent: 0,
      purchaseCostsCapitalised: true,
      additionalBorrowings: 50000,
      savings: 300000,
      bridgingTermMonths: 12,
      bridgingRepaymentType: 'ICAP',
      bridgingInterestRate: 7,
      bridgingFeesNoEndDebtPercent: 0.75,
      bridgingFeesEndDebtAmount: 1500,
      bridgingFeesCapitalised: false,
      peakDebtMaxLvrWithCos: 85,
      peakDebtMaxLvrWithoutCos: 80,
      existingPropertyValuationShading: 5,
      newPropertyMaxLvr: 85,
      bridgeDebtServicingBuffer: 1,
      minimumLoanAmount: 100000,
      maximumLoanAmount: 3000000
    },
    expected: {
      sellingCostsAmount: 0,
      existingPropertyEquity: 450000,
      shadedValuation: 950000,
      shadedNetSalesProceeds: 950000,
      purchaseCostsAmount: 0,
      additionalFundsRequired: 550000,
      peakDebtBeforeCap: 950000,
      maxPeakDebtBeforeCap: 1400000,
      bridgeDebt: 950000,
      bridgeDebtExcludingFcap: 950000,
      fcap: 0,
      assessedIcap: 78849.53147,
      peakDebtIncludingIcap: 1028849.531,
      peakShadedValuation: 1750000,
      peakDebtLvrExclIcap: 0.542857143,
      peakDebtLvrInclIcap: 0.587914018,
      endDebt: 0,
      shortfall: 0,
      additionalCashRequired: 7125,
      endDebtLvr: 0,
      checkValue: 0
    }
  },
  {
    name: "End debt (due to fee cap)",
    inputs: {
      existingPropertyValue: 1000000,
      existingDebt: 400000,
      sellingCostsPercent: 0,
      contractOfSaleProvided: false,
      salesProceedsToRetain: 0,
      pgIncluded: false,
      pgFeeAmount: 7500,
      pgFeeCapitalised: true,
      newPropertyValue: 800000,
      purchaseCostsPercent: 0,
      purchaseCostsCapitalised: true,
      additionalBorrowings: 50000,
      savings: 300000,
      bridgingTermMonths: 12,
      bridgingRepaymentType: 'ICAP',
      bridgingInterestRate: 7,
      bridgingFeesNoEndDebtPercent: 0.75,
      bridgingFeesEndDebtAmount: 1500,
      bridgingFeesCapitalised: true,
      peakDebtMaxLvrWithCos: 85,
      peakDebtMaxLvrWithoutCos: 80,
      existingPropertyValuationShading: 5,
      newPropertyMaxLvr: 85,
      bridgeDebtServicingBuffer: 1,
      minimumLoanAmount: 100000,
      maximumLoanAmount: 3000000
    },
    expected: {
      sellingCostsAmount: 0,
      existingPropertyEquity: 450000,
      shadedValuation: 950000,
      shadedNetSalesProceeds: 950000,
      purchaseCostsAmount: 0,
      additionalFundsRequired: 550000,
      peakDebtBeforeCap: 950000,
      maxPeakDebtBeforeCap: 1400000,
      bridgeDebt: 851500,
      bridgeDebtExcludingFcap: 850000,
      fcap: 1500,
      assessedIcap: 70674.08005,
      peakDebtIncludingIcap: 1022174.08,
      peakShadedValuation: 1750000,
      peakDebtLvrExclIcap: 0.542857143,
      peakDebtLvrInclIcap: 0.584099474,
      endDebt: 100000,
      shortfall: 0,
      additionalCashRequired: 0,
      endDebtLvr: 0.125,
      checkValue: 0
    }
  },
  {
    name: "Standard",
    inputs: {
      existingPropertyValue: 1000000,
      existingDebt: 400000,
      sellingCostsPercent: 0,
      contractOfSaleProvided: false,
      salesProceedsToRetain: 0,
      pgIncluded: false,
      pgFeeAmount: 7500,
      pgFeeCapitalised: true,
      newPropertyValue: 1500000,
      purchaseCostsPercent: 0,
      purchaseCostsCapitalised: true,
      additionalBorrowings: 50000,
      savings: 300000,
      bridgingTermMonths: 12,
      bridgingRepaymentType: 'ICAP',
      bridgingInterestRate: 7,
      bridgingFeesNoEndDebtPercent: 0.75,
      bridgingFeesEndDebtAmount: 1500,
      bridgingFeesCapitalised: true,
      peakDebtMaxLvrWithCos: 85,
      peakDebtMaxLvrWithoutCos: 80,
      existingPropertyValuationShading: 5,
      newPropertyMaxLvr: 85,
      bridgeDebtServicingBuffer: 1,
      minimumLoanAmount: 100000,
      maximumLoanAmount: 3000000
    },
    expected: {
      sellingCostsAmount: 0,
      existingPropertyEquity: 450000,
      shadedValuation: 950000,
      shadedNetSalesProceeds: 950000,
      purchaseCostsAmount: 0,
      additionalFundsRequired: 1250000,
      peakDebtBeforeCap: 1650000,
      maxPeakDebtBeforeCap: 1960000,
      bridgeDebt: 950000,
      bridgeDebtExcludingFcap: 948500,
      fcap: 1500,
      assessedIcap: 78849.53147,
      peakDebtIncludingIcap: 1730349.531,
      peakShadedValuation: 2450000,
      peakDebtLvrExclIcap: 0.673469388,
      peakDebtLvrInclIcap: 0.706265115,
      endDebt: 701500,
      shortfall: 0,
      additionalCashRequired: 0,
      endDebtLvr: 0.467666667,
      checkValue: 0
    }
  },
  {
    name: "More than max peak debt",
    inputs: {
      existingPropertyValue: 1500000,
      existingDebt: 400000,
      sellingCostsPercent: 0,
      contractOfSaleProvided: false,
      salesProceedsToRetain: 0,
      pgIncluded: false,
      pgFeeAmount: 11250,
      pgFeeCapitalised: true,
      newPropertyValue: 5500000,
      purchaseCostsPercent: 5,
      purchaseCostsCapitalised: true,
      additionalBorrowings: 50000,
      savings: 300000,
      bridgingTermMonths: 12,
      bridgingRepaymentType: 'ICAP',
      bridgingInterestRate: 7,
      bridgingFeesNoEndDebtPercent: 0.75,
      bridgingFeesEndDebtAmount: 1500,
      bridgingFeesCapitalised: true,
      peakDebtMaxLvrWithCos: 85,
      peakDebtMaxLvrWithoutCos: 80,
      existingPropertyValuationShading: 5,
      newPropertyMaxLvr: 85,
      bridgeDebtServicingBuffer: 1,
      minimumLoanAmount: 100000,
      maximumLoanAmount: 3000000
    },
    expected: {
      sellingCostsAmount: 0,
      existingPropertyEquity: 875000,
      shadedValuation: 1425000,
      shadedNetSalesProceeds: 1425000,
      purchaseCostsAmount: 275000,
      additionalFundsRequired: 5525000,
      peakDebtBeforeCap: 5925000,
      maxPeakDebtBeforeCap: 3000000,
      bridgeDebt: 1425000,
      bridgeDebtExcludingFcap: 1423500,
      fcap: 1500,
      assessedIcap: 118274.2972,
      peakDebtIncludingIcap: 3000000,
      peakShadedValuation: 6925000,
      peakDebtLvrExclIcap: 0.416133675,
      peakDebtLvrInclIcap: 0.433212996,
      endDebt: 1456725.703,
      shortfall: 3044774.297,
      additionalCashRequired: 0,
      endDebtLvr: 0.264859219,
      checkValue: 0
    }
  },
  {
    name: "More than max peak debt (Interest Only)",
    inputs: {
      existingPropertyValue: 1500000,
      existingDebt: 400000,
      sellingCostsPercent: 0,
      contractOfSaleProvided: false,
      salesProceedsToRetain: 0,
      pgIncluded: false,
      pgFeeAmount: 11250,
      pgFeeCapitalised: true,
      newPropertyValue: 5500000,
      purchaseCostsPercent: 5,
      purchaseCostsCapitalised: true,
      additionalBorrowings: 50000,
      savings: 300000,
      bridgingTermMonths: 12,
      bridgingRepaymentType: 'Interest Only',
      bridgingInterestRate: 7,
      bridgingFeesNoEndDebtPercent: 0.75,
      bridgingFeesEndDebtAmount: 1500,
      bridgingFeesCapitalised: true,
      peakDebtMaxLvrWithCos: 85,
      peakDebtMaxLvrWithoutCos: 80,
      existingPropertyValuationShading: 5,
      newPropertyMaxLvr: 85,
      bridgeDebtServicingBuffer: 1,
      minimumLoanAmount: 100000,
      maximumLoanAmount: 3000000
    },
    expected: {
      sellingCostsAmount: 0,
      existingPropertyEquity: 875000,
      shadedValuation: 1425000,
      shadedNetSalesProceeds: 1425000,
      purchaseCostsAmount: 275000,
      additionalFundsRequired: 5525000,
      peakDebtBeforeCap: 5925000,
      maxPeakDebtBeforeCap: 3000000,
      bridgeDebt: 1425000,
      bridgeDebtExcludingFcap: 1423500,
      fcap: 1500,
      assessedIcap: 0,
      peakDebtIncludingIcap: 3000000,
      peakShadedValuation: 6925000,
      peakDebtLvrExclIcap: 0.433212996,
      peakDebtLvrInclIcap: 0.433212996,
      endDebt: 1575000,
      shortfall: 2926500,
      additionalCashRequired: 0,
      endDebtLvr: 0.286363636,
      checkValue: 0
    }
  },
  {
    name: "Larger end debt",
    inputs: {
      existingPropertyValue: 120000,
      existingDebt: 40000,
      sellingCostsPercent: 0,
      contractOfSaleProvided: false,
      salesProceedsToRetain: 0,
      pgIncluded: false,
      pgFeeAmount: 900,
      pgFeeCapitalised: true,
      newPropertyValue: 800000,
      purchaseCostsPercent: 5,
      purchaseCostsCapitalised: true,
      additionalBorrowings: 50000,
      savings: 300000,
      bridgingTermMonths: 12,
      bridgingRepaymentType: 'ICAP',
      bridgingInterestRate: 7,
      bridgingFeesNoEndDebtPercent: 0.75,
      bridgingFeesEndDebtAmount: 1500,
      bridgingFeesCapitalised: true,
      peakDebtMaxLvrWithCos: 85,
      peakDebtMaxLvrWithoutCos: 80,
      existingPropertyValuationShading: 5,
      newPropertyMaxLvr: 85,
      bridgeDebtServicingBuffer: 1,
      minimumLoanAmount: 100000,
      maximumLoanAmount: 3000000
    },
    expected: {
      sellingCostsAmount: 0,
      existingPropertyEquity: 62000,
      shadedValuation: 114000,
      shadedNetSalesProceeds: 114000,
      purchaseCostsAmount: 40000,
      additionalFundsRequired: 590000,
      peakDebtBeforeCap: 630000,
      maxPeakDebtBeforeCap: 731200,
      bridgeDebt: 114000,
      bridgeDebtExcludingFcap: 112500,
      fcap: 1500,
      assessedIcap: 9461.943776,
      peakDebtIncludingIcap: 640961.9438,
      peakShadedValuation: 914000,
      peakDebtLvrExclIcap: 0.690919037,
      peakDebtLvrInclIcap: 0.701271273,
      endDebt: 517500,
      shortfall: 0,
      additionalCashRequired: 0,
      endDebtLvr: 0.646875,
      checkValue: 0
    }
  },
  {
    name: "Standard - 2",
    inputs: {
      existingPropertyValue: 500000,
      existingDebt: 40000,
      sellingCostsPercent: 0,
      contractOfSaleProvided: false,
      salesProceedsToRetain: 0,
      pgIncluded: false,
      pgFeeAmount: 3750,
      pgFeeCapitalised: true,
      newPropertyValue: 1300000,
      purchaseCostsPercent: 5,
      purchaseCostsCapitalised: true,
      additionalBorrowings: 0,
      savings: 300000,
      bridgingTermMonths: 12,
      bridgingRepaymentType: 'ICAP',
      bridgingInterestRate: 7,
      bridgingFeesNoEndDebtPercent: 0.75,
      bridgingFeesEndDebtAmount: 1500,
      bridgingFeesCapitalised: true,
      peakDebtMaxLvrWithCos: 85,
      peakDebtMaxLvrWithoutCos: 80,
      existingPropertyValuationShading: 5,
      newPropertyMaxLvr: 85,
      bridgeDebtServicingBuffer: 1,
      minimumLoanAmount: 100000,
      maximumLoanAmount: 3000000
    },
    expected: {
      sellingCostsAmount: 0,
      existingPropertyEquity: 385000,
      shadedValuation: 475000,
      shadedNetSalesProceeds: 475000,
      purchaseCostsAmount: 65000,
      additionalFundsRequired: 1065000,
      peakDebtBeforeCap: 1105000,
      maxPeakDebtBeforeCap: 1420000,
      bridgeDebt: 475000,
      bridgeDebtExcludingFcap: 473500,
      fcap: 1500,
      assessedIcap: 39424.76573,
      peakDebtIncludingIcap: 1145924.766,
      peakShadedValuation: 1775000,
      peakDebtLvrExclIcap: 0.623380282,
      peakDebtLvrInclIcap: 0.645591417,
      endDebt: 631500,
      shortfall: 0,
      additionalCashRequired: 0,
      endDebtLvr: 0.485769231,
      checkValue: 0
    }
  }
];

export function runTestCase(testCase: TestCase): {
  name: string;
  results: BridgingResults;
  comparison: {
    field: string;
    expected: number;
    actual: number;
    difference: number;
    percentDiff: number;
    passed: boolean;
  }[];
} {
  const engine = new BridgingCalculationEngine();
  const results = engine.calculate(testCase.inputs);
  
  const comparison = [];
  const tolerance = 0.01; // 1 cent for currency, 0.01 for percentages
  
  // Compare all fields
  const fieldsToCompare = [
    { key: 'sellingCostsAmount', isCurrency: true },
    { key: 'existingPropertyEquity', isCurrency: true },
    { key: 'shadedValuation', isCurrency: true },
    { key: 'shadedNetSalesProceeds', isCurrency: true },
    { key: 'purchaseCostsAmount', isCurrency: true },
    { key: 'additionalFundsRequired', isCurrency: true },
    { key: 'peakDebtBeforeCap', isCurrency: true },
    { key: 'maxPeakDebtBeforeCap', isCurrency: true },
    { key: 'bridgeDebt', isCurrency: true },
    { key: 'bridgeDebtExcludingFcap', isCurrency: true },
    { key: 'fcap', isCurrency: true },
    { key: 'assessedIcap', isCurrency: true },
    { key: 'peakDebtIncludingIcap', isCurrency: true },
    { key: 'peakShadedValuation', isCurrency: true },
    { key: 'peakDebtLvrExclIcap', isCurrency: false },
    { key: 'peakDebtLvrInclIcap', isCurrency: false },
    { key: 'endDebt', isCurrency: true },
    { key: 'shortfall', isCurrency: true },
    { key: 'additionalCashRequired', isCurrency: true },
    { key: 'endDebtLvr', isCurrency: false },
    { key: 'checkValue', isCurrency: true }
  ];
  
  fieldsToCompare.forEach(({ key, isCurrency }) => {
    const expected = testCase.expected[key as keyof typeof testCase.expected];
    const actual = results[key as keyof BridgingResults] as number;
    const difference = Math.abs(actual - expected);
    const percentDiff = expected !== 0 ? (difference / Math.abs(expected)) * 100 : 0;
    const passed = isCurrency ? difference <= tolerance : difference <= 0.0001;
    
    comparison.push({
      field: key,
      expected,
      actual,
      difference,
      percentDiff,
      passed
    });
  });
  
  return { name: testCase.name, results, comparison };
}

export function runAllTests() {
  console.log('Running all bridging calculator tests...\n');
  
  const allResults = testCases.map(testCase => runTestCase(testCase));
  
  allResults.forEach(({ name, comparison }) => {
    console.log(`\n=== ${name} ===`);
    console.log('Field                        Expected         Actual           Diff      Pass');
    console.log('-------------------------------------------------------------------------');
    
    comparison.forEach(({ field, expected, actual, difference, passed }) => {
      const status = passed ? '✓' : '✗';
      console.log(
        `${field.padEnd(28)} ${expected.toFixed(2).padStart(12)} ${actual.toFixed(2).padStart(12)} ${difference.toFixed(2).padStart(10)}  ${status}`
      );
    });
    
    const passedCount = comparison.filter(c => c.passed).length;
    const totalCount = comparison.length;
    console.log(`\nPassed: ${passedCount}/${totalCount}`);
  });
  
  return allResults;
}