import getStartAndEndOfPeriod from "../helpers/getStartAndEndPeriod.js";
import Water from "../models/Water.js";

export const listWater = (filter) => {
  const { year, month, day, owner } = filter;

  const { startPeriod, endPeriod } = getStartAndEndOfPeriod(year, month, day);

  return Water.find({
    owner,
    date: { $gte: startPeriod, $lt: endPeriod },
  });
};

export const getContactById = (filter) => Water.findOne(filter);

export const createWater = (data) => Water.create(data);

export const updateWaterById = (filter, data) =>
  Water.findOneAndUpdate(filter, data, { new: true, runValidators: true });

export const updateDayNormWater = (filter, data) => {
  const { year, month, day, owner } = filter;

  const { startPeriod, endPeriod } = getStartAndEndOfPeriod(year, month, day);

  return Water.updateMany(
    {
      owner,
      date: { $gte: startPeriod, $lt: endPeriod },
    },
    { $set: { userWaterGoal: data } }
  );
};

export const removeWater = (filter) => Water.findOneAndDelete(filter);
