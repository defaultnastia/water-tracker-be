import { Router } from "express";

import authenticate from "../middlewares/authenticate.js";

import authControllers from "../controllers/authControllers.js";

import {
  userSignupSchema,
  userSigninSchema,
  userUpdateSchema,
} from "../schemas/userSchemas.js";
import validateBody from "../decorators/validateBody.js";

const userSignupMiddleware = validateBody(userSignupSchema);
const userSigninMiddleware = validateBody(userSigninSchema);
const userUpdateMiddleware = validateBody(userUpdateSchema);

const authRouter = Router();

authRouter.post("/signup", userSignupMiddleware, authControllers.userSignup);

authRouter.post("/signin", userSigninMiddleware, authControllers.userSignin);

authRouter.get("/current", authenticate, authControllers.userCurrent);

authRouter.post("/signout", authenticate, authControllers.userLogout);

authRouter.patch(
  "/",
  authenticate,
  userUpdateMiddleware,
  authControllers.userUpdate
);

export default authRouter;
