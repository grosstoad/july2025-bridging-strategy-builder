import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { CurrencyInput } from '../inputs/bridging/CurrencyInput';
import { PercentageInput } from '../inputs/bridging/PercentageInput';
import { YesNoToggle } from '../inputs/bridging/YesNoToggle';
import { MonthSelector } from '../inputs/bridging/MonthSelector';
import { RepaymentTypeSelect } from '../inputs/bridging/RepaymentTypeSelect';
import { BridgingInputs } from '../../types/bridgingCalculator';

interface BridgingProductSectionProps {
  inputs: BridgingInputs;
  onChange: (field: keyof BridgingInputs, value: any) => void;
  disabled?: boolean;
}

export const BridgingProductSection: React.FC<BridgingProductSectionProps> = ({
  inputs,
  onChange,
  disabled = false
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Bridging product
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <MonthSelector
            label="Bridging term"
            value={inputs.bridgingTermMonths}
            onChange={(value) => onChange('bridgingTermMonths', value)}
            disabled={disabled}
            required
            min={1}
            max={12}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <RepaymentTypeSelect
            value={inputs.bridgingRepaymentType}
            onChange={(value) => onChange('bridgingRepaymentType', value)}
            disabled={disabled}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <PercentageInput
            label="Bridging interest rate"
            value={inputs.bridgingInterestRate}
            onChange={(value) => onChange('bridgingInterestRate', value)}
            disabled={disabled}
            helperText="Annual interest rate"
            min={0}
            max={20}
            step={0.01}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <PercentageInput
            label="Bridging fees (no end debt)"
            value={inputs.bridgingFeesNoEndDebtPercent}
            onChange={(value) => onChange('bridgingFeesNoEndDebtPercent', value)}
            disabled={disabled}
            helperText="Fee when fully repaid"
            min={0}
            max={5}
            step={0.01}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <CurrencyInput
            label="Bridging fees (end debt)"
            value={inputs.bridgingFeesEndDebtAmount}
            onChange={(value) => onChange('bridgingFeesEndDebtAmount', value)}
            disabled={disabled}
            helperText="Fixed fee when end debt exists"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mt: 1 }}>
            <YesNoToggle
              label="Bridging fees capitalised?"
              value={inputs.bridgingFeesCapitalised}
              onChange={(value) => onChange('bridgingFeesCapitalised', value)}
              disabled={disabled}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};