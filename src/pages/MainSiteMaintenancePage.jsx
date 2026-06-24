import { useEffect } from 'react';
import './MainSiteMaintenancePage.css';

export default function MainSiteMaintenancePage() {
  useEffect(() => {
    document.title = 'Bluetickgeng — Temporarily unavailable';
  }, []);

  return (
    <div className="maintenance-page">
      <div className="maintenance-page__card">
        <img
          className="maintenance-page__logo"
          src="/bluetickgeng-logo.png"
          alt="Bluetickgeng Development"
        />
        <p className="maintenance-page__eyebrow">Scheduled maintenance</p>
        <h1 className="maintenance-page__title">We&apos;ll be back soon</h1>
        <p className="maintenance-page__message">
          Bluetickgeng is temporarily unavailable while we make improvements.
          Please check back shortly.
        </p>
        <p className="maintenance-page__contact">
          Need help? Email{' '}
          <a href="mailto:info@bluetickgeng.com">info@bluetickgeng.com</a>
        </p>
      </div>
    </div>
  );
}
