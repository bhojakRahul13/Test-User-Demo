const { check } = require("express-validator");

exports.signUpValidation = [
  check("fullName")
    .not()
    .isEmpty()
    .withMessage("fullName is required")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars long")
    .isAlpha()
    .withMessage("Must be only alphabetical chars"),
  check("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("must be valid email address"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("must be at least 8 chars long")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    .withMessage(
      "Password must include one lowercase character, one uppercase character, a number, and a special character."
    ),
  check("gender")
    .not()
    .isEmpty()
    .withMessage("gender is required")
    .isIn(["male", "female","other"])
    .withMessage("male or female or other"),
];

exports.signInValidation = [
  check("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password").not().isEmpty().withMessage("password is required"),
];

exports.updateValidation = [
  check("gender").optional().isIn(["male", "female", "other"]).withMessage("Gender must be 'male', 'female', or 'other'"),
];
