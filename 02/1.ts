import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

interface Range {
    start: string;
    end: string;
}

const ranges: Range[] = input
    .split(',')
    .map((rangeString) => {
        const [startString, endString] = rangeString.split('-');
        return {
            start: startString,
            end: endString,
        };
    });

const getRepeatingPart = (numberString: string): string => {
    if (numberString.length % 2 !== 0) {
        const halfLength = Math.floor(numberString.length / 2) + 1;
        return '1'.padEnd(halfLength, '0');
    }

    return numberString.slice(0, numberString.length / 2);
};

let invalidIdsSum = 0;

ranges.forEach((range) => {
    if (range.start.length % 2 !== 0 
        && range.end.length % 2 !== 0
        && range.start.length === range.end.length) {
        return;
    }

    let repeatingPart = getRepeatingPart(range.start);

    const startNumber = +range.start;
    const endNumber = +range.end;

    let potentiallyInvalidId = +repeatingPart.repeat(2);

    if (potentiallyInvalidId < startNumber) {
        repeatingPart = (+repeatingPart + 1).toString();
        potentiallyInvalidId = +repeatingPart.repeat(2);
    }

    while (potentiallyInvalidId <= endNumber) {
        invalidIdsSum += potentiallyInvalidId;
        
        repeatingPart = (+repeatingPart + 1).toString();
        potentiallyInvalidId = +repeatingPart.repeat(2);
    }
});

console.log(invalidIdsSum);