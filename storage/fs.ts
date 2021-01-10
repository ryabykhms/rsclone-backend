import { promises as fsp } from 'fs';

type WordDefinition = {
  statusCode: number;
  word: string;
  definition: string | number;
  lang: string;
  error?: string | boolean;
};

export const getWordDefinition = async (lang: string, word: string) => {
  const filePath = `./data/dictionary-${lang}.json`;

  const wordDefinition: WordDefinition = {
    statusCode: 404,
    word: word,
    definition: '',
    lang,
  };

  try {
    const contents = await fsp.readFile(filePath, 'utf-8');

    const parsedList = JSON.parse(contents);

    if (parsedList[word]) {
      wordDefinition.statusCode = 200;
      wordDefinition.word = word;
      wordDefinition.definition = parsedList[word];
    }

    if (parsedList[word] && parsedList[word]['definition']) {
      wordDefinition.definition = parsedList[word]['definition'];
    }
  } catch (e: unknown) {
    if (!(e instanceof Error)) {
      throw e;
    }

    wordDefinition.error = 'Language not found';

    console.warn(`There was error ${e.message}`);
  }

  return wordDefinition;
};

export const getWordByLength = async (lang: string, length: number) => {
  const filePath = `./data/dictionary-${lang}.json`;

  const wordDefinition: WordDefinition = {
    statusCode: 404,
    word: '',
    definition: '',
    lang,
  };

  try {
    const contents = await fsp.readFile(filePath, 'utf-8');
    const parsedList = JSON.parse(contents);

    const filteredList = Object.keys(parsedList).filter((key) => key.length === length);
    const randomKey = Math.floor(Math.random() * filteredList.length);
    const word = filteredList[randomKey];

    if (filteredList.length && word) {
      wordDefinition.statusCode = 200;
      wordDefinition.word = word;
      wordDefinition.definition = parsedList[word]['definition'] || parsedList[word];
    }
  } catch (e: unknown) {
    if (!(e instanceof Error)) {
      throw e;
    }

    wordDefinition.error = 'Language not found';

    console.warn(`There was error ${e.message}`);
  }

  return wordDefinition;
};
