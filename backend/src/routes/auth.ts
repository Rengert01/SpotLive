import express from "express";
import authController from "@/controllers/auth";
import isAuthenticated from "@/middleware/auth";
const router = express.Router();

router.post("/signIn", authController.signIn);
router.post("/signUp", authController.signUp);
router.post("/signOut", authController.signOut);
router.post("/deleteAccount", authController.deleteAccount);
router.put(
  "/editProfile",
  isAuthenticated,
  authController.upload,
  authController.updateProfile
);

router.get("/session", isAuthenticated, authController.getSession);

export default router;
