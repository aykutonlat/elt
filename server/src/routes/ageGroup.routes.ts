import { Router } from "express";
import { createAgeGroup } from "../controller/adminAgeGroup.controller";
import { createAgeGroupValidationRules } from "../validation/ageGroupValidation";
import { validate } from "../middlewares/validate";

export const ageGroupRouter = Router();

ageGroupRouter.post(
  "/create",
  createAgeGroupValidationRules,
  validate,
  createAgeGroup
);
