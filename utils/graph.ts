import Matrix from './matrix';

interface IBranch {
  index: number;
  character: string;
  children: IBranch[];
}

export default class Graph {
  private fieldSize: number;
  private graph: IBranch;

  constructor(cells: string[], startIndex: number) {
    this.fieldSize = Math.sqrt(cells.length);
    this.graph = this._build(cells, startIndex);
  }

  get paths() {
    return this._traverse(this.graph, [], []);
  }

  _build(cells: string[], idx: number, visited: number[] = []) {
    let children: IBranch[] = [];
    const neighbours = Matrix.crossNeighbours(this.fieldSize, idx);

    visited[idx] = idx;

    neighbours.forEach((newIdx) => {
      const notEmpty = cells[newIdx] !== '';
      const notVisited = typeof visited[newIdx] === 'undefined';

      if (notEmpty && notVisited) {
        children.push(this._build(cells, newIdx, visited.slice()));
      }
    });

    return {
      index: idx,
      character: cells[idx],
      children: children,
    };
  }

  _traverse(branch: IBranch, path: string[], basket: string[][]) {
    const children = branch.children;
    const childrenCount = children.length;
    let fork = path.slice(0);

    fork.push(branch.character);

    if (childrenCount === 0) {
      basket.push(fork);
      return basket;
    }

    for (let i = 0; i < childrenCount; i += 1) {
      this._traverse(children[i], fork, basket);
    }

    return basket;
  }
}
