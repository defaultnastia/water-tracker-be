import cloudinary from "../helpers/cloudinary.js";
import * as fs from "node:fs/promises";

import * as authServices from "../services/authServices.js";

import controllerWrapper from "../decorators/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";

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

    try {
      const { url } = await cloudinary.uploader.upload(path, {
        folder: "avatars",
      });
      userAvatar = url;
    } catch (error) {
      throw HttpError(
        500,
        "Something went wrong with uploading the file to cloud"
      );
    } finally {
      await fs.unlink(path);
    }
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

export default {
  userSignup: controllerWrapper(userSignup),
  userSignin: controllerWrapper(userSignin),
  userCurrent: controllerWrapper(userCurrent),
  userLogout: controllerWrapper(userLogout),
  userUpdate: controllerWrapper(userUpdate),
  getAllUsers: controllerWrapper(getAllUsers),
};
