import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const inputStrings = input.split('\n');

const numberStrings = inputStrings.slice(0, -1).map((line) => line.split(''));
const operationString = inputStrings[inputStrings.length - 1].split('');

const collectNumber = (symbolIndex: number): number => {
    let number = '';

    for (let stringIndex = 0; stringIndex < numberStrings.length; stringIndex++) {
        if (numberStrings[stringIndex][symbolIndex] !== ' ') {
            number += numberStrings[stringIndex][symbolIndex];
        }
    }

    return +number;
}

const calculateColumn = (
    startIndex: number,
    endIndex: number,
    operation: string,
): number => {
    let result = operation === '+' ? 0 : 1;

    for (let i = startIndex; i <= endIndex; i++) {
        const number = collectNumber(i);

        result = operation === '+'
            ? result + number
            : result * number;
    }

    return result;
};

let currentSymbol = operationString[0];
let currentStartIndex = 0;

let result = 0;

for (let i = 1; i <= operationString.length; i++) {
    if (operationString[i] === ' ') {
        continue
    }

    let endIndex = i === operationString.length
        ? i - 1
        : i - 2;

    result += calculateColumn(
        currentStartIndex,
        endIndex,
        currentSymbol,
    );

    currentSymbol = operationString[i];
    currentStartIndex = i;
}

console.log(result);