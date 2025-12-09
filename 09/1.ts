import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

interface Corner {
    x: number;
    y: number;
}

const corners = input
    .split('\n')
    .map((line) => {
        const [x, y] = line.split(',').map((value) => +value);
        return { x, y };
    });

const getRectangleArea = (a: Corner, b: Corner): number => {
    return (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1);
}

let largestArea = 0;

for (let i = 0; i < corners.length; i++) {
    for (let j = i + 1; j < corners.length; j++) {
        const area = getRectangleArea(corners[i], corners[j]);

        if (area > largestArea) {
            largestArea = area;
        }
    }
}

console.log(largestArea);