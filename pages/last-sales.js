import React, { useEffect, useState } from "react";
import useSWR from 'swr';

const LastSalesPage = () => {
  const [sales, setSales] = useState();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch("https://nextjs-course-4fbc3-default-rtdb.firebaseio.com/sales.json")
      .then((response) => response.json())
      .then((data) => {
        
        const transformedSales = [];

        for (const key in data) {
          transformedSales.push({
            id: key,
            username: data[key].username,
            volume: data[key].volume,
          });

        }
        setSales(transformedSales);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>
  }

  if (!sales) {
    return <p>No Data yet!</p>
  }

  return (
        <ul>
            {
                sales?.map(sale => (
                    <li key={sale.id}>
                        {sale.username} - ${sale.volume}
                    </li>
                ))
            }
        </ul>
    );
};

export default LastSalesPage;
