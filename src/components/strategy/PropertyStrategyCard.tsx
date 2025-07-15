import React from 'react';
import { 
  Card, 
  CardActionArea, 
  CardContent, 
  Typography, 
  Box,
  Stack,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface PropertyStrategyCardProps {
  strategy: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  title: string;
  description: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const getStrategyRoute = (strategy: string): string => {
  const routes: Record<string, string> = {
    'BBYS': '/next-actions/buy-first-then-sell',
    'SBYB': '/next-actions/sell-first-then-buy',
    'KB': '/next-actions/keep-both',
    'SS': '/next-actions/settle-same-day'
  };
  return routes[strategy] || '/';
};

export const PropertyStrategyCard: React.FC<PropertyStrategyCardProps> = ({
  strategy,
  title,
  description,
  isSelected = false,
  onClick
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // Navigation will be enabled in a future phase
    // navigate(getStrategyRoute(strategy));
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: isSelected ? '2px solid' : '1px solid',
        borderColor: isSelected ? 'primary.main' : '#e0e0e0',
        borderRadius: 2,
        boxShadow: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }
      }}
    >
      <CardActionArea 
        onClick={handleClick}
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch',
          justifyContent: 'flex-start'
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Stack spacing={1.5}>
            <Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1rem',
                  lineHeight: 1.3,
                  mb: 0.75
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.813rem',
                  lineHeight: 1.4
                }}
              >
                {description}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};