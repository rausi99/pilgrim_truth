const express = require("express");

const {
  getFeaturedStudies,
} = require("../controllers/homepageFeaturedStudiesController");

const router = express.Router();

// Public homepage featured studies
router.get("/", getFeaturedStudies);

module.exports = router;
