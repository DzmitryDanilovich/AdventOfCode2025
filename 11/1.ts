import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const startingDevice = 'you';
const endingDevice = 'out';

const devices = new Map(input
    .split('\n')
    .map(line => {
        const [name, outputsStr] = line.split(': ');

        return [
            name,
            outputsStr.split(' '),
        ];
    }));

const checkDevice = (deviceName: string, visitedDevices: Set<string> = new Set()): number => {
    if (visitedDevices.has(deviceName)) {
        return 0;
    }

    if (deviceName === endingDevice) {
        return 1;
    }

    return devices.get(deviceName)!
        .reduce((acc, outputDeviceName) => {
            const newVisitedDevices = new Set(visitedDevices);
            newVisitedDevices.add(deviceName);

            const pathsToOutput = checkDevice(outputDeviceName, newVisitedDevices);
            return acc + pathsToOutput;
        }, 0);
};

const result = checkDevice(startingDevice);

console.log(result);
