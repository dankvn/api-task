import { Router } from 'express';
import { getRoles, createRole, getRole, updateRole, deleteRole } from '../controllers/role.controller.js';
import { isAdmin, verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.get('/', [verifyToken, isAdmin], getRoles);
router.post('/', [verifyToken, isAdmin], createRole);
router.get('/:roleId', [verifyToken, isAdmin], getRole);
router.put('/:roleId', [verifyToken, isAdmin], updateRole);
router.delete('/:roleId', [verifyToken, isAdmin], deleteRole);

export default router;
