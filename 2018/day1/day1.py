# Day 1
# Frequency

import fileinput

# load file
nums = []
with fileinput.input(files='day1-input.txt') as f:
    for line in f:
        nums.append(int(line))

# compute totals
sum = 0
totals = set()

found = False
while not found:
    for n in nums:
        sum += n
        print(sum)
        if sum in totals:
            print("Repeated Total: " + str(sum))
            found = True
            break
        totals.add(sum)

print("No repeats")
