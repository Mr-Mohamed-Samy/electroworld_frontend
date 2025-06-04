import { Link } from "react-router-dom";
import "../styles/CategoryCard.css"; 

function CategoryCard({ category, logo }) {
  return (
    <Link to={`/products/category/${category.toLowerCase().replace(/\s+/g, "-")}`}>
    <div className="category-card">
      <img src={logo} alt={category} />
      <p>{category}</p>
    </div>
    </Link>
  );
}

export default CategoryCard;
