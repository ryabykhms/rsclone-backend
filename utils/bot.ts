import Graph from './graph';
import Matrix from './matrix';
import Vocabulary from './vocabulary';

interface IVariant {
  index: number;
  character: string;
  words: string[];
}

interface IWordVariants {
  [key: string]: IVariant;
}

export default class Bot {
  private vocabulary: Vocabulary;

  constructor(vocabulary: Vocabulary) {
    this.vocabulary = vocabulary;
  }

  public findBestWord(cells: string[], turnLimitSec: number, usedWords: string[] = []): IVariant | undefined {
    const wordsVariants = this.findAllWords(cells, turnLimitSec, usedWords);
    return this.getWord(wordsVariants);
  }

  public findMiddleWord(cells: string[], turnLimitSec: number, usedWords: string[] = []): IVariant | undefined {
    const wordsVariants = this.findAllWords(cells, turnLimitSec, usedWords);
    return this.getMiddleWord(wordsVariants);
  }

  public findShortestWord(cells: string[], turnLimitSec: number, usedWords: string[] = []): IVariant | undefined {
    const wordsVariants = this.findAllWords(cells, turnLimitSec, usedWords);
    return this.getWord(wordsVariants, false);
  }

  public findAllWords(cells: string[], turnLimitSec: number, usedWords: string[] = []): IWordVariants {
    const t0 = Date.now();
    const turnLimitMS = turnLimitSec * 1000;
    const characters = this.vocabulary.availableCharacters;

    const wordsVariants: IWordVariants = {};

    this.entryPoints(cells).forEach((idx) => {
      const graph = new Graph(cells, idx);
      const paths = graph.paths;

      characters.forEach((char: string) => {
        const tChar = Date.now();

        // skip character if it takes too long already
        if (tChar - t0 < turnLimitMS) {
          const filledPaths = this.fillPaths(paths, char);
          const words = this.findWords(filledPaths, usedWords);

          if (words.length) {
            wordsVariants[`${char},${idx}`] = {
              index: idx,
              character: char,
              words,
            };
          }
        }
      });
    });

    return wordsVariants;
  }

  private getRandomElement(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
  }

  private entryPoints(cells: string[]): number[] {
    const fieldSize = Math.sqrt(cells.length);
    let entryPoints = [];

    for (let i = 0; i < cells.length; i += 1) {
      if (cells[i] === '') {
        const neighbours = Matrix.crossNeighbours(fieldSize, i);
        const someAreNotEmpty = neighbours.some((n) => cells[n] !== '');

        if (someAreNotEmpty) {
          entryPoints.push(i);
        }
      }
    }

    return entryPoints;
  }

  private fillPaths(paths: string[][], char: string): string[][] {
    const filled = paths.map((path) => {
      path[0] = char;
      return path;
    });

    return filled;
  }

  private findWords(chains: string[][], usedWords: string[] = []): string[] {
    let words: string[] = [];

    chains.forEach((chain) => {
      const word = chain.join('');
      const reversed = chain.slice().reverse().join('');
      const wordExists = this.vocabulary.exists(word);
      const wordNotUsed = !usedWords.includes(word);
      const reversedExists = this.vocabulary.exists(reversed);
      const reversedNotUsed = !usedWords.includes(reversed);

      if (wordExists && wordNotUsed) {
        words.push(word);
      }

      if (reversedExists && reversedNotUsed) {
        words.push(reversed);
      }
    });

    return words;
  }

  private getWord(wordsVariants: IWordVariants, isBest: boolean = true): IVariant | undefined {
    let variants: IVariant[] = [];

    const variantKeys = Object.keys(wordsVariants);
    const words = variantKeys.map((key) => wordsVariants[key]['words']).flat();

    if (words.length > 0) {
      const word = words.reduce((a: string, b: string) => {
        if (isBest) return a.length > b.length ? a : b;
        else return a.length < b.length ? a : b;
      });

      variantKeys.map((key) => {
        const listWords = wordsVariants[key]['words'].filter((w) => w.length === word.length);

        if (listWords.length > 0) {
          wordsVariants[key]['words'] = listWords;
          variants.push(wordsVariants[key]);
        }
      });
    }

    return this.getRandomElement(variants);
  }

  private getMiddleWord(wordsVariants: IWordVariants): IVariant | undefined {
    const variantKeys = Object.keys(wordsVariants);
    const variant = this.getRandomElement(variantKeys);

    return wordsVariants[variant];
  }
}
