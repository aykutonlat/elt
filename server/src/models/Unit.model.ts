import mongoose, { Document, Schema, Types } from "mongoose";
import { Status } from "../enum/status.enum";
import { MemberShipType } from "../enum/memberShip.enum";

interface IUnit extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: Status;
  memberShipType: MemberShipType[];
  ageGroup: Types.ObjectId;
  categories: Types.ObjectId[];
}

const UnitSchema: Schema = new Schema(
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
    ageGroup: {
      type: Schema.Types.ObjectId,
      ref: "AgeGroup",
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UnitSchema.virtual("fullDetails", {
  ref: "Category",
  localField: "categories",
  foreignField: "_id",
  justOne: false,
});

export const Unit = mongoose.model<IUnit>("Unit", UnitSchema);
