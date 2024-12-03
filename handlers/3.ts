import {Handler} from "../handler";
import {sum} from "../util";

export class H3 extends Handler {
    runA(input: string[]): Output {
        const line = input[0];
        const regex = /mul\((\d+),(\d+)\)/g;
        const matches = line.matchAll(regex);
        const results: number[] = [];
        for (const match of matches) {
            const a = +match[1];
            const b = +match[2];
            results.push(a * b);
        }
        return sum(results);
    }

    runB(input: string[]): Output | undefined {
        const line = input[0];
        return undefined;
    }

}
