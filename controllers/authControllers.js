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

  await authServices.updateUser({ _id }, { ...req.body });

  res.status(200).json({
    message: "User has been update",
  });
};

export default {
  userSignup: controllerWrapper(userSignup),
  userSignin: controllerWrapper(userSignin),
  userCurrent: controllerWrapper(userCurrent),
  userLogout: controllerWrapper(userLogout),
  userUpdate: controllerWrapper(userUpdate),
};