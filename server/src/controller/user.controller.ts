import { Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../services/userService";
import { welcomeEmail } from "../templates/emails/welcome";
import { toUserDTO } from "../dto/User.dto";

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
    res.status(201).json({ user: toUserDTO(newUser) });
  } catch (error) {
    console.error("Error registering user: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong during registration." });
  }
};
