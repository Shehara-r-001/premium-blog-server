import express from 'express';
import {
  GetCommentsByArticle,
  PostComment,
} from '../controllers/comments.controller';

const router = express.Router();

router.get('/', GetCommentsByArticle);

router.post('/', PostComment);

export default router;
