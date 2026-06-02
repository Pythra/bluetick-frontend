import { useCallback, useEffect, useState } from 'react'

const defaultFormData = {
  title: '',
  excerpt: '',
  content: '',
  author: 'Bluetick Editorial',
  category: 'General',
  isPublished: true,
}

export const BlogManagement = ({ apiUrl, adminToken }) => {
  const [formData, setFormData] = useState(defaultFormData)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [existingImageUrls, setExistingImageUrls] = useState([])
  const [posts, setPosts] = useState([])
  const [editingPostId, setEditingPostId] = useState(null)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = new FormData()
      payload.append('title', formData.title.trim())
      payload.append('excerpt', formData.excerpt.trim())
      payload.append('content', formData.content.trim())
      payload.append('author', formData.author.trim() || 'Bluetick Editorial')
      payload.append('category', formData.category.trim() || 'General')
      payload.append('isPublished', String(formData.isPublished))
      payload.append('existingImageUrls', JSON.stringify(existingImageUrls))
      imageFiles.forEach((file) => payload.append('images', file))

      const isEditing = Boolean(editingPostId)
      const response = await fetch(
        isEditing ? `${apiUrl}/api/admin/blog-posts/${editingPostId}` : `${apiUrl}/api/admin/blog-posts`,
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
            placeholder="Short excerpt for blog listing"
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
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Write full post content here..."
            rows={10}
            style={textareaStyle}
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
                    <p style={adminPostTitleStyle} title={post.title}>{post.title}</p>
                    <p style={adminPostExcerptStyle} title={post.excerpt}>{post.excerpt}</p>
                    <div style={adminMetaWrapStyle}>
                      <span style={adminCategoryChipStyle} title={post.category}>{post.category}</span>
                      <span style={adminMetaItemStyle} title={post.author}>{post.author}</span>
                      <span style={adminMetaItemStyle}>{new Date(post.date).toLocaleString('en-US')}</span>
                    </div>
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

const adminPostTitleStyle = {
  margin: '0 0 4px',
  fontWeight: 700,
  color: '#121212',
  maxWidth: 'min(56vw, 540px)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const adminPostExcerptStyle = {
  margin: 0,
  fontSize: '13px',
  color: '#5f6c80',
  maxWidth: 'min(56vw, 540px)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  lineHeight: 1.4,
}

const adminMetaWrapStyle = {
  marginTop: '8px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px 8px',
  alignItems: 'center',
}

const adminCategoryChipStyle = {
  display: 'inline-block',
  maxWidth: '140px',
  width: 'fit-content',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '11px',
  fontWeight: 700,
  color: '#1d4ed8',
  background: '#e0ecff',
  borderRadius: '999px',
  padding: '3px 8px',
}

const adminMetaItemStyle = {
  maxWidth: '160px',
  fontSize: '12px',
  color: '#667085',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}
