const express = require("express");

const {
  getHomepageSettings,
  updateHomepageSettings,
} = require("../controllers/homepageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Admin homepage management
router.get("/", authMiddleware, getHomepageSettings);

router.put("/", authMiddleware, updateHomepageSettings);

module.exports = router;