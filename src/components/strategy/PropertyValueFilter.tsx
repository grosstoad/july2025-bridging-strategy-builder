import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Stack,
  InputAdornment,
  Tooltip,
  IconButton
} from '@mui/material';
import { Home as HomeIcon, Info as InfoIcon } from '@mui/icons-material';

interface GrowthScenarios {
  low: number;
  target: number;
  high: number;
}

interface PropertyValueFilterProps {
  label: string;
  value: number;
  growthScenarios: GrowthScenarios;
  onGrowthChange: (scenarios: GrowthScenarios) => void;
  onValueChange?: (value: number) => void;
  icon?: React.ReactNode;
  location?: string;
  sx?: any;
}

export const PropertyValueFilter: React.FC<PropertyValueFilterProps> = ({
  label,
  value,
  growthScenarios,
  onGrowthChange,
  onValueChange,
  icon = <HomeIcon sx={{ fontSize: 18 }} />,
  location = '',
  sx = {}
}) => {
  const handleScenarioChange = (scenario: keyof GrowthScenarios, newValue: string) => {
    const numericValue = parseFloat(newValue) || 0;
    onGrowthChange({
      ...growthScenarios,
      [scenario]: numericValue
    });
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-AU');
  };

  const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      const numericValue = parseCurrency(event.target.value);
      onValueChange(numericValue);
    }
  };

  return (
    <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 300, md: 320 }, ...sx }}>
      {/* Header with icon and label */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        mb: 1.5
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          backgroundColor: '#ebebeb',
          borderRadius: '100px',
          px: 1,
          py: 0.5
        }}>
          {icon}
          <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            {label}
          </Typography>
        </Box>
        
        {/* Estimated Value Field */}
        <TextField
          size="small"
          label="Estimated value"
          variant="outlined"
          value={`$${formatCurrency(value)}`}
          onChange={handleValueChange}
          sx={{
            width: 140,
            '& .MuiOutlinedInput-root': {
              height: 36,
              backgroundColor: 'white',
              '& input': {
                fontWeight: 600,
                fontSize: '0.875rem',
              }
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.75rem',
            }
          }}
        />
      </Box>

      {/* Growth Scenarios Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
          <Typography variant="caption" sx={{ fontSize: '0.688rem', color: 'rgba(0,0,0,0.6)' }}>
            {location ? `Growth for properties in ${location}` : 'Growth scenarios'}
          </Typography>
          <Tooltip title="These growth scenarios help estimate future property values based on market conditions">
            <IconButton size="small" sx={{ padding: 0 }}>
              <InfoIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Growth Inputs Row */}
        <Stack direction="row" spacing={0.5} sx={{ width: '100%' }}>
          <TextField
            size="small"
            label="Low"
            variant="outlined"
            value={growthScenarios.low}
            onChange={(e) => handleScenarioChange('low', e.target.value)}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end" sx={{ mr: -0.5 }}>
                <Typography sx={{ fontSize: '0.75rem' }}>%</Typography>
              </InputAdornment>,
              inputProps: {
                step: 0.1,
                style: { textAlign: 'center', fontSize: '0.875rem' }
              }
            }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                height: 32,
                backgroundColor: 'white',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.75rem',
              },
              '& .MuiInputBase-input': {
                padding: '4px 8px',
                fontSize: '0.875rem',
              }
            }}
          />

          <TextField
            size="small"
            label="Target"
            variant="outlined"
            value={growthScenarios.target}
            onChange={(e) => handleScenarioChange('target', e.target.value)}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end" sx={{ mr: -0.5 }}>
                <Typography sx={{ fontSize: '0.75rem' }}>%</Typography>
              </InputAdornment>,
              inputProps: {
                step: 0.1,
                style: { textAlign: 'center', fontSize: '0.875rem' }
              }
            }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                height: 32,
                backgroundColor: 'white',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.75rem',
              },
              '& .MuiInputBase-input': {
                padding: '4px 8px',
                fontSize: '0.875rem',
              }
            }}
          />

          <TextField
            size="small"
            label="High"
            variant="outlined"
            value={growthScenarios.high}
            onChange={(e) => handleScenarioChange('high', e.target.value)}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end" sx={{ mr: -0.5 }}>
                <Typography sx={{ fontSize: '0.75rem' }}>%</Typography>
              </InputAdornment>,
              inputProps: {
                step: 0.1,
                style: { textAlign: 'center', fontSize: '0.875rem' }
              }
            }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                height: 32,
                backgroundColor: 'white',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.75rem',
              },
              '& .MuiInputBase-input': {
                padding: '4px 8px',
                fontSize: '0.875rem',
              }
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
};