import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoCardOutline, IoBusinessOutline, IoShieldCheckmarkOutline, IoGlobeOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePartnerText } from '../utils/partnerText';
import './CheckoutPage.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const { supportEmail } = usePartnerText();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, apiUrl, authFetch } = useAuth();
  const { currency, convert, format } = useCurrency();
  const {
    cartItems,
    cartItemCount,
    removeFromCart,
    updateQuantity,
    loading,
    fetchCart,
  } = useCart();

  const isInternationalCheckout = currency !== 'NGN';

  const [paymentMethod, setPaymentMethod] = useState(
    isInternationalCheckout ? 'flutterwave' : 'paystack'
  );
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isClaimingPayment, setIsClaimingPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentTransactionId, setPaymentTransactionId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [bankSuccessMessage, setBankSuccessMessage] = useState('');

  useEffect(() => {
    setPaymentMethod(isInternationalCheckout ? 'flutterwave' : 'paystack');
    setPaymentError('');
    setPaymentUrl('');
    setPaymentReference('');
    setPaymentTransactionId('');
  }, [isInternationalCheckout]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      fetchCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate]);

  const extractNumericPrice = (price) => {
    if (price === undefined || price === null) return null;
    if (typeof price === 'number') return price;
    const sanitized = price.toString().replace(/,/g, '');
    const match = sanitized.match(/(\d+(\.\d+)?)/);
    if (!match) return null;
    return parseFloat(match[0]);
  };

  const priceSummary = useMemo(() => {
    let total = 0;
    const invalidItems = [];

    cartItems.forEach((item) => {
      const numericPrice = extractNumericPrice(item.price);
      if (!numericPrice) {
        invalidItems.push(item.title || item.name || 'Unknown item');
        return;
      }

      total += numericPrice * (item.quantity || 1);
    });

    return {
      total,
      currency: 'NGN',
      invalidItems,
    };
  }, [cartItems]);

  const checkoutCurrency = isInternationalCheckout ? currency : 'NGN';
  const checkoutAmount = isInternationalCheckout
    ? convert(priceSummary.total)
    : priceSummary.total;

  const formatCheckoutAmount = useCallback(
    (amount) => {
      if (!amount) return '—';
      if (isInternationalCheckout) {
        return format(amount);
      }
      try {
        return new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          maximumFractionDigits: 0,
        }).format(amount);
      } catch {
        return `₦${amount.toLocaleString()}`;
      }
    },
    [format, isInternationalCheckout]
  );

  const canCheckout =
    cartItems.length > 0 &&
    priceSummary.total > 0 &&
    priceSummary.invalidItems.length === 0 &&
    (!isInternationalCheckout || checkoutAmount > 0);

  const redirectAfterPaymentSuccess = useCallback(
    (orderId) => {
      navigate(`/service-agreement?orderId=${orderId}`, {
        state: { orderId, paymentSuccess: true },
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

  const handleInitializePaystack = async () => {
    if (!canCheckout || isInitializingPayment || isInternationalCheckout) return;

    setPaymentError('');
    setPaymentStatus('');
    setIsInitializingPayment(true);

    try {
      const response = await authFetch(`${apiUrl}/api/paystack/init`, {
        method: 'POST',
        body: JSON.stringify({ currency: 'NGN' }),
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

  const handleInitializeFlutterwave = async () => {
    if (!canCheckout || isInitializingPayment || !isInternationalCheckout) return;

    setPaymentError('');
    setPaymentStatus('');
    setIsInitializingPayment(true);

    try {
      const response = await authFetch(`${apiUrl}/api/flutterwave/init`, {
        method: 'POST',
        body: JSON.stringify({ currency: checkoutCurrency }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Unable to connect to Flutterwave. Check your cart and try again.'
        );
      }

      setPaymentUrl(data.payment_url);
      setPaymentReference(data.reference);
      setPaymentTransactionId('');
      setPaymentStatus('pending');
      handleOpenPaymentWindow(data.payment_url);
    } catch (error) {
      setPaymentError(error.message || 'Payment initialization failed.');
    } finally {
      setIsInitializingPayment(false);
    }
  };

  const verifyPaystackPayment = useCallback(
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
          setPaymentStatus('payment-success');
          setPaymentReference('');
          setPaymentUrl('');

          try {
            await fetchCart();
          } catch (cartError) {
            console.error('Error updating cart after payment:', cartError);
          }

          setTimeout(() => {
            redirectAfterPaymentSuccess(data.orderId, cartSnapshot);
          }, 1200);
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
    [
      apiUrl,
      authFetch,
      cartItems,
      fetchCart,
      isVerifyingPayment,
      paymentReference,
      redirectAfterPaymentSuccess,
    ]
  );

  const verifyFlutterwavePayment = useCallback(
    async (referenceOverride, transactionIdOverride, isAutomatic = false) => {
      const reference = (referenceOverride || paymentReference || '').trim();
      const transactionId = (transactionIdOverride || paymentTransactionId || '').trim();

      if (!reference) {
        if (!isAutomatic) {
          setPaymentError('A valid Flutterwave reference is required to verify.');
        }
        return;
      }

      if (isVerifyingPayment) return;

      const cartSnapshot = [...cartItems];
      setIsVerifyingPayment(true);
      setPaymentError('');

      try {
        const response = await authFetch(`${apiUrl}/api/flutterwave/verify`, {
          method: 'POST',
          body: JSON.stringify({
            reference,
            transactionId: transactionId || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed. Please try again.');
        }

        if (data.verified) {
          setPaymentStatus('payment-success');
          setPaymentReference('');
          setPaymentTransactionId('');
          setPaymentUrl('');

          try {
            await fetchCart();
          } catch (cartError) {
            console.error('Error updating cart after payment:', cartError);
          }

          setTimeout(() => {
            redirectAfterPaymentSuccess(data.orderId, cartSnapshot);
          }, 1200);
        } else if (!isAutomatic) {
          setPaymentError('Payment not confirmed yet. Complete checkout in Flutterwave and try again.');
        }
      } catch (error) {
        if (!isAutomatic) {
          setPaymentError(error.message || 'Verification failed.');
        }
      } finally {
        setIsVerifyingPayment(false);
      }
    },
    [
      apiUrl,
      authFetch,
      cartItems,
      fetchCart,
      isVerifyingPayment,
      paymentReference,
      paymentTransactionId,
      redirectAfterPaymentSuccess,
    ]
  );

  useEffect(() => {
    const status = searchParams.get('status');
    const txRef = searchParams.get('tx_ref');
    const transactionId = searchParams.get('transaction_id');

    if (status === 'successful' && txRef) {
      setPaymentMethod('flutterwave');
      setPaymentReference(txRef);
      if (transactionId) {
        setPaymentTransactionId(transactionId);
      }
      verifyFlutterwavePayment(txRef, transactionId, true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, verifyFlutterwavePayment]);

  useEffect(() => {
    if (!paymentReference) {
      return undefined;
    }

    const pollId = setInterval(() => {
      if (paymentMethod === 'paystack') {
        verifyPaystackPayment(undefined, true);
      } else if (paymentMethod === 'flutterwave') {
        verifyFlutterwavePayment(undefined, undefined, true);
      }
    }, 5000);

    return () => clearInterval(pollId);
  }, [paymentReference, paymentMethod, verifyPaystackPayment, verifyFlutterwavePayment]);

  const handleClaimBankTransfer = async () => {
    if (!canCheckout || isClaimingPayment || isInternationalCheckout) return;

    setPaymentError('');
    setPaymentStatus('');
    setBankSuccessMessage('');
    setIsClaimingPayment(true);

    const cartSnapshot = [...cartItems];
    const hasPublicationItems = cartSnapshot.some((item) => item.category === 'publication');

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

      setPaymentStatus('bank-pending');
      setBankSuccessMessage(
        hasPublicationItems
          ? 'After your payment is confirmed, you will receive an email containing the link to create your publication.'
          : 'After your payment is confirmed, you will receive an email with your order details and next steps.'
      );

      try {
        await fetchCart();
      } catch (cartError) {
        console.error('Error updating cart after bank transfer claim:', cartError);
      }

      const orderQuery = data.orderId ? `&order=${encodeURIComponent(data.orderId)}` : '';
      navigate(`/account?section=orders${orderQuery}`, { replace: true, state: { orderId: data.orderId } });
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
            {isInternationalCheckout
              ? `International checkout in ${checkoutCurrency}. Pay securely with Flutterwave.`
              : 'Complete your order with Paystack or bank transfer. All payments are processed securely.'}
          </p>
        </header>

        {loading ? (
          <div className="checkout-state-card">
            <p>Loading your cart…</p>
          </div>
        ) : paymentStatus === 'bank-pending' ? (
          <div className="checkout-state-card checkout-state-card--success">
            <div className="checkout-alert checkout-alert--success checkout-alert--bank" role="status">
              <p>{bankSuccessMessage}</p>
              <button
                type="button"
                className="checkout-btn checkout-btn--primary checkout-btn--inline"
                onClick={() => navigate('/account')}
              >
                Go to my account
              </button>
            </div>
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
                {cartItems.map((item) => {
                  const numericPrice = extractNumericPrice(item.price);
                  const lineTotal = numericPrice ? numericPrice * (item.quantity || 1) : null;

                  return (
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
                        <p className="checkout-item-price">
                          {lineTotal ? formatCheckoutAmount(lineTotal) : item.price}
                        </p>
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
                  );
                })}
              </ul>
            </section>

            <aside className="checkout-pay-panel">
              <h2 className="checkout-panel-title">Payment</h2>

              <div className="checkout-summary">
                <div className="checkout-summary-row">
                  <span>Subtotal</span>
                  <span>{formatCheckoutAmount(priceSummary.total)}</span>
                </div>
                {isInternationalCheckout ? (
                  <div className="checkout-summary-row checkout-summary-row--muted">
                    <span>Charged in</span>
                    <span>{checkoutCurrency}</span>
                  </div>
                ) : null}
                <div className="checkout-summary-row checkout-summary-row--total">
                  <strong>Total</strong>
                  <strong>{formatCheckoutAmount(priceSummary.total)}</strong>
                </div>
              </div>

              {priceSummary.invalidItems.length > 0 && (
                <div className="checkout-alert checkout-alert--warn" role="alert">
                  <ul>
                    {priceSummary.invalidItems.map((item, idx) => (
                      <li key={idx}>{item} — needs a numeric price to pay online.</li>
                    ))}
                  </ul>
                </div>
              )}

              {paymentStatus === 'payment-success' ? (
                <div className="checkout-alert checkout-alert--success" role="status">
                  <p>Payment confirmed! Taking you to the next step…</p>
                </div>
              ) : isInternationalCheckout ? (
                <div className="checkout-pay-body">
                  <div className="checkout-pay-methods checkout-pay-methods--single">
                    <div className="checkout-pay-option is-active checkout-pay-option--static">
                      <span className="checkout-pay-option-icon" aria-hidden="true">
                        <IoGlobeOutline />
                      </span>
                      <span className="checkout-pay-option-text">
                        <span className="checkout-pay-option-title">Flutterwave</span>
                        <span className="checkout-pay-option-desc">
                          Card and local payment methods in {checkoutCurrency}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="checkout-btn checkout-btn--primary"
                    onClick={handleInitializeFlutterwave}
                    disabled={!canCheckout || isInitializingPayment}
                  >
                    {isInitializingPayment ? 'Connecting to Flutterwave…' : `Pay with Flutterwave (${checkoutCurrency})`}
                  </button>

                  {paymentReference ? (
                    <div className="checkout-paystack-pending">
                      <p>
                        Flutterwave opened in a new tab. When finished, return here — we&apos;ll verify
                        automatically.
                      </p>
                      <div className="checkout-paystack-actions">
                        <button
                          type="button"
                          className="checkout-btn checkout-btn--outline"
                          onClick={() => handleOpenPaymentWindow(paymentUrl)}
                        >
                          Open Flutterwave again
                        </button>
                        <button
                          type="button"
                          className="checkout-btn checkout-btn--primary"
                          onClick={() => verifyFlutterwavePayment(undefined, undefined, false)}
                          disabled={isVerifyingPayment}
                        >
                          {isVerifyingPayment ? 'Verifying…' : "I've paid"}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {paymentError ? (
                    <div className="checkout-alert checkout-alert--error" role="alert">
                      {paymentError}
                    </div>
                  ) : null}
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
                        onClick={handleInitializePaystack}
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
                              onClick={() => verifyPaystackPayment(undefined, false)}
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
                          Transfer the exact total ({formatCheckoutAmount(priceSummary.total)}),
                          then tap below.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="checkout-btn checkout-btn--primary"
                        onClick={handleClaimBankTransfer}
                        disabled={!canCheckout || isClaimingPayment}
                      >
                        {isClaimingPayment ? 'Submitting…' : 'I have paid'}
                      </button>
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
                  Secured by {isInternationalCheckout ? 'Flutterwave' : 'Paystack'}. Questions?{' '}
                  <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
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
