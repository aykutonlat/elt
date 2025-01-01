import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens";

interface DecodedToken {
  id: string;
  email: string;
  username: string;
  role: string;
}

export const isSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authorization token is required" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token) as DecodedToken;

    if (!decoded) {
      res.status(401).json({ message: "Invalid access token" });
      return;
    }

    if (decoded.role !== "super-admin") {
      res.status(403).json({ message: "Access denied. Super admins only." });
      return;
    }

    next();
  } catch (error) {
    console.error("Error validating admin: ", error);
    res.status(500).json({ message: "Something went wrong validating admin." });
  }
};
