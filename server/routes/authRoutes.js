import express from "express";
import {
  changeEmail,
  changePassword,
  login,
  register,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.put("/email", protect, changeEmail);

export default router;