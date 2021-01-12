import { Schema, model } from 'mongoose';

const schema = new Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, requird: true },
});

export default model('User', schema);
