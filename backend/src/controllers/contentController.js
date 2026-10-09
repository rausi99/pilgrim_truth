const pool = require("../config/db");

// =========================================================
// GET ALL ARTICLES
// =========================================================

const getArticles = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        a.title,
        a.slug,
        a.category,
        a.description,
        a.content,
        a.featured_image,
        a.is_featured,
        a.status,
        a.published_at,
        a.created_at,
        a.updated_at,
        u.id AS author_id,
        u.name AS author
      FROM articles a
      LEFT JOIN users u
        ON u.id = a.author_id
      ORDER BY a.created_at DESC
    `);

    res.json({
      success: true,
      articles: result.rows,
    });
  } catch (error) {
    console.error("Get articles error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load articles.",
    });
  }
};


// =========================================================
// GET SINGLE ARTICLE
// =========================================================

const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.title,
        a.slug,
        a.category,
        a.description,
        a.content,
        a.featured_image,
        a.is_featured,
        a.status,
        a.published_at,
        a.created_at,
        a.updated_at,
        u.id AS author_id,
        u.name AS author
      FROM articles a
      LEFT JOIN users u
        ON u.id = a.author_id
      WHERE a.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    res.json({
      success: true,
      article: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get article by ID error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load article.",
    });
  }
};


// =========================================================
// CREATE ARTICLE
// =========================================================

const createArticle = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      description,
      content,
      featured_image,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (
      !title ||
      !slug ||
      !category ||
      !content
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, category, and content are required.",
      });
    }

    const existingArticle =
      await pool.query(
        `
        SELECT id
        FROM articles
        WHERE slug = $1
        `,
        [slug.trim()]
      );

    if (existingArticle.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "An article with this slug already exists.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO articles (
        author_id,
        title,
        slug,
        category,
        description,
        content,
        featured_image,
        is_featured,
        status,
        published_at
      )
      VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,$8,$9,$10
      )
      RETURNING *
      `,
      [
        req.user.id,
        title.trim(),
        slug.trim(),
        category.trim(),
        description?.trim() || null,
        content.trim(),
        featured_image?.trim() || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Article created successfully.",
      article: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create article error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to create article.",
    });
  }
};


// =========================================================
// UPDATE ARTICLE
// =========================================================

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      category,
      description,
      content,
      featured_image,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (
      !title ||
      !slug ||
      !category ||
      !content
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, category, and content are required.",
      });
    }

    const existingArticle =
      await pool.query(
        `
        SELECT id
        FROM articles
        WHERE id = $1
        `,
        [id]
      );

    if (existingArticle.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    const duplicateSlug =
      await pool.query(
        `
        SELECT id
        FROM articles
        WHERE slug = $1
          AND id <> $2
        `,
        [slug.trim(), id]
      );

    if (duplicateSlug.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Another article already uses this slug.",
      });
    }

    const result = await pool.query(
      `
      UPDATE articles
      SET
        title = $1,
        slug = $2,
        category = $3,
        description = $4,
        content = $5,
        featured_image = $6,
        is_featured = $7,
        status = $8,
        published_at = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
      `,
      [
        title.trim(),
        slug.trim(),
        category.trim(),
        description?.trim() || null,
        content.trim(),
        featured_image?.trim() || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
        id,
      ]
    );

    res.json({
      success: true,
      message:
        "Article updated successfully.",
      article: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update article error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update article.",
    });
  }
};


// =========================================================
// GET ALL DAILY INSPIRATIONS
// =========================================================

const getDailyInspirations = async (
  req,
  res
) => {
  try {
    const result = await pool.query(`
      SELECT
        d.id,
        d.title,
        d.inspiration_date,
        d.scripture_reference,
        d.scripture_text,
        d.reflection,
        d.practical_application,
        d.prayer_prompt,
        d.category,
        d.featured_image,
        d.status,
        d.published_at,
        d.created_at,
        d.updated_at,
        u.id AS author_id,
        u.name AS author
      FROM daily_inspirations d
      LEFT JOIN users u
        ON u.id = d.author_id
      ORDER BY d.inspiration_date DESC
    `);

    res.json({
      success: true,
      inspirations: result.rows,
    });
  } catch (error) {
    console.error(
      "Get daily inspirations error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load daily inspirations.",
    });
  }
};


// =========================================================
// CREATE DAILY INSPIRATION
// =========================================================

const createDailyInspiration = async (
  req,
  res
) => {
  try {
    const {
      title,
      inspiration_date,
      scripture_reference,
      scripture_text,
      reflection,
      practical_application,
      prayer_prompt,
      category,
      featured_image,
      status,
      published_at,
    } = req.body;

    if (
      !title ||
      !inspiration_date ||
      !scripture_reference ||
      !reflection
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, date, Scripture reference, and reflection are required.",
      });
    }

    const existing =
      await pool.query(
        `
        SELECT id
        FROM daily_inspirations
        WHERE inspiration_date = $1
        `,
        [inspiration_date]
      );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "A Daily Inspiration already exists for this date.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO daily_inspirations (
        author_id,
        title,
        inspiration_date,
        scripture_reference,
        scripture_text,
        reflection,
        practical_application,
        prayer_prompt,
        category,
        featured_image,
        status,
        published_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12
      )
      RETURNING *
      `,
      [
        req.user.id,
        title.trim(),
        inspiration_date,
        scripture_reference.trim(),
        scripture_text?.trim() || null,
        reflection.trim(),
        practical_application?.trim() || null,
        prayer_prompt?.trim() || null,
        category?.trim() || null,
        featured_image?.trim() || null,
        status || "draft",
        published_at || null,
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Daily Inspiration created successfully.",
      inspiration: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create daily inspiration error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to create Daily Inspiration.",
    });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const existingArticle = await pool.query(
      `
      SELECT id
      FROM articles
      WHERE id = $1
      `,
      [id]
    );

    if (existingArticle.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    await pool.query(
      `
      DELETE FROM articles
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Article deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete article error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete article.",
    });
  }
};

// =========================================================
// UPDATE DAILY INSPIRATION
// =========================================================

const updateDailyInspiration = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      inspiration_date,
      scripture_reference,
      scripture_text,
      reflection,
      practical_application,
      prayer_prompt,
      category,
      featured_image,
      status,
      published_at,
    } = req.body;

    if (
      !title ||
      !inspiration_date ||
      !scripture_reference ||
      !reflection
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, date, Scripture reference, and reflection are required.",
      });
    }

    const existing = await pool.query(
      `
      SELECT id
      FROM daily_inspirations
      WHERE id = $1
      `,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Daily Inspiration not found.",
      });
    }

    const duplicateDate = await pool.query(
      `
      SELECT id
      FROM daily_inspirations
      WHERE inspiration_date = $1
        AND id <> $2
      `,
      [inspiration_date, id]
    );

    if (duplicateDate.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Another Daily Inspiration already uses this date.",
      });
    }

    const result = await pool.query(
      `
      UPDATE daily_inspirations
      SET
        title = $1,
        inspiration_date = $2,
        scripture_reference = $3,
        scripture_text = $4,
        reflection = $5,
        practical_application = $6,
        prayer_prompt = $7,
        category = $8,
        featured_image = $9,
        status = $10,
        published_at = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
      `,
      [
        title.trim(),
        inspiration_date,
        scripture_reference.trim(),
        scripture_text?.trim() || null,
        reflection.trim(),
        practical_application?.trim() || null,
        prayer_prompt?.trim() || null,
        category?.trim() || null,
        featured_image?.trim() || null,
        status || "draft",
        published_at || null,
        id,
      ]
    );

    res.json({
      success: true,
      message:
        "Daily Inspiration updated successfully.",
      inspiration: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update daily inspiration error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update Daily Inspiration.",
    });
  }
};


// =========================================================
// DELETE DAILY INSPIRATION
// =========================================================

const deleteDailyInspiration = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      `
      SELECT id
      FROM daily_inspirations
      WHERE id = $1
      `,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Daily Inspiration not found.",
      });
    }

    await pool.query(
      `
      DELETE FROM daily_inspirations
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      success: true,
      message:
        "Daily Inspiration deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete daily inspiration error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete Daily Inspiration.",
    });
  }
};

const getBibleStudies = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.id,
        b.title,
        b.slug,
        b.category,
        b.description,
        b.scripture_reference,
        b.content,
        b.featured_image,
        b.is_featured,
        b.status,
        b.published_at,
        b.created_at,
        b.updated_at,
        u.id AS author_id,
        u.name AS author
      FROM bible_studies b
      LEFT JOIN users u
        ON u.id = b.author_id
      ORDER BY b.created_at DESC
    `);

    res.json({
      success: true,
      studies: result.rows,
    });
  } catch (error) {
    console.error("Get Bible Studies error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load Bible Studies.",
    });
  }
};


const getBibleStudyById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        b.id,
        b.title,
        b.slug,
        b.category,
        b.description,
        b.scripture_reference,
        b.content,
        b.featured_image,
        b.is_featured,
        b.status,
        b.published_at,
        b.created_at,
        b.updated_at,
        u.id AS author_id,
        u.name AS author
      FROM bible_studies b
      LEFT JOIN users u
        ON u.id = b.author_id
      WHERE b.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bible Study not found.",
      });
    }

    res.json({
      success: true,
      study: result.rows[0],
    });
  } catch (error) {
    console.error("Get Bible Study error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load Bible Study.",
    });
  }
};

const getPublicBibleStudies = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.id,
        b.title,
        b.slug,
        b.category,
        b.description,
        b.scripture_reference,
        b.featured_image,
        b.is_featured,
        b.published_at,
        u.name AS author
      FROM bible_studies b
      LEFT JOIN users u
        ON u.id = b.author_id
      WHERE b.status = 'published'
        AND (
          b.published_at IS NULL
          OR b.published_at <= NOW()
        )
      ORDER BY
        b.is_featured DESC,
        b.published_at DESC NULLS LAST,
        b.created_at DESC
    `);

    res.json({
      success: true,
      studies: result.rows,
    });
  } catch (error) {
    console.error("Get public Bible Studies error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load Bible Studies.",
    });
  }
};

const getPublicBibleStudyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        b.id,
        b.title,
        b.slug,
        b.category,
        b.description,
        b.scripture_reference,
        b.content,
        b.featured_image,
        b.is_featured,
        b.published_at,
        b.created_at,
        u.id AS author_id,
        u.name AS author
      FROM bible_studies b
      LEFT JOIN users u
        ON u.id = b.author_id
      WHERE b.slug = $1
        AND b.status = 'published'
        AND (
          b.published_at IS NULL
          OR b.published_at <= NOW()
        )
      LIMIT 1
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bible Study not found.",
      });
    }

    res.json({
      success: true,
      study: result.rows[0],
    });
  } catch (error) {
    console.error("Get public Bible Study by slug error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load Bible Study.",
    });
  }
};


const createBibleStudy = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      description,
      scripture_reference,
      content,
      featured_image,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (!title || !slug || !category || !content) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, category, and content are required.",
      });
    }

    const existing = await pool.query(
      `
      SELECT id
      FROM bible_studies
      WHERE slug = $1
      `,
      [slug.trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A Bible Study with this slug already exists.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO bible_studies (
        author_id,
        title,
        slug,
        category,
        description,
        scripture_reference,
        content,
        featured_image,
        is_featured,
        status,
        published_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
      )
      RETURNING *
      `,
      [
        req.user.id,
        title.trim(),
        slug.trim(),
        category.trim(),
        description?.trim() || null,
        scripture_reference?.trim() || null,
        content.trim(),
        featured_image?.trim() || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Bible Study created successfully.",
      study: result.rows[0],
    });
  } catch (error) {
    console.error("Create Bible Study error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create Bible Study.",
    });
  }
};


const updateBibleStudy = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      category,
      description,
      scripture_reference,
      content,
      featured_image,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (!title || !slug || !category || !content) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, category, and content are required.",
      });
    }

    const existing = await pool.query(
      `
      SELECT id
      FROM bible_studies
      WHERE id = $1
      `,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bible Study not found.",
      });
    }

    const duplicateSlug = await pool.query(
      `
      SELECT id
      FROM bible_studies
      WHERE slug = $1
        AND id <> $2
      `,
      [slug.trim(), id]
    );

    if (duplicateSlug.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Another Bible Study already uses this slug.",
      });
    }

    const result = await pool.query(
      `
      UPDATE bible_studies
      SET
        title = $1,
        slug = $2,
        category = $3,
        description = $4,
        scripture_reference = $5,
        content = $6,
        featured_image = $7,
        is_featured = $8,
        status = $9,
        published_at = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
      `,
      [
        title.trim(),
        slug.trim(),
        category.trim(),
        description?.trim() || null,
        scripture_reference?.trim() || null,
        content.trim(),
        featured_image?.trim() || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Bible Study updated successfully.",
      study: result.rows[0],
    });
  } catch (error) {
    console.error("Update Bible Study error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update Bible Study.",
    });
  }
};


const deleteBibleStudy = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      `
      SELECT id
      FROM bible_studies
      WHERE id = $1
      `,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bible Study not found.",
      });
    }

    await pool.query(
      `
      DELETE FROM bible_studies
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Bible Study deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Bible Study error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete Bible Study.",
    });
  }
};

// =========================
// PROPHECY
// =========================

const getProphecies = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.title,
        p.slug,
        p.category,
        p.description,
        p.scripture_reference,
        p.content,
        p.featured_image,
        p.is_featured,
        p.status,
        p.published_at,
        p.created_at,
        p.updated_at,
        p.author_id,
        u.name AS author
      FROM prophecies p
      LEFT JOIN users u
        ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      prophecies: result.rows,
    });
  } catch (error) {
    console.error("Get prophecies error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load prophecies.",
    });
  }
};


// PUBLIC PROPHECY

const getPublicProphecies = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.title,
        p.slug,
        p.category,
        p.description,
        p.scripture_reference,
        p.featured_image,
        p.is_featured,
        p.published_at,
        u.name AS author
      FROM prophecies p
      LEFT JOIN users u
        ON u.id = p.author_id
      WHERE p.status = 'published'
        AND (
          p.published_at IS NULL
          OR p.published_at <= NOW()
        )
      ORDER BY
        p.is_featured DESC,
        p.published_at DESC NULLS LAST,
        p.created_at DESC
    `);

    res.json({
      success: true,
      prophecies: result.rows,
    });
  } catch (error) {
    console.error(
      "Get public Prophecies error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load prophecy studies.",
    });
  }
};

const getPublicProphecyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.category,
        p.description,
        p.scripture_reference,
        p.content,
        p.featured_image,
        p.is_featured,
        p.published_at,
        p.created_at,
        u.id AS author_id,
        u.name AS author
      FROM prophecies p
      LEFT JOIN users u
        ON u.id = p.author_id
      WHERE p.slug = $1
        AND p.status = 'published'
        AND (
          p.published_at IS NULL
          OR p.published_at <= NOW()
        )
      LIMIT 1
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Prophecy study not found.",
      });
    }

    res.json({
      success: true,
      prophecy: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get public Prophecy by slug error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load prophecy study.",
    });
  }
};

const getProphecyById = async (req, res) => {
  try {
    const prophecyId = Number(req.params.id);

    if (!Number.isInteger(prophecyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prophecy ID.",
      });
    }

    const result = await pool.query(
      `
        SELECT
          p.id,
          p.title,
          p.slug,
          p.category,
          p.description,
          p.scripture_reference,
          p.content,
          p.featured_image,
          p.is_featured,
          p.status,
          p.published_at,
          p.created_at,
          p.updated_at,
          p.author_id,
          u.name AS author
        FROM prophecies p
        LEFT JOIN users u
          ON p.author_id = u.id
        WHERE p.id = $1
      `,
      [prophecyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Prophecy not found.",
      });
    }

    res.json({
      success: true,
      prophecy: result.rows[0],
    });
  } catch (error) {
    console.error("Get prophecy error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load prophecy.",
    });
  }
};


const createProphecy = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      description,
      scripture_reference,
      content,
      featured_image,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (!title || !slug || !category || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, category, and content are required.",
      });
    }

    const existingProphecy = await pool.query(
      `
        SELECT id
        FROM prophecies
        WHERE slug = $1
      `,
      [slug]
    );

    if (existingProphecy.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A prophecy with this slug already exists.",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO prophecies (
          author_id,
          title,
          slug,
          category,
          description,
          scripture_reference,
          content,
          featured_image,
          is_featured,
          status,
          published_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11
        )
        RETURNING *
      `,
      [
        req.user.id,
        title,
        slug,
        category,
        description || null,
        scripture_reference || null,
        content,
        featured_image || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Prophecy created successfully.",
      prophecy: result.rows[0],
    });
  } catch (error) {
    console.error("Create prophecy error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create prophecy.",
    });
  }
};


const updateProphecy = async (req, res) => {
  try {
    const prophecyId = Number(req.params.id);

    if (!Number.isInteger(prophecyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prophecy ID.",
      });
    }

    const {
      title,
      slug,
      category,
      description,
      scripture_reference,
      content,
      featured_image,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (!title || !slug || !category || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, category, and content are required.",
      });
    }

    const existingProphecy = await pool.query(
      `
        SELECT id
        FROM prophecies
        WHERE slug = $1
          AND id <> $2
      `,
      [slug, prophecyId]
    );

    if (existingProphecy.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A prophecy with this slug already exists.",
      });
    }

    const result = await pool.query(
      `
        UPDATE prophecies
        SET
          title = $1,
          slug = $2,
          category = $3,
          description = $4,
          scripture_reference = $5,
          content = $6,
          featured_image = $7,
          is_featured = $8,
          status = $9,
          published_at = $10,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $11
        RETURNING *
      `,
      [
        title,
        slug,
        category,
        description || null,
        scripture_reference || null,
        content,
        featured_image || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
        prophecyId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Prophecy not found.",
      });
    }

    res.json({
      success: true,
      message: "Prophecy updated successfully.",
      prophecy: result.rows[0],
    });
  } catch (error) {
    console.error("Update prophecy error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update prophecy.",
    });
  }
};


const deleteProphecy = async (req, res) => {
  try {
    const prophecyId = Number(req.params.id);

    if (!Number.isInteger(prophecyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prophecy ID.",
      });
    }

    const result = await pool.query(
      `
        DELETE FROM prophecies
        WHERE id = $1
        RETURNING id
      `,
      [prophecyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Prophecy not found.",
      });
    }

    res.json({
      success: true,
      message: "Prophecy deleted successfully.",
    });
  } catch (error) {
    console.error("Delete prophecy error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete prophecy.",
    });
  }
};


// =========================================================
// VIDEOS
// =========================================================

// GET ALL VIDEOS
const getVideos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.id,
        v.title,
        v.slug,
        v.category,
        v.description,
        v.youtube_url,
        v.youtube_id,
        v.duration,
        v.thumbnail_url,
        v.is_featured,
        v.status,
        v.published_at,
        v.created_at,
        v.updated_at,
        v.author_id,
        u.name AS author
      FROM videos v
      LEFT JOIN users u
        ON v.author_id = u.id
      ORDER BY v.created_at DESC
    `);

    res.json({
      success: true,
      videos: result.rows,
    });
  } catch (error) {
    console.error("Get videos error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load videos.",
    });
  }
};


// GET FEATURED PUBLIC VIDEO
const getFeaturedVideo = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.id,
        v.title,
        v.slug,
        v.category,
        v.description,
        v.youtube_url,
        v.youtube_id,
        v.duration,
        v.thumbnail_url,
        v.is_featured,
        v.status,
        v.published_at,
        v.created_at,
        u.name AS author
      FROM videos v
      LEFT JOIN users u
        ON v.author_id = u.id
      WHERE v.is_featured = TRUE
        AND v.status = 'published'
        AND (
          v.published_at IS NULL
          OR v.published_at <= CURRENT_TIMESTAMP
        )
      ORDER BY
        v.published_at DESC NULLS LAST,
        v.created_at DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No featured video is currently available.",
      });
    }

    res.json({
      success: true,
      video: result.rows[0],
    });
  } catch (error) {
    console.error("Get featured video error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load featured video.",
    });
  }
};

// =========================================================
// PUBLIC VIDEOS
// =========================================================

// GET ALL PUBLIC VIDEOS

const getPublicVideos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.id,
        v.title,
        v.slug,
        v.category,
        v.description,
        v.youtube_url,
        v.youtube_id,
        v.duration,
        v.thumbnail_url,
        v.is_featured,
        v.published_at,
        v.created_at,
        u.name AS author
      FROM videos v
      LEFT JOIN users u
        ON v.author_id = u.id
      WHERE v.status = 'published'
      ORDER BY
        v.is_featured DESC,
        v.published_at DESC NULLS LAST,
        v.created_at DESC
    `);

    res.json({
      success: true,
      videos: result.rows,
    });
  } catch (error) {
    console.error("Get public videos error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load videos.",
    });
  }
};


// GET PUBLIC VIDEO BY SLUG
const getPublicVideoBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        v.id,
        v.title,
        v.slug,
        v.category,
        v.description,
        v.youtube_url,
        v.youtube_id,
        v.duration,
        v.thumbnail_url,
        v.is_featured,
        v.published_at,
        v.created_at,
        v.author_id,
        u.name AS author
      FROM videos v
      LEFT JOIN users u
        ON v.author_id = u.id
      WHERE v.slug = $1
        AND v.status = 'published'
        AND (
          v.published_at IS NULL
          OR v.published_at <= CURRENT_TIMESTAMP
        )
      LIMIT 1
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    res.json({
      success: true,
      video: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get public video by slug error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load video.",
    });
  }
};

// GET SINGLE VIDEO
const getVideoById = async (req, res) => {
  try {
    const videoId = Number(req.params.id);

    if (!Number.isInteger(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        v.id,
        v.title,
        v.slug,
        v.category,
        v.description,
        v.youtube_url,
        v.youtube_id,
        v.duration,
        v.thumbnail_url,
        v.is_featured,
        v.status,
        v.published_at,
        v.created_at,
        v.updated_at,
        v.author_id,
        u.name AS author
      FROM videos v
      LEFT JOIN users u
        ON v.author_id = u.id
      WHERE v.id = $1
      `,
      [videoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    res.json({
      success: true,
      video: result.rows[0],
    });
  } catch (error) {
    console.error("Get video error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load video.",
    });
  }
};


// CREATE VIDEO
const createVideo = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      description,
      youtube_url,
      youtube_id,
      duration,
      thumbnail_url,
      is_featured,
      status,
      published_at,
    } = req.body;





    if (!title || !slug || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, and category are required.",
      });
    }

    const existingVideo = await pool.query(
      `
      SELECT id
      FROM videos
      WHERE slug = $1
      `,
      [slug.trim()]
    );

    if (existingVideo.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "A video with this slug already exists.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO videos (
        author_id,
        title,
        slug,
        category,
        description,
        youtube_url,
        youtube_id,
        duration,
        thumbnail_url,
        is_featured,
        status,
        published_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12
      )
      RETURNING *
      `,
      [
        req.user.id,
        title.trim(),
        slug.trim(),
        category.trim(),
        description?.trim() || null,
        youtube_url?.trim() || null,
        youtube_id?.trim() || null,
        duration?.trim() || null,
        thumbnail_url?.trim() || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Video created successfully.",
      video: result.rows[0],
    });
  } catch (error) {
    console.error("Create video error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create video.",
    });
  }
};


// UPDATE VIDEO
const updateVideo = async (req, res) => {
  try {
    const videoId = Number(req.params.id);

    if (!Number.isInteger(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID.",
      });
    }

    const {
      title,
      slug,
      category,
      description,
      youtube_url,
      youtube_id,
      duration,
      thumbnail_url,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (!title || !slug || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, and category are required.",
      });
    }

    const existingVideo = await pool.query(
      `
      SELECT id
      FROM videos
      WHERE id = $1
      `,
      [videoId]
    );

    if (existingVideo.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    const duplicateSlug = await pool.query(
      `
      SELECT id
      FROM videos
      WHERE slug = $1
        AND id <> $2
      `,
      [slug.trim(), videoId]
    );

    if (duplicateSlug.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Another video already uses this slug.",
      });
    }

    const result = await pool.query(
      `
      UPDATE videos
      SET
        title = $1,
        slug = $2,
        category = $3,
        description = $4,
        youtube_url = $5,
        youtube_id = $6,
        duration = $7,
        thumbnail_url = $8,
        is_featured = $9,
        status = $10,
        published_at = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
      `,
      [
        title.trim(),
        slug.trim(),
        category.trim(),
        description?.trim() || null,
        youtube_url?.trim() || null,
        youtube_id?.trim() || null,
        duration?.trim() || null,
        thumbnail_url?.trim() || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
        videoId,
      ]
    );

    res.json({
      success: true,
      message: "Video updated successfully.",
      video: result.rows[0],
    });
  } catch (error) {
    console.error("Update video error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update video.",
    });
  }
};


// DELETE VIDEO
const deleteVideo = async (req, res) => {
  try {
    const videoId = Number(req.params.id);

    if (!Number.isInteger(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID.",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM videos
      WHERE id = $1
      RETURNING id
      `,
      [videoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    res.json({
      success: true,
      message: "Video deleted successfully.",
    });
  } catch (error) {
    console.error("Delete video error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete video.",
    });
  }
};

// =========================================================
// YOUTUBE METADATA
// =========================================================

const extractYouTubeVideoId = (url) => {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    const hostname = parsedUrl.hostname
      .toLowerCase()
      .replace("www.", "");

    // youtube.com/watch?v=VIDEO_ID
    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return videoId;
      }

      // youtube.com/embed/VIDEO_ID
      const embedMatch = parsedUrl.pathname.match(
        /\/embed\/([^/]+)/
      );

      if (embedMatch) {
        return embedMatch[1];
      }

      // youtube.com/shorts/VIDEO_ID
      const shortsMatch = parsedUrl.pathname.match(
        /\/shorts\/([^/]+)/
      );

      if (shortsMatch) {
        return shortsMatch[1];
      }
    }

    // youtu.be/VIDEO_ID
    if (hostname === "youtu.be") {
      const videoId = parsedUrl.pathname
        .replace("/", "")
        .split("/")[0];

      if (videoId) {
        return videoId;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};

const formatYouTubeDuration = (isoDuration) => {
  if (!isoDuration) {
    return null;
  }

  const match = isoDuration.match(
    /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  );

  if (!match) {
    return null;
  }

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);

  if (hours > 0) {
    return [
      hours,
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ].join(":");
  }

  return [
    minutes,
    String(seconds).padStart(2, "0"),
  ].join(":");
};

const getYouTubeMetadata = async (req, res) => {
  try {
    const { url, videoId } = req.query;

    const extractedVideoId =
      videoId?.trim() ||
      extractYouTubeVideoId(url?.trim());

    if (!extractedVideoId) {
      return res.status(400).json({
        success: false,
        message:
          "A valid YouTube URL or video ID is required.",
      });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          "YouTube API key is not configured.",
      });
    }

    const apiUrl =
      "https://www.googleapis.com/youtube/v3/videos" +
      `?part=snippet,contentDetails&id=${encodeURIComponent(
        extractedVideoId
      )}&key=${encodeURIComponent(
        process.env.YOUTUBE_API_KEY
      )}`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "YouTube API error:",
        data
      );

      return res.status(502).json({
        success: false,
        message:
          data?.error?.message ||
          "Unable to retrieve YouTube video information.",
      });
    }

    if (
      !data.items ||
      data.items.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "YouTube video could not be found.",
      });
    }

    const video = data.items[0];

    const snippet = video.snippet || {};
    const contentDetails =
      video.contentDetails || {};

    const thumbnails =
      snippet.thumbnails || {};

    const thumbnail =
      thumbnails.maxres?.url ||
      thumbnails.standard?.url ||
      thumbnails.high?.url ||
      thumbnails.medium?.url ||
      thumbnails.default?.url ||
      null;

    const duration = formatYouTubeDuration(
      contentDetails.duration
    );

    res.json({
      success: true,

      video: {
        youtube_id: extractedVideoId,
        title: snippet.title || "",
        description:
          snippet.description || "",
        thumbnail_url: thumbnail,
        duration,
        channel_title:
          snippet.channelTitle || "",
        published_at:
          snippet.publishedAt || null,
      },
    });
  } catch (error) {
    console.error(
      "YouTube metadata error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to retrieve YouTube metadata.",
    });
  }
};

// =========================================================
// RESOURCES
// =========================================================

// GET ALL RESOURCES
const getResources = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id,
        r.title,
        r.slug,
        r.category,
        r.description,
        r.file_url,
        r.thumbnail_url,
        r.file_type,
        r.file_size,
        r.is_featured,
        r.status,
        r.published_at,
        r.download_count,
        r.created_at,
        r.updated_at,
        r.author_id,
        u.name AS author
      FROM resources r
      LEFT JOIN users u
        ON r.author_id = u.id
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      resources: result.rows,
    });
  } catch (error) {
    console.error(
      "Get resources error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load resources.",
    });
  }
};

const getPublicResources = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id,
        r.title,
        r.slug,
        r.category,
        r.description,
        r.file_url,
        r.thumbnail_url,
        r.file_type,
        r.file_size,
        r.is_featured,
        r.published_at,
        r.download_count,
        r.created_at,
        u.name AS author
      FROM resources r
      LEFT JOIN users u ON r.author_id = u.id
      WHERE LOWER(r.status) = 'published'
      ORDER BY r.is_featured DESC, r.published_at DESC NULLS LAST, r.created_at DESC
    `);

    res.json({
      success: true,
      resources: result.rows,
    });
  } catch (error) {
    console.error("Get public resources error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load resources.",
    });
  }
};


// GET SINGLE RESOURCE
const getResourceById = async (req, res) => {
  try {
    const resourceId = Number(req.params.id);

    if (!Number.isInteger(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        r.id,
        r.title,
        r.slug,
        r.category,
        r.description,
        r.file_url,
        r.thumbnail_url,
        r.file_type,
        r.file_size,
        r.is_featured,
        r.status,
        r.published_at,
        r.download_count,
        r.created_at,
        r.updated_at,
        r.author_id,
        u.name AS author
      FROM resources r
      LEFT JOIN users u
        ON r.author_id = u.id
      WHERE r.id = $1
      `,
      [resourceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    res.json({
      success: true,
      resource: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get resource error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load resource.",
    });
  }
};

// CREATE RESOURCE
const createResource = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      description,
      file_url,
      thumbnail_url,
      file_type,
      file_size,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (
      !title ||
      !slug ||
      !category ||
      !file_url
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, category, and file URL are required.",
      });
    }

    const existingResource =
      await pool.query(
        `
        SELECT id
        FROM resources
        WHERE slug = $1
        `,
        [slug.trim()]
      );

    if (
      existingResource.rows.length > 0
    ) {
      return res.status(409).json({
        success: false,
        message:
          "A resource with this slug already exists.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO resources (
        author_id,
        title,
        slug,
        category,
        description,
        file_url,
        thumbnail_url,
        file_type,
        file_size,
        is_featured,
        status,
        published_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12
      )
      RETURNING *
      `,
      [
        req.user.id,
        title.trim(),
        slug.trim(),
        category.trim(),
        description?.trim() || null,
        file_url.trim(),
        thumbnail_url?.trim() || null,
        file_type?.trim() || "PDF",
        file_size?.trim() || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Resource created successfully.",
      resource: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create resource error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to create resource.",
    });
  }
};

// UPDATE RESOURCE
const updateResource = async (req, res) => {
  try {
    const resourceId = Number(
      req.params.id
    );

    if (!Number.isInteger(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID.",
      });
    }

    const {
      title,
      slug,
      category,
      description,
      file_url,
      thumbnail_url,
      file_type,
      file_size,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (
      !title ||
      !slug ||
      !category ||
      !file_url
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, category, and file URL are required.",
      });
    }

    const existingResource =
      await pool.query(
        `
        SELECT id
        FROM resources
        WHERE id = $1
        `,
        [resourceId]
      );

    if (
      existingResource.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    const duplicateSlug =
      await pool.query(
        `
        SELECT id
        FROM resources
        WHERE slug = $1
          AND id <> $2
        `,
        [slug.trim(), resourceId]
      );

    if (duplicateSlug.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Another resource already uses this slug.",
      });
    }

    const result = await pool.query(
      `
      UPDATE resources
      SET
        title = $1,
        slug = $2,
        category = $3,
        description = $4,
        file_url = $5,
        thumbnail_url = $6,
        file_type = $7,
        file_size = $8,
        is_featured = $9,
        status = $10,
        published_at = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
      `,
      [
        title.trim(),
        slug.trim(),
        category.trim(),
        description?.trim() || null,
        file_url.trim(),
        thumbnail_url?.trim() || null,
        file_type?.trim() || "PDF",
        file_size?.trim() || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
        resourceId,
      ]
    );

    res.json({
      success: true,
      message:
        "Resource updated successfully.",
      resource: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update resource error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update resource.",
    });
  }
};

// DELETE RESOURCE
const deleteResource = async (req, res) => {
  try {
    const resourceId = Number(
      req.params.id
    );

    if (!Number.isInteger(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID.",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM resources
      WHERE id = $1
      RETURNING id
      `,
      [resourceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Resource deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete resource error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete resource.",
    });
  }
};


// =========================================================
// RESOURCE FILE UPLOAD
// =========================================================

const uploadResourceFile = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a resource file.",
      });
    }

    const path = require("path");

    const extension = path
      .extname(req.file.originalname)
      .toLowerCase();

    const typeMap = {
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

    const fileType =
      typeMap[extension] || "FILE";

    const fileSizeBytes =
      req.file.size;

    const fileSizeMB =
      fileSizeBytes /
      (1024 * 1024);

    const formattedFileSize =
      fileSizeMB >= 1
        ? `${fileSizeMB.toFixed(2)} MB`
        : `${(
          fileSizeBytes / 1024
        ).toFixed(2)} KB`;

    const fileUrl =
      `/uploads/resources/${req.file.filename}`;

    res.status(201).json({
      success: true,

      message:
        "Resource file uploaded successfully.",

      file: {
        original_name:
          req.file.originalname,

        filename:
          req.file.filename,

        file_url:
          fileUrl,

        file_type:
          fileType,

        file_size:
          formattedFileSize,

        file_size_bytes:
          fileSizeBytes,

        mime_type:
          req.file.mimetype,

        extension:
          extension,
      },
    });
  } catch (error) {
    console.error(
      "Resource upload error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to upload resource file.",
    });
  }
};


// =========================================================
// PUBLIC ARTICLES
// =========================================================

const getPublicArticles = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        a.title,
        a.slug,
        a.category,
        a.description,
        a.content,
        a.featured_image,
        a.is_featured,
        a.published_at,
        a.created_at,
        u.name AS author
      FROM articles a
      LEFT JOIN users u
        ON u.id = a.author_id
      WHERE a.status = 'published'
        AND (
          a.published_at IS NULL
          OR a.published_at <= CURRENT_TIMESTAMP
        )
      ORDER BY
        a.is_featured DESC,
        a.published_at DESC NULLS LAST,
        a.created_at DESC
    `);

    res.json({
      success: true,
      articles: result.rows,
    });
  } catch (error) {
    console.error("Get public articles error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch articles.",
    });
  }
};


const getPublicArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.title,
        a.slug,
        a.category,
        a.description,
        a.content,
        a.featured_image,
        a.is_featured,
        a.published_at,
        a.created_at,
        u.name AS author
      FROM articles a
      LEFT JOIN users u
        ON u.id = a.author_id
      WHERE a.slug = $1
        AND a.status = 'published'
        AND (
          a.published_at IS NULL
          OR a.published_at <= CURRENT_TIMESTAMP
        )
      LIMIT 1
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    res.json({
      success: true,
      article: result.rows[0],
    });
  } catch (error) {
    console.error("Get public article error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch article.",
    });
  }
};

// =========================================================
// IMAGE UPLOAD
// =========================================================

const uploadArticleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image to upload.",
      });
    }

    const imageUrl = `/uploads/images/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      imageUrl,
    });
  } catch (error) {
    console.error("Upload article image error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload image.",
    });
  }
};

// =========================================================
// PUBLIC DAILY INSPIRATIONS
// =========================================================

const getPublicDailyInspirations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        d.id,
        d.title,
        d.inspiration_date,
        d.scripture_reference,
        d.scripture_text,
        d.reflection,
        d.practical_application,
        d.prayer_prompt,
        d.category,
        d.featured_image,
        d.published_at,
        u.name AS author
      FROM daily_inspirations d
      LEFT JOIN users u
        ON u.id = d.author_id
      WHERE d.status = 'published'
        AND (
          d.published_at IS NULL
          OR d.published_at <= CURRENT_TIMESTAMP
        )
      ORDER BY d.inspiration_date DESC
    `);

    res.json({
      success: true,
      inspirations: result.rows,
    });
  } catch (error) {
    console.error(
      "Get public daily inspirations error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load daily inspirations.",
    });
  }
};


// =========================================================
// PUBLIC TODAY'S DAILY INSPIRATION
// =========================================================

const getPublicTodayInspiration = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        d.id,
        d.title,
        d.inspiration_date,
        d.scripture_reference,
        d.scripture_text,
        d.reflection,
        d.practical_application,
        d.prayer_prompt,
        d.category,
        d.featured_image,
        d.published_at,
        u.name AS author
      FROM daily_inspirations d
      LEFT JOIN users u
        ON u.id = d.author_id
      WHERE d.inspiration_date = CURRENT_DATE
        AND d.status = 'published'
        AND (
          d.published_at IS NULL
          OR d.published_at <= CURRENT_TIMESTAMP
        )
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No Daily Inspiration is available for today.",
      });
    }

    res.json({
      success: true,
      inspiration: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get today's daily inspiration error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load today's Daily Inspiration.",
    });
  }
};


// =========================================================
// PUBLIC DAILY INSPIRATION BY DATE
// =========================================================

const getPublicDailyInspirationByDate = async (req, res) => {
  try {
    const { date } = req.params;

    // Validate YYYY-MM-DD format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        d.id,
        d.title,
        d.inspiration_date,
        d.scripture_reference,
        d.scripture_text,
        d.reflection,
        d.practical_application,
        d.prayer_prompt,
        d.category,
        d.featured_image,
        TO_CHAR(d.inspiration_date, 'YYYY-MM-DD') AS inspiration_date,
        u.name AS author
      FROM daily_inspirations d
      LEFT JOIN users u
        ON u.id = d.author_id
      WHERE d.inspiration_date = $1
        AND d.status = 'published'
        AND (
          d.published_at IS NULL
          OR d.published_at <= CURRENT_TIMESTAMP
        )
      LIMIT 1
      `,
      [date]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Daily Inspiration not found.",
      });
    }

    res.json({
      success: true,
      inspiration: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get public daily inspiration by date error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load Daily Inspiration.",
    });
  }
};

// =========================================================
// HISTORY
// =========================================================

// GET ALL HISTORIES
const getHistories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        h.id,
        h.title,
        h.slug,
        h.category,
        h.description,
        h.scripture_reference,
        h.content,
        h.featured_image,
        h.is_featured,
        h.status,
        h.published_at,
        h.created_at,
        h.updated_at,
        h.author_id,
        u.name AS author
      FROM histories h
      LEFT JOIN users u
        ON h.author_id = u.id
      ORDER BY h.created_at DESC
    `);

    res.json({
      success: true,
      histories: result.rows,
    });
  } catch (error) {
    console.error("Get histories error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load histories.",
    });
  }
};


// GET SINGLE HISTORY
const getHistoryById = async (req, res) => {
  try {
    const historyId = Number(req.params.id);

    if (!Number.isInteger(historyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid history ID.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        h.id,
        h.title,
        h.slug,
        h.category,
        h.description,
        h.scripture_reference,
        h.content,
        h.featured_image,
        h.is_featured,
        h.status,
        h.published_at,
        h.created_at,
        h.updated_at,
        h.author_id,
        u.name AS author
      FROM histories h
      LEFT JOIN users u
        ON h.author_id = u.id
      WHERE h.id = $1
      `,
      [historyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "History not found.",
      });
    }

    res.json({
      success: true,
      history: result.rows[0],
    });
  } catch (error) {
    console.error("Get history error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load history.",
    });
  }
};


// GET PUBLIC HISTORIES
const getPublicHistories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        h.id,
        h.title,
        h.slug,
        h.category,
        h.description,
        h.scripture_reference,
        h.featured_image,
        h.is_featured,
        h.published_at,
        h.created_at,
        u.name AS author
      FROM histories h
      LEFT JOIN users u
        ON h.author_id = u.id
      WHERE h.status = 'published'
        AND (
          h.published_at IS NULL
          OR h.published_at <= CURRENT_TIMESTAMP
        )
      ORDER BY
        h.is_featured DESC,
        h.published_at DESC NULLS LAST,
        h.created_at DESC
    `);

    res.json({
      success: true,
      histories: result.rows,
    });
  } catch (error) {
    console.error("Get public histories error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load public histories.",
    });
  }
};


// GET PUBLIC HISTORY BY SLUG
const getPublicHistoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        h.id,
        h.title,
        h.slug,
        h.category,
        h.description,
        h.scripture_reference,
        h.content,
        h.featured_image,
        h.is_featured,
        h.published_at,
        h.created_at,
        h.author_id,
        u.name AS author
      FROM histories h
      LEFT JOIN users u
        ON h.author_id = u.id
      WHERE h.slug = $1
        AND h.status = 'published'
        AND (
          h.published_at IS NULL
          OR h.published_at <= CURRENT_TIMESTAMP
        )
      LIMIT 1
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "History study not found.",
      });
    }

    res.json({
      success: true,
      history: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get public history by slug error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load history study.",
    });
  }
};


// CREATE HISTORY
const createHistory = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      description,
      scripture_reference,
      content,
      featured_image,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (!title || !slug || !category || !content) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, category, and content are required.",
      });
    }

    const existingHistory = await pool.query(
      `
      SELECT id
      FROM histories
      WHERE slug = $1
      `,
      [slug.trim()]
    );

    if (existingHistory.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "A History study with this slug already exists.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO histories (
        author_id,
        title,
        slug,
        category,
        description,
        scripture_reference,
        content,
        featured_image,
        is_featured,
        status,
        published_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11
      )
      RETURNING *
      `,
      [
        req.user.id,
        title.trim(),
        slug.trim(),
        category.trim(),
        description?.trim() || null,
        scripture_reference?.trim() || null,
        content.trim(),
        featured_image?.trim() || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "History study created successfully.",
      history: result.rows[0],
    });
  } catch (error) {
    console.error("Create history error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create history study.",
    });
  }
};


// UPDATE HISTORY
const updateHistory = async (req, res) => {
  try {
    const historyId = Number(req.params.id);

    if (!Number.isInteger(historyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid history ID.",
      });
    }

    const {
      title,
      slug,
      category,
      description,
      scripture_reference,
      content,
      featured_image,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (!title || !slug || !category || !content) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, category, and content are required.",
      });
    }

    const existingHistory = await pool.query(
      `
      SELECT id
      FROM histories
      WHERE id = $1
      `,
      [historyId]
    );

    if (existingHistory.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "History study not found.",
      });
    }

    const duplicateSlug = await pool.query(
      `
      SELECT id
      FROM histories
      WHERE slug = $1
        AND id <> $2
      `,
      [slug.trim(), historyId]
    );

    if (duplicateSlug.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Another History study already uses this slug.",
      });
    }

    const result = await pool.query(
      `
      UPDATE histories
      SET
        title = $1,
        slug = $2,
        category = $3,
        description = $4,
        scripture_reference = $5,
        content = $6,
        featured_image = $7,
        is_featured = $8,
        status = $9,
        published_at = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
      `,
      [
        title.trim(),
        slug.trim(),
        category.trim(),
        description?.trim() || null,
        scripture_reference?.trim() || null,
        content.trim(),
        featured_image?.trim() || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
        historyId,
      ]
    );

    res.json({
      success: true,
      message: "History study updated successfully.",
      history: result.rows[0],
    });
  } catch (error) {
    console.error("Update history error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update history study.",
    });
  }
};


// DELETE HISTORY
const deleteHistory = async (req, res) => {
  try {
    const historyId = Number(req.params.id);

    if (!Number.isInteger(historyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid history ID.",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM histories
      WHERE id = $1
      RETURNING id
      `,
      [historyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "History study not found.",
      });
    }

    res.json({
      success: true,
      message: "History study deleted successfully.",
    });
  } catch (error) {
    console.error("Delete history error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete history study.",
    });
  }
};



// ============================================================
// CHRISTIAN LIVING
// ============================================================
async function getChristianLiving(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        cl.*,
        u.name AS author_name
      FROM christian_living cl
      LEFT JOIN users u
        ON cl.author_id = u.id
      ORDER BY
        cl.created_at DESC
    `);

    res.json({
      success: true,
      studies: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Christian Living error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load Christian Living studies.",
    });
  }
}


async function getChristianLivingById(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        cl.*,
        u.name AS author_name
      FROM christian_living cl
      LEFT JOIN users u
        ON cl.author_id = u.id
      WHERE cl.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Christian Living study not found.",
      });
    }

    res.json({
      success: true,
      study: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Christian Living by ID error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load Christian Living study.",
    });
  }
}


async function getPublicChristianLiving(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        cl.*,
        u.name AS author_name
      FROM christian_living cl
      LEFT JOIN users u
        ON cl.author_id = u.id
      WHERE
        cl.status = 'published'
        AND (
          cl.published_at IS NULL
          OR cl.published_at <= NOW()
        )
      ORDER BY
        cl.is_featured DESC,
        cl.published_at DESC NULLS LAST,
        cl.created_at DESC
    `);

    res.json({
      success: true,
      studies: result.rows,
    });
  } catch (error) {
    console.error(
      "Get public Christian Living error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load Christian Living studies.",
    });
  }
}


async function getPublicChristianLivingBySlug(
  req,
  res
) {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        cl.*,
        u.name AS author_name
      FROM christian_living cl
      LEFT JOIN users u
        ON cl.author_id = u.id
      WHERE
        cl.slug = $1
        AND cl.status = 'published'
        AND (
          cl.published_at IS NULL
          OR cl.published_at <= NOW()
        )
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Christian Living study not found.",
      });
    }

    res.json({
      success: true,
      study: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get public Christian Living by slug error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load Christian Living study.",
    });
  }
}


async function createChristianLiving(req, res) {
  try {
    const {
      title,
      slug,
      category,
      description,
      scripture_reference,
      content,
      featured_image,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (
      !title?.trim() ||
      !slug?.trim() ||
      !category?.trim() ||
      !content?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, category, and content are required.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO christian_living (
        title,
        slug,
        category,
        description,
        scripture_reference,
        content,
        featured_image,
        is_featured,
        status,
        published_at,
        author_id
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11
      )
      RETURNING *
      `,
      [
        title.trim(),
        slug.trim(),
        category.trim(),
        description?.trim() || null,
        scripture_reference?.trim() || null,
        content.trim(),
        featured_image?.trim() || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
        req.user?.id || null,
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Christian Living study created successfully.",
      study: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create Christian Living error:",
      error
    );

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message:
          "A Christian Living study with this slug already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Unable to create Christian Living study.",
    });
  }
}


async function updateChristianLiving(req, res) {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      category,
      description,
      scripture_reference,
      content,
      featured_image,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (
      !title?.trim() ||
      !slug?.trim() ||
      !category?.trim() ||
      !content?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, category, and content are required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE christian_living
      SET
        title = $1,
        slug = $2,
        category = $3,
        description = $4,
        scripture_reference = $5,
        content = $6,
        featured_image = $7,
        is_featured = $8,
        status = $9,
        published_at = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
      `,
      [
        title.trim(),
        slug.trim(),
        category.trim(),
        description?.trim() || null,
        scripture_reference?.trim() || null,
        content.trim(),
        featured_image?.trim() || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Christian Living study not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Christian Living study updated successfully.",
      study: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Christian Living error:",
      error
    );

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message:
          "A Christian Living study with this slug already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Unable to update Christian Living study.",
    });
  }
}


async function deleteChristianLiving(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM christian_living
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Christian Living study not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Christian Living study deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Christian Living error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete Christian Living study.",
    });
  }
}




// =========================================================
// HEALTH
// =========================================================

async function getHealth(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        h.*,
        u.name AS author_name
      FROM health h
      LEFT JOIN users u ON u.id = h.author_id
      ORDER BY h.created_at DESC
    `);

    res.json({
      success: true,
      studies: result.rows,
    });
  } catch (error) {
    console.error("Get admin health error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load Health content.",
    });
  }
}

async function getHealthById(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        SELECT
          h.*,
          u.name AS author_name
        FROM health h
        LEFT JOIN users u ON u.id = h.author_id
        WHERE h.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health study not found.",
      });
    }

    res.json({
      success: true,
      study: result.rows[0],
    });
  } catch (error) {
    console.error("Get health by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load Health study.",
    });
  }
}

async function getPublicHealth(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        slug,
        category,
        description,
        scripture_reference,
        featured_image,
        is_featured,
        published_at
      FROM health
      WHERE status = 'published'
        AND (published_at IS NULL OR published_at <= NOW())
      ORDER BY is_featured DESC, published_at DESC NULLS LAST, created_at DESC
    `);

    res.json({
      success: true,
      studies: result.rows,
    });
  } catch (error) {
    console.error("Get public health error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load Health content.",
    });
  }
}

async function getPublicHealthBySlug(req, res) {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
        SELECT
          h.*,
          u.name AS author_name
        FROM health h
        LEFT JOIN users u ON u.id = h.author_id
        WHERE h.slug = $1
          AND h.status = 'published'
          AND (h.published_at IS NULL OR h.published_at <= NOW())
        LIMIT 1
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health study not found.",
      });
    }

    res.json({
      success: true,
      study: result.rows[0],
    });
  } catch (error) {
    console.error("Get public health by slug error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load Health study.",
    });
  }
}

async function createHealth(req, res) {
  try {
    const {
      title,
      slug,
      category,
      description,
      scripture_reference,
      content,
      featured_image,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (!title || !slug || !category || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, category and content are required.",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO health (
          title,
          slug,
          category,
          description,
          scripture_reference,
          content,
          featured_image,
          is_featured,
          status,
          published_at,
          author_id
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *
      `,
      [
        title,
        slug,
        category,
        description || null,
        scripture_reference || null,
        content,
        featured_image || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
        req.user?.id || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Health study created successfully.",
      study: result.rows[0],
    });
  } catch (error) {
    console.error("Create health error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A Health study with this slug already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to create Health study.",
    });
  }
}

async function updateHealth(req, res) {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      category,
      description,
      scripture_reference,
      content,
      featured_image,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (!title || !slug || !category || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, category and content are required.",
      });
    }

    const result = await pool.query(
      `
        UPDATE health
        SET
          title = $1,
          slug = $2,
          category = $3,
          description = $4,
          scripture_reference = $5,
          content = $6,
          featured_image = $7,
          is_featured = $8,
          status = $9,
          published_at = $10,
          updated_at = NOW()
        WHERE id = $11
        RETURNING *
      `,
      [
        title,
        slug,
        category,
        description || null,
        scripture_reference || null,
        content,
        featured_image || null,
        Boolean(is_featured),
        status || "draft",
        published_at || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health study not found.",
      });
    }

    res.json({
      success: true,
      message: "Health study updated successfully.",
      study: result.rows[0],
    });
  } catch (error) {
    console.error("Update health error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A Health study with this slug already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to update Health study.",
    });
  }
}

async function deleteHealth(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM health WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Health study not found.",
      });
    }

    res.json({
      success: true,
      message: "Health study deleted successfully.",
    });
  } catch (error) {
    console.error("Delete health error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete Health study.",
    });
  }
}


// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getDailyInspirations,
  createDailyInspiration,
  updateDailyInspiration,
  deleteDailyInspiration,
  getBibleStudies,
  getBibleStudyById,

  getPublicBibleStudies,
  getPublicBibleStudyBySlug,
  createBibleStudy,
  updateBibleStudy,
  deleteBibleStudy,
  getProphecies,
  getPublicProphecies,
  getPublicProphecyBySlug,
  getProphecyById,
  createProphecy,
  updateProphecy,
  deleteProphecy,

  getVideos,
  getFeaturedVideo,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getPublicVideos,
  getPublicVideoBySlug,

  getYouTubeMetadata,

  uploadResourceFile,
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getPublicResources,

  // Public content
  getPublicArticles,
  getPublicArticleBySlug,
  getPublicDailyInspirations,
  getPublicTodayInspiration,
  getPublicDailyInspirationByDate,

  uploadArticleImage,

  // History
  getHistories,
  getHistoryById,
  getPublicHistories,
  getPublicHistoryBySlug,
  createHistory,
  updateHistory,
  deleteHistory,


  getChristianLiving,
  getChristianLivingById,
  getPublicChristianLiving,
  getPublicChristianLivingBySlug,
  createChristianLiving,
  updateChristianLiving,
  deleteChristianLiving,

  getHealth,
  getHealthById,
  getPublicHealth,
  getPublicHealthBySlug,
  createHealth,
  updateHealth,
  deleteHealth,
}