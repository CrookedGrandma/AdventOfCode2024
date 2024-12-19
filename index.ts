import fs from "fs";
import {Handler} from "./handler";

const USE_EXAMPLE = false;

const handlerNames = fs.readdirSync("handlers/").sort((a, b) => parseInt(a) - parseInt(b));
const latestHandlerName = handlerNames[handlerNames.length - 1];
const handlerNumber = latestHandlerName.split(".")[0] + (USE_EXAMPLE ? "E" : "");

console.log(`CHALLENGE NUMBER: ${handlerNumber}\n`);

const input = fs.readFileSync(`input/${handlerNumber}.txt`).toString().split("\n").map(l => l.trim());

console.log("constructing...\n")
const handler = new(Object.values(require(`./handlers/${latestHandlerName}`))[0] as new(input: string[]) => Handler)(input);

console.log("\nstarting...\n")
const outputA = handler.runA(input);
write(outputA, true);

const outputB = handler.runB(input);
if (outputB) {
    write("\n\n========== SECOND TASK ==========\n\n");
    write(outputB);
}

function write(output: Output, overwrite: boolean = false): void {
    const flags = overwrite ? undefined : { flag: "a" };
    let print: string = Array.isArray(output) ? output.join("\n") : output.toString();
    fs.writeFileSync(`output/${handlerNumber}.txt`, print, flags);
    console.log(print);
}
