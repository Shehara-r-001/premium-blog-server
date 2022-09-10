import mongoose from 'mongoose';

const { Schema } = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  access: {
    type: String,
    enum: ['Basic', 'Standard', 'Premium'],
    required: true,
  },
});

export default mongoose.model('Article', articleSchema);
