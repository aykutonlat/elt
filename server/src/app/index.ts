import express from "express";
import connectDB from "../config/connect/db";
import env from "../config/env/env";
import { userRouter } from "../routes/user.routes";

connectDB();

const app = express();
app.use(express.json());

app.use("/public", userRouter);

const PORT = env.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
