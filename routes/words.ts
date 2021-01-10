import { Router } from 'express';
import * as storage from '../storage';

export const router = Router();

router.get('/:lang/:word', async (req, res, next) => {
  const { lang, word } = req.params;
  const wordDefinition = await storage.getWordDefinition(lang, word);
  res.json(wordDefinition);
});

router.get('/:lang/length/:length', async (req, res, next) => {
  const { lang, length } = req.params;
  const wordDefinition = await storage.getWordByLength(lang, parseInt(length));
  res.json(wordDefinition);
});
