import React from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { 
  Box, 
  PlusCircle, 
  Grid, 
  LayoutDashboard, 
  Settings, 
  ChevronRight 
} from "lucide-react";
import "../css/Dashboard.css";

const Dashboard = ({ user }) => {
  const location = useLocation();

  // Security check
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role === "admin") {
    return (
      <section className="dashboard-wrapper">
        <div className="dashboard-container">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <div className="sidebar-header">
              <div className="admin-badge">Admin Portal</div>
            </div>

            <nav className="sidebar-nav">
              <div className="nav-group-label">Inventory Management</div>
              <ul>
                <li>
                  <NavLink
                    to="/dashboard/all-products"
                    className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                  >
                    <Box size={20} />
                    <span>All Products</span>
                    <ChevronRight className="arrow" size={16} />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/add-products"
                    className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                  >
                    <PlusCircle size={20} />
                    <span>Add Product</span>
                    <ChevronRight className="arrow" size={16} />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/add-category"
                    className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                  >
                    <Grid size={20} />
                    <span>Add Category</span>
                    <ChevronRight className="arrow" size={16} />
                  </NavLink>
                </li>
              </ul>
            </nav>

            <div className="sidebar-footer">
               <div className="user-mini-card">
                  <div className="user-avatar">{user.name?.charAt(0) || "A"}</div>
                  <div className="user-info">
                    <p className="user-name">{user.name || "Admin"}</p>
                    <p className="user-role">Super Admin</p>
                  </div>
               </div>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className="admin-main">
            <header className="content-header">
               <h1 className="content-title">
                {location.pathname.includes('all-products') ? 'Inventory Overview' : 
                 location.pathname.includes('add-products') ? 'Product Editor' : 
                 location.pathname.includes('add-category') ? 'Category Manager' : 'Dashboard'}
               </h1>
            </header>
            <div className="content-body">
              <Outlet />
            </div>
          </main>
        </div>
      </section>
    );
  }

  return <Navigate to="/" replace />;
};

export default Dashboard;