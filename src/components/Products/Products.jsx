import React, { useState, useEffect } from "react";
import './Products.css';
import { db } from "../../firebase";
import { collection, getDocs,  } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';

const Products = () => {
    const [firebaseproducts, setFirebaseProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "Products/Fertilizer/Available"));
    const productsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFirebaseProducts(productsList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = firebaseproducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
)

    return (
    <div className="products">
        <div className="header">
            <h1>All Products</h1>
            <input
                type="text"
                placeholder="Search Products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
            />
            <button onClick={() => navigate('/addproduct')} className="add-product-button">Add Product</button>
            <div className="collections">
                {filteredProducts.map((product) => (
                <Link to={`/update/${product.id}`} key={product.id}>
                <div className="product-item">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <h2>{product.name}</h2>
                    <p>Price: Ksh.{product.price}</p>
                    <p>Category: {product.category}</p>
                    <p>Product ID: {product.id}</p>
                    <p>Quantity: {product.quantity}</p>
                    <p>Sold Quantity: {product.soldQuantity}</p>
                </div>
                </Link> 
                ))}
            
            </div>
        </div>
    </div>
  );
};
export default Products;
