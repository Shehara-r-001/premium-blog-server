import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../Models/User';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { checkAuth } from '../middleware/checkAuth';
import { stripe } from '../utils/stripe';

const router = express.Router();

router.post(
  '/signup',
  body('email').isEmail().withMessage('Invalid email..'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Your password is too short..'),
  async (req: express.Request, res: express.Response) => {
    const errorsArr = validationResult(req);

    if (!errorsArr.isEmpty()) {
      const errors = errorsArr.array().map((e) => {
        return {
          msg: e.msg,
        };
      });
      return res.status(409).json({ errors, data: null });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        errors: [
          {
            msg: 'Email already in use..!',
          },
        ],
        data: null,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await stripe.customers.create(
      {
        email,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );

    const newUser = await User.create({
      email,
      password: hashedPassword,
      stripeCustomerID: customer.id,
    });

    const token = await JWT.sign(
      {
        email: newUser.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: 36000,
      }
    );

    res.status(200).json({
      errors: [],
      data: {
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          stripeCustomerID: customer.id,
        },
      },
    });
  }
);

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      errors: [
        {
          msg: 'Invalid credentials..',
        },
      ],
      data: null,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      errors: [
        {
          msg: 'Invalid credentials..',
        },
      ],
      data: null,
    });
  }

  const token = await JWT.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 36000,
    }
  );

  return res.status(200).json({
    errors: [],
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    },
  });
});

router.get(
  '/user',
  checkAuth,

  async (req: express.Request, res: express.Response) => {
    const user = await User.findOne({ email: req.user });

    return res.status(200).json({
      errors: [],
      data: {
        user: {
          id: user?._id,
          email: user?.email,
          stripeCustomerID: user?.stripeCustomerID,
        },
      },
    });
  }
);

export default router;
