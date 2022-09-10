import express from 'express';
import {
  PlansController,
  SessionController,
} from '../controllers/subs.controller';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.get('/plans', checkAuth, PlansController);

router.post('/session', checkAuth, SessionController);

export default router;
