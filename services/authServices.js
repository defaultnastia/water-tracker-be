import bcrypt from "bcryptjs";

import User from "../models/User.js";

import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";

export const findUser = (user) => User.findOne(user);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const allUsers = () => User.find();

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

  const accessToken = createToken(payload, 1, false);
  const refreshToken = createToken(payload, 24, true);

  await updateUser({ _id: user._id }, { accessToken, refreshToken });

  const {
    accessToken: _accessToken,
    refreshToken: _refreshToken,
    userPassword: _userPassword,
    verificationToken: _verificationToken,
    ...userData
  } = user.toObject();

  return {
    accessToken,
    refreshToken,
    userData,
  };
};

export const refreshToken = async (data) => {
  const { _id, token } = data;
  const user = await findUser({ _id });

  if (!user) throw HttpError(400, "User not found");

  if (token !== user.refreshToken)
    throw HttpError(400, "Refresh token does not match");

  const payload = {
    id: user._id,
  };

  const accessToken = createToken(payload, 1, false);

  await updateUser({ _id: user._id }, { accessToken });

  return accessToken;
};

export const changePassword = async (data) => {
  const { _id, userNewPassword } = data;
  const user = await findUser(_id);

  if (!user) throw HttpError(401, "User not found");

  const hashNewPassword = await bcrypt.hash(userNewPassword, 10);

  return await updateUser(
    { _id },
    { userPassword: hashNewPassword, verificationToken: null }
  );
};
