 import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CheckoutPage.css';

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

  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [isClaimingPayment, setIsClaimingPayment] = useState(false);

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

  const handleClaimBankTransfer = async () => {
    if (!canCheckout || isClaimingPayment) return;

    setPaymentError('');
    setPaymentStatus('');
    setIsClaimingPayment(true);

    try {
      const response = await fetch(`${apiUrl}/api/payments/bank-transfer/claim`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse bank transfer claim response:', jsonError);
        throw new Error('Received an invalid response from the server. Please try again.');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to submit payment claim. Please try again.');
      }

      setPaymentStatus('success');

      // Use cart information from backend response for redirection
      const isPublicationService = data.cartInfo && data.cartInfo.hasPublicationItems;
      
      // Redirect to appropriate submission page after successful payment claim
      setTimeout(() => {
        if (isPublicationService) {
          navigate('/article-submission', { 
            state: { 
              orderId: data.orderId,
              serviceType: 'publication',
              cartItems: data.cartInfo.cartItems
            } 
          });
        } else {
          navigate('/article-submission', { 
            state: { 
              orderId: data.orderId,
              serviceType: 'other',
              cartItems: data.cartInfo.cartItems
            } 
          });
        }
      }, 2000);

      try {
        await fetchCart();
      } catch (cartError) {
        console.error('Error updating cart after bank transfer claim:', cartError);
      }
    } catch (error) {
      console.error('Bank transfer claim error:', error);
      setPaymentError(error.message || 'Unable to submit payment claim. Please try again.');
    } finally {
      setIsClaimingPayment(false);
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

              <div className="dva-section">
                <div className="bank-info">
                  <p><strong>Bank Name:</strong> KudaBank</p>
                  <p><strong>Account Name:</strong> BLUETICKGENG DEVELOPMENT</p>
                  <p><strong>Account Number:</strong> 3002433836</p>
                </div>

                <button
                  onClick={handleClaimBankTransfer}
                  disabled={!canCheckout || isClaimingPayment}
                  className="checkout-button"
                >
                  {isClaimingPayment ? 'Processing...' : 'I Have Paid'}
                </button>
              </div>

              {paymentStatus === 'success' ? (
                <div className="success-message">
                  <p>Payment claim submitted successfully! Your order is now pending verification.</p>
                  <button onClick={() => navigate('/')} className="checkout-button">
                    Continue browsing
                  </button>
                </div>
              ) : (
                <div className="payment-info">
                  {paymentError && <div className="error-message">{paymentError}</div>}
                  <p>
                    Need help? Reach us at{' '}
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