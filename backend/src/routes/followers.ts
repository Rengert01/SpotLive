import { followUser, unfollowUser } from '@/controllers/followers';
import express from 'express';

const FollowersRouter = express.Router();

FollowersRouter.post("/follow",followUser);
FollowersRouter.post("/unfollow",unfollowUser);


export default FollowersRouter;
