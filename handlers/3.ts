import {Handler} from "../handler";
import {sum} from "../util";

export class H3 extends Handler {
    runA(input: string[]): Output {
        const line = input.join("");
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
        const line = input.join("");
        const regex = /do\(\)|don't\(\)|mul\((\d+),(\d+)\)/g;
        const matches = line.matchAll(regex);
        const results: number[] = [];
        let enabled = true;
        for (const match of matches) {
            if (match[0] == "do()") {
                enabled = true;
                continue;
            }
            if (match[0] == "don't()") {
                enabled = false;
                continue;
            }
            if (!enabled)
                continue;
            const a = +match[1];
            const b = +match[2];
            results.push(a * b);
        }
        return sum(results);
    }
}
