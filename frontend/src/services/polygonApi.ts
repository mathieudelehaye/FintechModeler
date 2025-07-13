const POLYGON_BASE_URL = 'https://api.polygon.io';
const API_KEY = process.env.NEXT_PUBLIC_POLY_API_KEY;

// Rate limiting configuration
const RATE_LIMIT_DELAY = 12000; // 12 seconds between requests (5 requests per minute)
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
    if (!API_KEY) {
      throw new Error('Polygon API key not configured');
    }

    const url = `${POLYGON_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}apikey=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait before making more requests.');
      }
      
      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes('429')) {
        throw new Error('Too many requests. Free tier allows 5 requests per minute.');
      }
      throw error;
    }
  }

  // Get previous day close for a stock (free tier) - now throttled
  async getPreviousClose(ticker: string): Promise<PolygonPreviousClose> {
    return this.throttledRequest<PolygonPreviousClose>(`/v2/aggs/ticker/${ticker}/prev`);
  }

  // Get aggregated data for time series (free tier - limited) - now throttled
  async getAggregates(
    ticker: string,
    multiplier: number = 1,
    timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day',
    from: string,
    to: string
  ): Promise<PolygonAggsResponse> {
    return this.throttledRequest<PolygonAggsResponse>(
      `/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}`
    );
  }

  // Get market status (free tier) - now throttled
  async getMarketStatus(): Promise<any> {
    return this.throttledRequest('/v1/marketstatus/now');
  }

  // Helper function to get date strings
  getDateString(daysAgo: number = 0): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  }
}

export const polygonApi = new PolygonApiService();