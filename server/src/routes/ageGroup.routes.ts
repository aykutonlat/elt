import { Router } from "express";
import {
  createAgeGroup,
  updateAgeGroup,
  updateAgeGroupMembership,
  updateAgeGroupStatus,
  getAllAgeGroups,
} from "../controller/adminAgeGroup.controller";
import {
  createAgeGroupValidationRules,
  updateAgeGroupMembershipValidationRules,
  updateAgeGroupValidationRules,
  updateAgeGroupStatusValidationRules,
} from "../validation/ageGroupValidation";
import { validate } from "../middlewares/validate";

export const adminAgeGroupRouter = Router();

adminAgeGroupRouter.post(
  "/create",
  createAgeGroupValidationRules,
  validate,
  createAgeGroup
);

adminAgeGroupRouter.put(
  "/update/:id",
  updateAgeGroupValidationRules,
  validate,
  updateAgeGroup
);

adminAgeGroupRouter.put(
  "/update-membership/:id",
  updateAgeGroupMembershipValidationRules,
  validate,
  updateAgeGroupMembership
);

adminAgeGroupRouter.put(
  "/update-status/:id",
  updateAgeGroupStatusValidationRules,
  validate,
  updateAgeGroupStatus
);

adminAgeGroupRouter.get("/all", getAllAgeGroups);
