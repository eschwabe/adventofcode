import * as fs from 'fs';

const data = fs.readFileSync('inputs/6-test.txt', 'utf8').trim();
const lines = data.split('\n');

const numberLines = lines.slice(0, -1);
const operatorLine = lines[lines.length - 1];

console.log('Operator line:', JSON.stringify(operatorLine));

// Find where operators are positioned
const operatorPositions: { pos: number, op: string }[] = [];
for (let i = 0; i < operatorLine.length; i++) {
    if (operatorLine[i] !== ' ') {
        operatorPositions.push({ pos: i, op: operatorLine[i] });
        console.log(`Found operator '${operatorLine[i]}' at position ${i}`);
    }
}

console.log('\nParsing problems:');

const problems: number[][] = [];
const operators: string[] = [];

for (const { pos, op } of operatorPositions) {
    console.log(`\nOperator '${op}' at position ${pos}:`);
    const nums: number[] = [];
    
    for (let row = 0; row < numberLines.length; row++) {
        const line = numberLines[row];
        console.log(`  Row ${row}: "${line}"`);
        
        // The operator marks a position in a problem column
        // Scan left and right from pos to find a number that includes or is near this position
        let start = pos;
        let end = pos + 1;
        
        // If current position is not a space, it's part of a number
        if (pos < line.length && line[pos] !== ' ') {
            // Scan left to find start
            while (start > 0 && line[start - 1] !== ' ') {
                start--;
            }
            // Scan right to find end
            while (end < line.length && line[end] !== ' ') {
                end++;
            }
        } else {
            // Current position is space, scan left to find a number ending before this position
            start = pos - 1;
            while (start >= 0 && line[start] === ' ') {
                start--;
            }
            if (start >= 0 && line[start] !== ' ') {
                end = start + 1;
                while (start > 0 && line[start - 1] !== ' ') {
                    start--;
                }
            } else {
                // No number found, skip
                console.log(`    Position ${pos}: no number found`);
                continue;
            }
        }
        
        const numStr = line.substring(start, end).trim();
        console.log(`    Position ${pos}: chars[${start}:${end}] = "${line.substring(start, end)}" => "${numStr}"`);
        if (numStr) {
            nums.push(parseInt(numStr));
        }
    }
    
    console.log(`  Numbers: ${nums.join(', ')}`);
    
    if (nums.length === numberLines.length) {
        problems.push(nums);
        operators.push(op);
        
        const result = op === '+' ? nums.reduce((a, b) => a + b, 0) : nums.reduce((a, b) => a * b, 1);
        console.log(`  Result: ${result}`);
    }
}

console.log('\n\nExpected:');
console.log('Problem 1: 123 * 45 * 6 = 33210');
console.log('Problem 2: 328 + 64 + 98 = 490');
console.log('Problem 3: 51 * 387 * 215 = 4243455');
console.log('Problem 4: 64 + 23 + 314 = 401');
console.log('Grand Total: 4277556');

const grandTotal = problems.reduce((sum, nums, i) => {
    const result = operators[i] === '+' ? nums.reduce((a, b) => a + b, 0) : nums.reduce((a, b) => a * b, 1);
    return sum + result;
}, 0);

console.log(`\nGot Grand Total: ${grandTotal}`);
