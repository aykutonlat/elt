import mongoose, { Document, Schema, Types } from "mongoose";
import { Status } from "../enum/status.enum";
import { MemberShipType } from "../enum/memberShip.enum";

export interface ILesson extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  ageGroup: Types.ObjectId[];
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
    ageGroup: [
      {
        type: Schema.Types.ObjectId,
        ref: "AgeGroup",
      },
    ],
    memberShipType: {
      type: [String],
      enum: Object.values(MemberShipType),
      default: [MemberShipType.Guest],
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

LessonListSchema.virtual("fullDetails", {
  ref: "AgeGroup",
  localField: "ageGroup",
  foreignField: "_id",
  justOne: false,
});

export const Lesson = mongoose.model<ILesson>("LessonList", LessonListSchema);
