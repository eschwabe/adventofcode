package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
)

type HeightMap [][]int

type Position struct {
	r int
	c int
}

type Basin struct {
	r    int
	c    int
	size int
}

func main() {
	heightMap := parse()
	lowestPoints, riskLevel := getLowestPointCount(heightMap)
	basins := getBasinsFromLowestPoints(heightMap, lowestPoints)
	sizes := sortBasinSizes(basins)
	largestSizes := getTopThreeBasinsSizes(sizes)
	fmt.Fprintln(os.Stdout, "Height Map Rows", len(heightMap))
	fmt.Fprintln(os.Stdout, "Part1")
	fmt.Fprintln(os.Stdout, "Lowest Point Count:", len(lowestPoints))
	fmt.Fprintln(os.Stdout, "Risk Level:", riskLevel)
	fmt.Fprintln(os.Stdout, "Part2")
	fmt.Fprintln(os.Stdout, "Basin Count:", len(basins))
	fmt.Fprintln(os.Stdout, "Largest 3 Basin Sizes (Multiplied):", largestSizes)
}

func parse() HeightMap {
	scanner := bufio.NewScanner(os.Stdin)
	heightMap := make([][]int, 0)

	for scanner.Scan() {
		rowText := scanner.Text()
		row := make([]int, 0)

		for _, c := range rowText {
			height, err := strconv.Atoi(string(c))
			if err != nil {
				fmt.Fprintln(os.Stderr, "error parsing: invalid input string", rowText)
			}
			row = append(row, height)
		}

		heightMap = append(heightMap, row)
	}

	return heightMap
}

func getTopThreeBasinsSizes(sizes []int) int {
	if len(sizes) < 3 {
		fmt.Fprintln(os.Stderr, "error parsing: invalid basin size length", len(sizes))
		return -1
	}
	return sizes[len(sizes)-1] * sizes[len(sizes)-2] * sizes[len(sizes)-3]
}

func sortBasinSizes(basins []Basin) []int {
	sizes := make([]int, 0)
	for _, b := range basins {
		sizes = append(sizes, b.size)
	}
	sort.Ints(sizes)
	return sizes
}

func getBasinsFromLowestPoints(hmap HeightMap, lowestPoints []Position) []Basin {
	basins := make([]Basin, 0)
	visited := make([][]bool, 0)

	// initialize visited map
	for r := 0; r < len(hmap); r++ {
		visited = append(visited, make([]bool, len(hmap[r])))
	}

	for _, lowPoint := range lowestPoints {
		queue := make([]Position, 0)
		queue = append(queue, lowPoint)

		// skip if low point already visited
		if visited[lowPoint.r][lowPoint.c] {
			continue
		}

		basin := Basin{lowPoint.r, lowPoint.c, 0}

		for len(queue) > 0 {
			pos := queue[0]
			queue = queue[1:]

			if visited[pos.r][pos.c] {
				continue
			}

			basin.size++

			if !hmap.isMaxHeightOrVisited(visited, pos.r-1, pos.c) {
				queue = append(queue, Position{pos.r - 1, pos.c})
			}
			if !hmap.isMaxHeightOrVisited(visited, pos.r, pos.c-1) {
				queue = append(queue, Position{pos.r, pos.c - 1})
			}
			if !hmap.isMaxHeightOrVisited(visited, pos.r, pos.c+1) {
				queue = append(queue, Position{pos.r, pos.c + 1})
			}
			if !hmap.isMaxHeightOrVisited(visited, pos.r+1, pos.c) {
				queue = append(queue, Position{pos.r + 1, pos.c})
			}

			visited[pos.r][pos.c] = true
		}

		basins = append(basins, basin)
	}

	return basins
}

func getLowestPointCount(hMap HeightMap) ([]Position, int) {
	lowestPoints := make([]Position, 0)
	riskLevel := 0
	for r := 0; r < len(hMap); r++ {
		for c := 0; c < len(hMap[r]); c++ {
			if hMap.isLowerHeight(r, c, r-1, c) &&
				hMap.isLowerHeight(r, c, r, c-1) &&
				hMap.isLowerHeight(r, c, r, c+1) &&
				hMap.isLowerHeight(r, c, r+1, c) {

				lowestPoints = append(lowestPoints, Position{r, c})
				risk := hMap[r][c] + 1
				riskLevel += risk
			}
		}
	}
	return lowestPoints, riskLevel
}

// true if position 1 lower than position 2
func (hMap HeightMap) isLowerHeight(r1 int, c1 int, r2 int, c2 int) bool {
	if r1 < 0 || r1 >= len(hMap) || c1 < 0 || c1 >= len(hMap[r1]) {
		return false
	} else if r2 < 0 || r2 >= len(hMap) || c2 < 0 || c2 >= len(hMap[r2]) {
		return true
	} else {
		return hMap[r1][c1] < hMap[r2][c2]
	}
}

// true if position outside of map or max height (9)
func (hMap HeightMap) isMaxHeightOrVisited(visited [][]bool, r int, c int) bool {
	if r < 0 || r >= len(hMap) || c < 0 || c >= len(hMap[r]) {
		return true
	} else if visited[r][c] {
		return true
	} else {
		return hMap[r][c] >= 9
	}
}
