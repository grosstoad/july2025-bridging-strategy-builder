import React from 'react';
import { Grid, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { CurrencyInput } from '../inputs/bridging/CurrencyInput';
import { PercentageInput } from '../inputs/bridging/PercentageInput';
import { BridgingInputs } from '../../types/bridgingCalculator';

interface AssumptionsSectionProps {
  inputs: BridgingInputs;
  onChange: (field: keyof BridgingInputs, value: any) => void;
  disabled?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export const AssumptionsSection: React.FC<AssumptionsSectionProps> = ({
  inputs,
  onChange,
  disabled = false,
  expanded = false,
  onExpandedChange
}) => {
  return (
    <Accordion 
      expanded={expanded} 
      onChange={(_, isExpanded) => onExpandedChange?.(isExpanded)}
      sx={{ 
        backgroundColor: 'background.paper',
        '&:before': { display: 'none' }
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Advanced settings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Loan-to-Value Ratio (LVR) limits
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PercentageInput
              label="Peak debt max LVR (with COS)"
              value={inputs.peakDebtMaxLvrWithCos}
              onChange={(value) => onChange('peakDebtMaxLvrWithCos', value)}
              disabled={disabled}
              helperText="When contract of sale exists"
              min={0}
              max={100}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PercentageInput
              label="Peak debt max LVR (without COS)"
              value={inputs.peakDebtMaxLvrWithoutCos}
              onChange={(value) => onChange('peakDebtMaxLvrWithoutCos', value)}
              disabled={disabled}
              helperText="When no contract of sale"
              min={0}
              max={100}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PercentageInput
              label="Existing property valuation shading"
              value={inputs.existingPropertyValuationShading}
              onChange={(value) => onChange('existingPropertyValuationShading', value)}
              disabled={disabled}
              helperText="Conservative discount applied"
              min={0}
              max={20}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PercentageInput
              label="New property max LVR"
              value={inputs.newPropertyMaxLvr}
              onChange={(value) => onChange('newPropertyMaxLvr', value)}
              disabled={disabled}
              helperText="For end debt calculation"
              min={0}
              max={100}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
              Other assumptions
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PercentageInput
              label="Bridge debt servicing buffer"
              value={inputs.bridgeDebtServicingBuffer}
              onChange={(value) => onChange('bridgeDebtServicingBuffer', value)}
              disabled={disabled}
              helperText="Additional rate for ICAP"
              min={0}
              max={5}
              step={0.01}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <CurrencyInput
              label="Minimum loan amount"
              value={inputs.minimumLoanAmount}
              onChange={(value) => onChange('minimumLoanAmount', value)}
              disabled={disabled}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <CurrencyInput
              label="Maximum loan amount"
              value={inputs.maximumLoanAmount}
              onChange={(value) => onChange('maximumLoanAmount', value)}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};