import mongoose, { Document, Schema, Types } from "mongoose";
import { Status } from "../enum/status.enum";
import { MemberShipType } from "../enum/memberShip.enum";

interface ICategory extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: Status;
  memberShipType: MemberShipType[];
  units: Types.ObjectId;
  contents: Types.ObjectId[];
}

const CategorySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Active,
    },
    description: {
      type: String,
      trim: true,
    },
    memberShipType: {
      type: [String],
      enum: Object.values(MemberShipType),
      default: [MemberShipType.Guest],
    },
    units: {
      type: Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    contents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Content",
      },
    ],
  },
  {
    timestamps: true,
  }
);

CategorySchema.virtual("fullDetails", {
  ref: "Content",
  localField: "contents",
  foreignField: "_id",
  justOne: false,
});

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
