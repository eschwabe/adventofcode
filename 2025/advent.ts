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
