const config = {
  apiUrl: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080'
    : 'https://backend20250103203956.azurewebsites.net'
};

export default config;