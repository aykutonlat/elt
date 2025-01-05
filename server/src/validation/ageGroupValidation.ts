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
