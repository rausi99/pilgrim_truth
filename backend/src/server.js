require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const contentRoutes = require("./routes/contentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const publicSettingsRoutes = require("./routes/publicSettingsRoutes");
const homepageRoutes = require("./routes/homepageRoutes");
const publicHomepageRoutes = require("./routes/publicHomepageRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/content", contentRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin/settings", settingsRoutes);
app.use("/api/settings", publicSettingsRoutes);

app.use("/api/admin/homepage", homepageRoutes);
app.use("/api/homepage", publicHomepageRoutes);

// ===============================
// STATIC FILES
// ===============================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);


// ===============================
// ROOT
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Pilgrim Truth API is running",
  });
});


// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time"
    );

    res.json({
      success: true,
      message: "API and database are connected",
      databaseTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});


// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Pilgrim Truth API running on http://localhost:${PORT}`
  );
});

const homepageFeaturedStudiesRoutes =
  require("./routes/homepageFeaturedStudiesRoutes");

  app.use(
  "/api/admin/homepage/featured-studies",
  homepageFeaturedStudiesRoutes
);

const publicFeaturedStudiesRoutes =
  require("./routes/publicFeaturedStudiesRoutes");

  app.use(
  "/api/homepage/featured-studies",
  publicFeaturedStudiesRoutes
);