import { Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../services/userService";
import { comparePasswords, hashPassword } from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyVerifyToken,
} from "../utils/tokens";
import { UserStatus } from "../enum/userRoles.enum";
import { User } from "../models/User.model";
import { sendForgotPasswodMail } from "../templates/emails/forgotPassword";
import {
  createAndSaveToken,
  findAndDeleteToken,
  verifyLinkToken,
} from "../services/tokenService";
import { welcomeEmail } from "../templates/emails/welcome";
import { toUserDTO } from "../dto/User.dto";
import { sendVerifyEmail } from "../templates/emails/verifyEmail";

/**
 * @param
 * @returns
 */

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      res.status(400).json({ message: "Email already in use." });
      return;
    }
    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      res.status(400).json({ message: "Username already in use." });
      return;
    }
    const newUser = await createUser({ username, email, password });
    const sendWelcomeEmail = await welcomeEmail(
      newUser.username,
      newUser.email
    );
    if (!sendWelcomeEmail) {
      res.status(500).json({ message: "Error sending welcome email." });
      return;
    }
    const typeAndToken = await createAndSaveToken({
      type: "verify-email",
      user: newUser,
    });
    const sendVerifiedEmail = await sendVerifyEmail({
      username: newUser.username,
      email: newUser.email,
      resetToken: typeAndToken.resetToken,
      type: typeAndToken.type,
    });
    if (!sendVerifiedEmail) {
      res.status(500).json({ message: "Error sending verification email." });
      return;
    }
    res.status(201).json({ user: toUserDTO(newUser) });
  } catch (error) {
    console.error("Error registering user: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong during registration." });
  }
};

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
      res.status(401).json({ message: "Invalid refresh connection." });
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

export const sendForgotPasswordMail = async (
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
      type: "verify-forgot-password",
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

/**
 * @param
 * @returns
 */

export const resetPasswordFromMail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { password } = req.body;
    const { token: resetToken } = req.params;
    const decoded = verifyVerifyToken(resetToken);
    if (!decoded) {
      res.status(401).json({
        message:
          "The password reset link is invalid or has expired. Please request a new link.",
      });
      return;
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(400).json({
        message:
          "The user associated with this link could not be found. Please request a new password reset link.",
      });
      return;
    }
    const isValidToken = await verifyLinkToken({
      type: "verify-forgot-password",
      user,
      resetToken,
    });
    if (!isValidToken) {
      res.status(401).json({
        message:
          "This password reset link has already been used or is no longer valid.",
      });
      return;
    }
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.loginAttempts = 0;
    user.status = UserStatus.Active;
    await user.save();
    await findAndDeleteToken({
      type: "verify-forgot-password",
      user,
      resetToken,
    });
    res.status(200).json({ message: "Password has been successfully reset." });
  } catch (error) {
    console.error("Error resetting password: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong while resetting password." });
  }
};

/**
 * @param
 * @returns
 */

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token: resetToken } = req.params;
    const decoded = verifyVerifyToken(resetToken);
    if (!decoded) {
      res.status(401).json({
        message:
          "The email verification link is invalid or has expired. Please request a new link.",
      });
      return;
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(400).json({
        message:
          "The user associated with this link could not be found. Please request a new email verification link.",
      });
      return;
    }
    if (user.status === UserStatus.Active) {
      res.status(400).json({ message: "Email is already verified." });
      return;
    }
    const isValidToken = await verifyLinkToken({
      type: "verify-email",
      user,
      resetToken,
    });
    if (!isValidToken) {
      res.status(401).json({
        message:
          "This email verification link has already been used or is no longer valid.",
      });
      return;
    }
    user.status = UserStatus.Active;
    await user.save();
    await findAndDeleteToken({
      type: "verify-email",
      user,
      resetToken,
    });
    res.status(200).json({ message: "Email has been successfully verified." });
  } catch (error) {
    console.error("Error verifying email: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong while verifying email." });
  }
};
