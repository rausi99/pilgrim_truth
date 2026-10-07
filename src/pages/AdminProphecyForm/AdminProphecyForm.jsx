import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Image as ImageIcon,
  Link as LinkIcon,
  Save,
  Star,
  Upload,
  User,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AdminProphecyForm.css";

import { useAuth } from "../../context/AuthContext";

import {
  createAdminProphecy,
  getAdminProphecy,
  updateAdminProphecy,
  uploadAdminImage,
} from "../../services/admin";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const BACKEND_URL = API_URL.replace(
  /\/api\/?$/,
  ""
);

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

function AdminProphecyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const isEditing = Boolean(id);

  const [formData, setFormData] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(isEditing);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    if (!isEditing || !token) {
      setLoading(false);
      return;
    }

    loadProphecy();
  }, [id, isEditing, token]);

  async function loadProphecy() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminProphecy(
        token,
        id
      );

      const prophecy = data.prophecy;

      setFormData({
        title: prophecy.title || "",
        slug: prophecy.slug || "",
        category: prophecy.category || "",
        description:
          prophecy.description || "",
        scripture_reference:
          prophecy.scripture_reference || "",
        content: prophecy.content || "",
        featured_image:
          prophecy.featured_image || "",
        is_featured: Boolean(
          prophecy.is_featured
        ),
        status:
          prophecy.status || "draft",
        published_at:
          prophecy.published_at
            ? formatDateTimeLocal(
              prophecy.published_at
            )
            : "",
      });
    } catch (err) {
      console.error(
        "Prophecy loading error:",
        err
      );

      setError(
        err.message ||
        "Unable to load prophecy."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDateTimeLocal(dateValue) {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const hours = String(
      date.getHours()
    ).padStart(2, "0");

    const minutes = String(
      date.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function getImagePreviewUrl(image) {
    if (!image) {
      return "";
    }

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

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (name === "featured_image") {
      setError("");
      setSuccess("");
    }
  }

  function generateSlug() {
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((current) => ({
      ...current,
      slug,
    }));
  }

  async function handleImageUpload(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const data =
        await uploadAdminImage(
          token,
          file
        );

      setFormData((current) => ({
        ...current,
        featured_image:
          data.imageUrl,
      }));

      setSuccess(
        "Featured image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Prophecy image upload error:",
        err
      );

      setError(
        err.message ||
        "Unable to upload image."
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  }

  function removeImage() {
    setFormData((current) => ({
      ...current,
      featured_image: "",
    }));

    setError("");
    setSuccess(
      "Featured image removed from this study."
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      if (
        !formData.title.trim() ||
        !formData.slug.trim() ||
        !formData.category.trim() ||
        !formData.content.trim()
      ) {
        throw new Error(
          "Title, slug, category, and content are required."
        );
      }

      const payload = {
        ...formData,

        title:
          formData.title.trim(),

        slug:
          formData.slug.trim(),

        category:
          formData.category.trim(),

        description:
          formData.description.trim() ||
          null,

        scripture_reference:
          formData.scripture_reference.trim() ||
          null,

        content:
          formData.content.trim(),

        featured_image:
          formData.featured_image.trim() ||
          null,

        is_featured:
          formData.is_featured,

        status:
          formData.status,

        published_at:
          formData.published_at ||
          null,
      };

      if (isEditing) {
        await updateAdminProphecy(
          token,
          id,
          payload
        );

        setSuccess(
          "Prophecy study updated successfully."
        );
      } else {
        await createAdminProphecy(
          token,
          payload
        );

        navigate("/admin/prophecy");
      }
    } catch (err) {
      console.error(
        "Save prophecy error:",
        err
      );

      setError(
        err.message ||
        "Unable to save prophecy."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-table-state">
          <h3>
            Loading prophecy study...
          </h3>

          <p>
            Retrieving prophecy content from
            the database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      <section className="admin-page-heading">

        <div>

          <Link
            to="/admin/prophecy"
            className="admin-back-link"
          >
            <ArrowLeft size={16} />
            Back to Prophecy
          </Link>

          <span className="admin-eyebrow">
            CONTENT MANAGEMENT
          </span>

          <h1>
            {isEditing
              ? "Edit Prophecy"
              : "New Prophecy"}
          </h1>

          <p>
            {isEditing
              ? "Update this prophecy study and publication settings."
              : "Create a new biblical prophecy study."}
          </p>

        </div>

      </section>

      {error && (
        <div className="admin-form-alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-form-alert success">
          {success}
        </div>
      )}

      <form
        className="admin-prophecy-form"
        onSubmit={handleSubmit}
      >

        <div className="admin-form-grid">

          {/* MAIN CONTENT */}

          <div className="admin-form-main">

            {/* BASIC INFORMATION */}

            <section className="admin-form-card">

              <div className="admin-form-card-heading">

                <div>

                  <span className="admin-eyebrow">
                    BASIC INFORMATION
                  </span>

                  <h2>
                    Prophecy Details
                  </h2>

                </div>

              </div>

              <div className="admin-form-fields">

                <div className="admin-form-field">

                  <label htmlFor="title">
                    Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter prophecy study title"
                    required
                  />

                </div>

                <div className="admin-form-field">

                  <label htmlFor="slug">
                    Slug
                  </label>

                  <div className="admin-slug-row">

                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="prophecy-study-title"
                      required
                    />

                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={generateSlug}
                    >
                      Generate
                    </button>

                  </div>

                  <small>
                    Used in the public page URL.
                  </small>

                </div>

                <div className="admin-form-two-columns">

                  <div className="admin-form-field">

                    <label htmlFor="category">
                      Category
                    </label>

                    <input
                      id="category"
                      name="category"
                      type="text"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g. Biblical Prophecy"
                      required
                    />

                  </div>

                  <div className="admin-form-field">

                    <label htmlFor="scripture_reference">
                      Scripture Reference
                    </label>

                    <input
                      id="scripture_reference"
                      name="scripture_reference"
                      type="text"
                      value={
                        formData.scripture_reference
                      }
                      onChange={handleChange}
                      placeholder="e.g. Matthew 24; Daniel 7"
                    />

                  </div>

                </div>

                <div className="admin-form-field">

                  <label htmlFor="description">
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write a short introduction to this prophecy study..."
                    rows="5"
                  />

                </div>

              </div>

            </section>

            {/* STUDY CONTENT */}

            <section className="admin-form-card">

              <div className="admin-form-card-heading">

                <div>

                  <span className="admin-eyebrow">
                    STUDY CONTENT
                  </span>

                  <h2>
                    Prophecy Study
                  </h2>

                </div>

              </div>

              <div className="admin-form-field">

                <label htmlFor="content">
                  Full Content
                </label>

                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write the complete biblical prophecy study here..."
                  rows="18"
                  required
                />

                <small>
                  This content will appear on the public
                  Prophecy detail page.
                </small>

              </div>

            </section>

          </div>

          {/* SIDEBAR */}

          <aside className="admin-form-sidebar">

            {/* PUBLICATION */}

            <section className="admin-form-card">

              <div className="admin-form-card-heading">

                <div>

                  <span className="admin-eyebrow">
                    PUBLICATION
                  </span>

                  <h2>
                    Publishing
                  </h2>

                </div>

                <CalendarDays size={19} />

              </div>

              <div className="admin-form-fields">

                <div className="admin-form-field">

                  <label htmlFor="status">
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formData.status}
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
                    value={
                      formData.published_at
                    }
                    onChange={handleChange}
                  />

                  <small>
                    Use a future date when scheduling
                    publication.
                  </small>

                </div>

              </div>

            </section>

            {/* MEDIA */}

            <section className="admin-form-card">

              <div className="admin-form-card-heading">

                <div>

                  <span className="admin-eyebrow">
                    MEDIA
                  </span>

                  <h2>
                    Featured Image
                  </h2>

                </div>

                <ImageIcon size={19} />

              </div>

              <div className="admin-image-upload">

                {formData.featured_image ? (
                  <div className="admin-image-preview">

                    <img
                      src={getImagePreviewUrl(
                        formData.featured_image
                      )}
                      alt="Prophecy study preview"
                    />

                    <button
                      type="button"
                      className="admin-image-remove"
                      onClick={removeImage}
                      aria-label="Remove featured image"
                    >
                      <X size={16} />
                    </button>

                  </div>
                ) : (
                  <div className="admin-image-placeholder">

                    <ImageIcon size={30} />

                    <span>
                      No image selected
                    </span>

                    <small>
                      Upload an image or add an
                      external image URL below.
                    </small>

                  </div>
                )}

                <label className="admin-upload-button">

                  <Upload size={16} />

                  {uploading
                    ? "Uploading..."
                    : formData.featured_image
                      ? "Replace Image"
                      : "Upload Image"}

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                    onChange={
                      handleImageUpload
                    }
                    disabled={
                      uploading ||
                      !token
                    }
                    hidden
                  />

                </label>

                <small>
                  JPG, JPEG, PNG, WebP or GIF.
                  Maximum 5MB.
                </small>

              </div>

              <div className="admin-media-divider">
                <span>OR</span>
              </div>

              <div className="admin-form-field">

                <label htmlFor="featured_image">
                  Image URL
                </label>

                <div className="admin-input-icon">

                  <LinkIcon size={16} />

                  <input
                    id="featured_image"
                    name="featured_image"
                    type="text"
                    value={
                      formData.featured_image
                    }
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />

                </div>

                <small>
                  You can use an external image URL
                  instead of uploading a file.
                </small>

              </div>

            </section>

            {/* FEATURED */}

            <section className="prophecy-featured-card">

              <label className="prophecy-featured-toggle">

                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                />

                <span className="prophecy-checkbox">
                  {formData.is_featured && "✓"}
                </span>

                <span className="prophecy-featured-content">

                  <span className="prophecy-featured-title">
                    Featured Prophecy
                  </span>

                  <span className="prophecy-featured-description">
                    Highlight this prophecy on the public Prophecy page.
                  </span>

                </span>

              </label>

            </section>

            {/* AUTHOR */}

            <section className="admin-form-card">

              <div className="admin-form-card-heading">

                <div>

                  <span className="admin-eyebrow">
                    AUTHOR
                  </span>

                  <h2>
                    Content Author
                  </h2>

                </div>

                <User size={19} />

              </div>

              <div className="admin-author-preview">

                <div className="admin-author-avatar">
                  <User size={18} />
                </div>

                <div>

                  <strong>
                    {user?.name ||
                      "Current Administrator"}
                  </strong>

                  <span>
                    Author
                  </span>

                </div>

              </div>

            </section>

          </aside>

        </div>

        {/* ACTIONS */}

        <div className="admin-form-actions">

          <Link
            to="/admin/prophecy"
            className="admin-cancel-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={
              saving ||
              uploading ||
              !token
            }
          >
            <Save size={16} />

            {saving
              ? "Saving..."
              : isEditing
                ? "Update Prophecy"
                : "Create Prophecy"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AdminProphecyForm;