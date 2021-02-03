import { Schema, model } from 'mongoose';

const schema = new Schema({
  userId: { type: String, required: true },
  login: { type: String, required: true },
  isBot: { type: Boolean, required: true, default: false },
  fieldSize: { type: Number, required: true, default: 5 },
  score: { type: Number, required: true, default: 0 },
  time: { type: Number, required: true, default: 0 },
  isWin: { type: Boolean, required: true, default: false },
});

export default model('Game', schema);
