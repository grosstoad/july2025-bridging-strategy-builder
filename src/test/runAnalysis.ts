// Quick test runner to analyze results
import { runTestCase, testCases } from './bridgingCalculatorTestRunner';

// Run all tests and analyze
const results = testCases.map((testCase, index) => {
  const result = runTestCase(testCase);
  console.log(`\n=== TEST ${index + 1}: ${testCase.name} ===`);
  
  const failures = result.comparison.filter(c => !c.passed);
  const passes = result.comparison.filter(c => c.passed);
  
  console.log(`Status: ${failures.length === 0 ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Fields: ${passes.length}/${result.comparison.length} passed`);
  
  if (failures.length > 0) {
    console.log('\nFailed fields:');
    failures.forEach(fail => {
      const percentDiff = fail.expected !== 0 ? ((fail.difference / Math.abs(fail.expected)) * 100).toFixed(2) : '0';
      console.log(`  ❌ ${fail.field}: Expected ${fail.expected.toFixed(2)}, Got ${fail.actual.toFixed(2)} (${percentDiff}% diff)`);
    });
  }
  
  return { testCase, result };
});

// Summary
console.log('\n\n=== OVERALL SUMMARY ===');
let totalPassed = 0;
let totalFailed = 0;
results.forEach(({ result }) => {
  const passed = result.comparison.filter(c => c.passed).length;
  const failed = result.comparison.filter(c => !c.passed).length;
  totalPassed += passed;
  totalFailed += failed;
});

console.log(`Total: ${totalPassed + totalFailed} fields tested`);
console.log(`Passed: ${totalPassed} (${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%)`);
console.log(`Failed: ${totalFailed} (${((totalFailed / (totalPassed + totalFailed)) * 100).toFixed(1)}%)`);

// Field failure analysis
const failuresByField: Record<string, { count: number, avgDiff: number }> = {};
results.forEach(({ result }) => {
  result.comparison.forEach(comp => {
    if (!comp.passed) {
      if (!failuresByField[comp.field]) {
        failuresByField[comp.field] = { count: 0, avgDiff: 0 };
      }
      failuresByField[comp.field].count++;
      failuresByField[comp.field].avgDiff += comp.percentDiff;
    }
  });
});

console.log('\n=== SYSTEMATIC FAILURES ===');
Object.entries(failuresByField)
  .sort((a, b) => b[1].count - a[1].count)
  .forEach(([field, data]) => {
    const avgDiff = (data.avgDiff / data.count).toFixed(2);
    console.log(`${field}: Failed in ${data.count}/8 tests (avg ${avgDiff}% difference)`);
  });

// Export for manual inspection
export { results };