package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Direction int

const (
	Forward Direction = 1
	Down    Direction = 2
	Up      Direction = 3
)

type Command struct {
	direction Direction
	distance  int
}

func main() {
	cmds := parse()
	fmt.Fprintln(os.Stdout, "Part1")
	part1(cmds)
	fmt.Fprintln(os.Stdout, "Part2")
	part2(cmds)
}

func parse() []Command {
	input := make([]Command, 10)
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		line := scanner.Text()
		params := strings.Fields(line)

		if len(params) != 2 {
			fmt.Fprintln(os.Stderr, "error parsing: invalid input", params)
			continue
		}

		dist, err := strconv.Atoi(params[1])

		if err != nil {
			fmt.Fprintln(os.Stderr, "error parsing: invalid input", params)
			continue
		}

		var dir Direction = 0
		switch params[0] {
		case "forward":
			dir = Forward
			break
		case "down":
			dir = Down
		case "up":
			dir = Up
		default:
			fmt.Fprintln(os.Stderr, "error parsing: invalid input", params)
			continue
		}

		cmd := Command{dir, dist}
		input = append(input, cmd)
	}

	return input
}

func part1(cmds []Command) {
	horizontal := 0
	depth := 0

	for _, c := range cmds {
		if c.direction == Forward {
			horizontal += c.distance
		} else if c.direction == Up {
			depth -= c.distance
		} else {
			depth += c.distance
		}
	}

	fmt.Fprintln(os.Stdout, "Horizontal: ", horizontal, "Depth: ", depth)
	fmt.Fprintln(os.Stdout, "Multiplied: ", horizontal*depth)
}

func part2(cmds []Command) {
	horizontal := 0
	depth := 0
	aim := 0

	for _, c := range cmds {
		if c.direction == Forward {
			horizontal += c.distance
			depth += c.distance * aim
		} else if c.direction == Up {
			aim -= c.distance
		} else {
			aim += c.distance
		}
	}

	fmt.Fprintln(os.Stdout, "Horizontal: ", horizontal, "Depth: ", depth)
	fmt.Fprintln(os.Stdout, "Multiplied: ", horizontal*depth)
}
