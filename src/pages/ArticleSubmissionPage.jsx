import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { IoDocumentTextOutline, IoCloudUploadOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import RichTextEditor from '../components/RichTextEditor';
import './ArticleSubmissionPage.css';

function ArticleSubmissionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, apiUrl, authFetch } = useAuth();
  const { cartItems } = useCart();

  const [formData, setFormData] = useState({
    postTitle: '',
    postBody: '',
    articleContent: '',
    file: null,
    fileName: '',
    images: [],
    imageFiles: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [error, setError] = useState('');
  const [orderFromLink, setOrderFromLink] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const orderIdFromQuery = searchParams.get('orderId');
  const orderDetails = location.state || {};
  const resolvedOrderId = orderDetails.orderId || orderIdFromQuery;
  const displayItems =
    cartItems.length > 0 ? cartItems : orderFromLink?.cartItems || [];
  const isPublication =
    displayItems.some((item) => item.category === 'publication') ||
    orderFromLink?.cartItems?.some((item) => item.category === 'publication');

  useEffect(() => {
    if (!isAuthenticated) {
      const returnPath = `${location.pathname}${location.search}`;
      navigate('/login', { state: { from: returnPath } });
    }
  }, [isAuthenticated, navigate, location.pathname, location.search]);

  useEffect(() => {
    if (!orderIdFromQuery || !isAuthenticated) {
      return;
    }

    let cancelled = false;

    const loadOrder = async () => {
      setLoadingOrder(true);
      setError('');
      try {
        const response = await authFetch(`${apiUrl}/api/orders/${orderIdFromQuery}`);
        const data = await response.json();
        if (!response.ok || !data.success || !data.order) {
          throw new Error(data.error || 'Unable to load order details');
        }
        if (data.order.paymentStatus !== 'paid') {
          throw new Error('This order is still awaiting payment confirmation.');
        }
        if (!cancelled) {
          setOrderFromLink(data.order);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Unable to load order details.');
        }
      } finally {
        if (!cancelled) {
          setLoadingOrder(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderIdFromQuery, isAuthenticated, apiUrl, authFetch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
        fileName: file.name,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + formData.images.length > 2) {
      setError('Maximum 2 images allowed');
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, event.target.result],
          imageFiles: [...prev.imageFiles, file],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const handleBack = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
      return;
    }
    navigate('/account');
  };

  const getPlainTextFromHtml = (htmlValue = '') =>
    htmlValue
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const plainPostBody = getPlainTextFromHtml(formData.postBody);
    const plainArticleContent = getPlainTextFromHtml(formData.articleContent);

    if (!formData.postTitle.trim()) {
      setError(isPublication ? 'Please enter a headline for your press release' : 'Please enter a post title');
      return;
    }

    if (!plainPostBody) {
      setError('Please enter the article body');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSubmitStatus('');

    try {
      const response = await authFetch(`${apiUrl}/api/orders/article-submission`, {
        method: 'POST',
        body: JSON.stringify({
          postTitle: formData.postTitle.trim(),
          postBody: formData.postBody.trim(),
          articleContent: plainArticleContent ? formData.articleContent.trim() : '',
          orderId: resolvedOrderId,
          serviceType: isPublication ? 'publication' : 'other',
          cartItems: displayItems,
          fileName: formData.fileName,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit article');
      }

      setSubmitStatus('success');

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (submitError) {
      console.error('Article submission error:', submitError);
      setError(submitError.message || 'Failed to submit article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loadingOrder) {
    return (
      <div className="article-submission-page">
        <Navbar />
        <main className="article-submission-main">
          <div className="article-submission-shell">
            <p className="article-submission-loading">Loading your order…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const publicationGuidelines = [
    'Use a clear headline and lead paragraph — who, what, when, where, why.',
    'Keep paragraphs short (2–4 sentences) for easy reading on news sites.',
    'Include quotes, names, and titles where relevant.',
    'Paste plain text or upload a .doc / .pdf if you already have a formatted release.',
    'Our team may lightly edit for outlet style before publication.',
  ];

  const generalGuidelines = [
    'Be specific about what you want published or delivered.',
    'Include links, names, and deadlines in the notes field if needed.',
    'Upload a document if your brief is longer than the text box.',
  ];

  return (
    <div className="article-submission-page">
      <Navbar />

      <main className="article-submission-main">
        <div className="article-submission-shell">
          <header className="article-submission-header">
            <p className="article-submission-kicker">
              {isPublication ? 'Press release submission' : 'Order instructions'}
            </p>
            <h1 className="article-submission-title">
              {isPublication
                ? 'Submit your article for publication'
                : 'Submit your instructions'}
            </h1>
            <p className="article-submission-lead">
              {isPublication
                ? 'Send your headline, body copy, and any files. We will review and distribute to the outlets in your order.'
                : 'Tell us exactly what you need so our team can complete your order.'}
            </p>
          </header>

          <div className="article-submission-layout">
            <aside className="article-submission-sidebar">
              <section className="article-panel article-order-panel">
                <h2>Order summary</h2>
                <ul className="article-order-list">
                  {displayItems.length > 0 ? (
                    displayItems.map((item, index) => (
                      <li key={`${item.title}-${index}`}>
                        <span>{item.title}</span>
                        <strong>{item.price}</strong>
                      </li>
                    ))
                  ) : (
                    <li className="article-order-empty">No items in this order.</li>
                  )}
                </ul>
              </section>

              <section className="article-panel article-guidelines-panel">
                <h2>{isPublication ? 'Formatting tips' : 'Guidelines'}</h2>
                <ul>
                  {(isPublication ? publicationGuidelines : generalGuidelines).map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </section>
            </aside>

            <div className="article-submission-content">
              {error && !submitStatus && (
                <div className="article-alert article-alert-error" role="alert">
                  {error}
                </div>
              )}

              {submitStatus === 'success' ? (
                <div className="article-alert article-alert-success">
                  <h3>Submission received</h3>
                  <p>
                    {isPublication
                      ? 'Our editorial team will review your press release and proceed with placement on your selected platforms.'
                      : 'Our team will review your instructions and proceed with your order.'}
                  </p>
                  <p className="article-alert-note">Redirecting you to the homepage…</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="article-form">
                  <section className="article-form-section">
                    <div className="article-form-section-head">
                      <IoDocumentTextOutline aria-hidden="true" />
                      <div>
                        <h2>{isPublication ? 'Press release content' : 'Post details'}</h2>
                        <p>Headline and main body text for your submission.</p>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="postTitle">
                        {isPublication ? 'Headline *' : 'Post title *'}
                      </label>
                      <input
                        type="text"
                        id="postTitle"
                        name="postTitle"
                        value={formData.postTitle}
                        onChange={handleInputChange}
                        placeholder={
                          isPublication
                            ? 'e.g. Acme launches new payment product in Lagos'
                            : 'Enter your post title'
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="postBody">
                        {isPublication ? 'Article body *' : 'Post body *'}
                      </label>
                      <RichTextEditor
                        value={formData.postBody}
                        onChange={(value) => setFormData((prev) => ({ ...prev, postBody: value }))}
                        placeholder={
                          isPublication
                            ? 'Write your full press release here. Start with a strong opening paragraph, then add supporting details, quotes, and a boilerplate about your company if needed.'
                            : 'Enter the main content of your post...'
                        }
                        minHeight={460}
                      />
                      <small className="form-help">
                        {isPublication
                          ? 'Plain text is fine. Use line breaks between paragraphs.'
                          : 'Include all content you want our team to use.'}
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="articleContent">
                        {isPublication ? 'Editorial notes' : 'Additional instructions'}
                      </label>
                      <RichTextEditor
                        value={formData.articleContent}
                        onChange={(value) => setFormData((prev) => ({ ...prev, articleContent: value }))}
                        placeholder="Preferred outlets, embargo dates, contact details, link preferences..."
                        minHeight={140}
                      />
                    </div>
                  </section>

                  <section className="article-form-section">
                    <div className="article-form-section-head">
                      <IoCloudUploadOutline aria-hidden="true" />
                      <div>
                        <h2>Files &amp; images</h2>
                        <p>Optional uploads to support your submission.</p>
                      </div>
                    </div>

                    <div className="form-group file-upload-container">
                      <label htmlFor="file-upload">Document (optional)</label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="file-upload"
                          onChange={handleFileChange}
                          className="file-upload-input"
                          accept=".doc,.docx,.pdf,.txt"
                        />
                        <label htmlFor="file-upload" className="file-upload-label">
                          {formData.fileName || 'Choose .doc, .docx, .pdf, or .txt'}
                        </label>
                        {formData.fileName && (
                          <button
                            type="button"
                            className="file-upload-clear"
                            onClick={() => setFormData((prev) => ({ ...prev, file: null, fileName: '' }))}
                            aria-label="Remove file"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="form-group file-upload-container">
                      <label htmlFor="image-upload">Images (optional, max 2)</label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="image-upload"
                          onChange={handleImageChange}
                          className="file-upload-input"
                          accept="image/*"
                          multiple
                          disabled={formData.images.length >= 2}
                        />
                        <label htmlFor="image-upload" className="file-upload-label">
                          {formData.images.length >= 2
                            ? 'Maximum images reached'
                            : 'Choose JPG, PNG, GIF, or WebP'}
                        </label>
                      </div>

                      {formData.images.length > 0 && (
                        <div className="article-image-previews">
                          {formData.images.map((image, index) => (
                            <div key={index} className="article-image-preview">
                              <img src={image} alt={`Upload preview ${index + 1}`} />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                aria-label={`Remove image ${index + 1}`}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>

                  <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={handleBack} className="cancel-btn">
                      {cartItems.length > 0 ? 'Back to checkout' : 'Back to account'}
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !getPlainTextFromHtml(formData.postBody) ||
                        !formData.postTitle.trim()
                      }
                      className="submit-btn"
                    >
                      {isSubmitting
                        ? 'Submitting…'
                        : isPublication
                          ? 'Submit for publication'
                          : 'Submit instructions'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ArticleSubmissionPage;
