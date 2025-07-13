import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
} from '@mui/material';
import { Timeline as TimelineIcon } from '@mui/icons-material';

const TimeSeries: React.FC = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1M');
  const [loading, setLoading] = useState(false);

  const handleFetch = () => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <TimelineIcon color="primary" />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Time Series Analysis
        </Typography>
      </Stack>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid>
            <TextField
              fullWidth
              label="Stock Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              size="small"
            />
          </Grid>
          <Grid>
            <FormControl fullWidth size="small">
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                label="Timeframe"
              >
                <MenuItem value="1D">1 Day</MenuItem>
                <MenuItem value="1W">1 Week</MenuItem>
                <MenuItem value="1M">1 Month</MenuItem>
                <MenuItem value="3M">3 Months</MenuItem>
                <MenuItem value="1Y">1 Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <Button
              fullWidth
              variant="contained"
              onClick={handleFetch}
              disabled={loading}
              size="large"
            >
              {loading ? 'Loading Chart...' : 'Load Chart'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {symbol} Price Chart - {timeframe}
          </Typography>
          <Box
            sx={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.50',
              borderRadius: 1,
            }}
          >
            <Typography color="text.secondary">
              Chart will be displayed here
              <br />
              <Typography variant="caption">
                Install ApexCharts for advanced charting
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TimeSeries;