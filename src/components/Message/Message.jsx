import React, { useState, useEffect } from 'react';
import './message.css';
import { db } from '../../firebase'; 
import { collection, getDocs } from "firebase/firestore";

const Message = () => {
  const [products, setProducts] = useState([]);
  const threshold = "30"; // Convert 30 to string

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "Products/Fertilizer/Available"));
      const fetchedProducts = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedProducts.push({
          id: doc.id,
          name: data.name,
          quantity: data.quantity,
        });
      });
      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, []);

  return (
    <div className="message-container">
      {products.map((product) => (
        product.quantity < parseInt(threshold) && (
          <div className="alert" key={product.id}>
            Warning: {product.name} quantity is below {threshold}.
          </div>
        )
      ))}
    </div>
  );
};

export default Message;
