import * as fs from 'fs';

function day_4_2(data: string) {
    const grid = data.split('\n').map(line => line.split(''));
    let count = 0;

    function checkWord(x: number, y: number): boolean {
        let occurances = 0;
        if (x > 0 && y > 0 && x < grid.length - 1 && y < grid.length - 1 && grid[x][y] === 'A') {
            if (grid[x - 1][y - 1] === 'M' && grid[x + 1][y + 1] === 'S') {
                occurances += 1;
            }
            if (grid[x - 1][y + 1] === 'M' && grid[x + 1][y - 1] === 'S') {
                occurances += 1;
            }
            if (grid[x + 1][y - 1] === 'M' && grid[x - 1][y + 1] === 'S') {
                occurances += 1;
            }
            if (grid[x + 1][y + 1] === 'M' && grid[x - 1][y - 1] === 'S') {
                occurances += 1;
            }
        }
        return occurances === 2;
    }

    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            if (checkWord(x, y)) {
                count += 1;
            }
        }
    }

    return count;
}

function day_4_1(data: string) {
    const grid = data.split('\n').map(line => line.split(''));
    const word = 'XMAS';
    const directions = [
        [0, 1],  // right
        [1, 0],  // down
        [1, 1],  // down-right
        [1, -1], // down-left
        [0, -1], // left
        [-1, 0], // up
        [-1, -1],// up-left
        [-1, 1]  // up-right
    ];
    let count = 0;

    function checkWord(x: number, y: number, dx: number, dy: number): boolean {
        for (let i = 0; i < word.length; i++) {
            const nx = x + i * dx;
            const ny = y + i * dy;
            if (nx < 0 || ny < 0 || nx >= grid.length || ny >= grid[0].length || grid[nx][ny] !== word[i]) {
                return false;
            }
        }
        return true;
    }

    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            for (const [dx, dy] of directions) {
                if (checkWord(x, y, dx, dy)) {
                    count += 1;
                }
            }
        }
    }

    return count;
}


function day_3_2(data: string) {

    const matches = data.matchAll(/mul\((\d+),(\d+)\)|do\(\)|don\'t\(\)/g);
    let sum = 0;
    let enabled = true;

    for (const match of matches) {
        if (match[0] === 'do()') {
            enabled = true;
        } else if (match[0] === 'don\'t()') {
            enabled = false;
        } else {
            if (enabled) {
                sum += parseInt(match[1]) * parseInt(match[2]);
            }
        }
    }

    return sum;
}

function day_3_1(data: string) {

    let sum = 0;
    const matches = data.matchAll(/mul\((\d+),(\d+)\)/g);

    for (const match of matches) {
        sum += parseInt(match[1]) * parseInt(match[2]);
    }

    return sum;
}

function day_2_data_parser(data: string) {
    const reports: number[][] = [];

    data.split('\n').forEach(line => {
        const numbers = line.split(/\s+/).map(Number);
        reports.push(numbers);
    });

    return reports;
}

function day_2_check_report(report: number[]): number {

    let descend = false;
    let ascend = false;

    for (let i = 0; i < report.length - 1; i++) {
        if (report[i] < report[i + 1]) {
            ascend = true;
        } else if (report[i] > report[i + 1]) {
            descend = true;
        }

        if (descend && ascend) {
            return i;
        }

        let diff = Math.abs(report[i] - report[i + 1]);
        if (diff < 1 || diff > 3) {
            return i;
        }
    }

    return -1;
}

function day_2_1(data: string) {

    const reports = day_2_data_parser(data);
    let safe: number = 0;

    for (const report of reports) {
        if (day_2_check_report(report) === -1) {
            safe += 1;
        }
    }

    return safe;
}

function day_2_2(data: string) {

    const reports = day_2_data_parser(data);
    let safe: number = 0;

    for (const report of reports) {
        let result = day_2_check_report(report);

        // brute force if the report is not safe
        if (result >= 0) {
            for (let i = 0; i < report.length; i++) {
                const reportTest = report.slice();
                reportTest.splice(i, 1);
                result = day_2_check_report(reportTest);
                if (result === -1) {
                    break;
                }
            }
        }

        if (result === -1) {
            safe += 1;
        }
    }

    return safe;
}

function day_1_data_parser(data: string) {
    const list1: number[] = [];
    const list2: number[] = [];

    data.split('\n').forEach(line => {
        const numbers = line.split(/\s+/).map(Number);
        if (numbers.length > 0) {
            list1.push(numbers[0]);
            if (numbers.length > 1) {
                list2.push(numbers[1]);
            }
        }
    });

    return { list1, list2 };
}

function day_1_1(data: string) {

    const { list1, list2 } = day_1_data_parser(data);

    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    let sum = 0;

    for (let i = 0; i < Math.min(list1.length, list2.length); i++) {
        sum += Math.abs(list1[i] - list2[i]);
    }

    return sum;
}

function day_1_2(data: string) {
    const { list1, list2 } = day_1_data_parser(data);

    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    let i1 = 0;
    let i2 = 0;
    let similarity = 0;

    while (i1 < list1.length && i2 < list2.length) {
        if (list1[i1] === list2[i2]) {
            similarity += list1[i1];
            i2++;
        } else if (list1[i1] < list2[i2]) {
            i1++;
        } else {
            i2++;
        }
    }

    return similarity;
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
            case '1.2':
                result = day_1_2(data);
                break;
            case '2.1':
                result = day_2_1(data);
                break;
            case '2.2':
                result = day_2_2(data);
                break;
            case '3.1':
                result = day_3_1(data);
                break;
            case '3.2':
                result = day_3_2(data);
                break;
            case '4.1':
                result = day_4_1(data);
                break;
            case '4.2':
                result = day_4_2(data);
                break;
            default:
                console.error("Unknown function selector:", functionSelector);
                return;
        }

        console.log("Day " + functionSelector + ": " + result);
    });

}

main();