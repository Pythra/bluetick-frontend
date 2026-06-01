import { useCallback, useEffect, useMemo, useState } from 'react'

const defaultFormData = {
  title: '',
  excerpt: '',
  content: '',
  author: 'Bluetick Editorial',
  category: 'General',
  imageUrls: '',
  isPublished: true,
}

export const BlogManagement = ({ apiUrl, adminToken }) => {
  const [formData, setFormData] = useState(defaultFormData)
  const [posts, setPosts] = useState([])
  const [editingPostId, setEditingPostId] = useState(null)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const normalizedImagesPreview = useMemo(
    () =>
      formData.imageUrls
        .split(/\r?\n|,/)
        .map((value) => value.trim())
        .filter(Boolean),
    [formData.imageUrls]
  )

  const loadPosts = useCallback(async () => {
    if (!adminToken) return
    setLoadingPosts(true)
    setError('')
    try {
      const response = await fetch(`${apiUrl}/api/admin/blog-posts`, {
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
  }, [adminToken, apiUrl])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        author: formData.author.trim() || 'Bluetick Editorial',
        category: formData.category.trim() || 'General',
        imageUrls: normalizedImagesPreview,
        isPublished: formData.isPublished,
      }

      const isEditing = Boolean(editingPostId)
      const response = await fetch(
        isEditing ? `${apiUrl}/api/admin/blog-posts/${editingPostId}` : `${apiUrl}/api/admin/blog-posts`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(payload),
        }
      )

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} blog post`)
      }

      setSuccess(isEditing ? 'Blog post updated successfully.' : 'Blog post created successfully.')
      setFormData(defaultFormData)
      setEditingPostId(null)
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
      imageUrls: (post.imageUrls || []).join('\n'),
      isPublished: Boolean(post.isPublished),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingPostId(null)
    setFormData(defaultFormData)
    setError('')
    setSuccess('')
  }

  const handleDeletePost = async (post) => {
    const shouldDelete = window.confirm(`Delete "${post.title}"? This action cannot be undone.`)
    if (!shouldDelete) return

    setError('')
    setSuccess('')
    try {
      const response = await fetch(`${apiUrl}/api/admin/blog-posts/${post.id}`, {
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
      <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#121212' }}>
            {editingPostId ? 'Edit blog post' : 'Create blog post'}
          </h2>
          <p style={{ margin: '8px 0 0', color: '#555', fontSize: '14px' }}>
            Use your existing image upload flow, then paste those image URLs below.
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
            placeholder="Short excerpt for blog listing"
            style={inputStyle}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author"
              style={inputStyle}
            />
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              style={inputStyle}
            />
          </div>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Write full post content here..."
            rows={10}
            style={textareaStyle}
          />
          <textarea
            name="imageUrls"
            value={formData.imageUrls}
            onChange={handleChange}
            placeholder="Paste image URLs (one per line or comma separated)"
            rows={4}
            style={textareaStyle}
          />
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

      <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#121212' }}>Published & draft posts</h2>
          <button
            onClick={loadPosts}
            disabled={loadingPosts}
            style={{
              border: '1px solid #d0d7e2',
              background: '#f7f9fc',
              color: '#1f2937',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '13px',
              padding: '8px 12px',
              cursor: loadingPosts ? 'not-allowed' : 'pointer',
            }}
          >
            {loadingPosts ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {posts.length === 0 ? (
          <p style={{ margin: 0, color: '#555' }}>No blog posts yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  border: '1px solid #e5e9f0',
                  borderRadius: '8px',
                  padding: '12px',
                  background: '#fafcff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#121212' }}>{post.title}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#5f6c80' }}>{post.excerpt}</p>
                    <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#667085' }}>
                      {post.category} • {post.author} • {new Date(post.date).toLocaleString('en-US')}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: post.isPublished ? '#1b5e20' : '#8d6e00',
                      background: post.isPublished ? '#e8f5e9' : '#fff8e1',
                      borderRadius: '999px',
                      padding: '4px 9px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleEditPost(post)}
                    style={{
                      border: '1px solid #bfd4ff',
                      background: '#eef4ff',
                      color: '#1d4ed8',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePost(post)}
                    style={{
                      border: '1px solid #fecaca',
                      background: '#fff1f2',
                      color: '#b91c1c',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
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
