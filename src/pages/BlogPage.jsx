import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { blogPosts, formatBlogDate } from '../data/blogPosts';
import './BlogPage.css';

function BlogPage() {
  return (
    <div className="blog-page">
      <Navbar />
      <main className="blog-container">
        <header className="blog-header">
          <h1>Blog</h1>
          <p>Insights on verification, publications, and building a credible brand online.</p>
        </header>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="blog-card">
              <span className="blog-card-category">{post.category}</span>
              <h2>{post.title}</h2>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <div className="blog-card-meta">
                <span>{post.author}</span>
                <span>{formatBlogDate(post.date)}</span>
                <span>{post.readTime}</span>
                <span>{post.comments.length} comments</span>
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
