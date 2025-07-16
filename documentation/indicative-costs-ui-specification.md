# Indicative Costs UI Specification

## 1. **Component Overview**

The "Indicative costs" section is a collapsible (Accordion) card that displays and allows editing of key transaction costs for each property strategy scenario. It includes:

- **Currency input fields** for each cost type, formatted with comma separators (e.g., $10,000).
- **Pre-filled default values** for each scenario, with special handling for "Sell First, Buy Later" (SBYB).
- **Total costs** dynamically calculated as the sum of all visible fields.
- **Info tooltips** for each cost type.
- **Accordion** behavior to expand/collapse the section.

---

## 2. **Scenarios and Default Values**

There are four scenarios, left to right as shown in your screenshot:

| Scenario Name                | Moving Costs | Selling Costs | Stamp Duty | Bridging Costs | Total Costs |
|------------------------------|--------------|---------------|------------|---------------|-------------|
| 1. Buy First, Sell Later (BBYS) | $10,000      | $20,000       | $40,000    | $35,000       | $105,000    |
| 2. Sell First, Buy Later (SBYB) | $50,000      | $20,000       | $40,000    | $0            | $110,000    |
| 3. Buy and Keep (KB)            | $10,000      | $0            | $40,000    | $0            | $50,000     |
| 4. Settle Same Day (SS)         | $10,000      | $20,000       | $40,000    | $0            | $70,000     |

**Special Rule:**  
- For SBYB (Sell First, Buy Later), the default for "Moving costs" is $50,000 (5x the other scenarios).

---

## 3. **Detailed Interactions**

### a. **Accordion Behavior**
- The section is collapsed by default; clicking the header expands it to show all cost fields and the total.
- Only one scenario's costs are visible at a time if using a single accordion, or all are visible if each scenario is a separate card.

### b. **Currency Input Fields**
- Each cost type is an editable input field.
- Inputs are formatted as currency with comma separators as the user types (e.g., entering "10000" becomes "$10,000").
- Only positive integers are allowed; empty fields default to $0.
- On blur or enter, the value is validated and formatted.

### c. **Pre-filled Defaults**
- On initial render, each scenario's fields are pre-filled with the values shown above.
- If the user changes a value, it updates the total in real time.

### d. **Total Costs Calculation**
- The "Total costs" field is a read-only display.
- It is the sum of all visible cost fields for that scenario.
- Updates instantly as any input changes.

### e. **Tooltips**
- Each cost label has an info icon.
- Hovering or clicking shows a brief explanation (e.g., "Estimated cost to move your belongings").

---

## 4. **Calculation Logic**

- **Total Costs** = Moving Costs + Selling Costs + Stamp Duty + Bridging Costs
- All values are treated as numbers (defaulting to 0 if empty).
- The calculation is performed on every change to any input field.

---

## 5. **Accessibility & Usability Enhancements**

- All inputs are keyboard accessible.
- Tooltips are accessible via keyboard and screen readers.
- Inputs have clear labels and aria attributes for accessibility.
- Error handling for invalid input (e.g., negative numbers, non-numeric input).

---

## 6. **Scalability & Maintainability Suggestions**

- **Componentization:** Each scenario can be a reusable `IndicativeCostsCard` component, receiving props for defaults and scenario type.
- **Config-driven Defaults:** Store default values in a config object keyed by scenario, making it easy to update or add scenarios.
- **Validation Logic:** Centralize input validation and formatting logic for consistency.
- **Unit Tests:** Add tests for calculation logic and input formatting.

---

## 7. **Potential Improvements / Next Steps**

- **Dynamic Defaults:** Allow admin/config to update default values without code changes.
- **Scenario Explanation:** Add a short description under each scenario title to help users understand the context.
- **Cost Breakdown Modal:** Allow users to click for a more detailed explanation of each cost type.
- **Responsive Design:** Ensure the layout works well on mobile and tablet.
- **User Guidance:** Add inline validation messages or helper text for common mistakes (e.g., "Please enter a valid amount").

---

## 8. **Summary Table for Developers**

| Scenario Key | Moving Costs | Selling Costs | Stamp Duty | Bridging Costs | Notes                        |
|--------------|-------------|--------------|------------|---------------|------------------------------|
| BBYS         | 10,000      | 20,000       | 40,000     | 35,000        | Standard defaults            |
| SBYB         | 50,000      | 20,000       | 40,000     | 0             | Moving costs = 5x others     |
| KB           | 10,000      | 0            | 40,000     | 0             | No selling or bridging costs |
| SS           | 10,000      | 20,000       | 40,000     | 0             | No bridging costs            |

---

## 9. **Component Structure Recommendations**

### Currency Input Component
```typescript
interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}
```

### Indicative Costs Card Component
```typescript
interface IndicativeCostsProps {
  scenarioType: 'BBYS' | 'SBYB' | 'KB' | 'SS';
  scenarioTitle: string;
  initialValues?: {
    movingCosts: number;
    sellingCosts: number;
    stampDuty: number;
    bridgingCosts: number;
  };
  onCostsChange?: (costs: CostBreakdown) => void;
}
```

### Cost Configuration
```typescript
const COST_DEFAULTS = {
  BBYS: { movingCosts: 10000, sellingCosts: 20000, stampDuty: 40000, bridgingCosts: 35000 },
  SBYB: { movingCosts: 50000, sellingCosts: 20000, stampDuty: 40000, bridgingCosts: 0 },
  KB: { movingCosts: 10000, sellingCosts: 0, stampDuty: 40000, bridgingCosts: 0 },
  SS: { movingCosts: 10000, sellingCosts: 20000, stampDuty: 40000, bridgingCosts: 0 }
};
``` 