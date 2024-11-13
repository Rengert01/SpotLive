import express from "express";
import musicController from "@/controllers/music";

const router = express.Router();

router.get("/stream/:id", musicController.streamMusic);
router.get("/info/:id", musicController.getMusicInfo);

export default router;