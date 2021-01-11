import { Collection, MongoClient } from 'mongodb';
import { promises as fsp } from 'fs';

const url = 'mongodb+srv://lvma:team4dream2021!!!@cluster0.ltbwb.mongodb.net/?retryWrites=true&w=majority';

const DB_NAME = 'rsclone';

enum Collections {
  WORDS = 'words',
  USERS = 'users',
}

const getMongoInstance = async () => {
  const client = MongoClient.connect(url, { useUnifiedTopology: true });

  return (await client).db(DB_NAME);
};

type WordInfoResult = {
  statusCode: number;
  info: WordInfo;
  error?: string | boolean;
};

type WordInfo = {
  word: string;
  definition: string | number;
  lang: string;
};

const getCollection = async (collectionName: string): Promise<Collection> => {
  const db = await getMongoInstance();
  return db.collection(collectionName);
};

export const getWordInfo = async (lang: string, word: string) => {
  const collection = await getCollection(Collections.WORDS);

  return collection
    .find({
      word,
      lang,
    })
    .toArray();
};

export const getWordByLength = async (lang: string, length: number) => {
  const collection = await getCollection(Collections.WORDS);

  return collection
    .aggregate([
      {
        $project: {
          word: 1,
          definition: 2,
          lang: 3,
          length: { $strLenCP: '$word' },
        },
      },
      { $match: { lang, length } },
      { $sample: { size: 1 } },
    ])
    .toArray();
};

export const addDictionaryFromData = async (lang: string) => {
  const filePath = `./data/dictionary-${lang}.json`;
  const collection = await getCollection(Collections.WORDS);

  try {
    const contents = await fsp.readFile(filePath, 'utf-8');

    const parsedList = JSON.parse(contents);

    const list = Object.keys(parsedList).map((item) => {
      let definition = parsedList[item];

      if (definition['definition']) {
        definition = definition['definition'];
      }

      return {
        word: item,
        definition,
        lang,
      };
    });

    return collection.insertMany(list);
  } catch (e: unknown) {
    if (!(e instanceof Error)) {
      throw e;
    }
    console.warn(`There was error ${e.message}`);
    return [];
  }
};

export const addWord = async (lang: string, word: string, definition: string = '') => {
  const collection = await getCollection(Collections.WORDS);

  return collection.insertOne({ word, definition, lang });
};
