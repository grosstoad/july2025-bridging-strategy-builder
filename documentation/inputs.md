# Inputs

## Input types overview

- Checkbox input
- Currency input
- Number input
- Percentage input
- Radio input
- Range/slider input
- Select input
- Text input

## Architecture

### Base input component examples

#### Text input

```typescript
// InputText.tsx
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface InputTextProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>;
  control: Control<T>;
  error?: boolean;
  helperText?: string;
}

export const InputText = <T extends FieldValues>({
  name,
  control,
  error,
  helperText,
  ...props
}: InputTextProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...props}
          error={error}
          helperText={helperText}
          fullWidth
          variant="outlined"
        />
      )}
    />
  );
};
```

#### Number input

```typescript
// InputNumber.tsx
import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface InputNumberProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>;
  control: Control<T>;
  error?: boolean;
  helperText?: string;
}

export const InputNumber = <T extends FieldValues>({
  name,
  control,
  error,
  helperText,
  ...props
}: InputNumberProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        {...props}
        type="number"
        error={error}
        helperText={helperText}
        fullWidth
        variant="outlined"
      />
    )}
  />
);
```

#### Currency input

```typescript
// InputCurrency.tsx
import { TextField, InputAdornment } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';

interface InputCurrencyProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>;
  control: Control<T>;
  error?: boolean;
  helperText?: string;
}

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const InputCurrency = <T extends FieldValues>({
  name,
  control,
  error,
  helperText,
  ...props
}: InputCurrencyProps<T>) => {
  const [displayValue, setDisplayValue] = useState('');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        useEffect(() => {
          if (field.value !== undefined && field.value !== '') {
            setDisplayValue(currencyFormatter.format(field.value));
          } else {
            setDisplayValue('');
          }
        }, [field.value]);

        return (
          <TextField
            {...field}
            {...props}
            value={displayValue}
            onChange={(event) => {
              const numericValue = event.target.value.replace(/[^0-9]/g, '');
              const parsedValue = numericValue ? parseInt(numericValue, 10) : '';
              field.onChange(parsedValue);
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              ...props.InputProps
            }}
            error={error}
            helperText={helperText}
            fullWidth
            variant="outlined"
          />
        );
      }}
    />
  );
};
```

#### Percentage input

```typescript
// InputPercentage.tsx
import { TextField, InputAdornment, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface InputPercentageProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>;
  control: Control<T>;
  error?: boolean;
  helperText?: string;
}

export const InputPercentage = <T extends FieldValues>({
  name,
  control,
  error,
  helperText,
  ...props
}: InputPercentageProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        {...props}
        type="number"
        inputProps={{ step: 0.01 }}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        error={error}
        helperText={helperText}
        fullWidth
        variant="outlined"
      />
    )}
  />
);
```

#### Select input

```typescript
// InputSelect.tsx
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import type { SelectProps } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface InputSelectProps<T extends FieldValues> extends Omit<SelectProps, 'name'> {
  name: Path<T>;
  control: Control<T>;
  options: { value: string; label:string }[];
  label: string;
  error?: boolean;
  helperText?: string;
}

const InputSelect = <T extends FieldValues>({
  name,
  control,
  options,
  label,
  error,
  helperText,
  ...props
}: InputSelectProps<T>) => (
  <FormControl fullWidth error={error} variant="outlined">
    <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          {...props}
          labelId={`${name}-select-label`}
          label={label}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);
```

#### Radio input

```typescript
// InputRadio.tsx
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface InputRadioProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: { value: string; label: string }[];
  label: string;
  error?: boolean;
  helperText?: string;
}

const InputRadio = <T extends FieldValues>({
  name,
  control,
  options,
  label,
  error,
  helperText
}: InputRadioProps<T>) => (
  <FormControl error={error}>
    <FormLabel sx={{mb: 1}}>{label}</FormLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <RadioGroup {...field} sx={{ 
          flexDirection: {xs: 'column', sm: 'row'},
          gap: { xs: 1, sm: 2 },
        }}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
              sx={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'grey.400',
                borderRadius: 2,
                flex: 1,
                m: 0,
                pr: 2,
                py: '6px'
              }}
            />
          ))}
        </RadioGroup>
      )}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);
```

#### Checkbox input (multi-select)

```typescript
// InputCheckbox.tsx
import { FormGroup, FormControlLabel, Checkbox, FormControl, FormLabel, FormHelperText } from '@mui/material';
import type { Control, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface InputCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: { value: string; label: string }[];
  label: string;
  error?: boolean;
  helperText?: string;
}

const InputCheckbox = <T extends FieldValues>({
  name,
  control,
  options,
  label,
  error,
  helperText
}: InputCheckboxProps<T>) => (
  <FormControl error={error} component="fieldset">
    <FormLabel component="legend" sx={{mb: 1}}>{label}</FormLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormGroup sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: { xs: 1, sm: 2 },
        }}>
          {options.map((option) => (
            <FormControlLabel
              sx={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'grey.400',
                borderRadius: 2,
                m: 0,
                pr: 2,
                py: '6px'
              }}
              key={option.value}
              control={
                <Checkbox
                  checked={Array.isArray(field.value) ? field.value.includes(option.value) : false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newValue = Array.isArray(field.value) ? [...field.value] : [];
                    if (checked) {
                      newValue.push(option.value);
                    } else {
                      newValue = newValue.filter((v) => v !== option.value);
                    }
                    field.onChange(newValue);
                  }}
                />
              }
              label={option.label}
            />
          ))}
        </FormGroup>
      )}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);
```

#### Range/slider input

```typescript
// InputSlider.tsx
import { Slider, FormControl, FormLabel, FormHelperText } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface InputSliderProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  min: number;
  max: number;
  step?: number;
  error?: boolean;
  helperText?: string;
}

const InputSlider = <T extends FieldValues>({
  name,
  control,
  label,
  min,
  max,
  step = 1,
  error,
  helperText
}: InputSliderProps<T>) => (
  <FormControl error={error} fullWidth>
    <FormLabel>{label}</FormLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Slider
          {...field}
          value={field.value || min}
          onChange={(_, value) => field.onChange(value)}
          min={min}
          max={max}
          step={step}
          valueLabelDisplay="auto"
        />
      )}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);
```

### Domain-specific input examples

#### InputPostcode (text)

```typescript
import { InputText } from './base/InputText';
import { Control, FieldValues } from 'react-hook-form';

interface InputPostcodeProps<T extends FieldValues> {
  control: Control<T>;
  error?: boolean;
  helperText?: string;
}

const InputPostcode = <T extends FieldValues>({
  control,
  error,
  helperText
}: InputPostcodeProps<T>) => (
  <InputText
    name="postcode"
    control={control}
    error={error}
    helperText={helperText}
    label="Postcode"
    inputProps={{
      'aria-label': 'Postcode input field',
      maxLength: 8,
      pattern: '[A-Za-z0-9 ]*'
    }}
  />
);
```

#### InputPropertyValue (currency)

```typescript
import { InputCurrency } from './base/InputCurrency';
import { Control, FieldValues } from 'react-hook-form';

interface InputPropertyValueProps<T extends FieldValues> {
  control: Control<T>;
  error?: boolean;
  helperText?: string;
}

const InputPropertyValue = <T extends FieldValues>({
  control,
  error,
  helperText
}: InputPropertyValueProps<T>) => (
  <InputCurrency
    name="propertyValue"
    control={control}
    error={error}
    helperText={helperText}
    label="Property value"
    inputProps={{ 'aria-label': 'Property value input field' }}
  />
);
```

#### InputCurrentInterestRate (percentage)

```typescript
import { InputPercentage } from './base/InputPercentage';
import { Control, FieldValues } from 'react-hook-form';

interface InputCurrentInterestRateProps<T extends FieldValues> {
  control: Control<T>;
  error?: boolean;
  helperText?: string;
}

const InputCurrentInterestRate = <T extends FieldValues>({
  control,
  error,
  helperText
}: InputCurrentInterestRateProps<T>) => (
  <InputPercentage
    name="currentInterestRate"
    control={control}
    error={error}
    helperText={helperText}
    label="Current interest rate"
    inputProps={{ 'aria-label': 'Current interest rate input field' }}
  />
);
```

#### InputInterestRateType (select)

```typescript
import { InputSelect } from './base/InputSelect';
import { Control, FieldValues } from 'react-hook-form';

interface InputInterestRateTypeProps<T extends FieldValues> {
  control: Control<T>;
  error?: boolean;
  helperText?: string;
}

export const interestRateTypeOptions = [
  { value: 'variable', label: 'Variable' },
  { value: 'fixed', label: 'Fixed' }
];

const InputInterestRateType = <T extends FieldValues>({
  control,
  error,
  helperText
}: InputInterestRateTypeProps<T>) => (
  <InputSelect
    name="interestRateType"
    control={control}
    options={interestRateTypeOptions}
    label="Interest rate type"
    error={error}
    helperText={helperText}
    inputProps={{ 'aria-label': 'Interest rate type input field' }}
  />
);
```

#### InputPropertyType (radio)

```typescript
import { InputRadio } from './base/InputRadio';
import { Control, FieldValues } from 'react-hook-form';

interface InputPropertyTypeProps<T extends FieldValues> {
  control: Control<T>;
  error?: boolean;
  helperText?: string;
}

export const propertyTypeOptions = [
  { value: 'house', label: 'House' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'apartment', label: 'Apartment' }
];

const InputPropertyType = <T extends FieldValues>({
  control,
  error,
  helperText
}: InputPropertyTypeProps<T>) => (
  <InputRadio
    name="propertyType"
    control={control}
    options={propertyTypeOptions}
    label="Property type"
    error={error}
    helperText={helperText}
  />
);
```

#### InputRefinanceGoals (checkbox, multi-select)

```typescript
import { InputCheckbox } from './base/InputCheckbox';
import { Control, FieldValues } from 'react-hook-form';

interface InputRefinanceGoalsProps<T extends FieldValues> {
  control: Control<T>;
  error?: boolean;
  helperText?: string;
}

export const refinanceGoalOptions = [
  { value: 'payFaster', label: 'Pay my loan down faster' },
  { value: 'freeUpMoney', label: 'Free up some money now' },
  { value: 'unhappy', label: 'Unhappy with my current loan' },
  { value: 'lockInRate', label: 'Lock in my rate' },
  { value: 'flexible', label: 'Flexible rate and repayments' },
  { value: 'cashOut', label: 'Borrow from equity or cash out' }
];

const InputRefinanceGoals = <T extends FieldValues>({
  control,
  error,
  helperText
}: InputRefinanceGoalsProps<T>) => (
  <InputCheckbox
    name="refinanceGoals"
    control={control}
    options={refinanceGoalOptions}
    label="Refinance Goals"
    error={error}
    helperText={helperText}
  />
);
```

#### InputLoanTermRemaining (range/slider)

```typescript
import { InputSlider } from './base/InputSlider';
import { Control, FieldValues } from 'react-hook-form';

interface InputLoanTermRemainingProps<T extends FieldValues> {
  control: Control<T>;
  error?: boolean;
  helperText?: string;
}

const InputLoanTermRemaining = <T extends FieldValues>({
  control,
  error,
  helperText
}: InputLoanTermRemainingProps<T>) => (
  <InputSlider
    name="loanTermRemaining"
    control={control}
    label="Loan Term Remaining (years)"
    min={1}
    max={40}
    error={error}
    helperText={helperText}
  />
);
```

# Form state management

## Overview

- Input components
- Form state management
- Persistent storage integration

## Architecture

### Form storage context

To manage form state persistence and cross-tab synchronization, we'll use a combination of React Context and a custom provider. This encapsulates the storage logic, providing a clean API for our form components.

```typescript
// src/contexts/FormStorageContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Utility functions for JSON serialization
const stringify = <T,>(object: T): string => JSON.stringify(object);
const parse = <T,>(string: string): T | null => {
  try {
    return JSON.parse(string);
  } catch (error) {
    console.error("Error parsing JSON from storage", error);
    return null;
  }
};

// Define the shape of the context
interface FormStorageContextType<T> {
  formState: T;
  setFormState: (newState: T) => void;
}

// Create the context with a null default value
const FormStorageContext = createContext<FormStorageContextType<any> | null>(null);

// Define props for the provider
interface FormStorageProviderProps<T> {
  children: ReactNode;
  storageKey: string;
  initialState: T;
}

export const FormStorageProvider = <T,>({
  children,
  storageKey,
  initialState,
}: FormStorageProviderProps<T>) => {
  // Initialize state, attempting to retrieve from sessionStorage first
  const [formState, setFormState] = useState<T>(() => {
    const storedState = sessionStorage.getItem(storageKey);
    return storedState ? parse(storedState) ?? initialState : initialState;
  });

  // Effect to update sessionStorage when formState changes
  useEffect(() => {
    const currentStateInStorage = sessionStorage.getItem(storageKey);
    const newStateString = stringify(formState);

    // Only update storage if the state has actually changed
    if (newStateString !== currentStateInStorage) {
      sessionStorage.setItem(storageKey, newStateString);
    }
  }, [formState, storageKey]);

  // Effect to listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue) {
        const newState = parse<T>(event.newValue);
        if (newState && stringify(newState) !== stringify(formState)) {
          setFormState(newState);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [storageKey, formState]);

  return (
    <FormStorageContext.Provider value={{ formState, setFormState }}>
      {children}
    </FormStorageContext.Provider>
  );
};

// Custom hook for consuming the context
export const useFormStorage = <T,>() => {
  const context = useContext(FormStorageContext as React.Context<FormStorageContextType<T>>);
  if (!context) {
    throw new Error('useFormStorage must be used within a FormStorageProvider');
  }
  return context;
};
```

### Form implementation with storage context

Here's how to implement a form that persists its state using the `FormStorageProvider` and `useFormStorage` hook.

```typescript
// RefinanceForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InputPostcode } from './InputPostcode';
import { InputPropertyValue } from './InputPropertyValue';
import type { ComprehensiveFormValues } from './types/form';
import { FormStorageProvider, useFormStorage } from '../contexts/FormStorageContext';

const formSchema = z.object({
  postcode: z.string().min(4, 'Postcode must be at least 4 characters'),
  propertyValue: z.number().min(0, 'Property value must be positive'),
  // ... other validations
});

const defaultFormValues: ComprehensiveFormValues = {
  postcode: '',
  propertyValue: 0,
  // ... other default values
};

const STORAGE_KEY = 'refinance-form';

// The actual form component
const RefinanceFormContents = () => {
  const { formState, setFormState } = useFormStorage<ComprehensiveFormValues>();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ComprehensiveFormValues>({
    defaultValues: formState,
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  // Update form when context state changes (e.g., from another tab)
  useEffect(() => {
    reset(formState);
  }, [formState, reset]);

  // Update context when form values change
  useEffect(() => {
    const subscription = watch((values) => {
      setFormState(values as ComprehensiveFormValues);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormState]);

  const onSubmit = (data: ComprehensiveFormValues) => {
    // The context is already updated on change, so we just log here.
    // Additional submission logic would go here.
    console.log('Form submitted:', data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        <InputPostcode
          control={control}
          error={!!errors.postcode}
          helperText={errors.postcode?.message}
        />
        <InputPropertyValue
          control={control}
          error={!!errors.propertyValue}
          helperText={errors.propertyValue?.message}
        />
        <Button
          type="submit"
          variant="contained"
          disableElevation
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

// A wrapper component to provide the context
const RefinanceForm = () => (
  <FormStorageProvider<ComprehensiveFormValues>
    storageKey={STORAGE_KEY}
    initialState={defaultFormValues}
  >
    <RefinanceFormContents />
  </FormStorageProvider>
);
```

### Key features of the storage integration

- **Centralized State**: Form state is managed within a React Context, providing a single source of truth.
- **Automatic State Persistence**: Form values are automatically saved to `sessionStorage`.
- **Cross-tab Synchronization**: Changes in one browser tab are automatically reflected in other tabs.
- **Type Safety**: The provider and hook maintain type safety with TypeScript generics.
- **Performance Optimized**: Data is only written to storage when it actually changes.

### Best practices

- **Storage Key Naming**: Use unique, descriptive keys for different forms.
- **Initial State**: Always provide a sensible initial state object.
- **Separation**: Keep the provider and the form content separate. This ensures the form and its children can cleanly access the context.
- **Validation**: Implement form validation (e.g., with Zod) to ensure data integrity before it's used.
