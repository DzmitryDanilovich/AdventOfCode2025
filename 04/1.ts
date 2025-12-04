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

let accessibleCount = 0;

for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] === '@' && isAccessible(row, col)) {
            accessibleCount++;
        }
    }
}

console.log(accessibleCount);