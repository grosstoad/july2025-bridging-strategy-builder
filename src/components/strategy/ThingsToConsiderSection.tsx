import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Stack,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

interface ThingsToConsiderSectionProps {
  strategy: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  hideActionCard?: boolean;
}

interface ConsiderationItem {
  text: string;
  type: 'positive' | 'neutral' | 'warning';
}

// Strategy-specific considerations
const CONSIDERATIONS: Record<string, ConsiderationItem[]> = {
  BBYS: [
    { text: 'Can get into your home faster', type: 'positive' },
    { text: 'Move once not multiple times', type: 'positive' },
    { text: 'Sell your current property vacant', type: 'positive' },
    { text: 'Chance to do renovations', type: 'positive' },
    { text: 'Risk of sale price > option to guarantee', type: 'neutral' }
  ],
  SBYB: [
    { text: 'Can avoid bridging costs', type: 'positive' },
    { text: 'Certainty of sales price', type: 'positive' },
    { text: 'Move twice, need to find temporary accommodation', type: 'warning' },
    { text: 'May need to store your belongings', type: 'warning' },
    { text: 'Largest risk of market changing', type: 'warning' }
  ],
  KB: [
    { text: 'Need to confirm servicing', type: 'neutral' },
    { text: 'Can avoid selling costs', type: 'positive' },
    { text: 'More funds to go into new home', type: 'positive' },
    { text: 'Get an investment property', type: 'positive' },
    { text: 'Could add stress to the process of finding the dream home', type: 'warning' }
  ],
  SS: [
    { text: 'Can avoid bridging costs', type: 'positive' },
    { text: 'Move once not multiple times', type: 'positive' },
    { text: 'Reduced bargaining power for buying and selling', type: 'warning' },
    { text: 'May not be possible', type: 'warning' },
    { text: 'May fall over last minute. Consider bridge as a backup option.', type: 'warning' }
  ]
};

// Action cards for each strategy
const ACTION_CARDS: Record<string, { title: string; }> = {
  BBYS: { title: 'Calculate your Bridging Finance solution now' },
  SBYB: { title: 'Get Pre-Approved when you are ready' },
  KB: { title: 'Confirm if you can service both debts' },
  SS: { title: 'Get Pre-Approved with a Back Up Bridge' }
};

const getIcon = (type: ConsiderationItem['type']): string => {
  switch (type) {
    case 'positive':
      return '✅';
    case 'neutral':
      return '➖';
    case 'warning':
      return '🟠';
    default:
      return '';
  }
};

const getTextColor = (type: ConsiderationItem['type']): string => {
  switch (type) {
    case 'positive':
      return '#1b5e20';
    case 'neutral':
      return '#616161';
    case 'warning':
      return '#e65100';
    default:
      return '#000000';
  }
};

export const ThingsToConsiderSection: React.FC<ThingsToConsiderSectionProps> = ({
  strategy,
  hideActionCard = false
}) => {
  const considerations = CONSIDERATIONS[strategy];
  const actionCard = ACTION_CARDS[strategy];

  return (
    <Box>
      {/* Separator line */}
      <Divider sx={{ my: 1.5, borderColor: '#e0e0e0' }} />
      
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 2, 
          fontWeight: 600, 
          fontSize: '1rem',
          color: 'text.primary'
        }}
      >
        Things to consider
      </Typography>

      <Stack spacing={2}>
        {/* Consideration Items */}
        <Stack spacing={1}>
          {considerations.map((item, index) => (
            <Stack 
              key={index} 
              direction="row" 
              spacing={1.5} 
              alignItems="flex-start"
            >
              <Typography 
                component="span" 
                sx={{ 
                  fontSize: '1rem',
                  flexShrink: 0,
                  mt: 0.125
                }}
              >
                {getIcon(item.type)}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  color: getTextColor(item.type)
                }}
              >
                {item.text}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* Action Card */}
        {!hideActionCard && (
          <Card 
            sx={{ 
              mt: 3,
              backgroundColor: '#424242',
              color: 'white',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#303030'
              }
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center"
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'white',
                    flex: 1
                  }}
                >
                  {actionCard.title}
                </Typography>
                <ArrowForwardIcon 
                  sx={{ 
                    fontSize: 20, 
                    color: 'white',
                    ml: 1
                  }} 
                />
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
};