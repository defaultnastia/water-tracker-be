import Joi from "joi";

import { emailRegExp, passwordRegexp } from "../constants/user-constants.js";

export const userSignupSchema = Joi.object({
  userEmail: Joi.string().pattern(emailRegExp).required(),
  userPassword: Joi.string().pattern(passwordRegexp).required(),
});

export const userSigninSchema = Joi.object({
  userEmail: Joi.string().pattern(emailRegExp).required(),
  userPassword: Joi.string().pattern(passwordRegexp).required(),
});
