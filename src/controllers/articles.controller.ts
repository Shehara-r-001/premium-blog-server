import { Request, Response } from 'express';
import User from '../Models/User';
import Article from '../Models/Article';
import { stripe } from '../utils/stripe';

export const ArticlesController = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.user });

  const subscriptions = await stripe.subscriptions.list(
    {
      customer: user?.stripeCustomerID,
      status: 'all',
      expand: ['data.default_payment_method'],
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

  if (!subscriptions.data.length) return res.status(200).json([]);

  //@ts-ignore
  const plan = subscriptions.data[0].plan.nickname;

  if (plan === 'Basic') {
    const articles = await Article.find({ access: 'Basic' });
    return res.status(200).json(articles);
  }

  if (plan === 'Standard') {
    const articles = await Article.find({
      access: { $in: ['Basic', 'Standard'] },
    });
    return res.status(200).json(articles);
  } else {
    const articles = await Article.find();
    return res.status(200).json(articles);
  }
};

export const ArticleController = async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({ _id: req.params.id });
    res.status(200).json(article);
  } catch (error) {
    console.log(error);
  }
};
