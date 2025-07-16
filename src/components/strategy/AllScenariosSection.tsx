import React, { useState } from 'react';
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
import { PropertyMarketChip } from './PropertyMarketChip';
import { MarketRisksSection } from './MarketRisksSection';
import { IndicativeCostsSectionContent } from './IndicativeCostsSectionContent';
import { ThingsToConsiderContent } from './ThingsToConsiderContent';
import { StrategyCalculationOutputs } from '../../logic/strategyCalculations';

type ScenarioType = 'worst' | 'target' | 'best';

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
  currentPropertyLocation,
  newPropertyLocation,
  growthScenarios
}) => {
  // Track selected scenario for each strategy independently
  const [selectedScenarios, setSelectedScenarios] = useState<Record<string, ScenarioType>>({
    BBYS: 'target',
    SBYB: 'target',
    KB: 'target',
    SS: 'target'
  });

  const handleScenarioChange = (strategy: string, scenario: ScenarioType) => {
    setSelectedScenarios(prev => ({
      ...prev,
      [strategy]: scenario
    }));
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Single Grid Container for Perfect Alignment */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gridTemplateRows: 'auto 1fr auto auto auto auto auto auto auto auto auto auto auto',
          gap: 2,
          position: 'relative'
        }}
      >
        {/* Background columns for visual separation */}
        {scenarios.map((scenario, index) => (
          <Box
            key={`bg-${scenario.id}`}
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: '1 / -1',
              backgroundColor: '#ffffff',
              borderRadius: 1.5,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              zIndex: 0
            }}
          />
        ))}

        {/* Row 1: Scenario Sections */}
        {scenarios.map((scenario, index) => (
          <Box
            key={`scenario-${scenario.id}`}
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: 1,
              p: 2,
              pb: 0,
              zIndex: 1,
              height: '100%',
              minHeight: 300
            }}
          >
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
          </Box>
        ))}

        {/* Row 2: Flexible spacers */}
        {scenarios.map((scenario, index) => (
          <Box
            key={`spacer-${scenario.id}`}
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: 2,
              zIndex: 1
            }}
          />
        ))}

        {/* Row 3: Property Market Outlook Dividers */}
        {scenarios.map((scenario, index) => (
          <Divider
            key={`divider1-${scenario.id}`}
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: 3,
              borderColor: '#e0e0e0',
              mx: 2,
              zIndex: 1
            }}
          />
        ))}

        {/* Row 4: Property Market Outlook Titles */}
        {scenarios.map((scenario, index) => (
          <Typography
            key={`pmo-title-${scenario.id}`}
            variant="body1"
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: 4,
              fontWeight: 600,
              fontSize: '1rem',
              color: 'text.primary',
              py: 1.5,
              px: 2,
              zIndex: 1
            }}
          >
            Property market outlook
          </Typography>
        ))}

        {/* Row 5: Property Market Outlook Content */}
        {scenarios.map((scenario, index) => (
          <Box
            key={`pmo-content-${scenario.id}`}
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: 5,
              px: 2,
              zIndex: 1
            }}
          >
            <PropertyMarketOutlookContent
              strategy={scenario.id}
              currentPropertyValue={currentPropertyValue}
              newPropertyValue={newPropertyValue}
              currentPropertyLocation={currentPropertyLocation || ''}
              newPropertyLocation={newPropertyLocation || ''}
              growthScenarios={growthScenarios}
              readyToGoDate={readyToGoDate}
              timeBetween={timeBetween}
              selectedScenario={selectedScenarios[scenario.id]}
              onScenarioChange={(newScenario) => handleScenarioChange(scenario.id, newScenario)}
            />
          </Box>
        ))}

        {/* Row 6: Chips Section */}
        {scenarios.map((scenario, index) => (
          <Box
            key={`chip-${scenario.id}`}
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: 6,
              px: 2,
              zIndex: 1,
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <PropertyMarketChip
              strategy={scenario.id}
              currentPropertyValue={currentPropertyValue}
              newPropertyValue={newPropertyValue}
              growthScenarios={growthScenarios}
              readyToGoDate={readyToGoDate}
              timeBetween={timeBetween}
              selectedScenario={selectedScenarios[scenario.id]}
            />
          </Box>
        ))}

        {/* Row 7: Market Risks Section */}
        {scenarios.map((scenario, index) => (
          <Box
            key={`risks-${scenario.id}`}
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: 7,
              px: 2,
              zIndex: 1
            }}
          >
            <MarketRisksSection
              strategy={scenario.id}
              currentPropertyLocation={currentPropertyLocation}
              newPropertyLocation={newPropertyLocation}
            />
          </Box>
        ))}

        {/* Row 8: Indicative Costs Dividers */}
        {scenarios.map((scenario, index) => (
          <Divider
            key={`divider2-${scenario.id}`}
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: 8,
              borderColor: '#e0e0e0',
              mx: 2,
              mt: 2,
              zIndex: 1
            }}
          />
        ))}

        {/* Row 9 & 10: Indicative Costs Accordion (Title and Content combined) */}
        {scenarios.map((scenario, index) => (
          <Box
            key={`ic-accordion-${scenario.id}`}
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: '9 / 11',
              px: 2,
              zIndex: 1
            }}
          >
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
                <IndicativeCostsSectionContent
                  strategy={scenario.id}
                />
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}

        {/* Row 11: Things to Consider Dividers */}
        {scenarios.map((scenario, index) => (
          <Divider
            key={`divider3-${scenario.id}`}
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: 11,
              borderColor: '#e0e0e0',
              mx: 2,
              mt: 2,
              zIndex: 1
            }}
          />
        ))}

        {/* Row 12: Things to Consider Titles */}
        {scenarios.map((scenario, index) => (
          <Typography
            key={`ttc-title-${scenario.id}`}
            variant="body1"
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: 12,
              fontWeight: 600,
              fontSize: '1rem',
              color: 'text.primary',
              py: 1.5,
              px: 2,
              zIndex: 1
            }}
          >
            Things to consider
          </Typography>
        ))}

        {/* Row 13: Things to Consider Content */}
        {scenarios.map((scenario, index) => (
          <Box
            key={`ttc-content-${scenario.id}`}
            sx={{
              gridColumn: {
                xs: 1,
                sm: index < 2 ? index + 1 : index - 1,
                md: index + 1
              },
              gridRow: 13,
              px: 2,
              pb: 2,
              zIndex: 1
            }}
          >
            <ThingsToConsiderContent
              strategy={scenario.id}
            />
          </Box>
        ))}
      </Box>
      
      {/* Action Cards Below Grid */}
      <Box sx={{ mt: 4, mb: 6 }}>
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
                    height: '100%',
                    '&:hover': {
                      backgroundColor: '#303030'
                    }
                  }}
                >
                  <CardContent sx={{ 
                    p: 2, 
                    height: '100%',
                    '&:last-child': { pb: 2 } 
                  }}>
                    <Stack 
                      direction="row" 
                      justifyContent="space-between" 
                      alignItems="center"
                      sx={{ height: '100%' }}
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
                          ml: 1,
                          flexShrink: 0
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