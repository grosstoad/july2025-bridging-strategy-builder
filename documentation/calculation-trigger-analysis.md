# Calculation trigger analysis: Manual button vs. real-time

## Current implementation (Calculate button)

### Pros

1. **Performance optimization**
   - Avoids unnecessary calculations during data entry
   - Reduces CPU usage, especially important for complex iterative calculations
   - Better for mobile devices with limited processing power

2. **User control**
   - Users can review all inputs before calculating
   - Reduces confusion from intermediate/invalid states
   - Clear separation between input and results phases

3. **Error handling**
   - Can validate all inputs before calculation
   - Single point of failure easier to communicate
   - Users won't see errors from partially completed forms

4. **Analytics clarity**
   - Clear intent signal when user clicks "Calculate"
   - Can track abandoned vs. completed calculations
   - Better measurement of genuine interest

### Cons

1. **Extra user action required**
   - May feel less responsive/modern
   - Users might forget to click calculate after changes
   - Potential for viewing outdated results

2. **Cognitive load**
   - Users must remember to recalculate
   - Possible confusion if results don't match current inputs

## Alternative: Real-time calculation

### Pros

1. **Immediate feedback**
   - Users see impact of changes instantly
   - More interactive and engaging experience
   - No risk of viewing stale results

2. **Modern UX pattern**
   - Expected behavior in many financial calculators
   - Feels more responsive and dynamic
   - Better for exploratory "what-if" scenarios

3. **Reduced clicks**
   - One less action for users
   - Smoother workflow

### Cons

1. **Performance impact**
   - Continuous calculations during typing
   - Need debouncing (adds complexity)
   - May cause UI lag on slower devices

2. **Incomplete state issues**
   - Shows errors/warnings during normal data entry
   - May calculate with invalid intermediate values
   - Convergence failures more visible

3. **Analytics noise**
   - Many partial/incomplete calculations tracked
   - Harder to distinguish serious usage from exploration
   - Increased event volume

## Hybrid approach recommendation

```typescript
// Debounced auto-calculation with visual indicators
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

const debouncedCalculate = useMemo(
  () => debounce((inputs: BridgingInputs) => {
    if (validateInputs(inputs)) {
      calculateBridging(inputs);
      setHasUnsavedChanges(false);
    }
  }, 1000),
  []
);

const handleInputChange = (field: string, value: any) => {
  const newInputs = { ...inputs, [field]: value };
  setInputs(newInputs);
  setHasUnsavedChanges(true);
  debouncedCalculate(newInputs);
};
```

## Analytics impact

### Current approach (button click)

```javascript
// Clear, intentional events
posthog.capture('bridging_calculation_performed', {
  calculation_id: uuid(),
  trigger: 'manual_button_click',
  inputs: sanitizedInputs,
  outputs: results,
  time_since_last_change_ms: timeSinceLastEdit
});
```

### Real-time approach

```javascript
// Need to filter noise
posthog.capture('bridging_calculation_performed', {
  calculation_id: uuid(),
  trigger: 'auto_input_change',
  is_complete_form: allFieldsValid,
  calculation_number: sessionCalculationCount++,
  time_since_last_calc_ms: timeSinceLastCalc,
  changed_field: lastChangedField
});

// Additional event for "stable" calculations
if (noChangesForXSeconds) {
  posthog.capture('bridging_calculation_stabilized', {
    final_inputs: inputs,
    total_iterations_in_session: sessionCalculationCount
  });
}
```

## Recommendations

1. **For this use case**, keep the calculate button because:
   - Complex iterative calculations benefit from explicit triggers
   - Financial decisions need deliberate actions
   - Cleaner analytics for measuring genuine intent

2. **Enhance current implementation with:**
   - Visual indicator when inputs have changed
   - Auto-calculate option in settings
   - Keyboard shortcut (Ctrl+Enter) to calculate
   - Warning if viewing outdated results

3. **Analytics tracking:**
   - Track both calculation attempts and completions
   - Measure time between input changes and calculation
   - Monitor convergence success rates
   - Track which fields are changed most frequently post-calculation

## Implementation considerations

### Visual feedback for stale results

```typescript
const [inputsChangedSinceCalc, setInputsChangedSinceCalc] = useState(false);

// In the UI
{results && inputsChangedSinceCalc && (
  <Alert severity="warning" sx={{ mb: 2 }}>
    Inputs have changed. Click Calculate to update results.
  </Alert>
)}
```

### Performance monitoring

```typescript
// Track calculation performance
const startTime = performance.now();
const results = engine.calculate(inputs);
const calculationTime = performance.now() - startTime;

posthog.capture('bridging_calculation_performance', {
  calculation_time_ms: calculationTime,
  iterations_required: results.iterations,
  converged: results.converged,
  device_type: getDeviceType()
});
```

### User preference storage

```typescript
// Allow users to opt into auto-calculation
interface UserPreferences {
  autoCalculate: boolean;
  debounceDelay: number;
  showDetailedLogs: boolean;
}

const preferences = localStorage.getItem('bridgingCalcPreferences');
```