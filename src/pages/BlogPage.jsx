import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { blogPosts, formatBlogDate } from '../data/blogPosts';
import { useAuth } from '../contexts/AuthContext';
import './BlogPage.css';

const handleBlogImageError = (event) => {
  const fallbackSrc = '/bluelogo.png';
  if (event.currentTarget.src.endsWith(fallbackSrc)) {
    return;
  }
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallbackSrc;
};

function BlogPage() {
  const { apiUrl } = useAuth();
  const [posts, setPosts] = useState(blogPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/blog/posts`);
        const data = await response.json();
        if (!response.ok || !data.success || !Array.isArray(data.posts)) {
          throw new Error(data.error || 'Failed to load blog posts');
        }
        if (active) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Blog posts fallback to static data:', error);
        if (active) {
          setPosts(blogPosts);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchPosts();
    return () => {
      active = false;
    };
  }, [apiUrl]);

  return (
    <div className="blog-page">
      <Navbar />
      <main className="blog-container">
        <header className="blog-header">
          <h1>Blog</h1>
          <p>Insights on verification, publications, and building a credible brand online.</p>
        </header>
        {loading && <p className="blog-page-message">Loading posts...</p>}
        {!loading && posts.length === 0 && <p className="blog-page-message">No blog posts published yet.</p>}
        <div className="blog-grid">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="blog-card">
              {post.imageUrls?.[0] && (
                <div className="blog-card-image-wrap">
                  <img
                    src={post.imageUrls[0]}
                    alt={post.title}
                    className="blog-card-image"
                    loading="lazy"
                    onError={handleBlogImageError}
                  />
                </div>
              )}
              <span className="blog-card-category">{post.category}</span>
              <h2>{post.title}</h2>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <div className="blog-card-meta">
                <span>{post.author}</span>
                <span>{formatBlogDate(post.date)}</span>
                <span>{post.readTime}</span>
                <span>{post.likesCount || 0} likes</span>
                <span>{post.commentsCount ?? post.comments?.length ?? 0} comments</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BlogPage;
