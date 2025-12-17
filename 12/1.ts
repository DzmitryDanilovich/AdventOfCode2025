import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const splitInput = input.split('\n\n');

const regionsInput = splitInput.at(-1);

interface Size {
    width: number;
    length: number;
};

interface Region {
    size: Size;
    shapesNumber: number[];
};

const regions: Region[] = regionsInput!
    .split('\n')
    .map(line => {
        const [sizeString, shapesNumberString] = line.split(': ');
        const [width, length] = sizeString.split('x').map(Number);
        const shapesNumber = shapesNumberString.split(' ').map(Number);

        return {
            size: {
                width,
                length,
            },
            shapesNumber,
        };
    });

const result = regions
    .reduce((acc, region) => {
        const regionArea = region.size.width * region.size.length;
        const shapesArea = region.shapesNumber
            .reduce((shapesAcc, shapeNumber) => shapesAcc + shapeNumber * 9, 0);

        if (shapesArea <= regionArea) {
            return acc + 1;
        }

        return acc;
    },
    0,
);

console.log(result);
