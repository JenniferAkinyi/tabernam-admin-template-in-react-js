import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import './Processing.css';

const Processing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [delivery, setDelivery] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, 'Orders', 'Customer', 'order', id);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const data = orderSnap.data();
          const products = data.products || [];

          // Get the names
          const productNames = products.map(product => product.productName).join(', ');
          
          setOrder({
            id: orderSnap.id,
            ...data,
            productNames
          });

          // Auto-select a delivery user based on order address
          autoSelectDelivery(data.orderAddress);
        } else {
          setError('Order not found.');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load the order. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchDelivery = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('roleValue', '==', 'Delivery'));
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDelivery(usersList);
      } catch (error) {
        console.error('Error fetching delivery users:', error);
        setError('Failed to load delivery users. Please try again.');
      }
    };

    fetchOrder();
    fetchDelivery();
  }, [id]);

  const autoSelectDelivery = (orderAddress) => {
    if (!orderAddress) return;
    const matchedUser = delivery.find(user => user.location && user.location.toLowerCase() === orderAddress.toLowerCase());
    if (matchedUser) {
      setSelectedDelivery(matchedUser.email);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDelivery) {
      setError('Please select a delivery user.');
      return;
    }

    try {
      const orderRef = doc(db, 'Orders', 'Customer', 'order', id);
      await updateDoc(orderRef, { distributor: selectedDelivery, served: '1' }); // Convert `served` to string
      navigate('/orders'); // Redirect to orders page after updating
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update order. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="processing-container">
      <h1>Order Processing</h1>
      {order && (
        <form key={order.id} className="order-form" onSubmit={handleSubmit}>
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
            <input type="text" value={order.productNames} readOnly />
          </div>
          <div className="form-group">
            <label>Payment Number:</label>
            <input type="text" value={order.paymentNumber} readOnly />
          </div>
          <div className="form-group">
            <label>Delivery:</label>
            <select 
              name="deliveryUser" 
              value={selectedDelivery} 
              onChange={(e) => setSelectedDelivery(e.target.value)} 
              required
            >
              <option value="">Select Delivery User</option>
              {delivery.map(user => (
                <option key={user.id} value={user.email}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default Processing;
