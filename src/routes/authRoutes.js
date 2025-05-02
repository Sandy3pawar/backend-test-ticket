import express from "express";
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔹 Register Route
router.post(
  "/register",
  [
    body("name", "Name is required").notEmpty(),
    body("email", "Valid email is required").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  registerUser
);

// 🔹 Login Route
router.post(
  "/login",
  [
    body("email", "Valid email is required").isEmail(),
    body("password", "Password is required").notEmpty(),
  ],
  loginUser
);

// 🔹 Profile Routes (Protected)
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

export default router;














// import express from "express";
// import { registerUser, loginUser } from "../controllers/authController.js";
// import { body } from "express-validator";

// const router = express.Router();

// // Register Route
// router.post(
//   "/register",
//   [
//     body("name", "Name is required").notEmpty(),
//     body("email", "Valid email is required").isEmail(),
//     body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
//   ],
//   registerUser
// );

// // Login Route
// router.post(
//   "/login",
//   [
//     body("email", "Valid email is required").isEmail(),
//     body("password", "Password is required").notEmpty(),
//   ],
//   loginUser
// );

// export default router;
