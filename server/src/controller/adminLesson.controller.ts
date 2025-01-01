import { Request, Response } from "express";
import { LessonList } from "../models/LessonList.model";

export const createLessonList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, memberShipType } = req.body;
    const lessonList = new LessonList({
      title,
      memberShipType,
    });
    await lessonList.save();
    res.status(201).json({ message: "Lesson list created successfully." });
  } catch (error) {
    console.error("Error creating lesson list: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong creating lesson list." });
  }
};
