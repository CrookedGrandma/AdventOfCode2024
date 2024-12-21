import {Handler} from "../handler";
import {sum, swapPositions} from "../util";

const LOG = false;

export class H9 extends Handler {
    blocks: Block[] = [];
    files: FileItem[] = [];
    end: number;

    constructor(input: string[]) {
        super(input);
        const line = input[0];
        let readingFile = true;
        let id = 0;
        let position = 0;
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
            this.blocks.push(...blocks);
            readingFile = !readingFile;
        }
        this.end = this.blocks.length - 1;
    }

    visualize(): string {
        return this.blocks.map(b => b.toString()).join("");
    }

    runA(input: string[]): Output {
        if (LOG) console.log(this.visualize());
        for (let i = 0; i < this.blocks.length - 1; i++) {
            const block = this.blocks[i];
            if (block.file)
                continue;

            const endBlock = this.getLastFileBlock();
            // Stop if last block is before current free space
            if (endBlock.position < i)
                break;
            // this.end was changed by getLastFileBlock
            swapPositions(this.blocks, i, this.end);
            block.position = endBlock.position;
            endBlock.position = i;

            if (LOG) console.log(this.visualize());
        }

        return sum(this.blocks.map(b => b.position * (b.file?.id ?? 0)));
    }

    runB(input: string[]): Output | undefined {
        return undefined;
    }

    getLastFileBlock(): Block {
        let block = this.blocks[this.end];
        while (!!block && !block.file)
            block = this.blocks[--this.end];

        if (!block)
            throw Error("da kennie");
        return block;
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