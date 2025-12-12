import * as fs from 'fs';
import { exit } from 'process';

// Day 1: Secret Entrance - Rotating Dial Safe
interface Rotation {
    direction: 'L' | 'R';
    distance: number;
}

function day_1_parser(data: string): Rotation[] {
    const lines = data.split('\n');
    return lines.map(line => {
        const match = line.match(/([LR])(\d+)/);
        if (!match) throw new Error(`Invalid rotation: ${line}`);
        return {
            direction: match[1] as 'L' | 'R',
            distance: parseInt(match[2])
        };
    });
}

function day_1_1(data: string): number {
    const rotations = day_1_parser(data);
    let position = 50; // Dial starts at 50
    let zeroCount = 0;
    
    for (const rotation of rotations) {
        if (rotation.direction === 'L') {
            position = (position - rotation.distance + 100000) % 100;
        } else {
            position = (position + rotation.distance) % 100;
        }
        
        if (position === 0) {
            zeroCount++;
        }
    }
    
    return zeroCount;
}

function day_1_2(data: string): number {
    const rotations = day_1_parser(data);
    let position = 50; // Dial starts at 50
    let zeroCount = 0;
    
    for (const rotation of rotations) {
        // Count each individual click that passes through or lands on 0
        for (let i = 0; i < rotation.distance; i++) {
            if (rotation.direction === 'L') {
                position = (position - 1 + 100) % 100;
            } else {
                position = (position + 1) % 100;
            }
            
            if (position === 0) {
                zeroCount++;
            }
        }
    }
    
    return zeroCount;
}

// Day 2: Gift Shop - Invalid Product IDs
function day_2_parser(data: string): [number, number][] {
    const ranges = data.split(',').map(range => range.trim());
    return ranges.map(range => {
        const [start, end] = range.split('-').map(n => parseInt(n));
        return [start, end] as [number, number];
    });
}

function isInvalidId(id: number): boolean {
    const str = id.toString();
    const len = str.length;
    
    // Must be even length to be repeatable
    if (len % 2 !== 0) return false;
    
    const halfLen = len / 2;
    const firstHalf = str.substring(0, halfLen);
    const secondHalf = str.substring(halfLen);
    
    // Check if the two halves are identical
    return firstHalf === secondHalf;
}

function isInvalidIdPart2(id: number): boolean {
    const str = id.toString();
    const len = str.length;
    
    // Try all possible pattern lengths that divide evenly into the string length
    for (let patternLen = 1; patternLen <= len / 2; patternLen++) {
        if (len % patternLen !== 0) continue;
        
        const pattern = str.substring(0, patternLen);
        let isRepeated = true;
        
        // Check if the entire string is this pattern repeated
        for (let i = patternLen; i < len; i += patternLen) {
            if (str.substring(i, i + patternLen) !== pattern) {
                isRepeated = false;
                break;
            }
        }
        
        if (isRepeated) return true;
    }
    
    return false;
}

function day_2_1(data: string): number {
    const ranges = day_2_parser(data);
    let sum = 0;
    
    for (const [start, end] of ranges) {
        for (let id = start; id <= end; id++) {
            if (isInvalidId(id)) {
                sum += id;
            }
        }
    }
    
    return sum;
}

function day_2_2(data: string): number {
    const ranges = day_2_parser(data);
    let sum = 0;
    
    for (const [start, end] of ranges) {
        for (let id = start; id <= end; id++) {
            if (isInvalidIdPart2(id)) {
                sum += id;
            }
        }
    }
    
    return sum;
}

// Day 3: Lobby - Battery Banks
function day_3_parser(data: string): string[] {
    return data.split('\n').filter(line => line.trim() !== '');
}

function day_3_1(data: string): number {
    const banks = day_3_parser(data);
    let totalJoltage = 0;
    
    for (const bank of banks) {
        let maxJoltage = 0;
        
        // Try all pairs of positions (i, j) where i < j
        for (let i = 0; i < bank.length - 1; i++) {
            for (let j = i + 1; j < bank.length; j++) {
                // Form the number by concatenating digits at positions i and j
                const joltage = parseInt(bank[i] + bank[j]);
                maxJoltage = Math.max(maxJoltage, joltage);
            }
        }
        
        totalJoltage += maxJoltage;
    }
    
    return totalJoltage;
}

function day_3_2(data: string): number {
    const banks = day_3_parser(data);
    let totalJoltage = 0;
    
    for (const bank of banks) {
        const batteriesToSelect = 12;
        
        // Greedy approach: at each position, select the largest digit that still
        // leaves enough remaining digits to complete our selection
        let result = '';
        let startPos = 0;
        let remaining = batteriesToSelect;
        
        while (remaining > 0) {
            // We need 'remaining' more digits
            // We can look ahead up to (bank.length - startPos - remaining) positions
            const maxLookAhead = bank.length - startPos - remaining + 1;
            
            let maxDigit = '0';
            let maxPos = startPos;
            
            // Find the largest digit within our lookahead window
            for (let i = 0; i < maxLookAhead; i++) {
                if (bank[startPos + i] > maxDigit) {
                    maxDigit = bank[startPos + i];
                    maxPos = startPos + i;
                }
            }
            
            result += maxDigit;
            startPos = maxPos + 1;
            remaining--;
        }
        
        totalJoltage += parseInt(result);
    }
    
    return totalJoltage;
}

// Day 4: Printing Department - Accessible Paper Rolls
const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
];

function countAdjacentPaper(grid: string[][], row: number, col: number): number {
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;
    
    for (const [dr, dc] of DIRECTIONS) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            if (grid[newRow][newCol] === '@') {
                count++;
            }
        }
    }
    return count;
}

function findAccessiblePaperRolls(grid: string[][]): [number, number][] {
    const accessible: [number, number][] = [];
    const rows = grid.length;
    const cols = grid[0].length;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] === '@') {
                const adjacentCount = countAdjacentPaper(grid, row, col);
                if (adjacentCount < 4) {
                    accessible.push([row, col]);
                }
            }
        }
    }
    
    return accessible;
}

function day_4_1(data: string): number {
    const grid = data.split('\n').map(line => line.split(''));
    return findAccessiblePaperRolls(grid).length;
}

function day_4_2(data: string): number {
    const grid = data.split('\n').map(line => line.split(''));
    let totalRemoved = 0;
    
    // Keep removing accessible paper rolls until no more can be removed
    let accessible = findAccessiblePaperRolls(grid);
    while (accessible.length > 0) {
        // Remove all accessible paper rolls
        for (const [row, col] of accessible) {
            grid[row][col] = '.';
        }
        totalRemoved += accessible.length;
        
        // Find newly accessible rolls
        accessible = findAccessiblePaperRolls(grid);
    }
    
    return totalRemoved;
}

// Day 5: Cafeteria - Fresh Ingredient Checker
interface IngredientRange {
    start: number;
    end: number;
}

function day_5_parser(data: string): { ranges: IngredientRange[], ingredients: number[] } {
    const sections = data.split('\n\n');
    
    // Parse fresh ingredient ranges
    const ranges = sections[0].split('\n').map(line => {
        const [start, end] = line.split('-').map(Number);
        return { start, end };
    });
    
    // Parse available ingredient IDs
    const ingredients = sections[1].split('\n').map(Number);
    
    return { ranges, ingredients };
}

function day_5_1(data: string): number {
    const { ranges, ingredients } = day_5_parser(data);
    
    let freshCount = 0;
    
    for (const id of ingredients) {
        // Check if this ingredient ID falls within any fresh range
        const isFresh = ranges.some(range => id >= range.start && id <= range.end);
        if (isFresh) {
            freshCount++;
        }
    }
    
    return freshCount;
}

function day_5_2(data: string): number {
    const { ranges } = day_5_parser(data);
    
    // Sort ranges by start position
    const sortedRanges = [...ranges].sort((a, b) => a.start - b.start);
    
    // Merge overlapping ranges
    const mergedRanges: IngredientRange[] = [];
    let current = sortedRanges[0];
    
    for (let i = 1; i < sortedRanges.length; i++) {
        const next = sortedRanges[i];
        
        // Check if ranges overlap or are adjacent
        if (next.start <= current.end + 1) {
            // Merge by extending the end if needed
            current = {
                start: current.start,
                end: Math.max(current.end, next.end)
            };
        } else {
            // No overlap, save current and move to next
            mergedRanges.push(current);
            current = next;
        }
    }
    mergedRanges.push(current);
    
    // Count total IDs in merged ranges
    let totalIds = 0;
    for (const range of mergedRanges) {
        totalIds += range.end - range.start + 1;
    }
    
    return totalIds;
}

// Day 6: Trash Compactor - Vertical Math Problems
function day_6_parser(data: string): { numbers: number[][], operators: string[] } {
    const lines = data.split('\n');
    
    // Last line is operators, all lines before are numbers
    const numberLines = lines.slice(0, -1);
    const operatorLine = lines[lines.length - 1];
    
    // Split each line by multiple spaces to get columns
    const numberColumns: string[][] = [];
    
    for (const line of numberLines) {
        // Split by one or more spaces, filtering out empty strings
        const tokens = line.split(/\s+/).filter(s => s.length > 0);
        for (let i = 0; i < tokens.length; i++) {
            if (!numberColumns[i]) {
                numberColumns[i] = [];
            }
            numberColumns[i].push(tokens[i]);
        }
    }
    
    // Split operator line the same way
    const operatorTokens = operatorLine.split(/\s+/).filter(s => s.length > 0);
    
    // Build problems
    const problems: number[][] = [];
    const operators: string[] = [];
    
    for (let i = 0; i < operatorTokens.length; i++) {
        if (i < numberColumns.length) {
            const column = numberColumns[i];
            const nums = column.map(s => parseInt(s));
            if (nums.every(n => !isNaN(n)) && nums.length === numberLines.length) {
                problems.push(nums);
                operators.push(operatorTokens[i]);
            }
        }
    }
    
    return { numbers: problems, operators };
}

function day_6_1(data: string): number {
    const { numbers, operators } = day_6_parser(data);
    
    let grandTotal = 0;
    
    // Solve each problem
    for (let i = 0; i < numbers.length; i++) {
        const problemNumbers = numbers[i];
        const operator = operators[i];
        
        let result: number;
        if (operator === '+') {
            result = problemNumbers.reduce((sum, n) => sum + n, 0);
        } else if (operator === '*') {
            result = problemNumbers.reduce((product, n) => product * n, 1);
        } else {
            throw new Error(`Unknown operator: ${operator}`);
        }
        
        grandTotal += result;
    }
    
    return grandTotal;
}

function day_6_2(data: string): number {
    const lines = data.split('\n');
    
    // Last line is operators, all lines before are numbers/digits
    const numberLines = lines.slice(0, -1);
    const operatorLine = lines[lines.length - 1];
    
    // Pad all lines to the same length
    const maxLen = Math.max(...lines.map(l => l.length));
    const paddedNumberLines = numberLines.map(l => l.padEnd(maxLen));
    const paddedOperatorLine = operatorLine.padEnd(maxLen);
    
    // A column is a "separator" if ALL characters in that column (including operator) are spaces
    const isSeparatorColumn = (col: number): boolean => {
        if (paddedOperatorLine[col] !== ' ') return false;
        for (const line of paddedNumberLines) {
            if (line[col] !== ' ') return false;
        }
        return true;
    };
    
    let grandTotal = 0;
    let col = maxLen - 1;
    
    while (col >= 0) {
        // Skip separator columns
        while (col >= 0 && isSeparatorColumn(col)) {
            col--;
        }
        if (col < 0) break;
        
        // Found a problem - collect all columns until we hit a separator
        const numbers: number[] = [];
        let operator = '+';
        
        while (col >= 0 && !isSeparatorColumn(col)) {
            // Get operator from this column if present
            if (paddedOperatorLine[col] !== ' ') {
                operator = paddedOperatorLine[col];
            }
            
            // Build a number from this column by reading digits top to bottom
            let digitStr = '';
            for (const line of paddedNumberLines) {
                const ch = line[col];
                if (ch !== ' ') {
                    digitStr += ch;
                }
            }
            
            if (digitStr.length > 0) {
                numbers.push(parseInt(digitStr));
            }
            col--;
        }
        
        // Calculate result based on operator
        let result: number;
        if (operator === '+') {
            result = numbers.reduce((sum, n) => sum + n, 0);
        } else if (operator === '*') {
            result = numbers.reduce((product, n) => product * n, 1);
        } else {
            throw new Error(`Unknown operator: ${operator}`);
        }
        
        grandTotal += result;
    }
    
    return grandTotal;
}

// Day 7: Laboratories - Tachyon Manifold
function day_7_parser(data: string): string[] {
    return data.split('\n');
}

function day_7_1(data: string): number {
    const grid = day_7_parser(data);
    const rows = grid.length;
    const cols = grid[0].length;
    
    // Find starting position (S)
    let startCol = -1;
    for (let col = 0; col < cols; col++) {
        if (grid[0][col] === 'S') {
            startCol = col;
            break;
        }
    }
    
    if (startCol === -1) {
        throw new Error("Could not find starting position 'S'");
    }
    
    let splitCount = 0;
    
    // Use a set to track active beam columns at each row
    // Start with one beam at the starting column, row 1 (below S)
    let activeBeams = new Set<number>();
    activeBeams.add(startCol);
    
    // Process row by row starting from row 1
    for (let row = 1; row < rows && activeBeams.size > 0; row++) {
        const newBeams = new Set<number>();
        
        for (const col of activeBeams) {
            const cell = grid[row][col];
            
            if (cell === '^') {
                // Beam hits a splitter - count the split and create two new beams
                splitCount++;
                // Left beam (if in bounds)
                if (col - 1 >= 0) {
                    newBeams.add(col - 1);
                }
                // Right beam (if in bounds)
                if (col + 1 < cols) {
                    newBeams.add(col + 1);
                }
            } else if (cell === '.') {
                // Beam passes through empty space
                newBeams.add(col);
            }
            // If cell is something else (including S), beam stops
        }
        
        activeBeams = newBeams;
    }
    
    return splitCount;
}

// Main runner
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: ts-node advent.ts <day> <part> [input_file]');
    exit(1);
}

const day = parseInt(args[0]);
const part = parseInt(args[1]);
const inputFile = args[2] || `inputs/${day}.txt`;

try {
    const data = fs.readFileSync(inputFile, 'utf8').trim();
    let result: number;

    switch (day) {
        case 1:
            result = part === 1 ? day_1_1(data) : day_1_2(data);
            break;
        case 2:
            result = part === 1 ? day_2_1(data) : day_2_2(data);
            break;
        case 3:
            result = part === 1 ? day_3_1(data) : day_3_2(data);
            break;
        case 4:
            result = part === 1 ? day_4_1(data) : day_4_2(data);
            break;
        case 5:
            result = part === 1 ? day_5_1(data) : day_5_2(data);
            break;
        case 6:
            result = part === 1 ? day_6_1(data) : day_6_2(data);
            break;
        case 7:
            result = part === 1 ? day_7_1(data) : day_7_1(data); // Part 2 TBD
            break;
        // Add more days here as needed
        default:
            console.log(`Day ${day} not implemented yet`);
            exit(1);
    }

    console.log(`Day ${day} Part ${part}: ${result}`);
} catch (error) {
    console.error(`Error: ${error}`);
    exit(1);
}
