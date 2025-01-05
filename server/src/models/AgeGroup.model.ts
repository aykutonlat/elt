import mongoose, { Document, Schema, Types } from "mongoose";
import { Status } from "../enum/status.enum";
import { MemberShipType } from "../enum/memberShip.enum";

interface IAgeGroup extends Document {
  _id: Types.ObjectId;
  title: string;
  minAge: number;
  maxAge: number;
  description: string;
  status: Status;
  memberShipType: MemberShipType[];
  lesson: Types.ObjectId;
  units: Types.ObjectId[];
}

const AgeGroupSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    minAge: {
      type: Number,
      required: true,
    },
    maxAge: {
      type: Number,
      required: true,
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
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "LessonList",
      required: true,
    },
    units: [
      {
        type: Schema.Types.ObjectId,
        ref: "Unit",
      },
    ],
  },
  {
    timestamps: true,
  }
);

AgeGroupSchema.virtual("fullDetails", {
  ref: "Unit",
  localField: "units",
  foreignField: "_id",
  justOne: false,
});

export const AgeGroup = mongoose.model<IAgeGroup>("AgeGroup", AgeGroupSchema);
