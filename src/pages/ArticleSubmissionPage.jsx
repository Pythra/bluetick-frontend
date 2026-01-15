import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import './ArticleSubmissionPage.css';

function ArticleSubmissionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, apiUrl, getAuthHeaders } = useAuth();
  const { cartItems } = useCart();
  
  const [formData, setFormData] = useState({
    postTitle: '',
    postBody: '',
    articleContent: '',
    file: null,
    fileName: '',
    images: [],
    imageFiles: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [error, setError] = useState('');

  // Get order details from navigation state or cart
  const orderDetails = location.state || {};
  const isPublication = cartItems.some(item => item.category === 'publication');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file,
        fileName: file.name
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 2 images
    if (files.length + formData.images.length > 2) {
      setError('Maximum 2 images allowed');
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result],
          imageFiles: [...prev.imageFiles, file]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPublication && !formData.postTitle.trim()) {
      setError('Please enter a post title');
      return;
    }
    
    if (!formData.postBody.trim()) {
      setError('Please enter the post body/content');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSubmitStatus('');

    try {
      const response = await fetch(`${apiUrl}/api/orders/article-submission`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postTitle: formData.postTitle.trim(),
          postBody: formData.postBody.trim(),
          articleContent: formData.articleContent.trim(),
          orderId: orderDetails.orderId,
          serviceType: isPublication ? 'publication' : 'other',
          cartItems: cartItems,
          fileName: formData.fileName
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit article');
      }

      setSubmitStatus('success');
      
      // Clear cart after successful submission
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Article submission error:', error);
      setError(error.message || 'Failed to submit article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="article-submission-page">
        <div className="submission-container">
          <h1>
            {isPublication 
              ? 'Submit Your Article for Publication' 
              : 'Submit Your Instructions'
            }
          </h1>
          
          <div className="order-info">
            <h3>Order Summary</h3>
            <div className="cart-items-summary">
              {cartItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <span className="item-title">{item.title}</span>
                  <span className="item-price">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="submission-form">
            {!isPublication && (
              <div className="form-group">
                <label htmlFor="postTitle">Post Title *</label>
                <input
                  type="text"
                  id="postTitle"
                  name="postTitle"
                  value={formData.postTitle}
                  onChange={handleInputChange}
                  placeholder="Enter your post title"
                  className="form-control"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="postBody">
                {isPublication ? 'Article Content (Press Release)' : 'Post Body/Content *'}
              </label>
              <textarea
                id="postBody"
                name="postBody"
                value={formData.postBody}
                onChange={handleInputChange}
                placeholder={
                  isPublication 
                    ? 'Enter your press release or article content here. Include headline, body text, and any relevant details...'
                    : 'Enter the main content of your post...'
                }
                rows={10}
                className="article-textarea"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="articleContent">
                {isPublication ? 'Additional Notes' : 'Additional Instructions'}
              </label>
              <textarea
                id="articleContent"
                name="articleContent"
                value={formData.articleContent}
                onChange={handleInputChange}
                placeholder="Any additional notes or instructions for our team..."
                rows={5}
                className="article-textarea"
              />
              <small className="form-help">
                {isPublication 
                  ? 'Include any specific requirements or notes for our editorial team.'
                  : 'Add any special instructions or requirements for your post.'
                }
              </small>
            </div>

            <div className="form-group file-upload-container">
              <label>Upload Document (Optional)</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="file-upload-input"
                  accept=".doc,.docx,.pdf,.txt"
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  {formData.fileName || 'Choose a file...'}
                </label>
                {formData.fileName && (
                  <span className="file-upload-clear" onClick={() => setFormData(prev => ({ ...prev, file: null, fileName: '' }))}>
                    ×
                  </span>
                )}
              </div>
              <small className="form-help">Supported formats: .doc, .docx, .pdf, .txt (Max 10MB)</small>
            </div>

            <div className="form-group file-upload-container">
              <label>Upload Images (Optional - Max 2 images)</label>
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
                  {formData.images.length >= 2 ? 'Maximum images reached' : `Choose image${formData.images.length > 0 ? 's' : ''}...`}
                </label>
              </div>
              <small className="form-help">Supported formats: JPG, PNG, GIF, WebP (Max 2 images)</small>
              
              {formData.images.length > 0 && (
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                  {formData.images.map((image, index) => (
                    <div key={index} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                      <img 
                        src={image} 
                        alt={`Preview ${index + 1}`} 
                        style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          lineHeight: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {submitStatus === 'success' ? (
              <div className="success-message">
                <h3>Submission Successful!</h3>
                <p>
                  {isPublication 
                    ? 'Your article has been submitted successfully. Our editorial team will review it and proceed with publication on your selected platforms.'
                    : 'Your instructions have been submitted successfully. Our team will review them and proceed with your order.'
                  }
                </p>
                <p>You will be redirected to the homepage shortly...</p>
              </div>
            ) : (
              <div className="form-actions">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => navigate('/checkout')}
                  className="cancel-btn"
                >
                  Back to Checkout
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !formData.postBody.trim() || (!isPublication && !formData.postTitle.trim())}
                  className="submit-btn"
                >
                  {isSubmitting 
                    ? 'Submitting...' 
                    : isPublication 
                      ? 'Submit Article' 
                      : 'Submit Post'
                  }
                </Button>
              </div>
            )}
          </form>

          <div className="guidelines">
            <h3>Guidelines</h3>
            {isPublication ? (
              <ul>
                <li>Ensure your press release is newsworthy and relevant</li>
                <li>Include a compelling headline that summarizes your story</li>
                <li>Provide detailed body content with key information</li>
                <li>Double-check all facts and figures before submission</li>
                <li>Our editorial team may make minor adjustments to meet platform requirements</li>
              </ul>
            ) : (
              <ul>
                <li>Be as specific as possible about your requirements</li>
                <li>Include any preferences or special instructions</li>
                <li>Provide contact information if additional clarification is needed</li>
                <li>Our team will review your instructions and proceed accordingly</li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ArticleSubmissionPage;
