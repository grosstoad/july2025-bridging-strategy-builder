import React from 'react';
import { 
  Box,
  Typography,
  Stack
} from '@mui/material';

interface MarketRisksSectionProps {
  strategy: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  currentPropertyLocation?: string;
  newPropertyLocation?: string;
}

export const MarketRisksSection: React.FC<MarketRisksSectionProps> = ({
  strategy,
  currentPropertyLocation,
  newPropertyLocation
}) => {
  // Get market risk message
  const getMarketRiskMessage = () => {
    switch (strategy) {
      case 'BBYS':
        return `If the market in ${currentPropertyLocation || 'your area'} falls, your current property could sell for less leaving you with a potential shortfall. Consider adding a price guarantee to lock in your price.`;
      case 'SBYB':
        return `If the market rises after you sell, buying could become more expensive. You may need extra funds or risk missing out. If you've found the right home, consider buying now to lock in the price.`;
      case 'KB':
        return `If the market in ${newPropertyLocation || 'your area'} falls, your investment property value may decrease.`;
      case 'SS':
        return `Coordinating two settlements on the same day leaves little room for error and may force compromises on price or timing.`;
      default:
        return '';
    }
  };

  return (
    <Box>
      <Typography 
        variant="body2" 
        sx={{ 
          fontSize: '0.875rem', 
          fontWeight: 600, 
          mb: 1 
        }}
      >
        Market risks for this strategy:
      </Typography>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Typography 
          component="span" 
          sx={{ 
            fontSize: '1rem',
            color: '#ff9800',
            flexShrink: 0
          }}
        >
          ⚠️
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontSize: '0.813rem', 
            lineHeight: 1.5 
          }}
        >
          {getMarketRiskMessage()}
        </Typography>
      </Stack>
    </Box>
  );
};