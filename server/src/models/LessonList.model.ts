import mongoose, { Document, Schema } from "mongoose";
import { Status } from "../enum/status.enum";
import { MemberShipType } from "../enum/memberShip.enum";

interface ILessonList extends Document {
  _id: string;
  title: string;
  description: string;
  ageGroup: mongoose.Types.ObjectId[];
  memberShipType: MemberShipType[];
  status: Status;
  createdAt: Date;
}

const LessonListSchema: Schema = new Schema(
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
    ageGroup: {
      type: [Schema.Types.ObjectId],
      ref: "AgeGroup",
      required: true,
    },
    memberShipType: {
      type: [String],
      enum: Object.values(MemberShipType),
      default: [MemberShipType.Guest, MemberShipType.Free],
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Active,
    },
  },
  {
    timestamps: true,
  }
);

export const LessonList = mongoose.model<ILessonList>(
  "LessonList",
  LessonListSchema
);
