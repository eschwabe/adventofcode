import * as fs from 'fs';

class GridPosition {
    row: number = 0;
    col: number = 0;
}

function day_9_disk_layout(data: string): number[] {
    // 12345
    // 0..111....22222

    let diskMap = data.split('').map(Number);
    let fileId = 0;
    let diskLayout : number[] = []
    for (let i = 0; i < diskMap.length; i++) {
        for (let j = 0; j < diskMap[i]; j++) {
            if (i % 2 === 0) {
                diskLayout.push(fileId);
            }
            else {
                diskLayout.push(-1);
            }
        }
        if (i % 2 === 0) {
            fileId++;
        }
    }

    return diskLayout;
}

function day_9_checksum(diskLayout: number[]) {
    let sum = 0;
    for (let i = 0; i < diskLayout.length; i++) {
        if (diskLayout[i] != -1) {
            sum += i * diskLayout[i];
        }
    }
    return sum;
}

function day_9_2(data: string): number {

    let diskLayout = day_9_disk_layout(data);

    let end = diskLayout.length - 1;

    while (end > 0) {

        // get end block start/end positions
        while (diskLayout[end] === -1) {
            end--;
        }
        let fileId = diskLayout[end];
        let fileEnd = end;

        while (diskLayout[end] === fileId) {
            end--;
        }
        let fileStart = end + 1;

        // find a block to swap
        let start = 0;
        while (start < fileStart) {
            while (diskLayout[start] != -1 && start < fileStart) {
                start++;
            }
            let freeSpaceStart = start;
            while (diskLayout[start] === -1) {
                start++;
            }
            let freeSpaceEnd = start - 1;

            // swap if fits
            if (fileEnd - fileStart <= freeSpaceEnd - freeSpaceStart) {
                for (let i = freeSpaceStart; i <= freeSpaceStart + (fileEnd - fileStart); i++) {
                    diskLayout[i] = fileId;
                }
                for (let i = fileStart; i <= fileEnd; i++) {
                    diskLayout[i] = -1;
                }
                break;
            }
        }
    }

    return day_9_checksum(diskLayout);
}

function day_9_1(data: string): number {

    let diskLayout = day_9_disk_layout(data);

    let start = 0;
    let end = diskLayout.length - 1;

    while (start < end) {
        if (diskLayout[start] != -1) {
            start++;
        }
        if (diskLayout[end] === -1) {
            end--;
        }
        if (diskLayout[start] === -1 && diskLayout[end] != -1) {
            diskLayout[start] = diskLayout[end];
            diskLayout[end] = -1;
            start++;
            end--;
        }
    }

    return day_9_checksum(diskLayout);
}

function day_8_parser(data: string): string[][] {
    return data.split('\n').map(group => group.split(''));
}

function day_8_find_antennas(cityMap: string[][]): Map<string, GridPosition[]> {
    const antennas = new Map<string, GridPosition[]>();

    for (let row = 0; row < cityMap.length; row++) {
        for (let col = 0; col < cityMap[row].length; col++) {
            if (cityMap[row][col].match(/[A-Za-z0-9]/)) {
                if (!antennas.has(cityMap[row][col])) {
                    antennas.set(cityMap[row][col], []);
                }
                antennas.get(cityMap[row][col])!.push({ row, col });
            }
        }
    }

    return antennas;
}

function day_8_find_antinodes(data: string, expand: boolean): number {
    
    const cityMap = day_8_parser(data);
    const antennas = day_8_find_antennas(cityMap);
    let antinodes = new Set<string>();

    for (let [antenna, locs] of antennas) {
        for (let i = 0; i < locs.length; i++) {
            for (let j = i + 1; j < locs.length; j++) {

                function validAntinode(pos: GridPosition): boolean {
                    let valid = pos.row >= 0 && pos.row < cityMap.length && pos.col >= 0 && pos.col < cityMap[0].length;
                    if (valid) {  
                        antinodes.add(JSON.stringify(pos));
                    }
                    return valid;
                }

                let dRow = locs[j].row - locs[i].row;
                let dCol = locs[j].col - locs[i].col;

                if (!expand) {
                    validAntinode({ row: locs[i].row - dRow, col: locs[i].col - dCol });
                    validAntinode({ row: locs[j].row + dRow, col: locs[j].col + dCol });
                }
                else {
                    let pos = { row: locs[i].row, col: locs[i].col };
                    while (validAntinode(pos)) {
                        pos.row -= dRow;
                        pos.col -= dCol;
                    }
                    pos = { row: locs[j].row, col: locs[j].col };
                    while (validAntinode(pos)) {
                        pos.row += dRow;
                        pos.col += dCol;
                    }
                }
            }
        }
    }

    return antinodes.size;
}

function day_8_2(data: string): number {
    return day_8_find_antinodes(data, true);
}

function day_8_1(data: string): number {
    return day_8_find_antinodes(data, false);
}

function day_7_evaluation(data: string, concatenation: boolean): number {
    const equations = data.split('\n').map(group => group.split(/\:\W|\W/).map(group => parseInt(group)));
    let validSum = 0;

    function isValid(total: number, result: number, eq: number[]): boolean {
        if (eq.length === 0) {
            return total === result;
        }

        return isValid(total, result + eq[0], eq.slice(1)) ||
            isValid(total, result * eq[0], eq.slice(1)) ||
            (concatenation && isValid(total, parseInt(result.toString() + eq[0].toString()), eq.slice(1)));
    }

    for (let eq of equations) {
        if (isValid(eq[0], 0, eq.slice(1))) {
            validSum += eq[0];
        }
    }

    return validSum;
}

function day_7_2(data: string): number {
    return day_7_evaluation(data, true)
}

function day_7_1(data: string): number {
    return day_7_evaluation(data, false)
}

function day_6_parser(data: string): string[][] {
    return data.split('\n').map(group => group.split(''));
}

function day_6_find_start(grid: string[][]): [number, number] {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === '^') {
                return [row, col];
            }
        }
    }
    return [-1, -1];
}

function day_6_traverse_grid(grid: string[][], row: number, col: number): number {
    const directions = [
        [-1, 0], // up
        [0, 1],  // right
        [1, 0],  // down
        [0, -1]  // left
    ];
    let dir = 0;
    let count = 1;

    while (row >= 0 && row < grid.length && col >= 0 && col < grid[row].length) {
        if (grid[row][col] === 'X' + dir) {
            return -1; // loop detected
        }

        if (!grid[row][col].startsWith('X') && !grid[row][col].startsWith('^')) {
            grid[row][col] = 'X' + dir;
            count++;
        }

        let rowNext = row + directions[dir][0];
        let colNext = col + directions[dir][1];

        if (rowNext < 0 || rowNext >= grid.length || colNext < 0 || colNext >= grid[row].length) {
            return count;
        }

        if (grid[rowNext][colNext].startsWith('#')) {
            dir = (dir + 1) % 4;
        } else {
            row = rowNext;
            col = colNext;
        }
    }

    return count;
}

function day_6_2(data: string): number {
    const grid = day_6_parser(data);
    const gridCopy = grid.map(row => row.slice());

    // initial traverse to find guard path
    let [startRow, startCol] = day_6_find_start(grid);
    day_6_traverse_grid(grid, startRow, startCol);

    // test for loops with walls inserted
    let loopCount = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col].startsWith('X')) {
                const gridTest = gridCopy.map(row => row.slice());
                gridTest[row][col] = '#';
                if (day_6_traverse_grid(gridTest, startRow, startCol) === -1) {
                    loopCount++;
                }
            }
        }
    }

    return loopCount;
}

function day_6_1(data: string): number {
    const grid = day_6_parser(data);
    let [row, col] = day_6_find_start(grid);
    return day_6_traverse_grid(grid, row, col);
}

function day_5_1_parser(data: string): { rules: Record<string, Set<string>>, pages: string[][] } {
    const lines = data.split('\n');
    const rules: Record<string, Set<string>> = {};
    const pages: string[][] = [];
    let rulesParse = true;

    for (const line of lines) {
        if (line.trim() === '') {
            rulesParse = false;
            continue;
        }

        if (rulesParse) {
            const [key, value] = line.split('|');
            if (key && value) {
                if (!rules[key]) {
                    rules[key] = new Set();
                }
                rules[key].add(value);
            }
        }
        else {
            const updates = line.split(',');
            pages.push(updates);
        }
    }

    return { rules, pages };
}

function day_5_2(data: string): number {

    const { rules, pages } = day_5_1_parser(data);
    let validOrderSum = 0;
    for (const page of pages) {
        let valid = true;
        for (let i = 0; i < page.length - 1; i++) {
            const rule = rules[page[i]];
            if (!rule.has(page[i + 1])) {
                valid = false;
                // swap elements and retsart scan
                let tmp = page[i];
                page[i] = page[i + 1];
                page[i + 1] = tmp;
                i = -1;
            }
        }
        // if the page was ever invalid, add the middle element to the sum
        if (!valid) {
            const mid = Math.round((page.length - 1) / 2);
            validOrderSum += parseInt(page[mid]);
        }
    }
    return validOrderSum;
}

function day_5_1(data: string): number {

    const { rules, pages } = day_5_1_parser(data);
    let validOrderSum = 0;
    for (const page of pages) {
        let valid = true;
        for (let i = 0; i < page.length - 1; i++) {
            const rule = rules[page[i]];
            if (!rule.has(page[i + 1])) {
                valid = false;
                break;
            }
        }
        if (valid) {
            const mid = Math.round((page.length - 1) / 2);
            validOrderSum += parseInt(page[mid]);
        }
    }
    return validOrderSum;
}


function day_4_2(data: string): number {
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

    const functionMap = {
        '1.1': day_1_1,
        '1.2': day_1_2,
        '2.1': day_2_1,
        '2.2': day_2_2,
        '3.1': day_3_1,
        '3.2': day_3_2,
        '4.1': day_4_1,
        '4.2': day_4_2,
        '5.1': day_5_1,
        '5.2': day_5_2,
        '6.1': day_6_1,
        '6.2': day_6_2,
        '7.1': day_7_1,
        '7.2': day_7_2,
        '8.1': day_8_1,
        '8.2': day_8_2,
        '9.1': day_9_1,
        '9.2': day_9_2,
    };

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

        if (!functionMap[functionSelector as keyof typeof functionMap]) {
            console.error("Unknown function selector:", functionSelector);
            return;
        }

        let result = functionMap[functionSelector as keyof typeof functionMap](data);

        console.log("Day " + functionSelector + ": " + result);
    });

}

main();