import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./AdminDailyInspirationForm.css";
import { useAuth } from "../../context/AuthContext";
import { getAdminDailyInspirations, createAdminDailyInspiration, updateAdminDailyInspiration, uploadAdminImage, }
  from "../../services/admin";


const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5000";
const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const toDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
};

const resolveImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_BASE_URL}${image}`;
  }

  return `${API_BASE_URL}/${image}`;
};

function AdminDailyInspirationForm() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageSource, setImageSource] = useState("upload");

  const [form, setForm] = useState({
    title: "",
    inspiration_date: getToday(),
    scripture_reference: "",
    scripture_text: "",
    reflection: "",
    practical_application: "",
    prayer_prompt: "",
    category: "Christian Living",
    featured_image: "",
    status: "draft",
    published_at: "",
  });

  useEffect(() => {
    const loadInspiration = async () => {
      if (!isEditMode || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAdminDailyInspirations(token);

        const inspiration = (data.inspirations || []).find(
          (item) => Number(item.id) === Number(id)
        );

        if (!inspiration) {
          throw new Error("Daily Inspiration not found.");
        }

        const featuredImage =
          inspiration.featured_image || "";

        setForm({
          title: inspiration.title || "",
          inspiration_date:
            inspiration.inspiration_date?.slice(0, 10) ||
            getToday(),
          scripture_reference:
            inspiration.scripture_reference || "",
          scripture_text:
            inspiration.scripture_text || "",
          reflection:
            inspiration.reflection || "",
          practical_application:
            inspiration.practical_application || "",
          prayer_prompt:
            inspiration.prayer_prompt || "",
          category:
            inspiration.category || "Christian Living",
          featured_image: featuredImage,
          status: inspiration.status || "draft",
          published_at: toDateTimeLocal(
            inspiration.published_at
          ),
        });

        if (
          featuredImage.startsWith("http://") ||
          featuredImage.startsWith("https://")
        ) {
          setImageSource("url");
        } else {
          setImageSource("upload");
        }
      } catch (err) {
        console.error(
          "Load Daily Inspiration error:",
          err
        );

        setError(
          err.message ||
          "Unable to load Daily Inspiration."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInspiration();
  }, [id, isEditMode, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!token) {
      setError(
        "Your session has expired. Please sign in again."
      );
      return;
    }

    try {
      setUploadingImage(true);
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

      setImageSource("upload");
      setSuccess("Image uploaded successfully.");
    } catch (err) {
      console.error(
        "Daily Inspiration image upload error:",
        err
      );

      setError(
        err.message ||
        "Unable to upload image."
      );
    } finally {
      setUploadingImage(false);

      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setForm((previous) => ({
      ...previous,
      featured_image: "",
    }));

    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError(
        "Your session has expired. Please sign in again."
      );
      return;
    }

    setError("");
    setSuccess("");

    if (
      !form.title.trim() ||
      !form.inspiration_date ||
      !form.scripture_reference.trim() ||
      !form.reflection.trim()
    ) {
      setError(
        "Title, date, Scripture reference, and reflection are required."
      );
      return;
    }

    if (
      form.status === "scheduled" &&
      !form.published_at
    ) {
      setError(
        "Please choose a publication date and time for a scheduled inspiration."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        inspiration_date:
          form.inspiration_date,
        scripture_reference:
          form.scripture_reference.trim(),
        scripture_text:
          form.scripture_text.trim(),
        reflection:
          form.reflection.trim(),
        practical_application:
          form.practical_application.trim(),
        prayer_prompt:
          form.prayer_prompt.trim(),
        category:
          form.category.trim(),
        featured_image:
          form.featured_image.trim(),
        status:
          form.status,
        published_at:
          form.published_at || null,
      };

      if (isEditMode) {
        await updateAdminDailyInspiration(
          token,
          id,
          payload
        );

        setSuccess(
          "Daily Inspiration updated successfully."
        );
      } else {
        await createAdminDailyInspiration(
          token,
          payload
        );

        setSuccess(
          "Daily Inspiration created successfully."
        );
      }

      setTimeout(() => {
        navigate(
          "/admin/daily-inspirations"
        );
      }, 700);
    } catch (err) {
      console.error(
        "Save Daily Inspiration error:",
        err
      );

      setError(
        err.message ||
        "Unable to save Daily Inspiration."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-form-loading">
        <Loader2
          size={34}
          className="admin-loading-spinner"
        />

        <h2>Loading Daily Inspiration</h2>

        <p>
          Please wait while the content is loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-form-topbar">
        <Link
          to="/admin/daily-inspirations"
          className="admin-back-link"
        >
          <ArrowLeft size={16} />
          Back to Daily Inspirations
        </Link>
      </div>

      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">
            {isEditMode
              ? "Edit Content"
              : "Create Content"}
          </span>

          <h1>
            {isEditMode
              ? "Edit Daily Inspiration"
              : "New Daily Inspiration"}
          </h1>

          <p>
            Create Scripture-centered content
            for the Pilgrim Truth community.
          </p>
        </div>
      </div>

      {error && (
        <div className="admin-form-alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-form-alert success">
          <CheckCircle2 size={17} />
          {success}
        </div>
      )}

      <form
        className="admin-daily-inspiration-form"
        onSubmit={handleSubmit}
      >
        <div className="admin-form-main">
          <section className="admin-form-card">
            <div className="admin-form-card-heading">
              <div>
                <span className="admin-eyebrow">
                  Main Content
                </span>

                <h2>Daily Inspiration</h2>
              </div>
            </div>

            <div className="admin-form-field">
              <label htmlFor="title">
                Title *
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter inspiration title"
                required
              />
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-field">
                <label htmlFor="inspiration_date">
                  Inspiration Date *
                </label>

                <div className="admin-input-icon">
                  <CalendarDays size={16} />

                  <input
                    id="inspiration_date"
                    name="inspiration_date"
                    type="date"
                    value={
                      form.inspiration_date
                    }
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-field">
                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>
                    Christian Living
                  </option>
                  <option>
                    Bible Study
                  </option>
                  <option>
                    Prophecy
                  </option>
                  <option>
                    Bible History
                  </option>
                  <option>
                    Health
                  </option>
                  <option>
                    Faith
                  </option>
                  <option>
                    Prayer
                  </option>
                  <option>
                    General
                  </option>
                </select>
              </div>
            </div>

            <div className="admin-form-field">
              <label htmlFor="scripture_reference">
                Scripture Reference *
              </label>

              <input
                id="scripture_reference"
                name="scripture_reference"
                type="text"
                value={
                  form.scripture_reference
                }
                onChange={handleChange}
                placeholder="e.g. John 14:6"
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="scripture_text">
                Scripture Text
              </label>

              <textarea
                id="scripture_text"
                name="scripture_text"
                value={form.scripture_text}
                onChange={handleChange}
                placeholder="Enter the Scripture text..."
                rows={5}
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="reflection">
                Reflection *
              </label>

              <textarea
                id="reflection"
                name="reflection"
                value={form.reflection}
                onChange={handleChange}
                placeholder="Write the main reflection..."
                rows={10}
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="practical_application">
                Practical Application
              </label>

              <textarea
                id="practical_application"
                name="practical_application"
                value={
                  form.practical_application
                }
                onChange={handleChange}
                placeholder="How can readers apply this message?"
                rows={7}
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="prayer_prompt">
                Prayer / Reflection Prompt
              </label>

              <textarea
                id="prayer_prompt"
                name="prayer_prompt"
                value={form.prayer_prompt}
                onChange={handleChange}
                placeholder="Give readers a prayer or reflection prompt..."
                rows={6}
              />
            </div>
          </section>
        </div>

        <aside className="admin-form-sidebar">
          <section className="admin-form-card">
            <div className="admin-form-card-heading">
              <div>
                <span className="admin-eyebrow">
                  Publishing
                </span>

                <h2>Visibility</h2>
              </div>
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
                Publication Date & Time
              </label>

              <input
                id="published_at"
                name="published_at"
                type="datetime-local"
                value={form.published_at}
                onChange={handleChange}
              />

              <small className="admin-field-help">
                Used for scheduled publication
                and publication history.
              </small>
            </div>
          </section>

          {/* FEATURED IMAGE */}
          <section className="admin-form-card">
            <div className="admin-form-card-heading">
              <div>
                <span className="admin-eyebrow">
                  Media
                </span>

                <h2>Featured Image</h2>
              </div>
            </div>

            <div className="media-source-tabs">
              <button
                type="button"
                className={
                  imageSource === "upload"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setImageSource("upload")
                }
              >
                <Upload size={15} />
                Upload Image
              </button>

              <button
                type="button"
                className={
                  imageSource === "url"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setImageSource("url")
                }
              >
                <ImageIcon size={15} />
                Image URL
              </button>
            </div>

            {imageSource === "upload" && (
              <div className="media-upload-box">
                <label
                  htmlFor="daily-inspiration-image"
                  className="media-upload-label"
                >
                  <input
                    id="daily-inspiration-image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif"
                    onChange={
                      handleImageUpload
                    }
                    disabled={
                      uploadingImage
                    }
                  />

                  {uploadingImage ? (
                    <>
                      <Loader2
                        size={18}
                        className="admin-loading-spinner"
                      />
                      <span>
                        Uploading image...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>
                        Choose an image
                      </span>
                    </>
                  )}
                </label>

                <small className="admin-field-help">
                  JPG, JPEG, PNG, WebP or GIF
                  · Maximum 5 MB
                </small>
              </div>
            )}

            {imageSource === "url" && (
              <div className="admin-form-field">
                <label htmlFor="featured_image">
                  Image URL
                </label>

                <input
                  id="featured_image"
                  name="featured_image"
                  type="url"
                  value={
                    form.featured_image
                  }
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />

                <small className="admin-field-help">
                  Enter a publicly accessible
                  image URL.
                </small>
              </div>
            )}

            {form.featured_image && (
              <div className="media-preview">
                <div className="media-preview-image">
                  <img
                    src={resolveImageUrl(
                      form.featured_image
                    )}
                    alt={
                      form.title ||
                      "Featured image preview"
                    }
                  />
                </div>

                <div className="media-preview-footer">
                  <span>
                    Image selected
                  </span>

                  <button
                    type="button"
                    className="media-remove-button"
                    onClick={
                      handleRemoveImage
                    }
                  >
                    <X size={15} />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </section>

          {isEditMode && (
            <section className="admin-form-card">
              <div className="admin-form-card-heading">
                <div>
                  <span className="admin-eyebrow">
                    Author
                  </span>

                  <h2>Content Owner</h2>
                </div>
              </div>

              <p className="admin-author-preview">
                {user?.name ||
                  "Pilgrim Truth Admin"}
              </p>

              <small className="admin-field-help">
                The original author is preserved
                when editing.
              </small>
            </section>
          )}

          <button
            type="submit"
            className="admin-primary-button admin-save-button"
            disabled={
              saving || uploadingImage
            }
          >
            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="admin-loading-spinner"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />

                {isEditMode
                  ? "Save Changes"
                  : "Create Inspiration"}
              </>
            )}
          </button>
        </aside>
      </form>
    </div>
  );
}

export default AdminDailyInspirationForm;