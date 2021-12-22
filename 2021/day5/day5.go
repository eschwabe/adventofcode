package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Coordinate struct {
	x int
	y int
}

type Line struct {
	start Coordinate
	end   Coordinate
}

func main() {
	lines := parse()
	fmt.Fprintln(os.Stdout, "Part1")
	part1(lines)
	fmt.Fprintln(os.Stdout, "Part2")
	part2(lines)
}

func parse() []Line {
	lines := make([]Line, 0)
	scanner := bufio.NewScanner(os.Stdin)

	for scanner.Scan() {
		text := scanner.Text()
		coords := strings.Split(text, "->")

		if len(coords) != 2 {
			fmt.Fprintln(os.Stderr, "error parsing: invalid coordinates", coords)
		}

		startFields := strings.Split(strings.TrimSpace(coords[0]), ",")
		endFields := strings.Split(strings.TrimSpace(coords[1]), ",")

		x1, err := strconv.Atoi(startFields[0])
		if err != nil {
			fmt.Fprintln(os.Stderr, "error parsing: invalid input", startFields[0])
		}
		y1, err := strconv.Atoi(startFields[1])
		if err != nil {
			fmt.Fprintln(os.Stderr, "error parsing: invalid input", startFields[1])
		}
		x2, err := strconv.Atoi(endFields[0])
		if err != nil {
			fmt.Fprintln(os.Stderr, "error parsing: invalid input", endFields[0])
		}
		y2, err := strconv.Atoi(endFields[1])
		if err != nil {
			fmt.Fprintln(os.Stderr, "error parsing: invalid input", endFields[1])
		}

		line := Line{Coordinate{x1, y1}, Coordinate{x2, y2}}
		lines = append(lines, line)
	}

	return lines
}

func part1(lines []Line) {

	grid := populateGrid(lines, true)

	overlaps := 0

	for _, row := range grid {
		for _, val := range row {
			if val > 1 {
				overlaps++
			}
		}
	}

	fmt.Fprintln(os.Stdout, "Overlaps:", overlaps)
}

func part2(lines []Line) {

	grid := populateGrid(lines, false)

	overlaps := 0

	for _, row := range grid {
		for _, val := range row {
			if val > 1 {
				overlaps++
			}
		}
	}

	fmt.Fprintln(os.Stdout, "Overlaps:", overlaps)
}

func populateGrid(lines []Line, filterDiagnonalLines bool) [][]int {

	maxX := 0
	maxY := 0

	for i := 0; i < len(lines); i++ {
		maxX = max(maxX, lines[i].start.x)
		maxX = max(maxX, lines[i].end.x)
		maxY = max(maxY, lines[i].start.y)
		maxY = max(maxY, lines[i].end.y)
	}

	grid := make([][]int, 0)
	for i := 0; i <= maxX; i++ {
		grid = append(grid, make([]int, maxY+1))
	}

	for _, line := range lines {
		if filterDiagnonalLines && (line.start.x != line.end.x && line.start.y != line.end.y) {
			continue
		}

		xPos := line.start.x
		xEnd := line.end.x
		yPos := line.start.y
		yEnd := line.end.y

		for {
			grid[xPos][yPos]++

			if xPos == xEnd && yPos == yEnd {
				break
			}
			if xPos < xEnd {
				xPos++
			}
			if xPos > xEnd {
				xPos--
			}
			if yPos < yEnd {
				yPos++
			}
			if yPos > yEnd {
				yPos--
			}
		}
	}

	return grid
}

func max(x, y int) int {
	if x > y {
		return x
	}
	return y
}

func min(x, y int) int {
	if x < y {
		return x
	}
	return y
}
