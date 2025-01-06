import { Request, Response } from "express";
import { Lesson } from "../models/Lesson.model";
import { MemberShipType } from "../enum/memberShip.enum";
import { Status } from "../enum/status.enum";
import { toLessonListDTO } from "../dto/Lesson.dto";

export const createLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, memberShipType } = req.body;
    const lessonList = new Lesson({
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
    await Lesson.findByIdAndUpdate(id, { title, description });
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

    const updateLessonListMembership = await Lesson.findByIdAndUpdate(
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

    const updateLessonListStatus = await Lesson.findByIdAndUpdate(
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

export const getAllLessons = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lessonList = await Lesson.find();
    const lessonListDTO = lessonList.map((lesson) => toLessonListDTO(lesson));
    res.status(200).json(lessonListDTO);
  } catch (error) {
    console.error("Error getting lesson list: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong getting lesson list." });
  }
};

export const getLessonBySearch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, memberShipType, title } = req.query;

    const query: any = {};

    if (status && Object.values(Status).includes(status as Status)) {
      query.status = status;
    }

    if (
      memberShipType &&
      Object.values(MemberShipType).includes(memberShipType as MemberShipType)
    ) {
      query.memberShipType = memberShipType;
    }

    if (title && typeof title === "string") {
      query.title = { $regex: new RegExp(title.split("").join(".*"), "i") };
    }

    const lessons = await Lesson.find(query);
    const lessonListDTO = lessons.map((lesson) => toLessonListDTO(lesson));
    res.status(200).json(lessonListDTO);
  } catch (error) {
    console.error("Error getting lesson list: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong getting lesson list." });
  }
};
