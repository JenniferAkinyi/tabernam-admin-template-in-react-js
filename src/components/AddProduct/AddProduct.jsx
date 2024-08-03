import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './AddProduct.css'; 

const AddProduct = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
    soldQuantity: 0
  });
  const navigate = useNavigate();
  const storage = getStorage();

  useEffect(() => {
    const fetchCategories = async() => {
        const querySnapshot = await getDocs(collection(db, "Products/Fertilizer/Categories"));
        const categoriesList = querySnapshot.docs.map(doc => doc.data().name);
        setCategories(categoriesList)
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `shop/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const saveProductWithImage = async () => {
    const imageUrl = await uploadImage(selectedFile);
    const newProductRef = doc(collection(db, "Products/Fertilizer/Available"));
    const productWithImage = { 
        ...newProduct, 
        image: imageUrl,
        itemId: newProductRef.id
    };
    await setDoc(newProductRef, productWithImage);
    navigate('/products'); // Redirect to products page after adding the product
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProductWithImage();
  };

  return (
    <div className="add-product">
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="file" onChange={handleFileChange} required />
        <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} required />
        <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleInputChange} required></textarea>
        <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} required />
        <input type="number" name="quantity" placeholder="Quantity" value={newProduct.quantity} onChange={handleInputChange} required />
        <select  name="category" value={newProduct.category} onChange={handleInputChange} required>
            <option value=''>Select Category </option>
            {categories.map((category, index) =>(
                <option key={index} value={category}>{category}</option>
            ))}
        </select>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
