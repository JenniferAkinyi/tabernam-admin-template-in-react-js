import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = () => {
  const [soldQuantity, setSoldQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reference to the collection in Firestore
        const productsRef = collection(db, 'Products', 'Fertilizer', 'Available');
        const productsSnapshot = await getDocs(productsRef);

        // Sum all soldQuantity values
        const soldQuantity = productsSnapshot.docs.reduce((total, doc) => {
          const data = doc.data();
          // Convert soldQuantity to a number
          const quantity = Number(data.soldQuantity) || 0;
          return total + quantity;
          }, 0);

        setSoldQuantity(soldQuantity);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reference to the collection in Firestore
        const productsRef = collection(db, 'SalesReport','2024-06-17', 'Items');
        const productsSnapshot = await getDocs(productsRef);

        // Sum all soldQuantity values
        const totalPrice = productsSnapshot.docs.reduce((total, doc) => {
          const data = doc.data();
          // Convert soldQuantity to a number
          const sales = Number(data.totalPrice) || 0;
          return total + sales;
          }, 0);

        setTotalPrice(totalPrice);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        percentFillValue={80}
        cardInfo={{
          title: "Total Bags Sold",
          value: `${soldQuantity}`,
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        percentFillValue={50}
        cardInfo={{
          title: "Total Revenue",
          value: `KSh.${totalPrice}`,
          
        }}
      />
    </section>
  );
};

export default AreaCards;
