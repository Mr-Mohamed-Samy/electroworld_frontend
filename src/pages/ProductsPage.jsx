import { useParams } from "react-router-dom";
import ProductCard from "../pages/ProductCard";
import "../styles/ProductsPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ProductsPage({ searchTerm }) {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/product?limit=1000`);
        const allProducts = response.data.data;
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    document.title = `Category: ${category}`;
  }, [category]);

  if (loading) return <div>Loading...</div>;

  const normalize = (str) =>
    str?.toLowerCase().replace(/[\s_]+/g, "-").trim();

  const normalizedCategory = normalize(category);

  const filteredProducts = products.filter((product) => {
    const productCategory = normalize(product.category);

    const matchesCategory =
      normalizedCategory === "all" || productCategory === normalizedCategory;

    const price = parseFloat(product.price);
    const matchesPrice =
      (!minPrice || price >= parseFloat(minPrice)) &&
      (!maxPrice || price <= parseFloat(maxPrice));

    const rating = Number(product.ratingsAverage) || 0;
    const matchesRating =
      !selectedRating || rating >= parseInt(selectedRating);

    const matchesSearch =
      !searchTerm || product.title.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesCategory &&
      matchesPrice &&
      matchesRating &&
      matchesSearch
    );
  });

  return (
    <div className="products-page-container">
      <div className="filters-sidebar">
        <div className="filter-group">
          <h4>Price</h4>
          <div>
            <div>
              <input
                type="radio"
                name="price"
                onChange={() => {
                  setMinPrice("");
                  setMaxPrice("200");
                }}
              />
              <label>Less than 2000 DA</label>
            </div>
            <div>
              <input
                type="radio"
                name="price"
                onChange={() => {
                  setMinPrice("200");
                  setMaxPrice("800");
                }}
              />
              <label>2000 DA - 8000 DA</label>
            </div>
            <div>
              <input
                type="radio"
                name="price"
                onChange={() => {
                  setMinPrice("800");
                  setMaxPrice("3400");
                }}
              />
              <label>8000 DA - 34000 DA</label>
            </div>
            <div>
              <input
                type="radio"
                name="price"
                onChange={() => {
                  setMinPrice("3400");
                  setMaxPrice("");
                }}
              />
              <label>More than 34000 DA</label>
            </div>
          </div>
          <div style={{ marginTop: "10px" }}>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{ width: "45%", marginRight: "5%" }}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ width: "45%" }}
            />
          </div>
        </div>

        <div className="filter-group">
          <h4>Rating</h4>
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars}>
              <input
                type="radio"
                name="rating"
                value={stars}
                checked={selectedRating === stars.toString()}
                onChange={(e) => setSelectedRating(e.target.value)}
              />
              <label>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} style={{ color: i < stars ? "#ffc107" : "#ddd" }}>
                    ★
                  </span>
                ))}{" "}
                & Up
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="product-content">
        <h2>{category.replace(/-/g, " ")}</h2>
        <div className="product-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                title={product.title}
                image={product.images?.[0]}
                price={product.price}
                rating={Number(product.ratingsAverage) || 0}
              />
            ))
          ) : (
            <p>No products found in this category</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductsPage;
