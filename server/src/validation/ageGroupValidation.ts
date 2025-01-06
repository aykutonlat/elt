import { body, param } from "express-validator";
import { MemberShipType } from "../enum/memberShip.enum";
import { Status } from "../enum/status.enum";

export const createAgeGroupValidationRules = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long.")
    .isString()
    .withMessage("Title must be a string.")
    .trim(),
  body("minAge")
    .isNumeric()
    .withMessage("Minimum age must be a number.")
    .isInt({ min: 0 })
    .withMessage("Minimum age must be a positive number."),
  body("maxAge")
    .isNumeric()
    .withMessage("Maximum age must be a number.")
    .isInt({ min: 0 })
    .withMessage("Maximum age must be a positive number."),
  body("maxAge").custom((value, { req }) => {
    if (parseInt(req.body.minAge) >= value) {
      throw new Error("Maximum age must be greater than minimum age.");
    }
    return true;
  }),
  body("lessonId").isMongoId().withMessage("Invalid lesson ID."),
];

export const updateAgeGroupValidationRules = [
  param("id").isMongoId().withMessage("Invalid age group ID."),
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long.")
    .isString()
    .withMessage("Title must be a string.")
    .trim(),
  body("description")
    .isString()
    .withMessage("Description must be a string.")
    .trim(),
  body("minAge")
    .isNumeric()
    .withMessage("Minimum age must be a number.")
    .isInt({ min: 0 })
    .withMessage("Minimum age must be a positive number."),
  body("maxAge")
    .isNumeric()
    .withMessage("Maximum age must be a number.")
    .isInt({ min: 0 })
    .withMessage("Maximum age must be a positive number."),
  body("maxAge").custom((value, { req }) => {
    if (parseInt(req.body.minAge) >= value) {
      throw new Error("Maximum age must be greater than minimum age.");
    }
    return true;
  }),
];

export const updateAgeGroupMembershipValidationRules = [
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

export const updateAgeGroupStatusValidationRules = [
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
