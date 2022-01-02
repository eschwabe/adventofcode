package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
)

type NavigationLine struct {
	input   string
	score   int
	corrupt bool
}

var chunkMap = map[byte]byte{
	'[': ']',
	'(': ')',
	'{': '}',
	'<': '>'}

var chunkCloserScoreMap = map[byte]int{
	')': 3,
	']': 57,
	'}': 1197,
	'>': 25137}

var chunkCloserCompletionScoreMap = map[byte]int{
	')': 1,
	']': 2,
	'}': 3,
	'>': 4}

const completionMultiplier = 5

func main() {
	navLines := parse()
	fmt.Fprintln(os.Stdout, "NavLines Count:", len(navLines))
	fmt.Fprintln(os.Stdout, "Part1")
	corruptScore, corruptCount := getLinesScore(navLines, true)
	fmt.Fprintln(os.Stdout, "Corrupt NavLines Count:", corruptCount)
	fmt.Fprintln(os.Stdout, "Corrupt NavLines Score:", corruptScore)
	fmt.Fprintln(os.Stdout, "Part2")
	completionScore, completionCount := getLinesScore(navLines, false)
	fmt.Fprintln(os.Stdout, "Completion NavLines Count:", completionCount)
	fmt.Fprintln(os.Stdout, "Completion NavLines Score:", completionScore)
	fmt.Fprintln(os.Stdout, "Completion NavLines Median Score:", getMedianScore(navLines, false))
}

func parse() []NavigationLine {
	scanner := bufio.NewScanner(os.Stdin)
	navLines := make([]NavigationLine, 0)

	for scanner.Scan() {
		text := scanner.Text()
		navLines = append(navLines, generateNavLine(text))
	}

	return navLines
}

func getLinesScore(navLines []NavigationLine, corrupt bool) (int, int) {
	totalScore := 0
	corruptCount := 0
	for _, navLine := range navLines {
		if navLine.corrupt == corrupt {
			totalScore += navLine.score
			corruptCount++
		}
	}
	return totalScore, corruptCount
}

func getMedianScore(navLines []NavigationLine, corrupt bool) int {
	scores := make([]int, 0)
	for _, navLine := range navLines {
		if navLine.corrupt == corrupt {
			scores = append(scores, navLine.score)
		}
	}
	sort.Ints(scores)
	return scores[len(scores)/2]
}

func generateNavLine(input string) NavigationLine {
	stack := make([]byte, 0)
	navLine := NavigationLine{input, 0, false}
	for pos, c := range input {
		closer, exists := chunkMap[byte(c)]
		score, reverseExists := chunkCloserScoreMap[byte(c)]
		if exists {
			stack = append(stack, closer)
		} else if reverseExists {
			if len(stack) > 0 && stack[len(stack)-1] == byte(c) {
				stack = stack[:len(stack)-1]
			} else {
				navLine.corrupt = true
				navLine.score = score
				fmt.Fprintln(os.Stdout, "Corrupt Stack:", string(stack))
				fmt.Fprintln(os.Stdout, "Corrupt Line:", navLine, pos)
				break
			}
		} else {
			// ignore other characters
		}
	}

	if !navLine.corrupt {
		completionScore := 0
		for len(stack) > 0 {
			closer := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			score, exists := chunkCloserCompletionScoreMap[closer]
			if exists {
				completionScore *= completionMultiplier
				completionScore += score
			} else {
				fmt.Fprintln(os.Stderr, "Unknown Stack Entry:", closer, stack)
			}
		}
		navLine.score = completionScore
	}

	return navLine
}
