import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Alert,
  Slider,
  Button,
  Stack,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Avatar
} from '@mui/material';
import {
  Home as HomeIcon,
  CalendarMonth as CalendarIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { PropertyProgressTimeline } from '../components/layout/PropertyProgressTimeline';
import { useForm, Controller } from 'react-hook-form';

interface AboutYouFormData {
  preferredTimeToSell: string;
  sellSettlementDate?: string;
  preferredTimeToBuy: string;
  buySettlementDate?: string;
  certaintyCost: number;
  hasDeadlines: string;
}

const timeOptions = [
  { value: 'already_sold', label: 'Already sold' },
  { value: 'next_1_month', label: 'Next 1 month' },
  { value: 'next_3_months', label: 'Next 3 months' },
  { value: 'next_6_months', label: 'Next 6 months' },
  { value: 'next_9_months', label: 'Next 9 months' },
  { value: 'next_12_months', label: 'Next 12 months' },
  { value: 'not_sure', label: 'Not sure' }
];

const buyTimeOptions = [
  { value: 'already_bought', label: 'Already bought' },
  { value: 'next_1_month', label: 'Next 1 month' },
  { value: 'next_3_months', label: 'Next 3 months' },
  { value: 'next_6_months', label: 'Next 6 months' },
  { value: 'next_9_months', label: 'Next 9 months' },
  { value: 'next_12_months', label: 'Next 12 months' },
  { value: 'not_sure', label: 'Not sure' }
];

export const AboutYouPage = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, watch, formState: { errors } } = useForm<AboutYouFormData>({
    defaultValues: {
      preferredTimeToSell: '',
      preferredTimeToBuy: '',
      certaintyCost: 50,
      hasDeadlines: ''
    }
  });

  const watchTimeToSell = watch('preferredTimeToSell');
  const watchTimeToBuy = watch('preferredTimeToBuy');

  const onSubmit = (data: AboutYouFormData) => {
    sessionStorage.setItem('aboutYouData', JSON.stringify(data));
    navigate('/your-next-move');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getInfoMessage = () => {
    if (watchTimeToSell === 'already_sold' || watchTimeToBuy === 'already_bought') {
      return "It looks like your property has recently sold, confirm the settlement date or if this is incorrect feel free to update.";
    }
    return "Based on recent data, properties like yours in Suburbia NSW 2075 are on the market for about 45 days, plus settlement. A good benchmark to plan around.";
  };

  const certaintyCostMarks = [
    { value: 0, label: 'Very flexible' },
    { value: 50, label: 'Some flex' },
    { value: 100, label: 'High certainty' }
  ];

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ backgroundColor: '#eeeeee', padding: 2, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: '#666666', fontWeight: 'bold', letterSpacing: 1.5 }}>
          NAV PLACEHOLDER
        </Typography>
      </Box>

      {/* Skip to financing actions */}
      <Box sx={{ textAlign: 'right', px: 4, py: 2 }}>
        <Button
          variant="text"
          sx={{ color: '#9c27b0', textTransform: 'none' }}
          onClick={() => {}}
        >
          Skip to financing actions →
        </Button>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ paddingY: 8, flex: 1 }}>
        <Box sx={{ display: 'flex', gap: 6.5, justifyContent: 'center' }}>
          {/* Progress Timeline */}
          <PropertyProgressTimeline currentStep={3} />

          {/* Main Content Area */}
          <Box sx={{ width: 732 }}>
            <Stack spacing={4}>
              {/* Page Heading */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ArrowBackIcon 
                  sx={{ fontSize: 35, cursor: 'pointer', color: 'rgba(0,0,0,0.87)' }}
                  onClick={handleBack}
                />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: 32, 
                    lineHeight: '40px',
                    letterSpacing: '-1px',
                    color: 'rgba(0,0,0,0.87)'
                  }}
                >
                  Your timing
                </Typography>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  {/* Time to Sell Section */}
                  <Card sx={{ borderRadius: 3, backgroundColor: '#ffffff' }}>
                    <CardContent sx={{ padding: 4 }}>
                      <Stack spacing={3}>
                        {/* Title inside card */}
                        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: '1.1rem', mb: 2 }}>
                          Tell us about your ideal timings for making a move
                        </Typography>

                        {/* Preferred time to sell row */}
                        <Box>
                          {/* Labels row */}
                          <Grid container spacing={3} sx={{ mb: 1 }}>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ color: '#666', fontWeight: 400, fontSize: '0.875rem' }}>
                                When's your preferred time to sell?
                              </Typography>
                            </Grid>
                            {watchTimeToSell === 'already_sold' && (
                              <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 400 }}>
                                  Settlement date
                                </Typography>
                              </Grid>
                            )}
                          </Grid>

                          {/* Input fields row */}
                          <Grid container spacing={3} alignItems="center">
                            <Grid item xs={6}>
                              <Controller
                                name="preferredTimeToSell"
                                control={control}
                                rules={{ required: 'Please select your preferred time to sell' }}
                                render={({ field }) => (
                                  <FormControl fullWidth>
                                    <Select
                                      {...field}
                                      displayEmpty
                                      variant="outlined"
                                      error={!!errors.preferredTimeToSell}
                                      startAdornment={
                                        <InputAdornment position="start">
                                          <HomeIcon sx={{ color: '#666', fontSize: 20 }} />
                                        </InputAdornment>
                                      }
                                      sx={{
                                        backgroundColor: '#ffffff',
                                        '& .MuiOutlinedInput-root': {
                                          height: '48px',
                                          '& fieldset': {
                                            borderColor: 'rgba(0, 0, 0, 0.23)'
                                          }
                                        },
                                        '& .MuiSelect-select': {
                                          py: 1.5
                                        }
                                      }}
                                    >
                                      <MenuItem value="" disabled>
                                        <span style={{ color: '#999' }}>Select</span>
                                      </MenuItem>
                                      {timeOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                )}
                              />
                            </Grid>

                            {/* Settlement date - always render grid item but conditionally show content */}
                            <Grid item xs={6}>
                              {watchTimeToSell === 'already_sold' && (
                                <Controller
                                  name="sellSettlementDate"
                                  control={control}
                                  rules={{ required: watchTimeToSell === 'already_sold' ? 'Please enter settlement date' : false }}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      placeholder="DD/MM/YYYY"
                                      fullWidth
                                      variant="outlined"
                                      error={!!errors.sellSettlementDate}
                                      helperText={errors.sellSettlementDate?.message}
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <CalendarIcon sx={{ color: '#666', fontSize: 20 }} />
                                          </InputAdornment>
                                        )
                                      }}
                                      sx={{
                                        backgroundColor: '#ffffff',
                                        '& .MuiOutlinedInput-root': {
                                          backgroundColor: '#ffffff',
                                          '& fieldset': {
                                            borderColor: 'rgba(0, 0, 0, 0.23)'
                                          }
                                        }
                                      }}
                                    />
                                  )}
                                />
                              )}
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Info Alert */}
                        {(watchTimeToSell || watchTimeToBuy) && (
                          <Alert
                            icon={<InfoIcon />}
                            severity="info"
                            sx={{
                              backgroundColor: '#e5f6fd',
                              color: '#014361',
                              '& .MuiAlert-icon': {
                                color: '#014361'
                              }
                            }}
                          >
                            {getInfoMessage()}
                          </Alert>
                        )}

                        {/* Preferred time to buy row */}
                        <Box>
                          {/* Labels row */}
                          <Grid container spacing={3} sx={{ mb: 1 }}>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ color: '#666', fontWeight: 400, fontSize: '0.875rem' }}>
                                Preferred time to buy
                              </Typography>
                            </Grid>
                            {watchTimeToBuy === 'already_bought' && (
                              <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 400 }}>
                                  Settlement date
                                </Typography>
                              </Grid>
                            )}
                          </Grid>

                          {/* Input fields row */}
                          <Grid container spacing={3} alignItems="center">
                            <Grid item xs={6}>
                              <Controller
                                name="preferredTimeToBuy"
                                control={control}
                                rules={{ required: 'Please select your preferred time to buy' }}
                                render={({ field }) => (
                                  <FormControl fullWidth>
                                    <Select
                                      {...field}
                                      displayEmpty
                                      variant="outlined"
                                      error={!!errors.preferredTimeToBuy}
                                      startAdornment={
                                        <InputAdornment position="start">
                                          <HomeIcon sx={{ color: '#666', fontSize: 20 }} />
                                        </InputAdornment>
                                      }
                                      sx={{
                                        backgroundColor: '#ffffff',
                                        '& .MuiOutlinedInput-root': {
                                          height: '48px',
                                          '& fieldset': {
                                            borderColor: 'rgba(0, 0, 0, 0.23)'
                                          }
                                        },
                                        '& .MuiSelect-select': {
                                          py: 1.5
                                        }
                                      }}
                                    >
                                      <MenuItem value="" disabled>
                                        <span style={{ color: '#999' }}>Select</span>
                                      </MenuItem>
                                      {buyTimeOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                )}
                              />
                            </Grid>

                            {/* Settlement date - always render grid item but conditionally show content */}
                            <Grid item xs={6}>
                              {watchTimeToBuy === 'already_bought' && (
                                <Controller
                                  name="buySettlementDate"
                                  control={control}
                                  rules={{ required: watchTimeToBuy === 'already_bought' ? 'Please enter settlement date' : false }}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      placeholder="DD/MM/YYYY"
                                      fullWidth
                                      error={!!errors.buySettlementDate}
                                      helperText={errors.buySettlementDate?.message}
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <CalendarIcon sx={{ color: '#666', fontSize: 20 }} />
                                          </InputAdornment>
                                        )
                                      }}
                                      sx={{
                                        backgroundColor: '#ffffff',
                                        '& .MuiOutlinedInput-root': {
                                          backgroundColor: '#ffffff',
                                          '& fieldset': {
                                            borderColor: 'rgba(0, 0, 0, 0.23)'
                                          }
                                        }
                                      }}
                                    />
                                  )}
                                />
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Certainty Cost Slider */}
                  <Card sx={{ borderRadius: 3, backgroundColor: '#ffffff' }}>
                    <CardContent sx={{ padding: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <Typography variant="body1">
                          How much certainty are you looking for around timing and costs?
                        </Typography>
                        <InfoIcon sx={{ color: '#666', fontSize: 20 }} />
                      </Box>
                      
                      {/* Quote box above slider */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          backgroundColor: '#f5f5f5', 
                          borderRadius: 2, 
                          p: 2,
                          maxWidth: '500px'
                        }}>
                          <Avatar sx={{ 
                            bgcolor: '#e0e0e0',
                            width: 40,
                            height: 40,
                            flexShrink: 0
                          }}>
                            <PersonIcon sx={{ color: '#666' }} />
                          </Avatar>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#666', 
                              fontSize: '0.875rem',
                              lineHeight: 1.5
                            }}
                          >
                            "I like a plan, but I can roll with reasonable changes."
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Slider */}
                      <Controller
                        name="certaintyCost"
                        control={control}
                        render={({ field }) => (
                          <Box sx={{ px: 4, mb: 2 }}>
                            <Slider
                              {...field}
                              marks={certaintyCostMarks}
                              step={50}
                              min={0}
                              max={100}
                              sx={{
                                color: '#9c27b0',
                                height: 4,
                                '& .MuiSlider-mark': {
                                  backgroundColor: '#9c27b0',
                                  height: 8,
                                  width: 1,
                                },
                                '& .MuiSlider-markLabel': {
                                  fontSize: '0.75rem',
                                  color: '#666',
                                  top: 30,
                                  whiteSpace: 'nowrap',
                                  '&:first-of-type': {
                                    transform: 'translateX(0%)'
                                  },
                                  '&:last-child': {
                                    transform: 'translateX(-100%)'
                                  }
                                },
                                '& .MuiSlider-thumb': {
                                  backgroundColor: '#9c27b0',
                                  width: 20,
                                  height: 20,
                                  '&:hover': {
                                    backgroundColor: '#7b1fa2'
                                  }
                                },
                                '& .MuiSlider-track': {
                                  backgroundColor: '#9c27b0',
                                  height: 4
                                },
                                '& .MuiSlider-rail': {
                                  backgroundColor: '#e0e0e0',
                                  height: 4
                                }
                              }}
                            />
                          </Box>
                        )}
                      />
                      {/* Deadlines */}
                      <Box sx={{ mt: 4 }}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            Any deadlines or time pressures for moving?
                            <InfoIcon sx={{ color: '#666', fontSize: 20 }} />
                          </Typography>
                        </Box>
                        
                        <Controller
                          name="hasDeadlines"
                          control={control}
                          rules={{ required: 'Please select an option' }}
                          render={({ field }) => (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Button
                                variant={field.value === 'yes' ? 'contained' : 'outlined'}
                                onClick={() => field.onChange('yes')}
                                sx={{
                                  px: 6,
                                  py: 1.25,
                                  minWidth: '240px',
                                  backgroundColor: field.value === 'yes' ? '#9c27b0' : '#ffffff',
                                  borderColor: field.value === 'yes' ? '#9c27b0' : '#e0e0e0',
                                  color: field.value === 'yes' ? '#ffffff' : '#666',
                                  boxShadow: 'none',
                                  borderRadius: 1,
                                  '&:hover': {
                                    backgroundColor: field.value === 'yes' ? '#7b1fa2' : '#f5f5f5',
                                    borderColor: field.value === 'yes' ? '#7b1fa2' : '#e0e0e0',
                                    boxShadow: 'none'
                                  }
                                }}
                              >
                                Yes
                              </Button>
                              <Button
                                variant={field.value === 'no' ? 'contained' : 'outlined'}
                                onClick={() => field.onChange('no')}
                                sx={{
                                  px: 6,
                                  py: 1.25,
                                  minWidth: '240px',
                                  backgroundColor: field.value === 'no' ? '#9c27b0' : '#ffffff',
                                  borderColor: field.value === 'no' ? '#9c27b0' : '#e0e0e0',
                                  color: field.value === 'no' ? '#ffffff' : '#666',
                                  boxShadow: 'none',
                                  borderRadius: 1,
                                  '&:hover': {
                                    backgroundColor: field.value === 'no' ? '#7b1fa2' : '#f5f5f5',
                                    borderColor: field.value === 'no' ? '#7b1fa2' : '#e0e0e0',
                                    boxShadow: 'none'
                                  }
                                }}
                              >
                                No
                              </Button>
                            </Box>
                          )}
                        />
                        {errors.hasDeadlines && (
                          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                            {errors.hasDeadlines.message}
                          </Typography>
                        )}
                        
                        <Typography variant="caption" sx={{ color: '#666', mt: 2, display: 'block' }}>
                          e.g. Found dream home, need certainty for family, relocation, settlement booked, renovation starting, other personal circumstances
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Navigation Buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      startIcon={<ArrowBackIcon />}
                      sx={{
                        borderColor: '#9c27b0',
                        color: '#9c27b0',
                        px: 3,
                        py: 1,
                        '&:hover': {
                          borderColor: '#7b1fa2',
                          backgroundColor: 'rgba(156, 39, 176, 0.04)'
                        }
                      }}
                    >
                      Back
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        backgroundColor: '#9c27b0',
                        color: '#ffffff',
                        px: 3,
                        py: 1,
                        '&:hover': {
                          backgroundColor: '#7b1fa2'
                        },
                        '&.Mui-disabled': {
                          backgroundColor: 'rgba(156, 39, 176, 0.3)',
                          color: 'rgba(255, 255, 255, 0.6)'
                        }
                      }}
                      disableElevation
                    >
                      Next
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e0e0e0',
          py: 3,
          px: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="caption" sx={{ color: '#999' }}>
          FOOTER PLACEHOLDER
        </Typography>
      </Box>
    </Box>
  );
};