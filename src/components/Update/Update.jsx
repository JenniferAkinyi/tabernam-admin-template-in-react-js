import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import './Update.css'; 

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "0",
    addQuantity: "0",
    category: "",
    pictureUrl: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "Products/Fertilizer/Available", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "Products/Fertilizer/Available", id);
    const updatedQuantity = (parseInt(product.quantity) + (parseInt(product.addQuantity) || 0)).toString();
    await updateDoc(docRef, { ...product, quantity: updatedQuantity });
    navigate('/products'); 
  };

  const handleDelete = async () => {
    const docRef = doc(db, "Products/Fertilizer/Available", id);
    await deleteDoc(docRef);
    navigate('/products')
  };

  return (
    <div className="update-product">
      <h1>Update Product</h1>
      <form onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />
        <label>Price</label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
        />
        <label>Current Quantity</label>
        <input
          type="text"
          name="quantity"
          placeholder="Quantity"
          value={product.quantity}
          onChange={handleChange}
          readOnly
          required
        />
        <label>Add Quantity</label>
        <input
          type="text"
          name="addQuantity"
          placeholder="Add Quantity"
          value={product.addQuantity}
          onChange={handleChange}
          required
        />
        <label>Category</label>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          required
        />
        <div className="button-group">
          <button type="submit">Update</button>
          <button type="button" onClick={handleDelete} className="delete-button">Delete</button>
        </div>
      </form>
    </div>
  );
};

export default Update;
