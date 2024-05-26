import React, { useEffect, useState } from 'react';

// interface VariabilityData {
//     start_month: number;
//     end_month: number;
//     stock_name: string;
//     average_variability: string;
// }
  
interface VariabilityData {
    quote: string;
}
  
const Variability: React.FC = () => {
    const [data, setData] = useState<VariabilityData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
        //   const response = await fetch('http://127.0.0.1:5000/variability?start_month=6&end_month=2&stock_name=AAPL');
          const response = await fetch('https://api.kanye.rest');
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const result: VariabilityData = await response.json();
          setData(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    return (
      <div>
        <h1>Variability Data</h1>
        {data && (
          <div>
            <p>Quote: {data.quote}</p>
            {/* <p>Start Month: {data.start_month}</p>
            <p>End Month: {data.end_month}</p>
            <p>Stock Name: {data.stock_name}</p> */}
          </div>
        )}
      </div>
    );
  };
  
  export default Variability;