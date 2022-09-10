import { Request, Response } from 'express';
import User from '../Models/User';
import { stripe } from '../utils/stripe';

export const PlansController = async (req: Request, res: Response) => {
  const plans = await stripe.prices.list({
    apiKey: process.env.STRIPE_SECRET_KEY,
  });

  return res.status(200).json(plans);
};

export const SessionController = async (req: Request, res: Response) => {
  // Article.create({
  //   title: 'Lets try GraphQL',
  //   imgUrl: 'https://miro.medium.com/max/1400/1*K7cL5EO9bQJei8GrgRhoZQ.png',
  //   desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit porro adipisci eligendi nihil ad nemo id dolore earum repudiandae non asperiores quam odio, laborum rerum veritatis sunt debitis alias numquam ratione culpa. Autem labore voluptatem maxime nobis eveniet in vero libero tempore ut, temporibus impedit aliquid, officia est voluptas distinctio.',
  //   access: 'Premium',
  // });

  const user = await User.findOne({ email: req.user });
  const session = await stripe.checkout.sessions.create(
    {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: req.body.priceID,
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/articles',
      cancel_url: 'http://localhost:3000/plans',
      customer: user?.stripeCustomerID,
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

  res.status(200).json(session);
};
