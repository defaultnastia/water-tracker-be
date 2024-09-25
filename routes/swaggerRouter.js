import { Router } from "express";
import * as swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };

const swaggerRouter = Router();

swaggerRouter.get("/", swaggerUi.setup(swaggerDocument));

export default swaggerRouter;
