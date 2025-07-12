// src/components/ShareVolatilityForm.tsx
import config from '../config';
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import OptionTypeSelector from './OptionTypeSelector';

interface OptionData {
  id: number;
  name: string;
  price: number;
  volatility: number;
}

const fieldLabels: Record<string, string> = {
  expiryTime: "Expiry Time (Years)",
  initialOptionPrice: "Initial Option Price ($)",
  continuousRfRate: "Continuous Risk-Free Rate (%)",
  initialSharePrice: "Initial Share Price ($)",
  strikePrice: "Strike Price ($)",
};

const ShareVolatilityForm: React.FC = () => {
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
      const res = await fetch(
        `${config.apiUrl}/api/options/volatility`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch implied volatility.");
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
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Implied Volatility Calculator
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
                textAlign: 'left',
              }}
            >
              {/* span both columns */}
              <Box gridColumn="1 / -1" sx={{ mb: 2 }}>
                <OptionTypeSelector
                  value={formData.type}
                  onChange={handleTypeChange}
                />
              </Box>

              {Object.entries(formData)
                .filter(([k]) => k !== 'type')
                .map(([key, value]) => (
                  <TextField
                    key={key}
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
                ))}
            </Box>

            <Box textAlign="center" mt={3}>
              <Button type="submit" variant="contained" size="large" disabled={loading}>
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

          {optionData && optionData.length > 0 && (
            <Typography variant="h6" color="primary" textAlign="center" mt={3}>
              Share Volatility: <strong>{optionData[0].volatility.toFixed(2)}% annually</strong>
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ShareVolatilityForm;
