import express from "express";

import waterControllers from "../controllers/waterControllers.js";

const waterRouter = express.Router();

waterRouter.get("/", waterControllers.getWaterForMonth);

export default waterRouter;
