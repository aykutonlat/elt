import mongoose from "mongoose";
import env from "../env/env";

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri as string);
    console.log("MongoDB connected.");
  } catch (error) {
    console.error("MongoDB connection failed.");
    process.exit(1);
  }
};

export default connectDB;
