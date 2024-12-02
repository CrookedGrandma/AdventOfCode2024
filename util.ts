export function chunkIntoN<T>(arr: T[], n: number): T[][] {
    const size = Math.ceil(arr.length / n);
    return Array.from({ length: n }, (_, i) => arr.slice(i * size, i * size + size));
}

export function randomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function intersect<T>(a: T[], b: T[]): T[] {
    return a.filter(e => b.includes(e));
}

export function maxBy<T>(arr: T[], fn: (el: T) => number) {
    return arr.reduce((prev, current) => (prev && fn(prev) > fn(current)) ? prev : current);
}

export function minBy<T>(arr: T[], fn: (el: T) => number) {
    return arr.reduce((prev, current) => (prev && fn(prev) < fn(current)) ? prev : current);
}

export function sum(arr: number[]) {
    return arr.reduce((total, next) => total + next, 0);
}

export function indicesOf(needle: string, haystack: string) {
    const indices = [];
    for (let i = 0; i < haystack.length; i++)
        if (haystack[i] == needle)
            indices.push(i);
    return indices;
}

export function isNumber(obj: any): obj is number {
    return Number.isFinite(obj);
}

export function isInteger(str: string): number | false {
    const parsed = parseInt(str);
    if (isNaN(parsed))
        return false;
    return parsed;
}

export function assertNotFalsy<T>(obj: T | undefined): T {
    if (!obj)
        throw Error(`Falsy value asserted to be not falsy: ${obj}`);
    return obj;
}

export function stringToCharDict(str: string): Record<string, number> {
    const dict: Record<string, number> = {};
    for (const c of str) {
        if (!(c in dict))
            dict[c] = 0;
        dict[c]++;
    }
    return dict;
}

export function leastCommonMultipleArray(arr: number[]): number {
    if (arr.length == 0)
        throw Error("Empty array passed");
    arr.sort((a, b) => a - b);
    let multiple = arr[0];
    for (const a of arr.slice(1))
        multiple = leastCommonMultiple(multiple, a);
    return multiple;
}

export function leastCommonMultiple(a: number, b: number): number {
    return Math.abs(a) * (Math.abs(b) / greatestCommonDivisor(a, b));
}

export function greatestCommonDivisor(a: number, b: number): number {
    return b == 0 ? a : greatestCommonDivisor(b, a % b);
}

export enum Direction {
    Up,
    Right,
    Down,
    Left,
}

export function dirToStr(dir: Direction) {
    switch (dir) {
        case Direction.Up: return "^";
        case Direction.Right: return ">";
        case Direction.Down: return "v";
        case Direction.Left: return "<";
    }
}

export function opposite(dir: Direction) {
    return ((dir + 2) % 4) as Direction;
}

export function fourAround(x: number, y: number) {
    return [
        [x, y - 1],
        [x + 1, y],
        [x, y + 1],
        [x - 1, y],
    ];
}

export function eightAround(x: number, y: number) {
    return [
        [x,     y - 1],
        [x + 1, y - 1],
        [x + 1, y],
        [x + 1, y + 1],
        [x,     y + 1],
        [x - 1, y + 1],
        [x - 1, y],
        [x - 1, y - 1],
    ];
}

export function setCharAt(str: string, index: number, chr: string) {
    if (index > str.length - 1 || index < 0)
        return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

export function getDistinctPairs<T>(array: T[]) {
    const pairs: ([a: T, b: T])[] = [];
    for (let i = 0; i < array.length - 1; i++)
        for (let j = i + 1; j < array.length; j++)
            pairs.push([array[i], array[j]]);
    return pairs;
}

export function manhattanDistance(a: Position, b: Position) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function getShortestPathAStar(from: Position, to: Position, neighbours: (from: Position) => Position[], heur: (from: Position) => number, costOfStep: (a: Position, b: Position, goal: Position) => number): Position[] {
    const openSet: AStarNode<Position>[] = [{ item: from, gScore: 0, fScore: heur(from) }];
    const explored: AStarNode<Position>[] = [openSet[0]];

    while (openSet.length > 0) {
        const current = minBy(openSet, p => p.fScore);
        if (positionsEqual(current.item, to)) {
            const path: Position[] = [];
            const endNode = explored.find(p => positionsEqual(p.item, to));
            if (!endNode)
                throw Error("something's up");
            let node = endNode;
            while (node.cameFrom) {
                path.splice(0, 0, node.item);
                node = node.cameFrom;
            }
            return path;
        }

        const currentIndex = openSet.findIndex(p => positionsEqual(p.item, current.item));
        openSet.splice(currentIndex, 1);
        for (const neighbour of neighbours(current.item)) {
            const newG = current.gScore + costOfStep(current.item, neighbour, to);
            if (!Number.isFinite(newG))
                continue;
            let exploredNeighbour = explored.find(p => positionsEqual(p.item, neighbour));
            if (!exploredNeighbour) {
                exploredNeighbour = { item: neighbour, gScore: Infinity, fScore: Infinity };
                explored.push(exploredNeighbour);
            }
            if (newG < exploredNeighbour.gScore) {
                exploredNeighbour.cameFrom = current;
                exploredNeighbour.gScore = newG;
                exploredNeighbour.fScore = newG + heur(neighbour);
                if (!openSet.some(p => positionsEqual(p.item, neighbour)))
                    openSet.push(exploredNeighbour);
            }
        }
    }

    throw Error("no path found");
}

export function positionsEqual(a: Position, b: Position) {
    return a.x == b.x && a.y == b.y;
}

export function arraysEqual<T>(a: T[], b: T[]) {
    return a.every((o, i) => o == b[i]);
}

export function arrayFindEntryFromBack<T>(array: T[], predicate: (el: T) => boolean, offset: number = 0): [index: number, el: T] | undefined {
    for (let i = array.length - offset - 1; i >= 0; i--) {
        const el = array[i];
        if (predicate(el))
            return [i, el];
    }
}

export function stepsInDirection(pos: Position, dir: Direction, steps: number = 1): Position {
    switch (dir) {
        case Direction.Up: return { x: pos.x, y: pos.y - steps };
        case Direction.Right: return { x: pos.x + steps, y: pos.y };
        case Direction.Down: return { x: pos.x, y: pos.y + steps };
        case Direction.Left: return { x: pos.x - steps, y: pos.y };
    }
}

export function getDiffs(numbers: number[]): number[] {
    return numbers.slice(0, -1).map((n, i) => numbers[i + 1] - n);
}
