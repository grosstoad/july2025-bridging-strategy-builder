import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Alert,
  Card,
  CardContent,
  Button,
  Stack,
  InputAdornment
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import { PropertyProgressTimeline } from '../components/layout/PropertyProgressTimeline';
import { PropertyDisplayCardWithAttribution } from '../components/PropertyDisplayCard';
import { useProperty } from '../contexts/PropertyContext';
import { usePropertyData } from '../hooks/usePropertyData';
import { normalizePropertyData, normalizeValuations, extractValue } from '../logic/propTrackDataNormalizer';

export const CurrentPropertyPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { currentProperty, setCurrentProperty } = useProperty();
  const { propertyData: rawPropertyData, valuations: rawValuations, isLoading } = usePropertyData(propertyId);
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [loanBalance, setLoanBalance] = useState<string>('');

  // Normalize PropTrack data to handle {value, sourceDate} structure
  const normalizedData = useMemo(() => {
    console.log('CurrentPropertyPage normalization - rawPropertyData:', rawPropertyData);
    console.log('CurrentPropertyPage normalization - rawValuations:', rawValuations);
    
    const propertyData = rawPropertyData ? normalizePropertyData(rawPropertyData) : null;
    const valuations = rawValuations ? normalizeValuations(rawValuations) : null;
    
    console.log('CurrentPropertyPage normalization - normalized propertyData:', propertyData);
    console.log('CurrentPropertyPage normalization - normalized valuations:', valuations);
    
    // Debug: Expose data to window for testing
    if (typeof window !== 'undefined') {
      window.rawPropertyDataDebug = rawPropertyData;
      window.isLoadingDebug = isLoading;
      window.normalizedDataDebug = { propertyData, valuations };
    }
    
    return { propertyData, valuations };
  }, [rawPropertyData, rawValuations, isLoading]);

  // Redirect if no propertyId
  useEffect(() => {
    if (!propertyId) {
      navigate('/');
      return;
    }
    
    // Initialize with mock data if not already set
    if (!currentProperty.propertyId) {
      setCurrentProperty({
        propertyId,
        propertyValue: 1960000,
        valuation: {
          estimate: 1960000,
          lowEstimate: 1740000,
          highEstimate: 2670000
        }
      });
    }
  }, [propertyId, navigate, currentProperty.propertyId, setCurrentProperty]);

  // Update local state when PropTrack data or context changes
  useEffect(() => {
    const latestValuation = normalizedData.valuations?.valuations?.[0];
    const propTrackEstimate = latestValuation?.estimate;
    
    // Pre-populate with PropTrack valuation if available, otherwise use context value
    const valueToUse = propTrackEstimate || currentProperty.propertyValue;
    
    if (valueToUse && !propertyValue) {
      setPropertyValue(valueToUse.toString());
      // Update context with PropTrack valuation if we got one
      if (propTrackEstimate && propTrackEstimate !== currentProperty.propertyValue) {
        setCurrentProperty({ 
          propertyValue: propTrackEstimate,
          valuation: {
            estimate: propTrackEstimate,
            lowEstimate: latestValuation?.lowEstimate || 0,
            highEstimate: latestValuation?.highEstimate || 0
          }
        });
      }
    }
    
    if (currentProperty.loanBalance) {
      setLoanBalance(currentProperty.loanBalance.toString());
    }
  }, [currentProperty, normalizedData.valuations, propertyValue, setCurrentProperty]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const parseCurrency = (value: string): number => {
    return parseInt(value.replace(/[^0-9]/g, '')) || 0;
  };

  const formatCurrencyInput = (value: number | undefined): string => {
    if (!value || value === 0) return '';
    return value.toLocaleString('en-AU');
  };

  const handlePropertyValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseCurrency(event.target.value);
    setCurrentProperty({ propertyValue: numericValue });
  };

  const handleLoanBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseCurrency(event.target.value);
    setCurrentProperty({ loanBalance: numericValue });
  };

  const calculateEquity = (): number => {
    const value = currentProperty.propertyValue || 0;
    const loan = currentProperty.loanBalance || 0;
    return Math.max(0, value - loan);
  };

  const handleNext = () => {
    // Navigate to target property page
    navigate('/target-property');
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!propertyId) {
    return null;
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ backgroundColor: '#eeeeee', padding: 2, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: '#666666', fontWeight: 'bold', letterSpacing: 1.5 }}>
          NAV PLACEHOLDER
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ paddingY: 8 }}>
        <Box sx={{ display: 'flex', gap: 6.5, justifyContent: 'center' }}>
          {/* Progress Timeline */}
          <PropertyProgressTimeline currentStep={1} />

          {/* Main Content Area */}
          <Box sx={{ width: 732 }}>
            <Stack spacing={4}>
              {/* Page Heading */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ArrowBackIcon 
                  sx={{ fontSize: 35, cursor: 'pointer', color: 'rgba(0,0,0,0.87)' }}
                  onClick={handleBack}
                />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: 32, 
                    lineHeight: '40px',
                    letterSpacing: '-1px',
                    color: 'rgba(0,0,0,0.87)'
                  }}
                >
                  Your current property
                </Typography>
              </Box>

              {/* Property Card */}
              <Card sx={{ borderRadius: 3, backgroundColor: '#ffffff' }}>
                <CardContent sx={{ padding: 4 }}>
                  <Stack spacing={4}>
                    <PropertyDisplayCardWithAttribution 
                      propertyData={normalizedData.propertyData}
                      valuations={normalizedData.valuations}
                      isLoading={isLoading}
                    />

                    {/* Property Details Alert */}
                    <Alert 
                      severity="info" 
                      sx={{ 
                        backgroundColor: '#e5f6fd',
                        color: '#014361',
                        '& .MuiAlert-icon': { color: '#014361' }
                      }}
                    >
                      Do your property details look correct? Update them for the most accurate realEstimate for your property.
                    </Alert>

                    {/* Form Inputs */}
                    <Stack spacing={3}>
                      <TextField
                        label="Current property value"
                        value={formatCurrencyInput(currentProperty.propertyValue)}
                        onChange={handlePropertyValueChange}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="The value you expect your current property to sell for"
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            backgroundColor: '#ffffff'
                          }
                        }}
                      />

                      <TextField
                        placeholder="Loan balance on this property"
                        value={formatCurrencyInput(currentProperty.loanBalance)}
                        onChange={handleLoanBalanceChange}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            backgroundColor: '#ffffff'
                          }
                        }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Equity Card */}
              <Card sx={{ borderRadius: 3, backgroundColor: '#ffffff' }}>
                <CardContent sx={{ padding: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold', 
                          fontSize: 16, 
                          color: '#2a2630' 
                        }}
                      >
                        Equity available
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: 12, 
                          color: 'rgba(0,0,0,0.6)',
                          fontWeight: 500
                        }}
                      >
                        For your next property purchase
                      </Typography>
                    </Stack>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'bold', 
                        fontSize: 20, 
                        color: '#2a2630',
                        letterSpacing: '-0.25px'
                      }}
                    >
                      {formatCurrency(calculateEquity())}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Growth Alert */}
              <Alert 
                icon={<AutoAwesomeIcon />}
                severity="info" 
                sx={{ 
                  backgroundColor: '#e5f6fd',
                  color: '#014361',
                  '& .MuiAlert-icon': { color: '#014361' }
                }}
              >
                Your property's value has increased by $XXX,XXX since Mmmm YYYY. That's an average of XX.X% growth year on year - properties like yours in SUBURBIA had a growth rate of XX.X%.
              </Alert>

              {/* Next Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!currentProperty.propertyValue}
                  sx={{
                    backgroundColor: '#9c27b0',
                    color: '#ffffff',
                    fontWeight: 500,
                    fontSize: 15,
                    letterSpacing: '0.46px',
                    textTransform: 'uppercase',
                    paddingX: 3,
                    paddingY: 1,
                    borderRadius: 1,
                    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.12), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: '#7b1fa2'
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(0,0,0,0.12)',
                      color: 'rgba(0,0,0,0.26)'
                    }
                  }}
                >
                  NEXT
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#eeeeee', padding: 2, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: '#666666', fontWeight: 'bold', letterSpacing: 1.5 }}>
          FOOTER PLACEHOLDER
        </Typography>
      </Box>
    </Box>
  );
};