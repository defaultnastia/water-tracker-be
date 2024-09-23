import cloudinary from "../helpers/cloudinary.js";
import * as fs from "node:fs/promises";

import * as authServices from "../services/authServices.js";

import controllerWrapper from "../decorators/controllerWrapper.js";

const userSignup = async (req, res) => {
  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    user: {
      email: newUser.userEmail,
    },
  });
};

const userSignin = async (req, res) => {
  const { accessToken, user } = await authServices.signin(req.body);

  res.json({
    accessToken,
    user,
  });
};

const userCurrent = async (req, res) => {
  const {
    userName,
    userEmail,
    userAvatar,
    userGender,
    userWeight,
    userActiveTime,
    userWaterGoal,
    trackerSetId,
    accessToken,
  } = req.user;

  res.json({
    userName,
    userEmail,
    userAvatar,
    userGender,
    userWeight,
    userActiveTime,
    userWaterGoal,
    trackerSetId,
    accessToken,
  });
};

const userLogout = async (req, res) => {
  const { _id } = req.user;

  await authServices.updateUser(
    { _id },
    { accessToken: null, refreshToken: null }
  );

  res.status(204).json();
};

const userUpdate = async (req, res) => {
  const { _id } = req.user;

  let userAvatar;

  if (req.file) {
    const { path } = req.file;
    const { url } = await cloudinary.uploader.upload(path, {
      folder: "avatars",
    });

    await fs.unlink(path);

    userAvatar = url;
  }

  await authServices.updateUser({ _id }, { ...req.body, userAvatar });

  res.status(200).json({
    message: "User has been updated",
  });
};

const getAllUsers = async (_, res) => {
  const users = await authServices.allUsers();

  res.status(200).json(users.length);
};

const userRefreshToken = async (req, res) => {
  const { _id } = req.user;
  const { authorization } = req.headers;
  const [_, token] = authorization.split(" ");

  const accessToken = await authServices.refreshToken({ _id, token });

  res.status(200).json({ accessToken });
};

export default {
  userSignup: controllerWrapper(userSignup),
  userSignin: controllerWrapper(userSignin),
  userCurrent: controllerWrapper(userCurrent),
  userLogout: controllerWrapper(userLogout),
  userUpdate: controllerWrapper(userUpdate),
  getAllUsers: controllerWrapper(getAllUsers),
  userRefreshToken: controllerWrapper(userRefreshToken),
};
