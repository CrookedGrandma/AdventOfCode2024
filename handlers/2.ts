import {Handler} from "../handler";
import {getDiffs} from "../util";

export class H2 extends Handler {
    private reports: number[][] = [];
    private diffs: number[][] = [];
    private okInds: number[] = [];

    runA(input: string[]): Output {
        for (let l = 0; l < input.length; l++){
            const line = input[l];
            const numbers = line.split(/\s+/).map(n => +n);
            this.reports.push(numbers);
            const diffs = getDiffs(numbers);
            this.diffs.push(diffs);
            if (this.reportOk(diffs)) {
                this.okInds.push(l);
            }
        }
        return this.okInds.length;
    }

    runB(input: string[]): Output | undefined {
        const okInds = [];
        for (let i = 0; i < this.reports.length; i++){
            const report = this.reports[i];
            if (this.reportOk2(report)) {
                okInds.push(i);
            }
        }
        return okInds.length;
    }

    reportOk(diffs: number[]): boolean {
        return diffs.every(d => d >= 1 && d <= 3)
            || diffs.every(d => d <= -1 && d >= -3);
    }

    reportOk2(report: number[]): boolean {
        let diffs = getDiffs(report);
        if (this.reportOk(diffs))
            return true;
        for (let i = 0; i < report.length; i++) {
            if (this.reportOk(getDiffs(report.filter((_, j) => j != i))))
                return true;
        }
        return false;
    }
}