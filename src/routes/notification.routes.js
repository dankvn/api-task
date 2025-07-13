// routes/notification.routes.js
import express from "express";
import {
  getMyNotifications,
  readNotification
} from "../controllers/notification.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = express.Router();

router.get("/", verifyToken, getMyNotifications);
router.put("/:id/read", verifyToken, readNotification);

export default router;