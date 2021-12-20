package main
import (
  "bufio"
  "fmt"
  "os"
  "strconv"
)

func main() {
  //part1()
  part2()
}

func part1() {
    scanner := bufio.NewScanner(os.Stdin)
    var prev int = -1
    increase_count := 0
    for scanner.Scan() {
      line := scanner.Text()    
      //fmt.Println(line)
      val, err := strconv.Atoi(line)
      if err != nil {
        fmt.Fprintln(os.Stderr, "error parsing", err)
      }

      if prev != -1 && val > prev {
        increase_count++
      }

      prev = val
    }
    if err := scanner.Err(); err != nil {
        fmt.Fprintln(os.Stderr, "reading stdin:", err)
    } else {
      fmt.Fprintln(os.Stdout, "increase count:", increase_count)
    }
}

func part2() {
    scanner := bufio.NewScanner(os.Stdin)
    var prev int = -1
    s := make([]int, 0)
    increase_count := 0
    for scanner.Scan() {
      line := scanner.Text()    
      //fmt.Println(line)
      val, err := strconv.Atoi(line)
      if err != nil {
        fmt.Fprintln(os.Stderr, "error parsing", err)
      }

      s = append(s, val)

      sum := 0

      if len(s) < 3 {
        continue
      }

      for i := len(s)-1; i >= len(s)-3; i-- {
        sum += s[i]
      }
     
      if prev != -1 && sum > prev {
        increase_count++
      }

      prev = sum
    }
    if err := scanner.Err(); err != nil {
        fmt.Fprintln(os.Stderr, "reading stdin:", err)
    } else {
      fmt.Fprintln(os.Stdout, "increase count:", increase_count)
    }
}
