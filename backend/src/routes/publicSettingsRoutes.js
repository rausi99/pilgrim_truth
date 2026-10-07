const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        site_name,
        tagline,
        description,
        contact_email,
        phone_number,
        whatsapp_number,
        hero_title,
        hero_subtitle,
        hero_image_url,
        whatsapp_url,
        youtube_url,
        facebook_url,
        instagram_url,
        x_url,
        tiktok_url,
        telegram_url,
        featured_youtube_video
      FROM site_settings
      ORDER BY id ASC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Site settings not found.",
      });
    }

    const settings = result.rows[0];

    /*
     * Generate the WhatsApp URL from the stored number.
     * This prevents the public website from relying
     * on an administrator entering a technical URL.
     */
    let whatsappUrl = null;

    if (settings.whatsapp_number) {
      let digits = settings.whatsapp_number.replace(/\D/g, "");

      if (digits.startsWith("0")) {
        digits = `254${digits.substring(1)}`;
      }

      if (digits) {
        whatsappUrl = `https://wa.me/${digits}`;
      }
    }

    settings.whatsapp_url = whatsappUrl;

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Public settings error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load site settings.",
    });
  }
});

module.exports = router;