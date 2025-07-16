import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Stack,
  FormControl,
  Slider,
  TextField,
  InputLabel
} from '@mui/material';
import { AccessTime as ClockIcon } from '@mui/icons-material';
import {
  generateMonthOptions,
  formatMonthYear,
  addMonths,
  getMonthsBetween,
  parseDateValue
} from '../../utils/dateHelpers';

interface TimingControlsProps {
  readyToGo: Date;
  timeBetween: number; // months
  onTimingChange: (timing: { readyToGo: Date; timeBetween: number }) => void;
  sx?: any;
}

export const TimingControls: React.FC<TimingControlsProps> = ({
  readyToGo,
  timeBetween,
  onTimingChange,
  sx = {}
}) => {
  // Generate month options for next 12 months
  const monthOptions = useMemo(() => generateMonthOptions(12), []);

  // Calculate timeline range (24 months from current date)
  const currentDate = new Date();
  const minDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const maxDate = addMonths(minDate, 24);

  // Calculate slider values
  const readyToGoValue = getMonthsBetween(minDate, readyToGo);
  const settlementValue = readyToGoValue + timeBetween;

  // Generate marks for slider
  const marks = useMemo(() => {
    const markPoints = [];
    for (let i = 0; i <= 24; i += 3) {
      markPoints.push({ value: i });
    }
    return markPoints;
  }, []);

  const handleReadyToGoChange = (value: string) => {
    const newDate = parseDateValue(value);
    onTimingChange({ readyToGo: newDate, timeBetween });
  };

  const handleTimeBetweenChange = (months: number) => {
    onTimingChange({ readyToGo, timeBetween: months });
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const [newReadyValue, newSettlementValue] = newValue;
      const newReadyDate = addMonths(minDate, newReadyValue);
      const newTimeBetween = newSettlementValue - newReadyValue;
      onTimingChange({ readyToGo: newReadyDate, timeBetween: newTimeBetween });
    }
  };

  // Time between options - dynamic based on ready to go date
  const maxTimeBetween = Math.min(12, 24 - readyToGoValue);
  const timeBetweenOptions = Array.from({ length: maxTimeBetween + 1 }, (_, i) => i);

  return (
    <Box sx={{ flex: 1.5, minWidth: { xs: '100%', sm: 350, md: 400 }, ...sx }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        mb: 1.5
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          backgroundColor: '#ebebeb',
          borderRadius: '100px',
          px: 1,
          py: 0.5
        }}>
          <ClockIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Timing
          </Typography>
        </Box>

        {/* Dropdowns Row */}
        <Stack direction="row" spacing={1}>
          {/* Ready to go Select */}
          <FormControl size="small" sx={{ width: 130 }}>
          <InputLabel sx={{ fontSize: '0.75rem' }}>Ready to go</InputLabel>
          <Select
            value={monthOptions.find(opt => 
              opt.date.getMonth() === readyToGo.getMonth() && 
              opt.date.getFullYear() === readyToGo.getFullYear()
            )?.value || monthOptions[0].value}
            onChange={(e) => handleReadyToGoChange(e.target.value)}
            label="Ready to go"
            sx={{
              height: 40,
              '& .MuiSelect-select': {
                fontSize: '0.875rem',
              }
            }}
          >
            {monthOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Time between Select */}
        <Box>
          <FormControl size="small" sx={{ width: 140 }}>
            <InputLabel sx={{ fontSize: '0.75rem' }}>Time between</InputLabel>
            <Select
              value={timeBetween}
              onChange={(e) => handleTimeBetweenChange(Number(e.target.value))}
              label="Time between"
              sx={{
                height: 40,
                '& .MuiSelect-select': {
                  fontSize: '0.875rem',
                }
              }}
            >
              {timeBetweenOptions.map(months => (
                <MenuItem key={months} value={months}>
                  {months} {months === 1 ? 'month' : 'months'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Calculated date display */}
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              textAlign: 'center',
              mt: 0.5,
              fontSize: '0.75rem',
              color: 'text.secondary'
            }}
          >
            {formatMonthYear(addMonths(readyToGo, timeBetween))}
          </Typography>
        </Box>
      </Stack>
      </Box>

      {/* Dual Handle Slider */}
      <Box sx={{ px: 0, pt: 1.5, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ px: 0 }}>
          <Slider
            value={[readyToGoValue, settlementValue]}
            onChange={handleSliderChange}
            min={0}
            max={24}
            marks={marks}
            step={1}
            disableSwap
            sx={{
              mx: 1,
              height: 4,
              '& .MuiSlider-thumb': {
                backgroundColor: 'primary.main',
                width: 16,
                height: 16,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: 'inherit',
                },
              },
              '& .MuiSlider-track': {
                backgroundColor: 'primary.main',
                height: 4,
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#e0e0e0',
                height: 4,
              },
              '& .MuiSlider-mark': {
                backgroundColor: '#bdbdbd',
                height: 6,
                width: 1,
                '&.MuiSlider-markActive': {
                  backgroundColor: 'primary.main',
                },
              },
              '& .MuiSlider-markLabel': {
                display: 'none',
              },
            }}
            valueLabelDisplay="off"
          />
          
          {/* Timeline labels */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, px: 1 }}>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
              {formatMonthYear(minDate)}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
              {formatMonthYear(maxDate)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};