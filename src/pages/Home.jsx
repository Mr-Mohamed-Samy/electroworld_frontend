import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import CategoryCard from "../compoents/CategoryCard.jsx";
import ProductCard from "../pages/ProductCard.jsx";
import Phone from "../assets/iphone.png";
import tablet from "../assets/ipadd.webp";
import laptop from "../assets/lap.png";
import manette from "../assets/manette.webp";
import power from "../assets/headd.png";
import fastDeliveryIcon from "../assets/fast.png";
import supportIcon from "../assets/bp.png";
import qualityIcon from "../assets/quality.png";

import img1 from "../assets/ps5.jpeg";
import img2 from "../assets/app.webp";
import img3 from "../assets/ss.jpg";
import img4 from "../assets/coupon.png";
import "../styles/Home.css";
import { toast } from "react-toastify";
import "../styles/slick-theme.css";

function Home({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);

  const PRODUCTS_PER_PAGE = 20;
  
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/product?limit=1000");
      if (Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        throw new Error("Invalid product data");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again later.");
      setProducts([]);
    }
  };

  fetchProducts();
  window.scrollTo(0, 0);
}, []);
 
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
    setPage(1);
  }, [searchTerm, products]);

  useEffect(() => {
    window.scrollTo({ top: 1200, behavior: "smooth" });
  }, [page]);

  const paginatedProducts = Array.isArray(filteredProducts)
    ? filteredProducts.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE)
    : [];

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  const carouselImages = [img4,img1, img2, img3];
  const features = [
    { icon: fastDeliveryIcon, text: "Fast Delivery" },
    { icon: supportIcon, text: "Best Prise" },
    { icon: qualityIcon, text: "Quality Guaranteed" },
  ];


  return (
    <>
      <div className="carousel-container">
        <Slider {...carouselSettings}>
          {carouselImages.map((img, index) => (
            <div key={index}>
              <img src={img} alt={`Slide ${index + 1}`} className="carousel-image" />
            </div>
          ))}
        </Slider>
      </div>

      <div className="features-container">
        {features.map(({ icon, text }, index) => (
          <div key={index} className="feature-item">
            <img src={icon} alt={text} className="feature-icon" />
            <p>{text}</p>
          </div>
        ))}
      </div>
        
      <h1>Categories</h1>
      <div className="categories">
        <CategoryCard category="Mobile Phones" logo={Phone} />
        <CategoryCard category="Tablets & iPads" logo={tablet} />
        <CategoryCard category="Laptops & Computers" logo={laptop} />
        <CategoryCard category="Gaming" logo={manette} />
        <CategoryCard category="Headphones & Speakers" logo={power} />
      </div>                      

      <h1>{searchTerm ? `Search Results for "${searchTerm}"` : "All Products"}</h1>
      <div className="AllItems">
        <div className="item-list">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                title={product.title}
                image={product.images[0]}
                price={product.price}
              />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>

        <div className="pagination-controls">
          <button onClick={() => setPage((p) => (p > 1 ? p - 1 : p))} disabled={page === 1}>
            &#8592; Previous
          </button>
          <span>
            {page} / {Math.ceil((filteredProducts?.length || 0) / PRODUCTS_PER_PAGE)}
          </span>
          <button
            onClick={() =>
              setPage((p) =>
                p < Math.ceil((filteredProducts?.length || 0) / PRODUCTS_PER_PAGE) ? p + 1 : p
              )
            }
            disabled={page === Math.ceil((filteredProducts?.length || 0) / PRODUCTS_PER_PAGE)}
          >
            Next &#8594;
          </button>
        </div>
      </div>


    </>
  );
}

export default Home;