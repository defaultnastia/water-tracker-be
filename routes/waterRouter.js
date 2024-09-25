import express from "express";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import isValidId from "../middlewares/isValidId.js";
import waterControllers from "../controllers/waterControllers.js";
import {
  createWaterSchema,
  updateWaterSchema,
  updateDayNormSchema,
} from "../schemas/waterSchemas.js";

const createWaterMiddleware = validateBody(createWaterSchema);
const updateWaterMiddleware = validateBody(updateWaterSchema);
const updateDayNormMiddleware = validateBody(updateDayNormSchema);

const waterRouter = express.Router();

waterRouter.use(authenticate);

waterRouter.get("/", waterControllers.getWater);

waterRouter.get("/:id", isValidId, waterControllers.getOneWater);

waterRouter.post("/", createWaterMiddleware, waterControllers.addWaterIncome);

waterRouter.put(
  "/:id",
  isValidId,
  updateWaterMiddleware,
  waterControllers.updateWater
);

waterRouter.patch("/", updateDayNormMiddleware, waterControllers.updateDayNorm);

waterRouter.delete("/:id", isValidId, waterControllers.removeWaterIncome);

export default waterRouter;
