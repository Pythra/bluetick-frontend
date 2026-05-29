import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCardOutline, IoBusinessOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CheckoutPage.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, apiUrl, authFetch } = useAuth();
  const {
    cartItems,
    cartItemCount,
    removeFromCart,
    updateQuantity,
    loading,
    fetchCart,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isClaimingPayment, setIsClaimingPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
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
    } catch {
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

  const redirectAfterOrder = useCallback(
    (orderId, items) => {
      const hasPublicationItems = items.some((item) => item.category === 'publication');
      navigate('/article-submission', {
        state: {
          orderId,
          serviceType: hasPublicationItems ? 'publication' : 'other',
          cartItems: items,
        },
      });
    },
    [navigate]
  );

  const handleOpenPaymentWindow = (url) => {
    if (!url) return;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      setPaymentError('Popup blocked. Allow popups for this site, or use the link below.');
    }
  };

  const handleInitializePayment = async () => {
    if (!canCheckout || isInitializingPayment) return;

    setPaymentError('');
    setPaymentStatus('');
    setIsInitializingPayment(true);

    try {
      const response = await authFetch(`${apiUrl}/api/paystack/init`, {
        method: 'POST',
        body: JSON.stringify({ currency: priceSummary.currency }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Unable to connect to Paystack. Check your cart and try again.'
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

      if (!reference) {
        if (!isAutomatic) {
          setPaymentError('Enter a valid Paystack reference to verify.');
        }
        return;
      }

      if (isVerifyingPayment) return;

      const cartSnapshot = [...cartItems];
      setIsVerifyingPayment(true);
      setPaymentError('');

      try {
        const response = await authFetch(`${apiUrl}/api/paystack/verify`, {
          method: 'POST',
          body: JSON.stringify({ reference }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed. Please try again.');
        }

        if (data.verified) {
          setPaymentStatus('success');
          setPaymentReference('');
          setPaymentUrl('');

          try {
            await fetchCart();
          } catch (cartError) {
            console.error('Error updating cart after payment:', cartError);
          }

          setTimeout(() => {
            redirectAfterOrder(data.orderId, cartSnapshot);
          }, 1500);
        } else if (!isAutomatic) {
          setPaymentError('Payment not confirmed yet. Complete checkout in Paystack and try again.');
        }
      } catch (error) {
        if (!isAutomatic) {
          setPaymentError(error.message || 'Verification failed.');
        }
      } finally {
        setIsVerifyingPayment(false);
      }
    },
    [apiUrl, authFetch, cartItems, fetchCart, isVerifyingPayment, paymentReference, redirectAfterOrder]
  );

  useEffect(() => {
    if (!paymentReference || paymentMethod !== 'paystack') {
      return undefined;
    }

    const pollId = setInterval(() => {
      verifyPayment(undefined, true);
    }, 5000);

    return () => clearInterval(pollId);
  }, [paymentReference, paymentMethod, verifyPayment]);

  const handleClaimBankTransfer = async () => {
    if (!canCheckout || isClaimingPayment) return;

    setPaymentError('');
    setPaymentStatus('');
    setIsClaimingPayment(true);

    try {
      const response = await authFetch(`${apiUrl}/api/payments/bank-transfer/claim`, {
        method: 'POST',
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid server response. Please try again.');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to submit payment claim.');
      }

      setPaymentStatus('success');

      setTimeout(() => {
        redirectAfterOrder(
          data.orderId,
          data.cartInfo?.cartItems || cartItems
        );
      }, 2000);

      try {
        await fetchCart();
      } catch (cartError) {
        console.error('Error updating cart after bank transfer claim:', cartError);
      }
    } catch (error) {
      setPaymentError(error.message || 'Unable to submit payment claim.');
    } finally {
      setIsClaimingPayment(false);
    }
  };

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

  return (
    <div className="checkout-page">
      <Navbar onScrollToSection={scrollToSection} />

      <main className="checkout-shell">
        <header className="checkout-header">
          <p className="checkout-kicker">Secure checkout</p>
          <h1 className="checkout-title">Review &amp; pay</h1>
          <p className="checkout-lead">
            Complete your order with Paystack or bank transfer. All payments are processed securely.
          </p>
        </header>

        {loading ? (
          <div className="checkout-state-card">
            <p>Loading your cart…</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="checkout-state-card checkout-state-card--empty">
            <p>Your cart is empty.</p>
            <button type="button" onClick={() => navigate('/')} className="checkout-btn checkout-btn--primary">
              Browse services
            </button>
          </div>
        ) : (
          <div className="checkout-layout">
            <section className="checkout-items-panel" aria-labelledby="checkout-items-heading">
              <h2 id="checkout-items-heading" className="checkout-panel-title">
                Order summary
                <span className="checkout-item-count">{cartItemCount} items</span>
              </h2>

              <ul className="checkout-item-list">
                {cartItems.map((item) => (
                  <li key={item._id} className="checkout-item">
                    <div className="checkout-item-main">
                      <h3 className="checkout-item-title">{item.title}</h3>
                      {item.category ? (
                        <span className="checkout-item-category">{item.category}</span>
                      ) : null}
                      {item.description ? (
                        <p className="checkout-item-desc">{item.description}</p>
                      ) : null}
                    </div>
                    <div className="checkout-item-aside">
                      <div className="checkout-qty" aria-label="Quantity">
                        <button
                          type="button"
                          className="checkout-qty-btn"
                          onClick={() => handleQuantityChange(item._id, (item.quantity || 1) - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{item.quantity || 1}</span>
                        <button
                          type="button"
                          className="checkout-qty-btn"
                          onClick={() => handleQuantityChange(item._id, (item.quantity || 1) + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="checkout-item-price">{item.price}</p>
                      <button
                        type="button"
                        className="checkout-remove"
                        onClick={() => handleRemove(item._id)}
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="checkout-pay-panel">
              <h2 className="checkout-panel-title">Payment</h2>

              <div className="checkout-summary">
                <div className="checkout-summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(priceSummary.total, priceSummary.currency)}</span>
                </div>
                <div className="checkout-summary-row checkout-summary-row--total">
                  <strong>Total</strong>
                  <strong>{formatCurrency(priceSummary.total, priceSummary.currency)}</strong>
                </div>
              </div>

              {(priceSummary.invalidItems.length > 0 || priceSummary.hasMixedCurrencies) && (
                <div className="checkout-alert checkout-alert--warn" role="alert">
                  {priceSummary.invalidItems.length > 0 && (
                    <ul>
                      {priceSummary.invalidItems.map((item, idx) => (
                        <li key={idx}>{item} — needs a numeric price to pay online.</li>
                      ))}
                    </ul>
                  )}
                  {priceSummary.hasMixedCurrencies && (
                    <p>Checkout NGN and USD items separately.</p>
                  )}
                </div>
              )}

              {paymentStatus === 'success' ? (
                <div className="checkout-alert checkout-alert--success" role="status">
                  <p>Payment received! Redirecting you to complete your order details…</p>
                </div>
              ) : (
                <>
                  <p className="checkout-pay-label">Choose payment method</p>
                  <div className="checkout-pay-methods" role="radiogroup" aria-label="Payment method">
                    <label
                      className={`checkout-pay-option ${paymentMethod === 'paystack' ? 'is-active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paystack"
                        checked={paymentMethod === 'paystack'}
                        onChange={() => {
                          setPaymentMethod('paystack');
                          setPaymentError('');
                        }}
                        className="visually-hidden"
                      />
                      <span className="checkout-pay-option-icon" aria-hidden="true">
                        <IoCardOutline />
                      </span>
                      <span className="checkout-pay-option-text">
                        <span className="checkout-pay-option-title">Paystack</span>
                        <span className="checkout-pay-option-desc">
                          Card, bank transfer, USSD — instant verification
                        </span>
                      </span>
                    </label>

                    <label
                      className={`checkout-pay-option ${paymentMethod === 'bank' ? 'is-active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={() => {
                          setPaymentMethod('bank');
                          setPaymentError('');
                        }}
                        className="visually-hidden"
                      />
                      <span className="checkout-pay-option-icon" aria-hidden="true">
                        <IoBusinessOutline />
                      </span>
                      <span className="checkout-pay-option-text">
                        <span className="checkout-pay-option-title">Bank transfer</span>
                        <span className="checkout-pay-option-desc">
                          Pay manually, then confirm — NGN only
                        </span>
                      </span>
                    </label>
                  </div>

                  {paymentMethod === 'paystack' ? (
                    <div className="checkout-pay-body">
                      <button
                        type="button"
                        className="checkout-btn checkout-btn--primary"
                        onClick={handleInitializePayment}
                        disabled={!canCheckout || isInitializingPayment}
                      >
                        {isInitializingPayment ? 'Connecting to Paystack…' : 'Pay with Paystack'}
                      </button>

                      {paymentReference ? (
                        <div className="checkout-paystack-pending">
                          <p>
                            Paystack opened in a new tab. When finished, return here — we&apos;ll verify
                            automatically.
                          </p>
                          <div className="checkout-paystack-actions">
                            <button
                              type="button"
                              className="checkout-btn checkout-btn--outline"
                              onClick={() => handleOpenPaymentWindow(paymentUrl)}
                            >
                              Open Paystack again
                            </button>
                            <button
                              type="button"
                              className="checkout-btn checkout-btn--primary"
                              onClick={() => verifyPayment(undefined, false)}
                              disabled={isVerifyingPayment}
                            >
                              {isVerifyingPayment ? 'Verifying…' : "I've paid"}
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="checkout-pay-body">
                      <div className="checkout-bank-card">
                        <p><strong>Bank:</strong> Moniepoint MFB</p>
                        <p><strong>Account name:</strong> BLUETICKGENG DEVELOPMENT</p>
                        <p><strong>Account number:</strong> 9069439149</p>
                        <p className="checkout-bank-note">
                          Transfer the exact total ({formatCurrency(priceSummary.total, priceSummary.currency)}),
                          then tap below.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="checkout-btn checkout-btn--primary"
                        onClick={handleClaimBankTransfer}
                        disabled={!canCheckout || isClaimingPayment || priceSummary.currency !== 'NGN'}
                      >
                        {isClaimingPayment ? 'Submitting…' : 'I have paid'}
                      </button>
                      {priceSummary.currency !== 'NGN' && (
                        <p className="checkout-bank-note checkout-bank-note--muted">
                          Bank transfer is available for NGN orders only. Use Paystack for USD.
                        </p>
                      )}
                    </div>
                  )}

                  {paymentError ? (
                    <div className="checkout-alert checkout-alert--error" role="alert">
                      {paymentError}
                    </div>
                  ) : null}
                </>
              )}

              <div className="checkout-trust">
                <IoShieldCheckmarkOutline aria-hidden="true" />
                <p>
                  Secured by Paystack. Questions?{' '}
                  <a href="mailto:bluetickgeng@gmail.com">bluetickgeng@gmail.com</a>
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default CheckoutPage;
