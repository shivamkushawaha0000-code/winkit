import React, { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { RiArrowDownSLine } from "react-icons/ri";

const ProfileMenu = ({
  user,
  onLoginClick,
  onLogoutClick,
  onOpenOrders,
  onOpenAddresses,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close Profile Menu on Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // If no user, show Login button
  if (!user) {
    return (
      <button className="profile-icon-btn" onClick={onLoginClick}>
        <span className="login-text-desktop">Login</span>
        <User className="login-icon-mobile" size={20} />
      </button>
    );
  }

  // If user exists, show Profile Dropdown
  return (
    <div className="profile-container" ref={menuRef}>
      <button className="profile-icon-btn" onClick={() => setIsOpen(!isOpen)}>
        {user.name ? user.name[0].toUpperCase() : <User size={20} />}
        <RiArrowDownSLine className="arrow-icon" />
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <strong>{user.name || "My Account"}</strong>
            <span>{user.phoneNumber}</span>
          </div>

          <button
            className="profile-menu-item"
            onClick={() => {
              onOpenOrders();
              setIsOpen(false);
            }}
          >
            My Orders
          </button>

          <button
            className="profile-menu-item"
            onClick={() => {
              onOpenAddresses();
              setIsOpen(false);
            }}
          >
            Saved Addresses
          </button>

          <button
            className="profile-menu-item logout"
            onClick={() => {
              onLogoutClick();
              setIsOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;