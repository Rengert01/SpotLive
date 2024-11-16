import express from "express";
import authController from "@/controllers/auth";
import profileController from "@/controllers/profile";
import isAuthenticated from "@/middleware/auth";
import { upload } from "@/middleware/uploads";
const router = express.Router();

router.post("/signIn", authController.signIn);
router.post("/signUp", authController.signUp);
router.post("/signOut", authController.signOut);
router.post("/deleteAccount", profileController.deleteAccount);
router.put("/editProfile", upload, profileController.updateProfile);

router.get("/session", isAuthenticated, authController.getSession);

export default router;
