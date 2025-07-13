import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Collapse,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { BridgingResults } from '../../types/bridgingCalculator';

interface CalculationResultsProps {
  results: BridgingResults;
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({ results }) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [showIterations, setShowIterations] = React.useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const isHealthyLVR = results.endDebtLvr <= 0.8 && results.peakDebtLvrInclIcap <= 0.85;

  return (
    <Box>
      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Bridge debt
              </Typography>
              <Typography variant="h5" component="div">
                {formatCurrency(results.bridgeDebt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Including fees: {formatCurrency(results.fcap)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                End debt
              </Typography>
              <Typography variant="h5" component="div">
                {formatCurrency(results.endDebt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                LVR: {formatPercent(results.endDebtLvr)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Peak debt LVR
              </Typography>
              <Typography variant="h5" component="div">
                {formatPercent(results.peakDebtLvrInclIcap)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {isHealthyLVR ? (
                  <CheckCircleIcon color="success" fontSize="small" />
                ) : (
                  <WarningIcon color="warning" fontSize="small" />
                )}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  {isHealthyLVR ? 'Within limits' : 'High LVR'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: results.shortfall > 0 ? 'error.light' : 'background.paper' }}>
            <CardContent>
              <Typography color={results.shortfall > 0 ? 'error.contrastText' : 'text.secondary'} gutterBottom>
                Additional cash required
              </Typography>
              <Typography variant="h5" component="div" color={results.shortfall > 0 ? 'error.contrastText' : 'text.primary'}>
                {formatCurrency(results.additionalCashRequired + results.shortfall)}
              </Typography>
              {results.shortfall > 0 && (
                <Typography variant="body2" color="error.contrastText">
                  Includes {formatCurrency(results.shortfall)} shortfall
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Results */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Calculation breakdown</Typography>
            <IconButton
              onClick={() => setShowDetails(!showDetails)}
              sx={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          <Collapse in={showDetails}>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Existing property calculations
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Selling costs: {formatCurrency(results.sellingCostsAmount)}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Property equity: {formatCurrency(results.existingPropertyEquity)}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Shaded valuation: {formatCurrency(results.shadedValuation)}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Net sales proceeds: {formatCurrency(results.shadedNetSalesProceeds)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  New property calculations
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Purchase costs: {formatCurrency(results.purchaseCostsAmount)}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Additional funds required: {formatCurrency(results.additionalFundsRequired)}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Peak debt (before cap): {formatCurrency(results.peakDebtBeforeCap)}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Max peak debt: {formatCurrency(results.maxPeakDebtBeforeCap)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  Bridge debt components
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Bridge debt (excl. FCAP): {formatCurrency(results.bridgeDebtExcludingFcap)}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    FCAP: {formatCurrency(results.fcap)}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Assessed ICAP: {formatCurrency(results.assessedIcap)}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Peak debt (incl. ICAP): {formatCurrency(results.peakDebtIncludingIcap)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  Final metrics
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Peak debt LVR (excl. ICAP): {formatPercent(results.peakDebtLvrExclIcap)}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Peak shaded valuation: {formatCurrency(results.peakShadedValuation)}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    Convergence check: {results.checkValue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    {results.converged ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Converged in {results.iterations} iterations
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                        <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Did not converge after {results.iterations} iterations
                      </Box>
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Collapse>
        </CardContent>
      </Card>

      {/* Iteration Log */}
      {results.iterationLog && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                Calculation details and iterations
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={`${results.iterations} iterations`} 
                  size="small" 
                  color={results.converged ? 'success' : 'warning'}
                />
                <IconButton
                  onClick={() => setShowIterations(!showIterations)}
                  sx={{ transform: showIterations ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
            </Box>

            <Collapse in={showIterations}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Detailed calculation log showing all intermediate values and iterative convergence process:
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: '0.8rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    maxHeight: 500,
                    overflow: 'auto',
                    border: '1px solid #e0e0e0',
                    '&::-webkit-scrollbar': {
                      width: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f0f0f0',
                      borderRadius: 4,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#bdbdbd',
                      borderRadius: 4,
                      '&:hover': {
                        backgroundColor: '#9e9e9e',
                      },
                    },
                  }}
                >
                  {results.iterationLog}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  * All currency values shown in the log are in AUD
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};