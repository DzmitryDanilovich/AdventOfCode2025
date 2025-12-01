import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const limit = 100;

let position = 50;

let result = 0;

interface Rotation {
    direction: string;
    steps: number;
}

const rotateLeft = (steps: number) => {
    const initialPosition = position;

    position -= steps;

    if (position === 0) {
        result++;
        return;
    }

    if (position >= 0) {
        return;
    }

    position += limit;

    if (initialPosition !== 0) {
        result++;
    }
};

const rotateRight = (steps: number) => {
    position += steps;

    if (position === 0) {
        result++;
        return;
    }

    if (position < limit) {
        return;
    }

    position -= limit;
    result++;
};

const rotate = (rotation: Rotation) => {
    const steps = rotation.steps % limit;
    const fullRotations = Math.floor(rotation.steps / limit);

    result += fullRotations;

    if (steps === 0) {
        return;
    }

    if (rotation.direction === 'L') {
        rotateLeft(steps);
    } else {
        rotateRight(steps);
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