import { Request, Response } from "express";
import { LessonList } from "../models/LessonList.model";
import { MemberShipType } from "../enum/memberShip.enum";
import { Status } from "../enum/status.enum";

export const createLesson = async (
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

export const updateLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    await LessonList.findByIdAndUpdate(id, { title, description });
    res.status(200).json({ message: "Lesson list updated successfully." });
  } catch (error) {
    console.error("Error updating lesson list: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong updating lesson list." });
  }
};

export const updateLessonMembership = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { memberShipTypes } = req.body;

    const updateLessonListMembership = await LessonList.findByIdAndUpdate(
      id,
      { memberShipType: memberShipTypes },
      { new: true }
    );

    if (!updateLessonListMembership) {
      res.status(404).json({ message: "Lesson list not found." });
      return;
    }

    res.status(200).json({
      message: "Lesson list membership updated successfully.",
    });
  } catch (error) {
    console.error("Error updating lesson list membership: ", error);
    res.status(500).json({
      message: "Something went wrong updating lesson list membership.",
    });
  }
};

export const updateLessonStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateLessonListStatus = await LessonList.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updateLessonListStatus) {
      res.status(404).json({ message: "Lesson list not found." });
      return;
    }

    res.status(200).json({
      message: "Lesson list status updated successfully.",
    });
  } catch (error) {
    console.error("Error updating lesson list status: ", error);
    res.status(500).json({
      message: "Something went wrong updating lesson list status.",
    });
  }
};
