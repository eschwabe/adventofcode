# Day 2
# ID Scans

import fileinput

# load file
idList = []
with fileinput.input(files='day2-input.txt') as f:
    for line in f:
        #idList.append(sorted(line, reverse=True))
        idList.append(line)

twoLetters = 0
threeLetters = 0

# idList = [['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'i', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 't', 'u', 'u', 'v', 'w', 'y', 'z'],]

for id in idList:
    twoLetterFound = False
    threeLetterFound = False
    occurances = 0
    prev = '\0'
    for c in id:
        if c == prev:
            occurances += 1
        else:
            if occurances == 2 and not twoLetterFound:
                twoLetters += 1
                twoLetterFound = True
                #print("TwoLetterMatch: " + str(id))
            elif occurances == 3 and not threeLetterFound:
                threeLetters += 1
                threeLetterFound = True
                #print("ThreeLetterMatch: " + str(id))
            
            prev = c
            occurances = 1

print("TwoLetters: " + str(twoLetters))
print("ThreeLetters: " + str(threeLetters))


for pos1 in range(0, len(idList)):
    id1 = idList[pos1]
    for pos2 in range(pos1+1, len(idList)):
        id2 = idList[pos2]
        diffCount = 0
        for c1, c2 in zip(id1, id2):
            if c1 != c2:
                diffCount += 1
        if diffCount == 1:
            print("ID1: " + ''.join(id1))
            print ("ID2: " + ''.join(id2))
