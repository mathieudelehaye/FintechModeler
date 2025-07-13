import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Timeline, TrendingUp, ShowChart, Schedule } from '@mui/icons-material';
import { polygonApi } from '../../services/polygonApi';
import { useRateLimiter } from '../../hooks/useRateLimiter';
import { RateLimitStatus } from '../common/RateLimitStatus';

// Dynamic import for ApexCharts to avoid SSR issues
const Chart = React.lazy(() => import('react-apexcharts'));

interface DataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const TimeSeries: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1M');
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('candlestick');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const { canMakeRequest, makeRequest, secondsUntilNext } = useRateLimiter();

  const getDateRange = (timeframe: string) => {
    const today = new Date();
    const toDate = today.toISOString().split('T')[0];
    let fromDate: string;
    let multiplier = 1;
    let timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day';

    switch (timeframe) {
      case '1D':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        fromDate = yesterday.toISOString().split('T')[0];
        multiplier = 1;
        timespan = 'hour';
        break;
      case '1W':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        fromDate = weekAgo.toISOString().split('T')[0];
        multiplier = 1;
        timespan = 'day';
        break;
      case '1M':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        fromDate = monthAgo.toISOString().split('T')[0];
        multiplier = 1;
        timespan = 'day';
        break;
      case '3M':
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        fromDate = threeMonthsAgo.toISOString().split('T')[0];
        multiplier = 1;
        timespan = 'day';
        break;
      case '6M':
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        fromDate = sixMonthsAgo.toISOString().split('T')[0];
        multiplier = 1;
        timespan = 'day';
        break;
      case '1Y':
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        fromDate = yearAgo.toISOString().split('T')[0];
        multiplier = 1;
        timespan = 'week';
        break;
      default:
        const defaultDate = new Date(today);
        defaultDate.setMonth(defaultDate.getMonth() - 1);
        fromDate = defaultDate.toISOString().split('T')[0];
        break;
    }

    return { fromDate, toDate, multiplier, timespan };
  };

  const loadData = async () => {
    if (!symbol.trim()) {
      setError('Please enter a valid symbol');
      return;
    }
    
    if (!canMakeRequest) {
      setError(`Rate limit exceeded. Please wait ${secondsUntilNext} seconds.`);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { fromDate, toDate, multiplier, timespan } = getDateRange(timeframe);
      
      type PolygonAggregatesResponse = { results?: any[] };
      const response = await makeRequest(() => 
        polygonApi.getAggregates(symbol, multiplier, timespan, fromDate, toDate)
      ) as PolygonAggregatesResponse;
      
      if (response && response.results && Array.isArray(response.results)) {
        const processedData: DataPoint[] = response.results
          .filter(item => 
            item && item.t && item.o && item.h && item.l && item.c && item.v &&
            !isNaN(item.o) && !isNaN(item.h) && !isNaN(item.l) && !isNaN(item.c)
          )
          .map(item => ({
            timestamp: item.t,
            open: Number(item.o),
            high: Number(item.h),
            low: Number(item.l),
            close: Number(item.c),
            volume: Number(item.v)
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        
        setData(processedData);
        setLastUpdate(new Date());
        
        if (processedData.length === 0) {
          setError('No data found for the selected symbol and timeframe');
        }
      } else {
        setData([]);
        setError('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error fetching time series data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (data.length < 2) return null;
    
    const prices = data.map(d => d.close);
    const volumes = data.map(d => d.volume);
    
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const lastPrice = prices[prices.length - 1];
    const firstPrice = prices[0];
    const totalReturn = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    return { maxPrice, minPrice, avgVolume, totalReturn, dataPoints: data.length, currentPrice: lastPrice };
  };

  const getChartOptions = (): ApexCharts.ApexOptions => {
    const stats = calculateStats();
    const isPositive = stats ? stats.totalReturn >= 0 : true;

    const baseOptions: ApexCharts.ApexOptions = {
      chart: { type: chartType, height: 500, background: 'transparent', animations: { enabled: false } },
      title: { text: `${symbol} - ${timeframe}`, align: 'left' },
      xaxis: { type: 'datetime' },
      yaxis: { labels: { formatter: (value: number) => value ? `$${value.toFixed(2)}` : '$0' } },
      tooltip: { enabled: true, theme: 'light', x: { format: 'dd MMM yyyy' } },
      grid: { show: true, borderColor: '#e0e0e0', strokeDashArray: 3 },
    };

    if (chartType === 'candlestick') {
      return {
        ...baseOptions,
        plotOptions: { candlestick: { colors: { upward: '#26a69a', downward: '#ef5350' }, wick: { useFillColor: true } } }
      };
    }
    return { ...baseOptions, stroke: { curve: 'smooth', width: 2 }, colors: [isPositive ? '#26a69a' : '#ef5350'] };
  };

  const getChartSeries = () => {
    if (data.length === 0) return [];

    if (chartType === 'candlestick') {
      return [{
        name: symbol,
        data: data.map(item => ({ x: new Date(item.timestamp), y: [item.open, item.high, item.low, item.close] }))
      }];
    }
    
    return [{
      name: `${symbol} Price`,
      data: data.map(item => [item.timestamp, item.close])
    }];
  };

  const stats = calculateStats();

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Timeline color="primary" />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Time Series Analysis
        </Typography>
      </Stack>
      
      {/* Control Panel */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <TextField 
              fullWidth 
              label="Symbol" 
              value={symbol} 
              onChange={(e) => setSymbol(e.target.value.toUpperCase())} 
              size="small"
              error={!symbol.trim()}
              helperText={!symbol.trim() ? "Required" : ""}
            />
          </Grid>
          
          <Grid>
            <FormControl fullWidth size="small">
              <InputLabel>Timeframe</InputLabel>
              <Select value={timeframe} label="Timeframe" onChange={(e) => setTimeframe(e.target.value)}>
                <MenuItem value="1D">1 Day</MenuItem>
                <MenuItem value="1W">1 Week</MenuItem>
                <MenuItem value="1M">1 Month</MenuItem>
                <MenuItem value="3M">3 Months</MenuItem>
                <MenuItem value="6M">6 Months</MenuItem>
                <MenuItem value="1Y">1 Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid>
            <FormControl fullWidth size="small">
              <InputLabel>Chart Type</InputLabel>
              <Select value={chartType} label="Chart Type" onChange={(e) => setChartType(e.target.value as 'line' | 'candlestick')}>
                <MenuItem value="line">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ShowChart fontSize="small" />
                    <span>Line</span>
                  </Stack>
                </MenuItem>
                <MenuItem value="candlestick">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <TrendingUp fontSize="small" />
                    <span>Candlestick</span>
                  </Stack>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={loadData} 
              disabled={loading || !symbol.trim() || !canMakeRequest}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Loading...' : 'Load Chart'}
            </Button>
          </Grid>
          
          <Grid>
            <RateLimitStatus />
          </Grid>
          
          <Grid>
            {stats && (
              <Chip 
                label={`${stats.totalReturn.toFixed(1)}%`} 
                color={stats.totalReturn >= 0 ? 'success' : 'error'} 
                size="small" 
              />
            )}
            {lastUpdate && (
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                <Schedule fontSize="small" color="disabled" />
                <Typography variant="caption" color="text.secondary">
                  {lastUpdate.toLocaleTimeString()}
                </Typography>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistics Card */}
      {stats && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {symbol} Statistics ({timeframe})
            </Typography>
            <Grid container spacing={2}>
              <Grid>
                <Box>
                  <Typography variant="body2" color="text.secondary">Current Price</Typography>
                  <Typography variant="h6">${stats.currentPrice.toFixed(2)}</Typography>
                </Box>
              </Grid>
              <Grid>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Return</Typography>
                  <Typography 
                    variant="h6" 
                    color={stats.totalReturn >= 0 ? 'success.main' : 'error.main'}
                  >
                    {stats.totalReturn.toFixed(2)}%
                  </Typography>
                </Box>
              </Grid>
              <Grid>
                <Box>
                  <Typography variant="body2" color="text.secondary">High</Typography>
                  <Typography variant="h6">${stats.maxPrice.toFixed(2)}</Typography>
                </Box>
              </Grid>
              <Grid>
                <Box>
                  <Typography variant="body2" color="text.secondary">Low</Typography>
                  <Typography variant="h6">${stats.minPrice.toFixed(2)}</Typography>
                </Box>
              </Grid>
              <Grid>
                <Box>
                  <Typography variant="body2" color="text.secondary">Avg Volume</Typography>
                  <Typography variant="h6">{(stats.avgVolume / 1000000).toFixed(1)}M</Typography>
                </Box>
              </Grid>
              <Grid>
                <Box>
                  <Typography variant="body2" color="text.secondary">Data Points</Typography>
                  <Typography variant="h6">{stats.dataPoints}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Chart Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Price Chart
          </Typography>
          
          {data.length > 0 ? (
            <React.Suspense fallback={<Box height={500} display="flex" alignItems="center" justifyContent="center"><CircularProgress /></Box>}>
              <Chart 
                key={chartType} 
                options={getChartOptions()} 
                series={getChartSeries()} 
                type={chartType} 
                height={500} 
                width="100%" 
              />
            </React.Suspense>
          ) : (
            <Box 
              height={500} 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              bgcolor="grey.50"
            >
              <Typography color="text.secondary">
                {loading ? 'Loading chart data...' : 'No data to display. Click "Load Chart" to fetch data.'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Info Panel */}
      <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.50' }}>
        <Typography variant="caption" color="text.secondary">
          Note: API requests are limited to 5 per minute. Chart updates are rate-limited across all pages.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TimeSeries;