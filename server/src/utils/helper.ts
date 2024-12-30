import { UserGender, UserPosition } from "../enum/userRoles.enum";
import { IUser } from "../models/User.model";

export const calculateProfileCompletion = (user: IUser): number => {
  let score = 0;

  if (user.firstName) score += 10;
  if (user.lastName) score += 10;
  if (user.birthdate) score += 10;
  if (user.phone) score += 10;
  if (user.bio) score += 10;
  if (user.avatar) score += 10;
  if (user.emailVerified) score += 10;
  if (user.position && user.position !== UserPosition.Other) score += 10;
  if (user.gender && user.gender !== UserGender.Other) score += 10;
  if (
    user.socialLinks?.linkedin ||
    user.socialLinks?.twitter ||
    user.socialLinks?.facebook
  ) {
    score += 10;
  }

  return score;
};
