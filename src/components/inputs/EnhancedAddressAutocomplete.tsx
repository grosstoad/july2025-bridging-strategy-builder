 // Enhanced address autocomplete component that supports both property addresses and suburbs

import { Autocomplete, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { LocationOn, Home } from '@mui/icons-material';
import { useEnhancedAddressSearch, EnhancedSearchResult } from '../../hooks/useEnhancedAddressSearch';

export interface AddressSelection {
  type: 'address';
  propertyId: string;
  address: string;
  displayAddress: string;
}

export interface SuburbSelection {
  type: 'suburb';
  suburb: string;
  state: string;
  postcode: string;
  displayName: string;
}

export type SearchSelection = AddressSelection | SuburbSelection;

interface EnhancedAddressAutocompleteProps {
  onSelect: (selection: SearchSelection | null) => void;
  label?: string;
  placeholder?: string;
}

export const EnhancedAddressAutocomplete = ({
  onSelect,
  label = 'Search for a property address or suburb',
  placeholder = 'Enter address, suburb or postcode'
}: EnhancedAddressAutocompleteProps) => {
  const {
    results,
    isLoading,
    error,
    searchAddresses
  } = useEnhancedAddressSearch();

  const handleOptionSelect = (option: EnhancedSearchResult | null) => {
    if (!option) {
      onSelect(null);
      return;
    }

    console.log('Selected option:', { type: option.type, data: option.data, displayText: option.displayText });

    if (option.type === 'property') {
      const propertyData = option.data as any;
      const selection: AddressSelection = {
        type: 'address',
        propertyId: propertyData?.propertyId ? String(propertyData.propertyId) : '',
        address: propertyData?.fullAddress || option.displayText,
        displayAddress: option.displayText
      };
      onSelect(selection);
      console.log('Selected property:', selection);
    } else if (option.type === 'suburb') {
      const suburbData = option.data as any;
      // Extract suburb name from displayText if not in data
      const displayParts = option.displayText.split(',');
      const suburbName = suburbData?.name || displayParts[0]?.trim() || '';
      const statePostcode = displayParts[1]?.trim() || '';
      const stateParts = statePostcode.split(' ');
      
      const selection: SuburbSelection = {
        type: 'suburb',
        suburb: suburbName,
        state: suburbData?.state || stateParts[0] || '',
        postcode: suburbData?.postcode || stateParts[1] || '',
        displayName: option.displayText
      };
      onSelect(selection);
      console.log('Selected suburb:', selection);
    }
  };

  return (
    <Autocomplete
      options={results}
      getOptionLabel={(option) => option.displayText}
      isOptionEqualToValue={(option, value) => 
        option.displayText === value.displayText && option.type === value.type
      }
      onChange={(_, option) => handleOptionSelect(option)}
      onInputChange={(_, value, reason) => {
        if (reason === 'input') {
          searchAddresses(value);
        }
      }}
      loading={isLoading}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {option.type === 'property' ? (
              <Home sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
            ) : (
              <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1">
                {option.displayText}
              </Typography>
              {option.secondaryText && (
                <Typography variant="caption" color="text.secondary">
                  {option.secondaryText}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={error || (results.length === 0 && !isLoading ? 'Start typing to search for addresses or suburbs' : '')}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={{ width: '100%' }}
    />
  );
};