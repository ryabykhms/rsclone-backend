import Dict from './dict';

export default class Bot {
  private word: string;
  private index: number | undefined;
  private char: string | undefined;
  private usedWords: string[];
  private dict: Dict;

  constructor(dict: Dict) {
    this.word = '';
    this.index = undefined;
    this.char = undefined;
    this.usedWords = []; // слова уже использованные в ответах
    this.dict = dict;
  }

  // рекурсивный поиск путей
  private findTrack(cells: string[], pathCoords: number[], currentCellIndex: number, filledCellIndex: number) {
    // arrData данные таблицы
    // arrWord координаты пути
    // cur номер текущей ячейки
    // ins номер ячейки с подставленной буквой
    if (cells[currentCellIndex] === '')
      // если текущая ячейка пустая
      return false;
    // проверяем не пересекается ли путь
    if (pathCoords.length > 0 && pathCoords.indexOf(currentCellIndex) !== -1) return false;
    // добавляем текущую ячейку в путь
    pathCoords.push(currentCellIndex);
    // ищем слова в словаре, начиная с 2 букв
    if (pathCoords.length > 1) {
      let word = '';
      for (let k = 0; k < pathCoords.length; k++) {
        word += cells[pathCoords[k]];
      }

      if (pathCoords.length > this.word.length) {
        if (pathCoords.indexOf(filledCellIndex) !== -1) {
          if (this.dict.findWord(word)) {
            if (this.usedWords.indexOf(word) === -1) {
              // если слова длиннее ранее найденного
              // проверяем содержит ли путь добавленную букву
              this.word = word;
              this.char = cells[filledCellIndex];
              this.index = filledCellIndex;
            }
          }
        }
      }
      // проверяем нужно ли продолжать искать слова
      if (!this.dict.findPartTest2(word)) return false;
    }

    const lineLength = Math.floor(Math.sqrt(cells.length));
    const lastLineStart = lineLength * (lineLength - 1);

    // рекурсивный вызов в 4 направлениях
    if (currentCellIndex < lastLineStart)
      this.findTrack(cells, pathCoords.slice(), currentCellIndex + lineLength, filledCellIndex);
    if (currentCellIndex > lineLength - 1)
      this.findTrack(cells, pathCoords.slice(), currentCellIndex - lineLength, filledCellIndex);
    if (currentCellIndex % lineLength < lineLength - 1)
      this.findTrack(cells, pathCoords.slice(), currentCellIndex + 1, filledCellIndex);
    if (currentCellIndex % lineLength > 0)
      this.findTrack(cells, pathCoords.slice(), currentCellIndex - 1, filledCellIndex);
  }

  public findWord(cells: string[], usedWords: string[] = []) {
    const chars = this.dict.getChars();
    const lineLength = Math.floor(Math.sqrt(cells.length));
    const lastLineStart = lineLength * (lineLength - 1);
    this.usedWords = usedWords;
    this.word = '';
    let start = Date.now();
    // цикл подстановок
    for (let i = 0; i < cells.length; i++) {
      // если пустая ячейка имеет смежные непустые ячейки
      if (
        !cells[i] &&
        ((i < lastLineStart && cells[i + lineLength]) ||
          (i > lineLength && cells[i - lineLength]) ||
          (i % lineLength < lineLength - 1 && cells[i + 1]) ||
          (i % lineLength > 0 && cells[i - 1]))
      ) {
        // подставляем буквы из строки chars
        for (let k = 0; k < chars.length; k++) {
          let cellsTemp = cells.slice();
          cellsTemp[i] = chars[k];
          // ищем пути
          for (let j = 0; j < cells.length; j++)
            // начиная с непустых ячеек
            if (cellsTemp[j] !== '') this.findTrack(cellsTemp, [], j, i);
        }
      }
    }

    return {
      word: this.word,
      char: this.char,
      index: this.index,
      time: (Date.now() - start) / 1000,
    };
  }
}
