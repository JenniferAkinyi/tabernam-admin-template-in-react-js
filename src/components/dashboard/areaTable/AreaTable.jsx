import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import AreaTableAction from "./AreaTableAction";
import './AreaTable.scss'; 

const TABLE_HEADS = [
  "Product Names",
  "Order ID",
  "Date",
  "Email Address",
  "Payment Number",
];

const AreaTable = () => {
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
          
        return {
          id: doc.id,
          ...data,
          products: productNames,
          
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
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Latest Orders</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              // Ensure these fields are properly named in your data
              return (
                <tr key={order.id}>
                  <td>{order.products}</td>
                  <td>{order.orderId}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>{order.emailAddress}</td>
                  <td>{order.paymentNumber}</td>
                  <td className="dt-cell-action">
                    <AreaTableAction orderId={order.id}/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;
