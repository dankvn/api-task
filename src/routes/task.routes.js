import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTasks,
  uploadTaskFile,
} from "../controllers/task.controller.js";
import { verifyToken, isModeratorOrAdmin } from "../middlewares/authJwt.js";
import upload from "../middlewares/upload.js";
const router = Router();

router.get("/my-tasks", [verifyToken], getMyTasks); // user
router.put("/:id/upload", [verifyToken, upload.single("file")], uploadTaskFile); // Nueva ruta para subir archivos

router.get("/", [verifyToken, isModeratorOrAdmin], getTasks);
router.get("/:id", [verifyToken], getTaskById);
router.post("/", [verifyToken, isModeratorOrAdmin], createTask);
router.put("/:id", [verifyToken, isModeratorOrAdmin], updateTask);
router.delete("/:id", [verifyToken, isModeratorOrAdmin], deleteTask);

export default router;
