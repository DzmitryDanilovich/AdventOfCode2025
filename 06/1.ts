import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const result = input
    .split('\n')
    .map((line) => line
        .split(' ')
        .filter((value) => value)
    )
    .reduce<string[][]>((acc, line) => {
        for (const index in line) {
            if (!acc[index]) {
                acc[index] = [];
            }

            acc[index].push(line[index]);
        }

        return acc;
    }, [])
    .map((equation) => {
        const numbers = equation.slice(0, -1);
        const operation = equation[equation.length - 1];

        return numbers.reduce((acc, number) => {
            return operation === '+'
                ? acc + +number
                : acc * +number;
        }, operation === '+' ? 0 : 1);
    })
    .reduce((sum, value) => sum + value, 0);

console.log(result);