interface IWordsData {
  [word: string]: any;
}

export default class Vocabulary {
  private wordsData: IWordsData;
  private words: Set<string>;
  private characters: string[];

  constructor(wordsData: IWordsData) {
    this.wordsData = wordsData;
    this.words = new Set(this.retrieveWords());
    this.characters = this.retrieveAvailableCharacters();
  }

  private retrieveWords(): string[] {
    return this.wordsData.map((w: any) => {
      if (w['word']) {
        return w['word'];
      }
      return Object.keys(w)[0];
    });
  }

  private retrieveAvailableCharacters(): string[] {
    let characters: string[] = [];

    this.words.forEach((word) => {
      word.split('').forEach((c) => {
        if (!characters.includes(c)) {
          characters.push(c);
        }
      });
    });

    return characters;
  }

  get availableCharacters(): string[] {
    return this.characters;
  }

  public exists(word: string): boolean {
    return this.words.has(word);
  }

  public getRandomWord(length: number): string {
    const filteredWords = Array.from(this.words).filter((w) => w.length === length);
    return filteredWords[Math.floor(Math.random() * filteredWords.length)];
  }

  public getLongestWord(): string {
    return Array.from(this.words).reduce((a, b) => (a.length < b.length ? a : b));
  }
}
