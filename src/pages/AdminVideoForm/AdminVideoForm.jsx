import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Image,
  RefreshCw,
  Save,
  Video,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
  createAdminVideo,
  getAdminVideo,
  getYouTubeMetadata,
  updateAdminVideo,
} from "../../services/admin";

import "./AdminVideoForm.css";

function AdminVideoForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [youtubeLoading, setYoutubeLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    youtube_url: "",
    youtube_id: "",
    duration: "",
    thumbnail_url: "",
    is_featured: false,
    status: "draft",
    published_at: "",
  });

  const categories = [
    "Bible Study",
    "Prophecy",
    "Bible History",
    "Christian Living",
    "Health",
    "Sermons",
    "Testimonies",
    "Other",
  ];

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadVideo = async () => {
      if (!token) {
        setLoading(false);
        setError(
          "Your session has expired. Please log in again."
        );
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAdminVideo(token, id);
        const video = data.video;

        setForm({
          title: video.title || "",
          slug: video.slug || "",
          category: video.category || "",
          youtube_url: video.youtube_url || "",
          youtube_id: video.youtube_id || "",
          duration: video.duration || "",
          thumbnail_url: video.thumbnail_url || "",
          is_featured: Boolean(video.is_featured),
          status: video.status || "draft",
          published_at: video.published_at
            ? video.published_at.slice(0, 16)
            : "",
        });
      } catch (err) {
        console.error("Load video error:", err);

        setError(
          err.message || "Unable to load video."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [id, isEditMode, token]);

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const extractYouTubeId = (url) => {
    if (!url) {
      return "";
    }

    try {
      const parsed = new URL(url);

      const hostname = parsed.hostname
        .toLowerCase()
        .replace("www.", "");

      if (hostname === "youtu.be") {
        return parsed.pathname
          .replace("/", "")
          .split("/")[0];
      }

      if (
        hostname === "youtube.com" ||
        hostname === "m.youtube.com"
      ) {
        const videoId = parsed.searchParams.get("v");

        if (videoId) {
          return videoId;
        }

        const embedMatch =
          parsed.pathname.match(
            /\/embed\/([^/]+)/
          );

        if (embedMatch) {
          return embedMatch[1];
        }

        const shortsMatch =
          parsed.pathname.match(
            /\/shorts\/([^/]+)/
          );

        if (shortsMatch) {
          return shortsMatch[1];
        }
      }
    } catch {
      return "";
    }

    return "";
  };

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setError("");
    setSuccess("");

    if (name === "title" && !isEditMode) {
      setForm((previous) => ({
        ...previous,
        title: value,
        slug: generateSlug(value),
      }));

      return;
    }

    if (name === "youtube_url") {
      const youtubeId =
        extractYouTubeId(value);

      setForm((previous) => ({
        ...previous,
        youtube_url: value,
        youtube_id: youtubeId,
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleFetchYouTubeMetadata =
    async () => {
      if (!token) {
        setError(
          "Your session has expired. Please log in again."
        );
        return;
      }

      if (!form.youtube_url.trim()) {
        setError(
          "Please enter a YouTube URL first."
        );
        return;
      }

      try {
        setYoutubeLoading(true);
        setError("");
        setSuccess("");

        const data =
          await getYouTubeMetadata(
            token,
            form.youtube_url.trim()
          );

        const video = data.video;

        setForm((previous) => ({
          ...previous,

          youtube_id:
            video.youtube_id ||
            previous.youtube_id,

          title:
            video.title ||
            previous.title,

          slug:
            !isEditMode &&
            video.title
              ? generateSlug(video.title)
              : previous.slug,

          thumbnail_url:
            video.thumbnail_url ||
            previous.thumbnail_url,

          duration:
            video.duration ||
            previous.duration,

          published_at:
            previous.published_at ||
            (
              video.published_at
                ? new Date(
                    video.published_at
                  )
                    .toISOString()
                    .slice(0, 16)
                : ""
            ),
        }));

        setSuccess(
          "YouTube video information loaded successfully."
        );
      } catch (err) {
        console.error(
          "YouTube metadata error:",
          err
        );

        setError(
          err.message ||
            "Unable to retrieve YouTube video information."
        );
      } finally {
        setYoutubeLoading(false);
      }
    };

  const previewThumbnail = useMemo(() => {
    if (form.thumbnail_url) {
      return form.thumbnail_url;
    }

    if (form.youtube_id) {
      return `https://img.youtube.com/vi/${form.youtube_id}/hqdefault.jpg`;
    }

    return "";
  }, [
    form.thumbnail_url,
    form.youtube_id,
  ]);

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Video title is required.";
    }

    if (!form.slug.trim()) {
      return "Slug is required.";
    }

    if (!form.category.trim()) {
      return "Please select a category.";
    }

    if (
      form.youtube_url &&
      !form.youtube_id
    ) {
      return "Please enter a valid YouTube URL.";
    }

    if (
      form.status === "scheduled" &&
      !form.published_at
    ) {
      return "Please select a publication date and time for scheduled videos.";
    }

    return "";
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

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);


      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        category: form.category.trim(),
        youtube_url:
          form.youtube_url.trim(),
        youtube_id:
          form.youtube_id.trim(),
        duration:
          form.duration.trim(),
        thumbnail_url:
          form.thumbnail_url.trim(),
        is_featured:
          form.is_featured,
        status: form.status,
        published_at:
          form.published_at || null,
      };

      if (isEditMode) {
        await updateAdminVideo(
          token,
          id,
          payload
        );

        setSuccess(
          "Video updated successfully."
        );
      } else {
        await createAdminVideo(
          token,
          payload
        );

        setSuccess(
          "Video created successfully."
        );
      }

      setTimeout(() => {
        navigate("/admin/videos");
      }, 700);
    } catch (err) {
      console.error(
        "Save video error:",
        err
      );

      setError(
        err.message ||
          "Unable to save video."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-table-state">
          <Video size={36} />

          <h3>Loading video...</h3>

          <p>
            Please wait while the video is loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-video-form-page">
      {/* PAGE HEADER */}
      <div className="admin-page-heading">
        <Link
          to="/admin/videos"
          className="admin-back-link"
        >
          <ArrowLeft size={16} />
          Back to Videos
        </Link>

        <div className="admin-eyebrow">
          Content Management
        </div>

        <h1>
          {isEditMode
            ? "Edit Video"
            : "Add Video"}
        </h1>

        <p>
          Add and manage YouTube video content
          for the Pilgrim Truth community.
        </p>
      </div>

      {/* ALERTS */}
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
        className="admin-video-form"
        onSubmit={handleSubmit}
      >
        <div className="admin-form-grid">
          {/* MAIN */}
          <div className="admin-form-main">
            {/* VIDEO INFORMATION */}
            <section className="admin-form-card">
              <div className="admin-form-card-heading">
                <Video size={19} />

                <div>
                  <h2>Video Information</h2>

                  <p>
                    Basic information about
                    this video.
                  </p>
                </div>
              </div>

              <div className="admin-form-fields">
                <div className="admin-form-field">
                  <label htmlFor="title">
                    Video Title *
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter video title"
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
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="video-title"
                    required
                  />

                  <small className="admin-field-help">
                    Used for identifying the
                    video and future public URLs.
                  </small>
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
                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </section>

            {/* YOUTUBE */}
            <section className="admin-form-card">
              <div className="admin-form-card-heading">
                <Video size={19} />

                <div>
                  <h2>YouTube</h2>

                  <p>
                    Connect this video to
                    its YouTube content.
                  </p>
                </div>
              </div>

              <div className="admin-form-fields">
                <div className="admin-form-field">
                  <label htmlFor="youtube_url">
                    YouTube URL
                  </label>

                  <div className="admin-youtube-input-row">
                    <input
                      id="youtube_url"
                      name="youtube_url"
                      type="url"
                      value={
                        form.youtube_url
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                    />

                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={
                        handleFetchYouTubeMetadata
                      }
                      disabled={
                        youtubeLoading ||
                        !form.youtube_url.trim()
                      }
                    >
                      <RefreshCw
                        size={16}
                        className={
                          youtubeLoading
                            ? "admin-spin"
                            : ""
                        }
                      />

                      {youtubeLoading
                        ? "Fetching..."
                        : "Fetch Info"}
                    </button>
                  </div>

                  <small className="admin-field-help">
                    Paste a YouTube URL to
                    automatically retrieve the
                    video information.
                  </small>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-field">
                    <label htmlFor="youtube_id">
                      YouTube Video ID
                    </label>

                    <input
                      id="youtube_id"
                      name="youtube_id"
                      type="text"
                      value={
                        form.youtube_id
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Automatically detected"
                    />

                    <small className="admin-field-help">
                      Automatically extracted
                      from the YouTube URL.
                    </small>
                  </div>

                  <div className="admin-form-field">
                    <label htmlFor="duration">
                      Duration
                    </label>

                    <input
                      id="duration"
                      name="duration"
                      type="text"
                      value={
                        form.duration
                      }
                      onChange={handleChange}
                      placeholder="Not loaded yet"
                    />

                    <small className="admin-field-help">
                      Usually retrieved
                      automatically from YouTube.
                    </small>
                  </div>
                </div>

                <div className="admin-form-field">
                  <label htmlFor="thumbnail_url">
                    Custom Thumbnail URL
                  </label>

                  <input
                    id="thumbnail_url"
                    name="thumbnail_url"
                    type="url"
                    value={
                      form.thumbnail_url
                    }
                    onChange={handleChange}
                    placeholder="https://..."
                  />

                  <small className="admin-field-help">
                    Leave empty to use the
                    YouTube thumbnail.
                  </small>
                </div>

                {previewThumbnail && (
                  <div className="admin-video-preview">
                    <div className="admin-video-preview-label">
                      Thumbnail Preview
                    </div>

                    <img
                      src={previewThumbnail}
                      alt="Video thumbnail preview"
                    />
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="admin-form-sidebar">
            {/* PUBLISHING */}
            <section className="admin-form-card">
              <div className="admin-form-card-heading">
                <Save size={19} />

                <div>
                  <h2>Publishing</h2>

                  <p>
                    Control how the video
                    is published.
                  </p>
                </div>
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
                    Publication Date
                  </label>

                  <input
                    id="published_at"
                    name="published_at"
                    type="datetime-local"
                    value={
                      form.published_at
                    }
                    onChange={handleChange}
                  />

                  <small className="admin-field-help">
                    Required when status is
                    scheduled.
                  </small>
                </div>

                {/* FEATURED VIDEO */}
                <section className="video-featured-card">
                  <label className="video-featured-toggle">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={
                        form.is_featured
                      }
                      onChange={handleChange}
                    />

                    <span className="video-checkbox">
                      {form.is_featured && "✓"}
                    </span>

                    <span className="video-featured-content">
                      <span className="video-featured-title">
                        Featured Video
                      </span>

                      <span className="video-featured-description">
                        Highlight this video on
                        the public Videos page.
                      </span>
                    </span>
                  </label>
                </section>
              </div>
            </section>

            {/* THUMBNAIL HELP */}
            <section className="admin-form-card admin-video-help-card">
              <div className="admin-form-card-heading">
                <Image size={19} />

                <div>
                  <h2>Thumbnail</h2>

                  <p>
                    YouTube thumbnails can be
                    used automatically.
                  </p>
                </div>
              </div>

              <p>
                When you fetch YouTube
                information, the system
                automatically retrieves the
                thumbnail. You can still provide
                a custom thumbnail if needed.
              </p>
            </section>
          </aside>
        </div>

        {/* ACTIONS */}
        <div className="admin-form-actions">
          <Link
            to="/admin/videos"
            className="admin-cancel-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={
              saving || youtubeLoading
            }
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Save Video"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminVideoForm;
