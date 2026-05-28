import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { formatBlogDate, getBlogPostBySlug } from '../data/blogPosts';
import './BlogPage.css';

function BlogPostPage() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);
  const [comments, setComments] = useState(post?.comments ?? []);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    setComments(post?.comments ?? []);
    setName('');
    setBody('');
  }, [slug, post]);

  if (!post) {
    return (
      <div className="blog-page">
        <Navbar />
        <main className="blog-container blog-not-found">
          <h1>Post not found</h1>
          <p>The article you are looking for does not exist.</p>
          <Link to="/blog" className="blog-back-link">
            ← Back to blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedBody = body.trim();
    if (!trimmedName || !trimmedBody) {
      return;
    }

    setComments((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        author: trimmedName,
        date: new Date().toISOString().slice(0, 10),
        body: trimmedBody,
      },
    ]);
    setName('');
    setBody('');
  };

  return (
    <div className="blog-page">
      <Navbar />
      <main className="blog-container">
        <Link to="/blog" className="blog-back-link">
          ← Back to blog
        </Link>
        <article className="blog-article">
          <span className="blog-card-category">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="blog-article-meta">
            <span>{post.author}</span>
            <span>{formatBlogDate(post.date)}</span>
            <span>{post.readTime}</span>
          </div>
          <div className="blog-article-body">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <section className="blog-comments" aria-label="Comments">
            <h2>Comments ({comments.length})</h2>
            {comments.map((comment) => (
              <div key={comment.id} className="blog-comment">
                <div className="blog-comment-header">
                  <span className="blog-comment-author">{comment.author}</span>
                  <span className="blog-comment-date">{formatBlogDate(comment.date)}</span>
                </div>
                <p className="blog-comment-body">{comment.body}</p>
              </div>
            ))}
            <form className="blog-comment-form" onSubmit={handleSubmit}>
              <h3>Leave a comment</h3>
              <label htmlFor="comment-name">Name</label>
              <input
                id="comment-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
              <label htmlFor="comment-body">Comment</label>
              <textarea
                id="comment-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your thoughts..."
                required
              />
              <button type="submit">Post comment</button>
            </form>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export default BlogPostPage;
