import { Request, Response } from "express";
import { Lesson } from "../models/Lesson.model";
import { AgeGroup } from "../models/AgeGroup.model";
import mongoose from "mongoose";
import { toAgeGroupDTO } from "../dto/AgeGroup.dto";

export const createAgeGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, minAge, maxAge, lessonId } = req.body;

    const lessonObjectId = new mongoose.Types.ObjectId(lessonId);
    const existingLesson = await Lesson.findById(lessonObjectId);
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

export const updateAgeGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, minAge, maxAge } = req.body;

    const existingAgeGroup = await AgeGroup.findById(id);
    if (!existingAgeGroup) {
      res.status(404).json({ message: "Age group not found." });
      return;
    }

    const otherAgeGroups = await AgeGroup.find({
      lesson: existingAgeGroup.lesson,
      _id: { $ne: id },
    });

    const isOverlapping = otherAgeGroups.some((group) => {
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

    existingAgeGroup.title = title;
    existingAgeGroup.minAge = minAge;
    existingAgeGroup.maxAge = maxAge;
    existingAgeGroup.description = description;
    await existingAgeGroup.save();

    res.status(200).json({ message: "Age group updated successfully." });
  } catch (error) {
    console.error("Error updating age group: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong updating age group." });
  }
};

export const updateAgeGroupMembership = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { memberShipTypes } = req.body;

    const updateAgeGroupMembership = await AgeGroup.findByIdAndUpdate(
      id,
      { memberShipType: memberShipTypes },
      { new: true }
    );

    if (!updateAgeGroupMembership) {
      res.status(404).json({ message: "Age group not found." });
      return;
    }

    res.status(200).json({
      message: "Age group membership updated successfully.",
    });
  } catch (error) {
    console.error("Error updating age group membership: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong updating age group membership." });
  }
};

export const updateAgeGroupStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateAgeGroupStatus = await AgeGroup.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updateAgeGroupStatus) {
      res.status(404).json({ message: "Age group not found." });
      return;
    }

    res.status(200).json({
      message: "Age group status updated successfully.",
    });
  } catch (error) {
    console.error("Error updating age group status: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong updating age group status." });
  }
};

export const getAllAgeGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ageGroups = await AgeGroup.find().populate("lesson");
    const ageGroupDTOs = ageGroups.map(toAgeGroupDTO);
    res.status(200).json(ageGroupDTOs);
  } catch (error) {
    console.error("Error getting age groups: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong getting age groups." });
  }
};

export const getAllAgeGroupsBySearch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, status, memberShipType, minAge, maxAge } = req.query;

    const query: any = {};

    if (title && typeof title === "string") {
      query.title = { $regex: new RegExp(title.split("").join(".*"), "i") };
    }

    if (status) {
      query.status = status;
    }

    if (memberShipType) {
      query.memberShipType = { $in: memberShipType };
    }

    const overlappingQuery: any = {};
    if (minAge || maxAge) {
      overlappingQuery.$or = [
        { minAge: { $lte: maxAge }, maxAge: { $gte: minAge } },
      ];
    }

    const ageGroups = await AgeGroup.find({
      ...query,
      ...(minAge || maxAge ? overlappingQuery : {}),
    });

    res
      .status(200)
      .json({ message: "Age groups fetched successfully.", ageGroups });
  } catch (error) {
    console.error("Error getting age groups by search: ", error);
    res
      .status(500)
      .json({ message: "Something went wrong getting age groups by search." });
  }
};
