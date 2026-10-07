const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| ADMIN DISCUSSIONS
|--------------------------------------------------------------------------
*/

// GET ALL DISCUSSIONS
const getAdminDiscussions = async (req, res) => {
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
        u.email AS author_email,

        c.id AS category_id,
        c.name AS category,
        c.slug AS category_slug,

        COUNT(r.id)::INTEGER AS replies

      FROM discussions d

      JOIN users u
        ON u.id = d.user_id

      JOIN discussion_categories c
        ON c.id = d.category_id

      LEFT JOIN discussion_replies r
        ON r.discussion_id = d.id

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
    console.error("Get admin discussions error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load discussions.",
    });
  }
};


// GET SINGLE DISCUSSION FOR ADMIN
const getAdminDiscussionById = async (req, res) => {
  try {
    const discussionId = Number(req.params.id);

    if (!Number.isInteger(discussionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discussion ID.",
      });
    }

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
        u.email AS author_email,

        c.id AS category_id,
        c.name AS category,
        c.slug AS category_slug

      FROM discussions d

      JOIN users u
        ON u.id = d.user_id

      JOIN discussion_categories c
        ON c.id = d.category_id

      WHERE d.id = $1
      `,
      [discussionId]
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
        u.name AS author,
        u.email AS author_email

      FROM discussion_replies r

      JOIN users u
        ON u.id = r.user_id

      WHERE r.discussion_id = $1

      ORDER BY r.created_at ASC
      `,
      [discussionId]
    );

    res.json({
      success: true,
      discussion: discussionResult.rows[0],
      replies: repliesResult.rows,
    });
  } catch (error) {
    console.error("Get admin discussion error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load discussion.",
    });
  }
};


// FEATURE / UNFEATURE DISCUSSION
const toggleDiscussionFeatured = async (req, res) => {
  try {
    const discussionId = Number(req.params.id);

    if (!Number.isInteger(discussionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discussion ID.",
      });
    }

    const result = await pool.query(
      `
      UPDATE discussions
      SET
        is_featured = NOT is_featured,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, is_featured
      `,
      [discussionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found.",
      });
    }

    res.json({
      success: true,
      message: result.rows[0].is_featured
        ? "Discussion featured successfully."
        : "Discussion removed from featured discussions.",
      discussion: result.rows[0],
    });
  } catch (error) {
    console.error("Toggle discussion featured error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update featured status.",
    });
  }
};


// LOCK / UNLOCK DISCUSSION
const toggleDiscussionLocked = async (req, res) => {
  try {
    const discussionId = Number(req.params.id);

    if (!Number.isInteger(discussionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discussion ID.",
      });
    }

    const result = await pool.query(
      `
      UPDATE discussions
      SET
        is_locked = NOT is_locked,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, is_locked
      `,
      [discussionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found.",
      });
    }

    res.json({
      success: true,
      message: result.rows[0].is_locked
        ? "Discussion locked successfully."
        : "Discussion unlocked successfully.",
      discussion: result.rows[0],
    });
  } catch (error) {
    console.error("Toggle discussion lock error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update discussion lock status.",
    });
  }
};


// UPDATE DISCUSSION STATUS
const updateDiscussionStatus = async (req, res) => {
  try {
    const discussionId = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = [
      "published",
      "draft",
      "hidden",
    ];

    if (!Number.isInteger(discussionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discussion ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discussion status.",
      });
    }

    const result = await pool.query(
      `
      UPDATE discussions
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, status
      `,
      [status, discussionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found.",
      });
    }

    res.json({
      success: true,
      message: "Discussion status updated successfully.",
      discussion: result.rows[0],
    });
  } catch (error) {
    console.error("Update discussion status error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update discussion status.",
    });
  }
};


// DELETE DISCUSSION
const deleteAdminDiscussion = async (req, res) => {
  try {
    const discussionId = Number(req.params.id);

    if (!Number.isInteger(discussionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discussion ID.",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM discussions
      WHERE id = $1
      RETURNING id
      `,
      [discussionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found.",
      });
    }

    res.json({
      success: true,
      message: "Discussion deleted successfully.",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Delete discussion error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete discussion.",
    });
  }
};


// DELETE REPLY
const deleteAdminReply = async (req, res) => {
  try {
    const discussionId = Number(req.params.discussionId);
    const replyId = Number(req.params.replyId);

    if (
      !Number.isInteger(discussionId) ||
      !Number.isInteger(replyId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid discussion or reply ID.",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM discussion_replies
      WHERE id = $1
        AND discussion_id = $2
      RETURNING id
      `,
      [replyId, discussionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reply not found.",
      });
    }

    res.json({
      success: true,
      message: "Reply deleted successfully.",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Delete reply error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete reply.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN USERS
|--------------------------------------------------------------------------
*/

// GET ALL USERS
const getAdminUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        role,
        avatar_url,
        bio,
        is_active,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("Get admin users error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load users.",
    });
  }
};


// GET SINGLE USER
const getAdminUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        avatar_url,
        bio,
        is_active,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get admin user error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load user.",
    });
  }
};


// ACTIVATE / DEACTIVATE USER
const toggleUserStatus = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account.",
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        is_active = NOT is_active,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, is_active
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      message: result.rows[0].is_active
        ? "User activated successfully."
        : "User deactivated successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Toggle user status error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update user status.",
    });
  }
};


// CHANGE USER ROLE
const updateUserRole = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;

    const allowedRoles = [
      "user",
      "admin",
    ];

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role.",
      });
    }

    if (role === "user") {
      const adminCountResult = await pool.query(
        `
        SELECT COUNT(*)::INTEGER AS count
        FROM users
        WHERE role = 'admin'
          AND is_active = TRUE
        `
      );

      if (adminCountResult.rows[0].count <= 1) {
        const currentUserResult = await pool.query(
          `
          SELECT role
          FROM users
          WHERE id = $1
          `,
          [userId]
        );

        if (
          currentUserResult.rows.length > 0 &&
          currentUserResult.rows[0].role === "admin"
        ) {
          return res.status(400).json({
            success: false,
            message: "The last active administrator cannot be demoted.",
          });
        }
      }
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        role = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, name, role
      `,
      [role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      message: "User role updated successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update user role error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update user role.",
    });
  }
};


// DELETE USER
const deleteAdminUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const targetUserResult = await pool.query(
      `
      SELECT id, role
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (targetUserResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (targetUserResult.rows[0].role === "admin") {
      const adminCountResult = await pool.query(
        `
        SELECT COUNT(*)::INTEGER AS count
        FROM users
        WHERE role = 'admin'
          AND is_active = TRUE
        `
      );

      if (adminCountResult.rows[0].count <= 1) {
        return res.status(400).json({
          success: false,
          message: "The last active administrator cannot be deleted.",
        });
      }
    }

    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
      `,
      [userId]
    );

    res.json({
      success: true,
      message: "User deleted successfully.",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete user.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN REPORTS
|--------------------------------------------------------------------------
*/

// GET REPORTS
const getAdminReports = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        dr.id,
        dr.discussion_id,
        dr.reply_id,
        dr.reported_by,
        dr.reason,
        dr.status,
        dr.created_at,

        reporter.name AS reporter_name,
        reporter.email AS reporter_email,

        d.title AS discussion_title,
        d.content AS discussion_content,

        r.content AS reply_content

      FROM discussion_reports dr

      JOIN users reporter
        ON reporter.id = dr.reported_by

      LEFT JOIN discussions d
        ON d.id = dr.discussion_id

      LEFT JOIN discussion_replies r
        ON r.id = dr.reply_id

      ORDER BY
        CASE
          WHEN dr.status = 'pending' THEN 1
          WHEN dr.status = 'resolved' THEN 2
          WHEN dr.status = 'dismissed' THEN 3
          ELSE 4
        END,
        dr.created_at DESC
    `);

    res.json({
      success: true,
      reports: result.rows,
    });
  } catch (error) {
    console.error("Get admin reports error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load reports.",
    });
  }
};


// GET SINGLE REPORT
const getAdminReportById = async (req, res) => {
  try {
    const reportId = Number(req.params.id);

    if (!Number.isInteger(reportId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        dr.id,
        dr.discussion_id,
        dr.reply_id,
        dr.reported_by,
        dr.reason,
        dr.status,
        dr.created_at,

        reporter.name AS reporter_name,
        reporter.email AS reporter_email,

        d.title AS discussion_title,
        d.content AS discussion_content,

        r.content AS reply_content

      FROM discussion_reports dr

      JOIN users reporter
        ON reporter.id = dr.reported_by

      LEFT JOIN discussions d
        ON d.id = dr.discussion_id

      LEFT JOIN discussion_replies r
        ON r.id = dr.reply_id

      WHERE dr.id = $1
      `,
      [reportId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    res.json({
      success: true,
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Get admin report error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load report.",
    });
  }
};


// UPDATE REPORT STATUS
const updateReportStatus = async (req, res) => {
  try {
    const reportId = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "resolved",
      "dismissed",
    ];

    if (!Number.isInteger(reportId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status.",
      });
    }

    const result = await pool.query(
      `
      UPDATE discussion_reports
      SET status = $1
      WHERE id = $2
      RETURNING id, status
      `,
      [status, reportId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    res.json({
      success: true,
      message: "Report status updated successfully.",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Update report status error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update report status.",
    });
  }
};


// DELETE REPORTED CONTENT
const deleteReportedContent = async (req, res) => {
  try {
    const reportId = Number(req.params.id);

    if (!Number.isInteger(reportId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID.",
      });
    }

    const reportResult = await pool.query(
      `
      SELECT
        id,
        discussion_id,
        reply_id
      FROM discussion_reports
      WHERE id = $1
      `,
      [reportId]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    const report = reportResult.rows[0];

    if (report.reply_id) {
      const replyResult = await pool.query(
        `
        DELETE FROM discussion_replies
        WHERE id = $1
        RETURNING id
        `,
        [report.reply_id]
      );

      if (replyResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Reported reply no longer exists.",
        });
      }

      return res.json({
        success: true,
        message:
          "Reported reply removed and report resolved.",
        content_type: "reply",
        content_id: report.reply_id,
      });
    }

    if (report.discussion_id) {
      const discussionResult = await pool.query(
        `
        DELETE FROM discussions
        WHERE id = $1
        RETURNING id
        `,
        [report.discussion_id]
      );

      if (discussionResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Reported discussion no longer exists.",
        });
      }

      return res.json({
        success: true,
        message:
          "Reported discussion removed and report resolved.",
        content_type: "discussion",
        content_id: report.discussion_id,
      });
    }

    return res.status(400).json({
      success: false,
      message:
        "This report does not reference content.",
    });
  } catch (error) {
    console.error(
      "Delete reported content error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to remove reported content.",
    });
  }
};

module.exports = {
  getAdminDiscussions,
  getAdminDiscussionById,
  toggleDiscussionFeatured,
  toggleDiscussionLocked,
  updateDiscussionStatus,
  deleteAdminDiscussion,
  deleteAdminReply,

  getAdminUsers,
  getAdminUserById,
  toggleUserStatus,
  updateUserRole,
  deleteAdminUser,

  getAdminReports,
  getAdminReportById,
  updateReportStatus,
  deleteReportedContent,
};