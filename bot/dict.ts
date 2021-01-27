export default class Dict {
  private dictionary: string[];
  private chars: string;
  private dictHash: number[];
  private dict2MoreHash: number[];
  private dict3MoreHash: number[];
  private dict4MoreHash: number[];
  private dict5MoreHash: number[];
  private dict6MoreHash: number[];
  private dict7MoreHash: number[];
  private dict8MoreHash: number[];
  private dict9MoreHash: number[];

  constructor(dictionary: string[], chars: string = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя') {
    this.dictionary = dictionary;
    this.chars = chars;
    this.dictHash = [];
    this.dict2MoreHash = [];
    this.dict3MoreHash = [];
    this.dict4MoreHash = [];
    this.dict5MoreHash = [];
    this.dict6MoreHash = [];
    this.dict7MoreHash = [];
    this.dict8MoreHash = [];
    this.dict9MoreHash = [];

    this.createHashes();
    this.sortHashes();
  }

  private createHashes() {
    // хэшируем массивы
    for (let i = 0; i < this.dictionary.length; i++) {
      const MAX_WORD_LENGTH = 10;

      if (this.dictionary[i].length <= MAX_WORD_LENGTH) {
        // хэшируем словарь
        if (this.dictionary[i].length > 1) {
          this.dictHash.push(this.str2hash(this.dictionary[i]));
        }

        // хэшируем ,больше 2 и меньше N букв
        if (this.dictionary[i].length > 2) {
          const hash = this.str2hash(this.dictionary[i].substr(0, 2));
          if (this.dict2MoreHash[this.dict2MoreHash.length - 1] !== hash) {
            this.dict2MoreHash.push(hash);
          }
        }

        // хэшируем ,больше 3 и меньше N букв
        if (this.dictionary[i].length > 3) {
          const hash = this.str2hash(this.dictionary[i].substr(0, 3));
          if (this.dict3MoreHash[this.dict3MoreHash.length - 1] !== hash) this.dict3MoreHash.push(hash);
        }

        // хэшируем ,больше 4 и меньше N букв
        if (this.dictionary[i].length > 4) {
          const hash = this.str2hash(this.dictionary[i].substr(0, 4));
          if (this.dict4MoreHash[this.dict4MoreHash.length - 1] !== hash) this.dict4MoreHash.push(hash);
        }

        // хэшируем ,больше 5 и меньше N букв
        if (this.dictionary[i].length > 5) {
          const hash = this.str2hash(this.dictionary[i].substr(0, 5));
          if (this.dict5MoreHash[this.dict5MoreHash.length - 1] !== hash) this.dict5MoreHash.push(hash);
        }
        // хэшируем ,больше 6 и меньше N букв
        if (this.dictionary[i].length > 6) {
          const hash = this.str2hash(this.dictionary[i].substr(0, 6));
          if (this.dict6MoreHash[this.dict6MoreHash.length - 1] !== hash) this.dict6MoreHash.push(hash);
        }

        // хэшируем ,больше 7 и меньше N букв
        if (this.dictionary[i].length > 7) {
          const hash = this.str2hash(this.dictionary[i].substr(0, 7));
          if (this.dict7MoreHash[this.dict7MoreHash.length - 1] !== hash) this.dict7MoreHash.push(hash);
        }
        // хэшируем ,больше 8 и меньше N букв
        if (this.dictionary[i].length > 8) {
          const hash = this.str2hash(this.dictionary[i].substr(0, 8));
          if (this.dict8MoreHash[this.dict8MoreHash.length - 1] !== hash) this.dict8MoreHash.push(hash);
        }

        // хэшируем ,больше 9 и меньше N букв
        if (this.dictionary[i].length > 9) {
          const hash = this.str2hash(this.dictionary[i].substr(0, 9));
          if (this.dict9MoreHash[this.dict9MoreHash.length - 1] !== hash) this.dict9MoreHash.push(hash);
        }
      }
    }
  }

  // сортируем массивы
  private compareNumbers(a: number, b: number) {
    return a - b;
  }

  private sortHashes() {
    this.dict2MoreHash.sort(this.compareNumbers);
    this.dict3MoreHash.sort(this.compareNumbers);
    this.dict4MoreHash.sort(this.compareNumbers);
    this.dict5MoreHash.sort(this.compareNumbers);
    this.dict6MoreHash.sort(this.compareNumbers);
    this.dict7MoreHash.sort(this.compareNumbers);
    this.dict8MoreHash.sort(this.compareNumbers);
    this.dict9MoreHash.sort(this.compareNumbers);
    this.dictHash.sort(this.compareNumbers);
  }

  private findHash(searchKey: number, hash: number[]) {
    let lowerBound = 0;
    let upperBound = hash.length - 1;
    let curIn;
    while (true) {
      curIn = Math.round((lowerBound + upperBound) / 2);
      if (hash[curIn] === searchKey) {
        return true;
      }
      // Элемент найден
      else if (lowerBound > upperBound) {
        return false;
      }
      // Элемент не найден
      // Деление диапазона
      else {
        if (hash[curIn] < searchKey) {
          lowerBound = curIn + 1;
        }
        // В верхней половине
        else {
          upperBound = curIn - 1; // В нижней половине
        }
      }
    }
  }

  private str2hash(str: string) {
    let id = 0;
    let len = str.length;
    for (let i = 0; i < len; i++) {
      const symbol = str[len - i - 1];
      id += (this.chars.indexOf(symbol) + 1) * Math.pow(32, i);
    }
    return id;
  }

  // поиск целого слова в словаре
  public findWord(word: string) {
    return this.findHash(this.str2hash(word), this.dictHash);
  }

  // поиск части слова в хешированных массивах
  public findPartTest2(word: string) {
    switch (word.length) {
      case 1:
        return this.chars.indexOf(word) === -1 ? false : true;
      case 2:
        return this.findHash(this.str2hash(word), this.dict2MoreHash);
      case 3:
        return this.findHash(this.str2hash(word), this.dict3MoreHash);
      case 4:
        return this.findHash(this.str2hash(word), this.dict4MoreHash);
      case 5:
        return this.findHash(this.str2hash(word), this.dict5MoreHash);
      case 6:
        return this.findHash(this.str2hash(word), this.dict6MoreHash);
      case 7:
        return this.findHash(this.str2hash(word), this.dict7MoreHash);
      case 8:
        return this.findHash(this.str2hash(word), this.dict8MoreHash);
      case 9:
        return this.findHash(this.str2hash(word), this.dict9MoreHash);
      default:
        return false;
    }
  }

  public getChars() {
    return this.chars;
  }
}
