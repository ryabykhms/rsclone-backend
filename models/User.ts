import { Schema, model } from 'mongoose';

const schema = new Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  score: { type: Number, required: false, default: 0 },
});

export default model('User', schema);
