// Remove the direct API key - it will be handled server-side now
const RATE_LIMIT_DELAY = 12000; // Keep client-side rate limiting as backup
let lastRequestTime = 0;

export interface PolygonQuote {
  symbol: string;
  last_quote: {
    price: number;
    size: number;
    exchange: number;
    timestamp: number;
  };
  last_trade: {
    price: number;
    size: number;
    exchange: number;
    timestamp: number;
  };
  market_status: string;
}

export interface PolygonAgg {
  c: number; // close
  h: number; // high
  l: number; // low
  o: number; // open
  t: number; // timestamp
  v: number; // volume
  vw: number; // volume weighted average price
  n: number; // number of transactions
}

export interface PolygonAggsResponse {
  ticker: string;
  status: string;
  results: PolygonAgg[];
  resultsCount: number;
  adjusted: boolean;
}

export interface PolygonPreviousClose {
  ticker: string;
  status: string;
  results: Array<{
    T: string; // ticker
    c: number; // close
    h: number; // high
    l: number; // low
    o: number; // open
    t: number; // timestamp
    v: number; // volume
    vw: number; // volume weighted average price
  }>;
}

class PolygonApiService {
  private async throttledRequest<T>(endpoint: string): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      const waitTime = RATE_LIMIT_DELAY - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    lastRequestTime = Date.now();
    return this.makeRequest<T>(endpoint);
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    // Use the Azure Function endpoints instead of direct Polygon API
    const response = await fetch(endpoint);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait before making more requests.');
    }
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Get previous day close for a stock via Azure Function
  async getPreviousClose(ticker: string): Promise<PolygonPreviousClose> {
    return this.throttledRequest<PolygonPreviousClose>(`/api/stocks/${ticker}/previous-close`);
  }

  // Get aggregated data for time series via Azure Function
  async getAggregates(
    ticker: string,
    multiplier: number = 1,
    timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day',
    from: string,
    to: string
  ): Promise<PolygonAggsResponse> {
    const params = new URLSearchParams({
      multiplier: multiplier.toString(),
      timespan,
      from,
      to
    });
    return this.throttledRequest<PolygonAggsResponse>(`/api/stocks/${ticker}/aggregates?${params}`);
  }

  // Get market status via Azure Function
  async getMarketStatus(): Promise<{ market: string; [key: string]: unknown }> {
    return this.throttledRequest('/api/market/status');
  }

  // Helper function to get date strings
  getDateString(daysAgo: number = 0): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  }
}

export const polygonApi = new PolygonApiService();