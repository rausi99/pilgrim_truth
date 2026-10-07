const express = require("express");

const {
  getDiscussions,
  getDiscussionById,
  createDiscussion,
  getCategories,
  createReply,
} = require("../controllers/discussionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getDiscussions);
router.get("/categories", getCategories);
router.get("/:id", getDiscussionById);

// Authenticated
router.post("/", authMiddleware, createDiscussion);
router.post("/:id/replies", authMiddleware, createReply);

module.exports = router;