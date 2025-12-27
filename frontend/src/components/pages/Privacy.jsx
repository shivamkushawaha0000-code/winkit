import React, { useEffect, useState } from "react";
import "../css/Privacy.css";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("scope");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "scope", title: "Applicability & Scope" },
    { id: "collection", title: "Information We Collect" },
    { id: "usage", title: "How We Use Data" },
    { id: "sharing", title: "How We Share Data" },
    { id: "security", title: "Data Security" },
    { id: "contact", title: "Contact DPO" },
  ];

  return (
    <div className="privacy-page">
      {/* Header Section */}
      <header className="privacy-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>Last updated: January 2025 • Your privacy is our top priority.</p>
        </div>
      </header>

      <div className="privacy-layout container">
        {/* Sticky Sidebar Navigation */}
        <aside className="privacy-sidebar">
          <nav>
            <ul>
              {sections.map((sec) => (
                <li key={sec.id}>
                  <a 
                    href={`#${sec.id}`} 
                    className={activeSection === sec.id ? "active" : ""}
                    onClick={() => setActiveSection(sec.id)}
                  >
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="privacy-content">
          <section className="intro-card">
            <p>
              <strong>Winkit Commerce Private Limited</strong> (formerly Grofers India) 
              is committed to protecting your personal information. This policy explains how we 
              collect, use, and disclose data about you.
            </p>
            <div className="alert-box">
              <strong>Need Clarity?</strong> If you have questions about this policy, 
              reach us at <a href="mailto:privacy@Winkit.com">privacy@Winkit.com</a>.
            </div>
          </section>

          <section id="scope">
            <h2>Applicability and Scope</h2>
            <p>
              This policy applies to information Winkit collects through its website, 
              applications, and electronic communications (the "Services").
            </p>
            <div className="status-badge">
              <strong>Permissible Age:</strong> 18+ years (unless permitted by local law).
            </div>
          </section>

          <section id="collection">
            <h2>The Information We Collect</h2>
            <div className="info-grid">
              <div className="info-item">
                <h3>1. Provided by You</h3>
                <ul className="custom-list">
                  <li><strong>Identity:</strong> Name, Email, Address, DOB.</li>
                  <li><strong>Transactions:</strong> Order history and payment info.</li>
                  <li><strong>Content:</strong> Your searches and browsing logs.</li>
                </ul>
              </div>
              <div className="info-item">
                <h3>2. Collected Automatically</h3>
                <ul className="custom-list">
                  <li><strong>Device:</strong> IP address, OS, and browser type.</li>
                  <li><strong>Location:</strong> Real-time GPS data (with consent).</li>
                  <li><strong>Cookies:</strong> Pixel tags and mobile device IDs.</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="usage">
            <h2>How We Use Your Information</h2>
            <p>We process your data to provide a seamless shopping experience:</p>
            <ul className="custom-list">
              <li>Administering services with delivery partners and vendors.</li>
              <li>Processing queries, complaints, and fraud prevention.</li>
              <li>Sending transactional updates via SMS or WhatsApp.</li>
            </ul>
          </section>

          <section id="security">
            <h2>Security & Protection</h2>
            <div className="security-box">
              <p>
                We implement physical, electronic, and managerial procedures to safeguard 
                unauthorized access. We follow industry standards to protect all 
                submitted personal information.
              </p>
            </div>
          </section>

          <section id="contact" className="contact-section">
            <h2>Contact Data Protection Officer</h2>
            <div className="officer-card">
              <h4>Data Protection Officer (DPO)</h4>
              <p>For any queries regarding data processing or your rights:</p>
              <p className="contact-email">
                <strong>Email:</strong> <a href="mailto:privacy@winkit.com">privacy@winkit.com</a>
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;