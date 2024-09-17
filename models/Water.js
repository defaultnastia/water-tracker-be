import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateOptions } from "./hooks.js";

const waterRecord = new Schema({
  userWaterGoal: {
    type: Number,
    required: [true, "userWaterGoal can't be empty"],
  },
  date: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: [true, "Water quantity can't be empty"],
  },
});

const waterSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    waterRecords: [waterRecord],
  },
  { versionKey: false, timestamps: false }
);

waterSchema.post("save", handleSaveError);

waterSchema.pre("findOneAndUpdate", setUpdateOptions);
waterSchema.post("findOneAndUpdate", handleSaveError);

const Water = model("water", waterSchema);

export default Water;
