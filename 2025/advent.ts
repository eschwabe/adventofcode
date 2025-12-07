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
