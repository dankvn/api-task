// controllers/notification.controller.js
import {
  getUserNotifications,
  markAsRead,
  createNotification
} from "../services/notificationService.js";
import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
};

export const readNotification = async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al marcar notificación como leída" });
  }
};