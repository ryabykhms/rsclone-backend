import { Schema, model } from 'mongoose';

const schema = new Schema({
  word: { type: String, required: true },
  definition: { type: String, required: true },
  lang: { type: String, required: true },
  len: { type: Number, required: true },
});

schema.index({ word: 1, lang: 1 }, { unique: true });

export default model('Word', schema);
