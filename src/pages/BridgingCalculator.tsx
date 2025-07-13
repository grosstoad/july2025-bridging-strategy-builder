import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Stack,
  Button,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useProperty } from '../contexts/PropertyContext';
import { BridgingInputs, BridgingResults } from '../types/bridgingCalculator';
import { getDefaultBridgingInputs } from '../config/bridgingCalculatorDefaults';
import { BridgingCalculationEngine } from '../logic/bridgingCalculationEngine';
import { 
  mapExistingDataToBridgingInputs, 
  loadSavedInputs, 
  saveInputs,
  saveResults,
  mergeInputSources 
} from '../logic/bridgingDataMapper';
import { ExistingPropertySection } from '../components/bridging-calculator/ExistingPropertySection';
import { NewPropertySection } from '../components/bridging-calculator/NewPropertySection';
import { PriceGuaranteeSection } from '../components/bridging-calculator/PriceGuaranteeSection';
import { BridgingProductSection } from '../components/bridging-calculator/BridgingProductSection';
import { AssumptionsSection } from '../components/bridging-calculator/AssumptionsSection';
import { CalculationResults } from '../components/bridging-calculator/CalculationResults';

export const BridgingCalculator: React.FC = () => {
  const navigate = useNavigate();
  const { currentProperty, targetProperty } = useProperty();
  const [inputs, setInputs] = useState<BridgingInputs>(getDefaultBridgingInputs());
  const [results, setResults] = useState<BridgingResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const engine = useMemo(() => new BridgingCalculationEngine(), []);

  // Load and merge data on mount
  useEffect(() => {
    // Get data from various sources
    const defaults = getDefaultBridgingInputs();
    
    // Get target property data from session storage
    const targetData = sessionStorage.getItem('targetPropertyData');
    const targetPropertyData = targetData ? JSON.parse(targetData) : null;
    
    // Get about you data from session storage
    const aboutYouDataStr = sessionStorage.getItem('aboutYouData');
    const aboutYouData = aboutYouDataStr ? JSON.parse(aboutYouDataStr) : null;
    
    // Map existing data
    const mappedData = mapExistingDataToBridgingInputs(
      currentProperty,
      targetPropertyData,
      aboutYouData
    );
    
    // Load any saved calculator inputs
    const savedInputs = loadSavedInputs();
    
    // Merge all sources
    const mergedInputs = mergeInputSources(defaults, mappedData, savedInputs);
    setInputs(mergedInputs);
    
    // Auto-calculate if we have the key values
    if (mergedInputs.existingPropertyValue > 0 && mergedInputs.newPropertyValue > 0) {
      calculateBridging(mergedInputs);
    }
  }, [currentProperty, targetProperty]);

  // Save inputs whenever they change
  useEffect(() => {
    saveInputs(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof BridgingInputs, value: any) => {
    setInputs(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-calculate after input change (with debouncing in production)
      if (updated.existingPropertyValue > 0 && updated.newPropertyValue > 0) {
        calculateBridging(updated);
      }
      return updated;
    });
  };

  const calculateBridging = async (inputsToCalculate: BridgingInputs) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const calculationResults = engine.calculate(inputsToCalculate);
      setResults(calculationResults);
      saveResults(calculationResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCalculate = () => {
    calculateBridging(inputs);
  };

  const handleReset = () => {
    const defaults = getDefaultBridgingInputs();
    // Keep the property values that were pre-populated
    const resetInputs = {
      ...defaults,
      existingPropertyValue: inputs.existingPropertyValue,
      existingDebt: inputs.existingDebt,
      newPropertyValue: inputs.newPropertyValue,
      savings: inputs.savings,
      additionalBorrowings: inputs.additionalBorrowings
    };
    setInputs(resetInputs);
    setResults(null);
  };

  const handleContinue = () => {
    navigate('/about-you');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={4}>
          {/* Header */}
          <Stack spacing={2} textAlign="center">
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 700,
                color: 'text.primary'
              }}
            >
              Bridging calculator
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.125rem' },
                fontWeight: 400,
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Calculate your bridging finance requirements based on your property details. 
              All fields can be adjusted to explore different scenarios.
            </Typography>
          </Stack>

          {/* Warning if missing key data */}
          {(inputs.existingPropertyValue === 0 || inputs.newPropertyValue === 0) && (
            <Alert severity="info" sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
              Enter your existing property value and new property value to see calculations
            </Alert>
          )}

          {/* Calculator Sections */}
          <Stack spacing={3} sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}>
            {/* Existing Property */}
            <Card>
              <CardContent>
                <ExistingPropertySection
                  inputs={inputs}
                  onChange={handleInputChange}
                  disabled={isCalculating}
                />
              </CardContent>
            </Card>

            {/* New Property */}
            <Card>
              <CardContent>
                <NewPropertySection
                  inputs={inputs}
                  onChange={handleInputChange}
                  disabled={isCalculating}
                />
              </CardContent>
            </Card>

            {/* Price Guarantee */}
            <Card>
              <CardContent>
                <PriceGuaranteeSection
                  inputs={inputs}
                  onChange={handleInputChange}
                  disabled={isCalculating}
                />
              </CardContent>
            </Card>

            {/* Bridging Product */}
            <Card>
              <CardContent>
                <BridgingProductSection
                  inputs={inputs}
                  onChange={handleInputChange}
                  disabled={isCalculating}
                />
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <AssumptionsSection
              inputs={inputs}
              onChange={handleInputChange}
              disabled={isCalculating}
              expanded={showAdvanced}
              onExpandedChange={setShowAdvanced}
            />

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={isCalculating}
              >
                Reset to defaults
              </Button>
              <Button
                variant="contained"
                onClick={handleCalculate}
                disabled={isCalculating || inputs.existingPropertyValue === 0 || inputs.newPropertyValue === 0}
                startIcon={isCalculating ? <CircularProgress size={20} /> : null}
              >
                {isCalculating ? 'Calculating...' : 'Calculate'}
              </Button>
            </Stack>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {/* Results */}
            {results && !error && (
              <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 4 }}>
                  <Typography variant="h5" component="span" color="text.secondary">
                    Results
                  </Typography>
                </Divider>
                <CalculationResults results={results} />
              </Box>
            )}
          </Stack>

          {/* Navigation Buttons */}
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ 
              maxWidth: 600,
              mx: 'auto',
              width: '100%',
              mt: 6
            }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={handleBack}
              sx={{
                minWidth: 120,
                fontSize: '1.125rem',
                textTransform: 'none'
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              disableElevation
              sx={{
                flex: 1,
                fontSize: '1.125rem',
                textTransform: 'none'
              }}
            >
              Continue
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};