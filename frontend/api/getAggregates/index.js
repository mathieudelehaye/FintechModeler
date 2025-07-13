const { app } = require('@azure/functions');

app.http('getAggregates', {
    methods: ['GET'],
    route: 'stocks/{ticker}/aggregates',
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const ticker = request.params.ticker;
        const { multiplier = 1, timespan = 'day', from, to } = request.query;
        
        const apiKey = process.env.POLYGON_API_KEY;
        
        if (!apiKey) {
            return {
                status: 500,
                jsonBody: { error: 'API key not configured' }
            };
        }

        if (!ticker || !from || !to) {
            return {
                status: 400,
                jsonBody: { error: 'ticker, from, and to parameters required' }
            };
        }

        try {
            const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}?apikey=${apiKey}`;
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