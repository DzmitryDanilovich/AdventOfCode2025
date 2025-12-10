import fs from 'fs';

const input: string = fs.readFileSync('./input.txt', 'utf8');

interface Point {
    x: number;
    y: number;
}

interface Corner extends Point {
    id: number;
}

interface Rectangle {
    cornerAId: number;
    cornerBId: number;
    area: number;
}

interface HashArray {
    [x: number]: Corner[];
}

const corners: Corner[] = input
    .split('\n')
    .map((line, index) => {
        const [x, y] = line.split(',').map((value) => +value);
        return { id: index, x, y };
    });

const getRectangleArea = (a: Corner, b: Corner): number => {
    return (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1);
}

const rectangles: Rectangle[] = [];
const cornersHashArrayX: HashArray = {};
const cornersHashArrayY: HashArray = {};

for (let i = 0; i < corners.length; i++) {
    for (let j = i + 1; j < corners.length; j++) {
        const area = getRectangleArea(corners[i], corners[j]);

        rectangles.push({
            cornerAId: i,
            cornerBId: j,
            area,
        });
    }

    if (!cornersHashArrayX[corners[i].x]) {
        cornersHashArrayX[corners[i].x] = [];
    }

    if (!cornersHashArrayY[corners[i].y]) {
        cornersHashArrayY[corners[i].y] = [];
    }

    cornersHashArrayX[corners[i].x].push(corners[i]);
    cornersHashArrayY[corners[i].y].push(corners[i]);
}

Object.keys(cornersHashArrayX).forEach((key) => {
    cornersHashArrayX[+key].sort((a, b) => a.y - b.y);
});

Object.keys(cornersHashArrayY).forEach((key) => {
    cornersHashArrayY[+key].sort((a, b) => a.x - b.x);
});

const getPreviousCorner = (corner: Corner): Corner | null => {
    const cornerIndex = cornersHashArrayY[corner.y].findIndex((c) => c.x === corner.x);
    if (cornerIndex % 2 === 1) {
        return cornersHashArrayY[corner.y][cornerIndex - 1];
    }

    return null;
};

const checkIntersectionX = (y: number, corners: Corner[]): boolean => {
    for (let i = 0; i < corners.length; i += 2) {
        if (corners[i].y < y && y < corners[i + 1].y) {
            return true;
        }

        if (corners[i].y === y) {
            const previousCorner = getPreviousCorner(corners[i]);

            if (previousCorner && previousCorner.y > y) {
                return true;
            }
        }

        if (corners[i + 1].y === y) {
            const previousCorner = getPreviousCorner(corners[i + 1]);

            if (previousCorner && previousCorner.y < y) {
                return true;
            }
        }
    }

    return false;
};

const isPointInside = (point: Point) => {
    const numberOfIntersections = Object.keys(cornersHashArrayX)
        .reduce((acc, key) => {
            const x = +key;

            if (x <= point.x) {
                return acc;
            }

            if (checkIntersectionX(point.y, cornersHashArrayX[x])) {
                return acc + 1; 
            }

            return acc;
            
            }, 0);

    return numberOfIntersections % 2 === 1;
};

const noIntersections = (rectangle: Rectangle): boolean => {
    const cornerA = corners[rectangle.cornerAId];
    const cornerB = corners[rectangle.cornerBId];

    const minX = Math.min(cornerA.x, cornerB.x);
    const maxX = Math.max(cornerA.x, cornerB.x);
    const minY = Math.min(cornerA.y, cornerB.y);
    const maxY = Math.max(cornerA.y, cornerB.y);

    for (const key of Object.keys(cornersHashArrayX)) {
        const x = +key;

        if (x <= minX || x >= maxX) {
            continue;
        }

        const cornersAtX = cornersHashArrayX[x];

        for (let i = 0; i < cornersAtX.length; i += 2) {
            if ((cornersAtX[i].y <= minY && minY < cornersAtX[i + 1].y)
                || (cornersAtX[i].y < maxY && maxY <= cornersAtX[i + 1].y)) {
                return false;
            }
        }
    }

    for (const key of Object.keys(cornersHashArrayY)) {
        const y = +key;

        if (y <= minY || y >= maxY) {
            continue;
        }

        const cornersAtY = cornersHashArrayY[y];

        for (let i = 0; i < cornersAtY.length; i += 2) {
            if ((cornersAtY[i].x <= minX && minX < cornersAtY[i + 1].x)
                || (cornersAtY[i].x < maxX && maxX <= cornersAtY[i + 1].x)) {
                return false;
            }
        }
    }

    return true;
};

const isRectangleInside = (rectangle: Rectangle): boolean => {
    const cornerA = corners[rectangle.cornerAId];
    const cornerB = corners[rectangle.cornerBId];

    if (
        isPointInside({ x: cornerA.x, y: cornerA.y })
        && isPointInside({ x: cornerA.x, y: cornerB.y })
        && isPointInside({ x: cornerB.x, y: cornerA.y })
        && isPointInside({ x: cornerB.x, y: cornerB.y })
        && noIntersections(rectangle)) {
        return true;
    }

    return false;
};

const findFirstInnerRectangle = (): Rectangle | null => {
    for (let i = 0; i < rectangles.length; i++) {
        const rectangle = rectangles[i];

        if (isRectangleInside(rectangle)) {
            return rectangle;
        }
    }

    return null;
}

rectangles.sort((a, b) => b.area - a.area);

const result = findFirstInnerRectangle()?.area;

console.log(result);