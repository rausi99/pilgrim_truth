const express = require("express");

const {
  register,
  login,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Temporary Admin authorization test
router.get(
  "/admin-test",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: "Admin authorization is working.",
      admin: req.user,
    });
  }
);

module.exports = router;