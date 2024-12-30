import { Token } from "../models/Token.model";
import { IUser } from "../models/User.model";
import { generateVerifyToken } from "../utils/tokens";

interface ISafeLinkPayload {
  type: "verify-forgot-password" | "verify-email";
  user: IUser;
}

export const createAndSaveToken = async (
  payload: ISafeLinkPayload
): Promise<{ type: string; resetToken: string }> => {
  try {
    const { type, user } = payload;
    const resetToken = generateVerifyToken(user);

    let userTokens = await Token.findOne({ userId: user._id });

    if (!userTokens) {
      userTokens = new Token({
        userId: user._id,
        validTokens: { [type]: resetToken },
        invalidTokens: [],
      });
      await userTokens.save();
      return { type, resetToken };
    }

    const existingToken = userTokens.validTokens[type];

    if (existingToken) {
      if (!userTokens.invalidTokens.includes(existingToken)) {
        userTokens.invalidTokens.push(existingToken);
      }
    }

    userTokens.validTokens[type] = resetToken;

    userTokens.markModified("validTokens");
    userTokens.markModified("invalidTokens");

    await userTokens.save();

    return { type, resetToken };
  } catch (error) {
    console.error("Error creating safe link: ", error);
    throw error;
  }
};

interface IVerifyLinkToken {
  type: "verify-forgot-password" | "verify-email";
  user: IUser;
  resetToken: string;
}

export const verifyLinkToken = async (
  payload: IVerifyLinkToken
): Promise<boolean> => {
  try {
    const { type, user } = payload;
    const userTokens = await Token.findOne({ userId: user._id });

    if (!userTokens) {
      return false;
    }

    const token = userTokens.validTokens[type];

    if (!token) {
      return false;
    }

    if (userTokens.invalidTokens.includes(token)) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying safe link: ", error);
    throw error;
  }
};

export const findAndDeleteToken = async (
  payload: IVerifyLinkToken
): Promise<boolean> => {
  try {
    const { type, user, resetToken } = payload;
    const userTokens = await Token.findOne({ userId: user._id });

    if (!userTokens) {
      return false;
    }

    const token = userTokens.validTokens[type];

    if (!token) {
      return false;
    }

    if (token !== resetToken) {
      return false;
    }

    delete userTokens.validTokens[type];
    userTokens.markModified("validTokens");
    userTokens.invalidTokens.push(token);
    userTokens.markModified("invalidTokens");

    await userTokens.save();

    return true;
  } catch (error) {
    console.error("Error deleting safe link: ", error);
    throw error;
  }
};
