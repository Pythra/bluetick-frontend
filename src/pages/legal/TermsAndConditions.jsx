import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './LegalPages.css';

const TermsAndConditions = () => {
  return (
    <div className="legal-page">
      <Navbar />
      <div className="legal-container">
        <h1>Terms and Conditions</h1>
        <p className="last-updated">Last Updated: November 24, 2025</p>
        
        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>Welcome to Bluetickgeng Development. These Terms and Conditions govern your use of our website and services. By accessing or using our services, you agree to be bound by these terms.</p>
        </section>

        <section className="legal-section">
          <h2>2. Services</h2>
          <p>We provide various digital services including web development, mobile app development, social media verification, and digital publication services. All services are subject to availability and may be modified or discontinued at our discretion.</p>
        </section>

        <section className="legal-section">
          <h2>3. User Responsibilities</h2>
          <p>You agree to provide accurate information when using our services and to comply with all applicable laws and regulations. You are responsible for maintaining the confidentiality of your account information.</p>
        </section>

        <section className="legal-section">
          <h2>4. Intellectual Property</h2>
          <p>All content, including text, graphics, logos, and software, is the property of Bluetickgeng Development or its content suppliers and is protected by intellectual property laws.</p>
        </section>

        <section className="legal-section">
          <h2>5. Limitation of Liability</h2>
          <p>Bluetickgeng Development shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.</p>
        </section>

        <section className="legal-section">
          <h2>6. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts in Lagos, Nigeria.</p>
        </section>

        <section className="legal-section">
          <h2>7. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified terms.</p>
        </section>

        <section className="legal-section">
          <h2>8. Contact Us</h2>
          <p>If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:bluetickgeng@gmail.com">bluetickgeng@gmail.com</a>.</p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
