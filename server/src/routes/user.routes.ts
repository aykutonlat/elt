import { Router } from "express";
import {
  resetPasswordValidationRules,
  userLoginValidationRules,
  userRegisterValidationRules,
} from "../validation/userValidation";
import { validate } from "../middlewares/validate";
import { registerUser } from "../controller/user.controller";
import {
  loginUser,
  refreshAccessToken,
  sendForgotPassword,
} from "../controller/auth.controller";

export const authRouter = Router();

authRouter.post(
  "/register",
  userRegisterValidationRules,
  validate,
  registerUser
);

authRouter.post("/login", userLoginValidationRules, validate, loginUser);
authRouter.get("/refresh-token/:refreshToken", refreshAccessToken);
authRouter.post(
  "/forgot-password",
  resetPasswordValidationRules,
  validate,
  sendForgotPassword
);
