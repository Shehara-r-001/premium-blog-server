import express, { Request, Response } from 'express';
import { checkAuth } from '../middleware/checkAuth';
import Article from '../Models/Article';
import User from '../Models/User';
import { stripe } from '../utils/stripe';

const router = express.Router();

router.get('/', checkAuth, async (req: Request, res: Response) => {
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
});

export default router;
