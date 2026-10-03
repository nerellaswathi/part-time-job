const { getModel } = require('../services/db');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const Notification = getModel('Notification');
    const notifs = await Notification.find({ userId });

    // Sort newest first
    notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const unreadCount = notifs.filter(n => !n.read).length;

    res.status(200).json({
      success: true,
      unreadCount,
      notifications: notifs
    });
  } catch (error) {
    console.error('[Get Notifications Error]:', error);
    res.status(500).json({ success: false, message: 'Could not fetch notifications.' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const Notification = getModel('Notification');
    const updated = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });

    res.status(200).json({
      success: true,
      notification: updated
    });
  } catch (error) {
    console.error('[Mark As Read Error]:', error);
    res.status(500).json({ success: false, message: 'Could not update notification.' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const Notification = getModel('Notification');
    const notifs = await Notification.find({ userId });

    for (const n of notifs) {
      if (!n.read) {
        await Notification.findByIdAndUpdate(n._id, { read: true });
      }
    }

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    console.error('[Mark All As Read Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all as read.' });
  }
};
