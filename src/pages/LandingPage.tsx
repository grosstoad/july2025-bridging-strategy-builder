import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Stack,
  Button,
  Alert,
  Link
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { AddressAutocomplete } from '../components/inputs/AddressAutocomplete';
import { AddressSuggestion } from '../types/proptrack';
import { useProperty } from '../contexts/PropertyContext';
import { ProcessSteps } from '../components/landing/ProcessSteps';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentProperty } = useProperty();
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const handleAddressSelect = (address: AddressSuggestion) => {
    setSelectedAddress(address);
    setShowValidationMessage(false);
    console.log('Selected address:', address);
    
    // Store address in context
    setCurrentProperty({ 
      address,
      propertyId: address.propertyId || 'manual'
    });
  };

  const handleCTAClick = (ctaType: 'standard' | 'calculator') => {
    if (!selectedAddress) {
      setShowValidationMessage(true);
      return;
    }

    // Store the CTA type in session storage for later use
    sessionStorage.setItem('ctaType', ctaType);
    
    // Navigate to current property page
    const propertyId = selectedAddress.propertyId || 'manual';
    navigate(`/current-property/${propertyId}`);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Main Content */}
      <Container 
        maxWidth="md" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: { xs: 8, md: 16 }
        }}
      >
        <Stack spacing={8} alignItems="center" textAlign="center">
          {/* Hero Section with title, subtitle and powered by */}
          <Stack spacing={3} alignItems="center">
            <Typography 
              variant="h1" 
              component="h1"
              sx={{ 
                fontSize: '64px',
                fontWeight: 700,
                color: 'rgba(0, 0, 0, 0.87)',
                lineHeight: '72px',
                letterSpacing: '-2px',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              HomeSwitch
            </Typography>
            
            <Typography 
              variant="h6" 
              component="p"
              sx={{ 
                fontSize: '24px',
                fontWeight: 500,
                color: 'rgba(0, 0, 0, 0.6)',
                lineHeight: '32px',
                letterSpacing: '-0.5px',
                maxWidth: '614px',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              See how different strategies could help you time your move and secure your next property.
            </Typography>

            {/* Powered by section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Typography 
                sx={{ 
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#555159',
                  lineHeight: '14px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Powered by
              </Typography>
              <Box 
                component="img" 
                src="/realestate-logo.png"
                alt="realestate.com.au"
                sx={{ 
                  height: 24,
                  width: 'auto',
                  display: 'block'
                }}
              />
            </Box>
          </Stack>

          {/* Address search and buttons group */}
          <Stack spacing={4} alignItems="center" sx={{ width: '100%' }}>
            {/* Address Search Input */}
            <Box sx={{ width: '100%', maxWidth: 600 }}>
            <AddressAutocomplete
              placeholder="Enter your current property address to get started"
              onAddressSelect={handleAddressSelect}
              value={inputValue}
              onChange={setInputValue}
            />
          </Box>

            {/* Validation Message */}
            {showValidationMessage && (
              <Alert 
                severity="info" 
                sx={{ 
                  width: '100%', 
                  maxWidth: 600
                }}
              >
                Please enter your property address to continue
              </Alert>
            )}

            {/* CTA Buttons */}
            <Stack 
              direction="row"
              spacing={2} 
              alignItems="center"
              justifyContent="center"
            >
            <Button
              variant="contained"
              size="large"
              onClick={() => handleCTAClick('standard')}
              disableElevation
              sx={{
                minHeight: 42,
                px: 3,
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: '26px',
                letterSpacing: '0.46px',
                textTransform: 'none',
                backgroundColor: '#9c27b0',
                fontFamily: 'Inter, sans-serif',
                '&:hover': {
                  backgroundColor: '#7b1fa2',
                }
              }}
            >
              Let's go
            </Button>
            <Link
              component="button"
              onClick={() => handleCTAClick('calculator')}
              underline="hover"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '13px',
                fontWeight: 500,
                lineHeight: '22px',
                letterSpacing: '0.46px',
                color: '#9c27b0',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                '&:hover': {
                  color: '#7b1fa2',
                }
              }}
            >
              Bridging calculator
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Link>
            </Stack>
          </Stack>

          {/* Debug Info - Remove in production */}
          {selectedAddress && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1, maxWidth: 600, width: '100%' }}>
              <Typography variant="caption" color="text.secondary">
                Selected: {selectedAddress.address.fullAddress}
                {selectedAddress.propertyId && ` (ID: ${selectedAddress.propertyId})`}
              </Typography>
            </Box>
          )}
        </Stack>
      </Container>

      {/* Process Steps Section */}
      <ProcessSteps />
    </Box>
  );
};