import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { IoDocumentTextOutline, IoCloudUploadOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import RichTextEditor from '../components/RichTextEditor';
import ContentPreviewModal from '../components/ContentPreviewModal';
import './ArticleSubmissionPage.css';

function ArticleSubmissionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, apiUrl, authFetch } = useAuth();
  const { showToast } = useToast();
  const { cartItems } = useCart();

  const [formData, setFormData] = useState({
    postTitle: '',
    postBody: '',
    articleContent: '',
    preferredPublicationCategory: '',
    preferredPublicationDate: '',
    preferredMediaPlatforms: '',
    contactInformation: '',
    linksToInclude: '',
    socialMediaLinks: '',
    file: null,
    fileName: '',
    images: [],
    imageFiles: [],
    companyLogo: null,
    companyLogoName: '',
    videos: [],
    videoFiles: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [error, setError] = useState('');
  const [orderFromLink, setOrderFromLink] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [useSameArticleForAll, setUseSameArticleForAll] = useState(true);
  const [activeTargetItemId, setActiveTargetItemId] = useState('');
  const [partialSuccessMessage, setPartialSuccessMessage] = useState('');

  const orderIdFromQuery = searchParams.get('orderId');
  const orderDetails = location.state || {};
  const resolvedOrderId = orderDetails.orderId || orderIdFromQuery;
  const displayItems =
    cartItems.length > 0 ? cartItems : orderFromLink?.cartItems || [];
  const publicationItems =
    orderFromLink?.publicationItems?.length > 0
      ? orderFromLink.publicationItems
      : displayItems
          .filter((item) => item.category === 'publication')
          .map((item) => ({
            itemId: item.itemId,
            title: item.title,
            price: item.price,
            submitted: false,
          }));
  const isPublication = publicationItems.length > 0;
  const multiplePublications = publicationItems.length > 1;
  const submittedPublicationCount = publicationItems.filter((item) => item.submitted).length;
  const activePublicationItem =
    publicationItems.find((item) => item.itemId === activeTargetItemId) ||
    publicationItems.find((item) => !item.submitted) ||
    publicationItems[0];
  const allPublicationsSubmitted =
    orderFromLink?.publicationSubmissionComplete ||
    (publicationItems.length > 0 && publicationItems.every((item) => item.submitted));

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
        if (data.order.onboardingLocked || (data.order.agreement && !data.order.agreementSigned)) {
          navigate(`/service-agreement?orderId=${orderIdFromQuery}`, { replace: true });
          return;
        }
        if (!cancelled) {
          setOrderFromLink(data.order);
          const pubs = data.order.publicationItems || [];
          const firstPending = pubs.find((item) => !item.submitted);
          if (firstPending?.itemId) {
            setActiveTargetItemId(firstPending.itemId);
          } else if (pubs[0]?.itemId) {
            setActiveTargetItemId(pubs[0].itemId);
          }
          if (pubs.length === 0) {
            navigate(`/project-onboarding?orderId=${orderIdFromQuery}`, { replace: true });
          }
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
  }, [orderIdFromQuery, isAuthenticated, apiUrl, authFetch, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        companyLogo: file,
        companyLogoName: file.name,
      }));
    }
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setFormData((prev) => ({
      ...prev,
      videos: [...prev.videos, ...files.map((file) => file.name)],
      videoFiles: [...prev.videoFiles, ...files],
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

  const handlePreview = () => {
    if (!formData.postTitle.trim() && !getPlainTextFromHtml(formData.postBody)) {
      setError('Add a headline or body before previewing.');
      return;
    }
    setError('');
    setShowPreview(true);
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

  const resetSubmissionForm = () => {
    setFormData({
      postTitle: '',
      postBody: '',
      articleContent: '',
      preferredPublicationCategory: '',
      preferredPublicationDate: '',
      preferredMediaPlatforms: '',
      contactInformation: '',
      linksToInclude: '',
      socialMediaLinks: '',
      file: null,
      fileName: '',
      images: [],
      imageFiles: [],
      companyLogo: null,
      companyLogoName: '',
      videos: [],
      videoFiles: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const plainPostBody = getPlainTextFromHtml(formData.postBody);
    const plainArticleContent = formData.articleContent.trim();

    if (!formData.postTitle.trim()) {
      setError(isPublication ? 'Please enter a headline for your press release' : 'Please enter a post title');
      return;
    }

    if (!plainPostBody) {
      setError('Please enter the article content');
      return;
    }

    if (isPublication) {
      if (!formData.preferredPublicationCategory.trim()) {
        setError('Preferred publication category is required');
        return;
      }
      if (!formData.preferredPublicationDate.trim()) {
        setError('Preferred publication date is required');
        return;
      }
      if (!formData.preferredMediaPlatforms.trim()) {
        setError('Preferred media platforms are required');
        return;
      }
      if (!formData.contactInformation.trim()) {
        setError('Contact information is required');
        return;
      }
    }

    if (!resolvedOrderId) {
      setError('Order ID is missing. Open this page from your account or payment confirmation email.');
      return;
    }

    if (multiplePublications && !useSameArticleForAll && !activeTargetItemId) {
      setError('Select which publication package you are writing for.');
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
          articleContent: plainArticleContent,
          preferredPublicationCategory: formData.preferredPublicationCategory.trim(),
          preferredPublicationDate: formData.preferredPublicationDate.trim(),
          preferredMediaPlatforms: formData.preferredMediaPlatforms.trim(),
          contactInformation: formData.contactInformation.trim(),
          linksToInclude: formData.linksToInclude.trim(),
          socialMediaLinks: formData.socialMediaLinks.trim(),
          orderId: resolvedOrderId,
          fileName: formData.fileName,
          companyLogoName: formData.companyLogoName,
          useSameArticleForAll: multiplePublications ? useSameArticleForAll : true,
          targetItemId:
            multiplePublications && !useSameArticleForAll ? activeTargetItemId : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit article');
      }

      if (data.publicationSubmissionComplete) {
        setSubmitStatus('success');
        setPartialSuccessMessage('');
        showToast({ message: 'Article submitted successfully!', type: 'success' });
        setTimeout(() => {
          navigate('/account');
        }, 3000);
        return;
      }

      const savedMessage = data.message || 'Article saved. Submit the next platform when ready.';
      setPartialSuccessMessage(savedMessage);
      showToast({ message: savedMessage, type: 'success' });
      resetSubmissionForm();
      if (data.publicationItems?.length) {
        setOrderFromLink((prev) =>
          prev
            ? {
                ...prev,
                publicationItems: data.publicationItems,
                pendingPublicationCount: data.pendingPublicationCount,
                publicationSubmissionComplete: false,
              }
            : prev
        );
        const nextPending = data.publicationItems.find((item) => !item.submitted);
        if (nextPending?.itemId) {
          setActiveTargetItemId(nextPending.itemId);
        }
      }
    } catch (submitError) {
      console.error('Article submission error:', submitError);
      const message = submitError.message || 'Failed to submit article. Please try again.';
      setError(message);
      showToast({ message, type: 'error' });
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

  if (orderFromLink && orderIdFromQuery && !isPublication) {
    return (
      <div className="article-submission-page">
        <Navbar />
        <main className="article-submission-main">
          <div className="article-submission-shell">
            <div className="article-alert article-alert-error" role="alert">
              {error ||
                'This order does not require an article submission. Our team will contact you about your services.'}
            </div>
            <Button type="button" onClick={() => navigate('/account')}>
              Back to account
            </Button>
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
                  {publicationItems.length > 0 ? (
                    publicationItems.map((item, index) => (
                      <li
                        key={`${item.itemId || item.title}-${index}`}
                        className={item.submitted ? 'article-order-item--done' : ''}
                      >
                        <span>
                          {item.title}
                          {item.submitted ? ' (submitted)' : ''}
                        </span>
                        {item.price ? <strong>{item.price}</strong> : null}
                      </li>
                    ))
                  ) : displayItems.length > 0 ? (
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
                {multiplePublications && (
                  <p className="article-order-progress">
                    {submittedPublicationCount} of {publicationItems.length} platform
                    {publicationItems.length === 1 ? '' : 's'} submitted
                  </p>
                )}
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

              {allPublicationsSubmitted && orderFromLink ? (
                <div className="article-alert article-alert-success">
                  <h3>All articles submitted</h3>
                  <p>
                    Our editorial team will review your press release
                    {multiplePublications ? 's' : ''} and proceed with placement on your selected
                    platforms.
                  </p>
                  <Button type="button" onClick={() => navigate('/account')}>
                    Back to account
                  </Button>
                </div>
              ) : submitStatus === 'success' ? (
                <div className="article-alert article-alert-success">
                  <h3>Submission received</h3>
                  <p>
                    Our editorial team will review your press release and proceed with placement on
                    your selected platforms.
                  </p>
                  <p className="article-alert-note">Redirecting you to your account…</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="article-form">
                  {partialSuccessMessage && (
                    <div className="article-alert article-alert-success" role="status">
                      {partialSuccessMessage}
                    </div>
                  )}

                  {isPublication && orderFromLink ? (
                    <section className="article-form-section article-order-meta-section">
                      <h2 className="article-form-section-title">Order information</h2>
                      <div className="article-order-meta-grid">
                        <div className="form-group">
                          <label>Order ID</label>
                          <input
                            type="text"
                            className="form-control"
                            readOnly
                            value={String(orderFromLink._id || resolvedOrderId || '')}
                          />
                        </div>
                        <div className="form-group">
                          <label>Payment reference</label>
                          <input
                            type="text"
                            className="form-control"
                            readOnly
                            value={
                              orderFromLink.paymentReference ||
                              orderFromLink.paymentDetails?.reference ||
                              '—'
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Submission date</label>
                          <input
                            type="text"
                            className="form-control"
                            readOnly
                            value={new Date().toLocaleString('en-NG', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          />
                        </div>
                      </div>
                    </section>
                  ) : null}

                  {multiplePublications && (
                    <section className="article-form-section article-multi-pub-section">
                      <h2 className="article-multi-pub-title">Multiple publications</h2>
                      <label className="article-same-article-option">
                        <input
                          type="checkbox"
                          checked={useSameArticleForAll}
                          onChange={(e) => setUseSameArticleForAll(e.target.checked)}
                        />
                        <span>
                          Use the same article for all platforms in this order
                        </span>
                      </label>
                      {!useSameArticleForAll && (
                        <div className="article-platform-picker">
                          <p className="article-platform-picker-label">
                            You are writing for:
                          </p>
                          <div className="article-platform-picker-chips">
                            {publicationItems.map((item) => (
                              <button
                                key={item.itemId}
                                type="button"
                                className={`article-platform-chip${
                                  item.itemId === activeTargetItemId
                                    ? ' article-platform-chip--active'
                                    : ''
                                }${item.submitted ? ' article-platform-chip--done' : ''}`}
                                disabled={item.submitted}
                                onClick={() => setActiveTargetItemId(item.itemId)}
                              >
                                {item.title}
                                {item.submitted ? ' ✓' : ''}
                              </button>
                            ))}
                          </div>
                          {activePublicationItem && !activePublicationItem.submitted && (
                            <p className="article-platform-active-note">
                              Submitting for: <strong>{activePublicationItem.title}</strong>
                            </p>
                          )}
                        </div>
                      )}
                    </section>
                  )}

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
                        {isPublication ? 'Article content *' : 'Post body *'}
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

                    {isPublication ? (
                      <>
                        <div className="form-group">
                          <label htmlFor="preferredPublicationCategory">
                            Preferred publication category *
                          </label>
                          <input
                            type="text"
                            id="preferredPublicationCategory"
                            name="preferredPublicationCategory"
                            value={formData.preferredPublicationCategory}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="e.g. Tech & Startups, African News"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="preferredPublicationDate">
                            Preferred publication date *
                          </label>
                          <input
                            type="date"
                            id="preferredPublicationDate"
                            name="preferredPublicationDate"
                            value={formData.preferredPublicationDate}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="preferredMediaPlatforms">
                            Preferred media platforms *
                          </label>
                          <textarea
                            id="preferredMediaPlatforms"
                            name="preferredMediaPlatforms"
                            value={formData.preferredMediaPlatforms}
                            onChange={handleInputChange}
                            className="article-textarea article-textarea-compact"
                            rows={3}
                            placeholder="List outlets or categories you want this published on"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="contactInformation">Contact information *</label>
                          <textarea
                            id="contactInformation"
                            name="contactInformation"
                            value={formData.contactInformation}
                            onChange={handleInputChange}
                            className="article-textarea article-textarea-compact"
                            rows={3}
                            placeholder="Name, email, phone for media enquiries"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="linksToInclude">Links to include</label>
                          <textarea
                            id="linksToInclude"
                            name="linksToInclude"
                            value={formData.linksToInclude}
                            onChange={handleInputChange}
                            className="article-textarea article-textarea-compact"
                            rows={3}
                            placeholder="Website, product pages, or other URLs"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="socialMediaLinks">Social media links</label>
                          <textarea
                            id="socialMediaLinks"
                            name="socialMediaLinks"
                            value={formData.socialMediaLinks}
                            onChange={handleInputChange}
                            className="article-textarea article-textarea-compact"
                            rows={3}
                            placeholder="Instagram, LinkedIn, X, etc."
                          />
                        </div>
                      </>
                    ) : (
                      <div className="form-group">
                        <label htmlFor="articleContent">Additional instructions</label>
                        <textarea
                          id="articleContent"
                          name="articleContent"
                          value={formData.articleContent}
                          onChange={handleInputChange}
                          placeholder="Preferred outlets, embargo dates, contact details, link preferences..."
                          className="article-textarea article-textarea-compact"
                          rows={5}
                        />
                        <small className="form-help">Plain text only — no formatting.</small>
                      </div>
                    )}
                  </section>

                  <section className="article-form-section">
                    <div className="article-form-section-head">
                      <IoCloudUploadOutline aria-hidden="true" />
                      <div>
                        <h2>{isPublication ? 'File uploads' : 'Files & images'}</h2>
                        <p>
                          {isPublication
                            ? 'Article document, images, videos, and company logo.'
                            : 'Optional uploads to support your submission.'}
                        </p>
                      </div>
                    </div>

                    <div className="form-group file-upload-container">
                      <label htmlFor="file-upload">
                        {isPublication ? 'Article document' : 'Document (optional)'}
                      </label>
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

                    {isPublication ? (
                      <>
                        <div className="form-group file-upload-container">
                          <label htmlFor="video-upload">Videos</label>
                          <div className="file-upload-wrapper">
                            <input
                              type="file"
                              id="video-upload"
                              onChange={handleVideoChange}
                              className="file-upload-input"
                              accept="video/*"
                              multiple
                            />
                            <label htmlFor="video-upload" className="file-upload-label">
                              {formData.videos.length
                                ? `${formData.videos.length} video(s) selected`
                                : 'Choose video files'}
                            </label>
                          </div>
                        </div>

                        <div className="form-group file-upload-container">
                          <label htmlFor="logo-upload">Company logo</label>
                          <div className="file-upload-wrapper">
                            <input
                              type="file"
                              id="logo-upload"
                              onChange={handleLogoChange}
                              className="file-upload-input"
                              accept="image/*"
                            />
                            <label htmlFor="logo-upload" className="file-upload-label">
                              {formData.companyLogoName || 'Choose logo image'}
                            </label>
                            {formData.companyLogoName ? (
                              <button
                                type="button"
                                className="file-upload-clear"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    companyLogo: null,
                                    companyLogoName: '',
                                  }))
                                }
                                aria-label="Remove logo"
                              >
                                ×
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </section>

                  <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={handleBack} className="cancel-btn">
                      {cartItems.length > 0 ? 'Back to checkout' : 'Back to account'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={handlePreview} className="preview-btn">
                      Preview
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
                        : multiplePublications && !useSameArticleForAll
                          ? `Submit for ${activePublicationItem?.title || 'platform'}`
                          : multiplePublications && useSameArticleForAll
                            ? 'Submit for all platforms'
                            : 'Submit for publication'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ContentPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        dialogTitle={isPublication ? 'Press release preview' : 'Submission preview'}
        title={formData.postTitle}
        category={isPublication ? 'Press release' : 'Submission'}
        author="You"
        contentHtml={formData.postBody}
        images={formData.images}
        notes={formData.articleContent}
        notesLabel={isPublication ? 'Editorial notes' : 'Additional instructions'}
      />
    </div>
  );
}

export default ArticleSubmissionPage;
