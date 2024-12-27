import { IUser, User } from "../models/User.model";
import { hashPassword } from "../utils/hash";

/**
 * @param
 * @returns
 */

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  try {
    const hashedPassword = await hashPassword(userData.password!);
    const user = new User({ ...userData, password: hashedPassword });
    return await user.save();
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error;
  }
};

/**
 * @param
 * @returns
 */

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  if (!email) {
    throw new Error("Email is required.");
  }
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error("Error finding user by email: ", error);
    throw error;
  }
};

/**
 * @param
 * @returns
 */

export const findUserByUsername = async (
  username: string
): Promise<IUser | null> => {
  if (!username) {
    throw new Error("Username is required.");
  }
  try {
    return await User.findOne({ username });
  } catch (error) {
    console.error("Error finding user by username: ", error);
    throw error;
  }
};
