const express = require("express");

const {
  getAvailableFeaturedStudies,
  getFeaturedStudies,
  updateFeaturedStudies,
} = require("../controllers/homepageFeaturedStudiesController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all published Bible Studies available for selection
router.get(
  "/available",
  authMiddleware,
  getAvailableFeaturedStudies
);

// Get currently selected homepage studies
router.get(
  "/",
  authMiddleware,
  getFeaturedStudies
);

// Update homepage featured studies
router.put(
  "/",
  authMiddleware,
  updateFeaturedStudies
);

module.exports = router;
