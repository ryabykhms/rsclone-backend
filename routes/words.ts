import { Router } from 'express';
import Word from '../models/Word';
import Bot from '../utils/bot';
import Vocabulary from '../utils/vocabulary';

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

// /api/words/:lang/complexity/:complexity
router.get('/:lang/complexity/:complexity', async (req, res) => {
  const { lang, complexity } = req.params;

  if (!req.body['cells']) {
    return res.status(404).json({ message: 'You have not submitted a field!' });
  }

  if (!req.body['used']) {
    return res.status(404).json({ message: 'You have not submitted previously used words!' });
  }

  const cells = req.body['cells'];
  const used = req.body['used'];

  let word = undefined;

  const data = await Word.find({ lang }).exec();

  const vocabulary = new Vocabulary(data);
  const bot = new Bot(vocabulary);

  switch (complexity) {
    case 'easy':
      word = bot.findShortestWord(cells, 15, used);
      break;
    case 'hard':
      word = bot.findBestWord(cells, 15, used);
      break;
    default:
      word = bot.findMiddleWord(cells, 15, used);
      break;
  }

  if (!word) {
    return res.status(404).json({ message: 'Word not found' });
  }

  let wordDef: any = await Word.findOne({ lang, word: word.words[0] });

  if (!wordDef) {
    wordDef = {
      _id: '',
      word: word.words[0],
      definition: '',
      lang,
      len: word.words[0].length,
    };
  }

  const wordInfo = {
    index: word.index,
    character: word.character,
    _id: wordDef._id,
    word: wordDef.word,
    definition: wordDef.definition,
    lang: wordDef.lang,
    len: wordDef.len,
  };

  res.json(wordInfo);
});
