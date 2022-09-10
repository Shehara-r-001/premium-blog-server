import express from 'express';
import authRoutes from './Routes/auth.route';
import subsRoutes from './Routes/subs.route';
import articlesRoutes from './Routes/articles.route';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
const port = 3333;

dotenv.config();

mongoose
  .connect(process.env.MONGO_CONNECTION as string)
  .then(() => {
    console.log('MONGODB has been connected..');
  })
  .then(() => {
    app.use(express.json());
    app.use(cors());
    app.use('/api/auth', authRoutes);
    app.use('/api/subs', subsRoutes);
    app.use('/api/articles', articlesRoutes);

    app.listen(process.env.PORT || port, () => {
      console.log(`Listening to PORT ${port}`);
    });
  })
  .catch((error) => {
    throw new Error(error);
  });
