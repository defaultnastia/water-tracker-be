import mongoose from "mongoose";

export const initDBConnection = async (host) => {
  try {
    await mongoose.connect(host);
    console.log("Connection to DB is successful");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export const closeDBConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log("Closing DB is successful");
  } catch (error) {
    console.log(error.message);
  }
};
