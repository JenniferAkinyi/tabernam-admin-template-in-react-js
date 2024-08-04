import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Ensure you import your Firebase config
import { collection, getDocs } from 'firebase/firestore';
import './Processing.css';

const Processing = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Reference to the orders collection
        const ordersRef = collection(db, 'Orders', 'Customer', 'order');
        const ordersSnapshot = await getDocs(ordersRef);
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="processing-container">
      <h1>Order Processing</h1>
      {orders.map(order => (
        <form key={order.id} className="order-form">
          <div className="form-group">
            <label>Email Address:</label>
            <input type="email" value={order.emailAddress} readOnly />
          </div>
          <div className="form-group">
            <label>Order Address:</label>
            <input type="text" value={order.orderAddress} readOnly />
          </div>
          <div className="form-group">
            <label>Product Name:</label>
            <input type="text" value={order.productName} readOnly />
          </div>
          <div className="form-group">
            <label>Payment Number:</label>
            <input type="text" value={order.paymentNumber} readOnly />
          </div>
          <div className="form-group">
            <label>Distributor:</label>
            <input type="text" value={order.distributor} readOnly />
          </div>
        </form>
      ))}
    </div>
  );
};

export default Processing;
