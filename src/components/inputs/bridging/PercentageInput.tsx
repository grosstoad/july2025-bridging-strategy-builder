import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

interface PercentageInputProps {
  label: string;
  value: number; // Value as a percentage (e.g., 2.5 for 2.5%)
  onChange: (value: number) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export const PercentageInput: React.FC<PercentageInputProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
  fullWidth = true,
  required = false,
  min = 0,
  max = 100,
  step = 0.1
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = parseFloat(inputValue);
    
    if (!isNaN(numericValue)) {
      // Clamp the value between min and max
      const clampedValue = Math.min(Math.max(numericValue, min), max);
      onChange(clampedValue);
    } else if (inputValue === '') {
      onChange(0);
    }
  };

  return (
    <TextField
      label={label}
      type="number"
      value={value || ''}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      disabled={disabled}
      fullWidth={fullWidth}
      required={required}
      variant="outlined"
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
      inputProps={{
        min,
        max,
        step,
        inputMode: 'decimal'
      }}
    />
  );
};