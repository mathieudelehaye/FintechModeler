import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Grid, CircularProgress } from "@mui/material";

interface OptionData {
    id: number;
    name: string;
    type: string;
    price: number;
}

const fieldLabels: Record<string, string> = {
  expiryTime: "Expiry Time (Years)",
  periodNumber: "Number of Periods",
  volatility: "Volatility (%)",
  continuousRfRate: "Continous Risk-Free Rate (%)",
  initialSharePrice: "Initial Share Price ($)",
  strikePrice: "Strike Price ($)",
};

const OptionPricingForm = () => {
  const [formData, setFormData] = useState({
    expiryTime: 2,
    periodNumber: 8,
    volatility: 0.3,
    continuousRfRate: 0.04,
    initialSharePrice: 50,
    strikePrice: 60,
  });

  const [optionData, setOptionData] = useState<OptionData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const url = 'https://localhost:7200/api/Options/price';
      setOptionData(null);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch option price.");
      }

      const data: OptionData[] = await response.json();
      console.log('Fetched data:', data);
      setOptionData(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom textAlign="center">
            European Option Price Calculator
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {Object.entries(formData).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    label={fieldLabels[key] || key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    type="number"
                    required
                    variant="outlined"
                    inputProps={key === "continuousRfRate" || key === "volatility" || key === "expiryTime" ? { step: "0.01" } : {}}
                  />
                </Grid>
              ))}
            </Grid>

            <Box textAlign="center" mt={3}>
              <Button type="submit" variant="contained" color="primary" size="large">
                Calculate Price
              </Button>
            </Box>
          </form>

          {loading && (
            <Box textAlign="center" mt={3}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Typography color="error" textAlign="center" mt={2}>
              {error}
            </Typography>
          )}

          {optionData !== null && (
            <Typography variant="h6" color="primary" textAlign="center" mt={3}>
              Option Price for {optionData[0].name.toUpperCase()}: <strong>${optionData[0].price.toFixed(2)}</strong>
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};
  
  export default OptionPricingForm;