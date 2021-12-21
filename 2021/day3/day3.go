package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"strconv"
)

type Report struct {
	number string
}

func main() {
	report := parse()
	fmt.Fprintln(os.Stdout, "Part1")
	part1(report)
	fmt.Fprintln(os.Stdout, "Part2")
	part2(report)
}

func parse() []Report {
	input := make([]Report, 0)
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		line := scanner.Text()

		report := Report{line}
		input = append(input, report)
	}

	if len(input) == 0 {
		fmt.Fprintln(os.Stderr, "error parsing: invalid input", input)
	}

	return input
}

func part1(report []Report) {

	maxBits := len(report[0].number)
	oneBits := make([]int, maxBits)
	maxNumbers := len(report)

	for _, r := range report {
		for pos, c := range r.number {
			if c == '1' {
				oneBits[pos] += 1
			}
		}
	}

	gammaRate := 0
	epsilonRate := 0

	for pos, count := range oneBits {

		bitVal := math.Pow(2, float64(maxBits-pos-1))

		if count > (maxNumbers / 2) {
			gammaRate += int(bitVal)
		} else {
			epsilonRate += int(bitVal)
		}
	}

	fmt.Fprintln(os.Stdout, "GammaRate: ", gammaRate, "EpsilonRate: ", epsilonRate)
	fmt.Fprintln(os.Stdout, "Multiplied: ", gammaRate*epsilonRate)
}

func part2(report []Report) {

	maxBits := len(report[0].number)
	oxygenReports := report
	co2Reports := report

	for pos := 0; pos < maxBits; pos++ {

		fmt.Fprintln(os.Stdout, "OxygenReports: ", len(oxygenReports), "Co2Reports: ", len(co2Reports))

		if len(oxygenReports) > 1 {
			oneBitsInPos := getOneBitCountInPos(oxygenReports, pos)
			oxygenReports = filterReport(oxygenReports, pos, oneBitsInPos >= (len(oxygenReports)/2))
		}
		if len(co2Reports) > 1 {
			oneBitsInPos := getOneBitCountInPos(co2Reports, pos)
			co2Reports = filterReport(co2Reports, pos, !(oneBitsInPos >= (len(co2Reports) / 2)))
		}
	}

	if len(oxygenReports) != 1 || len(co2Reports) != 1 {
		fmt.Fprintln(os.Stderr, "error parsing: invalid reports", oxygenReports, co2Reports)
	}

	oxygenRating, err := strconv.ParseInt(oxygenReports[0].number, 2, 64)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error parsing: invalid report", oxygenReports)
	}

	co2Rating, err := strconv.ParseInt(co2Reports[0].number, 2, 64)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error parsing: invalid report", co2Reports)
	}

	fmt.Fprintln(os.Stdout, "OxygenRating: ", oxygenRating, "Co2Rating: ", co2Rating)
	fmt.Fprintln(os.Stdout, "Multiplied: ", oxygenRating*co2Rating)
}

func getOneBitCountInPos(report []Report, pos int) int {
	oneBits := 0

	for _, r := range report {
		if r.number[pos] == '1' {
			oneBits += 1
		}
	}

	return oneBits
}

func filterReport(report []Report, pos int, oneBitCheck bool) []Report {
	updatedReport := make([]Report, 0)
	for _, r := range report {
		if (oneBitCheck && r.number[pos] == '1') || (!oneBitCheck && r.number[pos] == '0') {
			updatedReport = append(updatedReport, r)
		}
	}

	return updatedReport
}
