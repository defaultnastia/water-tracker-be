import * as waterService from "../services/waterServices.js";

import controllerWrapper from "../decorators/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";

const getWater = async (req, res) => {
  const { year, month, day, timezoneOffset } = req.query;
  const { _id: owner } = req.user;

  if (!year || !month || !timezoneOffset) {
    throw HttpError(400, "Year, month and timezone are required in request");
  }

  let filter;

  if (!day) {
    filter = {
      owner,
      year,
      month,
      timezoneOffset,
    };
  } else {
    filter = {
      owner,
      year,
      month,
      day,
      timezoneOffset,
    };
  }

  const result = await waterService.listWater(filter);

  if (!result) throw HttpError(404, "No water records found for this user");

  res.json(result);
};

const getOneWater = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await waterService.getContactById({ _id: id, owner });

  if (!result[0]) {
    throw HttpError(404, `Water with id - ${id} not found`);
  }

  res.json(result[0]);
};

const addWaterIncome = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await waterService.createWater({ ...req.body, owner });

  res.status(201).json(result);
};

const updateWater = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await waterService.updateWaterById(
    { _id: id, owner },
    req.body
  );

  if (!result[0]) {
    throw HttpError(404, `Water with id - ${id} not found`);
  }

  res.json(result[0]);
};

const updateDayNorm = async (req, res) => {
  const { year, month, day } = req.query;
  const { _id: owner } = req.user;
  const { userWaterGoal } = req.body;

  if (!year || !month || !day) {
    throw HttpError(400, "Year, month, day are required in request");
  }

  const filter = {
    year,
    month,
    day,
    owner,
  };

  const result = await waterService.updateDayNormWater(filter, userWaterGoal);

  if (!result) {
    throw HttpError(400);
  }

  res.json(result);
};

const removeWaterIncome = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  await waterService.removeWater({ _id: id, owner });

  res.status(204).json();
};

export default {
  getWater: controllerWrapper(getWater),
  getOneWater: controllerWrapper(getOneWater),
  addWaterIncome: controllerWrapper(addWaterIncome),
  updateWater: controllerWrapper(updateWater),
  updateDayNorm: controllerWrapper(updateDayNorm),
  removeWaterIncome: controllerWrapper(removeWaterIncome),
};
