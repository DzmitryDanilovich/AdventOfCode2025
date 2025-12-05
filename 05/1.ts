import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const [rangesPart, idsPart] = input.split('\n\n');

interface Range {
    start: number;
    end: number;
}

const ranges: Range[] = rangesPart
    .split('\n')
    .map((line) => {
        const [start, end] = line.split('-').map((value) => +value);
        return { start, end};
    });

const ids = idsPart
    .split('\n')
    .map((line) => +line);

const isInRanges = (id: number): boolean => {
    for (const range of ranges) {
        if (id >= range.start && id <= range.end) {
            return true;
        }
    }

    return false;
}

const result =ids.reduce((count, id) => {
    if (isInRanges(id)) {
        return count + 1;
    }

    return count;
}, 0);

console.log(result);