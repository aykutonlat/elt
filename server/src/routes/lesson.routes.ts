import { Router } from "express";
import {
  createLessonListValidationRules,
  searchLessonListValidationRules,
  updateLessonListMembershipValidationRules,
  updateLessonListStatusValidationRules,
  updateLessonListValidationRules,
} from "../validation/lessonValidation";
import { validate } from "../middlewares/validate";
import {
  createLesson,
  updateLesson,
  updateLessonMembership,
  updateLessonStatus,
  getAllLessons,
  getLessonBySearch,
} from "../controller/adminLesson.controller";

export const adminLessonRouter = Router();

adminLessonRouter.post(
  "/create",
  createLessonListValidationRules,
  validate,
  createLesson
);

adminLessonRouter.put(
  "/update/:id",
  updateLessonListValidationRules,
  validate,
  updateLesson
);

adminLessonRouter.put(
  "/update-membership/:id",
  updateLessonListMembershipValidationRules,
  validate,
  updateLessonMembership
);

adminLessonRouter.put(
  "/update-status/:id",
  updateLessonListStatusValidationRules,
  validate,
  updateLessonStatus
);

adminLessonRouter.get("/all", getAllLessons);

adminLessonRouter.get(
  "/search",
  searchLessonListValidationRules,
  validate,
  getLessonBySearch
);
