import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import { useState } from "react";
import { slugify } from "../../utils/urlHelper";
import ProductCard from "./ProductCard";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [heroBanner, setHeroBanner] = useState(null);
  const [secondBanners, setSecondBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Find targetUrl from dynamically
  const getBannerLink = (banner) => {
    if (banner.linkedCategory && banner.linkedCategory._id) {
      const { name, _id } = banner.linkedCategory;
      return `/cn/${slugify(name)}/cid/${_id}`;
    }

    return banner.targetUrl || "#";
  };

  // Scroll to top on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // A. Fetch Home Config (Banners & Categories)
        const homeRes = await fetch("http://localhost:5000/api/home");
        const homeResult = await homeRes.json();

        if (homeResult.success) {
          setHeroBanner(homeResult.data.heroBanner);
          setSecondBanners(homeResult.data.secondaryBanners);
          setCategories(homeResult.data.categories);
        }

        // B. NEW: Fetch All Products
        const prodRes = await fetch("http://localhost:5000/api/products");
        const prodResult = await prodRes.json();
        if (prodResult.success) {
          setProducts(prodResult.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []);

  const groupedProducts = useMemo(() => {
    if (!products.length) return {};

    return products.reduce((acc, product) => {
      let catName = "Others";

      // Handle populated object vs string ID
      if (product.category && typeof product.category === "object") {
        catName = product.category.name;
      } else if (product.category && typeof product.category === "string") {
        const found = categories.find((c) => c._id === product.category);
        if (found) catName = found.name;
      }

      if (!acc[catName]) {
        acc[catName] = [];
      }
      acc[catName].push(product);
      return acc;
    }, {});
  }, [products, categories]);

  return (
    <div className="home-container">
      <div className="main-content-wrapper">
        {/* 1. Dynamic Hero Banner */}
        <div className="first-banner">
          {heroBanner && (
            <Link to={getBannerLink(heroBanner)}>
              <img
                className="first-banner-img"
                src={heroBanner.image}
                alt={heroBanner.alt || "hero-banner"}
              />
            </Link>
          )}
        </div>

        {/* 2. Dynamic Secondary Banners */}
        <div className="second-banner">
          {secondBanners.map((banner, index) => (
            <Link
              to={getBannerLink(banner)}
              className="second-banner-link"
              key={index}
            >
              <img
                className="second-banner-img"
                src={banner.image}
                alt={banner.alt}
              />
            </Link>
          ))}
        </div>

        {/* 3. Dynamic Category Grid */}
        <div className="category-cards">
          {categories.map((category) => (
            <Link
              // CHANGE THIS LINE:
              to={`/cn/${slugify(category.name)}/cid/${category._id}`}
              key={category._id} // Better to use unique ID than index
              className="category-card"
            >
              <img
                className="category-card-img"
                src={category.image}
                alt={category.alt || category.name}
              />
            </Link>
          ))}
        </div>

        <div className="home-products-section">
          {Object.keys(groupedProducts).map((categoryName) => (
            <div key={categoryName} className="category-row">
              <div className="category-header">
                <h3 className="category-title">{categoryName}</h3>
                {/* Optional: Add a "See All" button here if you want */}
              </div>

              <div className="products-horizontal-grid">
                {groupedProducts[categoryName].slice(0, 6).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;
