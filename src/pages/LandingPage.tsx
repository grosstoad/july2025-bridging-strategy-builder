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
        backgroundColor: '#fafafa'
      }}
    >
      {/* Navigation Placeholder */}
      <Box 
        sx={{ 
          height: 64,
          backgroundColor: '#e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          NAV PLACEHOLDER
        </Typography>
      </Box>

      {/* Main Content */}
      <Container 
        maxWidth="md" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 8
        }}
      >
        <Stack spacing={6} alignItems="center" textAlign="center">
          {/* Hero Section */}
          <Stack spacing={3} alignItems="center" maxWidth="800px">
            <Typography 
              variant="h1" 
              component="h1"
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 700,
                color: '#333',
                lineHeight: 1.2
              }}
            >
              Work out your next move
            </Typography>
            
            <Typography 
              variant="h6" 
              component="p"
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.125rem' },
                fontWeight: 400,
                color: '#666',
                lineHeight: 1.5,
                maxWidth: '600px'
              }}
            >
              This quick tool helps us explore what's possible - based on your current 
              property, your goals, and your finances. We'll use it together to compare 
              different strategies and see where we can go from here.
            </Typography>
          </Stack>

          {/* PropTrack Branding */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Powered by
            </Typography>
            <Box 
              component="img" 
              src="/proptrack-logo.svg"
              alt="PropTrack"
              sx={{ 
                height: 20,
                width: 'auto',
                display: 'block'
              }}
            />
          </Box>

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
                maxWidth: 600,
                mt: 2
              }}
            >
              Please enter your property address to continue
            </Alert>
          )}

          {/* CTA Buttons */}
          <Stack 
            direction="row"
            spacing={3} 
            alignItems="center"
            justifyContent="center"
            sx={{ 
              width: '100%',
              mt: 3
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => handleCTAClick('standard')}
              disableElevation
              sx={{
                minHeight: 48,
                px: 4,
                fontSize: '1.125rem',
                textTransform: 'none',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
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
                gap: 0.5,
                fontSize: '1rem',
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.dark',
                }
              }}
            >
              Bridging calculator
              <ArrowForwardIcon sx={{ fontSize: 20 }} />
            </Link>
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

      {/* Footer Placeholder */}
      <Box 
        sx={{ 
          height: 64,
          backgroundColor: '#e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          FOOTER PLACEHOLDER
        </Typography>
      </Box>
    </Box>
  );
};