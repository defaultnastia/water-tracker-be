import express from "express";
import dotenv from "dotenv";

import waterRouter from "./routes/waterRouter.js";

dotenv.config();

const startServer = () => {
  const app = express();
  const port = Number(process.env.PORT);

  app.use("/api/water", waterRouter);

  return app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default startServer;
