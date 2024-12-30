import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  port: string;
  mongoUri: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtResetSecret: string;
  jwtAccessExp: string;
  jwtRefreshExp: string;
  jwtResetExp: string;
  mailUser: string;
  mailPass: string;
  frontendUrl?: string;
}

const env: EnvConfig = {
  port: process.env.PORT || "5000",
  mongoUri: process.env.MONGO_URI as string,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  jwtResetSecret: process.env.JWT_RESET_SECRET as string,
  jwtAccessExp: process.env.JWT_ACCESS_EXPIRES_IN as string,
  jwtRefreshExp: process.env.JWT_REFRESH_EXPIRES_IN as string,
  jwtResetExp: process.env.JWT_RESET_EXPIRES_IN as string,
  mailUser: process.env.MAIL_USER as string,
  mailPass: process.env.MAIL_PASS as string,
  frontendUrl: process.env.FRONTEND_URL,
};

export default env;
