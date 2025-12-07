import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

enum Symbol {
    Empty = '.',
    Splitter = '^',
    Entrance = 'S',
    Beam = '|',
}

interface BeamCell {
    symbol: Symbol.Beam;
    numberOfWays: number;
}

type Cell = BeamCell | {
    symbol: Symbol.Empty | Symbol.Splitter | Symbol.Entrance;
};

const map: Cell[][] = input
    .split('\n')
    .filter((_, index) => index % 2 === 0)
    .map((line) => line
        .split('')
        .map((char) => ({ symbol: char } as Cell))
    );

const processCell = (row: number, col: number): void => {
    const cellAbove = map[row - 1][col];

    if (cellAbove.symbol !== Symbol.Beam) {
        return;
    }

    if (map[row][col].symbol === Symbol.Empty) {
        map[row][col] = { ...cellAbove };
        return;
    }

    if (map[row][col].symbol === Symbol.Beam) {
        map[row][col].numberOfWays += cellAbove.numberOfWays;
        return;
    }

    if (map[row][col].symbol !== Symbol.Splitter) {
        return;
    }

    map[row][col + 1] = { ...cellAbove };

    const cellLeft = map[row][col - 1];

    if (cellLeft.symbol === Symbol.Beam) {
        cellLeft.numberOfWays += cellAbove.numberOfWays;
        return;
    }

    map[row][col - 1] = { ...cellAbove };
};

for (let col = 0; col < map[0].length; col++) {
    if (map[0][col].symbol === Symbol.Entrance) {
        map[0][col] = { symbol: Symbol.Beam, numberOfWays: 1 };
    }
}

for (let row = 1; row < map.length; row ++) {
    for (let col = 0; col < map[row].length; col++) {
        processCell(row, col);
    }
}

const result = map[map.length - 1]
    .reduce((sum, cell) => {
        if (cell.symbol === Symbol.Beam) {
            return sum + cell.numberOfWays;
        }

        return sum;
    }, 0);

console.log(result);
