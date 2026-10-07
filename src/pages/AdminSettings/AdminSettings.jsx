import { useEffect, useState } from "react";
import {
  Globe,
  Image,
  Save,
  Share2,
  Play,
  Mail,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./AdminSettings.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AdminSettings() {
  const { token } = useAuth();

  const [settings, setSettings] = useState({
    site_name: "",
    tagline: "",
    description: "",
    contact_email: "",
    phone_number: "",
    whatsapp_number: "",

    hero_title: "",
    hero_subtitle: "",
    hero_image_url: "",

    youtube_url: "",
    facebook_url: "",
    instagram_url: "",
    x_url: "",
    tiktok_url: "",
    telegram_url: "",

    featured_youtube_video: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/admin/settings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load settings."
          );
        }

        setSettings({
          site_name: data.settings.site_name || "",
          tagline: data.settings.tagline || "",
          description: data.settings.description || "",
          contact_email: data.settings.contact_email || "",
          phone_number: data.settings.phone_number || "",
          whatsapp_number: data.settings.whatsapp_number || "",

          hero_title: data.settings.hero_title || "",
          hero_subtitle: data.settings.hero_subtitle || "",
          hero_image_url: data.settings.hero_image_url || "",

          youtube_url: data.settings.youtube_url || "",
          facebook_url: data.settings.facebook_url || "",
          instagram_url: data.settings.instagram_url || "",
          x_url: data.settings.x_url || "",
          tiktok_url: data.settings.tiktok_url || "",
          telegram_url: data.settings.telegram_url || "",

          featured_youtube_video:
            data.settings.featured_youtube_video || "",
        });
      } catch (err) {
        setError(
          err.message || "Unable to load site settings."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadSettings();
    }
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/admin/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save settings."
        );
      }

      setSettings({
        site_name: data.settings.site_name || "",
        tagline: data.settings.tagline || "",
        description: data.settings.description || "",
        contact_email: data.settings.contact_email || "",
        phone_number: data.settings.phone_number || "",
        whatsapp_number: data.settings.whatsapp_number || "",

        hero_title: data.settings.hero_title || "",
        hero_subtitle: data.settings.hero_subtitle || "",
        hero_image_url: data.settings.hero_image_url || "",

        youtube_url: data.settings.youtube_url || "",
        facebook_url: data.settings.facebook_url || "",
        instagram_url: data.settings.instagram_url || "",
        x_url: data.settings.x_url || "",
        tiktok_url: data.settings.tiktok_url || "",
        telegram_url: data.settings.telegram_url || "",

        featured_youtube_video:
          data.settings.featured_youtube_video || "",
      });

      setMessage("Settings saved successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err.message || "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-settings-page">
        <div className="admin-settings-state">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-settings-page">
      <div className="admin-settings-header">
        <div>
          <p className="admin-settings-eyebrow">
            System / Settings
          </p>

          <h1>Site Settings</h1>

          <p>
            Manage the public identity, hero section,
            contact information, social channels and
            YouTube presence of Pilgrim Truth.
          </p>
        </div>
      </div>

      {message && (
        <div className="admin-settings-success">
          {message}
        </div>
      )}

      {error && (
        <div className="admin-settings-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>

        {/* SITE INFORMATION */}
        <section className="admin-settings-card">
          <div className="admin-settings-card-header">
            <div className="admin-settings-icon">
              <Globe size={20} />
            </div>

            <div>
              <h2>Site Information</h2>
              <p>
                Basic information displayed throughout
                the public website.
              </p>
            </div>
          </div>

          <div className="admin-settings-grid">

            <div className="admin-settings-field">
              <label htmlFor="site_name">
                Site Name
              </label>

              <input
                id="site_name"
                name="site_name"
                value={settings.site_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="tagline">
                Tagline
              </label>

              <input
                id="tagline"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-settings-field full">
              <label htmlFor="description">
                Site Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="4"
                value={settings.description}
                onChange={handleChange}
              />
            </div>

          </div>
        </section>

        {/* CONTACT INFORMATION */}
        <section className="admin-settings-card">
          <div className="admin-settings-card-header">
            <div className="admin-settings-icon">
              <Mail size={20} />
            </div>

            <div>
              <h2>Contact Information</h2>
              <p>
                Contact details visitors can use to
                reach Pilgrim Truth.
              </p>
            </div>
          </div>

          <div className="admin-settings-grid">

            <div className="admin-settings-field">
              <label htmlFor="contact_email">
                Email Address
              </label>

              <input
                id="contact_email"
                name="contact_email"
                type="email"
                value={settings.contact_email}
                onChange={handleChange}
                placeholder="contact@example.com"
              />

              <small>
                Visitors can click this address to
                open their email application.
              </small>
            </div>

            <div className="admin-settings-field">
              <label htmlFor="phone_number">
                Phone Number
              </label>

              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={settings.phone_number}
                onChange={handleChange}
                placeholder="0712 345 678"
              />

              <small>
                Enter the phone number visitors should
                use to call the organization.
              </small>
            </div>

            <div className="admin-settings-field">
              <label htmlFor="whatsapp_number">
                WhatsApp Number
              </label>

              <input
                id="whatsapp_number"
                name="whatsapp_number"
                type="tel"
                value={settings.whatsapp_number}
                onChange={handleChange}
                placeholder="0712 345 678"
              />

              <small>
                Enter the number connected to WhatsApp.
                You do not need to enter a WhatsApp URL.
              </small>
            </div>

          </div>
        </section>

        {/* HERO */}
        <section className="admin-settings-card">
          <div className="admin-settings-card-header">
            <div className="admin-settings-icon">
              <Image size={20} />
            </div>

            <div>
              <h2>Hero Section</h2>
              <p>
                Control the main message and image used
                on the Pilgrim Truth homepage.
              </p>
            </div>
          </div>

          <div className="admin-settings-grid">

            <div className="admin-settings-field">
              <label htmlFor="hero_title">
                Hero Title
              </label>

              <input
                id="hero_title"
                name="hero_title"
                value={settings.hero_title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="hero_subtitle">
                Hero Subtitle
              </label>

              <input
                id="hero_subtitle"
                name="hero_subtitle"
                value={settings.hero_subtitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-settings-field full">
              <label htmlFor="hero_image_url">
                Hero Image Path
              </label>

              <input
                id="hero_image_url"
                name="hero_image_url"
                value={settings.hero_image_url}
                onChange={handleChange}
                placeholder="/images/your-hero-image.jpg"
              />

              <small>
                Keep the existing image path unless you
                intentionally want to replace the hero
                image.
              </small>
            </div>

            {settings.hero_image_url && (
              <div className="admin-settings-image-preview full">
                <img
                  src={settings.hero_image_url}
                  alt="Hero preview"
                />

                <span>Current hero image</span>
              </div>
            )}

          </div>
        </section>

        {/* SOCIAL MEDIA */}
        <section className="admin-settings-card">
          <div className="admin-settings-card-header">
            <div className="admin-settings-icon">
              <Share2 size={20} />
            </div>

            <div>
              <h2>Social Media</h2>
              <p>
                Add the official Pilgrim Truth social
                media accounts.
              </p>
            </div>
          </div>

          <div className="admin-settings-grid">

            <div className="admin-settings-field">
              <label htmlFor="youtube_url">
                YouTube
              </label>

              <input
                id="youtube_url"
                name="youtube_url"
                value={settings.youtube_url}
                onChange={handleChange}
                placeholder="YouTube channel URL"
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="facebook_url">
                Facebook
              </label>

              <input
                id="facebook_url"
                name="facebook_url"
                value={settings.facebook_url}
                onChange={handleChange}
                placeholder="Facebook page URL"
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="instagram_url">
                Instagram
              </label>

              <input
                id="instagram_url"
                name="instagram_url"
                value={settings.instagram_url}
                onChange={handleChange}
                placeholder="Instagram profile URL"
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="tiktok_url">
                TikTok
              </label>

              <input
                id="tiktok_url"
                name="tiktok_url"
                value={settings.tiktok_url}
                onChange={handleChange}
                placeholder="TikTok profile URL"
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="telegram_url">
                Telegram
              </label>

              <input
                id="telegram_url"
                name="telegram_url"
                value={settings.telegram_url}
                onChange={handleChange}
                placeholder="Telegram channel URL"
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="x_url">
                X
              </label>

              <input
                id="x_url"
                name="x_url"
                value={settings.x_url}
                onChange={handleChange}
                placeholder="X profile URL"
              />
            </div>

          </div>
        </section>

        {/* YOUTUBE */}
        <section className="admin-settings-card">
          <div className="admin-settings-card-header">
            <div className="admin-settings-icon">
              <Play size={20} />
            </div>

            <div>
              <h2>YouTube</h2>
              <p>
                Configure the featured YouTube video
                displayed across the site.
              </p>
            </div>
          </div>

          <div className="admin-settings-grid">

            <div className="admin-settings-field full">
              <label htmlFor="featured_youtube_video">
                Featured YouTube Video
              </label>

              <input
                id="featured_youtube_video"
                name="featured_youtube_video"
                value={settings.featured_youtube_video}
                onChange={handleChange}
                placeholder="YouTube video URL or video ID"
              />

              <small>
                Example: https://www.youtube.com/watch?v=XXXXXXXXXXX
              </small>
            </div>

          </div>
        </section>

        {/* SAVE */}
        <div className="admin-settings-actions">
          <button
            type="submit"
            disabled={saving}
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AdminSettings;
