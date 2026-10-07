const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM articles) AS articles,
        (SELECT COUNT(*) FROM daily_inspirations) AS daily_inspirations,
        (SELECT COUNT(*) FROM discussions) AS discussions,
        (SELECT COUNT(*) FROM users) AS users
    `);

    res.json({
      success: true,
      statistics: {
        articles: Number(result.rows[0].articles),
        dailyInspirations: Number(
          result.rows[0].daily_inspirations
        ),
        discussions: Number(
          result.rows[0].discussions
        ),
        users: Number(result.rows[0].users),
      },
    });
  } catch (error) {
    console.error(
      "Get dashboard statistics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load dashboard statistics.",
    });
  }
};

module.exports = {
  getDashboardStats,
};