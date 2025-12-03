import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const banks: string[] = input.split('\n');

const findMaxJoltage = (bank: string): number => {
    const batteries = bank.split('').map((value) => +value);

    let firstMaxBattery = 0;
    let firstMaxBatteryIndex = -1;

    for (let i = batteries.length - 2; i >= 0; i--) {
        if (batteries[i] >= firstMaxBattery) {
            firstMaxBattery = batteries[i];
            firstMaxBatteryIndex = i;
        }
    }

    let secondMaxBattery = 0;

    for (let i = batteries.length - 1; i > firstMaxBatteryIndex; i--) {
        if (batteries[i] > secondMaxBattery) {
            secondMaxBattery = batteries[i];
        }
    }

    return (firstMaxBattery * 10) + secondMaxBattery;
};

const result = banks.reduce((sum, bank) => {
    return sum + findMaxJoltage(bank);
}, 0);

console.log(result);