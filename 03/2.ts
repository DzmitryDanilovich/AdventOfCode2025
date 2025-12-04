import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const banks: string[] = input.split('\n');

const findMaxJoltageBatteryIndex = (batteries: number[]): number => {
    let maxBattery = 0;
    let maxBatteryIndex = -1;

    for (let i = batteries.length - 1; i >= 0; i--) {
        if (batteries[i] >= maxBattery) {
            maxBattery = batteries[i];
            maxBatteryIndex = i;
        }
    }

    return maxBatteryIndex;
};

const findMaxJoltage = (bank: string): number => {
    const batteries = bank.split('').map((value) => +value);

    let result = 0;
    let currentMaxIndex = -1;

    for (let i = 11; i >= 0; i--) {
        const batteriesSlice = batteries.slice(currentMaxIndex + 1, batteries.length - i);

        const maxBatteryIndex = findMaxJoltageBatteryIndex(batteriesSlice);

        currentMaxIndex = currentMaxIndex + 1 + maxBatteryIndex;

        result = result + (batteries[currentMaxIndex] * Math.pow(10, i));
    }

    return result;
};

const result = banks.reduce((sum, bank) => {
    return sum + findMaxJoltage(bank);
}, 0);

console.log(result);