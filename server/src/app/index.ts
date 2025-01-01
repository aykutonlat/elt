import express from "express";
import connectDB from "../config/connect/db";
import env from "../config/env/env";
import { authRouter } from "../routes/user.routes";
import { adminLessonRouter } from "../routes/lesson.routes";
import { isSuperAdmin } from "../middlewares/auth";

connectDB();

const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use("/admin", isSuperAdmin);
app.use("/admin/lesson", adminLessonRouter);

const PORT = env.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
