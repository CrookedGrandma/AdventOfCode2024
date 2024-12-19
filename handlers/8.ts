import {Handler} from "../handler";
import {Grid} from "../util/grid";
import {getDistinctPairs} from "../util";

export class H8 extends Handler {
    private grid: Grid<Space>;
    private antennae: Record<string, Space[]> = {};

    constructor(input: string[]) {
        super(input);
        this.grid = this.parse(input);
        console.log("Grid:")
        this.grid.printGrid(s => s.toString());
    }

    parse(input: string[]): Grid<Space> {
        this.antennae = {};
        const rows: Space[][] = [];
        for (let y = 0; y < input.length; y++) {
            const line = input[y];
            const row: Space[] = [];
            for (let x = 0; x < line.length; x++) {
                const char = line[x];
                if (char == ".") {
                    row.push(new Space(x, y, false));
                }
                else {
                    const space = new Space(x, y, char);
                    row.push(space);
                    this.addAntenna(char, space);
                }
            }
            rows.push(row);
        }
        return new Grid(rows);
    }

    runA(input: string[]): Output {
        console.log(`# Frequencies: ${Object.keys(this.antennae).length}`);
        const nonSingles = Object.entries(this.antennae).filter(([_, s]) => s.length > 1);
        console.log(`# Non-single frequencies: ${nonSingles.length}`);
        for (const [char, antennae] of nonSingles) {
            const pairs = getDistinctPairs(antennae);
            console.log(`Freq ${char}: ${antennae.length} antennae - ${pairs.length} pairs`);
            for (const pair of pairs) {
                const a = pair[0];
                const b = pair[1];
                const diffX = b.x - a.x;
                const diffY = b.y - a.y;
                const anti1X = a.x + 2 * diffX;
                const anti1Y = a.y + 2 * diffY;
                const anti2X = a.x - diffX;
                const anti2Y = a.y - diffY;
                this.grid.getItem(anti1X, anti1Y)?.antinodes.push(new Antinode(anti1X, anti1Y, [a, b]));
                this.grid.getItem(anti2X, anti2Y)?.antinodes.push(new Antinode(anti2X, anti2Y, [a, b]));
            }
        }
        this.grid.printGrid(s => s.toString());

        return this.grid.getItems().filter(s => s.antinodes.length > 0).length;
    }

    runB(input: string[]): Output | undefined {
        this.grid = this.parse(input);
        console.log(`# Frequencies: ${Object.keys(this.antennae).length}`);
        const nonSingles = Object.entries(this.antennae).filter(([_, s]) => s.length > 1);
        console.log(`# Non-single frequencies: ${nonSingles.length}`);
        for (const [char, antennae] of nonSingles) {
            const pairs = getDistinctPairs(antennae);
            console.log(`Freq ${char}: ${antennae.length} antennae - ${pairs.length} pairs`);
            for (const pair of pairs) {
                const a = pair[0];
                const b = pair[1];
                const diffX = b.x - a.x;
                const diffY = b.y - a.y;
                let d = 0;
                let antiX = a.x;
                let antiY = a.y;
                while (this.grid.contains(antiX, antiY)) {
                    this.grid.getItem(antiX, antiY)!.antinodes.push(new Antinode(antiX, antiY, [a, b]));
                    d++;
                    antiX = a.x - d * diffX;
                    antiY = a.y - d * diffY;
                }
                antiX = b.x;
                antiY = b.y;
                d = 0;
                while (this.grid.contains(antiX, antiY)) {
                    this.grid.getItem(antiX, antiY)!.antinodes.push(new Antinode(antiX, antiY, [a, b]));
                    d++;
                    antiX = b.x + d * diffX;
                    antiY = b.y + d * diffY;
                }
            }
        }
        this.grid.printGrid(s => s.toString());

        return this.grid.getItems().filter(s => s.antinodes.length > 0).length;
    }

    addAntenna(char: string, space: Space) {
        if (char in this.antennae)
            this.antennae[char].push(space);
        else
            this.antennae[char] = [space];
    }

}

class Space {
    x: number;
    y: number;
    antenna: string | false;
    antinodes: Antinode[] = [];

    constructor(x: number, y: number, antenna: string | false) {
        this.x = x;
        this.y = y;
        this.antenna = antenna;
    }

    toString(): string {
        return this.antenna || (this.antinodes.length > 0 ? "#" : ".");
    }
}

class Antinode {
    x: number;
    y: number;
    antennae: Space[];

    constructor(x: number, y: number, antennae: Space[]) {
        this.x = x;
        this.y = y;
        this.antennae = antennae;
    }
}