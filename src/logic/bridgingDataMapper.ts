// Data mapping utilities for Bridging Calculator
// Maps existing collected data to calculator inputs

import { BridgingInputs } from '../types/bridgingCalculator';
import { getDefaultBridgingInputs, estimateBridgingTerm } from '../config/bridgingCalculatorDefaults';

interface PropertyData {
  propertyValue?: number;
  loanBalance?: number;
}

interface TargetPropertyData {
  expectedPurchasePrice: number;
  savingsForPurchase: number;
  additionalCashToBorrow: number;
}

interface AboutYouData {
  preferredTimeToSell: string;
  sellSettlementDate?: string;
  preferredTimeToBuy: string;
  buySettlementDate?: string;
  certaintyCost: number;
  hasDeadlines: string;
}

/**
 * Maps existing collected data to bridging calculator inputs
 * Pre-fills available data and uses defaults for the rest
 */
export function mapExistingDataToBridgingInputs(
  currentProperty: PropertyData,
  targetPropertyData?: TargetPropertyData,
  aboutYouData?: AboutYouData
): Partial<BridgingInputs> {
  // Start with defaults
  const defaults = getDefaultBridgingInputs();
  
  // Map available data
  const mappedData: Partial<BridgingInputs> = {
    // From current property
    existingPropertyValue: currentProperty.propertyValue || 0,
    existingDebt: currentProperty.loanBalance || 0,
    
    // From target property page
    newPropertyValue: targetPropertyData?.expectedPurchasePrice || 0,
    savings: targetPropertyData?.savingsForPurchase || 0,
    additionalBorrowings: targetPropertyData?.additionalCashToBorrow || 0,
    
    // Infer contract of sale status from timeline
    contractOfSaleProvided: aboutYouData?.preferredTimeToSell === 'already_sold' || false,
    
    // Estimate bridging term from timelines
    bridgingTermMonths: aboutYouData 
      ? estimateBridgingTerm(aboutYouData.preferredTimeToSell, aboutYouData.preferredTimeToBuy)
      : defaults.bridgingTermMonths
  };
  
  return mappedData;
}

/**
 * Loads saved calculator inputs from session storage
 */
export function loadSavedInputs(): Partial<BridgingInputs> | null {
  try {
    const saved = sessionStorage.getItem('bridgingCalculatorInputs');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading saved calculator inputs:', error);
    return null;
  }
}

/**
 * Saves calculator inputs to session storage
 */
export function saveInputs(inputs: BridgingInputs): void {
  try {
    sessionStorage.setItem('bridgingCalculatorInputs', JSON.stringify(inputs));
  } catch (error) {
    console.error('Error saving calculator inputs:', error);
  }
}

/**
 * Loads calculation results from session storage
 */
export function loadSavedResults(): any {
  try {
    const saved = sessionStorage.getItem('bridgingCalculatorResults');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading saved calculator results:', error);
    return null;
  }
}

/**
 * Saves calculation results to session storage
 */
export function saveResults(results: any): void {
  try {
    sessionStorage.setItem('bridgingCalculatorResults', JSON.stringify(results));
  } catch (error) {
    console.error('Error saving calculator results:', error);
  }
}

/**
 * Clears all saved calculator data
 */
export function clearSavedCalculatorData(): void {
  try {
    sessionStorage.removeItem('bridgingCalculatorInputs');
    sessionStorage.removeItem('bridgingCalculatorResults');
  } catch (error) {
    console.error('Error clearing saved calculator data:', error);
  }
}

/**
 * Merges multiple input sources with priority order
 * Priority: User modifications > Saved inputs > Mapped data > Defaults
 */
export function mergeInputSources(
  defaults: BridgingInputs,
  mappedData: Partial<BridgingInputs>,
  savedInputs?: Partial<BridgingInputs> | null,
  userModifications?: Partial<BridgingInputs>
): BridgingInputs {
  return {
    ...defaults,
    ...mappedData,
    ...(savedInputs || {}),
    ...(userModifications || {})
  };
}