import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';

interface YesNoToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  row?: boolean;
}

export const YesNoToggle: React.FC<YesNoToggleProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
  required = false,
  row = true
}) => {
  return (
    <FormControl error={error} disabled={disabled} required={required}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        row={row}
        value={value ? 'yes' : 'no'}
        onChange={(e) => onChange(e.target.value === 'yes')}
      >
        <FormControlLabel 
          value="yes" 
          control={<Radio />} 
          label="Yes"
          sx={{ mr: 3 }}
        />
        <FormControlLabel 
          value="no" 
          control={<Radio />} 
          label="No"
        />
      </RadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};