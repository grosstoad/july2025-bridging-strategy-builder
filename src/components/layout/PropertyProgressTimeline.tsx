import React from 'react';
import { Typography, Box, Stack } from '@mui/material';

interface ProgressStep {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface PropertyProgressTimelineProps {
  currentStep: number;
}

export const PropertyProgressTimeline: React.FC<PropertyProgressTimelineProps> = ({ 
  currentStep 
}) => {
  const steps: ProgressStep[] = [
    { label: 'Your current property', isActive: currentStep === 1, isCompleted: currentStep > 1 },
    { label: 'Your target property', isActive: currentStep === 2, isCompleted: currentStep > 2 },
    { label: 'Your timing', isActive: currentStep === 3, isCompleted: currentStep > 3 },
    { label: 'Your next move', isActive: currentStep === 4, isCompleted: currentStep > 4 },
    { label: 'Next actions', isActive: currentStep === 5, isCompleted: false }
  ];

  return (
    <Box sx={{ width: 200 }}>
      <Stack spacing={0}>
        {steps.map((step, index) => (
          <Box key={index} sx={{ display: 'flex', minHeight: 60 }}>
            {/* Timeline dot and connector */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 12, mr: 2 }}>
              <Box 
                sx={{ 
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: step.isActive ? '#7b1fa2' : '#bdbdbd',
                  mt: 1.5
                }} 
              />
              {index < steps.length - 1 && (
                <Box 
                  sx={{ 
                    width: 2,
                    height: 35,
                    backgroundColor: '#bdbdbd',
                    mt: 0.5
                  }} 
                />
              )}
            </Box>
            
            {/* Step label */}
            <Box sx={{ flex: 1, pt: 1 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: step.isActive ? '#7b1fa2' : 'rgba(0,0,0,0.87)',
                  fontWeight: step.isActive ? 500 : 400,
                  fontSize: 16,
                  lineHeight: 1.5
                }}
              >
                {step.label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};