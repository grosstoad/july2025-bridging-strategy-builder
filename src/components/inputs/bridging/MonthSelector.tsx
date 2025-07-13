import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface MonthSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
  fullWidth = true,
  required = false,
  min = 1,
  max = 12
}) => {
  const months = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <FormControl fullWidth={fullWidth} error={error} disabled={disabled} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        label={label}
      >
        {months.map(month => (
          <MenuItem key={month} value={month}>
            {month} {month === 1 ? 'month' : 'months'}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};