import React, { useState } from 'react';
import { Box, createTheme, Typography, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import OptionPricingForm from '../components/pricing/OptionPriceForm';
import ShareVolatilityForm from '../components/pricing/ShareVolatilityForm';
import LivePrices from '../components/market/LivePrices';
import TimeSeries from '../components/market/TimeSeries';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
});

export default function Home() {
  const [currentSection, setCurrentSection] = useState('price');

  const renderContent = () => {
    switch (currentSection) {
      case 'price':
        return <OptionPricingForm />;
      case 'volatility':
        return <ShareVolatilityForm />;
      case 'live-prices':
        return <LivePrices />;
      case 'time-series':
        return <TimeSeries />;
      default:
        return <OptionPricingForm />;
    }
  };

  return (
    <>
      <Head>
        <title>Fintech Modeler - Professional Options Pricing & Market Analysis</title>
        <meta name="description" content="Advanced financial modeling tool for option pricing, volatility calculations, and real-time market data analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://reactjs.org/favicon.ico" />
      </Head> 

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#fafafa',
          }}
        >
          {/* Main Dashboard Layout */}
          <Box sx={{ flex: 1 }}>
            <DashboardLayout
              currentSection={currentSection}
              onSectionChange={setCurrentSection}
            >
              {renderContent()}
            </DashboardLayout>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              textAlign: 'center',
              py: 3,
              backgroundColor: '#ffffff',
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              mt: 'auto',
            }}
          >
            <Typography variant="body2" color="textSecondary">
              &copy; Mathieu Delehaye 2025 - Fintech Modeler
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}