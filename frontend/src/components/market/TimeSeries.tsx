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
  Alert,
  CircularProgress,
} from '@mui/material';
import { Timeline as TimelineIcon, ShowChart as ShowChartIcon } from '@mui/icons-material';
import { polygonApi, PolygonAggsResponse } from '../../services/polygonApi';

interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const TimeSeries: React.FC = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1M');
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDateRange = (timeframe: string) => {
    const today = new Date();
    const from = new Date();
    
    switch (timeframe) {
      case '1W':
        from.setDate(today.getDate() - 7);
        break;
      case '1M':
        from.setMonth(today.getMonth() - 1);
        break;
      case '3M':
        from.setMonth(today.getMonth() - 3);
        break;
      case '6M':
        from.setMonth(today.getMonth() - 6);
        break;
      case '1Y':
        from.setFullYear(today.getFullYear() - 1);
        break;
      default:
        from.setMonth(today.getMonth() - 1);
    }
    
    return {
      from: from.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
    };
  };

  const fetchTimeSeries = async () => {
    if (!symbol.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { from, to } = getDateRange(timeframe);
      const response: PolygonAggsResponse = await polygonApi.getAggregates(
        symbol.toUpperCase(),
        1,
        'day',
        from,
        to
      );
      
      if (response.results && response.results.length > 0) {
        const transformedData: TimeSeriesData[] = response.results.map(item => ({
          date: new Date(item.t).toISOString().split('T')[0],
          open: item.o,
          high: item.h,
          low: item.l,
          close: item.c,
          volume: item.v,
        }));
        
        setData(transformedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } else {
        setError('No data available for the selected symbol and timeframe');
        setData([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch time series data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (data.length === 0) return null;
    
    const prices = data.map(d => d.close);
    const volumes = data.map(d => d.volume);
    
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const lastPrice = prices[prices.length - 1];
    const firstPrice = prices[0];
    const totalReturn = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    return {
      maxPrice,
      minPrice,
      avgVolume,
      totalReturn,
      dataPoints: data.length
    };
  };

  const stats = calculateStats();

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <TimelineIcon color="primary" />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Time Series Analysis
        </Typography>
      </Stack>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="end">
          <Grid>
            <TextField
              fullWidth
              label="Stock Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              size="small"
              placeholder="e.g., AAPL, GOOGL"
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
                <MenuItem value="1W">1 Week</MenuItem>
                <MenuItem value="1M">1 Month</MenuItem>
                <MenuItem value="3M">3 Months</MenuItem>
                <MenuItem value="6M">6 Months</MenuItem>
                <MenuItem value="1Y">1 Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <Button
              fullWidth
              variant="contained"
              onClick={fetchTimeSeries}
              disabled={loading || !symbol.trim()}
              size="large"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ShowChartIcon />}
            >
              {loading ? 'Loading...' : 'Load Data'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Historical daily data from Polygon.io free tier. Limited to 2 years of history.
        </Typography>
      </Alert>

      {stats && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {symbol} Statistics ({timeframe})
            </Typography>
            <Grid container spacing={3}>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Total Return
                </Typography>
                <Typography 
                  variant="h6" 
                  color={stats.totalReturn >= 0 ? 'success.main' : 'error.main'}
                  sx={{ fontWeight: 600 }}
                >
                  {stats.totalReturn >= 0 ? '+' : ''}{stats.totalReturn.toFixed(2)}%
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  High
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ${stats.maxPrice.toFixed(2)}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Low
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ${stats.minPrice.toFixed(2)}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Avg Volume
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {(stats.avgVolume / 1000000).toFixed(1)}M
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {symbol} Price History - {timeframe}
          </Typography>
          
          {data.length > 0 ? (
            <Box sx={{ height: 400, overflow: 'auto' }}>
              <Grid container spacing={1}>
                {data.slice(-20).map((item, index) => (
                  <Grid>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        bgcolor: index % 2 === 0 ? 'grey.50' : 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Typography variant="body2" sx={{ minWidth: 100 }}>
                        {new Date(item.date).toLocaleDateString()}
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box textAlign="center">
                          <Typography variant="caption" color="text.secondary">Open</Typography>
                          <Typography variant="body2">${item.open.toFixed(2)}</Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="caption" color="text.secondary">High</Typography>
                          <Typography variant="body2">${item.high.toFixed(2)}</Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="caption" color="text.secondary">Low</Typography>
                          <Typography variant="body2">${item.low.toFixed(2)}</Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="caption" color="text.secondary">Close</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ${item.close.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="caption" color="text.secondary">Volume</Typography>
                          <Typography variant="body2">
                            {(item.volume / 1000000).toFixed(1)}M
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
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
              <Typography color="text.secondary" textAlign="center">
                {loading ? 'Loading chart data...' : 'Enter a symbol and click "Load Data" to view price history'}
                <br />
                {!loading && (
                  <Typography variant="caption">
                    Charts will show the last 20 trading days
                  </Typography>
                )}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TimeSeries;