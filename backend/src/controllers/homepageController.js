const pool = require("../config/db");

const DEFAULT_HOMEPAGE_SETTINGS = {
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

const getHomepageSettings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM homepage_settings
       WHERE id = 1
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.json(DEFAULT_HOMEPAGE_SETTINGS);
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Get homepage settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load homepage settings.",
    });
  }
};

const updateHomepageSettings = async (req, res) => {
  try {
    const {
      hero_enabled = true,
      daily_inspiration_enabled = true,
      featured_studies_enabled = true,
      prophecy_enabled = true,
      topics_enabled = true,
      articles_enabled = true,
      featured_video_enabled = true,
      newsletter_enabled = true,
      final_cta_enabled = true,

      featured_studies_limit = 3,
      articles_limit = 3,

      newsletter_title =
        DEFAULT_HOMEPAGE_SETTINGS.newsletter_title,

      newsletter_description =
        DEFAULT_HOMEPAGE_SETTINGS.newsletter_description,

      final_cta_title =
        DEFAULT_HOMEPAGE_SETTINGS.final_cta_title,

      final_cta_description =
        DEFAULT_HOMEPAGE_SETTINGS.final_cta_description,
    } = req.body;

    const studiesLimit = Math.min(
      3,
      Math.max(1, Number(featured_studies_limit) || 3)
    );

    const articlesLimit = Math.min(
      6,
      Math.max(1, Number(articles_limit) || 3)
    );

    const result = await pool.query(
      `INSERT INTO homepage_settings (
        id,
        hero_enabled,
        daily_inspiration_enabled,
        featured_studies_enabled,
        prophecy_enabled,
        topics_enabled,
        articles_enabled,
        featured_video_enabled,
        newsletter_enabled,
        final_cta_enabled,
        featured_studies_limit,
        articles_limit,
        newsletter_title,
        newsletter_description,
        final_cta_title,
        final_cta_description,
        updated_at
      )
      VALUES (
        1,
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (id)
      DO UPDATE SET
        hero_enabled = EXCLUDED.hero_enabled,
        daily_inspiration_enabled =
          EXCLUDED.daily_inspiration_enabled,
        featured_studies_enabled =
          EXCLUDED.featured_studies_enabled,
        prophecy_enabled = EXCLUDED.prophecy_enabled,
        topics_enabled = EXCLUDED.topics_enabled,
        articles_enabled = EXCLUDED.articles_enabled,
        featured_video_enabled =
          EXCLUDED.featured_video_enabled,
        newsletter_enabled =
          EXCLUDED.newsletter_enabled,
        final_cta_enabled =
          EXCLUDED.final_cta_enabled,
        featured_studies_limit =
          EXCLUDED.featured_studies_limit,
        articles_limit =
          EXCLUDED.articles_limit,
        newsletter_title =
          EXCLUDED.newsletter_title,
        newsletter_description =
          EXCLUDED.newsletter_description,
        final_cta_title =
          EXCLUDED.final_cta_title,
        final_cta_description =
          EXCLUDED.final_cta_description,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        Boolean(hero_enabled),
        Boolean(daily_inspiration_enabled),
        Boolean(featured_studies_enabled),
        Boolean(prophecy_enabled),
        Boolean(topics_enabled),
        Boolean(articles_enabled),
        Boolean(featured_video_enabled),
        Boolean(newsletter_enabled),
        Boolean(final_cta_enabled),
        studiesLimit,
        articlesLimit,
        String(newsletter_title).trim(),
        String(newsletter_description).trim(),
        String(final_cta_title).trim(),
        String(final_cta_description).trim(),
      ]
    );

    return res.json({
      success: true,
      message: "Homepage settings updated successfully.",
      settings: result.rows[0],
    });
  } catch (error) {
    console.error("Update homepage settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update homepage settings.",
    });
  }
};

module.exports = {
  getHomepageSettings,
  updateHomepageSettings,
};
