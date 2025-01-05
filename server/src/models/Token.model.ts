import mongoose, { Document, Schema, Types } from "mongoose";

export interface IToken extends Document {
  _id: Types.ObjectId;
  userId: string;
  validTokens: { [key: string]: string };
  invalidTokens: string[];
  createdAt: Date;
}

const TokenSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    validTokens: {
      type: Object,
      default: {},
    },
    invalidTokens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Token = mongoose.model<IToken>("Token", TokenSchema);
