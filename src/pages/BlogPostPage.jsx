import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { formatBlogDate, getBlogPostBySlug } from '../data/blogPosts';
import { useAuth } from '../contexts/AuthContext';
import './BlogPage.css';

function BlogPostPage() {
  const { slug } = useParams();
  const { apiUrl } = useAuth();
  const [post, setPost] = useState(() => getBlogPostBySlug(slug));
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState(post?.comments ?? []);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  const likedStorageKey = `bluetick_blog_liked_${slug}`;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setCommentError('');
    setLiked(localStorage.getItem(likedStorageKey) === 'true');

    const loadPost = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/blog/posts/${encodeURIComponent(slug)}`);
        const data = await response.json();
        if (!response.ok || !data.success || !data.post) {
          throw new Error(data.error || 'Failed to load blog post');
        }
        if (active) {
          setPost(data.post);
          setComments(data.post.comments || []);
          setLikesCount(data.post.likesCount || 0);
        }
      } catch (error) {
        console.error('Blog post fallback to static data:', error);
        if (active) {
          const fallbackPost = getBlogPostBySlug(slug);
          setPost(fallbackPost || null);
          setComments(fallbackPost?.comments ?? []);
          setLikesCount(fallbackPost?.likesCount || 0);
        }
      } finally {
        if (active) {
          setName('');
          setBody('');
          setLoading(false);
        }
      }
    };

    loadPost();
    return () => {
      active = false;
    };
  }, [apiUrl, likedStorageKey, slug]);

  if (loading) {
    return (
      <div className="blog-page">
        <Navbar />
        <main className="blog-container blog-not-found">
          <h1>Loading post...</h1>
        </main>
        <Footer />
      </div>
    );
  }

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

  const paragraphs = Array.isArray(post.content)
    ? post.content
    : post.content
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedBody = body.trim();
    if (!trimmedName || !trimmedBody) {
      return;
    }

    setCommentLoading(true);
    setCommentError('');
    try {
      const response = await fetch(`${apiUrl}/api/blog/posts/${encodeURIComponent(slug)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: trimmedName,
          body: trimmedBody,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.comment) {
        throw new Error(data.error || 'Failed to post comment');
      }
      setComments((prev) => [...prev, data.comment]);
      setName('');
      setBody('');
    } catch (error) {
      console.error('Blog comment error:', error);
      setCommentError(error.message || 'Unable to post comment right now.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    const nextLikedState = !liked;
    setLikeLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/blog/posts/${encodeURIComponent(slug)}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked: nextLikedState }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update like');
      }
      setLiked(nextLikedState);
      localStorage.setItem(likedStorageKey, String(nextLikedState));
      setLikesCount(data.likesCount || 0);
    } catch (error) {
      console.error('Like update failed:', error);
    } finally {
      setLikeLoading(false);
    }
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
            <span>{likesCount} likes</span>
            <span>{comments.length} comments</span>
          </div>
          <div className="blog-reactions-bar">
            <button
              type="button"
              className={`blog-like-button ${liked ? 'is-liked' : ''}`}
              onClick={handleLikeToggle}
              disabled={likeLoading}
            >
              {liked ? '♥ Liked' : '♡ Like'} {likesCount}
            </button>
          </div>
          {post.imageUrls?.length > 0 && (
            <div className="blog-article-images">
              {post.imageUrls.map((imageUrl, index) => (
                <img key={`${imageUrl}-${index}`} src={imageUrl} alt={`${post.title} visual ${index + 1}`} />
              ))}
            </div>
          )}
          <div className="blog-article-body">
            {paragraphs.map((paragraph, index) => (
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
              {commentError ? <p className="blog-comment-error">{commentError}</p> : null}
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
              <button type="submit" disabled={commentLoading}>
                {commentLoading ? 'Posting...' : 'Post comment'}
              </button>
            </form>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export default BlogPostPage;
