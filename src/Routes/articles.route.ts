import express from 'express';
import {
  ArticleController,
  ArticlesController,
} from '../controllers/articles.controller';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.get('/', checkAuth, ArticlesController);

router.get('/find/:id', ArticleController);

export default router;
