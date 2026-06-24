import { useEffect } from 'react';
import './MainSiteMaintenancePage.css';

export default function MainSiteMaintenancePage() {
  useEffect(() => {
    document.title = 'Site unavailable';
  }, []);

  return (
    <div className="maintenance-page">
      <div className="maintenance-page__card">
        <h1 className="maintenance-page__title">The site is down.</h1>
        <p className="maintenance-page__message">
          Bluetickgeng is currently unavailable. Check back later.
        </p>
      </div>
    </div>
  );
}
