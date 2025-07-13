import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { BRIDGING_CALCULATOR_CONFIG } from '../../../config/bridgingCalculatorDefaults';

interface RepaymentTypeSelectProps {
  value: 'Interest Only' | 'ICAP';
  onChange: (value: 'Interest Only' | 'ICAP') => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
}

export const RepaymentTypeSelect: React.FC<RepaymentTypeSelectProps> = ({
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
  fullWidth = true,
  required = false
}) => {
  return (
    <FormControl fullWidth={fullWidth} error={error} disabled={disabled} required={required}>
      <InputLabel>Bridging repayment type</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as 'Interest Only' | 'ICAP')}
        label="Bridging repayment type"
      >
        <MenuItem value={BRIDGING_CALCULATOR_CONFIG.repaymentTypes.interestOnly}>
          Interest Only
        </MenuItem>
        <MenuItem value={BRIDGING_CALCULATOR_CONFIG.repaymentTypes.icap}>
          ICAP (Interest Capitalisation)
        </MenuItem>
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};