import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateOptions } from "./hooks.js";

const waterSchema = new Schema(
  {
    userWaterGoal: {
      type: Number,
      required: [true, "dayNorm can't be empty"],
    },
    date: {
      type: Date,
      required: true,
      default: new Date(),
    },
    quantity: {
      type: Number,
      required: [true, "Water quantity can't be empty"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: false }
);

waterSchema.post("save", handleSaveError);

waterSchema.pre("findOneAndUpdate", setUpdateOptions);
waterSchema.post("findOneAndUpdate", handleSaveError);

const Water = model("water", waterSchema);

export default Water;
