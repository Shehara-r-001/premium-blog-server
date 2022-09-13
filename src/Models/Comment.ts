import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    articleID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
