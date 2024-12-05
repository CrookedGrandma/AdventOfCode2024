import {Handler} from "../handler";
import {Grid} from "../util/grid";
import {eightAround} from "../util";

export class H4 extends Handler {
    private grid: Grid<string> | undefined;

    runA(input: string[]): Output {
        this.grid = new Grid(input.map(l => l.split('')));
        let count = 0;
        for (let y = 0; y < this.grid.rowCount; y++) {
            for (let x = 0; x < this.grid.colCount; x++) {
                count += this.xmasCountAt(x, y);
            }
        }
        return count;
    }

    runB(input: string[]): Output | undefined {
        let count = 0;
        for (let y = 1; y < this.grid!.rowCount - 1; y++) {
            for (let x = 1; x < this.grid!.colCount - 1; x++) {
                if (this.grid!.getItem(x, y) != "A")
                    continue;
                const ms = this.grid!.getItem(x - 1, y - 1)
                    + this.grid!.getItem(x + 1, y - 1)
                    + this.grid!.getItem(x + 1, y + 1)
                    + this.grid!.getItem(x - 1, y + 1);
                if (ms == "MMSS" || ms == "MSSM" || ms == "SSMM" || ms == "SMMS")
                    count++;
            }
        }
        return count;
    }

    xmasCountAt(x: number, y: number): number {
        if (this.grid!.getItem(x, y) != "X")
            return 0;
        const ms = eightAround(x, y).filter(([x2, y2]) => this.grid!.getItem(x2, y2) == "M");
        if (ms.length == 0)
            return 0;
        let count = 0;
        for (const m of ms) {
            const xDiff = m[0] - x;
            const yDiff = m[1] - y;
            if (this.grid!.getItem(m[0] + xDiff, m[1] + yDiff) == "A"
                && this.grid!.getItem(m[0] + 2*xDiff, m[1] + 2*yDiff) == "S")
                count++;
        }
        return count;
    }
}