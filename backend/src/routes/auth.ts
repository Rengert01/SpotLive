import express from "express";
import authController from "@/controllers/auth";
const router = express.Router();

router.post("/signIn", authController.signIn);
router.post("/signUp", authController.signUp);
router.post("/signOut", authController.signOut);
router.post("/deleteAccount", authController.deleteAccount);


export default router;