import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { CurrencyInput } from '../inputs/bridging/CurrencyInput';
import { PercentageInput } from '../inputs/bridging/PercentageInput';
import { YesNoToggle } from '../inputs/bridging/YesNoToggle';
import { BridgingInputs } from '../../types/bridgingCalculator';

interface NewPropertySectionProps {
  inputs: BridgingInputs;
  onChange: (field: keyof BridgingInputs, value: any) => void;
  disabled?: boolean;
}

export const NewPropertySection: React.FC<NewPropertySectionProps> = ({
  inputs,
  onChange,
  disabled = false
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        New property
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <CurrencyInput
            label="New property valuation"
            value={inputs.newPropertyValue}
            onChange={(value) => onChange('newPropertyValue', value)}
            disabled={disabled}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <PercentageInput
            label="Purchase costs"
            value={inputs.purchaseCostsPercent}
            onChange={(value) => onChange('purchaseCostsPercent', value)}
            disabled={disabled}
            helperText="Stamp duty, legal fees, etc."
            min={0}
            max={15}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mt: 1 }}>
            <YesNoToggle
              label="Purchase costs capitalised?"
              value={inputs.purchaseCostsCapitalised}
              onChange={(value) => onChange('purchaseCostsCapitalised', value)}
              disabled={disabled}
              helperText="Add to loan amount vs pay upfront"
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <CurrencyInput
            label="Additional borrowings"
            value={inputs.additionalBorrowings}
            onChange={(value) => onChange('additionalBorrowings', value)}
            disabled={disabled}
            helperText="Extra funds beyond property purchase"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <CurrencyInput
            label="Savings"
            value={inputs.savings}
            onChange={(value) => onChange('savings', value)}
            disabled={disabled}
            helperText="Cash contribution available"
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};