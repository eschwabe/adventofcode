# Day 2
# ID Scans

import fileinput

class Claim():
    def __init__(self, index, xPos, yPos, xLen, yLen):
        self.index = index
        self.xPos = xPos
        self.yPos = yPos
        self.xLen = xLen
        self.yLen = yLen
        self.xMax = xPos+xLen
        self.yMax = yPos+yLen

# load file
claimList = []
with fileinput.input(files='day3-input.txt') as f:
    for line in f:
        tokens = line.split()
        index = tokens[0].replace('#','')
        pos = tokens[2].replace(':', '').split(',')
        size = tokens[3].split('x')
        claimList.append(
            Claim(int(index), int(pos[0]), int(pos[1]), int(size[0]), int(size[1]))
        )

# find max claim size
xPosMax = 0
yPosMax = 0
for claim in claimList:
    xPosMax = max(claim.xMax, xPosMax)
    yPosMax = max(claim.yMax, yPosMax)

print("xMax: {0}, yMax: {1}".format(xPosMax, yPosMax))

# mark all claimed spots
claimedTwiceOrMore = 0
grid = [[0 for y in range(yPosMax)] for x in range(xPosMax)]

for claim in claimList:
    for x in range(claim.xPos, claim.xMax):
        for y in range(claim.yPos, claim.yMax):
            grid[x][y] = grid[x][y]+1
            if grid[x][y] == 2:
                claimedTwiceOrMore = claimedTwiceOrMore+1

print("claimedTwice: {0}".format(claimedTwiceOrMore))

for claim in claimList:
    anyOverlap = False
    for x in range(claim.xPos, claim.xMax):
        for y in range(claim.yPos, claim.yMax):
            if grid[x][y] > 1:
                anyOverlap = True
    if anyOverlap == False:
        print("No Overlap Claim: {0}".format(claim.index))
