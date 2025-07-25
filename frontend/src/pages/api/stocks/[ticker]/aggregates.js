export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ticker, multiplier = '1', timespan = 'day', from, to } = req.query;
  
  // Get API key from environment (secure server-side)
  const apiKey = process.env.POLYGON_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker parameter required' });
  }

  if (!from || !to) {
    return res.status(400).json({ error: 'Both from and to date parameters are required (YYYY-MM-DD format)' });
  }

  try {
    // Call Polygon aggregates API
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}?apikey=${apiKey}`;
    const response = await fetch(url);
    
    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    
    if (!response.ok) {
      return res.status(response.status).json({ error: `Polygon API error: ${response.statusText}` });
    }
    
    const data = await response.json();
    
    // Return data with CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error calling Polygon aggregates API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}