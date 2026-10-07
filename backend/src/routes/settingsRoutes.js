const express = require("express");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/*
 * PUBLIC SITE SETTINGS
 * Used by the public website footer, navbar, contact information, etc.
 */
router.get("/", getSettings);

/*
 * ADMIN UPDATE SETTINGS
 */
router.put(
  "/",
  authMiddleware,
  adminMiddleware,
  updateSettings
);

module.exports = router;