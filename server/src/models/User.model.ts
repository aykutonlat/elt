import mongoose, { Document, Schema } from "mongoose";
import {
  UserGender,
  UserLanguages,
  UserPosition,
  UserRole,
  UserStatus,
} from "../enum/userRoles.enum";
import { MemberShipType } from "../enum/memberShip.enum";

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
  position: UserPosition;
  language: UserLanguages;
  gender: UserGender;
  avatar?: string;
  birthdate?: Date;
  phone?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  loginAttempts: number;
  timeZone: {
    region: string;
    offset: string;
  };
  profileCompletion: number;
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
      default: UserRole.User,
    },
    memberShipType: {
      type: [String],
      enum: Object.values(MemberShipType),
      default: MemberShipType.Free,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.Active,
    },
    position: {
      type: String,
      enum: Object.values(UserPosition),
      default: UserPosition.Other,
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
    phone: {
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
    timeZone: {
      region: {
        type: String,
        default: "UTC",
      },
      offset: {
        type: String,
        default: "+00:00",
      },
    },
    profileCompletion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
