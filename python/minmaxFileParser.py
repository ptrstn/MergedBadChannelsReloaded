import json
import sys
import os.path

thePath = "/data/users/event_display/Data2017/Beam/302/302036/StreamExpress/"
stripFile = "TopModulesList.log"
pixelFile = "minmax.out"

characteristics = "NumberOfCluster-max/NumberOfOfffTrackCluster-max/size-max"
filterDetID = -1 #304201732 #470111813

##############################################################################

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

##############################################################################

stripModulesDic = {}
pixelModulesDic = {}
currentKey = ""

# BUILD STRIP DICTIONARY

if os.path.exists(thePath + stripFile):
	with open(thePath + stripFile, "r") as file:

		detID = -1
		val = 0

		for line in file:
			line = line.strip()
			if line.startswith("-"):
				continue
			if line.startswith("top"): 	#NEW SET OF TOP MODULES
				if currentKey != "" and currentKey in characteristics:
					stripModulesDic.update({("!MAX " + currentKey) : val})

				lineSpl = line.split()
				currentKey = lineSpl[-1]

				detID = -1
				val = 0

			elif currentKey in characteristics:
				lineSpl = line.split()
				currDetID = int(lineSpl[2])
				currVal = float(lineSpl[-1])

				if filterDetID == -1:					# perform filtering in this stage
					if detID != -1:
						if val < currVal:
							detID = currDetID
							val = currVal
					else:
						detID = currDetID
						val = currVal
				elif currDetID == filterDetID:
					detID = currDetID
					val = currVal

		if currentKey in characteristics:
			stripModulesDic.update({("!MAX " + currentKey) : val})

# for key in stripModulesDic:
# 	print(key)
# 	print(stripModulesDic[key])

#####################################################################

currentKey = ""
currentSubkey = ""

# BUILD PIXEL DICTIONARY

if os.path.exists(thePath + pixelFile):
	with open(thePath + pixelFile, "r") as file:

		detID = -1
		val = 0

		for line in file:
			line = line.strip()
			if len(line) == 0:
				continue
			lineSpl = line.split()

			if len(lineSpl) == 1:
				if currentKey != "" and currentKey in characteristics and currentSubkey in characteristics[currentKey]:
					pixelModulesDic.update({("!" + currentSubkey + " " + currentKey) : val})
				detID = -1
				val = 0

				if ":" not in lineSpl[0]:
					currentKey = lineSpl[0]
				else:
					currentSubkey = lineSpl[0][0:-1]

			elif currentKey in characteristics and currentSubkey in characteristics[currentKey]:
				currDetID = int(lineSpl[0])
				currVal = float(lineSpl[-1])
				if filterDetID == -1:
					if detID != -1:
						if (currentSubkey == "MAX" and val < currVal) or (currentSubkey == "MIN" and val > currVal):
							detID = currDetID
							val = currVal
					else:
						detID = currDetID
						val = currVal
				else:
					if currDetID == filterDetID:
						detID = currDetID
						val = currVal

		if currentKey in characteristics and currentSubkey in characteristics[currentKey]:
			pixelModulesDic.update({("!" + currentSubkey + " " + currentKey) : val})

dataDic = {"STR" : stripModulesDic, "PX" : pixelModulesDic}
dataDicJSON = json.dumps(dataDic)

print(dataDicJSON)