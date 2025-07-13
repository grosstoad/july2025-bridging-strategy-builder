import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  placeholder?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
  fullWidth = true,
  required = false,
  placeholder
}) => {
  const formatCurrencyInput = (value: number): string => {
    if (value === 0) return '';
    return value.toLocaleString('en-AU');
  };

  const parseCurrencyInput = (value: string): number => {
    const cleaned = value.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned) : 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseCurrencyInput(event.target.value);
    onChange(numericValue);
  };

  return (
    <TextField
      label={label}
      value={formatCurrencyInput(value)}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      disabled={disabled}
      fullWidth={fullWidth}
      required={required}
      placeholder={placeholder}
      variant="outlined"
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
      inputProps={{
        inputMode: 'numeric',
        pattern: '[0-9]*'
      }}
    />
  );
};