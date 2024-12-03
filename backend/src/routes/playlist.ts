import express from 'express';
import playlistController from '@/controllers/playlist';

const router = express.Router();

router.get('/list', playlistController.getList);
router.post('/upload', playlistController.uploadPlaylist);

export default router;
