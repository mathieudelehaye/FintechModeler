import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { TrendingUp, Refresh, Schedule } from '@mui/icons-material';
import { useRateLimiter } from '../../hooks/useRateLimiter';
import { RateLimitStatus } from '../common/RateLimitStatus';

interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  timestamp: number;
}

const LivePrices: React.FC = () => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { canMakeRequest, makeRequest, secondsUntilNext } = useRateLimiter();

  // Popular symbols to display
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

  const fetchCurrentPrice = async (symbol: string) => {
    const response = await fetch(`/api/stocks/${symbol}/current`);
    if (!response.ok) {
      throw new Error(`Failed to fetch price for ${symbol}`);
    }
    return response.json();
  };

  const fetchPrices = async () => {
    if (!canMakeRequest) {
      setError(`Rate limit exceeded. Please wait ${secondsUntilNext} seconds.`);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Fetch prices for all symbols using the rate limiter
      const pricePromises = symbols.map(async (symbol) => {
        return makeRequest(() => fetchCurrentPrice(symbol));
      });

      const results = await Promise.all(pricePromises);
      
      const processedPrices: PriceData[] = results.map((result, index) => {
        const symbol = symbols[index];
        
        // Process the actual Polygon API response structure
        const currentPrice = result.results?.[0]?.c || result.c || 0;
        const previousClose = result.results?.[0]?.pc || result.pc || currentPrice;
        const change = currentPrice - previousClose;
        const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
        
        return {
          symbol,
          price: currentPrice,
          change,
          changePercent,
          volume: result.results?.[0]?.v || result.v,
          timestamp: Date.now()
        };
      });

      setPrices(processedPrices);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching prices:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 5 minutes if API is available
  useEffect(() => {
    const interval = setInterval(() => {
      if (canMakeRequest && !loading) {
        fetchPrices();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [canMakeRequest, loading]);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => (change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2));
  const formatPercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <TrendingUp color="primary" />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Live Market Prices
        </Typography>
      </Stack>

      {/* Control Panel */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <Button
              fullWidth
              variant="contained"
              onClick={fetchPrices}
              disabled={loading || !canMakeRequest}
              startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
            >
              {loading ? 'Loading...' : 'Refresh Prices'}
            </Button>
          </Grid>
          
          <Grid>
            <RateLimitStatus />
          </Grid>

          {lastUpdate && (
            <Grid>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Schedule fontSize="small" color="disabled" />
                <Typography variant="caption" color="text.secondary">
                  Updated: {lastUpdate.toLocaleTimeString()}
                </Typography>
              </Stack>
            </Grid>
          )}

          <Grid>
            <Chip
              label={`${symbols.length} Symbols`}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Prices Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Market Data
          </Typography>
          
          {prices.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Change</TableCell>
                    <TableCell align="right">Change %</TableCell>
                    <TableCell align="right">Volume</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prices.map((price) => (
                    <TableRow key={price.symbol}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {price.symbol}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatPrice(price.price)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          color={price.change >= 0 ? 'success.main' : 'error.main'}
                        >
                          {formatChange(price.change)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={formatPercent(price.changePercent)}
                          color={price.changePercent >= 0 ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {price.volume ? (price.volume / 1000000).toFixed(1) + 'M' : 'N/A'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              height={200}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="grey.50"
            >
              <Typography color="text.secondary">
                {loading ? 'Loading market data...' : 'No price data available. Click "Refresh Prices" to load data.'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Info Panel */}
      <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.50' }}>
        <Typography variant="caption" color="text.secondary">
          Note: Due to API rate limits (5 requests/minute), price updates are limited. 
          Data refreshes automatically every 5 minutes when possible.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LivePrices;