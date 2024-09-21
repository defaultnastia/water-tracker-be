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
  const { userToken, user } = await authServices.signin(req.body);

  res.json({
    userToken,
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
    userToken,
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
    userToken,
  });
};

const userLogout = async (req, res) => {
  const { _id } = req.user;

  await authServices.updateUser({ _id }, { userToken: "" });

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

const userForgotPassword = async (req, res) => {
  const { _id } = req.user;
  const { userOldPassword, userNewPassword } = req.body;

  await authServices.forgotPassword({
    _id,
    userOldPassword,
    userNewPassword,
  });

  res.status(200).json({
    message: "Password has been update",
  });
};

export default {
  userSignup: controllerWrapper(userSignup),
  userSignin: controllerWrapper(userSignin),
  userCurrent: controllerWrapper(userCurrent),
  userLogout: controllerWrapper(userLogout),
  userUpdate: controllerWrapper(userUpdate),
  getAllUsers: controllerWrapper(getAllUsers),
  userForgotPassword: controllerWrapper(userForgotPassword),
};
