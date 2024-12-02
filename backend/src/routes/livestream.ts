import express from 'express';
import livestreamController from '@/controllers/livestream';

const router = express.Router();

router.get('/list', livestreamController.getLivestreamsList);

export default router;
