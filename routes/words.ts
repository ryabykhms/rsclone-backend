import { Router } from 'express';
import Word from '../models/Word';

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
