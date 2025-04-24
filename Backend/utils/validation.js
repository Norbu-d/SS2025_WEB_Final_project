const { body } = require("express-validator");
const prisma = require("../prismaClient");

// Register Validation
const validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .custom(async (username) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (user) {
        throw new Error("Username already in use");
      }
      return true;
    }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        throw new Error("Email already in use");
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .withMessage("Password must include uppercase, lowercase, number and special character"),

  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Full name must be between 3 and 50 characters"),
];

// Login Validation
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// Update Profile Validation
const validateUpdateProfile = [
  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Full name must be between 3 and 50 characters"),
  
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must be less than 500 characters"),
  
  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Invalid website URL")
];

// Change Password Validation
const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .withMessage("Password must include uppercase, lowercase, number and special character")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("New password must be different from current password");
      }
      return true;
    })
];

// Switch between validations
const validate = (type) => {
  switch (type) {
    case "register":
      return validateRegister;
    case "login":
      return validateLogin;
    case "updateProfile":
      return validateUpdateProfile;
    case "changePassword":
      return validateChangePassword;
    default:
      throw new Error("Unknown validation type");
  }
};

// Handle validation result
const handleValidationErrors = (req, res, next) => {
  const errors = require("express-validator").validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ 
        param: e.param,
        message: e.msg 
      })),
    });
  }
  next();
};


module.exports = {
  validate,
  handleValidationErrors
};