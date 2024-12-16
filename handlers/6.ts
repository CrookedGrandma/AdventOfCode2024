import {Handler} from "../handler";
import {Grid} from "../util/grid";
import {Direction, dirToStr, stepsInDirection, turnClockwise} from "../util";

type Guard = { pos: Position, dir: Direction };

export class H6 extends Handler {
    private grid: Grid<Space>;
    private guard: Guard = { pos: { x: -1, y: -1 }, dir: Direction.Up };
    private freeSpaces: FreeSpace[] = [];
    private readonly startPos: Position;
    private readonly startDir: Direction;

    constructor(input: string[]) {
        super(input);
        this.grid = this.parseGrid(input);
        this.startPos = { x: this.guard.pos.x, y: this.guard.pos.y };
        this.startDir = this.guard.dir;
    }

    runA(input: string[]): Output {
        const answer = this.runFromStart();
        this.grid.printGrid(s => s.toString());
        return answer;
    }

    runB(input: string[]): Output | undefined {
        console.log(`Trying ${this.freeSpaces.length} spaces`);

        this.grid.getItems().forEach(s => s.reset());
        let loops = 0;
        for (let i = 0; i < this.freeSpaces.length; i++) {
            if (i % 100 == 0)
                console.log(`Option ${i + 1} / ${this.freeSpaces.length}`);

            // Grid change init
            this.guard.pos = {...this.startPos};
            this.guard.dir = this.startDir;
            const originalSpace = this.freeSpaces[i];
            const x = originalSpace.x;
            const y = originalSpace.y;
            const obs = new Obstruction(x, y);
            this.grid.setItem(x, y, obs);

            // Run
            if (this.runFindLoop()) {
                loops++;
                // console.log(`[${x},${y}]`);
                // this.grid.printGrid(r => r.x == x && r.y == y ? "O" : r.toString())
                // console.log();
            }

            // Grid reset
            this.grid.setItem(x, y, originalSpace);
            this.grid.getItems().forEach(s => s.reset());
        }

        return loops;
    }

    runFromStart() {
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

    runFindLoop(): boolean {
        let nextPos = stepsInDirection(this.guard.pos, this.guard.dir);
        let nextSpace = this.grid.getItem(nextPos.x, nextPos.y);
        while (this.grid.contains(nextPos.x, nextPos.y)) {
            // this.grid.printGrid(s => s.toString());
            if (nextSpace.visited.includes(this.guard.dir)) {
                return true;
            }
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
        return false;
    }

    parseGrid(input: string[]): Grid<Space> {
        const rows: Space[][] = [];
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
                    if (char == "^") {
                        this.guard = { pos: { x, y }, dir: Direction.Up };
                        space.visit(this.guard.dir);
                        space.isStartSpace = true;
                    }
                    else
                        this.freeSpaces.push(space);
                }
            }
            rows.push(row);
        }
        return new Grid(rows);
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

    reset() {
        this.visited = [];
    }
}

class FreeSpace extends Space {
    canWalkThrough = true;
}

class Obstruction extends Space {
    canWalkThrough = false;
}