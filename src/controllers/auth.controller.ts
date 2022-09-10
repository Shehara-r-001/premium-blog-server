import express, { Request, Response } from 'express';
import User from '../Models/User';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

export const SignInController = async (req: Request, res: Response) => {
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
};

export const UserController = async (req: Request, res: Response) => {
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
};
