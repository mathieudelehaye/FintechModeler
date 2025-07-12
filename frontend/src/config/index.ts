const config = {
  apiUrl: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080'
    : 'https://fintechmodeler-backend.wittyflower-c2822a5a.eastus.azurecontainerapps.io'
};

export default config;