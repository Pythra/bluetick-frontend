import { useEffect, useRef, useState } from 'react';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '790931955518-mpk0mgjqg75ik5hal2r42ea78c80jaci.apps.googleusercontent.com';

function GoogleAuthButton({ onCredential, onError, disabled = false }) {
  const buttonRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      return;
    }

    const existingScript = document.querySelector('script[data-google-identity="true"]');
    if (existingScript) {
      if (window.google?.accounts?.id) {
        setReady(true);
      } else {
        existingScript.addEventListener('load', () => setReady(true), { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = () => setReady(true);
    script.onerror = () => onError?.('Unable to load Google sign-in right now.');
    document.head.appendChild(script);
  }, [onError]);

  useEffect(() => {
    if (!ready || !buttonRef.current || !window.google?.accounts?.id || !GOOGLE_CLIENT_ID) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (!response?.credential) {
            onError?.('Google sign-in did not return a valid credential.');
            return;
          }
          onCredential(response.credential);
        },
      });

      buttonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        text: 'continue_with',
        logo_alignment: 'left',
        width: 360,
      });
    } catch (error) {
      onError?.('Unable to initialize Google sign-in.');
    }
  }, [ready, onCredential, onError]);

  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className={`auth-google-wrap ${disabled ? 'is-disabled' : ''}`} aria-disabled={disabled}>
      <div ref={buttonRef} />
    </div>
  );
}

export default GoogleAuthButton;
