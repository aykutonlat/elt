import { Router } from "express";
import {
  resetPasswordFromMailValidationRules,
  resetSendPasswordMailValidationRules,
  userLoginValidationRules,
  userRegisterValidationRules,
} from "../validation/userValidation";
import { validate } from "../middlewares/validate";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  sendForgotPasswordMail,
  resetPasswordFromMail,
  verifyEmail,
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
  resetSendPasswordMailValidationRules,
  validate,
  sendForgotPasswordMail
);
authRouter.post(
  "/verify-forgot-password/:token",
  resetPasswordFromMailValidationRules,
  validate,
  resetPasswordFromMail
);
authRouter.get("/verify-email/:token", verifyEmail);
