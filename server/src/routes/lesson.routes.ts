import { Router } from "express";
import {
  createLessonListValidationRules,
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
