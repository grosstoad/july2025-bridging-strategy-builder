import React from 'react';
import { 
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Typography
} from '@mui/material';

type ScenarioType = 'worst' | 'target' | 'best';

interface ScenarioToggleProps {
  selectedScenario: ScenarioType;
  onScenarioChange: (scenario: ScenarioType) => void;
  growthScenarios: {
    current: { low: number; target: number; high: number };
    new: { low: number; target: number; high: number };
  };
}

const scenarioConfig = {
  worst: { icon: '🌧️', label: 'Worst' },
  target: { icon: '📈', label: 'Trend' },
  best: { icon: '☀️', label: 'Best' }
};

const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export const ScenarioToggle: React.FC<ScenarioToggleProps> = ({
  selectedScenario,
  onScenarioChange,
  growthScenarios
}) => {
  // Get growth description based on scenario
  const getGrowthDescription = () => {
    switch (selectedScenario) {
      case 'worst':
        return `Based on low growth in selling markets (${formatPercentage(growthScenarios.current.low)} p.a) and high growth in buying markets (${formatPercentage(growthScenarios.new.high)} p.a).`;
      case 'target':
        return `Based on trend growth in selling markets (${formatPercentage(growthScenarios.current.target)} p.a) and trend growth in buying markets (${formatPercentage(growthScenarios.new.target)} p.a).`;
      case 'best':
        return `Based on high growth in selling markets (${formatPercentage(growthScenarios.current.high)} p.a) and low growth in buying markets (${formatPercentage(growthScenarios.new.low)} p.a).`;
      default:
        return '';
    }
  };

  return (
    <Stack spacing={2} alignItems="center">
      <ToggleButtonGroup
        value={selectedScenario}
        exclusive
        onChange={(_, value) => value && onScenarioChange(value as ScenarioType)}
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

      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          fontSize: '0.75rem',
          lineHeight: 1.5,
          textAlign: 'center',
          maxWidth: '800px'
        }}
      >
        {getGrowthDescription()}
      </Typography>
    </Stack>
  );
};