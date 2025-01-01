import * as fs from 'fs';

function day_16_parser(data: string): string[][] {
    return data.split('\n').map(group => group.split(''));
}

function day_16_find_shortest_path(grid: string[][], startRow: number, startCol: number): number {
    const numRows = grid.length;
    const numCols = grid[0].length;
    const directions = [
        [-1, 0], // up
        [0, 1],  // right
        [1, 0],  // down
        [0, -1]  // left
    ];

    const queue: [number, number, number, number][] = []; // [row, col, distance, directionIndex]
    const visited: number[][] = Array.from({ length: numRows }, () => Array(numCols).fill(Number.MAX_SAFE_INTEGER));
    let shortestDistance = Number.MAX_SAFE_INTEGER;

    queue.push([startRow, startCol, 0, 1]);
    visited[startRow][startCol] = 0;

    while (queue.length > 0) {
        const [currentRow, currentCol, distance, prevDirection] = queue.shift()!;

        for (let i = 0; i < directions.length; i++) {
            const [dRow, dCol] = directions[i];
            const newRow = currentRow + dRow;
            const newCol = currentCol + dCol;
            const newDistance = distance + 1 + (prevDirection !== i ? 1000 : 0);

            if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols ) {

                if (grid[newRow][newCol] === 'E' && newDistance < shortestDistance) {
                    shortestDistance = newDistance;
                    continue;
                }

                if (newDistance > visited[newRow][newCol]) {
                    continue;
                }

                if (grid[newRow][newCol] === '.') {
                    queue.push([newRow, newCol, newDistance, i]);
                    visited[newRow][newCol] = newDistance;
                }
            }
        }
    }

    return shortestDistance;
}

function day_16_1(data: string): number {
    const grid = day_16_parser(data);
    let startRow = grid.length - 2;
    let startCol = 1;

    return day_16_find_shortest_path(grid, startRow, startCol);
}

function day_15_parser(data: string): [string[][], string[]] {
    const lines = data.split('\n')
    const breakIndex = lines.findIndex(line => line.length == 0);
    const grid = lines.slice(0, breakIndex).map(group => group.split(''));
    const moves = lines.slice(breakIndex + 1).map(group => group.split('')).flat();
    return [grid, moves];
}

function day_15_find_robot(grid: string[][]): [number, number] {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === '@') {
                return [row, col];
            }
        }
    }
    return [-1, -1];
}

function day_15_compute_box_gps(grid: string[][]): number {
    let sum = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === 'O') {
                sum += row * 100 + col;
            }
        }
    }
    return sum;
}

function day_15_shift_boxes_recurse(grid: string[][], row: number, col: number, rowDir: number, colDir: number): boolean {

    let dRow = row + rowDir;
    let dCol = col + colDir;
    
    // blocked
    if (dRow < 0 || dRow >= grid.length || dCol < 0 || dCol >= grid[dRow].length) {
        return false;
    }

    // blocked
    if (grid[dRow][dCol] === '#') {
        return false;
    }

    // continue shifting
    if (grid[dRow][dCol] === 'O') {
        day_15_shift_boxes_recurse(grid, dRow, dCol, rowDir, colDir);
    }

    // empty, shift
    if (grid[dRow][dCol] === '.') {
        let tmp = grid[dRow][dCol];
        grid[dRow][dCol] = grid[row][col];
        grid[row][col] = tmp;
        return true;
    }

    return false;
}

function day_15_apply_move(grid: string[][], row: number, col: number, move: string): [number, number] {

    let newRow = row;
    let newCol = col;
    if (move === '^') {
        if(day_15_shift_boxes_recurse(grid, row, col, -1, 0)) {
            newRow = row - 1;
        }
    }
    else if (move === 'v') {
        if(day_15_shift_boxes_recurse(grid, row, col, 1, 0)) {
            newRow = row + 1;
        }
    }
    else if (move === '>') {
        if(day_15_shift_boxes_recurse(grid, row, col, 0, 1)) {
            newCol = col + 1;
        }
    }
    else if (move === '<') {
        if(day_15_shift_boxes_recurse(grid, row, col, 0, -1)) {
            newCol = col - 1;
        }
    }

    return [newRow, newCol];
}

function day_15_1(data: string): number {
    const [grid, moves] = day_15_parser(data);
    let [row, col] = day_15_find_robot(grid);
    
    for (let move of moves) {
        [row, col] = day_15_apply_move(grid, row, col, move);
    }

    for(let row of grid) {
        console.log(row.join(''));
    }

    return day_15_compute_box_gps(grid);
}

class Day14_Robot {
    P_X: number = 0;
    P_Y: number = 0;
    V_X: number = 0;
    V_Y: number = 0;
    D_X: number = 0;
    D_Y: number = 0;
}

function day_14_mod(n: number, m: number): number {
    return ((n % m) + m) % m;
  }

function day_14_parser(data: string): Day14_Robot[] {
    const robots: Day14_Robot[] = [];
    const lines = data.split('\n');

    for (let line of lines) {
        let match: RegExpMatchArray | null = line.match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/)
        if (match) {
            let robot = new Day14_Robot();
            robot.P_X = parseInt(match[1]);
            robot.P_Y = parseInt(match[2]);
            robot.V_X = parseInt(match[3]);
            robot.V_Y = parseInt(match[4]);
            robots.push(robot);
        }
    }

    return robots;
}

function day_14_1(data: string): number {

    const robots = day_14_parser(data);
    const grid_rows = 103;
    const grid_cols = 101;
    const seconds = 100;

    let quadrant_robot_count = new Map<string, number>();
    
    for (let robot of robots) {
        robot.D_X = day_14_mod(robot.P_X + (robot.V_X * seconds), grid_cols);
        robot.D_Y = day_14_mod(robot.P_Y + (robot.V_Y * seconds), grid_rows);

        if (robot.D_X == Math.floor(grid_cols / 2) || robot.D_Y == Math.floor(grid_rows / 2)) {
            console.log(`Robot Outside Quadrant: ${robot.D_X},${robot.D_Y}`);
            continue;
        }

        let quadrant_x = (robot.D_X <= (grid_cols / 2)) ? 0 : 1;
        let quadrant_y = (robot.D_Y <= (grid_rows / 2)) ? 0 : 1;
        let quadrant_key = `${quadrant_x},${quadrant_y}`;

        if (!quadrant_robot_count.has(quadrant_key)) {
            quadrant_robot_count.set(`${quadrant_x},${quadrant_y}`, 0);
        }

        quadrant_robot_count.set(quadrant_key, quadrant_robot_count.get(quadrant_key)! + 1);
    }

    let safety_factor: number = 0;
    let safety_factor_init = false;
    for (let [key, value] of quadrant_robot_count) {
        console.log(`Quadrant: ${key} - Robot Count: ${value}`);
        if (safety_factor_init) {
            safety_factor = safety_factor * value;
        }
        else {
            safety_factor = value;
            safety_factor_init = true;
        }
    }

    console.log(`Safety Factor: ${safety_factor}`);

    return safety_factor;
}

function day_14_2(data: string): number {
    const robots = day_14_parser(data);
    const grid_rows = 103;
    const grid_cols = 101;

    let second = 0;
    for (second = 100; second < 125; second++) {
        const grid = Array.from({ length: grid_rows }, () => Array(grid_cols).fill('.'));
        for (let robot of robots) {
            robot.D_X = day_14_mod(robot.P_X + (robot.V_X * second), grid_cols);
            robot.D_Y = day_14_mod(robot.P_Y + (robot.V_Y * second), grid_rows);    
            grid[robot.D_Y][robot.D_X] = '#';
        }
        console.log(`-------------- Second: ${second}--------------`);
        for (let row of grid) {
            console.log(row.join(''));
        }
    }

    return second;
}


class Day13_ClawMachine {
    A_X: number = 0;
    A_Y: number = 0;
    B_X: number = 0;
    B_Y: number = 0;
    P_X: number = 0;
    P_Y: number = 0;
}

function day_13_1_parser(data: string): Day13_ClawMachine[] {
    const clawMachines: Day13_ClawMachine[] = [];
    const sections = data.split(/\n\s*\n/);

    for (let section of sections) {
        let match: RegExpMatchArray | null = section.match(/Button A\: X\+(\d+), Y\+(\d+)\nButton B\: X\+(\d+), Y\+(\d+)\nPrize\: X\=(\d+), Y\=(\d+)/)
        if (match) {
            let clawMachine = new Day13_ClawMachine();
            clawMachine.A_X = parseInt(match[1]);
            clawMachine.A_Y = parseInt(match[2]);
            clawMachine.B_X = parseInt(match[3]);
            clawMachine.B_Y = parseInt(match[4]);
            clawMachine.P_X = parseInt(match[5]);
            clawMachine.P_Y = parseInt(match[6]);
            clawMachines.push(clawMachine);
        }
    }

    return clawMachines;
}

function day_13_compute_min_tokens(machine: Day13_ClawMachine, X: number, Y: number, A_presses: number, B_presses: number, cache: Map<string, number>): number {
    const buttonA_cost = 3;
    const buttonB_cost = 1;

    if (X === machine.P_X && Y === machine.P_Y) {
        return 0;
    }

    if (X > machine.P_X || Y > machine.P_Y) {
        return -1;
    }

    if (A_presses > 100 || B_presses > 100) {
        return -1;
    }

    let cacheKey = `${X},${Y},${A_presses},${B_presses}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
    }

    let a_tokens = day_13_compute_min_tokens(machine, X+machine.A_X, Y+machine.A_Y, A_presses+1, B_presses, cache);
    let b_tokens = day_13_compute_min_tokens(machine, X+machine.B_X, Y+machine.B_Y, A_presses, B_presses+1, cache);

    cache.set(`${X+machine.A_X},${Y+machine.A_Y},${A_presses+1},${B_presses}`, a_tokens);
    cache.set(`${X+machine.A_X},${Y+machine.A_Y},${A_presses},${B_presses+1}`, b_tokens);

    if (a_tokens === -1 && b_tokens === -1) {
        return -1;
    }

    if ((a_tokens != -1 && b_tokens == -1) || (a_tokens != -1 && a_tokens < b_tokens)) {
        return a_tokens + buttonA_cost;
    }
    else {
        return b_tokens + buttonB_cost;
    }
}

function day_13_1(data: string): number {

    const clawMachines = day_13_1_parser(data);
    let total_tokens = 0;
    for (let machine of clawMachines) {
        let cache = new Map<string, number>();
        let min_tokens = day_13_compute_min_tokens(machine, 0, 0, 0, 0, cache);
        if (min_tokens != -1) {
            total_tokens += min_tokens;
            console.log(`Machine: A(${machine.A_X},${machine.A_Y}), B(${machine.B_X},${machine.B_Y}), P(${machine.P_X},${machine.P_Y}) - Tokens: ${min_tokens}`);
        }
        else {
            console.log(`Machine: A(${machine.A_X},${machine.A_Y}), B(${machine.B_X},${machine.B_Y}), P(${machine.P_X},${machine.P_Y}) - No Solution`);
        }
    }

    return total_tokens;
}

function day_12_find_area_perimeter(plot: string[][], row: number, col: number, visited: Set<string>, bulk: boolean) : [number, number] {

    const directions = [
        [-1, 0], // up      -- perimeter left/right
        [0, 1],  // right   -- perimeter up/down
        [1, 0],  // down    -- perimeter left/right
        [0, -1]  // left    -- perimeter up/down
    ];

    let area = 0;
    let perimeter = 0;
    let bulkPerimeter = 0;
    let perimeterLocations = new Set<string>();

    function validPosition(row: number, col: number): boolean {
        return row >= 0 && row < plot.length && col >= 0 && col < plot[row].length;
    }

    function dfs(regionType: string, row: number, col: number) {
        if (!validPosition(row, col) || plot[row][col] != regionType || visited.has(`${row},${col}`)) {
            return;
        }

        visited.add(`${row},${col}`);
        area++;

        for (let i = 0; i < directions.length; i++) {
            let [dRow, dCol] = directions[i];
            let newRow = row + dRow;
            let newCol = col + dCol;
            if (!validPosition(newRow, newCol) || plot[newRow][newCol] != regionType) {
                perimeterLocations.add(`${row},${col},${i}`);
                perimeter++;
            }
            else {
                dfs(regionType, newRow, newCol);
            }
        }
    }

    dfs(plot[row][col], row, col);

    // brute force bulk perimeter calculation
    if (bulk) {
        let perimeterVisited = new Set<string>();
        for (let row = 0; row < plot.length; row++) {
            for (let col = 0; col < plot[row].length; col++) {
                for (let i = 0; i < directions.length; i++) {
                    if (perimeterLocations.has(`${row},${col},${i}`)) {
                        if ((i == 0 || i == 2) && (!perimeterVisited.has(`${row},${col-1},${i}`) && !perimeterVisited.has(`${row},${col+1},${i}`)) ||
                            (i == 1 || i == 3) && (!perimeterVisited.has(`${row-1},${col},${i}`) && !perimeterVisited.has(`${row+1},${col},${i}`))) {
                                bulkPerimeter++;
                        }
                        perimeterVisited.add(`${row},${col},${i}`);
                    }
                }
            }
        }
        return [area, bulkPerimeter];
    }

    return [area, perimeter];
}

function day_12_find_regions(data: string, bulk: boolean): number {
    const plot = data.split('\n').map(group => group.split(''));
    let visited = new Set<string>();
    let fenceCost = 0;

    for (let row = 0; row < plot.length; row++) {
        for (let col = 0; col < plot[row].length; col++) {
            let [area, perimeter] = day_12_find_area_perimeter(plot, row, col, visited, bulk);
            fenceCost += area * perimeter;
            if (area > 0 || perimeter > 0) {
                console.log(`${plot[row][col]}: area=${area}, perimeter=${perimeter}`);
            }
        }
    }

    return fenceCost;
}

function day_12_2(data: string): number {
    return day_12_find_regions(data, true);
}

function day_12_1(data: string): number {
    return day_12_find_regions(data, false);
}

function day_11_apply_rules_recurse(stone: string, remainingBlinks: number, cache: Map<string, number>): number {

    // check cache if stone has been previously computed
    const cacheKey = `${stone}-${remainingBlinks}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
    }

    if (remainingBlinks === 0) {
        return 1;
    }

    let totalStones = 0;
    if (stone === '0') {
        totalStones = day_11_apply_rules_recurse('1', remainingBlinks - 1, cache);
    }
    else if (stone.length % 2 === 0) {
        totalStones = day_11_apply_rules_recurse(stone.slice(0, stone.length / 2), remainingBlinks - 1, cache) +
            day_11_apply_rules_recurse(Number.parseInt(stone.slice(stone.length / 2)).toString(), remainingBlinks - 1, cache);
    }
    else {
        totalStones = day_11_apply_rules_recurse((Number.parseInt(stone) * 2024).toString(), remainingBlinks - 1, cache);
    }

    cache.set(cacheKey, totalStones);

    return totalStones;
}

function day_11_blinks(data: string, blinks: number): number {
    const stones = data.split(' ');
    let cache = new Map<string, number>();
    let stoneCount = 0;

    for (let stone of stones) {
        stoneCount += day_11_apply_rules_recurse(stone, blinks, cache);
    }

    return stoneCount;
}

function day_11_2(data: string): number {
    return day_11_blinks(data, 75);
}

function day_11_1(data: string): number {
    return day_11_blinks(data, 25);
}

function day_10_find_peaks(topoMap: number[][], row: number, col: number, prevHeight: number, uniquePaths: boolean, peaks: Set<string>) {

    // check if out of bounds
    if (row < 0 || row >= topoMap.length || col < 0 || col >= topoMap[row].length) {
        return;
    }

    // path height must increase by 1
    if (topoMap[row][col] != prevHeight + 1) {
        return;
    }

    // path ends at a peak
    if (topoMap[row][col] === 9) {
        if (uniquePaths) {
            peaks.add(`${row},${col},${peaks.size}`);
        }
        else {
            peaks.add(`${row},${col}`);
        }
        return;
    }

    day_10_find_peaks(topoMap, row - 1, col, topoMap[row][col], uniquePaths, peaks);
    day_10_find_peaks(topoMap, row + 1, col, topoMap[row][col], uniquePaths, peaks);
    day_10_find_peaks(topoMap, row, col - 1, topoMap[row][col], uniquePaths, peaks);
    day_10_find_peaks(topoMap, row, col + 1, topoMap[row][col], uniquePaths, peaks);

    return;
}

function day_10_find_trailheads(data: string, uniquePaths: boolean): number {

    let topoMap = data.split('\n').map(group => group.split('').map(Number));
    let peaksSum = 0;

    // find trailheads
    for (let row = 0; row < topoMap.length; row++) {
        for (let col = 0; col < topoMap[row].length; col++) {
            if (topoMap[row][col] === 0) {
                let peaks = new Set<string>();
                day_10_find_peaks(topoMap, row, col, -1, uniquePaths, peaks);
                peaksSum += peaks.size;
            }
        }
    }

    return peaksSum;
}

function day_10_2(data: string): number {
    return day_10_find_trailheads(data, true);
}

function day_10_1(data: string): number {
    return day_10_find_trailheads(data, false);
}

function day_9_disk_layout(data: string): number[] {
    // DiskMap: 12345
    // DiskLayout: 0..111....22222

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

class Day8_GridPosition {
    row: number = 0;
    col: number = 0;
}

function day_8_parser(data: string): string[][] {
    return data.split('\n').map(group => group.split(''));
}

function day_8_find_antennas(cityMap: string[][]): Map<string, Day8_GridPosition[]> {
    const antennas = new Map<string, Day8_GridPosition[]>();

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

                function validAntinode(pos: Day8_GridPosition): boolean {
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
        '10.1': day_10_1,
        '10.2': day_10_2,
        '11.1': day_11_1,
        '11.2': day_11_2,
        '12.1': day_12_1,
        '12.2': day_12_2,
        '13.1': day_13_1,
        '14.1': day_14_1,
        '14.2': day_14_2,
        '15.1': day_15_1,
        '16.1': day_16_1,
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