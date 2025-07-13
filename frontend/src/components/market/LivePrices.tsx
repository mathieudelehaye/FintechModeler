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
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  volume: number;
  marketCap?: string;
}

const LivePrices: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState('');

  // Enhanced mock data
  const mockStockData: StockData[] = [
    {
      symbol: 'AAPL',
      price: 186.40,
      change: 2.15,
      changePercent: 1.17,
      volume: 45234567,
      marketCap: '2.85T',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      symbol: 'GOOGL',
      price: 2847.50,
      change: -15.30,
      changePercent: -0.53,
      volume: 1234567,
      marketCap: '1.72T',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      symbol: 'MSFT',
      price: 414.75,
      change: 8.25,
      changePercent: 2.03,
      volume: 23456789,
      marketCap: '3.08T',
      lastUpdated: new Date().toLocaleTimeString(),
    },
  ];

  const fetchStockData = async (ticker: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStockData = {
        symbol: ticker.toUpperCase(),
        price: Math.random() * 1000 + 50,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 50000000),
        marketCap: `${(Math.random() * 3 + 0.5).toFixed(2)}T`,
        lastUpdated: new Date().toLocaleTimeString(),
      };
      
      setStockData(prev => {
        const existing = prev.find(stock => stock.symbol === ticker.toUpperCase());
        if (existing) {
          return prev.map(stock => 
            stock.symbol === ticker.toUpperCase() ? newStockData : stock
          );
        }
        return [...prev, newStockData];
      });
    } catch (err) {
      setError('Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setStockData(mockStockData);
    
    const interval = setInterval(() => {
      setStockData(prev => prev.map(stock => ({
        ...stock,
        price: Math.max(stock.price + (Math.random() - 0.5) * 2, 1),
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 3,
        lastUpdated: new Date().toLocaleTimeString(),
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAddStock = () => {
    if (symbol.trim()) {
      fetchStockData(symbol.trim());
      setSymbol('');
    }
  };

  const formatVolume = (volume: number) => {
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
        <Chip 
          icon={<RefreshIcon />} 
          label="Auto-updating every 5s" 
          color="primary" 
          variant="outlined" 
          size="small" 
        />
      </Stack>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="Add Stock Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            size="small"
            placeholder="e.g., TSLA, NVDA"
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
            onClick={handleAddStock}
            disabled={loading || !symbol.trim()}
          >
            Add Stock
          </Button>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
                      Market Cap: {stock.marketCap}
                    </Typography>
                  </Box>
                  <Chip
                    icon={stock.change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    label={`${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`}
                    color={stock.change >= 0 ? 'success' : 'error'}
                    size="small"
                  />
                </Stack>
                
                <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 700 }}>
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

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Volume
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatVolume(stock.volume)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {stock.lastUpdated}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LivePrices;