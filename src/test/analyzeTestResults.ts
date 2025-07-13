// Analyze test results and provide detailed analysis
import { runTestCase, testCases } from './bridgingCalculatorTestRunner';

export function analyzeTestResults() {
  const results = testCases.map((testCase, index) => ({
    testIndex: index + 1,
    testName: testCase.name,
    ...runTestCase(testCase)
  }));

  console.log('=== BRIDGING CALCULATOR TEST ANALYSIS ===\n');

  // Summary
  let totalPassed = 0;
  let totalFailed = 0;
  
  results.forEach(result => {
    const passed = result.comparison.filter(c => c.passed).length;
    const failed = result.comparison.filter(c => !c.passed).length;
    totalPassed += passed;
    totalFailed += failed;
  });

  console.log(`OVERALL SUMMARY:`);
  console.log(`Total Fields Tested: ${totalPassed + totalFailed}`);
  console.log(`Passed: ${totalPassed} (${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${totalFailed} (${((totalFailed / (totalPassed + totalFailed)) * 100).toFixed(1)}%)\n`);

  // Detailed results per test
  results.forEach((result, idx) => {
    console.log(`\n=== TEST ${idx + 1}: ${result.testName} ===`);
    
    const failures = result.comparison.filter(c => !c.passed);
    const passes = result.comparison.filter(c => c.passed);
    
    console.log(`Status: ${failures.length === 0 ? 'PASSED' : 'FAILED'}`);
    console.log(`Fields Passed: ${passes.length}/${result.comparison.length}`);
    
    if (failures.length > 0) {
      console.log('\nFAILED FIELDS:');
      failures.forEach(fail => {
        console.log(`  ${fail.field}:`);
        console.log(`    Expected: ${fail.expected}`);
        console.log(`    Actual: ${fail.actual}`);
        console.log(`    Difference: ${fail.difference} (${fail.percentDiff.toFixed(2)}%)`);
      });
    }
  });

  // Pattern Analysis
  console.log('\n\n=== PATTERN ANALYSIS ===\n');
  
  // Group failures by field
  const failuresByField: Record<string, number> = {};
  results.forEach(result => {
    result.comparison.forEach(comp => {
      if (!comp.passed) {
        failuresByField[comp.field] = (failuresByField[comp.field] || 0) + 1;
      }
    });
  });

  console.log('FIELDS WITH MOST FAILURES:');
  Object.entries(failuresByField)
    .sort((a, b) => b[1] - a[1])
    .forEach(([field, count]) => {
      console.log(`  ${field}: ${count} failures (${((count / 8) * 100).toFixed(0)}% of tests)`);
    });

  // Hypothesis for failures
  console.log('\n\n=== FAILURE HYPOTHESIS ===\n');

  if (failuresByField['existingPropertyEquity']) {
    console.log('1. EXISTING PROPERTY EQUITY:');
    console.log('   - Formula mismatch: Using peakDebtMaxLvrWithCos but should likely use a different calculation');
    console.log('   - Expected formula appears to be: existingPropertyValue * 0.85 - existingDebt');
    console.log('   - Current formula: existingPropertyValue * (peakDebtMaxLvrWithCos/100) - existingDebt');
  }

  if (failuresByField['additionalCashRequired']) {
    console.log('\n2. ADDITIONAL CASH REQUIRED:');
    console.log('   - Complex conditional logic for non-capitalised fees');
    console.log('   - Bridging fees calculation when not capitalised may differ');
    console.log('   - Need to verify exact conditions for when to include bridging fees');
  }

  if (failuresByField['bridgeDebt'] || failuresByField['bridgeDebtExcludingFcap']) {
    console.log('\n3. BRIDGE DEBT CALCULATIONS:');
    console.log('   - Iterative calculation convergence differences');
    console.log('   - Fee capitalization logic may have edge cases');
    console.log('   - Part 3 condition in bridge debt formula may need adjustment');
  }

  if (failuresByField['assessedIcap']) {
    console.log('\n4. ASSESSED ICAP:');
    console.log('   - Minor rounding differences in compound interest calculation');
    console.log('   - May need to match exact decimal precision of reference implementation');
  }

  return results;
}

// Run analysis if called directly
if (require.main === module) {
  analyzeTestResults();
}