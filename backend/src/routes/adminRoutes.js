const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/adminController");

const {
  getAdminDiscussions,
  getAdminDiscussionById,
  toggleDiscussionFeatured,
  toggleDiscussionLocked,
  updateDiscussionStatus,
  deleteAdminDiscussion,
  deleteAdminReply,

  getAdminUsers,
  getAdminUserById,
  toggleUserStatus,
  updateUserRole,
  deleteAdminUser,

  getAdminReports,
  getAdminReportById,
  updateReportStatus,
  deleteReportedContent,
} = require("../controllers/communityController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);


/*
|--------------------------------------------------------------------------
| DISCUSSIONS
|--------------------------------------------------------------------------
*/

router.get(
  "/discussions",
  authMiddleware,
  adminMiddleware,
  getAdminDiscussions
);

router.get(
  "/discussions/:id",
  authMiddleware,
  adminMiddleware,
  getAdminDiscussionById
);

router.put(
  "/discussions/:id/feature",
  authMiddleware,
  adminMiddleware,
  toggleDiscussionFeatured
);

router.put(
  "/discussions/:id/lock",
  authMiddleware,
  adminMiddleware,
  toggleDiscussionLocked
);

router.put(
  "/discussions/:id/status",
  authMiddleware,
  adminMiddleware,
  updateDiscussionStatus
);

router.delete(
  "/discussions/:id",
  authMiddleware,
  adminMiddleware,
  deleteAdminDiscussion
);

router.delete(
  "/discussions/:discussionId/replies/:replyId",
  authMiddleware,
  adminMiddleware,
  deleteAdminReply
);


/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/

router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAdminUsers
);

router.get(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  getAdminUserById
);

router.put(
  "/users/:id/status",
  authMiddleware,
  adminMiddleware,
  toggleUserStatus
);

router.put(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  updateUserRole
);

router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  deleteAdminUser
);


/*
|--------------------------------------------------------------------------
| REPORTS
|--------------------------------------------------------------------------
*/

router.get(
  "/reports",
  authMiddleware,
  adminMiddleware,
  getAdminReports
);

router.get(
  "/reports/:id",
  authMiddleware,
  adminMiddleware,
  getAdminReportById
);

router.put(
  "/reports/:id/status",
  authMiddleware,
  adminMiddleware,
  updateReportStatus
);

router.delete(
  "/reports/:id/content",
  authMiddleware,
  adminMiddleware,
  deleteReportedContent
);


module.exports = router;