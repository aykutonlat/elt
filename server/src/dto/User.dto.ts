import { IUser } from "../models/User.model";

export interface IUserDTO {
  id: string;
  username: string;
  email: string;
  language: string;
}

export const toUserDTO = (user: IUser): IUserDTO => ({
  id: user._id,
  username: user.username,
  email: user.email,
  language: user.language,
});
