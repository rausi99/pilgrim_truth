import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  ImageIcon,
  LinkIcon,
  Save,
  Upload,
  User,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
  createAdminBibleStudy,
  getAdminBibleStudy,
  updateAdminBibleStudy,
  uploadAdminImage,
} from "../../services/admin";

import "./AdminBibleStudyForm.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

function toDateTimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

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

function AdminBibleStudyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [author, setAuthor] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Bible Study",
    description: "",
    scripture_reference: "",
    content: "",
    featured_image: "",
    is_featured: false,
    status: "draft",
    published_at: "",
  });

  useEffect(() => {
    const loadStudy = async () => {
      if (!isEditing || !token) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAdminBibleStudy(token, id);
        const study = data.study;

        setFormData({
          title: study.title || "",
          slug: study.slug || "",
          category: study.category || "Bible Study",
          description: study.description || "",
          scripture_reference: study.scripture_reference || "",
          content: study.content || "",
          featured_image: study.featured_image || "",
          is_featured: Boolean(study.is_featured),
          status: study.status || "draft",
          published_at: study.published_at
            ? toDateTimeLocal(study.published_at)
            : "",
        });

        setAuthor(study.author || "");
      } catch (err) {
        console.error("Load Bible Study error:", err);

        setError(
          err.message || "Unable to load Bible Study."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStudy();
  }, [id, isEditing, token]);

  const slugify = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => {
      const next = {
        ...previous,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "title" && !isEditing) {
        next.slug = slugify(value);
      }

      return next;
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!token) {
      setError(
        "Your session has expired. Please log in again."
      );
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a JPG, JPEG, PNG, WebP or GIF image."
      );
      event.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setError("Image size must not exceed 5MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const data = await uploadAdminImage(token, file);

      setFormData((previous) => ({
        ...previous,
        featured_image: data.imageUrl || "",
      }));

      setSuccess("Image uploaded successfully.");
    } catch (err) {
      console.error(
        "Upload Bible Study image error:",
        err
      );

      setError(
        err.message || "Unable to upload image."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setFormData((previous) => ({
      ...previous,
      featured_image: "",
    }));

    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError(
        "Your session has expired. Please log in again."
      );
      return;
    }

    setError("");
    setSuccess("");

    if (
      !formData.title.trim() ||
      !formData.slug.trim() ||
      !formData.category.trim() ||
      !formData.content.trim()
    ) {
      setError(
        "Title, slug, category, and study content are required."
      );
      return;
    }

    if (
      formData.status === "scheduled" &&
      !formData.published_at
    ) {
      setError(
        "Scheduled Bible Studies require a publication date and time."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...formData,
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        scripture_reference:
          formData.scripture_reference.trim(),
        content: formData.content.trim(),
        featured_image:
          formData.featured_image.trim(),
        published_at:
          formData.published_at || null,
      };

      if (isEditing) {
        await updateAdminBibleStudy(
          token,
          id,
          payload
        );

        setSuccess(
          "Bible Study updated successfully."
        );
      } else {
        await createAdminBibleStudy(
          token,
          payload
        );

        setSuccess(
          "Bible Study created successfully."
        );
      }

      setTimeout(() => {
        navigate("/admin/bible-studies");
      }, 700);
    } catch (err) {
      console.error(
        "Save Bible Study error:",
        err
      );

      setError(
        err.message || "Unable to save Bible Study."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-content-card admin-empty-state">
          <FileText size={36} />

          <h3>Loading Bible Study...</h3>

          <p>
            Please wait while the study is loaded.
          </p>
        </div>
      </div>
    );
  }

  const imagePreview = getImagePreviewUrl(
    formData.featured_image
  );

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <Link
          to="/admin/bible-studies"
          className="admin-back-link"
        >
          <ArrowLeft size={16} />
          Back to Bible Studies
        </Link>

        <div className="admin-eyebrow">
          Content Management
        </div>

        <h1>
          {isEditing
            ? "Edit Bible Study"
            : "New Bible Study"}
        </h1>

        <p>
          {isEditing
            ? "Update this Bible Study and manage its publication."
            : "Create a new Bible Study for the Pilgrim Truth community."}
        </p>
      </div>

      {error && (
        <div className="admin-form-alert admin-form-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-form-alert admin-form-success">
          {success}
        </div>
      )}

      <form
        className="admin-bible-study-form"
        onSubmit={handleSubmit}
      >
        <div className="admin-form-grid">
          {/* MAIN CONTENT */}
          <div className="admin-form-main">
            <div className="admin-form-card">
              <div className="admin-form-card-heading">
                <FileText size={19} />

                <div>
                  <h2>Study Content</h2>

                  <p>
                    Add the main Bible Study
                    information and teaching.
                  </p>
                </div>
              </div>

              <div className="admin-form-fields">
                <div className="admin-form-field">
                  <label htmlFor="title">
                    Title *
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter Bible Study title"
                    required
                  />
                </div>

                <div className="admin-form-field">
                  <label htmlFor="slug">
                    Slug *
                  </label>

                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="bible-study-slug"
                    required
                  />

                  <small className="admin-field-help">
                    Used for the public URL.
                  </small>
                </div>

                <div className="admin-form-field">
                  <label htmlFor="description">
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Short description of this Bible Study"
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
                    placeholder="e.g. John 3:16-21"
                  />
                </div>

                <div className="admin-form-field">
                  <label htmlFor="content">
                    Study Content *
                  </label>

                  <textarea
                    id="content"
                    name="content"
                    rows="18"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write the full Bible Study content here..."
                    required
                  />

                  <small className="admin-field-help">
                    You can expand this later into a
                    richer content editor.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="admin-form-sidebar">
            {/* PUBLICATION */}
            <div className="admin-form-card">
              <div className="admin-form-card-heading">
                <FileText size={19} />

                <div>
                  <h2>Publication</h2>

                  <p>
                    Control visibility and
                    publication status.
                  </p>
                </div>
              </div>

              <div className="admin-form-fields">
                <div className="admin-form-field">
                  <label htmlFor="category">
                    Category *
                  </label>

                  <input
                    id="category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Bible Study"
                    required
                  />
                </div>

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

                  <div className="admin-input-icon">
                    <CalendarDays size={17} />

                    <input
                      id="published_at"
                      name="published_at"
                      type="datetime-local"
                      value={
                        formData.published_at
                      }
                      onChange={handleChange}
                    />
                  </div>

                  <small className="admin-field-help">
                    Required when status is
                    scheduled.
                  </small>
                </div>

                {/* FEATURED BIBLE STUDY */}
                <section className="bible-study-featured-card">
                  <label className="bible-study-featured-toggle">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={
                        formData.is_featured
                      }
                      onChange={handleChange}
                    />

                    <span className="bible-study-checkbox">
                      {formData.is_featured && "✓"}
                    </span>

                    <span className="bible-study-featured-content">
                      <span className="bible-study-featured-title">
                        Featured Bible Study
                      </span>

                      <span className="bible-study-featured-description">
                        Highlight this Bible Study
                        on the public Bible Studies
                        page.
                      </span>
                    </span>
                  </label>
                </section>
              </div>
            </div>

            {/* FEATURED IMAGE */}
            <div className="admin-form-card">
              <div className="admin-form-card-heading">
                <ImageIcon size={19} />

                <div>
                  <h2>Featured Image</h2>

                  <p>
                    Upload an image or use an
                    external image URL.
                  </p>
                </div>
              </div>

              <div className="admin-image-upload">
                {imagePreview ? (
                  <div className="admin-image-preview">
                    <img
                      src={imagePreview}
                      alt="Bible Study preview"
                    />

                    <button
                      type="button"
                      className="admin-image-remove"
                      onClick={
                        handleRemoveImage
                      }
                      aria-label="Remove image"
                    >
                      <X size={17} />
                    </button>
                  </div>
                ) : (
                  <div className="admin-image-placeholder">
                    <ImageIcon size={34} />

                    <strong>
                      No image selected
                    </strong>

                    <span>
                      Upload an image or add an
                      external image URL below.
                    </span>
                  </div>
                )}

                <label className="admin-upload-button">
                  <Upload size={17} />

                  {uploading
                    ? "Uploading..."
                    : imagePreview
                      ? "Replace Image"
                      : "Upload Image"}

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                    onChange={
                      handleImageUpload
                    }
                    disabled={uploading}
                    hidden
                  />
                </label>

                <small className="admin-field-help">
                  JPG, JPEG, PNG, WebP or GIF.
                  Maximum 5MB.
                </small>

                <div className="admin-media-divider">
                  <span>OR</span>
                </div>

                <div className="admin-form-field">
                  <label htmlFor="featured_image">
                    Image URL
                  </label>

                  <div className="admin-input-icon">
                    <LinkIcon size={17} />

                    <input
                      id="featured_image"
                      name="featured_image"
                      type="text"
                      value={
                        formData.featured_image
                      }
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>

                  <small className="admin-field-help">
                    You can use an external image
                    URL instead of an uploaded
                    image.
                  </small>
                </div>
              </div>
            </div>

            {/* AUTHOR */}
            {isEditing && (
              <div className="admin-form-card">
                <div className="admin-form-card-heading">
                  <User size={19} />

                  <div>
                    <h2>Content Author</h2>

                    <p>
                      Administrator responsible
                      for this study.
                    </p>
                  </div>
                </div>

                <div className="admin-author-preview">
                  <div className="admin-author-avatar">
                    <User size={17} />
                  </div>

                  <div>
                    <span>
                      Current Administrator
                    </span>

                    <strong>
                      {author || "Administrator"}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="admin-form-actions">
          <Link
            to="/admin/bible-studies"
            className="admin-cancel-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={saving || uploading}
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Save Bible Study"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminBibleStudyForm;