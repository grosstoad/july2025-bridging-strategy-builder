import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  Paper, 
  useTheme, 
  useMediaQuery,
  Button,
  IconButton,
  Grid 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowBack as ArrowBackIcon, 
  Home as HomeIcon,
  Tune as TuneIcon 
} from '@mui/icons-material';
import { useProperty } from '../contexts/PropertyContext';
import { PropertyValueFilter } from '../components/strategy/PropertyValueFilter';
import { TimingControls } from '../components/strategy/TimingControls';
import { PropertyStrategyCard } from '../components/strategy/PropertyStrategyCard';
import { AllScenariosSection } from '../components/strategy/AllScenariosSection';
import { calculateScenario } from '../logic/strategyCalculations';

export const PropertyStrategyPlayback: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentProperty, targetProperty, setCurrentProperty, setTargetProperty } = useProperty();

  // Growth scenarios state
  const [currentPropertyGrowth, setCurrentPropertyGrowth] = useState({
    low: -5.00,
    target: 2.23, // Default market growth rate
    high: 5.00
  });

  const [newPropertyGrowth, setNewPropertyGrowth] = useState({
    low: -5.00,
    target: 2.23, // Default market growth rate
    high: 5.00
  });

  // Timing state
  const [timing, setTiming] = useState({
    readyToGo: new Date(),
    timeBetween: 6 // months
  });

  // Selected strategy state
  const [selectedStrategy, setSelectedStrategy] = useState<'BBYS' | 'SBYB' | 'KB' | 'SS'>('BBYS');

  // Financial calculations
  const [calculations, setCalculations] = useState({
    BBYS: { endDebt: 0, monthlyRepayment: 0, bridgingLoanAmount: 0, noLoanRequired: false },
    SBYB: { endDebt: 0, monthlyRepayment: 0, noLoanRequired: false },
    KB: { endDebt: 0, monthlyRepayment: 0, noLoanRequired: false },
    SS: { endDebt: 0, monthlyRepayment: 0, noLoanRequired: false }
  });

  // Redirect if no property data
  useEffect(() => {
    if (!currentProperty.propertyValue || !targetProperty.propertyValue) {
      navigate('/current-property');
    }
  }, [currentProperty, targetProperty, navigate]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTimingChange = (newTiming: { readyToGo: Date; timeBetween: number }) => {
    setTiming(newTiming);
  };

  // Perform calculations when values change
  useEffect(() => {
    if (currentProperty.propertyValue && targetProperty.propertyValue) {
      const inputs = {
        currentPropertyValue: currentProperty.propertyValue,
        newPropertyValue: targetProperty.propertyValue,
        existingDebt: currentProperty.loanBalance || 0,
        savings: 0, // TODO: Get from user preferences
        timeBetween: timing.timeBetween
      };

      // Calculate all scenarios
      const newCalculations = {
        BBYS: calculateScenario('BBYS', inputs),
        SBYB: calculateScenario('SBYB', inputs),
        KB: calculateScenario('KB', inputs),
        SS: calculateScenario('SS', inputs)
      };

      setCalculations(newCalculations);
    }
  }, [currentProperty.propertyValue, targetProperty.propertyValue, currentProperty.loanBalance, timing.timeBetween]);

  const strategies = [
    {
      id: 'BBYS' as const,
      title: 'Buy first, then sell',
      description: 'Purchase your new property before selling your current one'
    },
    {
      id: 'SBYB' as const,
      title: 'Sell first, then buy',
      description: 'Sell your current property before purchasing a new one'
    },
    {
      id: 'KB' as const,
      title: 'Keep both',
      description: 'Retain both properties as investments'
    },
    {
      id: 'SS' as const,
      title: 'Settle same day',
      description: 'Coordinate settlement of both properties on the same day'
    }
  ];

  return (
    <Box sx={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Compact Header */}
      <Container maxWidth={false} sx={{ pt: 1, pb: 0.5 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/target-property')}
            sx={{ color: 'text.secondary', pl: 0 }}
            size="small"
          >
            Back
          </Button>
        </Stack>

        <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
          Choose your next move
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.813rem' }}>
          Compare how these strategies could help you make your next move.
        </Typography>
      </Container>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        {/* Filter Controls Section - Single Row */}
        <Box 
          sx={{ 
            mb: 3,
            backgroundColor: 'white',
            borderRadius: '24px',
            border: '1px solid #e0e0e0',
            p: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            alignItems: 'flex-start',
            gap: { xs: 2, sm: 3, md: 4 },
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            flexWrap: { xs: 'wrap', lg: 'nowrap' }
          }}
        >
          {/* Current Property Filter */}
          <PropertyValueFilter
            label="Current property"
            value={currentProperty.propertyValue || 0}
            growthScenarios={currentPropertyGrowth}
            onGrowthChange={setCurrentPropertyGrowth}
            onValueChange={(value) => setCurrentProperty({ propertyValue: value })}
            icon={<HomeIcon sx={{ fontSize: 20 }} />}
            location={currentProperty.address ? 
              `${currentProperty.address.suburb || ''} ${currentProperty.address.state || ''}`.trim() : 
              'Property location'
            }
          />

          {/* New Property Filter */}
          <PropertyValueFilter
            label="New property"
            value={targetProperty.propertyValue || 0}
            growthScenarios={newPropertyGrowth}
            onGrowthChange={setNewPropertyGrowth}
            onValueChange={(value) => setTargetProperty({ propertyValue: value })}
            icon={<HomeIcon sx={{ fontSize: 20 }} />}
            location={targetProperty.address ? 
              `${targetProperty.address.suburb || ''} ${targetProperty.address.state || ''}`.trim() : 
              'Property location'
            }
          />

          {/* Timing Controls */}
          <TimingControls
            readyToGo={timing.readyToGo}
            timeBetween={timing.timeBetween}
            onTimingChange={handleTimingChange}
          />

          {/* Settings Icon */}
          <IconButton 
            size="small" 
            sx={{ 
              alignSelf: 'center',
              color: 'text.secondary',
              padding: 0.5
            }}
          >
            <TuneIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Property Strategy Cards */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Your property strategies
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {strategies.map((strategy) => (
            <Grid 
              item 
              key={strategy.id}
              sx={{
                width: {
                  xs: '100%',      // 1 column on extra small
                  sm: '50%',       // 2 columns on small
                  md: '25%'        // 4 columns on medium and up
                }
              }}
            >
              <PropertyStrategyCard
                strategy={strategy.id}
                title={strategy.title}
                description={strategy.description}
                isSelected={selectedStrategy === strategy.id}
                onClick={() => setSelectedStrategy(strategy.id)}
              />
            </Grid>
          ))}
        </Grid>

        {/* All Scenarios Section */}
        <AllScenariosSection
          currentPropertyValue={currentProperty.propertyValue || 0}
          newPropertyValue={targetProperty.propertyValue || 0}
          existingDebt={currentProperty.loanBalance || 0}
          savings={0} // TODO: Get from user preferences
          readyToGoDate={timing.readyToGo}
          timeBetween={timing.timeBetween}
          calculations={calculations}
          currentPropertyLocation={currentProperty.address ? 
            `${currentProperty.address.suburb || ''}, ${currentProperty.address.state || ''}`.trim() : 
            'Current location'
          }
          newPropertyLocation={targetProperty.address ? 
            `${targetProperty.address.suburb || ''}, ${targetProperty.address.state || ''}`.trim() : 
            'New location'
          }
          growthScenarios={{
            current: currentPropertyGrowth,
            new: newPropertyGrowth
          }}
        />
      </Container>
    </Box>
  );
};