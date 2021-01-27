import { Router } from 'express';
import Word from '../models/Word';
import { promises as fs } from 'fs';
import { ALPHABET } from '../constants';
import Dict from '../bot/dict';
import Bot from '../bot/bot';

export const router = Router();

// /api/words/:lang/:word
router.get('/:lang/:word', async (req, res) => {
  const { lang, word } = req.params;

  const wordInfo = await Word.findOne({ lang, word });

  if (!wordInfo) {
    return res.status(404).json({ message: 'Word not found' });
  }

  res.json(wordInfo);
});

// /api/words/:lang/length/:length
router.get('/:lang/length/:length', async (req, res) => {
  const { lang, length } = req.params;
  const lengthInt = parseInt(length);
  const wordInfo = await Word.aggregate([{ $match: { lang, len: lengthInt } }, { $sample: { size: 1 } }]);

  if (!wordInfo || !wordInfo[0]) {
    return res.status(404).json({ message: 'Word not found' });
  }

  const info = wordInfo[0];
  info.word = info.word.replace(/\s*-*/g, '');

  res.json(info);
});

// /api/words/:lang/:word
router.post('/:lang/:word', async (req, res, next) => {
  const { lang, word } = req.params;
  let definition = '';

  if (req.body['definition']) {
    definition = req.body.definition;
  }

  const candidate = await Word.findOne({ lang, word });

  if (candidate) {
    return res.status(400).json({ message: 'This word already exists!' });
  }

  const wordInfo = new Word({
    word,
    definition,
    lang,
    len: word.length,
  });

  await wordInfo.save();

  res.json(wordInfo);
});

// /api/words/:lang/bot/find
router.get('/:lang/bot/find', async (req, res) => {
  const { lang } = req.params;

  if (!req.body['cells']) {
    return res.status(404).json({ message: 'You have not submitted a field!' });
  }

  if (!req.body['used']) {
    return res.status(404).json({ message: 'You have not submitted previously used words!' });
  }

  const cells = req.body['cells'];
  const used = req.body['used'];

  const json = await fs.readFile(`./data/dictionary-${lang}.json`, 'utf-8');

  const alphabet = ALPHABET[lang];

  const content = JSON.parse(json);
  const words = Object.keys(content);

  const dict = new Dict(words, alphabet);
  const bot = new Bot(dict);

  const wordFinded = bot.findWord(cells, used);

  if (!wordFinded || !wordFinded.word) {
    return res.status(404).json({ message: 'Word not found' });
  }

  let wordDef: any = await Word.findOne({ lang, word: wordFinded.word });

  if (!wordDef) {
    wordDef = {
      _id: '',
      word: wordFinded.word,
      definition: '',
      lang,
      len: wordFinded.word.length,
    };
  }

  const wordInfo = {
    index: wordFinded.index,
    character: wordFinded.char,
    _id: wordDef._id,
    word: wordDef.word,
    definition: wordDef.definition,
    lang: wordDef.lang,
    len: wordDef.len,
  };

  res.json(wordInfo);
});
