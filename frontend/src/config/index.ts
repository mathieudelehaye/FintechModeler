console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

const config = {
  apiUrl: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080'
    : process.env.NEXT_PUBLIC_API_URL || 'https://fintechmodeler-backend.wittyflower-c2822a5a.eastus.azurecontainerapps.io'
};

export default config;