import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

enum Symbol {
    Empty = '.',
    Splitter = '^',
    Entrance = 'S',
    Beam = '|',
}

const map: Symbol[][] = input
    .split('\n')
    .map((line) => line
        .split('')
        .map((char) => char as Symbol)
    );

const processCell = (row: number, col: number): boolean => {
    if (map[row][col] === Symbol.Splitter 
        && map[row - 1][col] === Symbol.Beam) {
        map[row][col - 1] = Symbol.Beam;
        map[row][col + 1] = Symbol.Beam;
        map[row + 1][col - 1] = Symbol.Beam;
        map[row + 1][col + 1] = Symbol.Beam;
        return true;
    }

    if (map[row][col] === Symbol.Empty 
        && map[row - 1][col] === Symbol.Beam) {
        map[row][col] = Symbol.Beam;
        map[row + 1][col] = Symbol.Beam;
        return false;
    }

    return false;
};

let splitCount = 0;

for (let col = 0; col < map[0].length; col++) {
    if (map[0][col] === Symbol.Entrance) {
        map[1][col] = Symbol.Beam;
    }
}

for (let row = 2; row < map.length; row += 2) {
    for (let col = 0; col < map[row].length; col++) {
        splitCount += processCell(row, col) ? 1 : 0;
    }
}

console.log(splitCount);
