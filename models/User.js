import { Schema, model } from "mongoose";

import { handleSaveError, setUpdateOptions } from "./hooks.js";
import { emailRegExp, gendersList } from "../constants/user-constants.js";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      default: null,
    },
    userEmail: {
      type: String,
      match: emailRegExp,
      required: [true, "Email is required"],
      unique: true,
    },
    userPassword: {
      type: String,
      required: [true, "Password is required"],
    },
    userAvatar: {
      type: String,
      default: null,
    },
    userGender: {
      type: String,
      enum: gendersList,
      default: "female",
    },
    userWeight: {
      type: Number,
      default: null,
    },
    userActiveTime: {
      type: Number,
      default: null,
    },
    userWaterGoal: {
      type: Number,
      default: null,
    },
    trackerSetId: {
      type: Schema.Types.ObjectId,
      ref: "water",
      default: null,
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateOptions);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
