import { useCallback, useEffect, useState } from 'react'
import RichTextEditor from '../../components/RichTextEditor'
import ContentPreviewModal from '../../components/ContentPreviewModal'
import { formatBlogDate } from '../../data/blogPosts'
import '../../pages/BlogPage.css'
import '../components/AdminBlogPostsGrid.css'

const handleAdminCardImageError = (event) => {
  const fallbackSrc = '/bluelogo.png'
  if (event.currentTarget.src.endsWith(fallbackSrc)) return
  event.currentTarget.onerror = null
  event.currentTarget.src = fallbackSrc
}

const defaultFormData = {
  title: '',
  excerpt: '',
  content: '',
  author: 'Bluetick Editorial',
  category: 'General',
  isPublished: true,
}

export const BlogManagement = ({
  apiUrl,
  adminToken,
  apiBasePath = '/api/admin/blog-posts',
  authQuery = '',
  defaultAuthor = 'Bluetick Editorial',
}) => {
  const buildBlogUrl = (suffix = '') => {
    const path = `${apiUrl}${apiBasePath}${suffix}`;
    if (!authQuery) return path;
    return path.includes('?') ? `${path}&${authQuery}` : `${path}?${authQuery}`;
  };

  const [formData, setFormData] = useState({ ...defaultFormData, author: defaultAuthor })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [existingImageUrls, setExistingImageUrls] = useState([])
  const [posts, setPosts] = useState([])
  const [editingPostId, setEditingPostId] = useState(null)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const getPlainTextFromHtml = (htmlValue = '') =>
    htmlValue
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  const loadPosts = useCallback(async () => {
    if (!adminToken) return
    setLoadingPosts(true)
    setError('')
    try {
      const response = await fetch(buildBlogUrl(), {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load blog posts')
      }
      setPosts(data.posts || [])
    } catch (loadError) {
      setError(loadError.message || 'Unable to load blog posts')
    } finally {
      setLoadingPosts(false)
    }
  }, [adminToken, apiUrl, authQuery, apiBasePath])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageSelection = (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const validFiles = files.filter((file) => file.type.startsWith('image/'))
    if (validFiles.length !== files.length) {
      setError('Only image files are allowed.')
    }

    setImageFiles((prev) => [...prev, ...validFiles])

    Promise.all(
      validFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.readAsDataURL(file)
          })
      )
    ).then((previewData) => {
      setImagePreviews((prev) => [...prev, ...previewData])
    })
  }

  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePreview = () => {
    if (!formData.title.trim() && !getPlainTextFromHtml(formData.content)) {
      setError('Add a title or content before previewing.')
      return
    }
    setError('')
    setShowPreview(true)
  }

  const previewImages = [...existingImageUrls, ...imagePreviews]

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitLoading(true)
    setError('')
    setSuccess('')

    try {
      const plainContent = getPlainTextFromHtml(formData.content)
      if (!plainContent) {
        throw new Error('Post content is required')
      }

      const payload = new FormData()
      payload.append('title', formData.title.trim())
      payload.append('excerpt', formData.excerpt.trim())
      payload.append('content', formData.content.trim())
      payload.append('author', formData.author.trim() || defaultAuthor)
      payload.append('category', formData.category.trim() || 'General')
      payload.append('isPublished', String(formData.isPublished))
      payload.append('existingImageUrls', JSON.stringify(existingImageUrls))
      imageFiles.forEach((file) => payload.append('images', file))

      const isEditing = Boolean(editingPostId)
      const response = await fetch(
        isEditing ? buildBlogUrl(`/${editingPostId}`) : buildBlogUrl(),
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: payload,
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} blog post`)
      }

      setSuccess(isEditing ? 'Blog post updated successfully.' : 'Blog post created successfully.')
      setFormData(defaultFormData)
      setEditingPostId(null)
      setImageFiles([])
      setImagePreviews([])
      setExistingImageUrls([])
      await loadPosts()
    } catch (submitError) {
      setError(submitError.message || `Unable to ${editingPostId ? 'update' : 'create'} blog post`)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleEditPost = (post) => {
    setError('')
    setSuccess('')
    setEditingPostId(post.id)
    setFormData({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || 'Bluetick Editorial',
      category: post.category || 'General',
      isPublished: Boolean(post.isPublished),
    })
    setExistingImageUrls(post.imageUrls || [])
    setImageFiles([])
    setImagePreviews([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingPostId(null)
    setFormData(defaultFormData)
    setImageFiles([])
    setImagePreviews([])
    setExistingImageUrls([])
    setError('')
    setSuccess('')
  }

  const handleDeletePost = async (post) => {
    const shouldDelete = window.confirm(`Delete "${post.title}"? This action cannot be undone.`)
    if (!shouldDelete) return

    setError('')
    setSuccess('')
    try {
      const response = await fetch(buildBlogUrl(`/${post.id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete blog post')
      }

      if (editingPostId === post.id) {
        handleCancelEdit()
      }
      setSuccess('Blog post deleted successfully.')
      await loadPosts()
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete blog post')
    }
  }

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <ContentPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        dialogTitle="Blog post preview"
        title={formData.title}
        subtitle={formData.excerpt}
        category={formData.category}
        author={formData.author}
        contentHtml={formData.content}
        images={previewImages}
      />
      <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#121212' }}>
            {editingPostId ? 'Edit blog post' : 'Create blog post'}
          </h2>
          <p style={{ margin: '8px 0 0', color: '#555', fontSize: '14px' }}>
            Select images directly from your device. Selected images upload automatically when you save.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Post title"
            style={inputStyle}
          />
          <input
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            placeholder="Subtitle summary"
            style={inputStyle}
          />
          <div style={{ display: 'grid', gap: '4px' }}>
            <label htmlFor="blog-category-input" style={{ fontSize: '14px', fontWeight: 600, color: '#222' }}>
              Category
            </label>
            <input
              id="blog-category-input"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              style={inputStyle}
            />
          </div>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
            placeholder="Write full post content here..."
            minHeight={260}
          />
          <div style={{ display: 'grid', gap: '10px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#222' }}>Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelection}
              style={inputStyle}
            />

            {existingImageUrls.length > 0 ? (
              <div style={{ display: 'grid', gap: '8px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Current images</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {existingImageUrls.map((url, index) => (
                    <div key={`${url}-${index}`} style={previewCardStyle}>
                      <img src={url} alt={`Current ${index + 1}`} style={previewImageStyle} />
                      <button type="button" onClick={() => removeExistingImage(index)} style={removeImageBtnStyle}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {imagePreviews.length > 0 ? (
              <div style={{ display: 'grid', gap: '8px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>New selected images</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {imagePreviews.map((preview, index) => (
                    <div key={`preview-${index}`} style={previewCardStyle}>
                      <img src={preview} alt={`Selected ${index + 1}`} style={previewImageStyle} />
                      <button type="button" onClick={() => removeNewImage(index)} style={removeImageBtnStyle}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#222' }}>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            Publish immediately
          </label>

          {error ? <p style={{ color: '#c62828', margin: 0 }}>{error}</p> : null}
          {success ? <p style={{ color: '#2e7d32', margin: 0 }}>{success}</p> : null}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handlePreview}
              style={{
                border: '1px solid #bfd4ff',
                borderRadius: '8px',
                background: '#eef4ff',
                color: '#1d4ed8',
                fontWeight: 600,
                padding: '11px 16px',
                cursor: 'pointer',
              }}
            >
              Preview
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              style={{
                border: 'none',
                borderRadius: '8px',
                background: '#0066ff',
                color: '#fff',
                fontWeight: 600,
                padding: '11px 16px',
                cursor: submitLoading ? 'not-allowed' : 'pointer',
                opacity: submitLoading ? 0.65 : 1,
              }}
            >
              {submitLoading ? (editingPostId ? 'Saving...' : 'Creating...') : editingPostId ? 'Save changes' : 'Create post'}
            </button>
            {editingPostId ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  border: '1px solid #d0d7e2',
                  borderRadius: '8px',
                  background: '#fff',
                  color: '#334155',
                  fontWeight: 600,
                  padding: '11px 16px',
                  cursor: 'pointer',
                }}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-blog-posts-section" style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div className="section-head">
          <h2>Published & draft posts</h2>
          <button
            type="button"
            className="admin-blog-refresh-btn"
            onClick={loadPosts}
            disabled={loadingPosts}
          >
            {loadingPosts ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {posts.length === 0 ? (
          <p className="admin-blog-posts-empty">No blog posts yet.</p>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <article key={post.id} className="blog-card admin-blog-card-item">
                <span
                  className={`admin-blog-card-status ${post.isPublished ? 'is-published' : 'is-draft'}`}
                >
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
                <div className="blog-card-image-wrap">
                  <img
                    src={post.imageUrls?.[0] || '/bluelogo.png'}
                    alt={post.title}
                    className="blog-card-image"
                    loading="lazy"
                    style={post.imageUrls?.[0] ? undefined : { objectFit: 'contain', padding: '1rem' }}
                    onError={handleAdminCardImageError}
                  />
                </div>
                <span className="blog-card-category">{post.category}</span>
                <h2>{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-meta">
                  <span>{post.author}</span>
                  <span>{formatBlogDate(post.date)}</span>
                  <span>{post.readTime}</span>
                  <span>{post.likesCount || 0} likes</span>
                  <span>{post.commentsCount ?? 0} comments</span>
                </div>
                <div className="admin-blog-card-actions">
                  <button type="button" className="btn-edit" onClick={() => handleEditPost(post)}>
                    Edit
                  </button>
                  <button type="button" className="btn-delete" onClick={() => handleDeletePost(post)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  border: '1px solid #d6deeb',
  borderRadius: '8px',
  padding: '10px 12px',
  fontSize: '14px',
  fontFamily: 'inherit',
}

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  lineHeight: 1.5,
}

const previewCardStyle = {
  border: '1px solid #dbe3f0',
  borderRadius: '8px',
  padding: '6px',
  background: '#fff',
  display: 'grid',
  gap: '6px',
}

const previewImageStyle = {
  width: '110px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '6px',
  display: 'block',
}

const removeImageBtnStyle = {
  border: '1px solid #fecaca',
  background: '#fff1f2',
  color: '#b91c1c',
  borderRadius: '6px',
  padding: '4px 8px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
}

