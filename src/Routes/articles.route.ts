import express from 'express';
import { ArticlesController } from '../controllers/articles.controller';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.get('/', checkAuth, ArticlesController);

export default router;
