import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const map = input.split('\n').map((line) => line.split(''));

const isAccessible = (row: number, col: number): boolean => {
    let rollsCount = 0;

    for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
            if (map[row + dRow]?.[col + dCol] === '@') {
                rollsCount++;
            }
        }
    }

    return rollsCount < 5;
}

const removeRolls = () => {
    let removedCount = 0;

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === '@' && isAccessible(row, col)) {
                map[row][col] = '.';
                removedCount++;
            }
        }
    }

    return removedCount;
};

let totalRemovedCount = 0;

while (true) {
    const removedCount = removeRolls();

    if (removedCount === 0) {
        break;
    }

    totalRemovedCount += removedCount;
}

console.log(totalRemovedCount);