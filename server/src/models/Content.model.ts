import mongoose, { Document, Schema, Types } from "mongoose";
import { Status } from "../enum/status.enum";
import { MemberShipType } from "../enum/memberShip.enum";

interface IContent extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  type: string;
  data: string;
  status: Status;
  memberShipType: MemberShipType[];
  category: Types.ObjectId;
}

const ContentSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "video", "image", "exercise"],
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Active,
    },
    memberShipType: {
      type: [String],
      enum: Object.values(MemberShipType),
      default: [MemberShipType.Guest],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ContentSchema.virtual("fullDetails", {
  ref: "Category",
  localField: "category",
  foreignField: "_id",
  justOne: false,
});

export const Content = mongoose.model<IContent>("Content", ContentSchema);
