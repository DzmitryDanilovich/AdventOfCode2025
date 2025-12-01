import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const limit = 100;

let position = 50;

let result = 0;

interface Rotation {
    direction: string;
    steps: number;
}

const rotate = (rotation: Rotation) => {
    const steps = rotation.steps % limit;

    if (rotation.direction === 'L') {
        position -= steps;

        if (position < 0) {
            position += limit;
        }
    } else {
        position += steps;

        if (position >= limit) {
            position -= limit;
        }
    }

    if (position === 0) {

        result++;
    }
};

input
    .split('\n')
    .map((line) => ({
        direction: line[0],
        steps: parseInt(line.slice(1), 10),
    }))
    .forEach(rotate);

console.log(result);