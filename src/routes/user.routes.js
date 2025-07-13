import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { isModeratorOrAdmin, verifyToken, isAdmin } from "../middlewares/authJwt.js";
import { checkExistingUser } from "../middlewares/verifySignup.js";

const router = Router();

router.post("/", [verifyToken], createUser);
router.get("/", [verifyToken, isModeratorOrAdmin], getUsers);
router.put("/:id", [verifyToken, isModeratorOrAdmin], updateUser);
router.delete("/:id", [verifyToken, isModeratorOrAdmin], deleteUser);


export default router;
