import express from "express";
import dotenv from "dotenv";
import connectDB from "../config/connect/db";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
