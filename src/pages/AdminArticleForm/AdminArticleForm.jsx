import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Link2,
  LoaderCircle,
  Save,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  createAdminArticle,
  getAdminArticle,
  updateAdminArticle,
  uploadAdminImage,
} from "../../services/admin";
import "./AdminArticleForm.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BACKEND_URL = API_URL.replace("/api", "");

const categories = [
  "Bible & Theology",
  "Prophecy",
  "Bible History",
  "Christian Living",
  "Health",
];

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getImageUrl(image) {
  if (!image) return null;

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${BACKEND_URL}${image}`;
  }

  return image;
}
function formatDateTimeForInput(value) {
  if (!value) return "";

  const date = new Date(`${value}Z`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getWordCount(text) {
  if (!text?.trim()) return 0;

  return text.trim().split(/\s+/).length;
}

const initialForm = {
  title: "",
  slug: "",
  category: "Bible & Theology",
  description: "",
  content: "",
  featured_image: "",
  is_featured: false,
  status: "draft",
  published_at: "",
};

export default function AdminArticleForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing || !token) return;

    async function loadArticle() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminArticle(token, id);
        const article = data.article;

        setForm({
          title: article.title || "",
          slug: article.slug || "",
          category: article.category || "Bible & Theology",
          description: article.description || "",
          content: article.content || "",
          featured_image: article.featured_image || "",
          is_featured: Boolean(article.is_featured),
          status: article.status || "draft",
          published_at: formatDateTimeForInput(
            article.published_at
          ),
        });
      } catch (err) {
        setError(
          err.message || "Unable to load Article content."
        );
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id, isEditing, token]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleTitleChange(event) {
    const title = event.target.value;

    setForm((current) => ({
      ...current,
      title,
      slug: current.slug
        ? current.slug
        : generateSlug(title),
    }));
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a JPG, PNG, WebP or GIF image."
      );
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");

      const data = await uploadAdminImage(token, file);

      setForm((current) => ({
        ...current,
        featured_image: data.imageUrl,
      }));
    } catch (err) {
      setError(
        err.message || "Unable to upload image."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removeImage() {
    setForm((current) => ({
      ...current,
      featured_image: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        published_at: form.published_at
          ? new Date(form.published_at).toISOString()
          : null,
      };

      if (isEditing) {
        await updateAdminArticle(
          token,
          id,
          payload
        );
      } else {
        await createAdminArticle(
          token,
          payload
        );
      }

      navigate("/admin/articles");
    } catch (err) {
      setError(
        err.message || "Unable to save Article content."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-content-page">
        <div className="admin-table-state">
          Loading Article content...
        </div>
      </div>
    );
  }

  const imagePreview = getImageUrl(
    form.featured_image
  );

  const wordCount = getWordCount(form.content);

  return (
    <div className="admin-content-page">
      <div className="admin-page-header">
        <div>
          <Link
            to="/admin/articles"
            className="admin-back-link"
          >
            <ArrowLeft size={16} />
            Articles
          </Link>

          <h1>
            {isEditing
              ? "Edit Article"
              : "New Article"}
          </h1>

          <p>
            Create clear, trustworthy Christian content
            for the Pilgrim Truth community.
          </p>
        </div>
      </div>

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      <form
        className="admin-form-layout"
        onSubmit={handleSubmit}
      >
        <div className="admin-form-main">
          <section className="admin-form-card">
            <div className="admin-form-section-heading">
              <h2>Article Details</h2>
              <p>
                Basic information about this article.
              </p>
            </div>

            <div className="admin-form-field">
              <label htmlFor="title">
                Title *
              </label>

              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="e.g. Understanding God's Word"
                required
              />
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-field">
                <label htmlFor="slug">
                  Slug *
                </label>

                <input
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="understanding-gods-word"
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="category">
                  Category *
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-form-field">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Brief description of the article..."
              />
            </div>
          </section>

          <section className="admin-form-card">
            <div className="admin-form-section-heading">
              <h2>Article Content</h2>

              <p>
                Write the complete article content.
              </p>
            </div>

            <div className="admin-form-field">
              <label htmlFor="content">
                Content *
              </label>

              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={20}
                placeholder="Write the article content here..."
                required
              />

              <div className="admin-content-meta">
                <span>
                  {wordCount.toLocaleString()}{" "}
                  {wordCount === 1 ? "word" : "words"}
                </span>
              </div>
            </div>
          </section>
        </div>

        <aside className="admin-form-sidebar">
          <section className="admin-form-card">
            <div className="admin-form-section-heading">
              <h2>Publishing</h2>

              <p>
                Control visibility and publication.
              </p>
            </div>

            <div className="admin-form-field">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>

                <option value="scheduled">
                  Scheduled
                </option>
              </select>
            </div>

            <div className="admin-form-field">
              <label htmlFor="published_at">
                Publication Date
              </label>

              <input
                id="published_at"
                name="published_at"
                type="datetime-local"
                value={form.published_at}
                onChange={handleChange}
              />
            </div>

            <label className="admin-checkbox-field">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
              />

              <span>
                <strong>
                  Feature this article
                </strong>

                <small>
                  Show this article prominently on
                  the public Articles page.
                </small>
              </span>
            </label>
          </section>

          <section className="admin-form-card admin-media-card">
            <div className="admin-form-section-heading">
              <h2>Featured Image</h2>

              <p>
                Add a cover image for this article.
              </p>
            </div>

            {imagePreview ? (
              <div className="admin-image-preview">
                <div className="admin-image-preview-frame">
                  <img
                    src={imagePreview}
                    alt={
                      form.title ||
                      "Featured article preview"
                    }
                  />

                  <div className="admin-image-preview-overlay">
                    <span>
                      Featured image
                    </span>
                  </div>
                </div>

                <div className="admin-image-preview-actions">
                  <label
                    htmlFor="replace-article-image"
                    className="admin-replace-image-button"
                  >
                    <ImagePlus size={15} />
                    Replace
                  </label>

                  <input
                    id="replace-article-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    hidden
                  />

                  <button
                    type="button"
                    className="admin-remove-image-button"
                    onClick={removeImage}
                    disabled={uploading}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="article-image-upload"
                className={`admin-image-upload ${uploading ? "is-uploading" : ""
                  }`}
              >
                <input
                  id="article-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />

                <div className="admin-image-upload-icon">
                  {uploading ? (
                    <LoaderCircle
                      size={25}
                      className="admin-upload-spinner"
                    />
                  ) : (
                    <ImagePlus size={25} />
                  )}
                </div>

                <strong>
                  {uploading
                    ? "Uploading image..."
                    : "Upload featured image"}
                </strong>

                {!uploading && (
                  <>
                    <span className="admin-image-upload-action">
                      Click to browse
                    </span>

                    <span className="admin-image-upload-help">
                      or drag and drop your image here
                    </span>
                  </>
                )}

                <span className="admin-image-upload-meta">
                  JPG, PNG, WebP or GIF
                  <span>•</span>
                  Max 5MB
                </span>
              </label>
            )}

            <div className="admin-media-divider">
              <span>OR</span>
            </div>

            <div className="admin-image-url-field">
              <label htmlFor="featured_image">
                Image URL
              </label>

              <div className="admin-image-url-input">
                <Link2 size={16} />

                <input
                  id="featured_image"
                  name="featured_image"
                  value={form.featured_image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <small>
                Use a hosted image URL instead of
                uploading a file.
              </small>
            </div>
          </section>

          <div className="admin-form-actions">
            <Link
              to="/admin/articles"
              className="admin-secondary-button"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving || uploading}
            >
              <Save size={16} />

              {saving
                ? "Saving..."
                : isEditing
                  ? "Update Article"
                  : "Save Article"}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}