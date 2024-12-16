import {Handler} from "../handler";
import {sum} from "../util";

type Operator = (a: number, b: number) => number;

const operators: Operator[] = [
    (a, b) => a + b,
    (a, b) => a * b,
];

const operators2: Operator[] = [
    ...operators,
    (a, b) => +`${a}${b}`,
]

export class H7 extends Handler {
    lines: Line[] = [];

    constructor(input: string[]) {
        super(input);
        for (let i = 0; i < input.length; i++){
            const line = input[i];
            const split = line.split(": ");
            this.lines.push(new Line(i + 1, +split[0], split[1].split(/\s+/).map(n => +n)));
        }
    }

    runA(input: string[]): Output {
        return sum(this.lines.filter(l => l.couldBeTrue()).map(l => l.result));
    }

    runB(input: string[]): Output | undefined {
        return sum(this.lines.filter(l => l.couldBeTrue2()).map(l => l.result));
    }

}

class Line {
    id: number;
    result: number;
    factors: number[];

    constructor(id: number, result: number, factors: number[]) {
        this.id = id;
        this.result = result;
        this.factors = factors;
    }

    couldBeTrue(): boolean {
        return this.couldBeTrueWith(operators);
    }

    couldBeTrue2(): boolean {
        return this.couldBeTrueWith(operators2);
    }

    private couldBeTrueWith(operators: Operator[]): boolean {
        const optionCount = Math.pow(operators.length, this.factors.length - 1);
        console.log(`Line ${this.id}: ${optionCount} options`);

        return this.tryFindSolution(this.factors, operators);
    }

    private tryFindSolution(factors: number[], operators: Operator[]): boolean {
        if (factors.length == 1) {
            if (factors[0] == this.result)
                return true;
        }
        else {
            for (const operator of operators) {
                const head = operator(factors[0], factors[1]);
                if (this.tryFindSolution([head, ...factors.slice(2)], operators))
                    return true;
            }
        }
        return false;
    }
}
