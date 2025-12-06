# Advent of Code 2025 - Agent Guide

## Project Structure

```
2025/
├── advent.ts          # Main solution file with all daily puzzles
├── package.json       # Node.js dependencies
├── tsconfig.json      # TypeScript configuration
├── inputs/            # Puzzle input files (one per day)
│   └── 1.txt
└── agent.md          # This file
```

## How It Works

### Solution Architecture

All solutions are implemented in a single `advent.ts` file with the following pattern:

```typescript
// Day N: Puzzle Title
interface/type declarations (if needed)

function day_N_parser(data: string): ParsedType {
    // Parse input into usable data structure
}

function day_N_1(data: string): number {
    // Part 1 solution
}

function day_N_2(data: string): number {
    // Part 2 solution
}
```

### Running Solutions

```bash
npx ts-node advent.ts <day> <part> [input_file]
```

Examples:
- `npx ts-node advent.ts 1 1` - Run Day 1 Part 1 (uses `inputs/1.txt`)
- `npx ts-node advent.ts 1 2 inputs/1.txt` - Run Day 1 Part 2 with explicit input file

### Main Runner

The bottom of `advent.ts` contains a switch statement that routes to the appropriate day/part functions. When adding a new day:

1. Add parser, part 1, and part 2 functions following the naming convention
2. Add a new case in the switch statement:
   ```typescript
   case N:
       result = part === 1 ? day_N_1(data) : day_N_2(data);
       break;
   ```

## Development Standards

### Code Style
- Use TypeScript with strict type checking
- Define interfaces/types for complex data structures
- Keep parser logic separate from solution logic
- Use descriptive variable names
- Add comments for puzzle title and key insights

### Input Files
- Store puzzle inputs in `inputs/` directory
- Use naming convention: `{day}.txt` (e.g., `1.txt`, `2.txt`)
- Test inputs can use suffix: `{day}-test.txt`

### Testing Approach
- Test with example inputs from puzzle description first
- Verify against expected outputs before running on actual input
- Run both parts after implementing to ensure part 1 still works

### Workflow for New Puzzles
1. Fetch puzzle from https://adventofcode.com/2025/day/N
2. Save input to `inputs/N.txt`
3. Implement parser function
4. Implement part 1 solution
5. Test and verify part 1
6. Submit answer to unlock part 2
7. Implement part 2 solution
8. Test and verify part 2
9. Commit changes with descriptive message

### Git Commit Messages
- Use clear, descriptive messages
- Format: `Add Day N Part X solution - brief description`
- Example: `Add Day 1 Part 2 solution - count all clicks through zero`

## Dependencies

- **TypeScript** (^5.7.2): Language and compiler
- **@types/node** (^22.10.1): Node.js type definitions
- **Node.js**: Runtime environment

Install dependencies with:
```bash
npm install
```

## Tips for Future Sessions

1. **Part 2 Unlock**: Part 2 is only visible after submitting correct answer for Part 1
2. **Modular Arithmetic**: Many puzzles involve wrapping/circular logic - use modulo carefully
3. **Performance**: Start with clear, correct code; optimize only if needed
4. **Edge Cases**: Pay attention to boundary conditions (0, wraparound, etc.)
5. **Read Carefully**: Puzzle descriptions contain crucial details - reread if stuck

## Current Progress

- ✅ Day 1: Secret Entrance (Rotating Dial Safe)
  - Part 1: Count endings on 0
  - Part 2: Count all passes through 0
