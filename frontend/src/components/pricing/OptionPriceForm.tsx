import config from '../../config';
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Grid,
} from "@mui/material";
import {
  Calculate as CalculateIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import OptionTypeSelector from "./OptionTypeSelector"; // Updated import path

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
  continuousRfRate: "Continuous Risk-Free Rate (%)",
  initialSharePrice: "Initial Share Price ($)",
  strikePrice: "Strike Price ($)",
};

const OptionPricingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    type: "call",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, type: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOptionData(null);
    
    try {
      const payload = {
        ...formData,            // user inputs
        method: "binomial"      // hardcoded method for now
      };
      const res = await fetch(`${config.apiUrl}/api/options/price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error("Failed to fetch option price.");
      
      const data: OptionData[] = await res.json();
      setOptionData(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <CalculateIcon color="primary" />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Option Pricing Calculator
        </Typography>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        Calculate European option prices using Black-Scholes and Binomial models
      </Alert>

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Option Parameters
              </Typography>

              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <OptionTypeSelector
                    value={formData.type}
                    onChange={handleTypeChange}
                  />
                </Box>

                <Grid container spacing={2}>
                  {Object.entries(formData)
                    .filter(([k]) => k !== 'type')
                    .map(([key, value]) => (
                      <Grid key={key}>
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
                            ['continuousRfRate', 'volatility', 'expiryTime'].includes(key)
                              ? { step: '0.01' }
                              : {}
                          }
                        />
                      </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                  >
                    {loading ? 'Calculating...' : 'Calculate Price'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Panel */}
        <Grid>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h6">
                  Results
                </Typography>
              </Stack>

              {loading && (
                <Box textAlign="center" py={4}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Computing option price...
                  </Typography>
                </Box>
              )}

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              {optionData && optionData.length > 0 && (
                <Box>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Option Price
                    </Typography>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                      ${optionData[0].price.toFixed(2)}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Chip 
                        label={formData.type.toUpperCase()} 
                        color="primary" 
                        size="small" 
                      />
                      <Chip 
                        label="European" 
                        variant="outlined" 
                        size="small" 
                      />
                    </Stack>
                  </Card>

                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Calculated using Black-Scholes and Binomial pricing models
                    </Typography>
                  </Box>
                </Box>
              )}

              {!optionData && !loading && !error && (
                <Box textAlign="center" py={4}>
                  <Typography variant="body2" color="text.secondary">
                    Enter option parameters and click calculate to see the price
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OptionPricingForm;