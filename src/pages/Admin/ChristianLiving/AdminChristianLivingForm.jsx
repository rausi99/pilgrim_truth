
import { useEffect, useState } from "react";
import RichTextEditor from "../../../components/ui/RichTextEditor";

import {
  ArrowLeft,
  ImagePlus,
  Link2,
  LoaderCircle,
  Save,
  Trash2,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

import {
  createAdminChristianLiving,
  getAdminChristianLivingStudy,
  updateAdminChristianLiving,
  uploadAdminImage,
} from "../../../services/admin";

import "./AdminChristianLivingForm.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

// Generate URL-friendly slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Resolve uploaded and external image URLs
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

// Format date for datetime-local input
function formatDateTimeForInput(value) {
  if (!value) return "";

  const date = new Date(value);

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

const initialForm = {
  title: "",
  slug: "",
  category: "",
  description: "",
  scripture_reference: "",
  content: "",
  featured_image: "",
  is_featured: false,
  status: "draft",
  published_at: "",
};

export default function AdminChristianLivingForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load existing Christian Living study
  useEffect(() => {
    if (!isEditing || !token) return;

    async function loadStudy() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminChristianLivingStudy(
          token,
          id
        );

        const study = data.study;

        setForm({
          title: study.title || "",
          slug: study.slug || "",
          category: study.category || "",
          description: study.description || "",
          scripture_reference:
            study.scripture_reference || "",
          content: study.content || "",
          featured_image: study.featured_image || "",
          is_featured: Boolean(study.is_featured),
          status: study.status || "draft",
          published_at: formatDateTimeForInput(
            study.published_at
          ),
        });
      } catch (err) {
        console.error(
          "Load Christian Living study error:",
          err
        );

        setError(
          err.message ||
            "Unable to load Christian Living study."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStudy();
  }, [id, isEditing, token]);

  // Handle ordinary form fields
  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Handle rich text editor content
  function handleContentChange(content) {
    setForm((current) => ({
      ...current,
      content,
    }));
  }

  // Handle title and automatic slug generation
  function handleTitleChange(event) {
    const title = event.target.value;

    setForm((current) => ({
      ...current,
      title,
      slug: isEditing
        ? current.slug
        : generateSlug(title),
    }));
  }

  // Upload featured image
  async function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!token) {
      setError(
        "Your session has expired. Please log in again."
      );
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

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.");

      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const data = await uploadAdminImage(token, file);

      setForm((current) => ({
        ...current,
        featured_image: data.imageUrl || "",
      }));

      setSuccess("Featured image uploaded successfully.");
    } catch (err) {
      console.error(
        "Christian Living image upload error:",
        err
      );

      setError(
        err.message || "Unable to upload image."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  // Remove featured image
  function removeImage() {
    setForm((current) => ({
      ...current,
      featured_image: "",
    }));

    setSuccess("");
  }

  // Validate and save study
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "Your session has expired. Please log in again."
      );
      return;
    }

    const plainContent = String(form.content || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;|&#160;/g, " ")
      .trim();

    if (
      !form.title.trim() ||
      !form.slug.trim() ||
      !form.category.trim() ||
      !plainContent
    ) {
      setError(
        "Title, slug, category and study content are required."
      );
      return;
    }

    if (
      form.status === "scheduled" &&
      !form.published_at
    ) {
      setError(
        "Scheduled studies require a publication date and time."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        scripture_reference:
          form.scripture_reference.trim(),
        content: form.content.trim(),
        featured_image: form.featured_image.trim(),
        published_at: form.published_at || null,
      };

      if (isEditing) {
        await updateAdminChristianLiving(
          token,
          id,
          payload
        );

        setSuccess(
          "Christian Living study updated successfully."
        );
      } else {
        await createAdminChristianLiving(
          token,
          payload
        );

        setSuccess(
          "Christian Living study created successfully."
        );
      }

      navigate("/admin/christian-living");
    } catch (err) {
      console.error(
        "Save Christian Living study error:",
        err
      );

      setError(
        err.message ||
          "Unable to save Christian Living study."
      );
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="admin-content-page">
        <div className="admin-table-state">
          Loading study...
        </div>
      </div>
    );
  }

  const imagePreview = getImageUrl(
    form.featured_image
  );

  return (
    <div className="admin-content-page">
      {/* PAGE HEADER */}
      <div className="admin-page-header">
        <div>
          <Link
            to="/admin/christian-living"
            className="admin-back-link"
          >
            <ArrowLeft size={16} />
            Christian Living
          </Link>

          <h1>
            {isEditing
              ? "Edit Christian Living Study"
              : "New Christian Living Study"}
          </h1>

          <p>
            Create practical, Scripture-centered content for
            Christian growth and daily life.
          </p>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-success-message">
          {success}
        </div>
      )}

      <form
        className="admin-form-layout"
        onSubmit={handleSubmit}
      >
        {/* MAIN CONTENT */}
        <div className="admin-form-main">
          <section className="admin-form-card">
            <div className="admin-form-section-heading">
              <h2>Study Details</h2>

              <p>
                Basic information and Scripture-centered teaching.
              </p>
            </div>

            {/* TITLE */}
            <div className="admin-form-field">
              <label htmlFor="title">
                Study Title *
              </label>

              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Enter study title"
                required
              />
            </div>

            {/* SLUG AND CATEGORY */}
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
                  placeholder="building-a-christ-centered-character"
                  required
                />

                <small className="admin-field-help">
                  Automatically generated from the title.
                  You can also edit it manually.
                </small>
              </div>

              <div className="admin-form-field">
                <label htmlFor="category">
                  Category *
                </label>

                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Faith & Character"
                  required
                />
              </div>
            </div>

            {/* DESCRIPTION */}
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
                placeholder="Brief description of the study..."
              />
            </div>

            {/* SCRIPTURE REFERENCE */}
            <div className="admin-form-field">
              <label htmlFor="scripture_reference">
                Scripture Reference
              </label>

              <input
                id="scripture_reference"
                name="scripture_reference"
                value={form.scripture_reference}
                onChange={handleChange}
                placeholder="Galatians 5:22–23"
              />
            </div>

            {/* RICH TEXT CONTENT */}
            <div className="admin-form-field">
              <label>
                Study Content *
              </label>

              <RichTextEditor
                value={form.content}
                onChange={handleContentChange}
                placeholder="Write the complete Christian Living study here..."
              />

              <small className="admin-field-help">
                Use headings, bold, italics, underline,
                colours, highlights, lists, links and
                text alignment.
              </small>
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="admin-form-sidebar">
          {/* PUBLISHING */}
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

              <small className="admin-field-help">
                Required when the status is Scheduled.
              </small>
            </div>

            {/* FEATURED STUDY */}
            <label className="admin-checkbox-field">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
              />

              <span>
                <strong>
                  Feature this study
                </strong>

                <small>
                  Show this study prominently on
                  the public page.
                </small>
              </span>
            </label>
          </section>

          {/* FEATURED IMAGE */}
          <section className="admin-form-card admin-media-card">
            <div className="admin-form-section-heading">
              <h2>Featured Image</h2>

              <p>
                Add a cover image for this study.
              </p>
            </div>

            {imagePreview ? (
              <div className="admin-image-preview">
                <div className="admin-image-preview-frame">
                  <img
                    src={imagePreview}
                    alt={
                      form.title ||
                      "Featured study preview"
                    }
                  />

                  <div className="admin-image-preview-overlay">
                    <span>Featured image</span>
                  </div>
                </div>

                <div className="admin-image-preview-actions">
                  <label
                    htmlFor="replace-image"
                    className="admin-replace-image-button"
                  >
                    <ImagePlus size={15} />
                    Replace
                  </label>

                  <input
                    id="replace-image"
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
                htmlFor="featured-image-upload"
                className={`admin-image-upload ${
                  uploading ? "is-uploading" : ""
                }`}
              >
                <input
                  id="featured-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  hidden
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

            {/* EXTERNAL IMAGE URL */}
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

          {/* ACTIONS */}
          <div className="admin-form-actions">
            <Link
              to="/admin/christian-living"
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
                  ? "Update Study"
                  : "Save Study"}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}
