import React, { useEffect, useState } from 'react';

interface OptionData {
    id: number;
    name: string;
    type: string;
    price: number;
}

const Variability: React.FC = () => {
    const [data, setData] = useState<OptionData[] | null>(null); // Expecting an array
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const url = 'https://localhost:7200/api/Options/price';
        const payload = {
            expiryTime: 2,
            periodNumber: 8,
            volatility: 0.3,
            continuousRfRate: 0.04,
            initialSharePrice: 50,
            strikePrice: 60,
        };

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`Error after fetch: ${response.status}`);
          }

          const result: OptionData[] = await response.json(); // Expecting an array
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