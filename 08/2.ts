import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

const points: Point[] = input
    .split('\n')
    .map((line, index) => {
        const [x, y, z] = line.split(',').map((value) => +value);
        return { id: index, x, y, z };
    });

interface Point {
    id: number;
    x: number;
    y: number;
    z: number;
};

interface Connection {
    pointAId: number;
    pointBId: number;
    distance: number;
};

const calculateDistance = (a: Point, b: Point): Connection => {
    const distance = Math
        .sqrt(
            ((a.x - b.x) ** 2)
            + ((a.y - b.y) ** 2)
            + ((a.z - b.z) ** 2)
        );

    return {
        pointAId: a.id,
        pointBId: b.id,
        distance,
    };
};

const connections : Connection[] = [];

for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
        const connection = calculateDistance(points[i], points[j]);
        connections.push(connection);
    }
}

connections.sort((a, b) => a.distance - b.distance);

const circuits : Set<number>[] = [];

const connectToCircuit = (connection: Connection, circuit: Set<number>): boolean => {
    const hasPointA = circuit.has(connection.pointAId);
    const hasPointB = circuit.has(connection.pointBId);

    if (hasPointA && hasPointB) {
        return true;
    }

    if (hasPointA && !hasPointB) {
        circuit.add(connection.pointBId);
        return true;
    }

    if (!hasPointA && hasPointB) {
        circuit.add(connection.pointAId);
        return true;
    }

    return false;
}

const mergeCircuits = (connectedCircuits: number[]) => {
    const mainCircuitIndex = connectedCircuits[0];

    for (let i = 1; i < connectedCircuits.length; i++) {
        const circuitIndex = connectedCircuits[i];
        const circuit = circuits[circuitIndex];

        circuits[mainCircuitIndex] = new Set([
            ...circuits[mainCircuitIndex],
            ...circuit,
        ]);

        circuits.splice(circuitIndex, 1);
    }
};

const addToCircuit = (connection: Connection) => {
    const connectedCircuits: number[] = [];

    for (let i = 0; i < circuits.length; i++) {
        const circuit = circuits[i];

        if (connectToCircuit(connection, circuit)) {
            connectedCircuits.push(i);
        }
    }

    if (connectedCircuits.length > 0) {
        mergeCircuits(connectedCircuits);
        return;
    }

    circuits.push(new Set([connection.pointAId, connection.pointBId]));
};

let lastConnection : Connection;

for (let i = 0; circuits[0]?.size !== points.length; i++) {
    lastConnection = connections[i];
    addToCircuit(lastConnection);
}

const result = points[lastConnection!.pointAId].x * points[lastConnection!.pointBId].x;

console.log(result);
