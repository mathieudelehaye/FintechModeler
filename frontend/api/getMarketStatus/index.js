const { app } = require('@azure/functions');

app.http('getMarketStatus', {
    methods: ['GET'],
    route: 'market/status',
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const apiKey = process.env.POLYGON_API_KEY;
        
        if (!apiKey) {
            return {
                status: 500,
                jsonBody: { error: 'API key not configured' }
            };
        }

        try {
            const url = `https://api.polygon.io/v1/marketstatus/now?apikey=${apiKey}`;
            const response = await fetch(url);
            
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