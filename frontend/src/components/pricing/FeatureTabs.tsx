import { ReactNode, useState } from 'react';
import { Box, Tab, Tabs, Typography } from "@mui/material";

import OptionPricingForm from './OptionPriceForm';
import ShareVolatilityForm from './ShareVolatilityForm';

interface FeatureTabsProps {
  children?: ReactNode;
  value: number;
  index: number;
}

const CustomTabPanel: React.FC<FeatureTabsProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 5 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const FeatureTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (    
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Price" />
            <Tab label="Volatility" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <OptionPricingForm />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ShareVolatilityForm />
        </CustomTabPanel>
      </Box>
    </Box>
  );
}

export default FeatureTabs;
