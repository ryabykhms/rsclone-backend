import { Router } from 'express';
import * as storage from '../storage';

export const router = Router();

router.get('/:lang/:word', async (req, res, next) => {
  const { lang, word } = req.params;
  const wordInfo = await storage.mongo.getWordInfo(lang, word);
  res.json(wordInfo);
});

router.get('/:lang/length/:length', async (req, res, next) => {
  const { lang, length } = req.params;
  const wordInfo = await storage.mongo.getWordByLength(lang, parseInt(length));
  res.json(wordInfo);
});

router.post('/:lang/:word', async (req, res, next) => {
  const { lang, word } = req.params;
  let definition = '';
  if (req.body['definition']) {
    definition = req.body.definition;
  }
  const result = await storage.mongo.addWord(lang, word, definition);
  res.json(result);
});
