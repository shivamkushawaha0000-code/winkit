import React from "react";
import { Link } from "react-router-dom"; // Import Link
import { slugify } from "../../utils/urlHelper"; // Import your helper
import "../css/Sidebar.css";

const Sidebar = ({ categories, activeCategoryId }) => {
  return (
    <nav className="sidebar-wrapper">
      <ul className="category-list">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className={`category-item ${
              activeCategoryId === cat._id ? "active" : ""
            }`}
          >
            <Link
              to={`/cn/${slugify(cat.name)}/cid/${cat._id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                width: "100%",
              }}
            >
              <div className="cat-img-box">
                <img src={cat.image} alt={cat.name} />
              </div>
              <span className="cat-name">{cat.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
