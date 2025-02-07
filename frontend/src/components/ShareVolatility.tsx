import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Grid, CircularProgress } from "@mui/material";

import OptionTypeSelector  from './OptionTypeSelector .tsx';

interface OptionData {
  id: number;
  name: string;
  price: number;
  volatility: number;
}

const fieldLabels: Record<string, string> = {
  expiryTime: "Expiry Time (Years)",
  initialOptionPrice: "Initial Option Price ($)",
  continuousRfRate: "Continous Risk-Free Rate (%)",
  initialSharePrice: "Initial Share Price ($)",
  strikePrice: "Strike Price ($)",
};

const ShareVolatilityForm = () => {
  const [formData, setFormData] = useState({
    initialOptionPrice: 15,
    type: "call",
    expiryTime: 2,
    continuousRfRate: 0.05,
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

  // Specific change handler for the radio buttons
  const handleTypeChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      type: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    setLoading(true);
    setError("");

    try {
      const url = 'https://backend20250103203956.azurewebsites.net/api/Options/volatility';

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
    <Box
      sx={{
        backgroundColor: 'white',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom textAlign="center">
            Implied Volatility Calculator
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <OptionTypeSelector value={formData.type} onChange={handleTypeChange} />

              {/* Dynamic TextFields excluding 'type' */}
              {Object.entries(formData)
                .filter(([key]) => key !== 'type')
                .map(([key, value]) => (
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
                      inputProps={
                        key === 'continuousRfRate' ||
                        key === 'volatility' ||
                        key === 'expiryTime'
                          ? { step: '0.01' }
                          : {}
                      }
                    />
                  </Grid>
                ))}
            </Grid>

            <Box textAlign="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
              >
                Calculate Volatility
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
            <Typography
              variant="h6"
              color="primary"
              textAlign="center"
              mt={3}
            >
              Share Volatilty for {optionData[0].name.toUpperCase()}: <strong>{optionData[0].volatility.toFixed(2)} % annually</strong>
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ShareVolatilityForm;