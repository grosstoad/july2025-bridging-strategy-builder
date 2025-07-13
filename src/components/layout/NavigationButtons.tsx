// Navigation buttons component for consistent navigation

import { Box, Button } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface NavigationButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export const NavigationButtons = ({
  onNext,
  onBack,
  nextDisabled = false,
  backDisabled = false,
  nextLabel = 'Next',
  backLabel = 'Back'
}: NavigationButtonsProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
      {onBack && (
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={backDisabled}
          startIcon={<ArrowBack />}
        >
          {backLabel}
        </Button>
      )}
      <Box sx={{ flex: 1 }} />
      {onNext && (
        <Button
          variant="contained"
          onClick={onNext}
          disabled={nextDisabled}
          endIcon={<ArrowForward />}
          disableElevation
        >
          {nextLabel}
        </Button>
      )}
    </Box>
  );
};