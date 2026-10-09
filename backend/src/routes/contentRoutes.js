
const express = require("express");

const {
  // Articles
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getPublicArticles,
  getPublicArticleBySlug,
  uploadArticleImage,

  // Daily Inspirations
  getDailyInspirations,
  createDailyInspiration,
  updateDailyInspiration,
  deleteDailyInspiration,
  getPublicDailyInspirations,
  getPublicTodayInspiration,
  getPublicDailyInspirationByDate,

  // Bible Studies
  getBibleStudies,
  getBibleStudyById,
  createBibleStudy,
  updateBibleStudy,
  deleteBibleStudy,
  getPublicBibleStudies,
  getPublicBibleStudyBySlug,

  // Prophecy
  getProphecies,
  getProphecyById,
  createProphecy,
  updateProphecy,
  deleteProphecy,
  getPublicProphecies,
  getPublicProphecyBySlug,

  // Videos
  getVideos,
  getFeaturedVideo,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getPublicVideos,
  getPublicVideoBySlug,

  // Resources
  uploadResourceFile,
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,

  // YouTube
  getYouTubeMetadata,

  // History
  getHistories,
  getHistoryById,
  getPublicHistories,
  getPublicHistoryBySlug,
  createHistory,
  updateHistory,
  deleteHistory,

  // Christian Living
  getChristianLiving,
  getChristianLivingById,
  getPublicChristianLiving,
  getPublicChristianLivingBySlug,
  createChristianLiving,
  updateChristianLiving,
  deleteChristianLiving,

  // Health
  getHealth,
  getHealthById,
  getPublicHealth,
  getPublicHealthBySlug,
  createHealth,
  updateHealth,
  deleteHealth,
} = require("../controllers/contentController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const uploadResource = require("../middleware/uploadMiddleware");
const uploadImage = require("../middleware/imageUploadMiddleware");

const router = express.Router();

/* =========================================================
   PUBLIC DAILY INSPIRATIONS
   ========================================================= */

router.get(
  "/public/daily-inspirations",
  getPublicDailyInspirations
);

router.get(
  "/public/daily-inspirations/today",
  getPublicTodayInspiration
);

router.get(
  "/public/daily-inspirations/:date",
  getPublicDailyInspirationByDate
);

/* =========================================================
   PUBLIC ARTICLES
   ========================================================= */

router.get(
  "/public/articles",
  getPublicArticles
);

router.get(
  "/public/articles/:slug",
  getPublicArticleBySlug
);

/* =========================================================
   ARTICLE IMAGE UPLOAD
   ========================================================= */

router.post(
  "/upload-image",
  authMiddleware,
  adminMiddleware,
  uploadImage.single("image"),
  uploadArticleImage
);

/* =========================================================
   ADMIN ARTICLES
   ========================================================= */

router.get(
  "/articles",
  authMiddleware,
  adminMiddleware,
  getArticles
);

router.get(
  "/articles/:id",
  authMiddleware,
  adminMiddleware,
  getArticleById
);

router.post(
  "/articles",
  authMiddleware,
  adminMiddleware,
  createArticle
);

router.put(
  "/articles/:id",
  authMiddleware,
  adminMiddleware,
  updateArticle
);

router.delete(
  "/articles/:id",
  authMiddleware,
  adminMiddleware,
  deleteArticle
);

/* =========================================================
   ADMIN DAILY INSPIRATIONS
   ========================================================= */

router.get(
  "/daily-inspirations",
  authMiddleware,
  adminMiddleware,
  getDailyInspirations
);

router.post(
  "/daily-inspirations",
  authMiddleware,
  adminMiddleware,
  createDailyInspiration
);

router.put(
  "/daily-inspirations/:id",
  authMiddleware,
  adminMiddleware,
  updateDailyInspiration
);

router.delete(
  "/daily-inspirations/:id",
  authMiddleware,
  adminMiddleware,
  deleteDailyInspiration
);

/* =========================================================
   PUBLIC BIBLE STUDIES
   ========================================================= */

router.get(
  "/public/bible-studies",
  getPublicBibleStudies
);

router.get(
  "/public/bible-studies/:slug",
  getPublicBibleStudyBySlug
);

/* =========================================================
   ADMIN BIBLE STUDIES
   ========================================================= */

router.get(
  "/bible-studies",
  authMiddleware,
  adminMiddleware,
  getBibleStudies
);

router.get(
  "/bible-studies/:id",
  authMiddleware,
  adminMiddleware,
  getBibleStudyById
);

router.post(
  "/bible-studies",
  authMiddleware,
  adminMiddleware,
  createBibleStudy
);

router.put(
  "/bible-studies/:id",
  authMiddleware,
  adminMiddleware,
  updateBibleStudy
);

router.delete(
  "/bible-studies/:id",
  authMiddleware,
  adminMiddleware,
  deleteBibleStudy
);

/* =========================================================
   PUBLIC PROPHECY
   ========================================================= */

router.get(
  "/public/prophecy",
  getPublicProphecies
);

router.get(
  "/public/prophecy/:slug",
  getPublicProphecyBySlug
);

/* =========================================================
   ADMIN PROPHECY
   ========================================================= */

router.get(
  "/prophecies",
  authMiddleware,
  adminMiddleware,
  getProphecies
);

router.get(
  "/prophecies/:id",
  authMiddleware,
  adminMiddleware,
  getProphecyById
);

router.post(
  "/prophecies",
  authMiddleware,
  adminMiddleware,
  createProphecy
);

router.put(
  "/prophecies/:id",
  authMiddleware,
  adminMiddleware,
  updateProphecy
);

router.delete(
  "/prophecies/:id",
  authMiddleware,
  adminMiddleware,
  deleteProphecy
);

/* =========================================================
   PUBLIC FEATURED VIDEO
   ========================================================= */

router.get(
  "/featured-video",
  getFeaturedVideo
);

/* =========================================================
   PUBLIC VIDEOS
   ========================================================= */

router.get(
  "/public/videos",
  getPublicVideos
);

router.get(
  "/public/videos/:slug",
  getPublicVideoBySlug
);

/* =========================================================
   ADMIN VIDEOS
   ========================================================= */

router.get(
  "/videos",
  authMiddleware,
  adminMiddleware,
  getVideos
);

router.get(
  "/videos/:id",
  authMiddleware,
  adminMiddleware,
  getVideoById
);

router.post(
  "/videos",
  authMiddleware,
  adminMiddleware,
  createVideo
);

router.put(
  "/videos/:id",
  authMiddleware,
  adminMiddleware,
  updateVideo
);

router.delete(
  "/videos/:id",
  authMiddleware,
  adminMiddleware,
  deleteVideo
);

router.get(
  "/youtube-metadata",
  authMiddleware,
  adminMiddleware,
  getYouTubeMetadata
);


/* =========================================================
   RESOURCES
   ========================================================= */

router.get(
  "/resources",
  authMiddleware,
  adminMiddleware,
  getResources
);

router.get(
  "/resources/:id",
  authMiddleware,
  adminMiddleware,
  getResourceById
);

// Upload a resource file.
router.post(
  "/resources/upload",
  authMiddleware,
  adminMiddleware,
  uploadResource.single("file"),
  uploadResourceFile
);

// Save the resource details in the database.
router.post(
  "/resources",
  authMiddleware,
  adminMiddleware,
  createResource
);

router.put(
  "/resources/:id",
  authMiddleware,
  adminMiddleware,
  updateResource
);

router.delete(
  "/resources/:id",
  authMiddleware,
  adminMiddleware,
  deleteResource
);

/* =========================================================
   PUBLIC HISTORY
   ========================================================= */

router.get(
  "/public/history",
  getPublicHistories
);

router.get(
  "/public/history/:slug",
  getPublicHistoryBySlug
);

/* =========================================================
   ADMIN HISTORY
   ========================================================= */

router.get(
  "/history",
  authMiddleware,
  adminMiddleware,
  getHistories
);

router.get(
  "/history/:id",
  authMiddleware,
  adminMiddleware,
  getHistoryById
);

router.post(
  "/history",
  authMiddleware,
  adminMiddleware,
  createHistory
);

router.put(
  "/history/:id",
  authMiddleware,
  adminMiddleware,
  updateHistory
);

router.delete(
  "/history/:id",
  authMiddleware,
  adminMiddleware,
  deleteHistory
);

/* =========================================================
   PUBLIC CHRISTIAN LIVING
   ========================================================= */

router.get(
  "/public/christian-living",
  getPublicChristianLiving
);

router.get(
  "/public/christian-living/:slug",
  getPublicChristianLivingBySlug
);

/* =========================================================
   ADMIN CHRISTIAN LIVING
   ========================================================= */

router.get(
  "/christian-living",
  authMiddleware,
  adminMiddleware,
  getChristianLiving
);

router.get(
  "/christian-living/:id",
  authMiddleware,
  adminMiddleware,
  getChristianLivingById
);

router.post(
  "/christian-living",
  authMiddleware,
  adminMiddleware,
  createChristianLiving
);

router.put(
  "/christian-living/:id",
  authMiddleware,
  adminMiddleware,
  updateChristianLiving
);

router.delete(
  "/christian-living/:id",
  authMiddleware,
  adminMiddleware,
  deleteChristianLiving
);

/* =========================================================
   PUBLIC HEALTH
   ========================================================= */

router.get(
  "/public/health",
  getPublicHealth
);

router.get(
  "/public/health/:slug",
  getPublicHealthBySlug
);

/* =========================================================
   ADMIN HEALTH
   ========================================================= */

router.get(
  "/health",
  authMiddleware,
  adminMiddleware,
  getHealth
);

router.get(
  "/health/:id",
  authMiddleware,
  adminMiddleware,
  getHealthById
);

router.post(
  "/health",
  authMiddleware,
  adminMiddleware,
  createHealth
);

router.put(
  "/health/:id",
  authMiddleware,
  adminMiddleware,
  updateHealth
);

router.delete(
  "/health/:id",
  authMiddleware,
  adminMiddleware,
  deleteHealth
);

module.exports = router;
