import json
import sys
from copy import deepcopy
import os.path

thePath = "/data/users/event_display/Data2017/Beam/302/302036/StreamExpress/"
stripFile = "TopModulesList.log"
pixelFile = "minmax.out"

characteristics = "NumberOfCluster-max/NumberOfOfffTrackCluster-max/size-max"
filterDetID = -1 #304201732 #470111813

if len(sys.argv) > 1:
	thePath = sys.argv[1]
	characteristics = sys.argv[2]
	filterDetID = int(sys.argv[3])

tmp = characteristics.split("/")
characteristics = {}
for ch in tmp:

	if len(ch) == 0:
		continue

	chSpl = ch.split("-")

	if chSpl[0] in characteristics:
		characteristics[chSpl[0]].append(chSpl[1].upper())
	else:
		characteristics.update({ chSpl[0] : [chSpl[1].upper()] })

# BUILD STRIP DICTIONARY

modValDic = {}
stripModulesDic = {}
pixelModulesDic = {}
currentKey = ""

if os.path.exists(thePath + stripFile):
	with open(thePath + stripFile, "r") as file:
		for line in file:
			line = line.strip()
			if line.startswith("-"):
				continue
			if line.startswith("top"): 	#NEW SET OF TOP MODULES
				lineSpl = line.split()
				newKey = lineSpl[-1]
				if currentKey != "" and currentKey in characteristics:
					stripModulesDic.update({currentKey : deepcopy(modValDic)})
				modValDic = {}
				currentKey = newKey

			else:
				lineSpl = line.split()
				detID = int(lineSpl[2])
				val = float(lineSpl[-1])
				modValDic.update({detID : val})

		if currentKey in characteristics:
			stripModulesDic.update({currentKey : deepcopy(modValDic)})


# for key in stripModulesDic:
# 	print(key)
# 	print(stripModulesDic[key])

### FILTER
stripModulesDicFiltered = {}
for key in stripModulesDic:
	keyOfInterest = -1
	if filterDetID == -1:
		keyOfInterest = max(stripModulesDic[key].iterkeys(), key=(lambda x: stripModulesDic[key][x]) )
		# print(keyOfInterest)
	else:
		if filterDetID in stripModulesDic[key]:
			keyOfInterest = filterDetID

	stripModulesDicFiltered.update({ ("!MAX " + key) : stripModulesDic[key][keyOfInterest] if keyOfInterest != -1 else 0 })

# print(stripModulesDicFiltered)

#####################################################################

currentKey = ""
currentSubkey = ""

if os.path.exists(thePath + pixelFile):
	with open(thePath + pixelFile, "r") as file:
		for line in file:
			line = line.strip()
			if len(line) == 0:
				continue
			lineSpl = line.split()

			if len(lineSpl) == 1:
				if ":" not in lineSpl[0]:
					if currentKey != "" and currentKey in characteristics:
						pixelModulesDic.update({currentKey : deepcopy(modValDic)})
					modValDic = {}
					currentKey = lineSpl[0]
				else:
					currentSubkey = lineSpl[0][0:-1]
					if currentKey in characteristics and currentSubkey in characteristics[currentKey]:
						modValDic.update({currentSubkey : {}})
			else:
				if currentKey in characteristics and currentSubkey in characteristics[currentKey]:
					detID = int(lineSpl[0])
					val = float(lineSpl[-1])
					modValDic[currentSubkey].update({detID : val})

		if currentKey in characteristics and currentSubkey in characteristics[currentKey]:
			pixelModulesDic.update({currentKey : deepcopy(modValDic)})

### FILTER
pixelModulesDicFiltered = {}
for key in pixelModulesDic:
	for minmax in pixelModulesDic[key]:
		keyOfInterest = -1
		if filterDetID == -1:
			if minmax == "MIN":
				keyOfInterest = min(pixelModulesDic[key][minmax].iterkeys(), key=(lambda x: pixelModulesDic[key][minmax][x]))
				# print(keyOfInterest)
			else:
				keyOfInterest = max(pixelModulesDic[key][minmax].iterkeys(), key=(lambda x: pixelModulesDic[key][minmax][x]))
				# print(keyOfInterest)
		else:
			if filterDetID in pixelModulesDic[key][minmax]:
				keyOfInterest = filterDetID

		pixelModulesDicFiltered.update({ ("!" + minmax + " " + key) : pixelModulesDic[key][minmax][keyOfInterest] if keyOfInterest != -1 else 0 })

# print(pixelModulesDicFiltered)

# for key in pixelModulesDic:
# 	print(key)
# 	print(pixelModulesDic[key])

# print(len(pixelModulesDic))

dataDic = {"STR" : stripModulesDicFiltered, "PX" : pixelModulesDicFiltered}
dataDicJSON = json.dumps(dataDic)

print(dataDicJSON)
