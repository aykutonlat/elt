import { body, param } from "express-validator";
import { MemberShipType } from "../enum/memberShip.enum";
import { Status } from "../enum/status.enum";

export const createLessonListValidationRules = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long.")
    .isString()
    .withMessage("Title must be a string.")
    .trim(),
  body("memberShipType")
    .isArray({ min: 1 })
    .withMessage("Membership type is required and must be an array.")
    .custom((value: string[]) => {
      const validMembershipTypes = Object.values(MemberShipType);
      const invalidTypes = value.filter(
        (type) => !validMembershipTypes.includes(type as MemberShipType)
      );
      if (invalidTypes.length > 0) {
        throw new Error(`Invalid membership types: ${invalidTypes.join(", ")}`);
      }
      return true;
    }),
];

export const updateLessonListValidationRules = [
  param("id").isMongoId().withMessage("Invalid lesson list ID."),
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long.")
    .isString()
    .withMessage("Title must be a string.")
    .trim(),
];

export const updateLessonListMembershipValidationRules = [
  param("id").isMongoId().withMessage("Invalid lesson list ID."),
  body("memberShipTypes")
    .isArray({ min: 1 })
    .withMessage("Membership type is required and must be an array.")
    .custom((value: string[]) => {
      const validMembershipTypes = Object.values(MemberShipType);
      const invalidTypes = value.filter(
        (type) => !validMembershipTypes.includes(type as MemberShipType)
      );
      if (invalidTypes.length > 0) {
        throw new Error(`Invalid membership types: ${invalidTypes.join(", ")}`);
      }
      return true;
    }),
];

export const updateLessonListStatusValidationRules = [
  param("id").isMongoId().withMessage("Invalid lesson list ID."),
  body("status")
    .isString()
    .withMessage("Status must be a string.")
    .custom((value: string) => {
      const validStatus = Object.values(Status);
      if (!validStatus.includes(value as Status)) {
        throw new Error(`Invalid status: ${value}`);
      }
      return true;
    }),
];

export const searchLessonListValidationRules = [
  body("status")
    .optional()
    .isString()
    .withMessage("Status must be a string.")
    .custom((value: string) => {
      const validStatus = Object.values(Status);
      if (!validStatus.includes(value as Status)) {
        throw new Error(`Invalid status: ${value}`);
      }
      return true;
    }),
  body("memberShipType")
    .optional()
    .isString()
    .withMessage("Membership type must be a string.")
    .custom((value: string) => {
      const validMembershipTypes = Object.values(MemberShipType);
      if (!validMembershipTypes.includes(value as MemberShipType)) {
        throw new Error(`Invalid membership type: ${value}`);
      }
      return true;
    }),
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string.")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long.")
    .trim(),
];
