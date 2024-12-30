import env from "../config/env/env";
import jwt from "jsonwebtoken";
import { IUser } from "../models/User.model";

export const generateAccessToken = (payload: IUser): string => {
  const tokenData = {
    id: payload._id,
    email: payload.email,
    username: payload.username,
    role: payload.role,
  };
  return jwt.sign(tokenData, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExp,
    algorithm: "HS256",
  });
};

export const generateRefreshToken = (payload: IUser): string => {
  const tokenData = {
    id: payload._id,
  };
  return jwt.sign(tokenData, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExp,
    algorithm: "HS256",
  });
};

export const generateVerifyToken = (payload: IUser): string => {
  const tokenData = {
    id: payload._id,
  };
  return jwt.sign(tokenData, env.jwtResetSecret, {
    expiresIn: env.jwtResetExp,
    algorithm: "HS256",
  });
};

interface verifyAccessToken {
  id: string;
  email: string;
  username: string;
  role: string;
}

export const verifyAccessToken = (token: string): verifyAccessToken | null => {
  try {
    return jwt.verify(token, env.jwtAccessSecret) as verifyAccessToken;
  } catch (error: any) {
    console.error("Invalid Access Token:", error.message);
    return null;
  }
};

interface verifyRefreshToken {
  id: string;
}

export const verifyRefreshToken = (
  token: string
): verifyRefreshToken | null => {
  try {
    return jwt.verify(token, env.jwtRefreshSecret) as verifyRefreshToken;
  } catch (error: any) {
    console.error("Invalid Refresh Token:", error.message);
    return null;
  }
};

interface verifyVerifyToken {
  id: string;
}

export const verifyVerifyToken = (token: string): verifyVerifyToken | null => {
  try {
    return jwt.verify(token, env.jwtResetSecret) as verifyVerifyToken;
  } catch (error: any) {
    console.error("Invalid Reset Token:", error.message);
    return null;
  }
};
