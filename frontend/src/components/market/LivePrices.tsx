import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Delete as DeleteIcon,
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
  cachedAt: number; // Timestamp when data was cached
}

interface CachedData {
  stocks: StockData[];
  marketStatus: string;
  lastFetchDate: string; // Store as YYYY-MM-DD string for easy comparison
  lastFetchTime: number;
}

const CACHE_KEY = 'liveprices_cache';
const MAX_STOCKS = 5; // Maximum number of stocks allowed

const LivePrices: React.FC = () => {
    const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState('');
  const [marketStatus, setMarketStatus] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<{current: number, total: number, symbol: string}>({current: 0, total: 0, symbol: ''});
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  // Move defaultStocks outside component or memoize it
  const defaultStocks = useMemo(() => ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'], []);

  // Get today's date in YYYY-MM-DD format
  const getTodayDateString = useCallback((): string => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Cache management functions
  const saveToCache = useCallback((data: StockData[], marketStatusParam: string) => {
    const cacheData: CachedData = {
      stocks: data,
      marketStatus: marketStatusParam,
      lastFetchDate: getTodayDateString(),
      lastFetchTime: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    setLastUpdateTime(Date.now());
  }, [getTodayDateString]);

  const loadFromCache = useCallback((): CachedData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data: CachedData = JSON.parse(cached);
        return data;
      }
    } catch (error) {
      console.error('Error loading cache:', error);
    }
    return null;
  }, []);

  // Check if cache is valid for today
  const isCacheValidForToday = useCallback((cached: CachedData): boolean => {
    return cached.lastFetchDate === getTodayDateString();
  }, [getTodayDateString]);

  const fetchStockData = useCallback(async (ticker: string): Promise<StockData | null> => {
    try {
      console.log(`Fetching ${ticker} data from Polygon.io...`);
      const data: PolygonPreviousClose = await polygonApi.getPreviousClose(ticker);
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const change = result.c - result.o;
        const changePercent = ((change / result.o) * 100);
        
        // Fix timestamp handling for Eastern Time
        const timestamp = result.t;
        // Polygon API returns timestamps in milliseconds
        const date = new Date(timestamp);
        
        // Format with Eastern Time zone and full date/time
        const lastUpdated = date.toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        
        const stockInfo: StockData = {
          symbol: ticker.toUpperCase(),
          price: result.c,
          change: change,
          changePercent: changePercent,
          volume: result.v,
          high: result.h,
          low: result.l,
          open: result.o,
          lastUpdated: lastUpdated,
          cachedAt: Date.now(),
        };

        return stockInfo;
      }
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error);
      throw error;
    }
    return null;
  }, []);

  const checkMarketStatus = useCallback(async () => {
    try {
      const status = await polygonApi.getMarketStatus();
      setMarketStatus(status.market);
    } catch (error) {
      console.error('Failed to get market status:', error);
    }
  }, []);

  const loadDefaultStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newStockData: StockData[] = [];
      
      // Load only up to MAX_STOCKS
      const stocksToLoad = defaultStocks.slice(0, MAX_STOCKS);
      
      console.log('Loading default stocks from Polygon.io...');
      
      // Sequential loading to respect rate limits
      for (let i = 0; i < stocksToLoad.length; i++) {
        const ticker = stocksToLoad[i];
        setLoadingProgress({current: i + 1, total: stocksToLoad.length, symbol: ticker});
        
        try {
          const stockInfo = await fetchStockData(ticker);
          if (stockInfo) {
            newStockData.push(stockInfo);
          }
        } catch (error) {
          console.error(`Failed to load ${ticker}:`, error);
          // Continue with next stock even if one fails
        }
      }
      
      // Save to cache
      setStockData(newStockData);
      saveToCache(newStockData, marketStatus);
      
    } catch (error) {
      console.error('Failed to load default stocks:', error);
      setError('Failed to load default stocks');
    } finally {
      setLoading(false);
      setLoadingProgress({current: 0, total: 0, symbol: ''});
    }
  }, [defaultStocks, fetchStockData, marketStatus, saveToCache]); // Add defaultStocks to dependencies

  const handleAddStock = useCallback(async () => {
    if (symbol.trim()) {
      if (stockData.length >= MAX_STOCKS) {
        setError(`Maximum ${MAX_STOCKS} stocks allowed. Remove a stock before adding a new one.`);
        return;
      }

      setLoading(true);
      setError(null);
      setLoadingProgress({current: 1, total: 1, symbol: symbol.trim()});
      
      try {
        const stockInfo = await fetchStockData(symbol.trim());
        if (stockInfo) {
          const updatedStocks = [...stockData, stockInfo];
          setStockData(updatedStocks);
          saveToCache(updatedStocks, marketStatus);
        }
        setSymbol('');
      } catch (error) {
        console.error('Failed to add stock:', error);
        setError(`Failed to fetch data for ${symbol}. Please check the symbol and try again.`);
      } finally {
        setLoading(false);
        setLoadingProgress({current: 0, total: 0, symbol: ''});
      }
    }
  }, [symbol, stockData, fetchStockData, marketStatus, saveToCache]);

  const handleRemoveStock = useCallback((symbolToRemove: string) => {
    const updatedStocks = stockData.filter(stock => stock.symbol !== symbolToRemove);
    setStockData(updatedStocks);
    saveToCache(updatedStocks, marketStatus);
  }, [stockData, marketStatus, saveToCache]);

  const refreshAllStocks = useCallback(async () => {
    if (stockData.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const symbols = stockData.map(stock => stock.symbol);
      const newStockData: StockData[] = [];
      
      console.log('Manually refreshing all stock prices...');
      
      // Sequential refresh to respect rate limits
      for (let i = 0; i < symbols.length; i++) {
        const ticker = symbols[i];
        setLoadingProgress({current: i + 1, total: symbols.length, symbol: ticker});
        
        try {
          const stockInfo = await fetchStockData(ticker);
          if (stockInfo) {
            newStockData.push(stockInfo);
          }
        } catch (error) {
          console.error(`Failed to refresh ${ticker}:`, error);
          // Keep old data if refresh fails
          const oldStock = stockData.find(s => s.symbol === ticker);
          if (oldStock) {
            newStockData.push(oldStock);
          }
        }
      }
      
      // Update cache with new data
      setStockData(newStockData);
      saveToCache(newStockData, marketStatus);
      
    } catch (error) {
      console.error('Failed to refresh stock data:', error);
      setError('Failed to refresh stock data');
    } finally {
      setLoading(false);
      setLoadingProgress({current: 0, total: 0, symbol: ''});
    }
  }, [stockData, fetchStockData, marketStatus, saveToCache]);

  // Initialize component
  useEffect(() => {
    const initializeData = async () => {
      // First, try to load from cache
      const cached = loadFromCache();
      
      if (cached && cached.stocks.length > 0) {
        // Check if cache is for today
        if (isCacheValidForToday(cached)) {
          // Load cached data immediately for instant display
          console.log('Prices read from cache');
          setStockData(cached.stocks);
          setMarketStatus(cached.marketStatus);
          setLastUpdateTime(cached.lastFetchTime);
          
          // Check market status if it's been a while (but don't refresh prices)
          if (Date.now() - cached.lastFetchTime > 300000) { // 5 minutes
            await checkMarketStatus();
          }
        } else {
          // Cache is from a previous day, need fresh data
          console.log('Cache is from previous day, fetching fresh data...');
          await loadDefaultStocks();
          await checkMarketStatus();
        }
      } else {
        // No cache, load fresh data
        console.log('No cache found, loading fresh data...');
        await loadDefaultStocks();
        await checkMarketStatus();
      }
    };

    initializeData();
  }, [isCacheValidForToday, loadDefaultStocks, checkMarketStatus, loadFromCache]);

  const formatVolume = useCallback((volume: number) => {
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
  }, []);

  const formatLastUpdate = useCallback((timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }, []);

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
          {lastUpdateTime > 0 && (
            <Chip 
              label={`Updated: ${formatLastUpdate(lastUpdateTime)}`} 
              color="info" 
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
            disabled={stockData.length >= MAX_STOCKS}
          />
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
            onClick={handleAddStock}
            disabled={loading || !symbol.trim() || stockData.length >= MAX_STOCKS}
          >
            Add Stock
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshAllStocks}
            disabled={loading || stockData.length === 0}
          >
            Refresh Prices
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
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Prices are cached daily. Use &quot;Refresh Prices&quot; button to get latest data.
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Daily Cache:</strong> Prices are automatically refreshed when you visit this page on a new day. 
          Use the &quot;Refresh Prices&quot; button to manually update. Maximum {MAX_STOCKS} stocks.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {stockData.map((stock) => (
          <Grid key={stock.symbol} sx={{ width: { xs: '100%', sm: '50%', md: '33.333%', lg: '20%' } }}>
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
                  <Stack direction="row" spacing={0.5}>
                    <Chip
                      icon={stock.change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      label={`${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`}
                      color={stock.change >= 0 ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip
                      icon={<DeleteIcon />}
                      onClick={() => handleRemoveStock(stock.symbol)}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'error.light', color: 'white' }
                      }}
                    />
                  </Stack>
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
                  <Grid sx={{ width: '50%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Open
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${stock.open.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid sx={{ width: '50%' }}>
                    <Typography variant="caption" color="text.secondary">
                      High
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${stock.high.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid sx={{ width: '50%' }}>
                    <Typography variant="caption" color="text.secondary">
                      Low
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ${stock.low.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid sx={{ width: '50%' }}>
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