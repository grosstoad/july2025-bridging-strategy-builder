import React from 'react';
import { 
  Box, 
  Typography, 
  Stack,
  Chip
} from '@mui/material';
import { format, addMonths } from 'date-fns';

interface ScenarioStep {
  date: Date;
  title: string;
  amount?: string;
}

interface FinancialSummary {
  label: string;
  value: string;
}

interface SimpleScenarioStepsProps {
  strategy: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  currentPropertyValue: number;
  newPropertyValue: number;
  readyToGoDate: Date;
  timeBetween: number;
  bridgingLoanAmount: number;
  monthlyRepayment: number;
  endDebt: number;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const SimpleScenarioSteps: React.FC<SimpleScenarioStepsProps> = ({
  strategy,
  currentPropertyValue,
  newPropertyValue,
  readyToGoDate,
  timeBetween,
  bridgingLoanAmount,
  monthlyRepayment,
  endDebt
}) => {
  const buyDate = readyToGoDate;
  const sellDate = addMonths(readyToGoDate, timeBetween);

  const getStepsAndSummary = () => {
    switch (strategy) {
      case 'BBYS': {
        const steps: ScenarioStep[] = [
          {
            date: buyDate,
            title: 'Buy your new property',
            amount: formatCurrency(newPropertyValue)
          },
          {
            date: buyDate,
            title: 'Get a bridging loan',
            amount: formatCurrency(bridgingLoanAmount)
          },
          {
            date: sellDate,
            title: 'Sell your current property',
            amount: formatCurrency(currentPropertyValue)
          }
        ];
        
        const summary: FinancialSummary[] = [
          { label: 'End debt', value: formatCurrency(endDebt) },
          { label: 'Estimated repayments', value: `${formatCurrency(monthlyRepayment)}/month` }
        ];
        
        return { steps, summary };
      }

      case 'SBYB': {
        const steps: ScenarioStep[] = [
          {
            date: buyDate,
            title: 'Sell your current property',
            amount: formatCurrency(currentPropertyValue)
          },
          {
            date: sellDate,
            title: 'Buy your new property',
            amount: formatCurrency(newPropertyValue)
          }
        ];
        
        const summary: FinancialSummary[] = endDebt > 0 ? [
          { label: 'End debt', value: formatCurrency(endDebt) },
          { label: 'Estimated repayments', value: `${formatCurrency(monthlyRepayment)}/month` }
        ] : [
          { label: 'End debt', value: '$0' },
          { label: 'Estimated repayments', value: 'No loan required' }
        ];
        
        return { steps, summary };
      }

      case 'KB': {
        const steps: ScenarioStep[] = [
          {
            date: buyDate,
            title: 'Buy your new property',
            amount: formatCurrency(newPropertyValue)
          }
        ];
        
        const additionalInfo = 'Keep your current property';
        
        const summary: FinancialSummary[] = [
          { label: 'End debt', value: formatCurrency(endDebt) },
          { label: 'Estimated repayments', value: `${formatCurrency(monthlyRepayment)}/month` }
        ];
        
        return { steps, summary, additionalInfo };
      }

      case 'SS': {
        const steps: ScenarioStep[] = [
          {
            date: buyDate,
            title: 'Sell current & buy new',
            amount: `${formatCurrency(currentPropertyValue)} / ${formatCurrency(newPropertyValue)}`
          }
        ];
        
        const summary: FinancialSummary[] = endDebt > 0 ? [
          { label: 'End debt', value: formatCurrency(endDebt) },
          { label: 'Estimated repayments', value: `${formatCurrency(monthlyRepayment)}/month` }
        ] : [
          { label: 'End debt', value: '$0' },
          { label: 'Estimated repayments', value: 'No loan required' }
        ];
        
        return { steps, summary };
      }

      default:
        return { steps: [], summary: [] };
    }
  };

  const { steps, summary, additionalInfo } = getStepsAndSummary();

  return (
    <Stack spacing={2.5} sx={{ height: '100%' }}>
      {/* Steps */}
      <Stack spacing={2}>
        {steps.map((step, index) => (
          <Box key={index}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Chip
                label={format(step.date, 'MMM yyyy')}
                size="small"
                sx={{
                  height: 24,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  '& .MuiChip-label': {
                    px: 1.5
                  }
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'text.primary'
                  }}
                >
                  {step.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.875rem',
                    color: 'text.secondary'
                  }}
                >
                  {step.amount}
                </Typography>
              </Box>
            </Stack>
          </Box>
        ))}
        
        {additionalInfo && (
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.875rem',
              color: 'text.secondary',
              ml: 5
            }}
          >
            {additionalInfo}
          </Typography>
        )}
      </Stack>

      {/* Spacer to push financial summary to bottom */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Financial Summary */}
      <Stack direction="row" spacing={4}>
        {summary.map((item, index) => (
          <Box key={index}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.75rem',
                color: 'text.secondary',
                display: 'block',
                mb: 0.25
              }}
            >
              {item.label}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.875rem',
                fontWeight: 600,
                color: item.value === 'No loan required' ? 'success.main' : 'text.primary'
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};