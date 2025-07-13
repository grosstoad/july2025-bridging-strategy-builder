// Bridging Calculator Engine - Core calculation logic
// Ported from the reference HTML implementation with TypeScript enhancements

import {
  BridgingInputs,
  BridgingResults,
  CalculationConfig,
  BasicCalculations,
  IterativeCalculations,
  BridgeDebtComponents
} from '../types/bridgingCalculator';
import { BRIDGING_CALCULATOR_CONFIG } from '../config/bridgingCalculatorDefaults';

export class BridgingCalculationEngine {
  private config: CalculationConfig;
  private iterationLog: string;

  constructor(config: CalculationConfig = BRIDGING_CALCULATOR_CONFIG) {
    this.config = config;
    this.iterationLog = '';
  }

  calculate(inputs: BridgingInputs): BridgingResults {
    this.iterationLog = '';

    try {
      // Step 1: Calculate basic values
      const basicCalcs = this.calculateBasicValues(inputs);

      // Step 2: Perform iterative calculation
      const iterativeResults = this.performIterativeCalculation(inputs, basicCalcs);

      // Step 3: Calculate final metrics
      const finalResults = this.calculateFinalMetrics(inputs, basicCalcs, iterativeResults);

      return {
        ...finalResults,
        iterationLog: this.iterationLog
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logIteration(`Error: ${errorMessage}`);
      throw error;
    }
  }

  private calculateBasicValues(inputs: BridgingInputs): BasicCalculations {
    this.logIteration('=== BASIC CALCULATIONS ===\n');
    
    // Existing property calculations
    this.logIteration('Existing Property:');
    this.logIteration(`- Property value: ${this.formatCurrency(inputs.existingPropertyValue)}`);
    this.logIteration(`- Existing debt: ${this.formatCurrency(inputs.existingDebt)}`);
    this.logIteration(`- Selling costs %: ${inputs.sellingCostsPercent}%`);
    
    const sellingCostsAmount = (inputs.sellingCostsPercent / 100) * inputs.existingPropertyValue;
    this.logIteration(`- Selling costs amount: ${inputs.sellingCostsPercent}% × ${this.formatCurrency(inputs.existingPropertyValue)} = ${this.formatCurrency(sellingCostsAmount)}`);
    
    const existingPropertyEquity = inputs.existingPropertyValue * (inputs.peakDebtMaxLvrWithCos / 100) - inputs.existingDebt;
    this.logIteration(`- Property equity: ${this.formatCurrency(inputs.existingPropertyValue)} × ${inputs.peakDebtMaxLvrWithCos}% - ${this.formatCurrency(inputs.existingDebt)} = ${this.formatCurrency(existingPropertyEquity)}`);
    
    const shadedValuation = inputs.existingPropertyValue * (1 - inputs.existingPropertyValuationShading / 100);
    this.logIteration(`- Shaded valuation: ${this.formatCurrency(inputs.existingPropertyValue)} × (1 - ${inputs.existingPropertyValuationShading}%) = ${this.formatCurrency(shadedValuation)}`);
    
    const shadedNetSalesProceeds = inputs.existingPropertyValue * (1 - inputs.existingPropertyValuationShading / 100) -
                                   sellingCostsAmount - inputs.salesProceedsToRetain;
    this.logIteration(`- Shaded net sales proceeds: ${this.formatCurrency(shadedValuation)} - ${this.formatCurrency(sellingCostsAmount)} - ${this.formatCurrency(inputs.salesProceedsToRetain)} = ${this.formatCurrency(shadedNetSalesProceeds)}`);

    // New property calculations
    this.logIteration('\nNew Property:');
    this.logIteration(`- Property value: ${this.formatCurrency(inputs.newPropertyValue)}`);
    this.logIteration(`- Purchase costs %: ${inputs.purchaseCostsPercent}%`);
    
    const purchaseCostsAmount = (inputs.purchaseCostsPercent / 100) * inputs.newPropertyValue;
    this.logIteration(`- Purchase costs amount: ${inputs.purchaseCostsPercent}% × ${this.formatCurrency(inputs.newPropertyValue)} = ${this.formatCurrency(purchaseCostsAmount)}`);
    
    this.logIteration(`- Purchase costs capitalised: ${inputs.purchaseCostsCapitalised ? 'Yes' : 'No'}`);
    this.logIteration(`- Additional borrowings: ${this.formatCurrency(inputs.additionalBorrowings)}`);
    this.logIteration(`- Savings: ${this.formatCurrency(inputs.savings)}`);
    
    const additionalFundsRequired = inputs.newPropertyValue +
                                   (inputs.purchaseCostsCapitalised ? purchaseCostsAmount : 0) +
                                   inputs.additionalBorrowings - inputs.savings +
                                   ((inputs.pgIncluded && inputs.pgFeeCapitalised) ? inputs.pgFeeAmount : 0);
    
    this.logIteration(`\nAdditional funds required calculation:`);
    this.logIteration(`  New property value: ${this.formatCurrency(inputs.newPropertyValue)}`);
    if (inputs.purchaseCostsCapitalised) {
      this.logIteration(`  + Purchase costs (capitalised): ${this.formatCurrency(purchaseCostsAmount)}`);
    }
    this.logIteration(`  + Additional borrowings: ${this.formatCurrency(inputs.additionalBorrowings)}`);
    this.logIteration(`  - Savings: ${this.formatCurrency(inputs.savings)}`);
    if (inputs.pgIncluded && inputs.pgFeeCapitalised) {
      this.logIteration(`  + PG fee (capitalised): ${this.formatCurrency(inputs.pgFeeAmount)}`);
    }
    this.logIteration(`  = Additional funds required: ${this.formatCurrency(additionalFundsRequired)}`);
    
    const peakDebtBeforeCap = additionalFundsRequired + inputs.existingDebt;
    this.logIteration(`\nPeak debt (before cap): ${this.formatCurrency(additionalFundsRequired)} + ${this.formatCurrency(inputs.existingDebt)} = ${this.formatCurrency(peakDebtBeforeCap)}`);
    
    const peakShadedValuation = inputs.newPropertyValue + shadedValuation;
    this.logIteration(`Peak shaded valuation: ${this.formatCurrency(inputs.newPropertyValue)} + ${this.formatCurrency(shadedValuation)} = ${this.formatCurrency(peakShadedValuation)}`);
    
    const lvrToUse = inputs.contractOfSaleProvided ? inputs.peakDebtMaxLvrWithCos : inputs.peakDebtMaxLvrWithoutCos;
    this.logIteration(`\nMax peak debt calculation:`);
    this.logIteration(`- Contract of sale provided: ${inputs.contractOfSaleProvided ? 'Yes' : 'No'}`);
    this.logIteration(`- LVR to use: ${lvrToUse}%`);
    
    const maxPeakDebtBeforeCap = Math.min(
      peakShadedValuation * (lvrToUse / 100),
      inputs.maximumLoanAmount
    );
    this.logIteration(`- Max based on LVR: ${this.formatCurrency(peakShadedValuation)} × ${lvrToUse}% = ${this.formatCurrency(peakShadedValuation * (lvrToUse / 100))}`);
    this.logIteration(`- Maximum loan amount: ${this.formatCurrency(inputs.maximumLoanAmount)}`);
    this.logIteration(`- Max peak debt (before cap): ${this.formatCurrency(maxPeakDebtBeforeCap)}`);

    return {
      sellingCostsAmount,
      existingPropertyEquity,
      shadedValuation,
      shadedNetSalesProceeds,
      purchaseCostsAmount,
      additionalFundsRequired,
      peakDebtBeforeCap,
      peakShadedValuation,
      maxPeakDebtBeforeCap
    };
  }

  private performIterativeCalculation(inputs: BridgingInputs, basicCalcs: BasicCalculations): IterativeCalculations {
    let endDebt = 0;
    let iteration = 0;

    this.logIteration(`\n=== ITERATIVE CALCULATION ===`);
    this.logIteration(`\nStarting iterative solver to find optimal bridge debt and end debt balance...`);
    this.logIteration(`\nKey parameters:`);
    this.logIteration(`- Peak debt (before cap): ${this.formatCurrency(basicCalcs.peakDebtBeforeCap)}`);
    this.logIteration(`- Max peak debt: ${this.formatCurrency(basicCalcs.maxPeakDebtBeforeCap)}`);
    this.logIteration(`- Shaded net sales proceeds: ${this.formatCurrency(basicCalcs.shadedNetSalesProceeds)}`);
    this.logIteration(`- Bridging term: ${inputs.bridgingTermMonths} months`);
    this.logIteration(`- Repayment type: ${inputs.bridgingRepaymentType}`);
    this.logIteration(`- Interest rate: ${inputs.bridgingInterestRate}%`);
    this.logIteration(`- Convergence tolerance: ${this.formatCurrency(this.config.solver.convergenceTolerance)}`);

    let converged = false;
    let bridgeDebt = 0;
    let bridgeDebtExcludingFcap = 0;
    let fcap = 0;
    let assessedIcap = 0;
    let peakDebtIncludingIcap = 0;

    while (iteration < this.config.solver.maxIterations && !converged) {
      iteration++;
      this.logIteration(`\n=== Iteration ${iteration} ===`);
      this.logIteration(`Starting endDebt: ${this.formatCurrency(endDebt)}`);

      // Calculate bridge debt
      const bridgeDebtCalc = this.calculateBridgeDebt(
        inputs,
        basicCalcs.peakDebtBeforeCap,
        basicCalcs.maxPeakDebtBeforeCap,
        basicCalcs.shadedNetSalesProceeds,
        endDebt
      );
      bridgeDebt = bridgeDebtCalc.bridgeDebt;

      // Calculate bridge debt components
      const components = this.calculateBridgeDebtComponents(inputs, bridgeDebt, endDebt);
      bridgeDebtExcludingFcap = components.bridgeDebtExcludingFcap;
      fcap = components.fcap;
      assessedIcap = components.assessedIcap;

      this.logIteration(`  bridgeDebt: ${this.formatCurrency(bridgeDebt)}`);
      this.logIteration(`  bridgeDebtExcludingFcap: ${this.formatCurrency(bridgeDebtExcludingFcap)}`);
      this.logIteration(`  fcap: ${this.formatCurrency(fcap)}`);
      this.logIteration(`  assessedIcap: ${this.formatCurrency(assessedIcap)}`);

      // Calculate peak debt including ICAP
      peakDebtIncludingIcap = Math.min(
        inputs.maximumLoanAmount,
        basicCalcs.peakDebtBeforeCap + fcap + assessedIcap,
        basicCalcs.maxPeakDebtBeforeCap
      );

      this.logIteration(`  peakDebtIncludingIcap: ${this.formatCurrency(peakDebtIncludingIcap)}`);

      // Calculate new end debt
      const endDebtCalc = peakDebtIncludingIcap - bridgeDebt - assessedIcap;
      let endDebtNew = 0;

      // Check if endDebtCalc is greater than convergence tolerance
      // to avoid forcing tiny amounts to minimum loan amount
      if (endDebtCalc > this.config.solver.convergenceTolerance) {
        endDebtNew = Math.min(
          inputs.newPropertyValue * (inputs.newPropertyMaxLvr / 100),
          inputs.maximumLoanAmount,
          Math.max(endDebtCalc, inputs.minimumLoanAmount)
        );
      }

      this.logIteration(`  endDebtCalc: ${this.formatCurrency(endDebtCalc)} (raw: ${endDebtCalc})`);
      this.logIteration(`  endDebtNew: ${this.formatCurrency(endDebtNew)}`);

      // Check convergence
      const checkValue = endDebtNew + bridgeDebtExcludingFcap - basicCalcs.peakDebtBeforeCap +
                        (basicCalcs.peakDebtBeforeCap + fcap + assessedIcap - peakDebtIncludingIcap);
      this.logIteration(`  checkValue: ${checkValue.toFixed(6)}`);

      if (Math.abs(endDebtNew - endDebt) < this.config.solver.convergenceTolerance &&
          Math.abs(checkValue) < this.config.solver.convergenceTolerance) {
        endDebt = endDebtNew;
        converged = true;
        this.logIteration(`\nConverged after ${iteration} iterations!`);
      } else {
        endDebt = endDebtNew;
      }
    }

    if (!converged) {
      this.logIteration(`\nWARNING: Did not converge after ${this.config.solver.maxIterations} iterations`);
    } else {
      this.logIteration(`\n✓ Successfully converged to solution:`);
      this.logIteration(`  Bridge debt: ${this.formatCurrency(bridgeDebt)}`);
      this.logIteration(`  End debt: ${this.formatCurrency(endDebt)}`);
      this.logIteration(`  Total iterations: ${iteration}`);
    }

    return {
      bridgeDebt,
      bridgeDebtExcludingFcap,
      fcap,
      assessedIcap,
      peakDebtIncludingIcap,
      endDebt,
      iterations: iteration,
      converged
    };
  }

  private calculateBridgeDebt(
    inputs: BridgingInputs,
    peakDebtBeforeCap: number,
    maxPeakDebtBeforeCap: number,
    shadedNetSalesProceeds: number,
    endDebt: number
  ): { bridgeDebt: number } {
    const part1 = Math.min(peakDebtBeforeCap, maxPeakDebtBeforeCap) +
                 (inputs.bridgingFeesCapitalised ? peakDebtBeforeCap * (inputs.bridgingFeesNoEndDebtPercent / 100) : 0);
    const part2 = shadedNetSalesProceeds;

    const condition3 = (Math.min(peakDebtBeforeCap, maxPeakDebtBeforeCap) +
                       (inputs.bridgingFeesCapitalised ? Math.min(peakDebtBeforeCap, maxPeakDebtBeforeCap) * (inputs.bridgingFeesNoEndDebtPercent / 100) : 0)) >
                       shadedNetSalesProceeds && endDebt > 0 && endDebt <= inputs.minimumLoanAmount;

    const part3 = condition3
      ? Math.min(shadedNetSalesProceeds, peakDebtBeforeCap, maxPeakDebtBeforeCap) +
        (inputs.bridgingFeesCapitalised ? inputs.bridgingFeesEndDebtAmount : 0) -
        inputs.minimumLoanAmount
      : this.config.solver.infinityProxy;

    this.logIteration(`bridgeDebt calculation:`);
    this.logIteration(`  Part 1: ${this.formatCurrency(part1)}`);
    this.logIteration(`  Part 2: ${this.formatCurrency(part2)}`);
    this.logIteration(`  Part 3 condition: ${condition3}`);
    this.logIteration(`  Part 3 value: ${this.formatCurrency(part3)}`);

    const bridgeDebt = Math.min(part1, part2, part3);

    return { bridgeDebt };
  }

  private calculateBridgeDebtComponents(inputs: BridgingInputs, bridgeDebt: number, endDebt: number): BridgeDebtComponents {
    let bridgeDebtExcludingFcap: number;
    let fcap: number;

    this.logIteration(`\n  Bridge debt components:`);
    this.logIteration(`    End debt: ${this.formatCurrency(endDebt)}`);
    this.logIteration(`    Fees capitalised: ${inputs.bridgingFeesCapitalised ? 'Yes' : 'No'}`);

    if (endDebt > 0 && inputs.bridgingFeesCapitalised) {
      bridgeDebtExcludingFcap = bridgeDebt - inputs.bridgingFeesEndDebtAmount;
      fcap = inputs.bridgingFeesEndDebtAmount;
      this.logIteration(`    Fee type: Fixed amount (end debt exists)`);
      this.logIteration(`    Bridge debt excl. FCAP: ${this.formatCurrency(bridgeDebt)} - ${this.formatCurrency(inputs.bridgingFeesEndDebtAmount)} = ${this.formatCurrency(bridgeDebtExcludingFcap)}`);
    } else if (endDebt === 0 && inputs.bridgingFeesCapitalised) {
      bridgeDebtExcludingFcap = bridgeDebt / (1 + inputs.bridgingFeesNoEndDebtPercent / 100);
      fcap = bridgeDebt - bridgeDebtExcludingFcap;
      this.logIteration(`    Fee type: Percentage (no end debt)`);
      this.logIteration(`    Bridge debt excl. FCAP: ${this.formatCurrency(bridgeDebt)} / (1 + ${inputs.bridgingFeesNoEndDebtPercent}%) = ${this.formatCurrency(bridgeDebtExcludingFcap)}`);
    } else {
      bridgeDebtExcludingFcap = bridgeDebt;
      fcap = 0;
      this.logIteration(`    No fees capitalised`);
    }

    const assessedIcap = inputs.bridgingRepaymentType === this.config.repaymentTypes.icap
      ? bridgeDebt * Math.pow(1 + (inputs.bridgingInterestRate / 100 + inputs.bridgeDebtServicingBuffer / 100) / 12, inputs.bridgingTermMonths) - bridgeDebt
      : 0;
    
    if (inputs.bridgingRepaymentType === this.config.repaymentTypes.icap) {
      const monthlyRate = (inputs.bridgingInterestRate / 100 + inputs.bridgeDebtServicingBuffer / 100) / 12;
      this.logIteration(`    ICAP calculation:`);
      this.logIteration(`      Monthly rate: (${inputs.bridgingInterestRate}% + ${inputs.bridgeDebtServicingBuffer}%) / 12 = ${(monthlyRate * 100).toFixed(4)}%`);
      this.logIteration(`      Compound factor: (1 + ${(monthlyRate * 100).toFixed(4)}%)^${inputs.bridgingTermMonths} = ${Math.pow(1 + monthlyRate, inputs.bridgingTermMonths).toFixed(6)}`);
      this.logIteration(`      Assessed ICAP: ${this.formatCurrency(bridgeDebt)} × ${Math.pow(1 + monthlyRate, inputs.bridgingTermMonths).toFixed(6)} - ${this.formatCurrency(bridgeDebt)} = ${this.formatCurrency(assessedIcap)}`);
    } else {
      this.logIteration(`    ICAP: Not applicable (Interest Only)`);
    }

    return { bridgeDebtExcludingFcap, fcap, assessedIcap };
  }

  private calculateFinalMetrics(
    inputs: BridgingInputs,
    basicCalcs: BasicCalculations,
    iterativeResults: IterativeCalculations
  ): BridgingResults {
    this.logIteration(`\n=== FINAL METRICS CALCULATION ===\n`);
    
    const shortfall = basicCalcs.peakDebtBeforeCap + iterativeResults.fcap +
                     iterativeResults.assessedIcap - iterativeResults.peakDebtIncludingIcap;
    this.logIteration(`Shortfall calculation:`);
    this.logIteration(`  Peak debt before cap: ${this.formatCurrency(basicCalcs.peakDebtBeforeCap)}`);
    this.logIteration(`  + FCAP: ${this.formatCurrency(iterativeResults.fcap)}`);
    this.logIteration(`  + Assessed ICAP: ${this.formatCurrency(iterativeResults.assessedIcap)}`);
    this.logIteration(`  - Peak debt including ICAP: ${this.formatCurrency(iterativeResults.peakDebtIncludingIcap)}`);
    this.logIteration(`  = Shortfall: ${this.formatCurrency(shortfall)}`);

    this.logIteration(`\nAdditional cash required calculation:`);
    const additionalCashRequired =
      ((inputs.pgIncluded && !inputs.pgFeeCapitalised) ? inputs.pgFeeAmount : 0) +
      (!inputs.purchaseCostsCapitalised ? basicCalcs.purchaseCostsAmount : 0) +
      ((iterativeResults.endDebt === 0 && !inputs.bridgingFeesCapitalised) ?
        (inputs.bridgingFeesNoEndDebtPercent / 100) * iterativeResults.bridgeDebt : 0) +
      ((iterativeResults.endDebt > 0 && !inputs.bridgingFeesCapitalised) ?
        inputs.bridgingFeesEndDebtAmount : 0);
    
    if (inputs.pgIncluded && !inputs.pgFeeCapitalised) {
      this.logIteration(`  + PG fee (not capitalised): ${this.formatCurrency(inputs.pgFeeAmount)}`);
    }
    if (!inputs.purchaseCostsCapitalised) {
      this.logIteration(`  + Purchase costs (not capitalised): ${this.formatCurrency(basicCalcs.purchaseCostsAmount)}`);
    }
    if (iterativeResults.endDebt === 0 && !inputs.bridgingFeesCapitalised) {
      const fee = (inputs.bridgingFeesNoEndDebtPercent / 100) * iterativeResults.bridgeDebt;
      this.logIteration(`  + Bridging fees (no end debt, not capitalised): ${this.formatCurrency(fee)}`);
    }
    if (iterativeResults.endDebt > 0 && !inputs.bridgingFeesCapitalised) {
      this.logIteration(`  + Bridging fees (with end debt, not capitalised): ${this.formatCurrency(inputs.bridgingFeesEndDebtAmount)}`);
    }
    this.logIteration(`  = Additional cash required: ${this.formatCurrency(additionalCashRequired)}`);

    const peakDebtLvrExclIcap = (iterativeResults.bridgeDebt + iterativeResults.endDebt) /
                               basicCalcs.peakShadedValuation;
    this.logIteration(`\nLVR calculations:`);
    this.logIteration(`  Peak debt LVR (excl. ICAP): (${this.formatCurrency(iterativeResults.bridgeDebt)} + ${this.formatCurrency(iterativeResults.endDebt)}) / ${this.formatCurrency(basicCalcs.peakShadedValuation)} = ${(peakDebtLvrExclIcap * 100).toFixed(2)}%`);
    
    const peakDebtLvrInclIcap = iterativeResults.peakDebtIncludingIcap /
                               basicCalcs.peakShadedValuation;
    this.logIteration(`  Peak debt LVR (incl. ICAP): ${this.formatCurrency(iterativeResults.peakDebtIncludingIcap)} / ${this.formatCurrency(basicCalcs.peakShadedValuation)} = ${(peakDebtLvrInclIcap * 100).toFixed(2)}%`);
    
    const endDebtLvr = iterativeResults.endDebt / inputs.newPropertyValue;
    this.logIteration(`  End debt LVR: ${this.formatCurrency(iterativeResults.endDebt)} / ${this.formatCurrency(inputs.newPropertyValue)} = ${(endDebtLvr * 100).toFixed(2)}%`);
    
    const checkValue = iterativeResults.endDebt + iterativeResults.bridgeDebtExcludingFcap -
                      basicCalcs.peakDebtBeforeCap + shortfall;
    this.logIteration(`\nConvergence check value:`);
    this.logIteration(`  End debt: ${this.formatCurrency(iterativeResults.endDebt)}`);
    this.logIteration(`  + Bridge debt (excl. FCAP): ${this.formatCurrency(iterativeResults.bridgeDebtExcludingFcap)}`);
    this.logIteration(`  - Peak debt before cap: ${this.formatCurrency(basicCalcs.peakDebtBeforeCap)}`);
    this.logIteration(`  + Shortfall: ${this.formatCurrency(shortfall)}`);
    this.logIteration(`  = Check value: ${checkValue.toFixed(6)} (should be ≈ 0)`);
    
    this.logIteration(`\n=== CALCULATION COMPLETE ===`);

    return {
      ...basicCalcs,
      ...iterativeResults,
      shortfall,
      additionalCashRequired,
      peakDebtLvrExclIcap,
      peakDebtLvrInclIcap,
      endDebtLvr,
      checkValue,
      iterationLog: this.iterationLog
    };
  }

  private logIteration(message: string): void {
    this.iterationLog += message + '\n';
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}