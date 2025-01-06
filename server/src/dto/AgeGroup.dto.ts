import { Types } from "mongoose";
import { IAgeGroup } from "../models/AgeGroup.model";
import { ILessonDTO, toLessonListDTO } from "./Lesson.dto";

export interface IAgeGroupDTO {
  id: Types.ObjectId;
  title: string;
  minAge: number;
  maxAge: number;
  status: string;
  memberShipType: string[];
  lesson: ILessonDTO;
}

export const toAgeGroupDTO = (ageGroup: IAgeGroup): IAgeGroupDTO => ({
  id: ageGroup._id,
  title: ageGroup.title,
  minAge: ageGroup.minAge,
  maxAge: ageGroup.maxAge,
  status: ageGroup.status,
  memberShipType: ageGroup.memberShipType,
  lesson: toLessonListDTO(ageGroup.lesson as any),
});
