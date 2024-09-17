import Joi from "joi";

export const createWaterSchema = Joi.object({
  waterRecords: Joi.array().items(
    Joi.object({
      userWaterGoal: Joi.number().integer().min(1000).max(15000).required(),
      date: Joi.date().required(),
      quantity: Joi.number().integer().min(50).max(5000).required(),
    })
  ),
});

export const updateWaterSchema = Joi.object({
  quantity: Joi.number().integer().min(50).max(5000),
  date: Joi.date(),
}).or("quantity", "date");

export const updateDayNormSchema = Joi.object({
  userWaterGoal: Joi.number().integer().min(1000).max(15000).required(),
});
