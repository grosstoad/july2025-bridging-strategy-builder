import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CurrentPropertyPage } from './pages/CurrentPropertyPage';
import { TargetPropertyPage } from './pages/TargetPropertyPage';
import { AboutYouPage } from './pages/AboutYouPage';
import { BridgingCalculator } from './pages/BridgingCalculator';
import { PropertyStrategyPlayback } from './pages/PropertyStrategyPlayback';
import { TestBridgingCalculator } from './pages/TestBridgingCalculator';
import { PropertyProvider } from './contexts/PropertyContext';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    button: {
      textTransform: 'none',
    },
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
  palette: {
    primary: {
      main: '#9c27b0',
      dark: '#7b1fa2',
    },
    secondary: {
      main: '#9c27b0',
      dark: '#7b1fa2',
    },
    background: {
      default: '#fafafa',
    },
  },
});

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <PropertyProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/current-property/:propertyId" element={<CurrentPropertyPage />} />
            <Route path="/current-property" element={<CurrentPropertyPage />} />
            <Route path="/target-property" element={<TargetPropertyPage />} />
            <Route path="/property-strategy" element={<PropertyStrategyPlayback />} />
            <Route path="/bridging-calculator" element={<BridgingCalculator />} />
            <Route path="/about-you" element={<AboutYouPage />} />
            <Route path="/test-calculator" element={<TestBridgingCalculator />} />
          </Routes>
        </PropertyProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};