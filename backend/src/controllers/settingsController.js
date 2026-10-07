const pool = require("../config/db");

/**
 * Convert a phone number into a WhatsApp-compatible URL.
 *
 * Examples:
 * 0712345678     -> https://wa.me/254712345678
 * +254712345678  -> https://wa.me/254712345678
 * 254712345678   -> https://wa.me/254712345678
 */
const generateWhatsAppUrl = (phoneNumber) => {
  if (!phoneNumber) {
    return null;
  }

  let digits = phoneNumber.replace(/\D/g, "");

  // Kenyan local format: 07XXXXXXXX or 01XXXXXXXX
  if (digits.startsWith("0")) {
    digits = `254${digits.substring(1)}`;
  }

  if (!digits) {
    return null;
  }

  return `https://wa.me/${digits}`;
};

const getSettings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM site_settings
       ORDER BY id
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Site settings have not been configured.",
      });
    }

    res.json({
      success: true,
      settings: result.rows[0],
    });
  } catch (error) {
    console.error("Get settings error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load site settings.",
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const {
      site_name,
      tagline,
      description,
      contact_email,
      phone_number,
      whatsapp_number,

      hero_title,
      hero_subtitle,
      hero_image_url,

      youtube_url,
      facebook_url,
      instagram_url,
      x_url,
      tiktok_url,
      telegram_url,

      featured_youtube_video,
    } = req.body;

    if (!site_name || !tagline || !hero_title || !hero_subtitle) {
      return res.status(400).json({
        success: false,
        message:
          "Site name, tagline, hero title and hero subtitle are required.",
      });
    }

    const generatedWhatsAppUrl =
      generateWhatsAppUrl(whatsapp_number);

    const existing = await pool.query(
      `SELECT id
       FROM site_settings
       ORDER BY id
       LIMIT 1`
    );

    let result;

    /*
     * CREATE SETTINGS
     */
    if (existing.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO site_settings (
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
          featured_youtube_video,
          updated_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15, $16, $17,
          CURRENT_TIMESTAMP
        )
        RETURNING *`,
        [
          site_name.trim(),
          tagline.trim(),
          description?.trim() || null,
          contact_email?.trim() || null,
          phone_number?.trim() || null,
          whatsapp_number?.trim() || null,
          hero_title.trim(),
          hero_subtitle.trim(),
          hero_image_url?.trim() || null,
          generatedWhatsAppUrl,
          youtube_url?.trim() || null,
          facebook_url?.trim() || null,
          instagram_url?.trim() || null,
          x_url?.trim() || null,
          tiktok_url?.trim() || null,
          telegram_url?.trim() || null,
          featured_youtube_video?.trim() || null,
        ]
      );
    }

    /*
     * UPDATE SETTINGS
     */
    else {
      result = await pool.query(
        `UPDATE site_settings
         SET
           site_name = $1,
           tagline = $2,
           description = $3,
           contact_email = $4,
           phone_number = $5,
           whatsapp_number = $6,
           hero_title = $7,
           hero_subtitle = $8,
           hero_image_url = $9,
           whatsapp_url = $10,
           youtube_url = $11,
           facebook_url = $12,
           instagram_url = $13,
           x_url = $14,
           tiktok_url = $15,
           telegram_url = $16,
           featured_youtube_video = $17,
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $18
         RETURNING *`,
        [
          site_name.trim(),
          tagline.trim(),
          description?.trim() || null,
          contact_email?.trim() || null,
          phone_number?.trim() || null,
          whatsapp_number?.trim() || null,
          hero_title.trim(),
          hero_subtitle.trim(),
          hero_image_url?.trim() || null,
          generatedWhatsAppUrl,
          youtube_url?.trim() || null,
          facebook_url?.trim() || null,
          instagram_url?.trim() || null,
          x_url?.trim() || null,
          tiktok_url?.trim() || null,
          telegram_url?.trim() || null,
          featured_youtube_video?.trim() || null,
          existing.rows[0].id,
        ]
      );
    }

    res.json({
      success: true,
      message: "Site settings updated successfully.",
      settings: result.rows[0],
    });
  } catch (error) {
    console.error("Update settings error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update site settings.",
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};