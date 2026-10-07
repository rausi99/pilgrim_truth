import { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import {
  FaWhatsapp,
  FaYoutube,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTelegram,
  FaXTwitter,
} from "react-icons/fa6";

import { Link } from "react-router-dom";
import "./Footer.css";


function Footer() {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/settings`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load site settings."
          );
        }

        setSiteSettings(data.settings);
      } catch (error) {
        console.error("Footer settings error:", error);
      }
    };

    loadSettings();
  }, [API_URL]);

  const socialLinks = [
    {
      key: "whatsapp_url",
      label: "WhatsApp",
      icon: FaWhatsapp,
    },
    {
      key: "youtube_url",
      label: "YouTube",
      icon: FaYoutube,
    },
    {
      key: "facebook_url",
      label: "Facebook",
      icon: FaFacebookF,
    },
    {
      key: "instagram_url",
      label: "Instagram",
      icon: FaInstagram,
    },
    {
      key: "tiktok_url",
      label: "TikTok",
      icon: FaTiktok,
    },
    {
      key: "telegram_url",
      label: "Telegram",
      icon: FaTelegram,
    },
    {
      key: "x_url",
      label: "X",
      icon: FaXTwitter,
    },
  ];

  const siteName = siteSettings?.site_name || "PILGRIM TRUTH";

  const phoneNumber = siteSettings?.phone_number
    ? siteSettings.phone_number.replace(/[^\d+]/g, "")
    : null;

  return (
    <footer className="footer">
      <div className="container footer-grid">

        {/* BRAND */}
        <div className="footer-brand-column">
          <Link to="/" className="footer-brand">
            {siteName}
          </Link>

          <p className="footer-description">
            {siteSettings?.description ||
              "Seeking truth, studying Scripture, and living with purpose."}
          </p>

          {/* SOCIAL LINKS */}
          <div className="footer-socials">
            {socialLinks.map((social) => {
              const url = siteSettings?.[social.key];

              if (!url) return null;

              const Icon = social.icon;

              return (
                <a
                  key={social.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="footer-social-link"
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </div>

        {/* EXPLORE */}
        <div className="footer-column">
          <h4>Explore</h4>

          <Link to="/bible-studies">Bible Studies</Link>
          <Link to="/prophecy">Prophecy</Link>
          <Link to="/history">Bible History</Link>
          <Link to="/christian-living">Christian Living</Link>
          <Link to="/health">Health</Link>
        </div>

        {/* RESOURCES */}
        <div className="footer-column">
          <h4>Resources</h4>

          <Link to="/articles">Articles</Link>
          <Link to="/videos">Videos</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/discussions">Discussions</Link>
          <Link to="/daily-inspirations">Daily Inspiration</Link>
        </div>

        {/* CONNECT */}
        <div className="footer-column">
          <h4>Connect</h4>

          <div className="footer-contact">
            {siteSettings?.contact_email && (
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                  siteSettings.contact_email
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail size={16} />
                <span>Contact Us</span>
              </a>
            )}

            {phoneNumber && (
              <a href={`tel:${phoneNumber}`}>
                <Phone size={16} />
                <span>Call Us</span>
              </a>
            )}

            <a href="#location">
              <MapPin size={16} />
              <span>Our Community</span>
            </a>

            <a href="#newsletter">
              <Send size={16} />
              <span>Newsletter</span>
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </span>

        <span>Built for seekers of truth.</span>
      </div>
    </footer>
  );
}

export default Footer;
