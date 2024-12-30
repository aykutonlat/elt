import { body } from "express-validator";

export const userRegisterValidationRules = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long.")
    .matches(/^[a-zA-Z0-9_]*$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores."
    ),
  body("email").isEmail().withMessage("Email must be valid."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

export const userLoginValidationRules = [
  body("identifier")
    .notEmpty()
    .withMessage("Username or email is required.")
    .isString()
    .withMessage("Identifier must be a string.")
    .isLength({ min: 3 })
    .withMessage("Identifier must be at least 3 characters long.")
    .custom((value) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isEmail && value.includes("@")) {
        throw new Error("Invalid email format.");
      }
      return true;
    })
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isString()
    .withMessage("Password must be a string.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

export const resetPasswordValidationRules = [
  body("identifier")
    .notEmpty()
    .withMessage("Username or email is required.")
    .isString()
    .withMessage("Identifier must be a string.")
    .isLength({ min: 3 })
    .withMessage("Identifier must be at least 3 characters long.")
    .custom((value) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isEmail && value.includes("@")) {
        throw new Error("Invalid email format.");
      }
      return true;
    })
    .trim(),
];
