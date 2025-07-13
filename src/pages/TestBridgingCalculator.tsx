import React, { useState } from 'react';
import { Box, Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { runTestCase, testCases } from '../test/bridgingCalculatorTestRunner';

export const TestBridgingCalculator: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  const runTests = () => {
    const results = testCases.map((testCase, index) => ({
      ...runTestCase(testCase),
      index
    }));
    setTestResults(results);
  };

  const formatNumber = (value: number, isCurrency: boolean) => {
    if (isCurrency) {
      return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    }
    return value.toFixed(6);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bridging Calculator Test Suite
      </Typography>
      
      <Button variant="contained" onClick={runTests} sx={{ mb: 3 }}>
        Run All Tests
      </Button>

      {testResults.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Test Summary
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Test Case</TableCell>
                  <TableCell align="center">Passed</TableCell>
                  <TableCell align="center">Failed</TableCell>
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testResults.map((result, index) => {
                  const passed = result.comparison.filter((c: any) => c.passed).length;
                  const failed = result.comparison.filter((c: any) => !c.passed).length;
                  const total = result.comparison.length;
                  const allPassed = failed === 0;
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>{result.name}</TableCell>
                      <TableCell align="center">{passed}</TableCell>
                      <TableCell align="center">{failed}</TableCell>
                      <TableCell align="center">{total}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={allPassed ? 'PASS' : 'FAIL'} 
                          color={allPassed ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          onClick={() => setSelectedTest(selectedTest === index ? null : index)}
                        >
                          {selectedTest === index ? 'Hide' : 'Details'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {selectedTest !== null && (
            <>
              <Typography variant="h6" gutterBottom>
                {testResults[selectedTest].name} - Detailed Results
              </Typography>
              
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Field</TableCell>
                      <TableCell align="right">Expected</TableCell>
                      <TableCell align="right">Actual</TableCell>
                      <TableCell align="right">Difference</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {testResults[selectedTest].comparison.map((comp: any) => {
                      const isCurrency = ['Amount', 'debt', 'Debt', 'proceeds', 'funds', 'shortfall', 'required', 'valuation', 'Valuation'].some(
                        term => comp.field.includes(term)
                      );
                      
                      return (
                        <TableRow key={comp.field} sx={{ backgroundColor: comp.passed ? 'inherit' : 'error.light' }}>
                          <TableCell>{comp.field}</TableCell>
                          <TableCell align="right">{formatNumber(comp.expected, isCurrency)}</TableCell>
                          <TableCell align="right">{formatNumber(comp.actual, isCurrency)}</TableCell>
                          <TableCell align="right">{formatNumber(comp.difference, isCurrency)}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={comp.passed ? '✓' : '✗'} 
                              color={comp.passed ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}
    </Container>
  );
};