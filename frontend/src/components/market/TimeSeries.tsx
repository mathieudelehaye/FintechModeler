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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { 
  Timeline as TimelineIcon, 
  ShowChart as ShowChartIcon,
  CandlestickChart as CandlestickIcon,
  TrendingUp as LineIcon 
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { polygonApi, PolygonAggsResponse } from '../../services/polygonApi';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}

type ChartType = 'candlestick' | 'line' | 'area';

const TimeSeries: React.FC = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1M');
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<ChartType>('candlestick');

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
      console.log(`Fetching time series data for ${symbol} (${timeframe})...`);
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
          timestamp: item.t,
        }));
        
        setData(transformedData.sort((a, b) => a.timestamp - b.timestamp));
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
      dataPoints: data.length,
      currentPrice: lastPrice
    };
  };

  // Prepare chart data
  const getChartOptions = () => {
    if (data.length === 0) return {};

    const stats = calculateStats();
    const isPositive = stats ? stats.totalReturn >= 0 : true;

    const baseOptions = {
      chart: {
        type: chartType === 'candlestick' ? 'candlestick' : chartType,
        height: 500,
        background: 'transparent',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      title: {
        text: `${symbol} - ${timeframe}`,
        align: 'left',
        style: {
          fontSize: '18px',
          fontWeight: '600',
          color: '#333'
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'MMM dd',
          style: {
            colors: '#666',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        },
        labels: {
          formatter: (value: number) => `$${value.toFixed(2)}`,
          style: {
            colors: '#666',
            fontSize: '12px'
          }
        }
      },
      tooltip: {
        enabled: true,
        theme: 'light',
        x: {
          format: 'dd MMM yyyy'
        }
      },
      grid: {
        show: true,
        borderColor: '#e0e0e0',
        strokeDashArray: 3
      },
      theme: {
        mode: 'light'
      }
    };

    if (chartType === 'candlestick') {
      return {
        ...baseOptions,
        plotOptions: {
          candlestick: {
            colors: {
              upward: '#26a69a',
              downward: '#ef5350'
            },
            wick: {
              useFillColor: true
            }
          }
        }
      };
    } else {
      return {
        ...baseOptions,
        stroke: {
          curve: 'smooth',
          width: chartType === 'line' ? 2 : 1
        },
        fill: {
          type: chartType === 'area' ? 'gradient' : 'solid',
          gradient: chartType === 'area' ? {
            shadeIntensity: 1,
            opacityFrom: 0.3,
            opacityTo: 0.1,
            stops: [0, 100]
          } : undefined
        },
        colors: [isPositive ? '#26a69a' : '#ef5350']
      };
    }
  };

  const getChartSeries = () => {
    if (data.length === 0) return [];

    if (chartType === 'candlestick') {
      return [{
        name: symbol,
        data: data.map(item => ({
          x: item.timestamp,
          y: [item.open, item.high, item.low, item.close]
        }))
      }];
    } else {
      return [{
        name: `${symbol} Price`,
        data: data.map(item => ({
          x: item.timestamp,
          y: item.close
        }))
      }];
    }
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
          <Grid sx={{ minWidth: 200 }}>
            <TextField
              fullWidth
              label="Stock Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              size="small"
              placeholder="e.g., AAPL, GOOGL"
            />
          </Grid>
          <Grid sx={{ minWidth: 150 }}>
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
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(_, newType) => newType && setChartType(newType)}
              size="small"
            >
              <ToggleButton value="candlestick" aria-label="candlestick">
                <CandlestickIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="line" aria-label="line">
                <LineIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="area" aria-label="area">
                <ShowChartIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              onClick={fetchTimeSeries}
              disabled={loading || !symbol.trim()}
              size="large"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ShowChartIcon />}
            >
              {loading ? 'Loading...' : 'Load Chart'}
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
          Use the chart controls to zoom, pan, and download the chart.
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
                  Current Price
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ${stats.currentPrice.toFixed(2)}
                </Typography>
              </Grid>
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
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Data Points
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stats.dataPoints}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {symbol} Price Chart - {timeframe}
          </Typography>
          
          {data.length > 0 ? (
            <Box sx={{ height: 500, width: '100%' }}>
              <Chart
                options={getChartOptions()}
                series={getChartSeries()}
                type={chartType === 'candlestick' ? 'candlestick' : chartType}
                height={500}
                width="100%"
              />
            </Box>
          ) : (
            <Box
              sx={{
                height: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.50',
                borderRadius: 1,
              }}
            >
              <Typography color="text.secondary" textAlign="center">
                {loading ? 'Loading chart data...' : 'Enter a symbol and click "Load Chart" to view price history'}
                <br />
                {!loading && (
                  <Typography variant="caption">
                    Interactive financial charts with zoom, pan, and download features
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