import React from 'react';
import { 
  Box, 
  Typography, 
  Stack,
  Paper
} from '@mui/material';
import { format } from 'date-fns';
import { SimpleScenarioSteps } from './SimpleScenarioSteps';

export interface ScenarioSectionProps {
  strategy: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  currentPropertyValue: number;
  newPropertyValue: number;
  existingDebt: number;
  savings: number;
  readyToGoDate: Date;
  timeBetween: number;
  bridgingLoanAmount?: number;
  monthlyRepayment?: number;
  endDebt?: number;
  title: string;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getScenarioText = (
  strategy: string,
  currentPropertyValue: number,
  newPropertyValue: number,
  readyToGoDate: Date,
  timeBetween: number
): string => {
  const readyMonth = format(readyToGoDate, 'MMM yyyy');
  
  switch (strategy) {
    case 'BBYS':
      return `You would be buying your new property for ${formatCurrency(newPropertyValue)}, ${timeBetween} months before you sell your current property for ${formatCurrency(currentPropertyValue)}. You'll need a bridging loan to support this.`;
    
    case 'SBYB':
      return `You would be selling your current property for ${formatCurrency(currentPropertyValue)}, ${timeBetween} months before you buy your new property for ${formatCurrency(newPropertyValue)}.`;
    
    case 'KB':
      return `You would be buying your new property in ${readyMonth} for ${formatCurrency(newPropertyValue)} and keeping your current property.`;
    
    case 'SS':
      return `You would be selling your current property for ${formatCurrency(currentPropertyValue)}, and buying your new property for ${formatCurrency(newPropertyValue)} at the same time in ${readyMonth}.`;
    
    default:
      return '';
  }
};

export const ScenarioSection: React.FC<ScenarioSectionProps> = ({
  strategy,
  currentPropertyValue,
  newPropertyValue,
  existingDebt,
  savings,
  readyToGoDate,
  timeBetween,
  bridgingLoanAmount,
  monthlyRepayment,
  endDebt,
  title
}) => {
  const scenarioText = getScenarioText(
    strategy,
    currentPropertyValue,
    newPropertyValue,
    readyToGoDate,
    timeBetween
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 1,
          fontWeight: 600,
          fontSize: '1rem',
          color: 'text.primary'
        }}
      >
        Scenario
      </Typography>
      
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 2.5,
          color: 'text.secondary',
          fontSize: '0.813rem',
          lineHeight: 1.5
        }}
      >
        {scenarioText}
      </Typography>

      <SimpleScenarioSteps
        strategy={strategy}
        currentPropertyValue={currentPropertyValue}
        newPropertyValue={newPropertyValue}
        readyToGoDate={readyToGoDate}
        timeBetween={timeBetween}
        bridgingLoanAmount={bridgingLoanAmount || 0}
        monthlyRepayment={monthlyRepayment || 0}
        endDebt={endDebt || 0}
      />
    </Box>
  );
};