import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToPushNotifications } from '../utils/pushNotifications';
import './CookieConsentBanner.css';

const COOKIE_STORAGE_KEY = 'bluetick_cookie_consent';
const NOTIFICATION_STORAGE_KEY = 'bluetick_notification_consent';

function CookieConsentBanner() {
  const { apiUrl } = useAuth();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('idle');
  const [error, setError] = useState('');

  const isAdminRoute = useMemo(
    () => location.pathname.startsWith('/admin'),
    [location.pathname]
  );

  useEffect(() => {
    if (isAdminRoute) {
      setIsVisible(false);
      return;
    }

    const cookieChoice = localStorage.getItem(COOKIE_STORAGE_KEY);
    setIsVisible(!cookieChoice);
    const notificationChoice = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (notificationChoice === 'accepted') {
      setNotificationStatus('enabled');
    }
  }, [isAdminRoute]);

  const saveCookieChoice = (choice) => {
    localStorage.setItem(COOKIE_STORAGE_KEY, choice);
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    saveCookieChoice('essential_only');
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, 'declined');
    setNotificationStatus('declined');
  };

  const handleAcceptAll = async () => {
    saveCookieChoice('accepted');
    setError('');
    setNotificationStatus('enabling');
    try {
      await subscribeToPushNotifications(apiUrl);
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, 'accepted');
      setNotificationStatus('enabled');
    } catch (notificationError) {
      console.error('Notification setup error:', notificationError);
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, 'declined');
      setNotificationStatus('declined');
      setError(notificationError.message || 'Notifications were not enabled.');
    }
  };

  if (!isVisible || isAdminRoute) {
    return null;
  }

  return (
    <div className="cookie-consent-wrap" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className="cookie-consent-card">
        <div className="cookie-consent-copy">
          <p className="cookie-consent-kicker">Privacy settings</p>
          <h3>We use cookies for a smoother experience.</h3>
          <p>
            Essential cookies keep the site secure. Optional cookies help improve performance, and if
            you accept, we can also notify you when a new blog post is published.
          </p>
          {error ? <p className="cookie-consent-error">{error}</p> : null}
          {notificationStatus === 'enabled' ? (
            <p className="cookie-consent-success">Notifications are enabled for this browser.</p>
          ) : null}
        </div>

        <div className="cookie-consent-actions">
          <button
            type="button"
            className="cookie-btn cookie-btn-secondary"
            onClick={handleAcceptEssential}
          >
            Essential only
          </button>
          <button
            type="button"
            className="cookie-btn cookie-btn-primary"
            onClick={handleAcceptAll}
            disabled={notificationStatus === 'enabling'}
          >
            {notificationStatus === 'enabling' ? 'Saving...' : 'Accept all'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
