const Notification = require("../models/Notification");

// GET /api/notifications
// Retrieves global notifications + specific user notifications
const getNotifications = async (req, res) => {
  try {
    const { globalSince } = req.query; // If frontend tracks last global fetch time

    const filter = {
      $or: [
        { recipientId: req.user._id },
        { recipientId: null },
      ],
    };

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ success: false, error: "Not found" });

    // Validate ownership
    if (notif.recipientId && notif.recipientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    // Mark as read
    notif.read = true;
    await notif.save();

    res.json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipientId: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
