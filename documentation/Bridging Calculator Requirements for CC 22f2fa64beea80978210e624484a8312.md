# Bridging Calculator Requirements for CC

# Bridge and End Debt Calculator - Comprehensive Requirements Specification v2.0

## 1. Executive Summary

### 1.1 Purpose

The Bridge and End Debt Calculator is a financial calculation tool designed to determine optimal bridge financing and end debt amounts for property transactions where a borrower is selling an existing property and purchasing a new property. The calculator handles complex scenarios including interest capitalization, fee structures, and regulatory constraints.

### 1.2 Scope

This specification defines all functional requirements, calculation algorithms, business rules, and technical constraints for the Bridge and End Debt Calculator system.

### 1.3 Key Features

- Iterative calculation engine for circular dependency resolution
- Support for ICAP (Interest Capitalization) and Interest Only repayment types
- Comprehensive fee capitalization options
- LVR (Loan-to-Value Ratio) constraint enforcement
- Real-time validation with test case comparison
- Visual debt flow representation

## 2. System Architecture Requirements

### 2.1 Architectural Pattern

The system SHALL implement a clean architecture pattern with the following layers:

### 2.1.1 Business Logic Layer (Model)

- **CalculationEngine Class**: Pure calculation logic with no UI dependencies
- **Input**: Strongly-typed LoanInputs interface
- **Output**: CalculationResults interface with all calculated fields
- **Dependencies**: Configuration object only

### 2.1.2 User Interface Layer (View)

- **CalculatorUI Class**: Handles all DOM manipulation
- **Responsibilities**:
    - Gather user inputs from form fields
    - Display calculation results
    - Format currency and percentage values
    - Handle validation display

### 2.1.3 Application Layer (Controller)

- **Application Class**: Orchestrates interaction between layers
- **Responsibilities**:
    - Input validation
    - Error handling
    - Event listener management
    - Public API exposure

### 2.1.4 Configuration Layer

- **Config Object**: Centralized configuration management
- **Structure**:
    
    ```tsx
    {  solver: {    maxIterations: 100,    convergenceTolerance: 0.01,    infinityProxy: 999999999  },  defaults: {    // All default values  },  validation: {    // Validation rules  },  repaymentTypes: {    // Enumerated values  },  formatting: {    // Display formatting rules  }}
    
    ```
    

## 3. Input Requirements

### 3.1 Existing Property Section

### 3.1.1 Existing Property Valuation

- **Field Type**: Currency input
- **Validation**: Must be greater than 0
- **Default**: $1,000,000
- **Description**: Current market value of the property being sold

### 3.1.2 Existing Debt

- **Field Type**: Currency input
- **Validation**:
    - Must be >= 0
    - Must be <= Existing Property Valuation
- **Default**: $500,000
- **Description**: Outstanding loan amount on existing property

### 3.1.3 Selling Costs Percentage

- **Field Type**: Percentage input
- **Validation**: 0% - 100%
- **Default**: 2.5%
- **Description**: Real estate agent fees and other selling costs as percentage of sale price

### 3.1.4 Contract of Sale Provided

- **Field Type**: Yes/No dropdown
- **Default**: "No"
- **Impact**: Affects Peak Debt Max LVR calculation
    - If "Yes": Uses peakDebtMaxLvrWithCos (default 85%)
    - If "No": Uses peakDebtMaxLvrWithoutCos (default 80%)

### 3.1.5 Sales Proceeds to Retain

- **Field Type**: Currency input
- **Validation**: >= 0
- **Default**: $0
- **Description**: Amount of sales proceeds not available for the transaction

### 3.2 Price Guarantee Section

### 3.2.1 PG Included

- **Field Type**: Yes/No dropdown
- **Default**: "No"
- **Description**: Whether a price guarantee product is included

### 3.2.2 PG Fee Amount

- **Field Type**: Currency input
- **Validation**: >= 0
- **Default**: $0
- **Description**: Fee for the price guarantee product

### 3.2.3 PG Fee Capitalised

- **Field Type**: Yes/No dropdown
- **Default**: "No"
- **Impact**:
    - If "Yes" and PG Included: Added to additional funds required
    - If "No" and PG Included: Added to additional cash required

### 3.3 New Property Section

### 3.3.1 New Property Valuation

- **Field Type**: Currency input
- **Validation**: Must be > 0
- **Default**: $1,200,000
- **Description**: Purchase price of the new property

### 3.3.2 Purchase Costs Percentage

- **Field Type**: Percentage input
- **Validation**: 0% - 100%
- **Default**: 5.5%
- **Description**: Stamp duty, legal fees, and other purchase costs

### 3.3.3 Purchase Costs Capitalised

- **Field Type**: Yes/No dropdown
- **Default**: "Yes"
- **Impact**:
    - If "Yes": Added to loan amount
    - If "No": Added to additional cash required

### 3.3.4 Additional Borrowings

- **Field Type**: Currency input
- **Validation**: >= 0
- **Default**: $0
- **Description**: Extra funds borrowed beyond property purchase

### 3.3.5 Savings

- **Field Type**: Currency input
- **Validation**: >= 0
- **Default**: $100,000
- **Description**: Cash contribution from borrower

### 3.4 Bridging Product Section

### 3.4.1 Bridging Term (Months)

- **Field Type**: Integer input
- **Validation**: 1-12 months (enforced)
- **Default**: 6
- **Description**: Duration of bridge loan in months

### 3.4.2 Bridging Repayment Type

- **Field Type**: Dropdown
- **Options**:
    - "Interest Only": Regular interest payments during term
    - "ICAP": Interest capitalized and compounded monthly
- **Default**: "Interest Only"

### 3.4.3 Bridging Interest Rate

- **Field Type**: Percentage input
- **Validation**: 0% - 100%
- **Default**: 7.50%
- **Description**: Annual interest rate for bridge loan

### 3.4.4 Bridging Fees (No End Debt)

- **Field Type**: Percentage input
- **Validation**: 0% - 100%
- **Default**: 0.75%
- **Description**: Fee percentage when no end debt exists

### 3.4.5 Bridging Fees (End Debt)

- **Field Type**: Currency input
- **Validation**: >= 0
- **Default**: $1,500
- **Description**: Fixed fee amount when end debt exists

### 3.4.6 Bridging Fees Capitalised

- **Field Type**: Yes/No dropdown
- **Default**: "Yes"
- **Impact**: Complex fee calculation logic (see section 4.5)

### 3.5 Assumptions Section

### 3.5.1 Peak Debt Max LVR (with COS)

- **Field Type**: Percentage input
- **Validation**: 0% - 100%
- **Default**: 85%
- **Description**: Maximum LVR when contract of sale exists

### 3.5.2 Peak Debt Max LVR (without COS)

- **Field Type**: Percentage input
- **Validation**: 0% - 100%
- **Default**: 80%
- **Description**: Maximum LVR when no contract of sale

### 3.5.3 Existing Property Valuation Shading

- **Field Type**: Percentage input
- **Validation**: 0% - 100%
- **Default**: 5%
- **Description**: Conservative discount on existing property value

### 3.5.4 New Property Max LVR

- **Field Type**: Percentage input
- **Validation**: 0% - 100%
- **Default**: 85%
- **Description**: Maximum LVR for end debt on new property

### 3.5.5 Bridge Debt Servicing Buffer

- **Field Type**: Percentage input
- **Validation**: 0% - 100%
- **Default**: 1.00%
- **Description**: Additional rate buffer for ICAP calculations

### 3.5.6 Minimum Loan Amount

- **Field Type**: Currency input
- **Validation**: >= 0
- **Default**: $100,000
- **Description**: Minimum allowable loan size

### 3.5.7 Maximum Loan Amount

- **Field Type**: Currency input
- **Validation**: >= Minimum Loan Amount
- **Default**: $3,000,000
- **Description**: Maximum allowable loan size

## 4. Calculation Requirements

### 4.1 Basic Calculations (Non-Iterative)

### 4.1.1 Selling Costs Amount

```
sellingCostsAmount = sellingCostsPercent × existingPropertyValue

```

### 4.1.2 Existing Property Equity

```
existingPropertyEquity = existingPropertyValue × peakDebtMaxLvrWithCos - existingDebt

```

### 4.1.3 Shaded Valuation

```
shadedValuation = existingPropertyValue × (1 - existingPropertyValuationShading)

```

### 4.1.4 Shaded Net Sales Proceeds

```
shadedNetSalesProceeds = existingPropertyValue × (1 - existingPropertyValuationShading)
                        - sellingCostsAmount - salesProceedsToRetain

```

### 4.1.5 Purchase Costs Amount

```
purchaseCostsAmount = purchaseCostsPercent × newPropertyValue

```

### 4.1.6 Additional Funds Required

```
additionalFundsRequired = newPropertyValue
                        + (purchaseCostsCapitalised ? purchaseCostsAmount : 0)
                        + additionalBorrowings
                        - savings
                        + ((pgIncluded AND pgFeeCapitalised) ? pgFeeAmount : 0)

```

### 4.1.7 Peak Debt Before Capitalisation

```
peakDebtBeforeCap = additionalFundsRequired + existingDebt

```

### 4.1.8 Peak Shaded Valuation

```
peakShadedValuation = newPropertyValue + shadedValuation

```

### 4.1.9 Max Peak Debt Before Capitalisation

```
maxPeakDebtBeforeCap = MIN(
    peakShadedValuation × (contractOfSaleProvided ? peakDebtMaxLvrWithCos : peakDebtMaxLvrWithoutCos),
    maximumLoanAmount
)

```

### 4.2 Iterative Calculation Requirements

### 4.2.1 Circular Dependency

The system SHALL implement an iterative solver to handle the circular dependency between:

- Bridge Debt (depends on End Debt)
- End Debt (depends on Bridge Debt)
- Peak Debt Including ICAP (depends on both)

### 4.2.2 Iteration Process

1. **Initialize**: Start with endDebt = 0
2. **Calculate**: Compute bridgeDebt based on current endDebt
3. **Update**: Calculate new endDebt based on bridgeDebt
4. **Check**: Verify convergence using checkValue formula
5. **Repeat**: Continue until converged or max iterations reached

### 4.2.3 Convergence Criteria

- Absolute difference between consecutive endDebt values < 0.01
- checkValue (P14) < 0.01
- Maximum iterations: 100

### 4.3 Bridge Debt Calculation

### 4.3.1 Three-Part Minimum Formula

```
bridgeDebt = MIN(Part1, Part2, Part3)

```

### 4.3.2 Part 1: Standard Bridge Debt

```
Part1 = MIN(peakDebtBeforeCap, maxPeakDebtBeforeCap)
      + (bridgingFeesCapitalised ? peakDebtBeforeCap × bridgingFeesNoEndDebtPercent : 0)

```

### 4.3.3 Part 2: Sales Proceeds Limit

```
Part2 = shadedNetSalesProceeds

```

### 4.3.4 Part 3: Minimum Loan Adjustment

```
Condition: (MIN(peakDebtBeforeCap, maxPeakDebtBeforeCap)
          + (bridgingFeesCapitalised ? MIN(peakDebtBeforeCap, maxPeakDebtBeforeCap) × bridgingFeesNoEndDebtPercent : 0))
          > shadedNetSalesProceeds
          AND endDebt > 0
          AND endDebt <= minimumLoanAmount

If Condition is TRUE:
    Part3 = MIN(shadedNetSalesProceeds, peakDebtBeforeCap, maxPeakDebtBeforeCap)
          + (bridgingFeesCapitalised ? bridgingFeesEndDebtAmount : 0)
          - minimumLoanAmount
Else:
    Part3 = 999999999 (effectively infinity)

```

### 4.4 Bridge Debt Components

### 4.4.1 Bridge Debt Excluding FCAP

```
If endDebt > 0 AND bridgingFeesCapitalised:
    bridgeDebtExcludingFcap = bridgeDebt - bridgingFeesEndDebtAmount

Else if endDebt = 0 AND bridgingFeesCapitalised:
    bridgeDebtExcludingFcap = bridgeDebt / (1 + bridgingFeesNoEndDebtPercent)

Else:
    bridgeDebtExcludingFcap = bridgeDebt

```

### 4.4.2 FCAP (Fee Capitalization)

```
fcap = bridgeDebt - bridgeDebtExcludingFcap

```

### 4.4.3 Assessed ICAP

```
If bridgingRepaymentType = "ICAP":
    assessedIcap = bridgeDebt × ((1 + (bridgingInterestRate + bridgeDebtServicingBuffer) / 12)^bridgingTermMonths) - bridgeDebt
Else:
    assessedIcap = 0

```

### 4.5 Peak Debt Including ICAP

```
peakDebtIncludingIcap = MIN(
    maximumLoanAmount,
    peakDebtBeforeCap + fcap + assessedIcap,
    maxPeakDebtBeforeCap
)

```

### 4.6 End Debt Calculation

```
endDebtCalculation = peakDebtIncludingIcap - bridgeDebt - assessedIcap

If endDebtCalculation > 0:
    endDebt = MIN(
        newPropertyValue × newPropertyMaxLvr,
        maximumLoanAmount,
        MAX(endDebtCalculation, minimumLoanAmount)
    )
Else:
    endDebt = 0

```

### 4.7 Final Metrics

### 4.7.1 Shortfall

```
shortfall = peakDebtBeforeCap + fcap + assessedIcap - peakDebtIncludingIcap

```

### 4.7.2 Additional Cash Required

```
additionalCashRequired =
    ((pgIncluded AND NOT pgFeeCapitalised) ? pgFeeAmount : 0)
    + (NOT purchaseCostsCapitalised ? purchaseCostsAmount : 0)
    + ((endDebt = 0 AND NOT bridgingFeesCapitalised) ? bridgingFeesNoEndDebtPercent × bridgeDebt : 0)
    + ((endDebt > 0 AND NOT bridgingFeesCapitalised) ? bridgingFeesEndDebtAmount : 0)

```

### 4.7.3 Peak Debt LVR (Excluding ICAP)

```
peakDebtLvrExclIcap = (bridgeDebt + endDebt) / peakShadedValuation

```

### 4.7.4 Peak Debt LVR (Including ICAP)

```
peakDebtLvrInclIcap = peakDebtIncludingIcap / peakShadedValuation

```

### 4.7.5 End Debt LVR

```
endDebtLvr = endDebt / newPropertyValue

```

### 4.7.6 Check Value (Convergence Verification)

```
checkValue = endDebt + bridgeDebtExcludingFcap - peakDebtBeforeCap + shortfall

```

This value SHOULD be approximately 0 when calculations are correct.

## 5. Validation Requirements

### 5.1 Input Validation

### 5.1.1 Real-time Validation

- Numeric fields accept only numbers
- Percentage fields 0-100 range
- Currency fields non-negative
- Immediate feedback on invalid input

### 5.1.2 Business Rule Validation

- Existing debt <= Property value
- Minimum loan < Maximum loan
- Bridging term 1-12 months
- All required fields completed

### 5.1.3 Error Messages

- Clear, specific error descriptions
- Field-level error display
- Summary error notification
- Guidance on resolution

### 5.2 Test Case Validation

### 5.2.1 Expected Value Comparison

- Support for 20 output fields
- Tolerance levels:
    - Currency: ±$0.01
    - Percentage: ±0.0001 (0.01%)
- Visual pass/fail indicators

### 5.2.2 Validation Process

1. User enters expected values
2. System compares with calculated
3. Visual feedback per field
4. Summary results display

### 5.3 Calculation Validation

### 5.3.1 Convergence Monitoring

- Track iteration count
- Verify convergence achieved
- Warning if max iterations reached
- Check value verification

### 5.3.2 Boundary Conditions

- Handle zero values appropriately
- Respect min/max constraints
- Prevent infinite loops
- Handle edge cases

## 6. Technical Requirements

### 6.1 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- No Internet Explorer support

### 6.2 Performance Requirements

- Calculation time < 100ms
- Smooth UI animations
- No blocking during iteration
- Responsive during calculation

### 6.3 Code Architecture

### 6.3.1 TypeScript Patterns

- Strong typing throughout
- Interface definitions
- Type guards where needed
- Proper error handling

### 6.3.2 Design Patterns

- Separation of Concerns
- Dependency Injection
- Configuration Object
- Observer Pattern (UI updates)

### 6.3.3 Code Quality

- No magic numbers
- Self-documenting code
- Comprehensive comments
- Consistent naming

### 6.4 Deployment Requirements

### 6.4.1 Single File Deployment

- All code in one HTML file
- No external dependencies
- Self-contained styles
- Embedded TypeScript/JavaScript

### 6.4.2 Offline Capability

- Fully functional offline
- No API calls required
- Local calculation only
- No data persistence

## 7. Testing Requirements

### 7.1 Test Coverage

### 7.1.1 Unit Testing

- All calculation methods
- Input validation logic
- Format functions
- Edge cases

### 7.1.2 Integration Testing

- UI to Engine flow
- Complete calculations
- Error handling paths
- Configuration changes

### 7.1.3 Test Cases

- 8 comprehensive scenarios
- Edge cases covered
- Accuracy target: 98%+
- Known issues documented

### 7.2 Test Data Format

### 7.2.1 CSV Structure

- Column A: Field name
- Column B: Cell reference
- Columns C-J: Test cases
- Headers for identification

### 7.2.2 Expected Results

- All 20 output fields
- Precise values provided
- Tolerance specified
- Pass/fail criteria

## 8. Documentation Requirements

### 8.1 Code Documentation

### 8.1.1 Inline Comments

- Complex logic explained
- Formula references
- Business rule rationale
- Edge case handling

### 8.1.2 Function Documentation

- Purpose statement
- Parameter descriptions
- Return value details
- Example usage

### 8.2 User Documentation

### 8.2.1 Field Descriptions

- Purpose of each input
- Valid value ranges
- Impact on calculations
- Common scenarios

### 8.2.2 Calculation Guide

- Overview of process
- Key formulas explained
- Iteration logic
- Result interpretation

## 9. Future Enhancement Considerations

### 9.1 Planned Features

- Multiple calculation scenarios
- Comparison mode
- PDF report generation
- Data import/export
- Historical tracking

### 9.2 Architecture Extensibility

- Plugin system design
- API endpoint ready
- Multi-language support
- Theme customization
- Advanced analytics

### 9.3 Integration Possibilities

- CRM systems
- Loan origination systems
- Property valuation APIs
- Document management
- Regulatory reporting

## 10. Compliance and Regulatory Requirements

### 10.1 Financial Calculations

- Accurate to 2 decimal places
- Consistent rounding rules
- Audit trail capability
- Transparent formulas

### 10.2 Data Privacy

- No data storage
- No external transmission
- Local calculation only
- User control maintained

### 10.3 Accessibility Compliance

- WCAG 2.1 AA standard
- Keyboard navigation
- Screen reader support
- High contrast mode

## 11. Glossary

- **Bridge Debt**: Short-term financing to bridge the gap between property purchase and sale
- **End Debt**: Long-term financing remaining after existing property sale
- **FCAP**: Fee Capitalization - adding fees to loan amount
- **ICAP**: Interest Capitalization - adding interest to loan balance
- **LVR**: Loan-to-Value Ratio - loan amount as percentage of property value
- **COS**: Contract of Sale - signed agreement for property sale
- **Shading**: Conservative discount applied to property valuations
- **Peak Debt**: Maximum total debt during the bridging period

---

This comprehensive requirements specification provides complete documentation for the Bridge and End Debt Calculator implementation, ensuring all business rules, technical requirements, and user experience considerations are thoroughly defined and traceable to the implementation.