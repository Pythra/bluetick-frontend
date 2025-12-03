import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <Navbar />
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: November 24, 2025</p>
        
        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>At Bluetickgeng Development, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services.</p>
        </section>

        <section className="legal-section">
          <h2>2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>Personal identification information (name, email, phone number)</li>
            <li>Business information (company name, job title)</li>
            <li>Payment information (processed securely through our payment processors)</li>
            <li>Usage data and analytics</li>
            <li>Cookies and tracking technologies</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Process transactions and send related information</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Improve our website and services</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
        </section>

        <section className="legal-section">
          <h2>5. Data Retention</h2>
          <p>We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.</p>
        </section>

        <section className="legal-section">
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction of your personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing</li>
            <li>Request data portability</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>7. Third-Party Services</h2>
          <p>We may use third-party services to process payments, analyze data, and improve our services. These third parties have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
        </section>

        <section className="legal-section">
          <h2>8. Changes to This Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
        </section>

        <section className="legal-section">
          <h2>9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:bluetickgeng@gmail.com">bluetickgeng@gmail.com</a>.</p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
