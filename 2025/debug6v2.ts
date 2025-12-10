import * as fs from 'fs';

const data = fs.readFileSync('inputs/6-test.txt', 'utf8').trim();
const lines = data.split('\n');

const numberLines = lines.slice(0, -1);
const operatorLine = lines[lines.length - 1];

console.log('Number lines:');
numberLines.forEach((line, i) => {
    console.log(`Row ${i}:`, JSON.stringify(line));
});
console.log('Operator line:', JSON.stringify(operatorLine));

const maxLen = Math.max(...lines.map(l => l.length));

const problems: number[][] = [];
const operators: string[] = [];

let currentProblem: string[] = numberLines.map(() => '');
let currentOperator = '';
let inNumber = false;

for (let col = 0; col < maxLen; col++) {
    let allSpaces = true;
    for (const line of numberLines) {
        const char = col < line.length ? line[col] : ' ';
        if (char !== ' ') {
            allSpaces = false;
            break;
        }
    }
    
    const opChar = col < operatorLine.length ? operatorLine[col] : ' ';
    
    // console.log(`Col ${col}: allSpaces=${allSpaces}, opChar='${opChar}', currentProblem=${JSON.stringify(currentProblem)}, currentOp='${currentOperator}'`);
    
    if (allSpaces) {
        if (opChar !== ' ') {
            // Starting a new problem - save the previous one if exists
            if (inNumber && currentOperator !== '') {
                const nums = currentProblem.map(s => parseInt(s.trim())).filter(n => !isNaN(n));
                if (nums.length === numberLines.length) {
                    console.log(`  Saving problem (new op): ${nums.join(', ')} with operator ${currentOperator}`);
                    problems.push(nums);
                    operators.push(currentOperator);
                }
                currentProblem = numberLines.map(() => '');
            }
            currentOperator = opChar;
            inNumber = true;
        } else if (inNumber) {
            // Separator - save if we were in a problem
            if (currentOperator !== '') {
                const nums = currentProblem.map(s => parseInt(s.trim())).filter(n => !isNaN(n));
                if (nums.length === numberLines.length) {
                    console.log(`  Saving problem (separator): ${nums.join(', ')} with operator ${currentOperator}`);
                    problems.push(nums);
                    operators.push(currentOperator);
                }
                currentProblem = numberLines.map(() => '');
                currentOperator = '';
                inNumber = false;
            }
        }
    } else {
        // Part of numbers
        inNumber = true;
        for (let row = 0; row < numberLines.length; row++) {
            const char = col < numberLines[row].length ? numberLines[row][col] : ' ';
            currentProblem[row] += char;
        }
    }
}

if (inNumber && currentOperator !== '') {
    const nums = currentProblem.map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (nums.length === numberLines.length) {
        console.log(`  Saving final problem: ${nums.join(', ')} with operator ${currentOperator}`);
        problems.push(nums);
        operators.push(currentOperator);
    }
}

console.log('\nParsed problems:');
problems.forEach((nums, i) => {
    console.log(`Problem ${i}: ${nums.join(', ')} ${operators[i]}`);
    const result = operators[i] === '+' ? nums.reduce((a, b) => a + b, 0) : nums.reduce((a, b) => a * b, 1);
    console.log(`  Result: ${result}`);
});

const grandTotal = problems.reduce((sum, nums, i) => {
    const result = operators[i] === '+' ? nums.reduce((a, b) => a + b, 0) : nums.reduce((a, b) => a * b, 1);
    return sum + result;
}, 0);

console.log(`\nGrand Total: ${grandTotal}`);
console.log('Expected: 4277556');
