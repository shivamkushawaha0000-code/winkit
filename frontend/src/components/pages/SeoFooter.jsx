import React from "react";
import { Link } from "react-router-dom";
import { slugify } from "../../utils/urlHelper";
import "../css/SeoFooter.css";
import { capitalizeWords } from "../../utils/camelCase";

const SeoFooter = ({ activeCategory, categories = [] }) => {
  const catName = activeCategory ? activeCategory.name : "Groceries";
  const footerCategories = categories.slice(0, 15); // Show more categories here since we have space

  return (
    <div className="seo-footer-container">
      {/* 1. Dynamic SEO Text Block */}
      <div className="seo-category-desc">
        <h2>Buy {catName} Online</h2>
        <p>
          Order {catName} online from Winkit and get them delivered to your
          doorstep in minutes. We offer a wide variety of{" "}
          {catName.toLowerCase()} products to choose from including top brands
          and local favorites.
        </p>
        <p>
          Shop for {catName} at the best prices. Whether you are looking for
          premium brands or everyday essentials, we have it all covered. Enjoy
          superfast delivery and high-quality products guaranteed.
        </p>
      </div>      
    </div>
  );
};

export default SeoFooter;
