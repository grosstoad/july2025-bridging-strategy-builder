# Backup of AllScenariosSection.tsx before grid refactor

This is a backup of the current implementation before refactoring to use a single shared grid container.

```tsx
import React from 'react';
import { 
  Box, 
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { ScenarioSection } from './ScenarioSection';
import { PropertyMarketOutlookContent } from './PropertyMarketOutlookContent';
import { IndicativeCostsSectionContent } from './IndicativeCostsSectionContent';
import { ThingsToConsiderContent } from './ThingsToConsiderContent';
import { StrategyCalculationOutputs } from '../../logic/strategyCalculations';

interface AllScenariosSectionProps {
  currentPropertyValue: number;
  newPropertyValue: number;
  existingDebt: number;
  savings: number;
  readyToGoDate: Date;
  timeBetween: number;
  calculations: {
    BBYS: StrategyCalculationOutputs;
    SBYB: StrategyCalculationOutputs;
    KB: StrategyCalculationOutputs;
    SS: StrategyCalculationOutputs;
  };
  currentPropertyLocation?: string;
  newPropertyLocation?: string;
  growthScenarios: {
    current: { low: number; target: number; high: number };
    new: { low: number; target: number; high: number };
  };
}

const scenarios = [
  {
    id: 'BBYS' as const,
    title: 'Buy first, then sell'
  },
  {
    id: 'SBYB' as const,
    title: 'Sell first, then buy'
  },
  {
    id: 'KB' as const,
    title: 'Keep both'
  },
  {
    id: 'SS' as const,
    title: 'Settle same day'
  }
];

export const AllScenariosSection: React.FC<AllScenariosSectionProps> = ({
  currentPropertyValue,
  newPropertyValue,
  existingDebt,
  savings,
  readyToGoDate,
  timeBetween,
  calculations,
  currentPropertyLocation = 'Current location',
  newPropertyLocation = 'New location',
  growthScenarios
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        {scenarios.map((scenario) => (
          <Grid item xs={12} sm={6} md={3} key={scenario.id}>
            <Paper 
              sx={{ 
                p: 2,
                height: '100%',
                borderRadius: 1.5,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                backgroundColor: '#ffffff',
                // CSS Grid for consistent section alignment
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto auto auto auto auto auto auto auto auto',
                gap: 0 // No gap - consistent spacing controlled by grid
              }}
            >
              {/* Row 1: Scenario Section - auto height */}
              <ScenarioSection
                strategy={scenario.id}
                title={scenario.title}
                currentPropertyValue={currentPropertyValue}
                newPropertyValue={newPropertyValue}
                existingDebt={existingDebt}
                savings={savings}
                readyToGoDate={readyToGoDate}
                timeBetween={timeBetween}
                bridgingLoanAmount={calculations[scenario.id].bridgingLoanAmount}
                monthlyRepayment={calculations[scenario.id].monthlyRepayment}
                endDebt={calculations[scenario.id].endDebt}
              />
              
              {/* Row 2: Flexible spacer - takes remaining space */}
              <Box />
              
              {/* Row 3: Property Market Outlook Divider */}
              <Divider sx={{ borderColor: '#e0e0e0' }} />
              
              {/* Row 4: Property Market Outlook Title */}
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '1rem',
                  color: 'text.primary',
                  py: 1.5
                }}
              >
                Property market outlook
              </Typography>
              
              {/* Row 5: Property Market Outlook Content */}
              <PropertyMarketOutlookContent
                strategy={scenario.id}
                currentPropertyValue={currentPropertyValue}
                newPropertyValue={newPropertyValue}
                currentPropertyLocation={currentPropertyLocation}
                newPropertyLocation={newPropertyLocation}
                growthScenarios={growthScenarios}
                readyToGoDate={readyToGoDate}
                timeBetween={timeBetween}
              />
              
              {/* Row 6: Indicative Costs Divider */}
              <Divider sx={{ borderColor: '#e0e0e0', mt: 2 }} />
              
              {/* Row 7: Indicative Costs Accordion Header */}
              <Accordion 
                defaultExpanded
                disableGutters
                elevation={0}
                sx={{
                  '&:before': { display: 'none' },
                  backgroundColor: 'transparent'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    padding: 0,
                    minHeight: 'auto',
                    py: 1.5,
                    '& .MuiAccordionSummary-content': {
                      margin: 0,
                    },
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      fontSize: '1rem',
                      color: 'text.primary'
                    }}
                  >
                    Indicative costs
                  </Typography>
                </AccordionSummary>
                
                <AccordionDetails sx={{ padding: 0 }}>
                  {/* Row 8: Indicative Costs Content */}
                  <IndicativeCostsSectionContent
                    strategy={scenario.id}
                  />
                </AccordionDetails>
              </Accordion>
              
              {/* Row 9: Things to Consider Divider */}
              <Divider sx={{ borderColor: '#e0e0e0', mt: 2 }} />
              
              {/* Row 10: Things to Consider Title */}
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '1rem',
                  color: 'text.primary',
                  py: 1.5
                }}
              >
                Things to consider
              </Typography>
              
              {/* Row 11: Things to Consider Content */}
              <ThingsToConsiderContent
                strategy={scenario.id}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {/* Action Cards Below Grid */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {scenarios.map((scenario) => {
            const actionCards = {
              BBYS: 'Calculate your Bridging Finance solution now',
              SBYB: 'Get Pre-Approved when you are ready',
              KB: 'Confirm if you can service both debts',
              SS: 'Get Pre-Approved with a Back Up Bridge'
            };
            
            return (
              <Grid 
                item 
                key={`action-${scenario.id}`}
                sx={{
                  width: {
                    xs: '100%',
                    sm: '50%',
                    md: '25%'
                  }
                }}
              >
                <Card 
                  sx={{ 
                    backgroundColor: '#424242',
                    color: 'white',
                    borderRadius: 2,
                    cursor: 'pointer',
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
                        {actionCards[scenario.id]}
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
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};
```