import { useState } from "react";
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

const OptionPricingForm = () => {
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleTypeChange = (e: any) => {
    setFormData((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOptionData(null);
    try {
      const res = await fetch(
        "https://backend20250103203956.azurewebsites.net/api/Options/price",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch option price.");
      const data: OptionData[] = await res.json();
      setOptionData(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            variant="h5"
            component="div"
            textAlign="center"
            gutterBottom
          >
            European Option Price Calculator
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                textAlign: "left",
              }}
            >
              {/* full-width selector */}
              <Box gridColumn="1 / -1" sx={{ mb: 2 }}>
                <OptionTypeSelector
                  value={formData.type}
                  onChange={handleTypeChange}
                />
              </Box>

              {/* dynamic numeric fields */}
              {Object.entries(formData)
                .filter(([k]) => k !== "type")
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
                      ["continuousRfRate", "volatility", "expiryTime"].includes(
                        key
                      )
                        ? { step: "0.01" }
                        : {}
                    }
                  />
                ))}
            </Box>

            <Box textAlign="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
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

          {optionData && optionData.length > 0 && (
            <Typography
              variant="h6"
              component="div"
              color="primary"
              textAlign="center"
              mt={3}
            >
              Option Price: <strong>${optionData[0].price.toFixed(2)}</strong>
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default OptionPricingForm;
