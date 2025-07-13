import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { polygonApi, PolygonPreviousClose } from '../../services/polygonApi';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  volume: number;
  high: number;
  low: number;
  open: number;
}

const LivePrices: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState('');
  const [marketStatus, setMarketStatus] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<{current: number, total: number, symbol: string}>({current: 0, total: 0, symbol: ''});

  // Default stocks to load
  const defaultStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];

  const fetchStockData = async (ticker: string) => {
    try {
      const data: PolygonPreviousClose = await polygonApi.getPreviousClose(ticker);
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const change = result.c - result.o;
        const changePercent = ((change / result.o) * 100);
        
        const stockInfo: StockData = {
          symbol: ticker.toUpperCase(),
          price: result.c,
          change: change,
          changePercent: changePercent,
          volume: result.v,
          high: result.h,
          low: result.l,
          open: result.o,
          lastUpdated: new Date(result.t).toLocaleString(),
        };

        setStockData(prev => {
          const existing = prev.find(stock => stock.symbol === ticker.toUpperCase());
          if (existing) {
            return prev.map(stock => 
              stock.symbol === ticker.toUpperCase() ? stockInfo : stock
            );
          }
          return [...prev, stockInfo];
        });
      }
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error);
      throw error;
    }
  };

  const handleAddStock = async () => {
    if (symbol.trim()) {
      setLoading(true);
      setError(null);
      setLoadingProgress({current: 1, total: 1, symbol: symbol.trim()});
      
      try {
        await fetchStockData(symbol.trim());
        setSymbol('');
      } catch (err) {
        setError(`Failed to fetch data for ${symbol}. Please check the symbol and try again.`);
      } finally {
        setLoading(false);
        setLoadingProgress({current: 0, total: 0, symbol: ''});
      }
    }
  };

  const refreshAllStocks = async () => {
    if (stockData.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const symbols = stockData.map(stock => stock.symbol);
      
      // Sequential refresh to respect rate limits
      for (let i = 0; i < symbols.length; i++) {
        const ticker = symbols[i];
        setLoadingProgress({current: i + 1, total: symbols.length, symbol: ticker});
        
        try {
          await fetchStockData(ticker);
        } catch (err) {
          console.error(`Failed to refresh ${ticker}:`, err);
          // Continue with next stock even if one fails
        }
      }
    } catch (err) {
      setError('Failed to refresh stock data');
    } finally {
      setLoading(false);
      setLoadingProgress({current: 0, total: 0, symbol: ''});
    }
  };

  const loadDefaultStocks = async () => {
    setLoading(true);
    setError(null);
    setStockData([]); // Clear existing data
    
    try {
      // Sequential loading to respect rate limits
      for (let i = 0; i < defaultStocks.length; i++) {
        const ticker = defaultStocks[i];
        setLoadingProgress({current: i + 1, total: defaultStocks.length, symbol: ticker});
        
        try {
          await fetchStockData(ticker);
        } catch (err) {
          console.error(`Failed to load ${ticker}:`, err);
          // Continue with next stock even if one fails
        }
      }
    } catch (err) {
      setError('Failed to load default stocks');
    } finally {
      setLoading(false);
      setLoadingProgress({current: 0, total: 0, symbol: ''});
    }
  };

  const checkMarketStatus = async () => {
    try {
      const status = await polygonApi.getMarketStatus();
      setMarketStatus(status.market);
    } catch (err) {
      console.error('Failed to get market status:', err);
    }
  };

  useEffect(() => {
    loadDefaultStocks();
    checkMarketStatus();
  }, []);

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`;
    }
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Live Market Prices
        </Typography>
        <Stack direction="row" spacing={1}>
          {marketStatus && (
            <Chip 
              label={`Market: ${marketStatus}`} 
              color={marketStatus === 'open' ? 'success' : 'default'} 
              variant="outlined" 
              size="small" 
            />
          )}
          <Chip 
            icon={<InfoIcon />} 
            label="Powered by Polygon.io" 
            color="primary" 
            variant="outlined" 
            size="small" 
          />
        </Stack>
      </Stack>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="Add Stock Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            size="small"
            placeholder="e.g., TSLA, NVDA, META"
            sx={{ minWidth: 200 }}
            onKeyPress={(e) => e.key === 'Enter' && handleAddStock()}
          />
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
            onClick={handleAddStock}
            disabled={loading || !symbol.trim()}
          >
            Add Stock
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshAllStocks}
            disabled={loading || stockData.length === 0}
          >
            Refresh All
          </Button>
        </Stack>
        
        {loading && loadingProgress.total > 0 && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Loading {loadingProgress.symbol}...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {loadingProgress.current} of {loadingProgress.total}
              </Typography>
            </Stack>
            <LinearProgress 
              variant="determinate" 
              value={(loadingProgress.current / loadingProgress.total) * 100}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Free Tier Notice:</strong> Polygon.io free tier allows 5 requests per minute. 
          Stocks load sequentially to respect rate limits. Data shows previous trading day close prices.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {stockData.map((stock) => (
          <Grid key={stock.symbol}>
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              },
            }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {stock.symbol}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Previous Close
                    </Typography>
                  </Box>
                  <Chip
                    icon={stock.change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    label={`${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`}
                    color={stock.change >= 0 ? 'success' : 'error'}
                    size="small"
                  />
                </Stack>
                
                <Typography variant="h4" component="div" sx={{ mb: 2, fontWeight: 700 }}>
                  ${stock.price.toFixed(2)}
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{ 
                    mb: 2,
                    color: stock.change >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
                </Typography>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid>
                    <Typography variant="caption" color="text.secondary">
                      Open
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${stock.open.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="caption" color="text.secondary">
                      High
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${stock.high.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="caption" color="text.secondary">
                      Low
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${stock.low.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="caption" color="text.secondary">
                      Volume
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatVolume(stock.volume)}
                    </Typography>
                  </Grid>
                </Grid>

                <Typography variant="caption" color="text.secondary">
                  {stock.lastUpdated}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {stockData.length === 0 && !loading && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No stocks loaded
          </Typography>
          <Button 
            variant="contained" 
            onClick={loadDefaultStocks}
            startIcon={<AddIcon />}
          >
            Load Default Stocks
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default LivePrices;