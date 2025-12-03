 import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CheckoutPage.css';

// Constants
const BANK_OPTIONS = [
  { value: 'access-bank', label: 'Access Bank' },
  { value: 'first-bank', label: 'First Bank' },
  { value: 'guaranty-trust-bank', label: 'GTBank' },
  { value: 'zenith-bank', label: 'Zenith Bank' },
  { value: 'united-bank-for-africa', label: 'UBA' },
  { value: 'fidelity-bank', label: 'Fidelity Bank' },
  { value: 'ecobank-nigeria', label: 'Ecobank' },
  { value: 'wema-bank', label: 'Wema Bank' },
];

const PREFERRED_BANK = 'wema-bank';

function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, apiUrl, getAuthHeaders } = useAuth();
  const {
    cartItems,
    cartItemCount,
    removeFromCart,
    updateQuantity,
    loading,
    fetchCart,
  } = useCart();

  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('virtualAccount');
  const [preferredBank] = useState(PREFERRED_BANK);
  const [dvaDetails, setDvaDetails] = useState(null);
  const [isGeneratingDva, setIsGeneratingDva] = useState(false);
  const [dvaError, setDvaError] = useState('');
  const [manualReference, setManualReference] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate]);

  const detectCurrencyFromPrice = (price = '') => {
    const normalized = price.toString().toLowerCase();
    if (normalized.includes('usd') || normalized.includes('$')) return 'USD';
    return 'NGN';
  };

  const extractNumericPrice = (price) => {
    if (price === undefined || price === null) return null;
    if (typeof price === 'number') return price;
    const sanitized = price.toString().replace(/,/g, '');
    const match = sanitized.match(/(\d+(\.\d+)?)/);
    if (!match) return null;
    return parseFloat(match[0]);
  };

  const formatCurrency = (amount, currency) => {
    if (!amount) return '—';
    const locale = currency === 'USD' ? 'en-US' : 'en-NG';
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency || 'NGN',
        minimumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      return `${currency || 'NGN'} ${amount.toLocaleString()}`;
    }
  };

  const priceSummary = useMemo(() => {
    let total = 0;
    let currency = null;
    let hasMixedCurrencies = false;
    const invalidItems = [];

    cartItems.forEach((item) => {
      const numericPrice = extractNumericPrice(item.price);
      if (!numericPrice) {
        invalidItems.push(item.title || item.name || 'Unknown item');
        return;
      }

      const itemCurrency = detectCurrencyFromPrice(item.price);
      if (!currency) {
        currency = itemCurrency;
      } else if (currency !== itemCurrency) {
        hasMixedCurrencies = true;
      }

      total += numericPrice * (item.quantity || 1);
    });

    return {
      total,
      currency: currency || 'NGN',
      hasMixedCurrencies,
      invalidItems,
    };
  }, [cartItems]);

  const canCheckout =
    cartItems.length > 0 &&
    priceSummary.total > 0 &&
    !priceSummary.hasMixedCurrencies &&
    priceSummary.invalidItems.length === 0;

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const scrollToSection = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  if (!isAuthenticated) {
    return null;
  }

  const handleOpenPaymentWindow = (url) => {
    if (!url) return;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      setPaymentError('Popup blocked. Please allow popups for this site and try again.');
    }
  };

  const handlePaymentMethodChange = (method) => {
    if (paymentMethod === method) return;
    setPaymentMethod(method);
    setPaymentError('');
    setPaymentStatus('');
    setManualReference('');

    if (method === 'card') {
      setDvaDetails(null);
      setDvaError('');
    } else {
      setPaymentReference('');
      setPaymentUrl('');
    }
  };

  const handleGenerateDedicatedAccount = async () => {
    if (!canCheckout || isGeneratingDva) return;

    // Clear previous errors and set loading state
    setDvaError('');
    setIsGeneratingDva(true);
    setPaymentStatus('pending');

    try {
      // Validate required fields
      if (!preferredBank) {
        throw new Error('Please select a preferred bank');
      }
      if (!priceSummary?.currency) {
        throw new Error('Currency information is missing');
      }

      const response = await fetch(`${apiUrl}/api/paystack/dedicated-account`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferredBank,
          currency: priceSummary.currency,
        }),
      });

      // Handle non-JSON responses
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse response as JSON:', jsonError);
        throw new Error('Received an invalid response from the server. Please try again.');
      }

      if (!response.ok) {
        const errorMessage = data.error?.message ||
          data.message ||
          `Server responded with status ${response.status}. Please try again.`;
        throw new Error(errorMessage);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create dedicated account. Please try again.');
      }

      if (!data.dedicatedAccount) {
        throw new Error('Invalid response from server. Missing account details.');
      }

      // Update state with new account details
      setDvaDetails(data.dedicatedAccount);
      setManualReference('');
      setDvaError(''); // Clear any previous errors on success

    } catch (error) {
      console.error('Error generating dedicated account:', error);
      const userFriendlyError = error.message || 'Unable to create a virtual account. Please try again later.';
      setDvaError(userFriendlyError);

      // If it's a network error, provide more specific guidance
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setDvaError('Network error. Please check your internet connection and try again.');
      }
    } finally {
      setIsGeneratingDva(false);
    }
  };

  const handleInitializePayment = async () => {
    if (!canCheckout || isInitializingPayment) return;

    setPaymentError('');
    setPaymentStatus('');
    setIsInitializingPayment(true);

    try {
      const response = await fetch(`${apiUrl}/api/paystack/init`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currency: priceSummary.currency }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Unable to connect to Paystack. Please ensure items have valid prices and try again.'
        );
      }

      setPaymentUrl(data.authorization_url);
      setPaymentReference(data.reference);
      setPaymentStatus('pending');
      handleOpenPaymentWindow(data.authorization_url);
    } catch (error) {
      setPaymentError(error.message || 'Payment initialization failed.');
    } finally {
      setIsInitializingPayment(false);
    }
  };

  const verifyPayment = useCallback(
    async (referenceOverride, isAutomatic = false) => {
      const reference = (referenceOverride || paymentReference || '').trim();

      // Input validation
      if (!reference) {
        if (!isAutomatic) {
          setPaymentError('Please enter a valid payment reference');
        }
        return;
      }

      // Prevent multiple verification attempts
      if (isVerifyingPayment) return;

      setIsVerifyingPayment(true);
      setPaymentError('');

      try {
        const response = await fetch(`${apiUrl}/api/paystack/verify`, {
          method: 'POST',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reference }),
        });

        // Handle non-JSON responses
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse verification response:', jsonError);
          throw new Error('Received an invalid response from the server. Please try again.');
        }

        if (!response.ok) {
          const errorMessage = data.error?.message ||
            data.message ||
            `Verification failed with status ${response.status}. Please try again.`;
          throw new Error(errorMessage);
        }

        if (data.verified) {
          // Clear all payment-related states on successful verification
          setPaymentStatus('success');
          setPaymentReference('');
          setPaymentUrl('');
          setManualReference('');
          setDvaError('');

          // Refresh cart to reflect the successful payment
          try {
            await fetchCart();
          } catch (cartError) {
            console.error('Error updating cart after payment:', cartError);
            // Don't fail the payment verification if cart update fails
          }
        } else if (!isAutomatic) {
          // Only show pending message for manual verification attempts
          setPaymentError('Payment verification is still pending. Please check back later.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);

        // Only show errors for manual verification attempts or critical errors
        if (!isAutomatic || error.message?.includes('network')) {
          let userMessage = error.message || 'Verification failed. Please try again.';

          // Provide more user-friendly messages for common errors
          if (error.message?.includes('network') || error.name === 'TypeError') {
            userMessage = 'Network error. Please check your internet connection and try again.';
          } else if (error.message?.includes('timeout') || error.message?.includes('expired')) {
            userMessage = 'Verification timed out. Please try again in a moment.';
          }

          setPaymentError(userMessage);
        }
      } finally {
        setIsVerifyingPayment(false);
      }
    },
    [apiUrl, fetchCart, getAuthHeaders, isVerifyingPayment, paymentReference]
  );

  useEffect(() => {
    if (!paymentReference) {
      return undefined;
    }

    const pollId = setInterval(() => {
      verifyPayment(undefined, true);
    }, 5000);

    return () => clearInterval(pollId);
  }, [paymentReference, verifyPayment]);

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <h1>Checkout</h1>
        {loading ? (
          <div className="loading">Loading cart...</div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/')} className="checkout-button">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="checkout-container">
            <div className="cart-section">
              <h2>Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <p className="item-category">{item.category}</p>
                    {item.description && (
                      <p className="item-description">{item.description}</p>
                    )}
                  </div>
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item._id, (item.quantity || 1) - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, (item.quantity || 1) + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <div className="item-price">{item.price}</div>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="remove-btn"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="payment-section">
              <h2>Order Details</h2>
              <div className="order-summary">
                <div className="summary-row">
                  <span>Items ({cartItemCount})</span>
                  <span>{cartItemCount}</span>
                </div>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(priceSummary.total, priceSummary.currency)}</span>
                </div>
                {priceSummary.invalidItems.length > 0 && (
                  <div className="error-message">
                    <p>Need attention:</p>
                    <ul>
                      {priceSummary.invalidItems.map((item, idx) => (
                        <li key={idx}>{item} — set an exact price to pay online.</li>
                      ))}
                    </ul>
                  </div>
                )}
                {priceSummary.hasMixedCurrencies && (
                  <div className="error-message">
                    Please checkout NGN and USD orders separately so we can charge the correct currency.
                  </div>
                )}
                <div className="summary-row total">
                  <strong>Total</strong>
                  <strong>{formatCurrency(priceSummary.total, priceSummary.currency)}</strong>
                </div>
              </div>

              <h3>Select Payment Method</h3>
              <div className="payment-methods">
                <label className={`payment-method ${paymentMethod === 'virtualAccount' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="virtualAccount"
                    checked={paymentMethod === 'virtualAccount'}
                    onChange={() => handlePaymentMethodChange('virtualAccount')}
                    className="visually-hidden"
                  />
                  <div className="method-content">
                    <span className="method-icon">🏦</span>
                    <div>
                      <div className="method-title">Bank Transfer (Recommended)</div>
                      <div className="method-description">Get a dedicated account number for this transaction - Fast & Secure</div>
                    </div>
                  </div>
                </label>

                <label className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => handlePaymentMethodChange('card')}
                    className="visually-hidden"
                  />
                  <div className="method-content">
                    <span className="method-icon">💳</span>
                    <div>
                      <div className="method-title">Pay with Card</div>
                      <div className="method-description">Secure payment via Paystack (Visa, Mastercard, Verve, USSD)</div>
                    </div>
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' ? (
                <button
                  onClick={handleInitializePayment}
                  disabled={!canCheckout || isInitializingPayment}
                  className="checkout-button"
                >
                  {isInitializingPayment ? 'Connecting to Paystack...' : 'Proceed to Payment'}
                </button>
              ) : (
                <div className="dva-section">
                  <p className="dva-instructions">
                    Generate a dedicated account for this order, pay the full total, then paste the Paystack reference here so we can verify it instantly.
                  </p>
                  <div className="bank-info">
                    <p><strong>Bank:</strong> Wema Bank</p>
                  </div>

                  {dvaError && (
                    <div className="error-message">{dvaError}</div>
                  )}

                  {dvaDetails ? (
                    <div className="dva-details">
                      <h4>Your dedicated account details:</h4>
                      <div className="account-info">
                        <p><strong>Bank:</strong> {dvaDetails.bank_name}</p>
                        <p><strong>Account Name:</strong> {dvaDetails.account_name}</p>
                        <p><strong>Account Number:</strong> {dvaDetails.account_number}</p>
                      </div>
                      <p className="transfer-instruction">
                        Please make a transfer to the account details above. Your order will be processed once payment is confirmed.
                      </p>
                      <div className="verification-section">
                        <p><strong>Already made the payment? Enter your reference below:</strong></p>
                        <div className="reference-input-group">
                          <input
                            type="text"
                            placeholder="Paystack reference (e.g., abc123xyz)"
                            value={manualReference}
                            onChange={(e) => setManualReference(e.target.value)}
                            style={{ flex: 1, padding: '0.5rem' }}
                          />
                          <button
                            onClick={() => verifyPayment(manualReference, false)}
                            disabled={!manualReference || isVerifyingPayment}
                            className="checkout-button"
                          >
                            {isVerifyingPayment ? 'Verifying...' : 'Verify Payment'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleGenerateDedicatedAccount}
                      disabled={!canCheckout || isGeneratingDva}
                      className="checkout-button"
                    >
                      {isGeneratingDva ? 'Generating Account...' : 'Generate Virtual Account'}
                    </button>
                  )}
                </div>
              )}

              {paymentReference && (
                <div className="payment-pending">
                  <p>We opened Paystack in a new tab. Complete your payment there and return to this page.</p>
                  <div className="pending-actions">
                    <button onClick={() => handleOpenPaymentWindow(paymentUrl)} className="secondary-button">
                      Open Paystack Checkout
                    </button>
                    <button onClick={() => verifyPayment(undefined, false)} disabled={isVerifyingPayment} className="checkout-button">
                      {isVerifyingPayment ? 'Checking...' : "I've completed payment"}
                    </button>
                  </div>
                </div>
              )}

              {paymentStatus === 'success' ? (
                <div className="success-message">
                  <p>Payment verified successfully! A receipt has been logged for your account.</p>
                  <button onClick={() => navigate('/')} className="checkout-button">
                    Continue browsing
                  </button>
                </div>
              ) : (
                <div className="payment-info">
                  {paymentError && <div className="error-message">{paymentError}</div>}
                  <p>
                    All payments are processed securely via Paystack. Need help? Reach us at{' '}
                    <a href="mailto:bluetickgeng@gmail.com">bluetickgeng@gmail.com</a> or +234 906 943 1949.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CheckoutPage;