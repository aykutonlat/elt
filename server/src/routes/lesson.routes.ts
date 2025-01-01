import { Router } from "express";
import { createLessonListValidationRules } from "../validation/lessonValidation";
import { validate } from "../middlewares/validate";
import { isSuperAdmin } from "../middlewares/auth";
import { createLessonList } from "../controller/adminLesson.controller";

export const adminLessonRouter = Router();

adminLessonRouter.post(
  "/create",
  createLessonListValidationRules,
  validate,
  createLessonList
);
