import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { CurrencyInput } from '../inputs/bridging/CurrencyInput';
import { PercentageInput } from '../inputs/bridging/PercentageInput';
import { YesNoToggle } from '../inputs/bridging/YesNoToggle';
import { BridgingInputs } from '../../types/bridgingCalculator';

interface ExistingPropertySectionProps {
  inputs: BridgingInputs;
  onChange: (field: keyof BridgingInputs, value: any) => void;
  disabled?: boolean;
}

export const ExistingPropertySection: React.FC<ExistingPropertySectionProps> = ({
  inputs,
  onChange,
  disabled = false
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Existing property
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <CurrencyInput
            label="Existing property valuation"
            value={inputs.existingPropertyValue}
            onChange={(value) => onChange('existingPropertyValue', value)}
            disabled={disabled}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <CurrencyInput
            label="Existing debt"
            value={inputs.existingDebt}
            onChange={(value) => onChange('existingDebt', value)}
            disabled={disabled}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <PercentageInput
            label="Selling costs"
            value={inputs.sellingCostsPercent}
            onChange={(value) => onChange('sellingCostsPercent', value)}
            disabled={disabled}
            helperText="Typically 2-3% including agent fees"
            min={0}
            max={10}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mt: 1 }}>
            <YesNoToggle
              label="Contract of sale provided?"
              value={inputs.contractOfSaleProvided}
              onChange={(value) => onChange('contractOfSaleProvided', value)}
              disabled={disabled}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <CurrencyInput
            label="Sales proceeds to retain"
            value={inputs.salesProceedsToRetain}
            onChange={(value) => onChange('salesProceedsToRetain', value)}
            disabled={disabled}
            helperText="Amount not available for purchase"
          />
        </Grid>
      </Grid>
    </Box>
  );
};