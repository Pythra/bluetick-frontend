import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Footer from '../components/Footer';
import './InstagramServicesPage.css';

function InstagramServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = async (item) => {
    const result = await addToCart({
      itemId: item.id || `${item.title}-${Date.now()}`,
      title: item.title || item.name,
      price: item.price,
      description: item.description || '',
      category: 'instagram',
      quantity: 1,
    });
    
    if (result.success) {
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 3000);
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

  return (
    <div className="instagram-page">
      {showCartNotification && (
        <div className="cart-notification">
          Item added to cart!
        </div>
      )}
      <Navbar onScrollToSection={scrollToSection} />
      
      {/* Hero Section */}
      <section className="instagram-hero">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <h1 className="hero-title">Instagram Promotion Services</h1>
          <p className="hero-subtitle">
            Get Your Content Featured on Top Instagram Pages - Reach Millions of Followers
          </p>
          <p className="hero-description">
            Promote your brand, music, or content on Nigeria's most popular Instagram pages. 
            From entertainment blogs to celebrity news platforms, we connect you with audiences that matter.
          </p>
        </div>
      </section>

      {/* Instagram Pages Price List Section */}
      <section className="instagram-price-section">
        <div className="container">
          <h2 className="section-title">Price List for Instagram Pages</h2>
          
          <div className="instagram-price-container">
            <div className="instagram-category">
              <h3 className="instagram-category-title">Instagram Blogs Promotions</h3>
              <div className="instagram-price-grid">
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Alabareports</span>
                    <span className="instagram-price">₦100,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Alabareports', price: '₦100,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Gossipmial</span>
                    <span className="instagram-price">₦1,000,000 or ₦500,000</span>
                    <span className="instagram-note">(Gossipmial Have 2 account)</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Gossipmial', price: '₦1,000,000 or ₦500,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">WahalaNetwork</span>
                    <span className="instagram-price">₦400,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'WahalaNetwork', price: '₦400,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Instablog</span>
                    <span className="instagram-price">₦1,500,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Instablog', price: '₦1,500,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Themixhq</span>
                    <span className="instagram-price">₦1,000,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Themixhq', price: '₦1,000,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">GossipLoaded</span>
                    <span className="instagram-price">₦300,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'GossipLoaded', price: '₦300,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">thecontentlovers</span>
                    <span className="instagram-price">₦400,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'thecontentlovers', price: '₦400,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Olofofonaija</span>
                    <span className="instagram-price">₦300,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Olofofonaija', price: '₦300,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Notjustok</span>
                    <span className="instagram-price">₦1,000,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Notjustok', price: '₦1,000,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Gistloverblog</span>
                    <span className="instagram-price">₦900,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Gistloverblog', price: '₦900,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Samklef</span>
                    <span className="instagram-price">₦1,000,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Samklef', price: '₦1,000,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">FunnyAfrica</span>
                    <span className="instagram-price">₦700,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'FunnyAfrica', price: '₦700,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Tundeednut</span>
                    <span className="instagram-price">₦5,000,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Tundeednut', price: '₦5,000,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">NaijaEverything</span>
                    <span className="instagram-price">₦450,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'NaijaEverything', price: '₦450,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Yabaleftonline</span>
                    <span className="instagram-price">₦850,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Yabaleftonline', price: '₦850,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Goldmynetv</span>
                    <span className="instagram-price">₦350,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Goldmynetv', price: '₦350,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Lindaikejisblog</span>
                    <span className="instagram-price">₦850,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Lindaikejisblog', price: '₦850,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Shallipopi News</span>
                    <span className="instagram-price">₦300,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Shallipopi News', price: '₦300,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Officialbiesloeded</span>
                    <span className="instagram-price">₦650,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Officialbiesloeded', price: '₦650,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            <div className="instagram-category">
              <h3 className="instagram-category-title">Wizkidnews</h3>
              <div className="instagram-price-grid">
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">24hour Post</span>
                    <span className="instagram-price">₦250,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: '24hour Post', price: '₦250,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">1Day Post</span>
                    <span className="instagram-price">₦350,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: '1Day Post', price: '₦350,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">3Days Post</span>
                    <span className="instagram-price">₦650,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: '3Days Post', price: '₦650,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Collaboration Post For 3Day</span>
                    <span className="instagram-price">₦1,000,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Collaboration Post For 3Day', price: '₦1,000,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="instagram-price-item">
                  <div className="instagram-info">
                    <span className="instagram-name">Collaboration Post For 6Day</span>
                    <span className="instagram-price">₦3,000,000</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart({ title: 'Collaboration Post For 6Day', price: '₦3,000,000', category: 'instagram' })} 
                    className="price-order-btn"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default InstagramServicesPage;



