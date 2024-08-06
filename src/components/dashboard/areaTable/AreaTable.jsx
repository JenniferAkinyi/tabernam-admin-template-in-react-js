import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import AreaTableAction from "./AreaTableAction";
import './AreaTable.scss'; 

const TABLE_HEADS = [
  "Product Name",
  "Item ID",
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
                  <td>{order.productName}</td>
                  <td>{order.itemId}</td>
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
