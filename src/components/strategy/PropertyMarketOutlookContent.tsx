import React, { useState } from 'react';
import { 
  Box, 
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Chip,
  Link
} from '@mui/material';
import { differenceInMonths, format, addMonths } from 'date-fns';

interface PropertyMarketOutlookContentProps {
  strategy: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  currentPropertyValue: number;
  newPropertyValue: number;
  currentPropertyLocation: string;
  newPropertyLocation: string;
  growthScenarios: {
    current: { low: number; target: number; high: number };
    new: { low: number; target: number; high: number };
  };
  readyToGoDate: Date;
  timeBetween: number;
}

type ScenarioType = 'worst' | 'target' | 'best';

const scenarioConfig = {
  worst: { icon: '🌧️', label: 'Worst' },
  target: { icon: '📈', label: 'Trend' },
  best: { icon: '☀️', label: 'Best' }
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export const PropertyMarketOutlookContent: React.FC<PropertyMarketOutlookContentProps> = ({
  strategy,
  currentPropertyValue,
  newPropertyValue,
  currentPropertyLocation,
  newPropertyLocation,
  growthScenarios,
  readyToGoDate,
  timeBetween
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('target');

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
              new: growthScenarios.new.high,
              description: `Based on low growth in your selling market (${formatPercentage(growthScenarios.current.low)} p.a) and high growth in your buying market (${formatPercentage(growthScenarios.new.high)} p.a).`
            };
          case 'target':
            return {
              current: growthScenarios.current.target,
              new: growthScenarios.new.target,
              description: `Based on trend growth in your selling market (${formatPercentage(growthScenarios.current.target)} p.a) and trend growth in your buying market (${formatPercentage(growthScenarios.new.target)} p.a).`
            };
          case 'best':
            return {
              current: growthScenarios.current.high,
              new: growthScenarios.new.low,
              description: `Based on high growth in your selling market (${formatPercentage(growthScenarios.current.high)} p.a) and low growth in your buying market (${formatPercentage(growthScenarios.new.low)} p.a).`
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
          new: newGrowth,
          description: `Based on ${selectedScenario === 'target' ? 'trend' : selectedScenario} growth in your buying market (${formatPercentage(newGrowth)} p.a).`
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
          new: monthsUntilReady,
          buyDate: readyToGoDate,
          sellDate: addMonths(readyToGoDate, timeBetween)
        };
      case 'SBYB':
        return {
          current: monthsUntilReady,
          new: monthsUntilReady + timeBetween,
          sellDate: readyToGoDate,
          buyDate: addMonths(readyToGoDate, timeBetween)
        };
      case 'KB':
        return {
          current: 0,
          new: monthsUntilReady,
          buyDate: readyToGoDate,
          sellDate: null
        };
      case 'SS':
        return {
          current: monthsUntilReady,
          new: monthsUntilReady,
          buyDate: readyToGoDate,
          sellDate: readyToGoDate
        };
      default:
        return { current: monthsUntilReady, new: monthsUntilReady, buyDate: readyToGoDate, sellDate: readyToGoDate };
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

  return (
    <Box>
      <Stack spacing={2.5}>
        {/* Scenario Selector - Centered */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={selectedScenario}
            exclusive
            onChange={(_, value) => value && setSelectedScenario(value)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                px: 2,
                py: 0.75,
                fontSize: '0.875rem',
                fontWeight: 500,
                minWidth: 80,
                border: '1px solid #e0e0e0',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }
              }
            }}
          >
            {Object.entries(scenarioConfig).map(([key, config]) => (
              <ToggleButton key={key} value={key}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <span style={{ fontSize: '1.125rem' }}>{config.icon}</span>
                  <span>{config.label}</span>
                </Stack>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Growth Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontSize: '0.75rem',
            lineHeight: 1.5,
            textAlign: 'center'
          }}
        >
          {growthRates.description}
        </Typography>

        {/* Timeline chips will be contextual - moved to property value sections */}

        {/* Property Value Cards */}
        <Stack spacing={2}>
          {/* For BBYS and SS: Show new property (buy) first */}
          {(strategy === 'BBYS' || strategy === 'SS') && (
            <>
              <Box>
                {/* Buy timing chip */}
                {timing.buyDate && (
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <Box 
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#e0e0e0',
                        flexShrink: 0
                      }}
                    />
                    <Chip
                      label={`Buy in ${format(timing.buyDate, 'MMM yyyy')}`}
                      size="small"
                      sx={{
                        backgroundColor: '#e0e0e0',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        height: 28
                      }}
                    />
                  </Stack>
                )}
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ fontSize: '0.75rem', mb: 0.5 }}
                >
                  Your new property could be worth
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.5 }}
                >
                  {formatCurrency(projectedNewValue)}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.75rem',
                    color: newValueChange >= 0 ? 'error.main' : 'success.main'
                  }}
                >
                  {newValueChange >= 0 ? '+' : ''}{formatCurrency(Math.abs(newValueChange))} 
                  {newValueChange >= 0 ? ' more' : ' less'} than your estimated value
                </Typography>
              </Box>

              <Box>
                {/* Sell timing chip */}
                {timing.sellDate && (
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <Box 
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#e0e0e0',
                        flexShrink: 0
                      }}
                    />
                    <Chip
                      label={`Sell in ${format(timing.sellDate, 'MMM yyyy')}`}
                      size="small"
                      sx={{
                        backgroundColor: '#e0e0e0',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        height: 28
                      }}
                    />
                  </Stack>
                )}
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ fontSize: '0.75rem', mb: 0.5 }}
                >
                  Your current property could be worth
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.5 }}
                >
                  {formatCurrency(projectedCurrentValue)}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.75rem',
                    color: currentValueChange >= 0 ? 'success.main' : 'error.main'
                  }}
                >
                  {currentValueChange >= 0 ? '+' : ''}{formatCurrency(Math.abs(currentValueChange))} 
                  {currentValueChange >= 0 ? ' more' : ' less'} than your estimated value
                </Typography>
              </Box>
            </>
          )}

          {/* For SBYB: Show current property (sell) first */}
          {strategy === 'SBYB' && (
            <>
              <Box>
                {/* Sell timing chip */}
                {timing.sellDate && (
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <Box 
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#e0e0e0',
                        flexShrink: 0
                      }}
                    />
                    <Chip
                      label={`Sell in ${format(timing.sellDate, 'MMM yyyy')}`}
                      size="small"
                      sx={{
                        backgroundColor: '#e0e0e0',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        height: 28
                      }}
                    />
                  </Stack>
                )}
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ fontSize: '0.75rem', mb: 0.5 }}
                >
                  Your current property could be worth
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.5 }}
                >
                  {formatCurrency(projectedCurrentValue)}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.75rem',
                    color: currentValueChange >= 0 ? 'success.main' : 'error.main'
                  }}
                >
                  {currentValueChange >= 0 ? '+' : ''}{formatCurrency(Math.abs(currentValueChange))} 
                  {currentValueChange >= 0 ? ' more' : ' less'} than your estimated value
                </Typography>
              </Box>

              <Box>
                {/* Buy timing chip */}
                {timing.buyDate && (
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <Box 
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#e0e0e0',
                        flexShrink: 0
                      }}
                    />
                    <Chip
                      label={`Buy in ${format(timing.buyDate, 'MMM yyyy')}`}
                      size="small"
                      sx={{
                        backgroundColor: '#e0e0e0',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        height: 28
                      }}
                    />
                  </Stack>
                )}
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ fontSize: '0.75rem', mb: 0.5 }}
                >
                  Your new property could be worth
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.5 }}
                >
                  {formatCurrency(projectedNewValue)}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.75rem',
                    color: newValueChange >= 0 ? 'error.main' : 'success.main'
                  }}
                >
                  {newValueChange >= 0 ? '+' : ''}{formatCurrency(Math.abs(newValueChange))} 
                  {newValueChange >= 0 ? ' more' : ' less'} than your estimated value
                </Typography>
              </Box>
            </>
          )}

          {/* For KB: Only show new property */}
          {strategy === 'KB' && (
            <Box>
              {/* Buy timing chip */}
              {timing.buyDate && (
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Box 
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#e0e0e0',
                      flexShrink: 0
                    }}
                  />
                  <Chip
                    label={`Buy in ${format(timing.buyDate, 'MMM yyyy')}`}
                    size="small"
                    sx={{
                      backgroundColor: '#e0e0e0',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      height: 28
                    }}
                  />
                </Stack>
              )}
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: '0.75rem', mb: 0.5 }}
              >
                Your new property could be worth
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.5 }}
              >
                {formatCurrency(projectedNewValue)}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.75rem',
                  color: newValueChange >= 0 ? 'error.main' : 'success.main'
                }}
              >
                {newValueChange >= 0 ? '+' : ''}{formatCurrency(Math.abs(newValueChange))} 
                {newValueChange >= 0 ? ' more' : ' less'} than your estimated value
              </Typography>
            </Box>
          )}
        </Stack>



        {/* Guarantee Sale Price Link (BBYS only) */}
        {strategy === 'BBYS' && (
          <Link
            href="#"
            sx={{
              color: 'primary.main',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              '&:hover': {
                textDecoration: 'underline'
              },
              '&::after': {
                content: '"+"',
                ml: 1,
                fontSize: '1rem'
              }
            }}
          >
            Add Price Guarantee to my sale price
          </Link>
        )}
      </Stack>
    </Box>
  );
};