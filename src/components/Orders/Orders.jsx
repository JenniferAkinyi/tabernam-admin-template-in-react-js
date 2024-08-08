import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Orders.css'; 

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Reference to the orders collection
        const ordersRef = collection(db, 'Orders', 'Customer', 'order');
        const ordersSnapshot = await getDocs(ordersRef);

        //process orders
        const ordersList = ordersSnapshot.docs.map(doc => {
          const data = doc.data();
          const products = data.products || [];  
        
        //get the names
        const productNames = products.map(products => products.productName).join(', ');

        //sum item count
        const itemCount = products.reduce((total, product) => total + parseInt(product.itemCount, 10), 0);
          
        return {
          id: doc.id,
          ...data,
          products: productNames,
          itemCount
        }
      });
      // Sort the orders by orderDate in descending order (most recent first)
      const sortedOrders = ordersList.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        setOrders(sortedOrders);
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
    <div className='orders-container'>
      <h1>Customer Orders</h1>
      <table className='orders-table'>
        <thead>
          <tr>
            <th>Product Names</th>
            <th>Order Date</th>
            <th>Email</th>
            <th>Number of Items</th>
            <th>Order ID</th>
            <th>Order Address</th>
            <th>Payment Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.products}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{order.emailAddress}</td>
              <td>{order.itemCount}</td>
              <td>{order.orderId}</td>
              <td>{order.orderAddress}</td>
              <td>{order.paymentNumber}</td>
              <td>
                { order.distributor === "none" ?(
                  <Link to={`/processing/${order.id}`}>Process</Link>
                ) : (
                  <span>To Be Delivered</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
