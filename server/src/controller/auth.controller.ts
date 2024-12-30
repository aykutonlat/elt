import { Request, Response } from "express";
import { findUserByEmail, findUserByUsername } from "../services/userService";
import { comparePasswords } from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens";
import { UserStatus } from "../enum/userRoles.enum";
import { User } from "../models/User.model";
import { sendForgotPasswodMail } from "../templates/emails/forgotPassword";
import { createAndSaveToken } from "../services/tokenService";

/**
 * @param
 * @returns
 */

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;
    const user =
      (await findUserByEmail(identifier)) ||
      (await findUserByUsername(identifier));
    if (!user) {
      res.status(400).json({ message: "User not found." });
      return;
    }
    if (user.status === UserStatus.Suspended) {
      res.status(403).json({
        message: "Account is suspended. Please contact support.",
      });
      return;
    }
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.status = UserStatus.Suspended;
        user.loginAttempts = 0;
        await user.save();
        res.status(403).json({
          message: "Account suspended due to too many failed login attempts.",
        });
        return;
      }
      await user.save();
      res.status(400).json({ message: "Invalid password." });
      return;
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.loginAttempts = 0;
    await user.save();

    res.status(200).json({
      message: "Login successful.",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error logging in user: ", error);
    res.status(500).json({ message: "Something went wrong during login." });
  }
};

/**
 * @param
 * @returns
 */

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.params;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required." });
      return;
    }
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({ message: "Invalid refresh token." });
      return;
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(400).json({ message: "User not found." });
      return;
    }
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Error refreshing access token: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong during token refresh." });
  }
};

/**
 * @param
 * @returns
 */

export const sendForgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { identifier } = req.body;
    const user =
      (await findUserByEmail(identifier)) ||
      (await findUserByUsername(identifier));
    if (!user) {
      res.status(400).json({ message: "User not found." });
      return;
    }
    const typeAndToken = await createAndSaveToken({
      type: "forgotPassword",
      user,
    });
    const sendResetPasswordEmail = await sendForgotPasswodMail({
      username: user.username,
      email: user.email,
      resetToken: typeAndToken.resetToken,
      type: typeAndToken.type,
    });
    if (!sendResetPasswordEmail) {
      res.status(500).json({ message: "Error sending reset email." });
      return;
    }
    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Error sending password reset email: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong while sending reset email." });
  }
};
