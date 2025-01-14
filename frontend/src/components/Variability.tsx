import React, { useEffect, useState } from 'react';

interface OptionPriceData {
    id: string;
    name: string;
    price: number;
}
  
const Variability: React.FC = () => {
    const [data, setData] = useState<OptionPriceData[] | null>(null); // Expecting an array
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://localhost:7200/api/Products');          
          if (!response.ok) {
            throw new Error(`Error after fetch: ${response.statusText}`);
          }

          const result: OptionPriceData[] = await response.json(); // Expecting an array
          console.log('Fetched data:', result);
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
        {data && (
          <div>
            <h1>{data[0].name} call option</h1>
            <div>
              <p>Price: {data[0].price}</p>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Variability;