import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../decorators/validateBody.js";
import {
  userSignupSchema,
  userSigninSchema,
  userUpdateSchema,
  userChangePasswordSchema,
} from "../schemas/userSchemas.js";

const userSignupMiddleware = validateBody(userSignupSchema);
const userSigninMiddleware = validateBody(userSigninSchema);
const userUpdateMiddleware = validateBody(userUpdateSchema);
const userChangePasswordMiddleware = validateBody(userChangePasswordSchema);

const authRouter = Router();

authRouter.post("/signup", userSignupMiddleware, authControllers.userSignup);

authRouter.post("/signin", userSigninMiddleware, authControllers.userSignin);

authRouter.get("/current", authenticate, authControllers.userCurrent);

authRouter.post("/signout", authenticate, authControllers.userLogout);

authRouter.patch(
  "/",
  authenticate,
  upload.single("userAvatar"),
  userUpdateMiddleware,
  authControllers.userUpdate
);

authRouter.get("/", authControllers.getAllUsers);

authRouter.get(
  "/refresh-token",
  authenticate,
  authControllers.userRefreshToken
);

authRouter.patch(
  "/password-recovery/:verificationToken",
  userChangePasswordMiddleware,
  authControllers.userChangePassword
);

authRouter.post("/forgot-password", authControllers.userForgotPassword);

export default authRouter;
