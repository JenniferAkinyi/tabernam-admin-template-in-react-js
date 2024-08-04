import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

const AreaProgressChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reference to the collection in Firestore
        const productsRef = collection(db, 'Products', 'Fertilizer', 'Available');
        const productsSnapshot = await getDocs(productsRef);

        const soldQuantities = productsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            name: data.name, // Assuming each document has a 'name' field
            percentValues: data.soldQuantity || 0, // Adjust field name as needed
          };
        });

        // Sort by sold quantity in descending order
        soldQuantities.sort((a, b) => b.percentValues - a.percentValues);

        // Get the top 5 most sold items
        const topFive = soldQuantities.slice(0, 5);
        setData(topFive);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Most Sold Items</h4>
      </div>
      <div className="progress-bar-list">
        {data?.map((progressbar, index) => (
          <div className="progress-bar-item" key={index}>
            <div className="bar-item-info">
              <p className="bar-item-info-name">{progressbar.name}</p>
              <p className="bar-item-info-value">
                {progressbar.percentValues}
              </p>
            </div>
            <div className="bar-item-full">
              <div
                className="bar-item-filled"
                style={{
                  width: `${progressbar.percentValues}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaProgressChart;
