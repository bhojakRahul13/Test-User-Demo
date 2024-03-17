const router = require("express").Router();
const jwt_Middleware = require("../middleware/jwtVerify");
const { upload } = require("../middleware/multer");
const validation = require("../validations/fieldValidation");
const {
  userSignUp,
  userSignIn,
  listUserById,
  deleteUserById,
  detailUser,
  updateUser,
} = require("../controller/usersController");

//  Register API
router.post(
  "/signUp",
  upload.single("profilePic"),
  validation.signUpValidation,
  userSignUp
);

// Login API
router.post("/signIn", validation.signInValidation, userSignIn);

// Get By Id
router.get("/:id", jwt_Middleware, listUserById);

// Delete by Id

router.delete("/:id", jwt_Middleware, deleteUserById);

// Get user Details
router.get("/", jwt_Middleware, detailUser);

// // Update Users By id

router.put(
  "/:id",
  jwt_Middleware,
  validation.updateValidation,
  upload.single("profilePic"),
  updateUser
);

module.exports = router;
