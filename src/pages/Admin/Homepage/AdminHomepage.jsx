import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Image,
  LayoutDashboard,
  Newspaper,
  Play,
  Save,
  Settings2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./AdminHomepage.css";
import FeaturedStudies from "./FeaturedStudies/FeaturedStudies";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DEFAULT_SETTINGS = {
  hero_enabled: true,
  daily_inspiration_enabled: true,
  featured_studies_enabled: true,
  prophecy_enabled: true,
  topics_enabled: true,
  articles_enabled: true,
  featured_video_enabled: true,
  newsletter_enabled: true,
  final_cta_enabled: true,
  featured_studies_limit: 3,
  articles_limit: 3,
  newsletter_title: "Continue the journey.",
  newsletter_description:
    "Receive new studies, articles, and reflections from Pilgrim Truth.",
  final_cta_title: "Truth is worth searching for.",
  final_cta_description:
    "Open Scripture. Ask questions. Keep learning.",
};

const SECTION_CONFIG = [
  {
    key: "hero_enabled",
    title: "Hero Section",
    description:
      "Main introduction area displayed at the top of the homepage.",
    icon: Image,
  },
  {
    key: "daily_inspiration_enabled",
    title: "Daily Inspiration",
    description:
      "Displays today's scripture and daily inspiration in the hero.",
    icon: Sparkles,
  },
  {
    key: "featured_studies_enabled",
    title: "Featured Studies",
    description:
      "Displays featured Bible Study, Prophecy, and Bible History content.",
    icon: FileText,
  },
  {
    key: "prophecy_enabled",
    title: "Prophecy",
    description:
      "Displays the dedicated biblical prophecy section.",
    icon: Flame,
  },
  {
    key: "topics_enabled",
    title: "Topics",
    description:
      "Displays the main Pilgrim Truth exploration categories.",
    icon: LayoutDashboard,
  },
  {
    key: "articles_enabled",
    title: "Latest Articles",
    description:
      "Displays the latest published articles.",
    icon: Newspaper,
  },
  {
    key: "featured_video_enabled",
    title: "Featured Video",
    description:
      "Displays the currently selected featured YouTube video.",
    icon: Play,
  },
  {
    key: "newsletter_enabled",
    title: "Newsletter",
    description:
      "Displays the newsletter subscription section.",
    icon: Newspaper,
  },
  {
    key: "final_cta_enabled",
    title: "Final CTA",
    description:
      "Displays the final call-to-action section at the bottom.",
    icon: ArrowLeft,
  },
];

export default function AdminHomepage() {
  const { token } = useAuth();

  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadHomepageSettings();
  }, []);

  async function loadHomepageSettings() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/admin/homepage`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load homepage settings."
        );
      }

      const data = await response.json();

      setForm({
        ...DEFAULT_SETTINGS,
        ...(data?.settings || data || {}),
      });
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Unable to load homepage settings."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));

    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/admin/homepage`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to save homepage settings."
        );
      }

      setForm((current) => ({
        ...current,
        ...(data?.settings || {}),
      }));

      <FeaturedStudies />

      setSuccess(
        "Homepage settings saved successfully."
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Unable to save homepage settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page admin-homepage-page">
        <div className="admin-homepage-state">
          <div className="admin-homepage-spinner" />
          <p>Loading homepage settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-homepage-page">
      <div className="admin-homepage-header">
        <div>
          <span className="admin-homepage-eyebrow">
            WEBSITE MANAGEMENT
          </span>

          <h1>Homepage Management</h1>

          <p>
            Control which sections appear on the public
            Pilgrim Truth homepage.
          </p>
        </div>

        <Link
          to="/admin"
          className="admin-homepage-back"
        >
          <ArrowLeft size={17} />
          Dashboard
        </Link>
      </div>

      {error && (
        <div className="admin-homepage-alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-homepage-alert success">
          {success}
        </div>
      )}

      <form
        className="admin-homepage-form"
        onSubmit={handleSubmit}
      >
        <section className="admin-homepage-card">
          <div className="admin-homepage-card-header">
            <div className="admin-homepage-card-icon">
              <Settings2 size={20} />
            </div>

            <div>
              <h2>Homepage Sections</h2>
              <p>
                Turn homepage sections on or off without
                removing their content.
              </p>
            </div>
          </div>

          <div className="admin-homepage-sections">
            {SECTION_CONFIG.map((section) => {
              const Icon = section.icon;
              const enabled = Boolean(form[section.key]);

              return (
                <div
                  className={`admin-homepage-section ${
                    enabled ? "enabled" : "disabled"
                  }`}
                  key={section.key}
                >
                  <div className="admin-homepage-section-icon">
                    <Icon size={20} />
                  </div>

                  <div className="admin-homepage-section-content">
                    <div className="admin-homepage-section-title">
                      <h3>{section.title}</h3>

                      <span
                        className={`admin-homepage-status ${
                          enabled
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {enabled ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    <p>{section.description}</p>
                  </div>

                  <label className="admin-homepage-switch">
                    <input
                      type="checkbox"
                      name={section.key}
                      checked={enabled}
                      onChange={handleChange}
                    />

                    <span className="admin-homepage-switch-track">
                      <span className="admin-homepage-switch-thumb" />
                    </span>

                    <span className="sr-only">
                      {enabled
                        ? `Hide ${section.title}`
                        : `Show ${section.title}`}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </section>

        <section className="admin-homepage-card">
          <div className="admin-homepage-card-header">
            <div className="admin-homepage-card-icon">
              <LayoutDashboard size={20} />
            </div>

            <div>
              <h2>Content Display</h2>
              <p>
                Control how much content is displayed in
                selected homepage sections.
              </p>
            </div>
          </div>

          <div className="admin-homepage-fields">
            <div className="admin-homepage-field">
              <label htmlFor="featured_studies_limit">
                Featured Studies
              </label>

              <select
                id="featured_studies_limit"
                name="featured_studies_limit"
                value={form.featured_studies_limit}
                onChange={handleChange}
              >
                <option value={1}>1 study</option>
                <option value={2}>2 studies</option>
                <option value={3}>3 studies</option>
                <option value={4}>4 studies</option>
                <option value={5}>5 studies</option>
                <option value={6}>6 studies</option>
              </select>

              <span>
                Number of featured content cards shown.
              </span>
            </div>

            <div className="admin-homepage-field">
              <label htmlFor="articles_limit">
                Latest Articles
              </label>

              <select
                id="articles_limit"
                name="articles_limit"
                value={form.articles_limit}
                onChange={handleChange}
              >
                <option value={1}>1 article</option>
                <option value={2}>2 articles</option>
                <option value={3}>3 articles</option>
                <option value={4}>4 articles</option>
                <option value={5}>5 articles</option>
                <option value={6}>6 articles</option>
              </select>

              <span>
                Number of latest articles displayed.
              </span>
            </div>
          </div>
        </section>

        <section className="admin-homepage-card">
          <div className="admin-homepage-card-header">
            <div className="admin-homepage-card-icon">
              <Newspaper size={20} />
            </div>

            <div>
              <h2>Newsletter Section</h2>
              <p>
                Customize the text shown above the
                newsletter subscription form.
              </p>
            </div>
          </div>

          <div className="admin-homepage-fields">
            <div className="admin-homepage-field full">
              <label htmlFor="newsletter_title">
                Heading
              </label>

              <input
                id="newsletter_title"
                name="newsletter_title"
                value={form.newsletter_title}
                onChange={handleChange}
                placeholder="Continue the journey."
              />
            </div>

            <div className="admin-homepage-field full">
              <label htmlFor="newsletter_description">
                Description
              </label>

              <textarea
                id="newsletter_description"
                name="newsletter_description"
                rows="3"
                value={form.newsletter_description}
                onChange={handleChange}
                placeholder="Newsletter description"
              />
            </div>
          </div>
        </section>

        <section className="admin-homepage-card">
          <div className="admin-homepage-card-header">
            <div className="admin-homepage-card-icon">
              <Eye size={20} />
            </div>

            <div>
              <h2>Final Call to Action</h2>
              <p>
                Customize the closing message on the
                homepage.
              </p>
            </div>
          </div>

          <div className="admin-homepage-fields">
            <div className="admin-homepage-field full">
              <label htmlFor="final_cta_title">
                Heading
              </label>

              <input
                id="final_cta_title"
                name="final_cta_title"
                value={form.final_cta_title}
                onChange={handleChange}
                placeholder="Truth is worth searching for."
              />
            </div>

            <div className="admin-homepage-field full">
              <label htmlFor="final_cta_description">
                Description
              </label>

              <textarea
                id="final_cta_description"
                name="final_cta_description"
                rows="3"
                value={form.final_cta_description}
                onChange={handleChange}
                placeholder="Open Scripture. Ask questions. Keep learning."
              />
            </div>
          </div>
        </section>

        <div className="admin-homepage-actions">
          <button
            type="submit"
            className="admin-homepage-save"
            disabled={saving}
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Homepage Settings"}
          </button>

          <button
            type="button"
            className="admin-homepage-reset"
            onClick={loadHomepageSettings}
            disabled={saving}
          >
            <EyeOff size={17} />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}