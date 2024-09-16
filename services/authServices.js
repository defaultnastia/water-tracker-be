import bcrypt from "bcryptjs";

import User from "../models/User.js";

import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";

export const findUser = (user) => User.findOne(user);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const signup = async (data) => {
  const { userEmail, userPassword } = data;
  const user = await findUser({ userEmail });

  if (user) throw HttpError(409, "Email is already in use");

  const hashPassword = await bcrypt.hash(userPassword, 10);

  return User.create({ ...data, userPassword: hashPassword });
};

export const signin = async (data) => {
  const { userEmail, userPassword } = data;
  const user = await findUser({ userEmail });

  if (!user) throw HttpError(401, "Email or password is wrong");

  const passwordCompare = await bcrypt.compare(userPassword, user.userPassword);

  if (!passwordCompare) throw HttpError(401, "Email or password is wrong");

  const payload = {
    id: user._id,
  };

  const userToken = createToken(payload);

  await updateUser({ _id: user._id }, { userToken });

  return {
    userToken,
    user: {
      userEmail: user.userEmail,
    },
  };
};