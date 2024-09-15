import { Schema, model } from "mongoose";

const waterSchema = new Schema(
  {
    dayNorm: {
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
  },
  { versionKey: false, timestamps: false }
);

const Water = model("water", waterSchema);

export default Water;
