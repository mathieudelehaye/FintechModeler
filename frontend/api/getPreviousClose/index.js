const { app } = require('@azure/functions');

app.http('getPreviousClose', {
    methods: ['GET'],
    route: 'stocks/{ticker}/previous-close',
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const ticker = request.params.ticker;
        
        // Get API key from environment (secure server-side)
        const apiKey = process.env.POLYGON_API_KEY;
        
        if (!apiKey) {
            return {
                status: 500,
                jsonBody: { error: 'API key not configured' }
            };
        }

        if (!ticker) {
            return {
                status: 400,
                jsonBody: { error: 'Ticker parameter required' }
            };
        }

        try {
            // Call Polygon API with server-side key
            const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apikey=${apiKey}`;
            const response = await fetch(url);
            
            if (response.status === 429) {
                return {
                    status: 429,
                    jsonBody: { error: 'Rate limit exceeded. Please try again later.' }
                };
            }
            
            if (!response.ok) {
                return {
                    status: response.status,
                    jsonBody: { error: `Polygon API error: ${response.statusText}` }
                };
            }
            
            const data = await response.json();
            
            // Return data with CORS headers
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS'
                },
                jsonBody: data
            };
            
        } catch (error) {
            context.log('Error calling Polygon API:', error);
            return {
                status: 500,
                jsonBody: { error: 'Internal server error' }
            };
        }
    }
});