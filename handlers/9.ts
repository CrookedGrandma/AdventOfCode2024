import {Handler} from "../handler";
import {sum} from "../util";

const LOG = false;

export class H9 extends Handler {
    blocks: Block[] = [];
    files: FileItem[] = [];
    start: Block;
    end: Block;

    constructor(input: string[]) {
        super(input);
        const line = input[0];
        let readingFile = true;
        let id = 0;
        let position = 0;
        let lastBlock: Block | undefined = undefined;
        for (const num of line.split("")) {
            const n = +num;
            const blocks = Array.from({ length: n }, () => new Block(position++));
            if (readingFile) {
                // Adding file blocks
                const file = new FileItem(id, n, blocks);
                blocks.forEach(b => b.file = file);
                this.files.push(file);
                id++;
            }

            if (n > 0) {
                lastBlock && (lastBlock.next = blocks[0]);
                blocks[0].previous = lastBlock;
                for (let i = 1; i < n; i++) {
                    const prev = blocks[i - 1];
                    const cur = blocks[i];
                    prev.next = cur;
                    cur.previous = prev;
                }
                this.blocks.push(...blocks);
                lastBlock = blocks[n - 1];
            }

            readingFile = !readingFile;
        }
        this.start = this.blocks[0];
        this.end = this.blocks[this.blocks.length - 1];
    }

    *getBlocksInOrder() {
        let block: Block = this.start;
        yield block;
        while (block.next) {
            block = block.next;
            yield block;
        }
    }

    visualize(): string {
        return Array.from(this.getBlocksInOrder()).map(b => b.toString()).join("");
    }

    runA(input: string[]): Output {
        if (LOG) console.log(this.visualize());

        let block = this.start;
        while (!!block.next) {
            if (!block.file) {
                const endBlock = this.getLastFileBlock();
                // Stop if last block is before current free space
                if (endBlock.position < block.position)
                    break;
                this.swapPositions(block, endBlock);
                this.end = block;
                block = endBlock;

                if (LOG) console.log(this.visualize());
            }
            if (!block.next)
                throw Error("bruh (kinderwoord van het jaar)");
            block = block.next;
        }

        return sum(this.blocks.map(b => b.position * (b.file?.id ?? 0)));
    }

    runB(input: string[]): Output | undefined {
        return undefined;
    }

    swapPositions(a: Block, b: Block) {
        const prevA = a.previous;
        const nextA = a.next;
        const prevB = b.previous;
        const nextB = b.next;
        const posA = a.position;

        a.position = b.position;
        b.position = posA;

        a.previous = prevB;
        prevB && (prevB.next = a);
        a.next = nextB;
        nextB && (nextB.previous = a);

        b.previous = prevA;
        prevA && (prevA.next = b);
        b.next = nextA;
        nextA && (nextA.previous = b);
    }

    getLastFileBlock(): Block {
        while (!this.end.file && !!this.end.previous)
            this.end = this.end.previous;

        if (!this.end.file)
            throw Error("da kennie");
        return this.end;
    }

}

class FileItem {
    readonly id: number;
    readonly size: number;
    readonly blocks: Block[];

    constructor(id: number, size: number, blocks: Block[]) {
        this.id = id;
        this.size = size;
        this.blocks = blocks;
    }
}

class Block {
    position: number;
    readonly originalPosition: number;
    file?: FileItem;

    previous?: Block;
    next?: Block;

    constructor(position: number) {
        this.position = position;
        this.originalPosition = position;
    }

    toString(): string {
        if (!this.file)
            return ".";
        return (this.file.id % 10).toString();
    }
}