import * as fs from 'fs';

class Student {
    fullName: string;
    constructor(
        public firstName: string,
        public middleInitial: string,
        public lastName: string
    ) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function day_1_1(data: string) {
    const [list1, list2] = data.split('\n').map(line => line.split(' ').map(Number));

    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    let sum = 0;
    for (let i = 0; i < Math.min(list1.length, list2.length); i++) {
        sum += Math.abs(list1[i] - list2[i]);
    }

    console.log(sum);
}

function main() {

    function parseArguments() {
        const args = process.argv.slice(2);
        if (args.length < 2) {
            throw new Error("Please provide a filename and a function selector.");
        }
        return {
            filename: args[0],
            functionSelector: args[1]
        };
    }

    const { filename, functionSelector } = parseArguments();

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        let result;
        switch (functionSelector) {
            case '1.1':
                result = day_1_1(data);
                break;
            default:
                console.error("Unknown function selector:", functionSelector);
                return;
        }

        console.log(result);
    });

}

main();