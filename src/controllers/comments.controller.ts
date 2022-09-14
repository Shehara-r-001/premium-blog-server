import { Request, Response } from 'express';
import Comment from '../Models/Comment';

export const GetCommentsByArticle = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ articleID: req.params.articleID });
    return res.status(200).json(comments);
  } catch (error) {
    console.log(error);
  }
};

export const PostComment = async (req: Request, res: Response) => {
  const newComment = new Comment({
    userID: req.body.userID,
    articleID: req.body.articleID,
    desc: req.body.desc,
  });

  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (error) {
    console.log(error);
  }
};
