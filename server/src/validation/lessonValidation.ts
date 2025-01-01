import { body, param } from "express-validator";
import { MemberShipType } from "../enum/memberShip.enum";

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
