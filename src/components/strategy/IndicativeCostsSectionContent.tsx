import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';

interface IndicativeCostsSectionContentProps {
  strategy: 'BBYS' | 'SBYB' | 'KB' | 'SS';
}

interface CostData {
  movingCosts: number;
  sellingCosts: number;
  stampDuty: number;
  bridgingCosts: number;
}

// Default values by strategy
const COST_DEFAULTS: Record<string, CostData> = {
  BBYS: { movingCosts: 10000, sellingCosts: 20000, stampDuty: 40000, bridgingCosts: 35000 },
  SBYB: { movingCosts: 50000, sellingCosts: 20000, stampDuty: 40000, bridgingCosts: 0 },
  KB: { movingCosts: 10000, sellingCosts: 0, stampDuty: 40000, bridgingCosts: 0 },
  SS: { movingCosts: 10000, sellingCosts: 20000, stampDuty: 40000, bridgingCosts: 0 }
};

// Cost field configurations with tooltips
const COST_FIELDS = [
  {
    key: 'movingCosts' as keyof CostData,
    label: 'Moving costs',
    tooltip: 'Estimated cost to move your belongings'
  },
  {
    key: 'sellingCosts' as keyof CostData,
    label: 'Selling costs',
    tooltip: 'Agent commission, marketing, and legal fees for selling'
  },
  {
    key: 'stampDuty' as keyof CostData,
    label: 'Stamp duty',
    tooltip: 'Government stamp duty tax on property purchase'
  },
  {
    key: 'bridgingCosts' as keyof CostData,
    label: 'Bridging costs',
    tooltip: 'Interest and fees for bridging loan if required'
  }
];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatCurrencyInput = (value: string): string => {
  // Remove non-numeric characters except comma
  const numericValue = value.replace(/[^0-9]/g, '');
  if (!numericValue) return '';
  
  // Add comma separators
  return parseInt(numericValue).toLocaleString('en-AU');
};

const parseCurrencyInput = (value: string): number => {
  const numericValue = value.replace(/[^0-9]/g, '');
  return numericValue ? parseInt(numericValue) : 0;
};

export const IndicativeCostsSectionContent: React.FC<IndicativeCostsSectionContentProps> = ({
  strategy
}) => {
  const [expanded, setExpanded] = useState(true);
  const [costs, setCosts] = useState<CostData>(COST_DEFAULTS[strategy]);

  const handleCostChange = (field: keyof CostData, value: string) => {
    const numericValue = parseCurrencyInput(value);
    setCosts(prev => ({ ...prev, [field]: numericValue }));
  };

  const totalCosts = Object.values(costs).reduce((sum, cost) => sum + cost, 0);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleAccordionChange}
      disableGutters
      elevation={0}
      sx={{
        '&:before': {
          display: 'none',
        },
        '& .MuiAccordionSummary-root': {
          padding: 0,
          minHeight: 'auto',
          '&.Mui-expanded': {
            minHeight: 'auto',
          },
        },
        '& .MuiAccordionSummary-content': {
          margin: 0,
          '&.Mui-expanded': {
            margin: 0,
          },
        },
        '& .MuiAccordionDetails-root': {
          padding: 0,
          paddingTop: 2,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />}
        sx={{ display: 'none' }}
      />
      
      <AccordionDetails>
        <Stack spacing={2}>
          {/* Cost Input Fields */}
          {COST_FIELDS.map((field) => (
            <Stack key={field.key} direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: '140px' }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  >
                    {field.label}
                  </Typography>
                  <Tooltip title={field.tooltip} arrow>
                    <IconButton size="small" sx={{ p: 0.25 }}>
                      <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              
              <Box sx={{ width: '120px' }}>
                <TextField
                  size="small"
                  value={formatCurrencyInput(costs[field.key].toString())}
                  onChange={(e) => handleCostChange(field.key, e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    sx: {
                      fontSize: '0.875rem',
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#bdbdbd',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                  fullWidth
                />
              </Box>
            </Stack>
          ))}
          
          {/* Total Costs */}
          <Box 
            sx={{ 
              mt: 2, 
              pt: 2, 
              borderTop: '1px solid #e0e0e0',
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              p: 2
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                Total costs
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'text.primary'
                }}
              >
                {formatCurrency(totalCosts)}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};