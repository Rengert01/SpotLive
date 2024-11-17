import express from 'express';
import profileController from '@/controllers/profile';
import { upload } from '@/middleware/uploads';
const ProfileRouter = express.Router();

ProfileRouter.post('/deleteAccount', profileController.deleteAccount);
ProfileRouter.put('/editProfile', upload, profileController.updateProfile);

export default ProfileRouter;
