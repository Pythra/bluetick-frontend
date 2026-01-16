import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ArticleSubmissionPage.css';

function ArticleSubmissionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, apiUrl, getAuthHeaders } = useAuth();
  const { cartItems } = useCart();
  
  const [formData, setFormData] = useState({
    postTitle: '',
    postSummary: '',
    postContent: '',
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
    
    if (!formData.postSummary.trim()) {
      setError('Please enter a post summary');
      return;
    }
    if (formData.postSummary.length > 160) {
      setError('Post summary must be 160 characters or less');
      return;
    }
    const postContentText = formData.postContent.replace(/<[^>]*>/g, '').trim();
    if (!postContentText) {
      setError('Please enter post content');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSubmitStatus('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('postTitle', formData.postTitle.trim());
      formDataToSend.append('postSummary', formData.postSummary.trim());
      formDataToSend.append('postContent', formData.postContent || '');
      formDataToSend.append('articleContent', formData.articleContent.trim());
      formDataToSend.append('orderId', orderDetails.orderId);
      formDataToSend.append('serviceType', isPublication ? 'publication' : 'other');
      formDataToSend.append('cartItems', JSON.stringify(cartItems));

      if (formData.file) {
        formDataToSend.append('document', formData.file);
      }

      if (formData.imageFiles && formData.imageFiles.length > 0) {
        console.log('[Frontend] Sending images:', formData.imageFiles.length);
        formData.imageFiles.forEach((imageFile, index) => {
          if (imageFile && imageFile instanceof File) {
            console.log(`[Frontend] Appending image ${index + 1}:`, imageFile.name, imageFile.type, imageFile.size);
            formDataToSend.append('images', imageFile, imageFile.name);
          } else {
            console.error(`[Frontend] Invalid image file at index ${index}:`, imageFile);
          }
        });
      } else {
        console.log('[Frontend] No images to send - imageFiles:', formData.imageFiles);
      }

      const response = await fetch(`${apiUrl}/api/orders/article-submission`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: formDataToSend,
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
              <label htmlFor="postSummary">
                Post Summary *
                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#666', marginLeft: '8px' }}>
                  ({formData.postSummary.length}/160 characters)
                </span>
              </label>
              <textarea
                id="postSummary"
                name="postSummary"
                value={formData.postSummary}
                onChange={handleInputChange}
                placeholder="160 characters max. Our readers engage more with short, punchy headlines. Aim for 10 to 12 words max!"
                rows={3}
                className="article-textarea"
                maxLength={160}
                required
              />
              <small className="form-help">
                Our readers engage more with short, punchy headlines. Aim for 10 to 12 words max!
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="postContent">
                Post Content *
              </label>
              <div className="quill-wrapper">
                <ReactQuill
                  theme="snow"
                  value={formData.postContent}
                  onChange={(value) => setFormData(prev => ({ ...prev, postContent: value }))}
                  placeholder="Make it count. Share the who, what, when, and how."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      [{ 'font': [] }],
                      [{ 'size': ['small', false, 'large', 'huge'] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'align': [] }],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
                      [{ 'script': 'sub'}, { 'script': 'super' }],
                      [{ 'indent': '-1'}, { 'indent': '+1' }],
                      ['blockquote', 'code-block'],
                      ['link', 'image', 'video'],
                      ['clean'],
                    ],
                    history: {
                      delay: 1000,
                      maxStack: 50,
                      userOnly: false
                    }
                  }}
                  formats={[
                    'header', 'font', 'size',
                    'bold', 'italic', 'underline', 'strike',
                    'color', 'background',
                    'align',
                    'list', 'bullet', 'check', 'indent',
                    'script',
                    'blockquote', 'code-block',
                    'link', 'image', 'video'
                  ]}
                  bounds=".quill-wrapper"
                />
              </div>
              <small className="form-help">
                Concise press releases with an average of 800 words or less are most useful to readers.
              </small>
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
                  disabled={isSubmitting || !formData.postSummary.trim() || !formData.postContent.trim() || (!isPublication && !formData.postTitle.trim()) || formData.postSummary.length > 160}
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
