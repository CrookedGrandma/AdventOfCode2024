import {Handler} from "../handler";
import {Grid} from "../util/grid";
import {Direction, dirToStr, stepsInDirection, turnClockwise} from "../util";

export class H6 extends Handler {
    private grid: Grid<Space>;
    private guard: { pos: Position, dir: Direction } = { pos: { x: -1, y: -1 }, dir: Direction.Up };

    constructor(input: string[]) {
        super(input);
        const parsed = this.parseGrid(input);
        this.grid = parsed[0];
        this.guard.pos = parsed[1];
    }

    runA(input: string[]): Output {
        return this.runFromPos(this.guard.pos, this.guard.dir);
    }

    runB(input: string[]): Output | undefined {
        return undefined;
    }

    runFromPos(pos: Position, dir: Direction) {
        this.guard.pos = pos;
        this.guard.dir = dir;
        const startSpace = this.grid.getItem(pos.x, pos.y);
        startSpace.visit(dir);
        startSpace.isStartSpace = true;

        let nextPos = stepsInDirection(this.guard.pos, this.guard.dir);
        let nextSpace = this.grid.getItem(nextPos.x, nextPos.y);
        while (this.grid.contains(nextPos.x, nextPos.y)) {
            if (nextSpace?.canWalkThrough) {
                this.guard.pos = nextPos;
                nextSpace.visit(this.guard.dir);
            }
            else {
                this.guard.dir = turnClockwise(this.guard.dir);
            }
            nextPos = stepsInDirection(this.guard.pos, this.guard.dir);
            nextSpace = this.grid.getItem(nextPos.x, nextPos.y);
        }

        const spacesVisited = this.grid.getItems().filter(s => s.visited.length > 0);
        return spacesVisited.length;
    }

    parseGrid(input: string[]): [Grid<Space>, Position] {
        const rows: Space[][] = [];
        let guardPos: Position = { x: -1, y: -1 };
        for (let y = 0; y < input.length; y++) {
            const line = input[y];
            const row: Space[] = [];
            for (let x = 0; x < line.length; x++) {
                const char = line[x];
                if (char == "#") {
                    row.push(new Obstruction(x, y));
                }
                if (char == "." || char == "^") {
                    const space = new FreeSpace(x, y);
                    row.push(space);
                    if (char == "^")
                        guardPos = { x, y };
                }
            }
            rows.push(row);
        }
        return [new Grid(rows), guardPos];
    }

}

abstract class Space {
    abstract canWalkThrough: boolean;

    visited: Direction[] = [];
    x: number;
    y: number;

    isStartSpace = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString(): string {
        if (!this.canWalkThrough)
            return "#";
        if (this.isStartSpace)
            return "@";
        if (this.visited.length == 0)
            return ".";
        if (this.visited.length == 1)
            return dirToStr(this.visited[0]);
        const sorted = this.visited.toSorted((a, b) => a - b);
        if (sorted.length == 2) {
            const dir1 = sorted[0];
            const dir2 = sorted[1];
            if (dir1 == Direction.Up && dir2 == Direction.Down)
                return "⇅"
            if (dir1 == Direction.Right && dir2 == Direction.Left)
                return "⇄";
        }
        return "X";
    }

    visit(dir: Direction) {
        if (!this.visited.includes(dir))
            this.visited.push(dir);
    }
}

class FreeSpace extends Space {
    canWalkThrough = true;
}

class Obstruction extends Space {
    canWalkThrough = false;
}