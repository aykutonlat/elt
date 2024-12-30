import mongoose, { Document, Schema } from "mongoose";
import {
  UserGender,
  UserLanguages,
  UserRole,
  UserStatus,
} from "../enum/userRoles.enum";

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  emailVerified: boolean;
  password: string;
  role: UserRole;
  status: UserStatus;
  language: UserLanguages;
  gender: UserGender;
  avatar?: string;
  birthdate?: Date;
  whatsapp?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  loginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Student,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.Active,
    },
    language: {
      type: String,
      enum: Object.values(UserLanguages),
      default: UserLanguages.English,
    },
    gender: {
      type: String,
      enum: Object.values(UserGender),
      default: UserGender.Other,
    },
    avatar: {
      type: String,
    },
    birthdate: {
      type: Date,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    socialLinks: {
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      facebook: { type: String, trim: true },
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
