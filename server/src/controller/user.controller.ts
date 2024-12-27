import { Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../services/userService";

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
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error registering user: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong during registration." });
  }
};
