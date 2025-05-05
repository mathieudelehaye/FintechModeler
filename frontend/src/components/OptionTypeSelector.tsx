// src/components/OptionTypeSelector.tsx
import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface OptionTypeSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OptionTypeSelector: React.FC<OptionTypeSelectorProps> = ({
  value,
  onChange,
}) => (
  <Box sx={{ mb: 2 }}>
    <FormControl fullWidth component="fieldset">
      <FormLabel component="legend" sx={{ mb: 1 }}>
        Option Type
      </FormLabel>
      <RadioGroup row value={value} onChange={onChange}>
        <FormControlLabel value="call" control={<Radio />} label="Call" />
        <FormControlLabel value="put" control={<Radio />} label="Put" />
      </RadioGroup>
    </FormControl>
  </Box>
);

export default OptionTypeSelector;
