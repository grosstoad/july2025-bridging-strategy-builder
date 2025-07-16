import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography 
} from '@mui/material';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

const steps: ProcessStep[] = [
  {
    number: '1',
    title: 'Start with your\ncurrent home',
    description: "Get a sense of what it's worth and how it could support your next move."
  },
  {
    number: '2',
    title: 'Tell us about your next place',
    description: "Whether you've found a property or are still figuring it out, we'll use this to shape the strategies available to you."
  },
  {
    number: '3',
    title: 'Explore your options',
    description: 'Get a side-by-side view of different move strategies — and see where your broker can help guide the next step.'
  }
];

export const ProcessSteps: React.FC = () => {
  return (
    <Box 
      sx={{ 
        backgroundColor: 'rgba(245, 245, 245, 0.5)',
        py: 12,
        px: { xs: 2, md: 10 }
      }}
    >
      <Container 
        maxWidth={false}
        sx={{ 
          maxWidth: 1469,
          px: 0
        }}
      >
        <Grid 
          container 
          spacing={{ xs: 4, md: 8 }}
          justifyContent="space-between"
        >
          {steps.map((step, index) => (
            <Grid 
              item 
              xs={12} 
              md={4} 
              key={step.number}
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  maxWidth: 424,
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                {/* Step Number Badge */}
                <Box
                  sx={{
                    width: 78,
                    height: 78,
                    borderRadius: '50%',
                    backgroundColor: '#e8e8e8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '48px',
                      fontWeight: 700,
                      lineHeight: '56px',
                      letterSpacing: '-1.5px',
                      color: '#000000',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {step.number}
                  </Typography>
                </Box>

                {/* Step Content */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center',
                    width: '100%'
                  }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: '32px',
                      fontWeight: 700,
                      lineHeight: '40px',
                      letterSpacing: '-1px',
                      color: '#000000',
                      fontFamily: 'Inter, sans-serif',
                      whiteSpace: 'pre-line',
                      maxWidth: index === 0 ? '100%' : index === 1 ? 320 : 254
                    }}
                  >
                    {step.title}
                  </Typography>
                  
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 500,
                      lineHeight: '24px',
                      letterSpacing: '-0.25px',
                      color: 'rgba(0, 0, 0, 0.6)',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};