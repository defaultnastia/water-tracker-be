import express from "express";
import dotenv from "dotenv";

dotenv.config();

const startServer = () => {
  const app = express();
  const port = Number(process.env.PORT);

  return app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default startServer;
