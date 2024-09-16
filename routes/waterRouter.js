import express from "express";

import waterControllers from "../controllers/waterControllers.js";

import {
  createWaterSchema,
  updateWaterSchema,
  updateDayNormSchema,
} from "../schemas/waterSchemas.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";

const createWaterMiddleware = validateBody(createWaterSchema);
const updateWaterMiddleware = validateBody(updateWaterSchema);
const updateDayNormMiddleware = validateBody(updateDayNormSchema);

const waterRouter = express.Router();

waterRouter.use(authenticate);

waterRouter.get("/", waterControllers.getWater);

waterRouter.get("/:id", waterControllers.getOneWater);

waterRouter.post("/", createWaterMiddleware, waterControllers.addWaterIncome);

waterRouter.put("/:id", updateWaterMiddleware, waterControllers.updateWater);

waterRouter.patch("/", updateDayNormMiddleware, waterControllers.updateDayNorm);

waterRouter.delete("/:id", waterControllers.removeWaterIncome);

export default waterRouter;
