const express = require("express");

const {
  getHomepageSettings,
} = require("../controllers/homepageController");

const router = express.Router();

// Public homepage settings
router.get("/", getHomepageSettings);

module.exports = router;