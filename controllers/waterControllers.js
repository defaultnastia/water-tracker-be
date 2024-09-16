import * as waterService from "../services/waterServices.js";

import controllerWrapper from "../decorators/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";

const getWater = async (req, res) => {
  const { year, month, day } = req.query;
  const { _id: owner } = req.user;

  if (!year || !month) {
    throw HttpError(400, "Year, month are required in request");
  }

  let filter;

  if (!day) {
    filter = {
      owner,
      year,
      month,
    };
  } else {
    filter = {
      owner,
      year,
      month,
      day,
    };
  }

  const result = await waterService.listWater(filter);

  res.json(result);
};

const getOneWater = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await waterService.getContactById({ _id: id, owner });

  if (!result) {
    throw HttpError(404, `Water with id - ${id} not found`);
  }

  res.json(result);
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

  if (!result) {
    throw HttpError(404, `Water with id - ${id} not found`);
  }

  res.json(result);
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

  const result = await waterService.removeWater({ _id: id, owner });

  res.json(result);
};

export default {
  getWater: controllerWrapper(getWater),
  getOneWater: controllerWrapper(getOneWater),
  addWaterIncome: controllerWrapper(addWaterIncome),
  updateWater: controllerWrapper(updateWater),
  updateDayNorm: controllerWrapper(updateDayNorm),
  removeWaterIncome: controllerWrapper(removeWaterIncome),
};
