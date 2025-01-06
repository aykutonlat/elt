import { Types } from "mongoose";
import { ILesson } from "../models/Lesson.model";
import { IAgeGroupDTO, toAgeGroupDTO } from "./AgeGroup.dto";

export interface ILessonDTO {
  id: Types.ObjectId;
  title: string;
  description: string;
  memberShipType: string[];
  status: string;
  createdAt: Date;
}

export const toLessonListDTO = (lesson: ILesson): ILessonDTO => ({
  id: lesson._id,
  title: lesson.title,
  description: lesson.description,
  memberShipType: lesson.memberShipType,
  status: lesson.status,
  createdAt: lesson.createdAt,
});
