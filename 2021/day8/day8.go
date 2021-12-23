package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"sort"
	"strings"
)

var UniqueDigitSegmentsToValue = map[int]int{2: 1, 4: 4, 3: 7, 7: 8}

type Entry struct {
	inputs       []string
	inputStrings map[string]int
	inputValues  map[int]string
	outputs      []string
}

func main() {
	entries := parse()
	initializeAllEntries(entries)
	fmt.Fprintln(os.Stdout, "Entry Count:", len(entries))
	fmt.Fprintln(os.Stdout, "Part1")
	fmt.Fprintln(os.Stdout, "Total Unique Output Digits", findUniqueOutputDigits(entries))
	fmt.Fprintln(os.Stdout, "Part2")
	fmt.Fprintln(os.Stdout, "Entry Output Summation", sumAllEntryOutputs(entries))
}

func parse() []Entry {
	entries := make([]Entry, 0)
	scanner := bufio.NewScanner(os.Stdin)

	for scanner.Scan() {
		text := scanner.Text()
		values := strings.Split(text, "|")

		if len(values) != 2 {
			fmt.Fprintln(os.Stderr, "error parsing: invalid input string", values)
		}

		inputs := strings.Fields(values[0])
		outputs := strings.Fields(values[1])

		inputsSorted := sortCharactersInStrings(inputs)
		outputsSorted := sortCharactersInStrings(outputs)

		entries = append(entries, Entry{inputsSorted, make(map[string]int), make(map[int]string), outputsSorted})
	}

	return entries
}

func sortCharactersInStrings(inputs []string) []string {
	sorted := make([]string, 0)
	for _, input := range inputs {
		s := []rune(input)
		sort.Slice(s, func(i int, j int) bool { return s[i] < s[j] })
		sorted = append(sorted, string(s))
	}
	return sorted
}

func findUniqueOutputDigits(entries []Entry) int {
	totalUniqueOutputs := 0
	for _, e := range entries {
		for _, o := range e.outputs {
			_, exists := UniqueDigitSegmentsToValue[len(o)]
			if exists {
				totalUniqueOutputs++
			}
		}
	}
	return totalUniqueOutputs
}

func sumAllEntryOutputs(entries []Entry) int {
	sum := 0
	for _, e := range entries {
		sum += e.computeOutputValue()
	}
	return sum
}

func initializeAllEntries(entries []Entry) {
	for _, e := range entries {
		e.initializeInputValuesAndStrings()
	}
}

func (entry Entry) computeOutputValue() int {
	total := 0
	for i := len(entry.outputs) - 1; i >= 0; i-- {
		digit := entry.outputs[i]
		value, exists := entry.inputStrings[digit]
		if !exists {
			fmt.Fprintln(os.Stderr, "error parsing: could not locate output value", digit)
		}
		total += value * int(math.Pow(10, float64(len(entry.outputs)-i-1)))
	}
	return total
}

func (entry Entry) initializeInputValuesAndStrings() {

	// set unique mappings
	for _, input := range entry.inputs {
		val, exists := UniqueDigitSegmentsToValue[len(input)]
		if exists {
			entry.inputValues[val] = input
			entry.inputStrings[input] = val
		}
	}

	if len(entry.inputStrings) != 4 {
		fmt.Fprintln(os.Stderr, "error parsing: could not locate all 4 unique segment patterns", entry.inputStrings)
	}

	// create character set from '4' segements without '1' segments
	upperLeftAndMiddleSegements := RemoveAllCharacters(entry.inputValues[4], entry.inputValues[1])

	// map remaining values by length and characteristics relative to other values
	for _, input := range entry.inputs {
		switch len(input) {
		case 5:
			val := 0
			if ContainsAllCharacters(input, entry.inputValues[1]) {
				val = 3
			} else if ContainsAllCharacters(input, upperLeftAndMiddleSegements) {
				val = 5
			} else {
				val = 2
			}
			entry.inputValues[val] = input
			entry.inputStrings[input] = val
		case 6:
			val := 9
			if !ContainsAllCharacters(input, upperLeftAndMiddleSegements) {
				val = 0
			} else if !ContainsAllCharacters(input, entry.inputValues[1]) {
				val = 6
			}
			entry.inputValues[val] = input
			entry.inputStrings[input] = val
		default:
			_, exists := entry.inputStrings[input]
			if !exists {
				fmt.Fprintln(os.Stderr, "error parsing: invalid entry input length", input)
			}
		}
	}

	if len(entry.inputStrings) != 10 || len(entry.inputValues) != 10 {
		fmt.Fprintln(os.Stderr, "error parsing: missing input values", entry)
	}
}

func RemoveAllCharacters(input string, chars string) string {
	for _, c := range chars {
		input = strings.ReplaceAll(input, string(c), "")
	}
	return input
}

func ContainsAllCharacters(input string, chars string) bool {
	for _, c := range chars {
		if !strings.ContainsAny(input, string(c)) {
			return false
		}
	}
	return true
}
