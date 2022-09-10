import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../Models/User';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { checkAuth } from '../middleware/checkAuth';
import { stripe } from '../utils/stripe';
import {
  SignInController,
  UserController,
} from '../controllers/auth.controller';

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

router.post('/signin', SignInController);

router.get('/user', checkAuth, UserController);

export default router;
