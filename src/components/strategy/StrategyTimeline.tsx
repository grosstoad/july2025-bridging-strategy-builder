import React from 'react';
import { 
  Box, 
  Typography, 
  Stack
} from '@mui/material';
import { addMonths } from 'date-fns';
import { HorizontalTimeline } from './HorizontalTimeline';

interface StrategyTimelineProps {
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
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const StrategyTimeline: React.FC<StrategyTimelineProps> = ({
  strategy,
  currentPropertyValue,
  newPropertyValue,
  existingDebt,
  savings,
  readyToGoDate,
  timeBetween,
  bridgingLoanAmount = 0,
  monthlyRepayment = 0,
  endDebt = 0
}) => {
  const getTimelineData = () => {
    const buyDate = readyToGoDate;
    const sellDate = addMonths(readyToGoDate, timeBetween);
    const startDate = readyToGoDate;
    const endDate = addMonths(readyToGoDate, Math.max(timeBetween + 3, 6));

    switch (strategy) {
      case 'BBYS': {
        const events = [
          {
            date: buyDate,
            label: 'Buy',
            description: 'Buy your new property',
            amount: formatCurrency(newPropertyValue),
            type: 'buy' as const
          },
          {
            date: buyDate,
            label: 'Loan',
            description: 'Get a bridging loan',
            amount: formatCurrency(bridgingLoanAmount),
            type: 'loan' as const
          },
          {
            date: sellDate,
            label: 'Sell',
            description: 'Sell your current property',
            amount: formatCurrency(currentPropertyValue),
            type: 'sell' as const
          }
        ];

        const summary = {
          endDebt: formatCurrency(endDebt),
          monthlyRepayment: `${formatCurrency(monthlyRepayment)}/month`
        };

        return { events, summary, startDate, endDate };
      }

      case 'SBYB': {
        const events = [
          {
            date: buyDate,
            label: 'Sell',
            description: 'Sell your current property',
            amount: formatCurrency(currentPropertyValue),
            type: 'sell' as const
          },
          {
            date: sellDate,
            label: 'Buy',
            description: 'Buy your new property',
            amount: formatCurrency(newPropertyValue),
            type: 'buy' as const
          }
        ];

        const summary = endDebt > 0 ? {
          endDebt: formatCurrency(endDebt),
          monthlyRepayment: `${formatCurrency(monthlyRepayment)}/month`
        } : {
          noLoan: 'No loan required'
        };

        return { events, summary, startDate, endDate };
      }

      case 'KB': {
        const events = [
          {
            date: buyDate,
            label: 'Buy',
            description: 'Buy your new property',
            amount: formatCurrency(newPropertyValue),
            type: 'buy' as const
          }
        ];

        const summary = {
          keepBoth: 'Keep your current property',
          endDebt: formatCurrency(endDebt),
          monthlyRepayment: `${formatCurrency(monthlyRepayment)}/month`
        };

        return { events, summary, startDate, endDate };
      }

      case 'SS': {
        const events = [
          {
            date: buyDate,
            label: 'Settle',
            description: 'Sell current & buy new',
            amount: `${formatCurrency(currentPropertyValue)} / ${formatCurrency(newPropertyValue)}`,
            type: 'settle' as const
          }
        ];

        const summary = endDebt > 0 ? {
          endDebt: formatCurrency(endDebt),
          monthlyRepayment: `${formatCurrency(monthlyRepayment)}/month`
        } : {
          noLoan: 'No loan required'
        };

        return { events, summary, startDate, endDate };
      }

      default:
        return { events: [], summary: {}, startDate, endDate };
    }
  };

  const { events, summary, startDate, endDate } = getTimelineData();

  return (
    <Box>
      <HorizontalTimeline
        events={events}
        startDate={startDate}
        endDate={endDate}
      />
      
      {/* Summary information */}
      <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
        {summary.keepBoth && (
          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            {summary.keepBoth}
          </Typography>
        )}
        {summary.endDebt && (
          <Box>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              End debt
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {summary.endDebt}
            </Typography>
          </Box>
        )}
        {summary.monthlyRepayment && (
          <Box>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              Estimated repayments
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {summary.monthlyRepayment}
            </Typography>
          </Box>
        )}
        {summary.noLoan && (
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.875rem', 
              fontWeight: 600,
              color: 'success.main' 
            }}
          >
            {summary.noLoan}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};