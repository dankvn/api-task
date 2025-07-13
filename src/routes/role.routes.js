import { Router } from 'express';
import { getRoles, createRole, getRole, updateRole, deleteRole } from '../controllers/role.controller.js';
import { isModeratorOrAdmin , verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.get('/', [verifyToken, isModeratorOrAdmin ], getRoles);
router.post('/', [verifyToken, isModeratorOrAdmin ], createRole);
router.get('/:roleId', [verifyToken, isModeratorOrAdmin ], getRole);
router.put('/:roleId', [verifyToken, isModeratorOrAdmin ], updateRole);
router.delete('/:roleId', [verifyToken, isModeratorOrAdmin ], deleteRole);

export default router;
