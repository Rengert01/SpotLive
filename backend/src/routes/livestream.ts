import express from 'express';
import livestreamController from '@/controllers/livestream';

const router = express.Router();

router.get('/', livestreamController.startLivestream);

export default router;
