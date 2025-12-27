import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./components/pages/Home";
import Navbar from "./components/pages/Navbar";
import Products from "./components/pages/Products";
import LoginModal from "./components/pages/LoginModal";
import { useEffect, useState } from "react";
import Footer from "./components/pages/Footer";
import Privacy from "./components/pages/Privacy";
import Terms from "./components/pages/Terms";
import FullScreenLoader from "./components/pages/FullScreenLoader";
import ProductDetail from "./components/pages/ProductDetail";
import Dashboard from "./components/pages/Dashboard";
import AdminProduct from "./components/pages/AdminProduct";
import AdminCategory from "./components/pages/AdminCategory";
import AllProducts from "./components/pages/AllProducts";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null); // Global User State
  const [loading, setLoading] = useState(true);

  // 1. Check for existing login on load
  useEffect(() => {
    const loadData = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };
    loadData();
  }, []);

  // 2. Handle Login Success (Called by LoginModal)
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
    // window.location.href = "/";
  };

  // 3. Handle Logout (Called by Navbar)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/"; // Refresh to clear any sensitive state
  };

  // Props shared across pages
  const commonProps = {
    showLogin,
    setShowLogin,
    user,
    handleLogout,
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar {...commonProps} />
          <Home />
          <Footer />
        </>
      ),
    },
    {
      path: "/s/:searchTerm",
      element: (
        <>
          <Navbar {...commonProps} />
          <Products />
          <Footer />
        </>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <>
          <Navbar {...commonProps} />
          <Dashboard user={user} />
          <Footer />
        </>
      ),
      children: [
        {
          // 1. DEFAULT REDIRECT: If user goes to "/dashboard", send to "all-products"
          index: true,
          element: <Navigate to="all-products" replace />,
        },
        {
          path: "all-products",
          element: <AllProducts />,
        },
        { path: "add-category", element: <AdminCategory /> },
        {
          path: "add-products",
          element: <AdminProduct />,
        },
      ],
    },
    // 1. Generic Products Route (Entry point for /products)
    // This route allows the page to load, fetch categories, and then redirect to the correct URL
    {
      path: "/products",
      element: (
        <>
          <Navbar {...commonProps} />
          <Products />
          <Footer />
        </>
      ),
    },
    {
      // This matches links that ONLY have the name
      path: "/cn/:slug",
      element: (
        <>
          <Navbar {...commonProps} />
          <Products />
          <Footer />
        </>
      ),
    },
    {
      path: "/cn/:slug/cid/:categoryId",
      element: (
        <>
          <Navbar {...commonProps} />
          <Products />
          <Footer />
        </>
      ),
    },
    {
      path: "/prn/:slug/pid/:id",
      element: (
        <>
          <Navbar {...commonProps} />
          <ProductDetail />
          <Footer />
        </>
      ),
    },
    {
      path: "/privacy",
      element: (
        <>
          <Navbar {...commonProps} />
          <Privacy />
          <Footer />
        </>
      ),
    },
    {
      path: "/terms",
      element: (
        <>
          <Navbar {...commonProps} />
          <Terms />
          <Footer />
        </>
      ),
    },
    {
      path: "*", // "*" means "match anything else"
      element: (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <a href="/" style={{ color: "blue" }}>
            Go to Home
          </a>
        </div>
      ),
    },
  ]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <RouterProvider router={router} />

      {/* Login Modal is Global */}
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default App;
