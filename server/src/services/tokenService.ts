import { Token } from "../models/Token.model";
import { IUser } from "../models/User.model";
import { generateVerifyToken } from "../utils/tokens";

interface ISafeLinkPayload {
  type: "forgotPassword" | "verifyEmail";
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
