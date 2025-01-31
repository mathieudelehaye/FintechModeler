import React, { useEffect, useState } from 'react';
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";

import OptionPricingForm from './OptionPrice.tsx';
import ShareVolatilityForm from './ShareVolatility.tsx';

const CustomTabPanel = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const FeatureTabs = () => {
    const [value, setValue] = useState(0); 

    const handleChange = (event, newValue) => {
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
