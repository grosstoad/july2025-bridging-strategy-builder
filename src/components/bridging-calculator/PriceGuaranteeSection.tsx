import React from 'react';
import { Grid, Typography, Box, Collapse } from '@mui/material';
import { CurrencyInput } from '../inputs/bridging/CurrencyInput';
import { YesNoToggle } from '../inputs/bridging/YesNoToggle';
import { BridgingInputs } from '../../types/bridgingCalculator';

interface PriceGuaranteeSectionProps {
  inputs: BridgingInputs;
  onChange: (field: keyof BridgingInputs, value: any) => void;
  disabled?: boolean;
}

export const PriceGuaranteeSection: React.FC<PriceGuaranteeSectionProps> = ({
  inputs,
  onChange,
  disabled = false
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Price guarantee
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <YesNoToggle
            label="Price guarantee included?"
            value={inputs.pgIncluded}
            onChange={(value) => onChange('pgIncluded', value)}
            disabled={disabled}
          />
        </Grid>
        
        <Collapse in={inputs.pgIncluded} timeout="auto" unmountOnExit>
          <Grid container spacing={3} sx={{ px: 3, pt: 2 }}>
            <Grid item xs={12} sm={6}>
              <CurrencyInput
                label="PG fee"
                value={inputs.pgFeeAmount}
                onChange={(value) => onChange('pgFeeAmount', value)}
                disabled={disabled || !inputs.pgIncluded}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ mt: 1 }}>
                <YesNoToggle
                  label="PG fee capitalised?"
                  value={inputs.pgFeeCapitalised}
                  onChange={(value) => onChange('pgFeeCapitalised', value)}
                  disabled={disabled || !inputs.pgIncluded}
                />
              </Box>
            </Grid>
          </Grid>
        </Collapse>
      </Grid>
    </Box>
  );
};