export abstract class Handler {
    protected input: string[];
    constructor(input: string[]) {
        if (!input[input.length - 1])
            input.splice(input.length - 1, 1);
        this.input = input;
    }
    abstract runA(input: string[]): Output;
    abstract runB(input: string[]): Output | undefined;
}
