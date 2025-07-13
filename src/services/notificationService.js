// services/notificationService.js
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const createNotification = async (userId, message, taskId, projectId) => {
  try {
    const notif = new Notification({
      user: userId,
      message,
      task: taskId,
      project: projectId,
    });
    await notif.save();
  } catch (err) {
    console.error("Error creando notificación:", err);
  }
};

export const getUserNotifications = async (userId) => {
  return await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('task project');
};

export const markAsRead = async (notificationId) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );
};