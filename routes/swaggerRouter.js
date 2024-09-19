import { Router } from "express";
import swaggerDocument from "../swagger.json" assert { type: "json" };
import * as swaggerUi from "swagger-ui-express";

const swaggerRouter = Router();

swaggerRouter.get("/", swaggerUi.setup(swaggerDocument));

export default swaggerRouter;
