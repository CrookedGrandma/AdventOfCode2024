import {Handler} from "../handler";
import {sum} from "../util";

export class H5 extends Handler {
    private rules: Rule[] = [];
    private updates: Update[] = [];
    private toFix: Update[] = [];

    runA(input: string[]): Output {
        let i = 0;
        for (; i < input.length; i++) {
            const line = input[i];
            if (line == "") {
                i++
                break;
            }

            const split = line.split("|");
            this.rules.push(new Rule(+split[0], +split[1]));
        }
        for (; i < input.length; i++) {
            const line = input[i];
            const update = line.split(",").map(n => +n);
            this.updates.push(update);
        }

        const okUpdates: Update[] = [];
        for (const update of this.updates) {
            const relevantRules = this.getRelevantRules(update);
            if (this.checkUpdate(update, relevantRules))
                okUpdates.push(update);
            else
                this.toFix.push(update);
        }

        return sum(okUpdates.map(u => u[Math.floor(u.length / 2)]));
    }

    runB(input: string[]): Output | undefined {
        const fixedUpdates = [];
        for (const update of this.toFix) {
            const relevantRules = this.getRelevantRules(update);

            const fixed = update.toSorted((a, b) => {
                const rule = relevantRules.find(r => r.appliesToPages(a, b));
                if (!rule)
                    return 0;
                if (a == rule.first)
                    return 1
                return -1;
            });

            fixedUpdates.push(fixed);
        }
        return sum(fixedUpdates.map(u => u[Math.floor(u.length / 2)]));
    }

    checkUpdate(update: Update, ruleset: Rule[]): boolean {
        for (let iP1 = 0; iP1 < update.length; iP1++) {
            for (let iP2 = 0; iP2 < update.length; iP2++) {
                if (iP1 == iP2)
                    continue;
                const p2AfterP1 = iP2 > iP1;
                const p1 = update[iP1];
                const p2 = update[iP2];
                const specificRules = ruleset.filter(r => r.appliesToPages(p1, p2));
                if (specificRules.length == 0)
                    continue;
                if (!(p2AfterP1
                        ? specificRules.every(r => r.isMetByPages(p1, p2))
                        : specificRules.every(r => r.isMetByPages(p2, p1))))
                    return false;
            }
        }
        return true;
    }

    getRelevantRules(update: Update): Rule[] {
        return this.rules.filter(r => r.appliesToUpdate(update));
    }
}

type Update = number[];

class Rule {
    first: number;
    last: number;

    constructor(first: number, last: number) {
        this.first = first;
        this.last = last;
    }

    isMetByPages(first: number, last: number): boolean {
        return first == this.first && last == this.last;
    }

    appliesToPage(page: number): boolean {
        return page == this.first || page == this.last;
    }

    appliesToPages(p1: number, p2: number): boolean {
        return this.appliesToPage(p1) && this.appliesToPage(p2);
    }

    appliesToUpdate(update: Update): boolean {
        return update.includes(this.first) || update.includes(this.last);
    }
}