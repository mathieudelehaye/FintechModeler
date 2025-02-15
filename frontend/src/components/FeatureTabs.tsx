import { ReactNode, useState } from 'react';
import { Box, Tab, Tabs, Typography } from "@mui/material";

import { Tiles } from "@/client/App/LiveRates/Tiles";

import OptionPricingForm from './OptionPrice';
import ShareVolatilityForm from './ShareVolatility';

interface FeatureTabsProps {
  children?: ReactNode;
  value: number;
  index: number;
}

const CustomTabPanel: React.FC<FeatureTabsProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 3 }}>
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
        height: "85vh",
        width: "100%",
      }}
    >
      <Box sx={{ width: "75%", bgcolor: "background.paper", p: 3, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Price" />
            <Tab label="Volatility" />
            <Tab label="Various" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <OptionPricingForm />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ShareVolatilityForm />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ShareVolatilityForm />
          {/* <Tiles /> */}
        </CustomTabPanel>
        
      </Box>
    </Box>
  );
}

export default FeatureTabs;
