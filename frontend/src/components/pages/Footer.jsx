import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import "../css/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-top container">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2 className="footer-logo">Winkit<span>.</span></h2>
          <p className="brand-desc">
            Your trusted partner for lightning-fast commerce and reliable delivery solutions across India.
          </p>
        </div>

        {/* Links Columns */}
        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content container">
          <p className="copyright">
            © {currentYear} Winkit Commerce Private Limited. All rights reserved.
          </p>
          
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="social-link" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="social-link" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="social-link" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;