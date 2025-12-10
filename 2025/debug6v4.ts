import * as fs from 'fs';

const data = fs.readFileSync('inputs/6-test.txt', 'utf8').trim();
const lines = data.split('\n');

const numberLines = lines.slice(0, -1);
const operatorLine = lines[lines.length - 1];

console.log('Lines:');
numberLines.forEach((line, i) => {
    console.log(`${i}: "${line}"`);
});
console.log(`Op: "${operatorLine}"`);

// Find where operators are positioned
const operatorPositions: { pos: number, op: string }[] = [];
for (let i = 0; i < operatorLine.length; i++) {
    if (operatorLine[i] !== ' ') {
        operatorPositions.push({ pos: i, op: operatorLine[i] });
        console.log(`Operator '${operatorLine[i]}' at pos ${i}`);
    }
}

// Determine column bounds for each problem
const problemBounds: { start: number, end: number, op: string }[] = [];
for (let i = 0; i < operatorPositions.length; i++) {
    const start = i === 0 ? 0 : operatorPositions[i - 1].pos + 1;
    const end = operatorPositions[i].pos + 1;
    problemBounds.push({ start, end, op: operatorPositions[i].op });
    console.log(`Problem ${i}: columns [${start}:${end}], operator '${operatorPositions[i].op}'`);
}

// For each problem, extract numbers from its column range
const problems: number[][] = [];
const operators: string[] = [];

for (let p = 0; p < problemBounds.length; p++) {
    const { start, end, op } = problemBounds[p];
    console.log(`\nProblem ${p} (cols ${start}-${end}, op '${op}'):`);
    const nums: number[] = [];
    
    for (let r = 0; r < numberLines.length; r++) {
        const line = numberLines[r];
        // Extract the substring for this problem's columns
        const section = line.substring(start, end);
        const trimmed = section.trim();
        console.log(`  Row ${r}: "${section}" => "${trimmed}"`);
        if (trimmed) {
            const num = parseInt(trimmed);
            if (!isNaN(num)) {
                nums.push(num);
            }
        }
    }
    
    console.log(`  Numbers: ${nums.join(', ')}`);
    const result = op === '+' ? nums.reduce((a, b) => a + b, 0) : nums.reduce((a, b) => a * b, 1);
    console.log(`  Result: ${result}`);
    
    if (nums.length === numberLines.length) {
        problems.push(nums);
        operators.push(op);
    }
}

console.log('\n\nExpected:');
console.log('Problem 0: 123 * 45 * 6 = 33210');
console.log('Problem 1: 328 + 64 + 98 = 490');
console.log('Problem 2: 51 * 387 * 215 = 4243455');
console.log('Problem 3: 64 + 23 + 314 = 401');
console.log('Grand Total: 4277556');
