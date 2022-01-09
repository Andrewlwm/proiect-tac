import * as fs from "fs";
class AFD {
    constructor() { }
    init_for_ab() {
        this.alphabet = ["a", "b"];
        this.transitions = [
            [1, 2],
            [1, 3],
            [1, 2],
            [1, 4],
            [1, 2],
        ];
        this.accepting_states = [4];
    }
    init_for_abc() {
        this.alphabet = ["a", "b", "c"];
        this.transitions = [
            [1, 2, 3],
            [1, 2, 4],
            [1, 2, 3],
            [1, 2, 3],
            [1, 5, 3],
            [1, 6, 3],
            [1, 2, 3],
        ];
        this.accepting_states = [6];
    }
    simulate(input) {
        let charIndex;
        let from = 0;
        let to;
        const A = "A".charCodeAt(0);
        console.info(`Input: ${input}`);
        Array.from(input).forEach((char) => {
            charIndex = this.alphabet.indexOf(char);
            to = this.transitions[from][charIndex];
            console.info(`${char} (${charIndex}) ${String.fromCharCode(A + from)} -> ${String.fromCharCode(A + to)}`);
            from = to;
        });
        if (this.accepting_states.includes(from))
            console.info("ACCEPTED\n");
        else
            console.warn("REJECTED\n");
    }
}
function handleFile(err, data) {
    if (err)
        throw err;
    const afd = new AFD();
    if (data.includes("c"))
        afd.init_for_abc();
    else
        afd.init_for_ab();
    data.split("\n").forEach((e) => afd.simulate(e));
}
function run_simulations(type) {
    fs.readFile(`src/${type}.txt`, "utf8", handleFile);
}
run_simulations("ab");
run_simulations("abc");
