import { Router } from "express";
import {
  signinHandler,
  signupHandler,
} from "../controllers/auth.controller.js";
import {
  checkExistingRole,
  checkExistingUser,
} from "../middlewares/verifySignup.js";
import { getProfile } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/authJwt.js';
const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/signup", [checkExistingUser, checkExistingRole], signupHandler);

router.post("/signin", signinHandler);
router.get('/me', [verifyToken], getProfile);


export default router;
