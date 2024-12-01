import {Handler} from "../handler";

export class H1 extends Handler {
    runA(input: string[]): Output {
        return 0;
    }

    runB(input: string[]): Output | undefined {
        return;
    }
}
