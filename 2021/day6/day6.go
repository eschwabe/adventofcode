package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const FishRemainingDaysNew = 8
const FishRemainingDaysDefault = 6
const SimulationDaysPart1 = 80
const SimulationDaysPart2 = 256

type LaternFish struct {
	remainingDays int
}

func main() {
	fishes := parse()
	fmt.Fprintln(os.Stdout, "Part1")
	runSimulationBasic(fishes, SimulationDaysPart1)
	runSimulationEfficient(fishes, SimulationDaysPart1)
	fmt.Fprintln(os.Stdout, "Part2")
	runSimulationEfficient(fishes, SimulationDaysPart2)
}

func parse() []LaternFish {
	fish := make([]LaternFish, 0)
	scanner := bufio.NewScanner(os.Stdin)

	for scanner.Scan() {
		text := scanner.Text()
		values := strings.Split(text, ",")

		for _, v := range values {
			days, err := strconv.Atoi(v)
			if err != nil {
				fmt.Fprintln(os.Stderr, "error parsing: invalid input", v)
			}
			fish = append(fish, LaternFish{days})
		}
	}

	return fish
}

func (fish *LaternFish) simulate() bool {
	fish.remainingDays--

	if fish.remainingDays < 0 {
		fish.remainingDays = FishRemainingDaysDefault
		return true
	}

	return false
}

func runSimulationBasic(fishesOrig []LaternFish, simulationDays int) {

	fmt.Fprintln(os.Stdout, "LaternFishStartCount:", len(fishesOrig))

	fishes := make([]LaternFish, 0)
	for _, f := range fishesOrig {
		fishes = append(fishes, LaternFish{f.remainingDays})
	}

	for day := 0; day < simulationDays; day++ {
		newFishCount := 0
		for i := 0; i < len(fishes); i++ {
			if fishes[i].simulate() {
				newFishCount++
			}
		}
		for i := 0; i < newFishCount; i++ {
			fishes = append(fishes, LaternFish{FishRemainingDaysNew})
		}
	}

	fmt.Fprintln(os.Stdout, "LaternFishCount:", len(fishes))
}

func runSimulationEfficient(fishes []LaternFish, simulationDays int) {

	fmt.Fprintln(os.Stdout, "LaternFishStartCount:", len(fishes))

	newFishCount := make([]int, simulationDays+1)

	newFishCount[0] = len(fishes)
	for _, f := range fishes {
		newFishCount[f.remainingDays+1]++
	}

	for day := 1; day <= simulationDays; day++ {

		// spawn new fish
		if day+FishRemainingDaysNew+1 <= simulationDays {
			newFishCount[day+FishRemainingDaysNew+1] += newFishCount[day]
		}

		// set next spawning cycle
		if day+FishRemainingDaysDefault+1 <= simulationDays {
			newFishCount[day+FishRemainingDaysDefault+1] += newFishCount[day]
		}
	}

	fishCount := 0
	for day := 0; day <= simulationDays; day++ {
		fishCount += newFishCount[day]
	}

	fmt.Fprintln(os.Stdout, "Simulation:", newFishCount)
	fmt.Fprintln(os.Stdout, "LaternFishCount:", fishCount)
}
