import fs from 'fs';
import { config } from 'process';

const input: string = fs.readFileSync('./input.txt', 'utf8');

enum LightState {
    OFF = '.',
    ON = '#',
}

interface MachineConfig {
    lightDiagram: LightState[];
    buttons: number[][];
    joltageRequirements: number[];
};

interface SolvedMatrix {
    matrix: number[][];
    pivotColumns: number[];
    nonIdentityCols: number[];
}

interface ButtonToFind {
    buttonIndex: number;
    numberOfPresses: number;
    maxPresses: number;
}

const machineConfigs: MachineConfig[] = input
    .split('\n')
    .map((line) => {
        const machineConfigArray = line.split(' ');

        const lightDiagram = machineConfigArray[0]
            .slice(1, -1)
            .split('')
            .map((char) => char as LightState);

        const buttons = machineConfigArray
            .slice(1, -1)
            .map((value) => value
                .slice(1, -1)
                .split(',')
                .map((num) => +num)
            );

        const joltageRequirements = machineConfigArray[machineConfigArray.length - 1]
            .slice(1, -1)
            .split(',')
            .map((num) => +num);

        return {
            lightDiagram,
            buttons,
            joltageRequirements,
        };
    });

const assembleMatrix = (config: MachineConfig): number[][] => {
    const { buttons, joltageRequirements } = config;

    const matrix: number[][] = [];

    for (let rowIndex = 0; rowIndex < joltageRequirements.length; rowIndex++) {
        matrix[rowIndex] = new Array(buttons.length).fill(0);
    }

    for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
        for (let counterIndex of buttons[buttonIndex]) {
            matrix[counterIndex][buttonIndex] = 1;
        }
    }
    
    for (let rowIndex = 0; rowIndex < joltageRequirements.length; rowIndex++) {
        matrix[rowIndex].push(joltageRequirements[rowIndex]);
    }

    return matrix;
}

const findValueRow = (
    matrix: number[][],
    pivotRowIndex: number,
    pivotColumnIndex: number,
): number | null => {
    for (let rowIndex = pivotRowIndex; rowIndex < matrix.length; rowIndex++) {
        if (Math.abs(matrix[rowIndex][pivotColumnIndex]) > 1e-10) {
            return rowIndex;
        }
    }

    return null;
};

const eliminateColumn = (
    matrix: number[][],
    pivotRowIndex: number,
    pivotColumnIndex: number,
): void => {
    const pivotValue = matrix[pivotRowIndex][pivotColumnIndex];

    for (let columnIndex = pivotColumnIndex; columnIndex < matrix[pivotRowIndex].length; columnIndex++) {
        matrix[pivotRowIndex][columnIndex] /= pivotValue;
    }

    for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
        if (rowIndex === pivotRowIndex) {
            continue;
        }

        const factor = matrix[rowIndex][pivotColumnIndex];

        for (let columnIndex = pivotColumnIndex; columnIndex < matrix[rowIndex].length; columnIndex++) {
            matrix[rowIndex][columnIndex] -= factor * matrix[pivotRowIndex][columnIndex];
        }
    }
};

const applyGaussianElimination = (config: MachineConfig): SolvedMatrix => {
    const matrix = assembleMatrix(config);

    let pivotRowIndex = 0;
    const pivotColumns: number[] = [];
    const nonIdentityCols: number[] = [];

    for (let columnIndex = 0; columnIndex < matrix[0].length - 1; columnIndex++) {
        const valueRowIndex = findValueRow(matrix, pivotRowIndex, columnIndex);

        if (valueRowIndex === null) {
            nonIdentityCols.push(columnIndex);
            continue;
        }

        [matrix[pivotRowIndex], matrix[valueRowIndex]] = [matrix[valueRowIndex], matrix[pivotRowIndex]];

        eliminateColumn(matrix, pivotRowIndex, columnIndex);

        pivotColumns[pivotRowIndex] = columnIndex;
        pivotRowIndex++;
    }

    return { matrix, pivotColumns, nonIdentityCols };
};

const findMaximumPressesPerButton = (
    button: number[],
    joltageRequirements: number[],
): number =>  Math.min(...button.map((id) => joltageRequirements[id]));

const calculateTotalPresses = (
    matrix: number[][],
    buttonsToFind: ButtonToFind[],
): number => {
    const resultValues = matrix
        .map((row) => row[row.length - 1]);

    for (let button of buttonsToFind) {
        for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
            resultValues[rowIndex] -= button.numberOfPresses * matrix[rowIndex][button.buttonIndex];
        }
    }

    const isValid = resultValues
        .every((val) => Math.abs(val - Math.round(val)) < 1e-10
            && val >= -1e-10);

    if (!isValid) {
        return Number.MAX_SAFE_INTEGER;
    }
    
    return buttonsToFind.reduce(
        (sum, button) => sum + button.numberOfPresses,
        0,
    ) + resultValues.reduce(
        (sum, val) => sum + Math.round(val),
        0,
    );
}

const findMinimumButtonPresses = (
    matrix: number[][],
    buttonsToFind: ButtonToFind[],
    nextPressedIndex = 0,
): number => {
    if (nextPressedIndex >= buttonsToFind.length) {
        return calculateTotalPresses(matrix, buttonsToFind);
    }

    let minPresses = Number.MAX_SAFE_INTEGER;

    for (let presses = 0; presses <= buttonsToFind[nextPressedIndex].maxPresses; presses++) {
        const newButtonsToFind = buttonsToFind
            .map((button) => ({ ...button }));

        newButtonsToFind[nextPressedIndex].numberOfPresses = presses;

        const pressesCount = findMinimumButtonPresses(
            matrix,
            newButtonsToFind,
            nextPressedIndex + 1,
        );

        if (pressesCount < minPresses) {
            minPresses = pressesCount;
        }
    }

    return minPresses;
};

const findMinimumPresses = (config: MachineConfig): number => {
    const solvedMatrix = applyGaussianElimination(config);

    const buttonsToFind = solvedMatrix.nonIdentityCols
        .map((index) => {
            return {
                buttonIndex: index,
                numberOfPresses: 0,
                maxPresses: findMaximumPressesPerButton(
                    config.buttons[index],
                    config.joltageRequirements,
                ),
            };
        });

    const minPresses = findMinimumButtonPresses(
        solvedMatrix.matrix,
        buttonsToFind,
    );

    return minPresses;
};

const result = machineConfigs
    .reduce((sum, machineConfig) => sum + findMinimumPresses(machineConfig), 0);

console.log(result);
