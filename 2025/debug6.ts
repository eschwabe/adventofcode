import * as fs from 'fs';

const data = fs.readFileSync('inputs/6-test.txt', 'utf8').trim();
const lines = data.split('\n');

console.log('Lines:');
lines.forEach((line, i) => {
    console.log(`${i}: "${line}"`);
    console.log(`   Length: ${line.length}`);
});

// Expected problems from the description:
// 123 * 45 * 6 = 33210
// 328 + 64 + 98 = 490
// 51 * 387 * 215 = 4243455
// 64 + 23 + 314 = 401
// Grand total = 4277556

console.log('\nExpected:');
console.log('Problem 1: 123 * 45 * 6 = 33210');
console.log('Problem 2: 328 + 64 + 98 = 490');
console.log('Problem 3: 51 * 387 * 215 = 4243455');
console.log('Problem 4: 64 + 23 + 314 = 401');
console.log('Grand Total: 4277556');
