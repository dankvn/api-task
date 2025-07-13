// routes/project.routes.js
import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
} from "../controllers/project.controller.js";
import { verifyToken, isModeratorOrAdmin } from "../middlewares/authJwt.js";

const router = Router();
// ✅ Rutas específicas primero
router.get("/myprojects", [verifyToken], getMyProjects);

router.get("/", [verifyToken, isModeratorOrAdmin], getProjects);
router.get("/:id", [verifyToken, isModeratorOrAdmin], getProjectById);
router.post("/", [verifyToken, isModeratorOrAdmin], createProject);
router.put("/:id", [verifyToken, isModeratorOrAdmin], updateProject);
router.delete("/:id", [verifyToken, isModeratorOrAdmin], deleteProject);

export default router;
