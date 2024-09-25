import Joi from "joi";

import {
  emailRegExp,
  passwordRegexp,
  gendersList,
} from "../constants/user-constants.js";

export const userSignupSchema = Joi.object({
  userEmail: Joi.string().pattern(emailRegExp).required(),
  userPassword: Joi.string().pattern(passwordRegexp).required(),
});

export const userSigninSchema = Joi.object({
  userEmail: Joi.string().pattern(emailRegExp).required(),
  userPassword: Joi.string().pattern(passwordRegexp).required(),
});

export const userUpdateSchema = Joi.object({
  userName: Joi.string(),
  userEmail: Joi.string().pattern(emailRegExp),
  userAvatar: Joi.string(),
  userGender: Joi.string().valid(...gendersList),
  userWeight: Joi.number().min(3).max(635),
  userActiveTime: Joi.number().min(0).max(24),
  userWaterGoal: Joi.number().min(1000).max(15000),
});

export const userChangePasswordSchema = Joi.object({
  userNewPassword: Joi.string().pattern(passwordRegexp).required(),
});
