import fs from 'fs';
import { machine } from 'os';

const input: string = fs.readFileSync('./input.txt', 'utf8');

enum LightState {
    OFF = '.',
    ON = '#',
}

interface MachineConfig {
    lightDiagram: LightState[];
    buttons: Set<number>[];
    joltageRequirements: number[];
};

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
            .map((value) => new Set(value
                .slice(1, -1)
                .split(',')
                .map((num) => +num)
            ));

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

const switchState = (
    lightsState: Set<number>,
    buttons: Set<number>[],
    pressedTimes: number,
    minPressedTimes: number): number => {
    if (lightsState.size === 0) {
        return pressedTimes;
    }

    if (pressedTimes >= minPressedTimes) {
        return Number.MAX_SAFE_INTEGER;
    }

    const firstValue = lightsState.values().next().value as number;

    const matchingButtons = buttons
        .filter((button) => button.has(firstValue));

    let newMinPressedTimes = minPressedTimes;
    let numbersOfPresses: number[] = [];

    for (const button of matchingButtons) {
        const newLightsState = lightsState.symmetricDifference(button);
        const newButtons = buttons.filter((b) => b !== button);

        const numberOfPresses = switchState(
            newLightsState,
            newButtons,
            pressedTimes + 1,
            newMinPressedTimes,
        );

        numbersOfPresses.push(numberOfPresses);

        if (numberOfPresses < newMinPressedTimes) {
            newMinPressedTimes = numberOfPresses;
        }
    }

    return Math.min(...numbersOfPresses);
};

const findMinimumButtonPresses = (machineConfig: MachineConfig): number => {
    const expectedState = machineConfig.lightDiagram
        .reduce((acc, light, index) => {
            if (light === LightState.ON) {
                acc.add(index);
            }

            return acc;
        }, new Set<number>()
    );

    return switchState(
        expectedState,
        machineConfig.buttons,
        0,
        Number.MAX_SAFE_INTEGER,
    );
};

const result = machineConfigs
    .reduce((sum, machineConfig) => {
        return sum + findMinimumButtonPresses(machineConfig);
    }, 0);

console.log(result);
