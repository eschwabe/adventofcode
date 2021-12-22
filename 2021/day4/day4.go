package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Game struct {
	numbers []int
}

type Board struct {
	grid [][]int
}

func main() {
	game, grids := parse()
	fmt.Fprintln(os.Stdout, "Part1")
	part1(game, grids)
	fmt.Fprintln(os.Stdout, "Part2")
	part2(game, grids)
}

func parse() (Game, []Board) {
	game := new(Game)
	boards := make([]Board, 0)
	scanner := bufio.NewScanner(os.Stdin)

	if scanner.Scan() {
		line := scanner.Text()
		values := strings.Split(line, ",")
		for _, v := range values {
			n, err := strconv.Atoi(v)
			if err != nil {
				fmt.Fprintln(os.Stderr, "error parsing: invalid numbers", v)
			}
			game.numbers = append(game.numbers, n)
		}
	}

	var board Board
	for scanner.Scan() {
		line := scanner.Text()

		if len(line) == 0 {
			if len(board.grid) > 0 {
				boards = append(boards, board)
			}
			board = *new(Board)
		} else {
			values := strings.Fields(line)
			row := make([]int, 0)
			for _, v := range values {
				n, err := strconv.Atoi(v)
				if err != nil {
					fmt.Fprintln(os.Stderr, "error parsing: invalid numbers", v)
				}
				row = append(row, n)
			}
			board.grid = append(board.grid, row)
		}
	}

	if len(game.numbers) == 0 {
		fmt.Fprintln(os.Stderr, "error parsing: invalid game input", game)
	}

	if len(boards) == 0 {
		fmt.Fprintln(os.Stderr, "error parsing: invalid board input", boards)
	}

	return *game, boards
}

func part1(game Game, boards []Board) {

	var winningBoard *Board
	var winningNumber *int
	pickedNumbers := map[int]bool{}

	for _, n := range game.numbers {
		pickedNumbers[n] = true
		for _, b := range boards {

			// check winner
			if checkWinningBoard(b, pickedNumbers) {
				winningBoard = &b
				winningNumber = &n
				break
			}
		}

		if winningBoard != nil {
			break
		}
	}

	sum := 0
	for _, row := range winningBoard.grid {
		for _, col := range row {
			if !pickedNumbers[col] {
				sum += col
			}
		}
	}

	fmt.Fprintln(os.Stdout, "Winning Board: ", winningBoard)
	fmt.Fprintln(os.Stdout, "Winning Sum:", sum)
	fmt.Fprintln(os.Stdout, "Multiplied: ", sum**winningNumber)
}

func part2(game Game, boards []Board) {

	winningBoards := map[*Board]bool{}
	var lastWinningBoard *Board
	var winningNumber *int
	pickedNumbers := map[int]bool{}

	for _, n := range game.numbers {
		pickedNumbers[n] = true
		for i := 0; i < len(boards); i++ {

			if winningBoards[&boards[i]] == true {
				continue
			}

			// check winner
			if checkWinningBoard(boards[i], pickedNumbers) {
				winningNumber = &n
				winningBoards[&boards[i]] = true
				lastWinningBoard = &boards[i]
			}
		}

		if len(winningBoards) == len(boards) {
			break
		}
	}

	sum := 0
	for _, row := range lastWinningBoard.grid {
		for _, col := range row {
			if !pickedNumbers[col] {
				sum += col
			}
		}
	}

	fmt.Fprintln(os.Stdout, "Picked Numbers: ", pickedNumbers)
	fmt.Fprintln(os.Stdout, "Last Winning Board: ", lastWinningBoard)
	fmt.Fprintln(os.Stdout, "Last Winning Sum:", sum)
	fmt.Fprintln(os.Stdout, "Multiplied: ", sum**winningNumber)
}

func checkWinningBoard(board Board, pickedNumbers map[int]bool) bool {

	// check cols
	for c := 0; c < len(board.grid[0]); c++ {
		win := true
		for r := 0; r < len(board.grid); r++ {
			if !pickedNumbers[board.grid[r][c]] {
				win = false
			}
		}
		if win {
			return true
		}
	}

	// check rows
	for _, row := range board.grid {
		win := true
		for _, col := range row {
			if !pickedNumbers[col] {
				win = false
			}
		}
		if win {
			return true
		}
	}

	return false
}
