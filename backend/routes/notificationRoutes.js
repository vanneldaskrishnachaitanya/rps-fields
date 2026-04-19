const express = require("express");
const router = express.Router();
const {
	getNotifications,
	markAsRead,
	markAllAsRead,
	deleteNotification,
	deleteAllNotifications,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

// All notification routes require authentication
router.use(protect);

router.get("/", getNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);
router.delete("/", deleteAllNotifications);
router.delete("/:id", deleteNotification);

module.exports = router;
