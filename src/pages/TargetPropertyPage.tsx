// Target Property Page - allows users to search for properties or suburbs

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Container,
  Stack,
  Button
} from '@mui/material';
import { 
  Link as LinkIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon,
  Bed as BedIcon,
  ArrowOutward as ArrowOutwardIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { PropertyProgressTimeline } from '../components/layout/PropertyProgressTimeline';
import { 
  EnhancedAddressAutocomplete, 
  SearchSelection 
} from '../components/inputs/EnhancedAddressAutocomplete';
import { usePropertyData } from '../hooks/usePropertyData';
import { useTargetMarketData } from '../hooks/useMarketData';
import { formatCurrency } from '../utils/formatters';
import { extractValue, normalizePropertyData, normalizeValuations } from '../logic/propTrackDataNormalizer';
import { PropertyDisplayCardWithAttribution } from '../components/PropertyDisplayCard';
import { useProperty } from '../contexts/PropertyContext';

interface FinancialInputs {
  expectedPurchasePrice: number;
  savingsForPurchase: number;
  additionalCashToBorrow: number;
}

export const TargetPropertyPage = () => {
  const navigate = useNavigate();
  const { setTargetProperty, targetProperty } = useProperty();
  
  // Load saved form state from session storage
  const loadSavedState = () => {
    try {
      const savedFormState = sessionStorage.getItem('targetPropertyFormState');
      if (savedFormState) {
        return JSON.parse(savedFormState);
      }
    } catch (error) {
      console.error('Error loading saved form state:', error);
    }
    return null;
  };

  const savedState = loadSavedState();
  
  const [selection, setSelection] = useState<SearchSelection | null>(savedState?.selection || null);
  const [propertyType, setPropertyType] = useState<'house' | 'unit'>(savedState?.propertyType || 'house');
  const [bedrooms, setBedrooms] = useState<string>(savedState?.bedrooms || '3');
  const [financialInputs, setFinancialInputs] = useState<FinancialInputs>(
    savedState?.financialInputs || {
      expectedPurchasePrice: targetProperty.propertyValue || 0,
      savingsForPurchase: 0,
      additionalCashToBorrow: 0
    }
  );

  // Save form state to session storage whenever it changes
  useEffect(() => {
    const formState = {
      selection,
      propertyType,
      bedrooms,
      financialInputs
    };
    try {
      sessionStorage.setItem('targetPropertyFormState', JSON.stringify(formState));
    } catch (error) {
      console.error('Error saving form state:', error);
    }
  }, [selection, propertyType, bedrooms, financialInputs]);

  // For property selection - fetch full property data
  const {
    propertyData,
    valuations,
    isLoading: propertyLoading,
    error: propertyError
  } = usePropertyData(selection?.type === 'address' ? selection.propertyId : null);

  // Normalize PropTrack data
  const normalizedData = useMemo(() => {
    const normalizedPropertyData = propertyData ? normalizePropertyData(propertyData) : null;
    const normalizedValuations = valuations ? normalizeValuations(valuations) : null;
    return { propertyData: normalizedPropertyData, valuations: normalizedValuations };
  }, [propertyData, valuations]);

  // Extract location details from selection or property data
  const { suburb, state, postcode } = useMemo(() => {
    if (selection?.type === 'suburb') {
      return {
        suburb: selection.suburb,
        state: selection.state,
        postcode: selection.postcode
      };
    } else if (selection?.type === 'address' && propertyData) {
      return {
        suburb: propertyData.address.suburb,
        state: propertyData.address.state,
        postcode: propertyData.address.postcode
      };
    }
    return { suburb: null, state: null, postcode: null };
  }, [selection, propertyData]);

  // Fetch market data for both property and suburb selections
  const { 
    data: marketData, 
    isLoading: marketLoading,
    error: marketError,
    availableBedroomOptions
  } = useTargetMarketData(
    suburb,
    state,
    postcode,
    selection?.type === 'suburb' ? propertyType : extractValue(propertyData?.attributes?.propertyType) as 'house' | 'unit' | null,
    selection?.type === 'suburb' ? (bedrooms === 'combined' ? undefined : parseInt(bedrooms)) : extractValue(propertyData?.attributes?.bedrooms)
  );

  console.log('Current selection:', selection);
  console.log('Market data:', marketData);
  console.log('Property data:', propertyData);
  console.log('Valuations:', valuations);

  // Update bedroom selection when available options change
  useEffect(() => {
    if (availableBedroomOptions.length > 0 && selection?.type === 'suburb') {
      // If current selection is not in available options, reset to first option
      if (!availableBedroomOptions.includes(bedrooms)) {
        setBedrooms(availableBedroomOptions[0] || '3');
      }
    }
  }, [availableBedroomOptions, selection, bedrooms]);

  // Pre-fill budget with estimated value when market data changes
  useEffect(() => {
    if (selection?.type === 'suburb' && marketData?.medianPrice) {
      // For suburb selection, use median price
      if (financialInputs.expectedPurchasePrice === 0) {
        setFinancialInputs(prev => ({
          ...prev,
          expectedPurchasePrice: marketData.medianPrice
        }));
      }
    } else if (selection?.type === 'address' && normalizedData.valuations?.valuations?.[0]?.estimate) {
      // For property selection, use the property's estimated value
      const estimate = normalizedData.valuations.valuations[0].estimate;
      if (financialInputs.expectedPurchasePrice === 0) {
        setFinancialInputs(prev => ({
          ...prev,
          expectedPurchasePrice: estimate
        }));
      }
    }
  }, [marketData?.medianPrice, selection?.type, financialInputs.expectedPurchasePrice, normalizedData.valuations]);

  // Currency formatting helpers
  const formatCurrencyInput = (value: number): string => {
    if (value === 0) return '';
    return value.toLocaleString('en-AU');
  };

  const parseCurrencyInput = (value: string): number => {
    const cleaned = value.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned) : 0;
  };

  const handleFinancialInputChange = (field: keyof FinancialInputs) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const numericValue = parseCurrencyInput(event.target.value);
    setFinancialInputs(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleNext = () => {
    // Convert SearchSelection to AddressSuggestion format
    let addressData;
    if (selection?.type === 'address') {
      // For property selection, use the actual property data if available
      if (propertyData) {
        addressData = {
          propertyId: selection.propertyId,
          address: propertyData.address.address,
          streetNumber: propertyData.address.streetNumber,
          streetName: propertyData.address.streetName,
          streetType: propertyData.address.streetType,
          suburb: propertyData.address.suburb,
          state: propertyData.address.state,
          postcode: propertyData.address.postcode,
          fullAddress: propertyData.address.address
        };
      } else {
        // Fallback to selection data
        addressData = {
          propertyId: selection.propertyId,
          fullAddress: selection.displayAddress,
          address: selection.address
        };
      }
    } else if (selection?.type === 'suburb') {
      // For suburb selection, create a minimal address object
      addressData = {
        suburb: selection.suburb,
        state: selection.state,
        postcode: selection.postcode,
        fullAddress: `${selection.suburb} ${selection.state} ${selection.postcode}`
      };
    }

    // Save target property data to context
    setTargetProperty({
      propertyValue: financialInputs.expectedPurchasePrice,
      address: addressData,
      ...(selection?.type === 'address' && propertyData ? {
        propertyId: selection.propertyId,
        attributes: {
          propertyType: extractValue(propertyData.attributes?.propertyType),
          bedrooms: extractValue(propertyData.attributes?.bedrooms),
          bathrooms: extractValue(propertyData.attributes?.bathrooms),
          carSpaces: extractValue(propertyData.attributes?.carSpaces),
          landSize: extractValue(propertyData.attributes?.landArea),
          floorPlanSize: extractValue(propertyData.attributes?.livingArea)
        },
        valuation: normalizedData.valuations?.valuations?.[0] ? {
          estimate: normalizedData.valuations.valuations[0].estimate,
          lowEstimate: normalizedData.valuations.valuations[0].lowEstimate,
          highEstimate: normalizedData.valuations.valuations[0].highEstimate,
          confidence: normalizedData.valuations.valuations[0].confidence
        } : undefined
      } : {
        // Suburb selection data
        attributes: {
          propertyType,
          bedrooms: bedrooms === 'combined' ? undefined : parseInt(bedrooms)
        }
      })
    });

    // Check if user clicked the bridging calculator CTA
    const ctaType = sessionStorage.getItem('ctaType');
    
    if (ctaType === 'calculator') {
      navigate('/bridging-calculator');
    } else {
      navigate('/property-strategy');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ backgroundColor: '#eeeeee', padding: 2, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: '#666666', fontWeight: 'bold', letterSpacing: 1.5 }}>
          NAV PLACEHOLDER
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ paddingY: 8, flex: 1 }}>
        <Box sx={{ display: 'flex', gap: 6.5, justifyContent: 'center' }}>
          {/* Progress Timeline */}
          <PropertyProgressTimeline currentStep={2} />

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
                  Your target property
                </Typography>
              </Box>

              {/* Search Card */}
              <Card sx={{ borderRadius: 3, backgroundColor: '#ffffff' }}>
                <CardContent sx={{ padding: 4 }}>
                  <Stack spacing={3}>
                    <Typography variant="body1" color="text.secondary">
                      Search for a specific property address or explore suburbs
                    </Typography>
                    <EnhancedAddressAutocomplete 
                      onSelect={setSelection}
                      label="Search for a property address or suburb"
                      placeholder="Enter address, suburb or postcode"
                    />
                  </Stack>
                </CardContent>
              </Card>

            {selection && (
              <>
                {/* Property-specific display */}
                {selection.type === 'address' && (
                  <>
                    {propertyError && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {propertyError}
                      </Alert>
                    )}

                    <Box sx={{ 
                      backgroundColor: '#ffffff',
                      borderRadius: 3,
                      border: '1px solid #e0e0e0',
                      p: 2,
                      mb: 3
                    }}>
                      <PropertyDisplayCardWithAttribution
                        showEditButton={false}
                        propertyData={normalizedData.propertyData}
                        valuations={normalizedData.valuations}
                        isLoading={propertyLoading}
                      />
                    </Box>

                    {/* Listing Information Box */}
                    {propertyData?.activeListings && propertyData.activeListings.length > 0 && (
                      <Box 
                        sx={{ 
                          bgcolor: '#e3f2fd',
                          borderRadius: 2,
                          p: 3,
                          mt: 3,
                          mb: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <LinkIcon sx={{ color: '#1976d2', fontSize: 24 }} />
                        <Typography variant="body1" sx={{ color: '#0d47a1', flex: 1 }}>
                          {propertyData.address.streetNumber} {propertyData.address.streetName} {propertyData.address.streetType}, {propertyData.address.suburb} {propertyData.address.state} {propertyData.address.postcode} is currently listed for sale{propertyData.activeListings[0]?.priceDescription ? ` at ${propertyData.activeListings[0].priceDescription}` : ''}. See{' '}
                          <Box
                            component="a"
                            href={`https://www.realestate.com.au/${propertyData.activeListings[0].listingId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: '#1976d2', textDecoration: 'underline' }}
                          >
                            realestate.com.au listing
                          </Box>
                          .
                        </Typography>
                      </Box>
                    )}
                  </>
                )}

                {/* Suburb-specific display */}
                {selection.type === 'suburb' && (
                  <Card sx={{ borderRadius: 3, backgroundColor: '#ffffff' }}>
                    <CardContent sx={{ padding: 4 }}>
                      <Stack spacing={3}>
                        <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 500, color: 'rgba(0,0,0,0.87)' }}>
                          Tell us about the property you'd like to buy in {selection.suburb} {selection.state}?
                        </Typography>

                        {/* Property details box */}
                        <Box sx={{ 
                          backgroundColor: '#ffffff',
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          p: 3
                        }}>
                          <Stack spacing={3}>
                            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                              {/* Property type dropdown */}
                              <FormControl sx={{ width: 180 }}>
                                <Select
                                  value={propertyType}
                                  onChange={(e) => setPropertyType(e.target.value as 'house' | 'unit')}
                                  size="small"
                                  displayEmpty
                                  sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: 'rgba(0, 0, 0, 0.05)',
                                    },
                                    '& .MuiSelect-select': {
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                    }
                                  }}
                                  renderValue={(value) => (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <HomeIcon sx={{ fontSize: 20, color: '#555159' }} />
                                      <span>{value === 'house' ? 'House' : 'Unit'}</span>
                                    </Box>
                                  )}
                                >
                                  <MenuItem value="house">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <HomeIcon sx={{ fontSize: 20, color: '#555159' }} />
                                      House
                                    </Box>
                                  </MenuItem>
                                  <MenuItem value="unit">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <HomeIcon sx={{ fontSize: 20, color: '#555159' }} />
                                      Unit
                                    </Box>
                                  </MenuItem>
                                </Select>
                                <Typography variant="caption" sx={{ 
                                  position: 'absolute',
                                  top: -8,
                                  left: 12,
                                  px: 0.5,
                                  backgroundColor: '#ffffff',
                                  color: 'rgba(0,0,0,0.6)',
                                  fontSize: 12
                                }}>
                                  Property type
                                </Typography>
                              </FormControl>

                              {/* Bedrooms dropdown */}
                              <FormControl sx={{ width: 180 }}>
                                <Select
                                  value={bedrooms}
                                  onChange={(e) => setBedrooms(e.target.value)}
                                  size="small"
                                  displayEmpty
                                  sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: 'rgba(0, 0, 0, 0.05)',
                                    },
                                    '& .MuiSelect-select': {
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                    }
                                  }}
                                  renderValue={(value) => (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <BedIcon sx={{ fontSize: 20, color: '#555159' }} />
                                      <span>{value}</span>
                                    </Box>
                                  )}
                                >
                                  {(availableBedroomOptions.length > 0 ? availableBedroomOptions : ['1', '2', '3', '4', '5+']).map(option => (
                                    <MenuItem key={option} value={option}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BedIcon sx={{ fontSize: 20, color: '#555159' }} />
                                        {option}
                                      </Box>
                                    </MenuItem>
                                  ))}
                                </Select>
                                <Typography variant="caption" sx={{ 
                                  position: 'absolute',
                                  top: -8,
                                  left: 12,
                                  px: 0.5,
                                  backgroundColor: '#ffffff',
                                  color: 'rgba(0,0,0,0.6)',
                                  fontSize: 12
                                }}>
                                  Beds
                                </Typography>
                              </FormControl>
                            </Box>

                            {/* Market insights - shown when data is available */}
                            {marketData && propertyType && bedrooms && (
                              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', pt: 2 }}>
                                {/* Estimated value */}
                                <Box sx={{ 
                                  textAlign: 'center',
                                  px: 3,
                                  py: 1,
                                  minWidth: 180
                                }}>
                                  <Typography variant="h5" sx={{ 
                                    fontWeight: 'bold',
                                    fontSize: 24,
                                    color: 'rgba(0,0,0,0.87)',
                                    letterSpacing: '-0.5px'
                                  }}>
                                    {marketData.medianPrice ? formatCurrency(marketData.medianPrice) : 'N/A'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                                    <Typography variant="caption" sx={{ 
                                      fontSize: 12,
                                      color: '#2a2630',
                                      fontWeight: 500
                                    }}>
                                      Estimated value
                                    </Typography>
                                    <ArrowOutwardIcon sx={{ fontSize: 16 }} />
                                  </Box>
                                </Box>

                                {/* Growth trend */}
                                <Box sx={{ 
                                  textAlign: 'center',
                                  px: 3,
                                  py: 1,
                                  minWidth: 180
                                }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                    <Typography variant="h5" sx={{ 
                                      fontWeight: 'bold',
                                      fontSize: 24,
                                      color: marketData.priceGrowth12Months && marketData.priceGrowth12Months >= 0 ? '#2e7d32' : '#d32f2f',
                                      letterSpacing: '-0.5px'
                                    }}>
                                      {marketData.priceGrowth12Months !== null 
                                        ? `${marketData.priceGrowth12Months >= 0 ? '+' : ''}${marketData.priceGrowth12Months.toFixed(2)}%`
                                        : 'N/A'
                                      }
                                    </Typography>
                                    {marketData.priceGrowth12Months !== null && (
                                      <TrendingUpIcon sx={{ 
                                        fontSize: 24, 
                                        color: marketData.priceGrowth12Months >= 0 ? '#2e7d32' : '#d32f2f',
                                        transform: marketData.priceGrowth12Months < 0 ? 'rotate(180deg)' : 'none'
                                      }} />
                                    )}
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                                    <Typography variant="caption" sx={{ 
                                      fontSize: 12,
                                      color: '#2a2630',
                                      fontWeight: 500
                                    }}>
                                      12 month growth trend
                                    </Typography>
                                    <ArrowOutwardIcon sx={{ fontSize: 16 }} />
                                  </Box>
                                </Box>
                              </Box>
                            )}
                          </Stack>
                        </Box>

                        {/* PropTrack attribution - OUTSIDE the box */}
                        {marketData && propertyType && bedrooms && (
                          <Box sx={{ 
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 0.5
                          }}>
                            <Typography variant="caption" sx={{ 
                              fontSize: 11,
                              color: '#555159',
                              fontWeight: 500
                            }}>
                              realEstimate valuation powered by
                            </Typography>
                            <Box
                              component="img"
                              src="/proptrack-logo.svg"
                              alt="PropTrack"
                              sx={{ height: 20, width: 75 }}
                            />
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                )}


                {/* Financial inputs */}
                <Card sx={{ borderRadius: 3, backgroundColor: '#ffffff' }}>
                  <CardContent sx={{ padding: 4 }}>
                    <Stack spacing={4}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 20 }}>
                        Financial details
                      </Typography>

                      <Stack spacing={3}>
                        <TextField
                          label="Your budget"
                          value={formatCurrencyInput(financialInputs.expectedPurchasePrice)}
                          onChange={handleFinancialInputChange('expectedPurchasePrice')}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                          helperText="The amount you'd like to pay."
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
                          label="Savings you will contribute"
                          value={formatCurrencyInput(financialInputs.savingsForPurchase)}
                          onChange={handleFinancialInputChange('savingsForPurchase')}
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

                        <TextField
                          label="Additional cash"
                          value={formatCurrencyInput(financialInputs.additionalCashToBorrow)}
                          onChange={handleFinancialInputChange('additionalCashToBorrow')}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                          helperText="Need extra funds for renovations or other plans? Add the amount here."
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
              </>
            )}

              {/* Next Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selection}
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