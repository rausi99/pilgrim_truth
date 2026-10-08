import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Image as ImageIcon,
  Save,
  Star,
  Upload,
  User,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
  createAdminHistory,
  getAdminHistory,
  updateAdminHistory,
  uploadAdminImage,
} from "../../services/admin";

import "./AdminHistoryForm.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL = API_URL.replace("/api", "");

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

function generateSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getImageUrl(image) {
  if (!image) return "";

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

function AdminHistoryForm() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      if (!isEditMode || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAdminHistory(token, id);
        const history = data.history;

        setForm({
          title: history.title || "",
          slug: history.slug || "",
          category: history.category || "",
          description: history.description || "",
          scripture_reference:
            history.scripture_reference || "",
          content: history.content || "",
          featured_image:
            history.featured_image || "",
          is_featured: Boolean(history.is_featured),
          status: history.status || "draft",
          published_at: history.published_at
            ? formatDateTimeForInput(history.published_at)
            : "",
        });
      } catch (error) {
        console.error(
          "History loading error:",
          error
        );

        setError(
          error.message ||
          "Unable to load history study."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [id, isEditMode, token]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleTitleChange = (event) => {
    const value = event.target.value;

    setForm((previous) => ({
      ...previous,
      title: value,
      slug: isEditMode
        ? previous.slug
        : generateSlug(value),
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a JPG, PNG, WEBP, or GIF image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be less than 5MB."
      );

      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const data = await uploadAdminImage(
        token,
        file
      );

      setForm((previous) => ({
        ...previous,
        featured_image: data.imageUrl,
      }));

      setSuccess(
        "Featured image uploaded successfully."
      );
    } catch (error) {
      console.error(
        "History image upload error:",
        error
      );

      setError(
        error.message ||
        "Unable to upload image."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setForm((previous) => ({
      ...previous,
      featured_image: "",
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError(
        "Your session has expired. Please log in again."
      );
      return;
    }

    if (
      !form.title.trim() ||
      !form.slug.trim() ||
      !form.category.trim() ||
      !form.content.trim()
    ) {
      setError(
        "Title, slug, category, and content are required."
      );
      return;
    }

    if (
      form.status === "scheduled" &&
      !form.published_at
    ) {
      setError(
        "A publish date is required when scheduling this history study."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim(),
        category: form.category.trim(),
        description:
          form.description.trim(),
        scripture_reference:
          form.scripture_reference.trim(),
        content: form.content.trim(),
        featured_image:
          form.featured_image.trim(),
        published_at: form.published_at
          ? new Date(form.published_at).toISOString()
          : null,
      };

      if (isEditMode) {
        await updateAdminHistory(
          token,
          id,
          payload
        );

        setSuccess(
          "History study updated successfully."
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        await createAdminHistory(
          token,
          payload
        );

        navigate("/admin/history");
      }
    } catch (error) {
      console.error(
        "Save history error:",
        error
      );

      setError(
        error.message ||
        "Unable to save history study."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-table-state">
          <h3>
            Loading history study...
          </h3>

          <p>
            Retrieving history content from
            the database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* PAGE HEADING */}

      <section className="admin-page-heading">

        <div>

          <Link
            to="/admin/history"
            className="admin-back-link"
          >
            <ArrowLeft size={16} />
            Back to History
          </Link>

          <span className="admin-eyebrow">
            CONTENT MANAGEMENT
          </span>

          <h1>
            {isEditMode
              ? "Edit History"
              : "New History"}
          </h1>

          <p>
            {isEditMode
              ? "Update this biblical history study."
              : "Create a new Pilgrim Truth history study."}
          </p>

        </div>

      </section>


      {/* ALERTS */}

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


      {/* FORM */}

      <form
        className="admin-history-form"
        onSubmit={handleSubmit}
      >

        <div className="admin-form-grid">

          {/* =====================================================
              MAIN CONTENT
          ====================================================== */}

          <div className="admin-form-main">

            {/* BASIC INFORMATION */}

            <section className="admin-form-card">

              <div className="admin-form-card-heading">

                <div>

                  <span className="admin-eyebrow">
                    BASIC INFORMATION
                  </span>

                  <h2>
                    History Details
                  </h2>

                </div>

              </div>


              <div className="admin-form-fields">

                {/* TITLE */}

                <div className="admin-form-field">

                  <label htmlFor="title">
                    Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="Enter history study title"
                    required
                  />

                </div>


                {/* SLUG */}

                <div className="admin-form-field">

                  <label htmlFor="slug">
                    Slug
                  </label>

                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="history-study-slug"
                    required
                  />

                  <small>
                    Used in the public page URL.
                  </small>

                </div>


                {/* CATEGORY + SCRIPTURE */}

                <div className="admin-form-two-columns">

                  <div className="admin-form-field">

                    <label htmlFor="category">
                      Category
                    </label>

                    <input
                      id="category"
                      name="category"
                      type="text"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="e.g. Biblical Places"
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
                        form.scripture_reference
                      }
                      onChange={handleChange}
                      placeholder="e.g. Psalm 122:1–9"
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
                    placeholder="Briefly describe this history study..."
                    rows="4"
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
                    History Study
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
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write the complete history study here..."
                  rows="18"
                  required
                />

                <small>
                  This content will appear on
                  the public History detail page.
                </small>

              </div>

            </section>

          </div>


          {/* =====================================================
              SIDEBAR
          ====================================================== */}

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
                    Publish Date
                  </label>

                  <input
                    id="published_at"
                    name="published_at"
                    type="datetime-local"
                    value={form.published_at}
                    onChange={handleChange}
                  />

                  <small>
                    Required when scheduling or
                    choosing a specific publication time.
                  </small>

                </div>

              </div>

            </section>


            {/* FEATURED */}

            <section className="history-featured-card">

              <label className="history-featured-toggle">

                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={handleChange}
                />

                <span className="history-checkbox">
                  {form.is_featured && "✓"}
                </span>

                <span className="history-featured-content">

                  <span className="history-featured-title">
                    Featured History
                  </span>

                  <span className="history-featured-description">
                    Highlight this history study on the public History page.
                  </span>

                </span>

              </label>

            </section>


            {/* FEATURED IMAGE */}

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


              <div className="admin-media-card">

                {form.featured_image ? (

                  <div className="admin-image-preview">

                    <div className="admin-image-preview-frame">

                      <img
                        src={getImageUrl(
                          form.featured_image
                        )}
                        alt="History featured preview"
                      />

                    </div>


                    <div className="admin-image-preview-actions">

                      <label
                        className="admin-replace-image-button"
                      >
                        <Upload size={15} />
                        Replace

                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,.gif"
                          onChange={
                            handleImageUpload
                          }
                          hidden
                        />
                      </label>


                      <button
                        type="button"
                        className="admin-remove-image-button"
                        onClick={
                          handleRemoveImage
                        }
                      >
                        <X size={15} />
                        Remove
                      </button>

                    </div>

                  </div>

                ) : (

                  <label className="admin-image-upload">

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.gif"
                      onChange={
                        handleImageUpload
                      }
                      hidden
                    />

                    <div className="admin-image-upload-action">

                      {uploading ? (
                        <span className="admin-upload-spinner">
                          Uploading...
                        </span>
                      ) : (
                        <>
                          <Upload size={20} />

                          <strong>
                            Upload Featured Image
                          </strong>
                        </>
                      )}

                    </div>

                    <span className="admin-image-upload-help">
                      JPG, PNG, WEBP or GIF.
                      Maximum 5MB.
                    </span>

                  </label>

                )}

                {uploading && form.featured_image && (
                  <div className="admin-upload-spinner">
                    Uploading image...
                  </div>
                )}

              </div>

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


        {/* FORM ACTIONS */}

        <div className="admin-form-actions">

          <Link
            to="/admin/history"
            className="admin-cancel-button"
          >
            Cancel
          </Link>


          <button
            type="submit"
            className="admin-primary-button"
            disabled={
              saving ||
              uploading
            }
          >

            <Save size={16} />

            {saving
              ? "Saving..."
              : isEditMode
                ? "Update History"
                : "Save History"}

          </button>

        </div>

      </form>

    </div>
  );
}

export default AdminHistoryForm;