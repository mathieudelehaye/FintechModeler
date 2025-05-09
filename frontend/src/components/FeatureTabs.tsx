import { useState } from 'react';
import { Box, Tab, Tabs, Paper } from '@mui/material';
import OptionPricingForm from './OptionPrice';
import ShareVolatilityForm from './ShareVolatility';
import CashFlowManager from './CashFlowManager';

export default function FeatureTabs() {
  const [active, setActive] = useState(0);
  return (
    <Paper elevation={3} sx={{ width: '100%', borderRadius: 2 }}>
      <Tabs
        value={active}
        onChange={(_, v) => setActive(v)}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Price" />
        <Tab label="Volatility" />
        <Tab label="Immunisation" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {active === 0 && <OptionPricingForm />}
        {active === 1 && <ShareVolatilityForm />}
        {active === 2 && <CashFlowManager />}
      </Box>
    </Paper>
  );
}