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
  private baseURL = '/api/stocks';

  async getCurrentPrice(symbol: string) {
    const url = `${this.baseURL}/${symbol}/current`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getAggregates(symbol: string, multiplier: number, timespan: string, from: string, to: string) {
    const url = `${this.baseURL}/${symbol}/aggregates?multiplier=${multiplier}&timespan=${timespan}&from=${from}&to=${to}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

export const polygonApi = new PolygonApiService();