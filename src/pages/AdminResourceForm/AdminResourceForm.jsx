import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileText,
  Save,
  Star,
  Upload,
  X,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import "./AdminResourceForm.css";

import { useAuth } from "../../context/AuthContext";

import {
  createAdminResource,
  getAdminResource,
  updateAdminResource,
} from "../../services/admin";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".txt",
  ".zip",
];

const FILE_TYPE_MAP = {
  ".pdf": "PDF",
  ".doc": "DOC",
  ".docx": "DOCX",
  ".ppt": "PPT",
  ".pptx": "PPTX",
  ".xls": "XLS",
  ".xlsx": "XLSX",
  ".txt": "TXT",
  ".zip": "ZIP",
};

function AdminResourceForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

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

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [uploadInfo, setUploadInfo] =
    useState(null);

  const [formData, setFormData] =
    useState({
      title: "",
      slug: "",
      category: "Bible Study",
      description: "",
      file_url: "",
      thumbnail_url: "",
      file_type: "",
      file_size: "",
      is_featured: false,
      status: "draft",
      published_at: "",
    });

  const [
    slugManuallyEdited,
    setSlugManuallyEdited,
  ] = useState(false);

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    const mb =
      bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${(
      bytes / 1024
    ).toFixed(2)} KB`;
  };

  useEffect(() => {
    const loadResource = async () => {
      if (!isEditing || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminResource(
            token,
            id
          );

        const resource =
          data.resource;

        if (!resource) {
          throw new Error(
            "Resource was not found."
          );
        }

        setFormData({
          title:
            resource.title || "",
          slug:
            resource.slug || "",
          category:
            resource.category ||
            "Bible Study",
          description:
            resource.description ||
            "",
          file_url:
            resource.file_url || "",
          thumbnail_url:
            resource.thumbnail_url ||
            "",
          file_type:
            resource.file_type ||
            "",
          file_size:
            resource.file_size ||
            "",
          is_featured:
            Boolean(
              resource.is_featured
            ),
          status:
            resource.status ||
            "draft",
          published_at:
            resource.published_at
              ? resource.published_at.slice(
                  0,
                  16
                )
              : "",
        });

        setUploadInfo({
          original_name:
            resource.file_url
              ? resource.file_url
                  .split("/")
                  .pop()
              : "",
          file_url:
            resource.file_url || "",
          file_type:
            resource.file_type ||
            "",
          file_size:
            resource.file_size ||
            "",
        });

        setSlugManuallyEdited(true);
      } catch (error) {
        console.error(
          "Resource loading error:",
          error
        );

        setError(
          error.message ||
            "Unable to load resource."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [
    id,
    isEditing,
    token,
  ]);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    if (name === "title") {
      setFormData(
        (previous) => ({
          ...previous,
          title: value,
          slug:
            slugManuallyEdited
              ? previous.slug
              : generateSlug(value),
        })
      );
    } else {
      setFormData(
        (previous) => ({
          ...previous,
          [name]:
            type === "checkbox"
              ? checked
              : value,
        })
      );
    }

    if (name === "slug") {
      setSlugManuallyEdited(true);
    }

    setError("");
    setSuccess("");
  };

  const handleFileChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const lastDotIndex =
      file.name.lastIndexOf(".");

    const extension =
      lastDotIndex !== -1
        ? file.name
            .slice(lastDotIndex)
            .toLowerCase()
        : "";

    if (
      !ALLOWED_EXTENSIONS.includes(
        extension
      )
    ) {
      setSelectedFile(null);

      event.target.value = "";

      setError(
        "Unsupported file type. Please choose a PDF, Word, PowerPoint, Excel, TXT, or ZIP file."
      );

      return;
    }

    const maxSize =
      20 * 1024 * 1024;

    if (file.size > maxSize) {
      setSelectedFile(null);

      event.target.value = "";

      setError(
        "The resource file must be 20 MB or smaller."
      );

      return;
    }

    const fileType =
      FILE_TYPE_MAP[
        extension
      ] || "FILE";

    setSelectedFile(file);

    setFormData(
      (previous) => ({
        ...previous,
        file_type: fileType,
        file_size:
          formatFileSize(
            file.size
          ),
      })
    );
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      return null;
    }

    if (!token) {
      throw new Error(
        "Authentication token not found."
      );
    }

    const data =
      new FormData();

    data.append(
      "file",
      selectedFile
    );

    const response =
      await fetch(
        `${API_URL}/content/resources/upload`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
          body: data,
        }
      );

    const responseText =
      await response.text();

    let result;

    try {
      result =
        JSON.parse(
          responseText
        );
    } catch {
      throw new Error(
        `Server returned an unexpected response (${response.status}).`
      );
    }

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Unable to upload resource file."
      );
    }

    return result;
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!token) {
      setError(
        "Authentication token not found."
      );

      return;
    }

    if (
      !formData.title.trim() ||
      !formData.slug.trim() ||
      !formData.category.trim()
    ) {
      setError(
        "Title, slug, and category are required."
      );

      return;
    }

    if (
      !isEditing &&
      !selectedFile
    ) {
      setError(
        "Please select a resource file."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let uploadedFile =
        uploadInfo;

      /*
       * Upload a new resource file first.
       */
      if (selectedFile) {
        setUploading(true);

        const uploadResult =
          await uploadFile();

        /*
         * The API returns:
         * {
         *   success: true,
         *   file: { ... }
         * }
         *
         * We need the nested file object.
         */
        uploadedFile =
          uploadResult.file;

        setUploadInfo(
          uploadResult.file
        );

        setUploading(false);
      }

      if (
        !uploadedFile?.file_url &&
        !formData.file_url
      ) {
        throw new Error(
          "A resource file is required."
        );
      }

      const payload = {
        title:
          formData.title.trim(),

        slug:
          formData.slug.trim(),

        category:
          formData.category.trim(),

        description:
          formData.description.trim(),

        file_url:
          uploadedFile?.file_url ||
          formData.file_url,

        thumbnail_url:
          formData.thumbnail_url.trim(),

        file_type:
          uploadedFile?.file_type ||
          formData.file_type ||
          "FILE",

        file_size:
          uploadedFile?.file_size ||
          formData.file_size,

        is_featured:
          formData.is_featured,

        status:
          formData.status,

        published_at:
          formData.published_at ||
          null,
      };

      if (isEditing) {
        await updateAdminResource(
          token,
          id,
          payload
        );

        setSuccess(
          "Resource updated successfully."
        );
      } else {
        await createAdminResource(
          token,
          payload
        );

        setSuccess(
          "Resource created successfully."
        );
      }

      setSelectedFile(null);

      setTimeout(() => {
        navigate(
          "/admin/resources"
        );
      }, 700);
    } catch (error) {
      console.error(
        "Resource save error:",
        error
      );

      setUploading(false);

      setError(
        error.message ||
          "Unable to save resource."
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);

    setFormData(
      (previous) => ({
        ...previous,
        file_type:
          uploadInfo?.file_type ||
          previous.file_type,
        file_size:
          uploadInfo?.file_size ||
          previous.file_size,
      })
    );

    const input =
      document.getElementById(
        "resource-file"
      );

    if (input) {
      input.value = "";
    }
  };

  if (loading) {
    return (
      <div className="admin-page admin-resource-form-page">
        <div className="admin-empty-state">
          <FileText size={36} />

          <h3>
            Loading resource...
          </h3>

          <p>
            Please wait while the resource
            is loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-resource-form-page">

      {/* HEADER */}

      <div className="admin-page-header">
        <div>
          <div className="admin-page-eyebrow">
            Resources
          </div>

          <h1>
            {isEditing
              ? "Edit Resource"
              : "Add Resource"}
          </h1>

          <p>
            {isEditing
              ? "Update the resource details and publication settings."
              : "Add a downloadable resource to the Pilgrim Truth library."}
          </p>
        </div>

        <Link
          to="/admin/resources"
          className="admin-secondary-button"
        >
          <ArrowLeft size={17} />
          Back to Resources
        </Link>
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
        className="admin-resource-form"
        onSubmit={handleSubmit}
      >

        {/* RESOURCE INFORMATION */}

        <div className="admin-form-card">

          <div className="admin-form-card-header">
            <div>
              <h2>
                Resource Information
              </h2>

              <p>
                Basic information displayed in
                the resource library.
              </p>
            </div>

            <FileText size={21} />
          </div>

          <div className="admin-form-grid">

            <div className="admin-form-field admin-form-field-full">
              <label htmlFor="title">
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. Bible Study Guide"
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="slug">
                Slug
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                value={
                  formData.slug
                }
                onChange={
                  handleChange
                }
                placeholder="bible-study-guide"
                required
              />

              <small>
                Automatically generated from
                the title, but editable.
              </small>
            </div>

            <div className="admin-form-field">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={
                  formData.category
                }
                onChange={
                  handleChange
                }
              >
                <option value="Bible Study">
                  Bible Study
                </option>

                <option value="Prophecy">
                  Prophecy
                </option>

                <option value="Bible History">
                  Bible History
                </option>

                <option value="Christian Living">
                  Christian Living
                </option>

                <option value="Health">
                  Health
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="admin-form-field admin-form-field-full">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="6"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Describe what readers will find in this resource..."
              />
            </div>

          </div>
        </div>

        {/* RESOURCE FILE UPLOAD */}

        <div className="admin-form-card">

          <div className="admin-form-card-header">
            <div>
              <h2>
                Resource File
              </h2>

              <p>
                Select a resource from your computer.
                File type and size are detected automatically.
              </p>
            </div>

            <Upload size={21} />
          </div>

          <label
            htmlFor="resource-file"
            className={`admin-resource-upload ${
              selectedFile
                ? "has-file"
                : ""
            }`}
          >
            <div className="admin-resource-upload-icon">
              <Upload size={25} />
            </div>

            <div className="admin-resource-upload-content">
              <strong>
                {selectedFile
                  ? "Resource file selected"
                  : "Choose a resource file"}
              </strong>

              <span>
                {selectedFile
                  ? selectedFile.name
                  : "PDF, Word, PowerPoint, Excel, TXT or ZIP files up to 20 MB"}
              </span>
            </div>

            <span className="admin-resource-upload-button">
              Browse
            </span>
          </label>

          <input
            id="resource-file"
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip"
            onChange={
              handleFileChange
            }
            hidden
          />

          {selectedFile && (
            <div className="admin-resource-selected-file">

              <div className="admin-resource-selected-icon">
                <FileText size={22} />
              </div>

              <div className="admin-resource-selected-info">
                <strong>
                  {selectedFile.name}
                </strong>

                <span>
                  {(() => {
                    const extension =
                      selectedFile.name
                        .slice(
                          selectedFile.name.lastIndexOf(
                            "."
                          )
                        )
                        .toLowerCase();

                    return (
                      FILE_TYPE_MAP[
                        extension
                      ] || "FILE"
                    );
                  })()}{" "}
                  •{" "}
                  {formatFileSize(
                    selectedFile.size
                  )}
                </span>
              </div>

              <button
                type="button"
                className="admin-icon-button"
                onClick={
                  removeSelectedFile
                }
                disabled={
                  saving ||
                  uploading
                }
                title="Remove selected file"
              >
                <X size={16} />
              </button>

            </div>
          )}

          {uploadInfo &&
            !selectedFile && (
              <div className="admin-resource-current-file">

                <div className="admin-resource-current-icon">
                  <CheckCircle2
                    size={20}
                  />
                </div>

                <div className="admin-resource-current-info">
                  <strong>
                    Current Resource
                  </strong>

                  <span>
                    {uploadInfo.original_name ||
                      "Uploaded resource"}
                    {" • "}
                    {uploadInfo.file_type ||
                      formData.file_type ||
                      "FILE"}
                    {" • "}
                    {uploadInfo.file_size ||
                      formData.file_size ||
                      "Size unavailable"}
                  </span>
                </div>

                {uploadInfo.file_url && (
                  <a
                    href={
                      uploadInfo.file_url.startsWith(
                        "http"
                      )
? uploadInfo.file_url
: `https://pilgrim-truth.onrender.com${uploadInfo.file_url}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="admin-secondary-button"
                  >
                    <ExternalLink
                      size={16}
                    />
                    Open
                  </a>
                )}

              </div>
            )}

          <div className="admin-form-grid admin-resource-file-details">

            <div className="admin-form-field">
              <label>
                File Type
              </label>

              <input
                type="text"
                value={
                  selectedFile
                    ? (() => {
                        const extension =
                          selectedFile.name
                            .slice(
                              selectedFile.name.lastIndexOf(
                                "."
                              )
                            )
                            .toLowerCase();

                        return (
                          FILE_TYPE_MAP[
                            extension
                          ] || "FILE"
                        );
                      })()
                    : formData.file_type ||
                      "—"
                }
                readOnly
              />
            </div>

            <div className="admin-form-field">
              <label>
                File Size
              </label>

              <input
                type="text"
                value={
                  selectedFile
                    ? formatFileSize(
                        selectedFile.size
                      )
                    : formData.file_size ||
                      "—"
                }
                readOnly
              />
            </div>

          </div>

        </div>

        {/* OPTIONAL THUMBNAIL */}

        <div className="admin-form-card">

          <div className="admin-form-card-header">
            <div>
              <h2>
                Appearance
              </h2>

              <p>
                Optional visual information for
                the public resource library.
              </p>
            </div>
          </div>

          <div className="admin-form-grid">

            <div className="admin-form-field admin-form-field-full">
              <label htmlFor="thumbnail_url">
                Thumbnail URL
              </label>

              <input
                id="thumbnail_url"
                name="thumbnail_url"
                type="text"
                value={
                  formData.thumbnail_url
                }
                onChange={
                  handleChange
                }
                placeholder="/images/resource-cover.jpg"
              />

              <small>
                Optional. Automatic file preview
                generation can be added later.
              </small>
            </div>

          </div>

        </div>

        {/* PUBLICATION */}

        <div className="admin-form-card">

          <div className="admin-form-card-header">
            <div>
              <h2>
                Publication
              </h2>

              <p>
                Control visibility and featured
                placement.
              </p>
            </div>

            <Star size={21} />
          </div>

          <div className="admin-form-grid">

            <div className="admin-form-field">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleChange
                }
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
                onChange={
                  handleChange
                }
              />

              <small>
                Use a future date when using
                Scheduled status.
              </small>
            </div>

            <div className="admin-feature-toggle admin-form-field-full">

              <label className="admin-checkbox-label">

                <input
                  type="checkbox"
                  name="is_featured"
                  checked={
                    formData.is_featured
                  }
                  onChange={
                    handleChange
                  }
                />

                <span className="admin-checkbox-custom" />

                <span>
                  <strong>
                    Featured Resource
                  </strong>

                  <small>
                    Highlight this resource on
                    public resource sections.
                  </small>
                </span>

              </label>

            </div>

          </div>
        </div>

        {/* ACTIONS */}

        <div className="admin-form-actions">

          <Link
            to="/admin/resources"
            className="admin-secondary-button"
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
            <Save size={17} />

            {uploading
              ? "Uploading..."
              : saving
              ? "Saving..."
              : isEditing
              ? "Update Resource"
              : "Create Resource"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default AdminResourceForm;