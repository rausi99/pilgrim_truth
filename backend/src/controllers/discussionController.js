const pool = require("../config/db");

// GET ALL DISCUSSIONS
const getDiscussions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        d.id,
        d.title,
        d.content,
        d.is_featured,
        d.is_locked,
        d.status,
        d.created_at,
        d.updated_at,
        u.id AS user_id,
        u.name AS author,
        c.id AS category_id,
        c.name AS category,
        c.slug AS category_slug,
        COUNT(r.id)::INTEGER AS replies
      FROM discussions d
      JOIN users u ON u.id = d.user_id
      JOIN discussion_categories c ON c.id = d.category_id
      LEFT JOIN discussion_replies r
        ON r.discussion_id = d.id
      WHERE d.status = 'published'
      GROUP BY
        d.id,
        u.id,
        c.id
      ORDER BY d.created_at DESC
    `);

    res.json({
      success: true,
      discussions: result.rows,
    });
  } catch (error) {
    console.error("Get discussions error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load discussions.",
    });
  }
};

// GET SINGLE DISCUSSION
const getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;

    const discussionResult = await pool.query(
      `
      SELECT
        d.id,
        d.title,
        d.content,
        d.is_featured,
        d.is_locked,
        d.status,
        d.created_at,
        d.updated_at,
        u.id AS user_id,
        u.name AS author,
        c.id AS category_id,
        c.name AS category,
        c.slug AS category_slug
      FROM discussions d
      JOIN users u ON u.id = d.user_id
      JOIN discussion_categories c
        ON c.id = d.category_id
      WHERE d.id = $1
        AND d.status = 'published'
      `,
      [id]
    );

    if (discussionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found.",
      });
    }

    const repliesResult = await pool.query(
      `
      SELECT
        r.id,
        r.content,
        r.created_at,
        r.updated_at,
        u.id AS user_id,
        u.name AS author
      FROM discussion_replies r
      JOIN users u ON u.id = r.user_id
      WHERE r.discussion_id = $1
      ORDER BY r.created_at ASC
      `,
      [id]
    );

    res.json({
      success: true,
      discussion: discussionResult.rows[0],
      replies: repliesResult.rows,
    });
  } catch (error) {
    console.error("Get discussion error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load discussion.",
    });
  }
};

// CREATE DISCUSSION
const createDiscussion = async (req, res) => {
  try {
    const { title, content, category_id } = req.body;

    if (!title || !content || !category_id) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and category are required.",
      });
    }

    const categoryResult = await pool.query(
      "SELECT id FROM discussion_categories WHERE id = $1",
      [category_id]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid discussion category.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO discussions
        (user_id, category_id, title, content)
      VALUES
        ($1, $2, $3, $4)
      RETURNING
        id,
        title,
        content,
        category_id,
        created_at
      `,
      [
        req.user.id,
        category_id,
        title.trim(),
        content.trim(),
      ]
    );

    res.status(201).json({
      success: true,
      message: "Discussion created successfully.",
      discussion: result.rows[0],
    });
  } catch (error) {
    console.error("Create discussion error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create discussion.",
    });
  }
};

// GET CATEGORIES
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        slug,
        description
      FROM discussion_categories
      ORDER BY name ASC
    `);

    res.json({
      success: true,
      categories: result.rows,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load discussion categories.",
    });
  }
};

// CREATE REPLY
const createReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply content is required.",
      });
    }

    const discussionResult = await pool.query(
      `
      SELECT id, is_locked, status
      FROM discussions
      WHERE id = $1
      `,
      [id]
    );

    if (discussionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found.",
      });
    }

    const discussion = discussionResult.rows[0];

    if (discussion.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "This discussion is not available.",
      });
    }

    if (discussion.is_locked) {
      return res.status(403).json({
        success: false,
        message: "This discussion is locked.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO discussion_replies
        (discussion_id, user_id, content)
      VALUES
        ($1, $2, $3)
      RETURNING
        id,
        discussion_id,
        content,
        created_at
      `,
      [
        id,
        req.user.id,
        content.trim(),
      ]
    );

    res.status(201).json({
      success: true,
      message: "Reply added successfully.",
      reply: result.rows[0],
    });
  } catch (error) {
    console.error("Create reply error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to add reply.",
    });
  }
};

module.exports = {
  getDiscussions,
  getDiscussionById,
  createDiscussion,
  getCategories,
  createReply,
};