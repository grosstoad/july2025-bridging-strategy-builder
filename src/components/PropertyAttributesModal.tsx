import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  Home as HomeIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  DirectionsCar as CarIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import { useCreateValuation } from '../hooks/useCreateValuation';

interface PropertyAttributesModalProps {
  open: boolean;
  onClose: () => void;
  propertyData?: any;
  valuations?: any;
  onUpdate?: (newValuation: any, attributes: any) => void;
}

export const PropertyAttributesModal: React.FC<PropertyAttributesModalProps> = ({
  open,
  onClose,
  propertyData,
  valuations,
  onUpdate
}) => {
  const [propertyType, setPropertyType] = useState(propertyData?.attributes?.propertyType || 'house');
  const [bedrooms, setBedrooms] = useState(propertyData?.attributes?.bedrooms || 4);
  const [bathrooms, setBathrooms] = useState(propertyData?.attributes?.bathrooms || 2);
  const [carSpaces, setCarSpaces] = useState(propertyData?.attributes?.carSpaces || 2);
  const [updatedValuation, setUpdatedValuation] = useState(valuations);
  
  const { createValuation, isLoading: isCreatingValuation, error: valuationError } = useCreateValuation();

  // Use updated valuation if available, otherwise fall back to original
  const currentValuations = updatedValuation || valuations;
  const latestValuation = currentValuations?.valuations?.[0];
  const estimate = latestValuation?.estimate || latestValuation?.estimatedValue || 1960000;
  const lowEstimate = latestValuation?.lowEstimate || latestValuation?.lowerRangeValue || 1740000;
  const highEstimate = latestValuation?.highEstimate || latestValuation?.upperRangeValue || 2670000;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleUpdate = async () => {
    if (!propertyData?.propertyId) {
      console.error('No property ID available for valuation update');
      return;
    }

    try {
      const attributes = {
        propertyType,
        bedrooms,
        bathrooms,
        carSpaces
      };
      
      console.log('Updating valuation with attributes:', attributes);
      
      // Get the full address from propertyData
      const fullAddress = propertyData.address?.fullAddress || propertyData.fullAddress;
      if (!fullAddress) {
        console.error('No address available for valuation update');
        return;
      }
      
      const newValuation = await createValuation(
        propertyData.propertyId.toString(), 
        fullAddress,
        attributes
      );
      
      if (newValuation) {
        console.log('Received new valuation:', newValuation);
        
        // Normalize the valuation data to match our expected format
        const normalizedValuation = {
          valuations: [{
            estimate: newValuation.estimatedValue,
            lowEstimate: newValuation.lowerRangeValue,
            highEstimate: newValuation.upperRangeValue,
            confidence: newValuation.confidenceLevel,
            valuationDate: newValuation.valuationDate
          }]
        };
        
        // Update the modal's state immediately
        setUpdatedValuation(normalizedValuation);
        
        // Notify parent component with new valuation and attributes
        if (onUpdate) {
          onUpdate(normalizedValuation, attributes);
        }
      }
    } catch (error) {
      console.error('Failed to update valuation:', error);
    }
  };

  // Reset state when modal opens with new data
  useEffect(() => {
    if (open) {
      setPropertyType(propertyData?.attributes?.propertyType || 'house');
      setBedrooms(propertyData?.attributes?.bedrooms || 4);
      setBathrooms(propertyData?.attributes?.bathrooms || 2);
      setCarSpaces(propertyData?.attributes?.carSpaces || 2);
      setUpdatedValuation(null); // Reset to show original valuation initially
    }
  }, [open, propertyData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          padding: 0,
          backgroundColor: '#ffffff',
          boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.24)',
          width: '720px',
          maxWidth: '720px'
        }
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <Box sx={{ position: 'relative', padding: '48px 64px' }}>
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 24,
              right: 24,
              padding: 1,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
            }}
          >
            <CloseIcon sx={{ fontSize: 24, color: '#666' }} />
          </IconButton>

          <Stack spacing={4}>
            {/* Header */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  fontSize: 32,
                  lineHeight: '40px',
                  color: '#2a2630',
                  marginBottom: 2
                }}
              >
                Update your property attributes
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: 16,
                  color: 'rgba(0,0,0,0.6)',
                  lineHeight: '24px'
                }}
              >
                Get the most accurate realEstimate valuation by sharing the latest details of your property.
              </Typography>
            </Box>

            {/* Form Controls */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
              {/* Property Type */}
              <FormControl sx={{ flex: 1, maxWidth: 140 }}>
                <Typography variant="caption" sx={{ fontSize: 12, color: '#666', marginBottom: 1 }}>
                  Property type
                </Typography>
                <Select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  IconComponent={ArrowDownIcon}
                  sx={{
                    height: 56,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      padding: '16px 20px',
                      fontSize: 16
                    }
                  }}
                  startAdornment={
                    <HomeIcon sx={{ fontSize: 20, color: '#666', marginRight: 1 }} />
                  }
                >
                  <MenuItem value="house">House</MenuItem>
                  <MenuItem value="apartment">Apartment</MenuItem>
                  <MenuItem value="townhouse">Townhouse</MenuItem>
                  <MenuItem value="unit">Unit</MenuItem>
                  <MenuItem value="villa">Villa</MenuItem>
                </Select>
              </FormControl>

              {/* Bedrooms */}
              <FormControl sx={{ flex: 1, maxWidth: 100 }}>
                <Typography variant="caption" sx={{ fontSize: 12, color: '#666', marginBottom: 1 }}>
                  Beds
                </Typography>
                <Select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  IconComponent={ArrowDownIcon}
                  sx={{
                    height: 56,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      padding: '16px 20px',
                      fontSize: 16
                    }
                  }}
                  startAdornment={
                    <BedIcon sx={{ fontSize: 20, color: '#666', marginRight: 1 }} />
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <MenuItem key={num} value={num}>{num}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Bathrooms */}
              <FormControl sx={{ flex: 1, maxWidth: 120 }}>
                <Typography variant="caption" sx={{ fontSize: 12, color: '#666', marginBottom: 1 }}>
                  Bathrooms
                </Typography>
                <Select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  IconComponent={ArrowDownIcon}
                  sx={{
                    height: 56,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      padding: '16px 20px',
                      fontSize: 16
                    }
                  }}
                  startAdornment={
                    <BathtubIcon sx={{ fontSize: 20, color: '#666', marginRight: 1 }} />
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <MenuItem key={num} value={num}>{num}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Car Spaces */}
              <FormControl sx={{ flex: 1, maxWidth: 120 }}>
                <Typography variant="caption" sx={{ fontSize: 12, color: '#666', marginBottom: 1 }}>
                  Car spaces
                </Typography>
                <Select
                  value={carSpaces}
                  onChange={(e) => setCarSpaces(Number(e.target.value))}
                  IconComponent={ArrowDownIcon}
                  sx={{
                    height: 56,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      padding: '16px 20px',
                      fontSize: 16
                    }
                  }}
                  startAdornment={
                    <CarIcon sx={{ fontSize: 20, color: '#666', marginRight: 1 }} />
                  }
                >
                  {[0, 1, 2, 3, 4, 5, 6].map(num => (
                    <MenuItem key={num} value={num}>{num}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Valuation Section */}
            <Box
              sx={{
                backgroundColor: '#f8f9fa',
                borderRadius: 3,
                padding: '32px'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: '#2a2630',
                  marginBottom: 3
                }}
              >
                Your realEstimate valuation
              </Typography>

              {/* Progress Bar */}
              <Box sx={{ position: 'relative', height: 40, borderRadius: '64px', backgroundColor: '#f2ecff', marginBottom: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  height: '100%',
                  paddingX: 3
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: 14, color: '#000000' }}>
                    ${(lowEstimate / 1000000).toFixed(2)}m
                  </Typography>
                  <Box sx={{
                    backgroundColor: '#350736',
                    color: '#ffffff',
                    paddingX: 2,
                    paddingY: 1,
                    borderRadius: '32px',
                    fontWeight: 'bold',
                    fontSize: 18
                  }}>
                    {formatCurrency(estimate)}
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: 14, color: '#000000' }}>
                    ${(highEstimate / 1000000).toFixed(2)}m
                  </Typography>
                </Box>
              </Box>

              {/* Valuation Labels */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingX: 3 }}>
                <Typography variant="caption" sx={{ fontSize: 12, color: '#666', fontWeight: 500 }}>
                  Low
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: '#007443' 
                  }} />
                  <Typography variant="body2" sx={{ fontSize: 16, color: '#2a2630', fontWeight: 500 }}>
                    Estimated value
                  </Typography>
                  <Box sx={{ fontSize: 16 }}>↗</Box>
                </Stack>
                <Typography variant="caption" sx={{ fontSize: 12, color: '#666', fontWeight: 500 }}>
                  High
                </Typography>
              </Box>

              {/* PropTrack Attribution */}
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" sx={{ fontSize: 12, color: '#666', fontWeight: 500 }}>
                    realEstimate valuation powered by
                  </Typography>
                  <Box component="img" src="/proptrack-logo.svg" alt="PropTrack" sx={{ height: 16, width: 60 }} />
                </Stack>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  borderColor: '#ddd',
                  color: '#666',
                  fontWeight: 500,
                  fontSize: 15,
                  letterSpacing: '0.46px',
                  textTransform: 'uppercase',
                  paddingX: 4,
                  paddingY: 2,
                  borderRadius: 1,
                  '&:hover': {
                    borderColor: '#bbb',
                    backgroundColor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                CLOSE
              </Button>
              
              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={isCreatingValuation}
                sx={{
                  backgroundColor: '#9c27b0',
                  color: '#ffffff',
                  fontWeight: 500,
                  fontSize: 15,
                  letterSpacing: '0.46px',
                  textTransform: 'uppercase',
                  paddingX: 5,
                  paddingY: 2,
                  borderRadius: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#7b1fa2',
                    boxShadow: 'none'
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(0,0,0,0.12)',
                    color: 'rgba(0,0,0,0.26)'
                  }
                }}
              >
                {isCreatingValuation ? 'UPDATING...' : 'UPDATE'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};