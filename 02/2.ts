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

const getRepeatingPart = (numberString: string, numberOfParts: number): string => {
    if (numberString.length % numberOfParts !== 0) {
        const partLength = Math.floor(numberString.length / numberOfParts) + 1;
        return '1'.padEnd(partLength, '0');
    }

    return numberString.slice(0, numberString.length / numberOfParts);
};

let invalidIdsSum = 0;

const findForNumberOfParts = (range: Range, numberOfParts: number, foundIds: number[]): number[] => {
    if (range.start.length % numberOfParts !== 0 
        && range.end.length % numberOfParts !== 0
        && range.start.length === range.end.length) {
        return foundIds;
    }

    let repeatingPart = getRepeatingPart(range.start, numberOfParts);

    const startNumber = +range.start;
    const endNumber = +range.end;

    let potentiallyInvalidId = +repeatingPart.repeat(numberOfParts);

    if (potentiallyInvalidId < startNumber) {
        repeatingPart = (+repeatingPart + 1).toString();
        potentiallyInvalidId = +repeatingPart.repeat(numberOfParts);
    }

    let newFoundIds: number[] = [];

    while (potentiallyInvalidId <= endNumber) {
        if (!foundIds.includes(potentiallyInvalidId)) {
            invalidIdsSum += potentiallyInvalidId;
            newFoundIds.push(potentiallyInvalidId);
        }
        
        repeatingPart = (+repeatingPart + 1).toString();
        potentiallyInvalidId = +repeatingPart.repeat(numberOfParts);
    }

    return foundIds.concat(newFoundIds);
};

ranges.forEach((range) => {
    let foundIds: number[] = [];
    for (let numberOfParts = 2; numberOfParts <= range.end.length; numberOfParts++) {
        foundIds = findForNumberOfParts(range, numberOfParts, foundIds);
    }
});

console.log(invalidIdsSum);