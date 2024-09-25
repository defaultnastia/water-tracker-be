import cloudinary from "../helpers/cloudinary.js";
import * as fs from "node:fs/promises";
import * as authServices from "../services/authServices.js";
import { v4 as uuidv4 } from "uuid";

import controllerWrapper from "../decorators/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";
import sendMail from "../helpers/sendMail.js";

const userSignup = async (req, res) => {
  const verificationToken = uuidv4();
  const newUser = await authServices.signup({ ...req.body, verificationToken });

  res.status(201).json({
    userData: {
      userEmail: newUser.userEmail,
    },
  });
};

const userSignin = async (req, res) => {
  const { accessToken, refreshToken, userData } = await authServices.signin(
    req.body
  );

  res.json({
    accessToken,
    refreshToken,
    userData,
  });
};

const userCurrent = async (req, res) => {
  const user = req.user;

  const {
    accessToken,
    refreshToken,
    userPassword,
    verificationToken,
    ...userData
  } = user.toObject();

  res.json({
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    userData,
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

const userRefreshToken = async (req, res) => {
  const { _id } = req.user;
  const { authorization } = req.headers;
  const [_, token] = authorization.split(" ");

  const accessToken = await authServices.refreshToken({ _id, token });

  res.status(200).json({ accessToken });
};

const userChangePassword = async (req, res) => {
  const { verificationToken } = req.params;
  const { userNewPassword } = req.body;
  const user = await authServices.findUser({ verificationToken });

  if (!user) throw HttpError(404, "User not found");

  const { _id, verificationToken: vfToken } = user;

  if (verificationToken !== vfToken)
    throw HttpError(400, "Verification token does not match");

  await authServices.changePassword({
    _id,
    userNewPassword,
  });

  res.status(200).json({
    message: "Password has been update",
  });
};

const userForgotPassword = async (req, res) => {
  const { userEmail } = req.body;

  if (!userEmail) throw HttpError(400, "Missing required field userEmail");

  const user = await authServices.findUser({ userEmail });

  if (!user) throw HttpError(404, "User not found");

  sendMail(user.userEmail, user.verificationToken);

  res.status(200).json({
    message: "A password reset email has been sent",
  });
};

export default {
  userSignup: controllerWrapper(userSignup),
  userSignin: controllerWrapper(userSignin),
  userCurrent: controllerWrapper(userCurrent),
  userLogout: controllerWrapper(userLogout),
  userUpdate: controllerWrapper(userUpdate),
  getAllUsers: controllerWrapper(getAllUsers),
  userRefreshToken: controllerWrapper(userRefreshToken),
  userChangePassword: controllerWrapper(userChangePassword),
  userForgotPassword: controllerWrapper(userForgotPassword),
};
