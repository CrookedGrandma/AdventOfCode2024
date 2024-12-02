import {Handler} from "../handler";
import { sum } from "../util";

export class H1 extends Handler {
    private left: number[] = [];
    private right: number[] = [];
    private dist: number[] = [];

    runA(input: string[]): Output {
        for (const line of input) {
            const [l, r] = line.split(/\s+/);
            this.left.push(+l);
            this.right.push(+r);
        }
        this.left.sort((a, b) => a - b);
        this.right.sort((a, b) => a - b);
        for (let i = 0; i < this.left.length; i++) {
            this.dist.push(Math.abs(this.left[i] - this.right[i]));
        }
        return sum(this.dist);
    }

    runB(input: string[]): Output | undefined {
        const scores = [];
        for (const l of this.left) {
            const count = this.right.filter(r => r === l).length;
            scores.push(l * count);
        }
        return sum(scores);
    }
}
