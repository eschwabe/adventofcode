package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"sort"
	"strconv"
	"strings"
)

type CrabSubmarine struct {
	xPos int
}

func main() {
	subs := parse()
	avg := computeAveragePosition(subs)
	median := computeMedianPosition(subs)
	minPos, maxPos := findMinMaxPositions(subs)
	fmt.Fprintln(os.Stdout, "Submarine Count:", len(subs))
	fmt.Fprintln(os.Stdout, "Part1")
	fmt.Fprintln(os.Stdout, "Average Position:", avg)
	fmt.Fprintln(os.Stdout, "Median Position:", median)
	fmt.Fprintln(os.Stdout, "Min Submarine Pos", minPos)
	fmt.Fprintln(os.Stdout, "Max Submarine Pos", maxPos)
	fmt.Fprintln(os.Stdout, "Min Fuel Cost (Brute Force)", findLowestFuelCost(subs, minPos, maxPos, false))
	fmt.Fprintln(os.Stdout, "Min Fuel Cost (From Median)", getFuelCostNormal(subs, median))
	fmt.Fprintln(os.Stdout, "Min Fuel Cost (From Average)", getFuelCostNormal(subs, avg))
	fmt.Fprintln(os.Stdout, "Part2")
	fmt.Fprintln(os.Stdout, "Min Fuel Cost (Brute Force)", findLowestFuelCost(subs, minPos, maxPos, true))
	fmt.Fprintln(os.Stdout, "Min Fuel Cost (From Median)", getFuelCostGrowth(subs, median))
	fmt.Fprintln(os.Stdout, "Min Fuel Cost (From Average)", getFuelCostGrowth(subs, avg))
}

func parse() []CrabSubmarine {
	subs := make([]CrabSubmarine, 0)
	scanner := bufio.NewScanner(os.Stdin)

	for scanner.Scan() {
		text := scanner.Text()
		values := strings.Split(text, ",")

		for _, v := range values {
			xPos, err := strconv.Atoi(v)
			if err != nil {
				fmt.Fprintln(os.Stderr, "error parsing: invalid input", v)
			}
			subs = append(subs, CrabSubmarine{xPos})
		}
	}

	return subs
}

func computeAveragePosition(subs []CrabSubmarine) int {
	sum := 0
	for _, s := range subs {
		sum += s.xPos
	}
	avg := float64(sum) / float64(len(subs))
	return int(avg + 0.5)
}

func computeMedianPosition(subs []CrabSubmarine) int {
	posList := make([]int, 0)
	for _, s := range subs {
		posList = append(posList, s.xPos)
	}
	sort.Ints(posList)

	return posList[len(posList)/2]
}

func findMinMaxPositions(subs []CrabSubmarine) (int, int) {
	min := math.MaxInt
	max := math.MinInt

	for _, s := range subs {
		if s.xPos < min {
			min = s.xPos
		}
		if s.xPos > max {
			max = s.xPos
		}
	}

	return min, max
}

func getFuelCostNormal(subs []CrabSubmarine, targetPos int) int {
	fuel := 0

	for _, s := range subs {
		diff := s.xPos - targetPos
		if diff >= 0 {
			fuel += diff
		} else {
			fuel += -diff
		}
	}

	return fuel
}

func getFuelCostGrowth(subs []CrabSubmarine, targetPos int) int {
	fuel := 0

	for _, s := range subs {
		diff := s.xPos - targetPos
		if diff < 0 {
			diff = -diff
		}

		fuel += (diff * (diff + 1)) / 2
	}

	return fuel
}

func findLowestFuelCost(subs []CrabSubmarine, minPos int, maxPos int, expontentialFuelUsage bool) int {
	minFuelCost := math.MaxInt

	for pos := minPos; pos <= maxPos; pos++ {
		expectedFuelCost := 0
		if expontentialFuelUsage {
			expectedFuelCost = getFuelCostGrowth(subs, pos)
		} else {
			expectedFuelCost = getFuelCostNormal(subs, pos)
		}
		if expectedFuelCost < minFuelCost {
			minFuelCost = expectedFuelCost
		}
	}

	return minFuelCost
}
