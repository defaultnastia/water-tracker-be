import mongoose from "mongoose";
import getStartAndEndOfPeriod from "../helpers/getStartAndEndPeriod.js";
import HttpError from "../helpers/HttpError.js";
import Water from "../models/Water.js";
import User from "../models/User.js";

const { ObjectId } = mongoose.Types;

export const listWater = async (filter) => {
  const { year, month, day, timezoneOffset, owner } = filter;

  const { startPeriodLTZ, endPeriodLTZ } = getStartAndEndOfPeriod(
    year,
    month,
    day
  );

  const waters = await Water.aggregate([
    { $match: { owner } },
    {
      $unwind: "$waterRecords",
    },
    {
      $addFields: {
        "waterRecords.adjustedDate": {
          $add: [
            "$waterRecords.date",
            { $multiply: [timezoneOffset, 60 * 60000] },
          ],
        },
      },
    },
    {
      $match: {
        "waterRecords.adjustedDate": { $gte: startPeriod, $lt: endPeriod },
      },
    },
    {
      $replaceRoot: {
        newRoot: "$waterRecords",
      },
    },
  ]);
  return waters;
};

export const getContactById = (filter) => {
  const { _id, owner } = filter;

  const water = Water.aggregate([
    { $match: { owner } },
    {
      $unwind: "$waterRecords",
    },
    {
      $match: {
        "waterRecords._id": new ObjectId(_id),
      },
    },
    {
      $replaceRoot: {
        newRoot: "$waterRecords",
      },
    },
  ]);

  return water;
};

export const createWater = async (data) => {
  const { owner, waterRecords } = data;

  const water = await Water.findOne({ owner });

  if (!water) {
    const newWater = await Water.create(data);

    const filter = { _id: owner };

    await User.findOneAndUpdate(filter, { trackerSetId: newWater._id });

    return newWater;
  }

  const updatedWater = await Water.findOneAndUpdate(
    { _id: water._id },
    { $push: { waterRecords: waterRecords[0] } },
    { new: true, runValidators: true }
  );

  return waterRecords[0];
};

export const updateWaterById = async (filter, data) => {
  const { _id, owner } = filter;

  const updateFields = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      updateFields[`waterRecords.$.${key}`] = data[key];
    }
  }

  await Water.findOneAndUpdate(
    { owner, "waterRecords._id": new ObjectId(_id) },
    { $set: updateFields },
    {
      new: true,
      runValidators: true,
    }
  );

  const water = await Water.aggregate([
    { $match: { owner } },
    { $unwind: "$waterRecords" },
    { $match: { "waterRecords._id": new ObjectId(_id) } },
    { $replaceRoot: { newRoot: "$waterRecords" } },
  ]);
  return water;
};

export const updateDayNormWater = async (filter, data) => {
  const { year, month, day, owner } = filter;

  const { startPeriod, endPeriod } = getStartAndEndOfPeriod(year, month, day);

  const waters = await Water.aggregate([
    { $match: { owner: new ObjectId(owner) } },
    { $unwind: "$waterRecords" },
    {
      $match: {
        "waterRecords.date": {
          $gte: new Date(startPeriod),
          $lt: new Date(endPeriod),
        },
      },
    },
    { $project: { "waterRecords._id": 1 } },
  ]);

  const recordIds = waters.map((record) => record.waterRecords._id);

  for (const id of recordIds) {
    await Water.updateOne(
      { "waterRecords._id": id },
      { $set: { "waterRecords.$.userWaterGoal": data } }
    );
  }

  return { modifiedCount: recordIds.length };
};

export const removeWater = async (filter) => {
  const { _id, owner } = filter;

  const result = await Water.findOneAndUpdate(
    { owner },
    { $pull: { waterRecords: { _id: new ObjectId(_id) } } },
    { new: true }
  );

  if (!result) {
    throw HttpError(404, `Object with id: ${_id} not found`);
  }
};
