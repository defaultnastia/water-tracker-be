import "dotenv/config";
import startServer from "./server.js";
import { initDBConnection } from "./initDBConnection.js";

const bootstrap = async () => {
  await initDBConnection(process.env.DB_HOST);
  startServer();
};

bootstrap();
