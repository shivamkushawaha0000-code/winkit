import React, { useEffect, useState } from "react";
import "../css/Terms.css";

const TermsConditions = () => {
  const [activeSection, setActiveSection] = useState("acceptance");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "acceptance", title: "Acceptance" },
    { id: "eligibility", title: "Eligibility" },
    { id: "registration", title: "Account & Registration" },
    { id: "conduct", title: "Prohibited Conduct" },
    { id: "delivery", title: "Delivery Partners" },
    { id: "returns", title: "Returns & Refunds" },
    { id: "grievance", title: "Grievance Redressal" },
  ];

  return (
    <div className="terms-page">
      {/* Header Section */}
      <header className="terms-hero">
        <div className="container">
          <h1>Terms of Use</h1>
          <p>Last updated: June 2025 • Read carefully to understand your rights.</p>
        </div>
      </header>

      <div className="terms-layout container">
        {/* Sticky Sidebar Navigation */}
        <aside className="terms-sidebar">
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
        <main className="terms-content">
          <section className="intro-card">
            <p>
              Thank you for using <strong>Winkit</strong>. Winkit Commerce Private Limited 
              is incorporated under the Companies Act, 2013, with its registered office 
              in Gurugram, Haryana.
            </p>
            <div className="alert-box">
              <strong>Clarification:</strong> Winkit is not related to "GROFFR.COM" 
              (operated by Redstone Consultancy).
            </div>
          </section>

          <section id="acceptance">
            <h2>Acceptance of Terms</h2>
            <p>
              Your access to the <a href="https://www.Winkit.com">Winkit Platform</a> 
              is governed by these Terms and our Privacy Policy. By transacting with us, 
              you agree to these legally binding terms.
            </p>
          </section>

          <section id="eligibility">
            <h2>Eligibility</h2>
            <p>
              You must be "competent to contract" under Indian Law. Minors (under 18) 
              may use the platform only under adult supervision.
            </p>
          </section>

          <section id="conduct">
            <h2>Prohibited Conduct</h2>
            <p>You agree not to host or share information that:</p>
            <ul className="custom-list">
              <li>Is harmful, discriminatory, or racially objectionable.</li>
              <li>Contains software viruses or malicious code.</li>
              <li>Infringes on intellectual property rights.</li>
              <li>Threatens the sovereignty of India.</li>
            </ul>
          </section>

          <section id="returns">
            <h2>Returns & Refunds</h2>
            <div className="refund-grid">
              <div className="refund-card">
                <h3>Policy</h3>
                <p>Non-refundable except for damaged, defective, or expired goods.</p>
              </div>
              <div className="refund-card">
                <h3>Timeline</h3>
                <p>Refunds processed within 7 working days of approval.</p>
              </div>
            </div>
          </section>

          <section id="grievance" className="grievance-section">
            <h2>Grievance Redressal</h2>
            <div className="officer-grid">
              <div className="officer-card">
                <h4>Grievance Officer</h4>
                <p><strong>Dhananjay Shashidharan</strong></p>
                <p>Email: grievance.officer@winkit.com</p>
                <p>Mon - Fri (09:00 - 18:00)</p>
              </div>
              <div className="officer-card">
                <h4>Nodal Officer</h4>
                <p><strong>Vikramjit Singh</strong></p>
                <p>Email: nodal@winkit.com</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TermsConditions;