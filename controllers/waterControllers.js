import * as waterService from "../services/waterServices.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";

const getWater = async (req, res) => {
  const { year, month, day, from, to, date } = req.query;
  const { _id: owner } = req.user;

  let startPeriod, endPeriod;

  if (from && to) {
    startPeriod = new Date(parseInt(from, 10));
    endPeriod = new Date(parseInt(to, 10));
  } else if (date) {
    const dateStr = date.toString();
    startPeriod = new Date(
      `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(
        6,
        8
      )}T00:00:00Z`
    );
    endPeriod = new Date(startPeriod);
    endPeriod.setDate(startPeriod.getDate() + 1);
  } else if (month && year) {
    startPeriod = new Date(`${year}-${month}-01T00:00:00Z`);
    endPeriod = new Date(startPeriod);
    endPeriod.setMonth(endPeriod.getMonth() + 1);
  } else if (year) {
    startPeriod = new Date(`${year}-01-01T00:00:00Z`);
    endPeriod = new Date(`${year}-12-31T23:59:59Z`);
  } else {
    throw HttpError(400, "Invalid query parameters");
  }

  const filter = {
    owner,
    startPeriod,
    endPeriod,
  };

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
