import controllerWrapper from "../decorators/controllerWrapper.js";

const getWaterForMonth = async (req, res) => {};

export default {
  getWaterForMonth: controllerWrapper(getWaterForMonth),
};
