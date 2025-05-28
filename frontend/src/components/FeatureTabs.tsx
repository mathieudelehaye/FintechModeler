import { useState } from 'react';
import { Box, Tab, Tabs, Paper } from '@mui/material';
import OptionPricingForm from './OptionPrice';
import ShareVolatilityForm from './ShareVolatility';
import CashFlowManager from './CashFlowManager';

export default function FeatureTabs() {
  const [active, setActive] = useState(0);
  return (
    <Box>
      {/* Tabs outside the Paper/card */}
      <Tabs
        value={active}
        onChange={(_, v) => setActive(v)}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="Price" />
        <Tab label="Volatility" />
        <Tab label="Immunisation" />
      </Tabs>

      {/* Card container for the forms */}
      <Paper elevation={3} sx={{
  width: 'fit-content',
  mx: 'auto',
  px: 2,
  py: 2,
  borderRadius: 2
}}>
        {active === 0 && <OptionPricingForm />}
        {active === 1 && <ShareVolatilityForm />}
        {active === 2 && <CashFlowManager />}
      </Paper>
    </Box>
  );
}
