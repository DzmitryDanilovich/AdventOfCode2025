import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const [rangesPart, _] = input.split('\n\n');

interface Range {
    start: number;
    end: number;
    checked: boolean;
}

interface MergedRange {
    start: number;
    end: number;
}

const ranges: Range[] = rangesPart
    .split('\n')
    .map((line) => {
        const [start, end] = line.split('-').map((value) => +value);

        return {
            start,
            end,
            checked: false
        };
    });

const findMergedRange = (range: Range): MergedRange => ranges
    .filter((otherRange) => 
        !otherRange.checked
        && otherRange.start <= range.end
        && otherRange.end >= range.start
    ).reduce((mergedRange, otherRange) => {
        otherRange.checked = true;
        const otherMergedRange = findMergedRange(otherRange);

        return { 
            start: Math.min(mergedRange.start, otherMergedRange.start),
            end: Math.max(mergedRange.end, otherMergedRange.end),
        };
    }, { 
        start: range.start,
        end: range.end,
    });

const checkRange = (range: Range): number => {
    if (range.checked) {
        return 0;   
    }

    const mergedRange = findMergedRange(range);

    range.checked = true;
    return mergedRange.end - mergedRange.start + 1;
};

const result = ranges
    .reduce(
        (sum, range) => sum + checkRange(range),
        0,
    );

console.log(result);