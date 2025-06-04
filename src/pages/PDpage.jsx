import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProductDetails from "./ProductDetails.jsx";
import "../styles/ProductDetails.css";
import Comment from "../compoents/Comment.jsx";
import { toast } from "react-toastify";

function PDpage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const normalize = (str) =>
    str?.toLowerCase().replace(/[\s_]+/g, "-").trim();

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/product?limit=1000");
        const allProducts = res.data.data || [];
        const currentProduct = allProducts.find((p) => p._id === id);

        if (!currentProduct) {
          toast.error("Product not found.");
          return;
        }

        setProduct(currentProduct);

        const sameCategoryProducts = allProducts.filter(
          (p) =>
            normalize(p.category) === normalize(currentProduct.category) &&
            p._id !== id
        );

        setRelatedProducts(sameCategoryProducts);
      } catch (err) {
        console.error("Error fetching product or related items:", err);
        toast.error("Failed to load product or related items");
      }
    };
    fetchProductAndRelated();
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-page">
      <h1>Product Details</h1>
      <ProductDetails product={product} />

      <h2 className="title">Related Products</h2>
      <div className="related-products">
        {relatedProducts.length > 0 ? (
          relatedProducts.map((relatedProduct) => (
            <Link
              to={`/products/details/${relatedProduct._id}`}
              key={relatedProduct._id}
              className="related-product"
            >
              <img
                src={relatedProduct.images?.[0] || "https://via.placeholder.com/150"}
                alt={relatedProduct.title}
              />
              <h3>{relatedProduct.title}</h3>
              <p>${relatedProduct.price.toFixed(2)}</p>
            </Link>
          ))
        ) : (
          <p>No related products found.</p>
        )}
      </div>

      <Comment productId={id} />
    </div>
  );
}

export default PDpage;
