import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Autocomplete, 
  Box, 
  Typography, 
  CircularProgress,
  InputAdornment,
  Chip
} from '@mui/material';
import { LocationOn as LocationOnIcon } from '@mui/icons-material';
import { useAddressSuggestions } from '../../hooks/useAddressSuggestions';
import { AddressSuggestion } from '../../types/proptrack';

interface AddressAutocompleteProps {
  placeholder?: string;
  onAddressSelect?: (address: AddressSuggestion) => void;
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  placeholder = "Enter your current property address to get started",
  onAddressSelect,
  value = '',
  onChange,
  error = false,
  helperText
}) => {
  const [inputValue, setInputValue] = useState(value);
  const { suggestions, isLoading, error: apiError, searchAddresses, clearSuggestions, isUsingMockData } = useAddressSuggestions();


  // Update input value when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Trigger search when input value changes
  useEffect(() => {
    searchAddresses(inputValue);
  }, [inputValue, searchAddresses]);

  const handleInputChange = (event: React.SyntheticEvent, newValue: string) => {
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleAddressSelect = (event: React.SyntheticEvent, newValue: AddressSuggestion | null) => {
    if (newValue) {
      setInputValue(newValue.address.fullAddress);
      onChange?.(newValue.address.fullAddress);
      onAddressSelect?.(newValue);
      clearSuggestions();
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {isUsingMockData && suggestions.length > 0 && (
        <Chip 
          label="Demo data" 
          size="small" 
          color="info"
          sx={{ 
            position: 'absolute', 
            top: -10, 
            right: 0, 
            zIndex: 1,
            fontSize: '0.75rem'
          }}
        />
      )}
      <Autocomplete
        options={suggestions}
        getOptionLabel={(option) => option.address.fullAddress}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleAddressSelect}
        loading={isLoading}
        loadingText="Searching addresses..."
        noOptionsText={inputValue.length < 3 ? "Type at least 3 characters" : "No addresses found"}
        filterOptions={(x) => x} // Don't filter - we handle this server-side
        renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          error={error}
          helperText={helperText || apiError}
          fullWidth
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {isLoading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.paper',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              },
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <LocationOnIcon sx={{ color: '#F43F5E', mr: 1 }} />
            <Box>
              <Typography variant="body1">
                {option.address.fullAddress}
              </Typography>
              {option.propertyId && (
                <Typography variant="caption" color="text.secondary">
                  Property ID: {option.propertyId}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
      />
    </Box>
  );
};