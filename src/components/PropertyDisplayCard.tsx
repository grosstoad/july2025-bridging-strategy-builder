import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Stack,
  Button
} from '@mui/material';
import { 
  Edit as EditIcon,
  Home as HomeIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  DirectionsCar as CarIcon,
  ArrowOutward as ArrowOutwardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { useProperty } from '../contexts/PropertyContext';
import { PropertyAttributesModal } from './PropertyAttributesModal';
import { useCurrentPropertyMarketData } from '../hooks/useCurrentPropertyMarketData';

// Placeholder icons - these would be replaced with the actual design system icons
const LandSizeIcon = () => (
  <Box component="span" sx={{ width: 20, height: 20, display: 'inline-block' }}>📐</Box>
);

const FloorPlanIcon = () => (
  <Box component="span" sx={{ width: 20, height: 20, display: 'inline-block' }}>📏</Box>
);

interface PropertyDisplayCardProps {
  showEditButton?: boolean;
  onEdit?: () => void;
  propertyData?: any;
  valuations?: any;
  isLoading?: boolean;
}

export const PropertyDisplayCard: React.FC<PropertyDisplayCardProps> = ({ 
  showEditButton = true,
  onEdit,
  propertyData,
  valuations,
  isLoading = false
}) => {
  const { currentProperty } = useProperty();
  
  const [imageError, setImageError] = useState(false);

  // Debug logging
  console.log('PropertyDisplayCard props:', { 
    hasPropertyData: !!propertyData, 
    hasValuations: !!valuations, 
    isLoading 
  });

  // Show loading state if data is being fetched
  if (isLoading) {
    console.log('PropertyDisplayCard showing loading state');
    return (
      <Card 
        sx={{ 
          borderRadius: 3,
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
          overflow: 'visible',
          height: 244,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body2" sx={{ color: '#666' }}>Loading property data...</Typography>
      </Card>
    );
  }

  const formatCurrency = (value?: number): string => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Get data from PropTrack API or fallback to mock data
  const latestValuation = valuations?.valuations?.[0];
  const primaryImage = propertyData?.images?.[0];
  
  const displayData = {
    address: propertyData?.address?.fullAddress || currentProperty.address?.address.fullAddress || '1 Straight Forward Street',
    suburb: propertyData?.address ? `${propertyData.address.suburb} ${propertyData.address.state} ${propertyData.address.postcode}` : 'SUBURBIA NSW 2075',
    propertyType: propertyData?.attributes?.propertyType ? propertyData.attributes.propertyType.charAt(0).toUpperCase() + propertyData.attributes.propertyType.slice(1) : 'House',
    bedrooms: propertyData?.attributes?.bedrooms || currentProperty.attributes?.bedrooms || 4,
    bathrooms: propertyData?.attributes?.bathrooms || currentProperty.attributes?.bathrooms || 2,
    carSpaces: propertyData?.attributes?.carSpaces || currentProperty.attributes?.carSpaces || 2,
    landSize: propertyData?.attributes?.landSize || currentProperty.attributes?.landSize || 1071,
    floorPlanSize: propertyData?.attributes?.floorPlanSize || currentProperty.attributes?.floorPlanSize || 311,
    lowEstimate: latestValuation?.lowEstimate || currentProperty.valuation?.lowEstimate || 1740000,
    estimate: latestValuation?.estimate || currentProperty.valuation?.estimate || currentProperty.propertyValue || 1960000,
    highEstimate: latestValuation?.highEstimate || currentProperty.valuation?.highEstimate || 2670000,
    image: primaryImage?.url || null,
    marketStatus: propertyData?.marketStatus || 'Off market',
    activeListings: propertyData?.activeListings || []
  };



  return (
    <Card 
      sx={{ 
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        boxShadow: 'none',
        overflow: 'visible'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', height: 244 }}>
        {/* Property Image */}
        <Box
          sx={{
            width: 168,
            height: 244,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            backgroundImage: !displayData.image || imageError 
              ? 'url(https://i2.au.reastatic.net/936x616-resize,extend,r=33,g=40,b=46/131d12c86977c42d3c7995ed7443fae88e949220d983f00583d89e3c48804052/image.jpg)'
              : `url(${displayData.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: !displayData.image || imageError ? '#ffffff' : 'transparent',
            fontSize: 14,
            fontWeight: 500,
            order: 1,
            position: 'relative'
          }}
        >
          {displayData.image && (
            <Box
              component="img"
              src={displayData.image}
              alt="Property"
              onError={() => setImageError(true)}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
                display: imageError ? 'none' : 'block'
              }}
            />
          )}
        </Box>

        {/* Property Details */}
        <CardContent sx={{ flex: 1, padding: 3, order: 2 }}>
          <Stack spacing={3} sx={{ height: '100%', justifyContent: 'center' }}>
            {/* Address */}
            <Stack spacing={1}>
              <Chip 
                label={displayData.marketStatus} 
                size="small"
                sx={{ 
                  backgroundColor: displayData.marketStatus === 'For Sale' ? 'rgba(76, 175, 80, 0.12)' : 'rgba(0,0,0,0.08)',
                  color: displayData.marketStatus === 'For Sale' ? '#2e7d32' : 'rgba(0,0,0,0.87)',
                  fontWeight: 500,
                  fontSize: 14,
                  height: 24,
                  borderRadius: '100px',
                  width: 'fit-content'
                }}
              />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: 20, 
                    lineHeight: '24px',
                    color: '#2a2630',
                    letterSpacing: '-0.25px'
                  }}
                >
                  {displayData.address}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 500, 
                    fontSize: 18, 
                    lineHeight: '24px',
                    color: 'rgba(0,0,0,0.6)',
                    letterSpacing: '-0.25px'
                  }}
                >
                  {displayData.suburb}
                </Typography>
              </Box>
            </Stack>

            {/* Property Features */}
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={2}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <HomeIcon sx={{ fontSize: 20, color: '#555159' }} />
                    <Typography variant="body2" sx={{ color: '#555159', fontWeight: 500 }}>
                      {displayData.propertyType}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <BedIcon sx={{ fontSize: 20, color: '#555159' }} />
                    <Typography variant="body2" sx={{ color: '#555159', fontWeight: 500 }}>
                      {displayData.bedrooms}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <BathtubIcon sx={{ fontSize: 20, color: '#555159' }} />
                    <Typography variant="body2" sx={{ color: '#555159', fontWeight: 500 }}>
                      {displayData.bathrooms}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CarIcon sx={{ fontSize: 20, color: '#555159' }} />
                    <Typography variant="body2" sx={{ color: '#555159', fontWeight: 500 }}>
                      {displayData.carSpaces}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <LandSizeIcon />
                    <Typography variant="body2" sx={{ color: '#555159', fontWeight: 500 }}>
                      {displayData.landSize}m²
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <FloorPlanIcon />
                    <Typography variant="body2" sx={{ color: '#555159', fontWeight: 500 }}>
                      {displayData.floorPlanSize}m²
                    </Typography>
                  </Stack>
                </Stack>
                {showEditButton && (
                  <Button
                    onClick={onEdit}
                    endIcon={<EditIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      color: '#9c27b0',
                      fontSize: '13px',
                      fontWeight: 500,
                      lineHeight: '22px',
                      letterSpacing: '0.46px',
                      textTransform: 'none',
                      padding: '4px 8px',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#7b1fa2'
                      }
                    }}
                  >
                    Edit
                  </Button>
                )}
              </Box>

            </Stack>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export const PropertyDisplayCardWithAttribution: React.FC<PropertyDisplayCardProps> = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [updatedValuations, setUpdatedValuations] = useState<any>(null);
  const [updatedAttributes, setUpdatedAttributes] = useState<any>(null);

  // Extract location data for market data hook
  const suburb = props.propertyData?.address?.suburb || null;
  const state = props.propertyData?.address?.state || null;
  const postcode = props.propertyData?.address?.postcode || null;
  const propertyType = props.propertyData?.attributes?.propertyType || null;

  // Fetch market growth data
  const { data: marketData } = useCurrentPropertyMarketData(
    suburb,
    state,
    postcode,
    propertyType
  );

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleAttributesUpdate = (newValuation: any, attributes: any) => {
    // Handle valuation and attribute updates
    console.log('Updated valuation:', newValuation);
    console.log('Updated attributes:', attributes);
    
    // Update local state to reflect changes in the background UI
    setUpdatedValuations(newValuation);
    setUpdatedAttributes(attributes);
  };

  // Use updated data if available, otherwise use original props
  const currentValuations = updatedValuations || props.valuations;
  const currentPropertyData = updatedAttributes ? {
    ...props.propertyData,
    attributes: {
      ...props.propertyData?.attributes,
      ...updatedAttributes
    }
  } : props.propertyData;

  // Get valuation data from props
  const latestValuation = currentValuations?.valuations?.[0];
  const estimate = latestValuation?.estimate || currentPropertyData?.valuation?.estimate || props.propertyData?.valuation?.estimate || 1960000;
  const lowEstimate = latestValuation?.lowEstimate || currentPropertyData?.valuation?.lowEstimate || 1740000;
  const highEstimate = latestValuation?.highEstimate || currentPropertyData?.valuation?.highEstimate || 2670000;

  const formatCurrency = (value?: number): string => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Stack spacing={2}>
      {/* Property Card */}
      <PropertyDisplayCard 
        {...props}
        propertyData={currentPropertyData}
        valuations={currentValuations}
        onEdit={handleEditClick}
      />
      
      {/* Valuation Section - Separate from Property Card */}
      <Card 
        sx={{ 
          borderRadius: 3,
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
          backgroundColor: '#ffffff'
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
            {/* Valuation Bar Section */}
            <Stack spacing={1} sx={{ flex: 1 }}>
              {/* Progress Bar */}
              <Box sx={{ position: 'relative', height: 24, borderRadius: '64px', backgroundColor: '#f2ecff' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  height: '100%',
                  paddingX: 2
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: 12, color: '#000000' }}>
                    ${(lowEstimate / 1000000).toFixed(2)}m
                  </Typography>
                  <Box sx={{
                    backgroundColor: '#350736',
                    color: '#ffffff',
                    paddingX: 1.5,
                    paddingY: 0.5,
                    borderRadius: '32px',
                    fontWeight: 'bold',
                    fontSize: 18
                  }}>
                    {formatCurrency(estimate)}
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: 12, color: '#000000' }}>
                    ${(highEstimate / 1000000).toFixed(2)}m
                  </Typography>
                </Box>
              </Box>

              {/* Valuation Labels */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingX: 2 }}>
                <Typography variant="caption" sx={{ fontSize: 11, color: '#555159', fontWeight: 500 }}>
                  Low
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: '#007443' 
                  }} />
                  <Typography variant="body2" sx={{ fontSize: 12, color: '#2a2630', fontWeight: 500 }}>
                    Estimated value
                  </Typography>
                  <ArrowOutwardIcon sx={{ fontSize: 16 }} />
                </Stack>
                <Typography variant="caption" sx={{ fontSize: 11, color: '#555159', fontWeight: 500 }}>
                  High
                </Typography>
              </Box>
            </Stack>

            {/* Growth Trend */}
            {marketData && marketData.growthRate12Months !== null && (
              <Stack spacing={0.5} alignItems="center" sx={{ minWidth: 140 }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography 
                    sx={{ 
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: marketData.growthRate12Months >= 0 ? '#2e7d32' : '#d32f2f',
                      letterSpacing: '-0.25px'
                    }}
                  >
                    {marketData.growthRate12Months >= 0 ? '+' : ''}
                    {marketData.growthRate12Months.toFixed(2)}%
                  </Typography>
                  {marketData.growthRate12Months >= 0 ? (
                    <TrendingUpIcon sx={{ fontSize: 24, color: '#2e7d32' }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 24, color: '#d32f2f' }} />
                  )}
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography 
                    sx={{ 
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#2a2630',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    12 month growth trend
                  </Typography>
                  <ArrowOutwardIcon sx={{ fontSize: 16 }} />
                </Stack>
              </Stack>
            )}
          </Box>
        </CardContent>
      </Card>
      
      {/* PropTrack Attribution - Below Valuation */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" sx={{ fontSize: 11, color: '#555159', fontWeight: 500 }}>
            Powered by
          </Typography>
          <Box component="img" src="/proptrack-logo.svg" alt="PropTrack" sx={{ height: 20, width: 75 }} />
        </Stack>
      </Box>
      
      {/* Property Attributes Modal */}
      <PropertyAttributesModal
        open={modalOpen}
        onClose={handleModalClose}
        propertyData={props.propertyData}
        valuations={props.valuations}
        onUpdate={handleAttributesUpdate}
      />
    </Stack>
  );
};