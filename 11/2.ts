import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const startingDevice = 'svr';
const endingDevice = 'out';

const dacDevice = 'dac';
const fftDevice = 'fft';

interface NewDevice {
    outputs: string[];
};

interface VisitedDevice {
    numberOfPathsToOut: number;
    dacCount: number;
    fftCount: number;
    outCount: number;
};

type Device = NewDevice | VisitedDevice;

const isVisited = (device: Device): device is VisitedDevice => 
    (device as VisitedDevice).numberOfPathsToOut !== undefined;

const isNew = (device: Device): device is NewDevice => 
    (device as NewDevice).outputs !== undefined;

const devices = new Map<string, Device>(input
    .split('\n')
    .map(line => {
        const [name, outputsStr] = line.split(': ');
        const outputs = outputsStr.split(' ');

        const deviceRecord: [string, Device] = [
            name,
            {
                outputs,
            },
        ]

        return deviceRecord;
    }));


const buildNewVisitedDevice = (deviceName: string, outputDevice: VisitedDevice): VisitedDevice => {
    const newVisitedDevice = {...outputDevice};

    if (deviceName === dacDevice) {
        newVisitedDevice.numberOfPathsToOut += newVisitedDevice.fftCount;
        newVisitedDevice.fftCount = 0;
        newVisitedDevice.dacCount += newVisitedDevice.outCount;
        newVisitedDevice.outCount = 0;

        return newVisitedDevice;
    }

    if (deviceName === fftDevice) {
        newVisitedDevice.numberOfPathsToOut += newVisitedDevice.dacCount;
        newVisitedDevice.dacCount = 0;
        newVisitedDevice.fftCount += newVisitedDevice.outCount;
        newVisitedDevice.outCount = 0;

        return newVisitedDevice;
    }

    return newVisitedDevice;
};

const checkDevice = (deviceName: string, visitedDevices: Set<string> = new Set()): void => {
    if (deviceName === endingDevice) {
        devices.set(deviceName, {
            numberOfPathsToOut: 0,
            dacCount: 0,
            fftCount: 0,
            outCount: 1,
        });

        return;
    }
    
    const device = devices.get(deviceName)!;

    if (!isNew(device)) {
        return;
    }
    
    if (visitedDevices.has(deviceName)) {
        return;
    }

    const newVisitedDevices = new Set(visitedDevices);
    newVisitedDevices.add(deviceName);

    for (const outputName of device.outputs) {
        checkDevice(outputName, newVisitedDevices);
    }

    const visitedDevice: VisitedDevice = device.outputs
        .reduce((acc, outputName) => {
            const outputDevice = devices.get(outputName)!;

            if (!isVisited(outputDevice)) {
                return acc;
            }

            const newVisitedDevice = buildNewVisitedDevice(deviceName, outputDevice);

            return {
                numberOfPathsToOut: acc.numberOfPathsToOut + newVisitedDevice.numberOfPathsToOut,
                dacCount: acc.dacCount + newVisitedDevice.dacCount,
                fftCount: acc.fftCount + newVisitedDevice.fftCount,
                outCount: acc.outCount + newVisitedDevice.outCount,
            };
        }, {
            numberOfPathsToOut: 0,
            dacCount: 0,
            fftCount: 0,
            outCount: 0,
        });

    devices.set(deviceName, visitedDevice);
};

checkDevice(startingDevice);

const resultDevice = devices.get(startingDevice)!;
const result = isVisited(resultDevice) ? resultDevice.numberOfPathsToOut : 0;

console.log(result);
