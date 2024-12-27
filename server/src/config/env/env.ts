import dotenv from "dotenv";

dotenv.config();

const env = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
};

export default env;
