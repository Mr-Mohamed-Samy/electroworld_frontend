import React, { useEffect, useState } from "react";
import "../styles/Products.css";
import axios from "axios";
import ProductModal from "../compoents/ProductModal.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const token = localStorage.getItem("token");
  console.log("Token:", token);
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/product?limit=1000", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else {
        toast.error("Failed to fetch products.");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (formData, isEdit, id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEdit) {
        await axios.put(`http://localhost:8000/api/product/${id}`, formData, config);
        toast.success("Product updated successfully.");
      } else {
        await axios.post("http://localhost:8000/api/product", formData, config);
        toast.success("Product added successfully.");
      }

      fetchProducts();
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to save product: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8000/api/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Product deleted successfully.");
        fetchProducts();
      } catch (err) {
        toast.error("Failed to delete product: " + err.message);
      }
    }
  };

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products.filter((product) => {
    return (
      product.title?.toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory ? product.category === filterCategory : true)
    );
  });

  return (
    <div className="products-container">
      <h1 className="page-title" style={{color:"white"}}>Products</h1>
      <button
        onClick={() => {
          setModalOpen(true);
          setEditingProduct(null);
        }}
      >
        + Add Product
      </button>

      <div className="filters">
        
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Category</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7">No products found.</td>
            </tr>
          ) : (
            filtered.map((product) => (
              <tr key={product._id}>
                <td>
                  <img src={product.images?.[0]} width="50" alt={product.title} />
                </td>
                <td>{product.title}</td>
                <td>{product.price} DA</td>
                <td>{product.quantity ?? "-"}</td>
                <td>{product.category}</td>
                <td>{product.ratingsAverage ?? "-"}</td>
                <td className="actions">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingProduct}
      />
    </div>
  );
};

export default Products;
