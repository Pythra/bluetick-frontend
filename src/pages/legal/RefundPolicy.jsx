import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './LegalPages.css';

const RefundPolicy = () => {
  return (
    <div className="legal-page">
      <Navbar />
      <div className="legal-container">
        <h1>Refund Policy</h1>
        <p className="last-updated">Last Updated: November 24, 2025</p>
        
        <section className="legal-section">
          <h2>1. General Refund Policy</h2>
          <p>At Bluetickgeng Development, we strive to ensure complete customer satisfaction with our services. This Refund Policy outlines the terms and conditions for requesting refunds for our digital services.</p>
        </section>

        <section className="legal-section">
          <h2>2. Eligibility for Refund</h2>
          <p>Refunds may be considered under the following circumstances:</p>
          <ul>
            <li>Service not delivered as described</li>
            <li>Technical issues preventing service delivery</li>
            <li>Duplicate or erroneous charges</li>
          </ul>
          <p>Refunds are not available for services that have already been completed or partially used.</p>
        </section>

        <section className="legal-section">
          <h2>3. Non-Refundable Services</h2>
          <p>The following services are non-refundable once work has commenced:</p>
          <ul>
            <li>Custom development work</li>
            <li>Social media verification services</li>
            <li>Digital publication services after content has been submitted</li>
            <li>Completed website or app development projects</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Refund Process</h2>
          <p>To request a refund, please follow these steps:</p>
          <ol>
            <li>Contact our support team at <a href="mailto:bluetickgeng@gmail.com">bluetickgeng@gmail.com</a> within 7 days of purchase</li>
            <li>Provide your order details and reason for the refund request</li>
            <li>Our team will review your request within 5-7 business days</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>5. Processing Time</h2>
          <p>Approved refunds will be processed within 14 business days. The time it takes for the refund to reflect in your account may vary depending on your payment method and financial institution.</p>
        </section>

        <section className="legal-section">
          <h2>6. Service Credits</h2>
          <p>In some cases, instead of a monetary refund, we may offer service credits that can be applied to future purchases. These credits will be valid for 12 months from the date of issue.</p>
        </section>

        <section className="legal-section">
          <h2>7. Disputes</h2>
          <p>If you believe there has been an error in the processing of your refund, please contact us immediately. We will investigate the matter and work to resolve any issues as quickly as possible.</p>
        </section>

        <section className="legal-section">
          <h2>8. Changes to This Policy</h2>
          <p>We reserve the right to modify this Refund Policy at any time. Any changes will be effective immediately upon posting on our website.</p>
        </section>

        <section className="legal-section">
          <h2>9. Contact Us</h2>
          <p>If you have any questions about our Refund Policy, please contact us at <a href="mailto:bluetickgeng@gmail.com">bluetickgeng@gmail.com</a>.</p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
