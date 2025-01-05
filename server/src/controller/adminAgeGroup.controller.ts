import { Request, Response } from "express";
import { LessonList } from "../models/LessonList.model";
import { AgeGroup } from "../models/AgeGroup.model";
import mongoose from "mongoose";

export const createAgeGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, minAge, maxAge, lessonId } = req.body;

    const lessonObjectId = new mongoose.Types.ObjectId(lessonId);
    const existingLesson = await LessonList.findById(lessonObjectId);
    if (!existingLesson) {
      res.status(404).json({ message: "Lesson list not found." });
      return;
    }

    const existingAgeGroups = await AgeGroup.find({ lesson: lessonObjectId });
    const isOverlapping = existingAgeGroups.some((group) => {
      return (
        (minAge >= group.minAge && minAge <= group.maxAge) ||
        (maxAge >= group.minAge && maxAge <= group.maxAge) ||
        (minAge <= group.minAge && maxAge >= group.maxAge)
      );
    });

    if (isOverlapping) {
      res.status(400).json({
        message: "Age group overlaps with existing age groups in the lesson.",
      });
      return;
    }

    const ageGroup = new AgeGroup({
      title,
      minAge,
      maxAge,
      lesson: lessonObjectId,
    });
    await ageGroup.save();
    existingLesson.ageGroup.push(ageGroup._id);
    await existingLesson.save();
    res.status(201).json({ message: "Age group created successfully." });
  } catch (error) {
    console.error("Error creating age group: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong creating age group." });
  }
};
