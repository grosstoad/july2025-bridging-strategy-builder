import React from 'react';
import { 
  Chip,
  Stack,
  Typography
} from '@mui/material';
import { differenceInMonths, addMonths } from 'date-fns';

interface PropertyMarketChipProps {
  strategy: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  currentPropertyValue: number;
  newPropertyValue: number;
  growthScenarios: {
    current: { low: number; target: number; high: number };
    new: { low: number; target: number; high: number };
  };
  readyToGoDate: Date;
  timeBetween: number;
  selectedScenario: 'worst' | 'target' | 'best';
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const PropertyMarketChip: React.FC<PropertyMarketChipProps> = ({
  strategy,
  currentPropertyValue,
  newPropertyValue,
  growthScenarios,
  readyToGoDate,
  timeBetween,
  selectedScenario = 'target'
}) => {
  // Calculate months until ready to go
  const monthsUntilReady = Math.max(0, differenceInMonths(readyToGoDate, new Date()));
  
  // Get growth rates based on strategy and scenario
  const getGrowthRates = () => {
    switch (strategy) {
      case 'BBYS':
      case 'SBYB':
      case 'SS':
        switch (selectedScenario) {
          case 'worst':
            return {
              current: growthScenarios.current.low,
              new: growthScenarios.new.high
            };
          case 'target':
            return {
              current: growthScenarios.current.target,
              new: growthScenarios.new.target
            };
          case 'best':
            return {
              current: growthScenarios.current.high,
              new: growthScenarios.new.low
            };
        }
        break;
      case 'KB':
        const newGrowth = selectedScenario === 'worst' 
          ? growthScenarios.new.high 
          : selectedScenario === 'best' 
          ? growthScenarios.new.low 
          : growthScenarios.new.target;
        
        return {
          current: 0,
          new: newGrowth
        };
    }
  };

  // Calculate projected values
  const calculateProjectedValue = (currentValue: number, annualGrowthRate: number, months: number) => {
    const monthlyGrowth = annualGrowthRate / 100 / 12;
    const growthFactor = 1 + (monthlyGrowth * months);
    return currentValue * growthFactor;
  };

  const growthRates = getGrowthRates()!;
  
  // Calculate timing based on strategy
  const getTimingMonths = () => {
    switch (strategy) {
      case 'BBYS':
        return {
          current: monthsUntilReady + timeBetween,
          new: monthsUntilReady
        };
      case 'SBYB':
        return {
          current: monthsUntilReady,
          new: monthsUntilReady + timeBetween
        };
      case 'KB':
        return {
          current: 0,
          new: monthsUntilReady
        };
      case 'SS':
        return {
          current: monthsUntilReady,
          new: monthsUntilReady
        };
      default:
        return { current: monthsUntilReady, new: monthsUntilReady };
    }
  };

  const timing = getTimingMonths();
  
  const projectedCurrentValue = calculateProjectedValue(
    currentPropertyValue, 
    growthRates.current, 
    timing.current
  );
  
  const projectedNewValue = calculateProjectedValue(
    newPropertyValue, 
    growthRates.new, 
    timing.new
  );

  // Calculate changes
  const currentValueChange = projectedCurrentValue - currentPropertyValue;
  const newValueChange = projectedNewValue - newPropertyValue;

  // Calculate possible shortfall/gain
  const calculateShortfall = () => {
    switch (strategy) {
      case 'BBYS':
      case 'SBYB':
      case 'SS':
        return -newValueChange + currentValueChange;
      case 'KB':
        return -newValueChange;
      default:
        return 0;
    }
  };

  const shortfall = calculateShortfall();
  const isShortfall = shortfall < 0;

  return (
    <Chip
      icon={
        <Typography 
          component="span" 
          sx={{ 
            fontSize: '1.125rem',
            mr: 0.5
          }}
        >
          {strategy === 'KB' ? '✅' : isShortfall ? '⚠️' : '✅'}
        </Typography>
      }
      label={
        <Stack direction="row" spacing={1} alignItems="baseline">
          <Typography 
            component="span" 
            sx={{ 
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            Possible difference of
          </Typography>
          <Typography 
            component="span" 
            sx={{ 
              fontSize: '1.125rem',
              fontWeight: 700
            }}
          >
            {formatCurrency(Math.abs(shortfall))}
          </Typography>
        </Stack>
      }
      sx={{
        height: 'auto',
        py: 1.5,
        px: 2,
        minWidth: '200px',
        backgroundColor: strategy === 'KB' ? '#e8f5e9' : isShortfall ? '#fff3e0' : '#e8f5e9',
        color: strategy === 'KB' ? '#1b5e20' : isShortfall ? '#e65100' : '#1b5e20',
        '& .MuiChip-icon': {
          ml: 0,
          mr: 0.5,
          color: 'inherit'
        },
        '& .MuiChip-label': {
          px: 0
        }
      }}
    />
  );
};