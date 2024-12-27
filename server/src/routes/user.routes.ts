import { Router } from "express";
import { userValidationRules } from "../validation/userValidation";
import { validate } from "../middlewares/validate";
import { registerUser } from "../controller/user.controller";

export const userRouter = Router();

userRouter.post("/register", userValidationRules, validate, registerUser);

export const userWithIdRouter = Router();

userRouter.use("/:id", userWithIdRouter);
