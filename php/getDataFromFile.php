<?php

function getStripDataFromFile($filename, $currentDictionary, $runNumber, $modulesToMonitor, $options)
{
	// DID USER CHOOSE TO LOOK FOR STRIP PLOTS AT ALL
	if (($modulesToMonitor & ((1 << 39) - 1)) && ($options & ((1 << 4) - 1)))
	{
		$handle = fopen($filename, "r");

		if ($handle) {
			$i = 0;

			// $runNumber = intval(substr($filename, -10, 6));
			// echo $runNumber."\n\n".$options."\n";
		    while (($line = fgets($handle)) !== false && $i < 39) 
		    {
		    	if (substr($line, 0, 1) === "T")
		    	{
		    		$line = trim($line);

		    		$components = explode(":", $line);

		    		$elemName = trim($components[0]);

		    		if ($modulesToMonitor & (1 << (38 - $i)))
		    		{
		    			// echo $elemName."\n";

		    			$badElements;
		    			preg_match_all('!\d+!', trim($components[1]), $badElements);

		    			// var_dump($badElements);
		    			$valArr = array();
		    			for ($j = 0; $j < sizeof($badElements[0]); $j++)
		    			{
		    				if ($options & (1 << (3 - $j)))
		    				{
		    					array_push($valArr, intval($badElements[0][$j]));
		    				}else{
		    					array_push($valArr, -1);
		    				}
		    			}
		    			// var_dump($valArr);

		    			if ($elemName == "Tracker")
		    			{
		    				$elemName = "Strip";
		    			}
	    				$currentDictionary["STR"][$elemName][$runNumber] = $valArr;

		    		}
			    	$i++;
		    	}
		    }

		    fclose($handle);
		} 
		else {
		    echo "The file: ".$filename." does not exist!";
		}
	}

 
	return $currentDictionary;
}

function getPixelInefficiencyAndNoisynessFromFile($filename, $currentDictionary, $runNumber, $modulesToMonitor, $options, $pixelConnectionDic, $inefficiencyPass)
{
	if (($options >> 7) && ($modulesToMonitor >> 42)) // DID USER CHOOSE TO LOOK FOR PIXEL PLOTS AT ALL
	{
		$handle = fopen($filename, "r");
		if ($handle)
		{
			$moduleListenMode = true;
			$elemName = "";

			$moduleValueDic = array();

			while (($line = fgets($handle)) !== false)
			{
				$line = trim($line);
				if (strlen($line) == 0 || $line[0] == "B" || $line[0] == "F") continue;

				if ($moduleListenMode)
				{
					$components =  preg_split("/[\s,]+/", $line);

					$elemName = trim($components[1]);

					// if (we need to monitor this object)
					$moduleListenMode = false;
				}
				else
				{
					$val = explode(":", $line);
					$val = intval(trim($val[1]));

					// echo $elemName."xxx\n";
					// echo $pixelConnectionDic[$elemName][1]."\n";

					if ($modulesToMonitor & (1 << $pixelConnectionDic[$elemName][1]) ||
						($pixelConnectionDic[$elemName][1] <= 53 && $pixelConnectionDic[$elemName][1] >= 48 && $modulesToMonitor & (1 << ($pixelConnectionDic[$elemName][1] - 6)))) //RING 1 AND 2 COMBINED
					{
						// echo $modulesToMonitor;
						// if(!array_key_exists($pixelConnectionDic[$elemName][0], $currentDictionary["PX"]))
						if (!$currentDictionary["PX"][$pixelConnectionDic[$elemName][0]][$runNumber])
						{
							if ($inefficiencyPass)
								$currentDictionary["PX"][$pixelConnectionDic[$elemName][0]][$runNumber] =  array(-1, -1, -1, -1);
							else
								$currentDictionary["PX"][$pixelConnectionDic[$elemName][0]][$runNumber] =  array(-1, -1, -1, -1, -1);

						}
						// echo $val."\n";
						// var_dump($currentDictionary["PX"][$pixelConnectionDic[$elemName][0]][$runNumber]);
						if ($inefficiencyPass)
						{
							if (($options >> 7) & 1)
								array_push($currentDictionary["PX"][$pixelConnectionDic[$elemName][0]][$runNumber], $val);
							else
								array_push($currentDictionary["PX"][$pixelConnectionDic[$elemName][0]][$runNumber], -1);
						}
						else
						{
							if (($options >> 8) & 1)
								array_push($currentDictionary["PX"][$pixelConnectionDic[$elemName][0]][$runNumber], $val);
							else
								array_push($currentDictionary["PX"][$pixelConnectionDic[$elemName][0]][$runNumber], -1);
						}
						// var_dump($currentDictionary["PX"][$pixelConnectionDic[$elemName][0]][$runNumber]);
						// $vals = $currentDictionary["PX"][$pixelConnectionDic[$elemName][0]][$runNumber];				
					}

					// $moduleValueDic[$elemName] = $val;

					$moduleListenMode = true;


				}

			}
		}
		else {
		    echo "The file: ".$filename." does not exist!";
		}
	}
	return $currentDictionary;
}

function getPixelDataFromFile($filename, $currentDictionary, $runNumber, $modulesToMonitor, $options, $pixelConnectionDic)
{
	if (($options >> 4) && ($modulesToMonitor >> 42)) // DID USER CHOOSE TO LOOK FOR PIXEL PLOTS AT ALL
	{
		$handle = fopen($filename, "r");
		$totIdx = 0;

		if($handle)
		{
			while (($line = fgets($handle)) !== false) 
			{
				if (substr($line, 0, 1) !== "#" && substr($line, 0, 3) !== "DQM")
				{
					$line = trim($line);
					if (strlen($line) == 0) continue;

					$components =  preg_split("/[\s,]+/", $line);

					$elemName = trim($components[1]);
					$elemName = trim($elemName, ":"); //maintain compatibility between old and new versions of the file
					// echo $elemName."\n";
					// echo trim($elemName, ":")."\n";

					if ($elemName == "tot")
					{
						$elemName = $elemName.$totIdx;
						$totIdx++;
					}
					
					if ($modulesToMonitor & (1 << $pixelConnectionDic[$elemName][1]))
					{
						// echo sizeof($components)."\n";
						// var_dump($components);

						$valArr = array();

						if ($elemName == "of") // SPECIAL HANDLING OF #OFCLUSTERS
						{
							$valArr = array(-1, -1, -1, doubleval($components[3]));
							//$elemName = "Pixel";
						}

						else
						{
							for ($i = 2; $i < sizeof($components); $i++)
							{
								if ( ($options >> 4) & (1 << (2 - ($i - 2))) )
								{
									array_push($valArr, doubleval($components[$i]));
								}else{
		    						array_push($valArr, -1);
		    					}
							}
							array_push($valArr, -1); // to make the length of this array equal in all DeadROCs cases
						}
						
						$rubbish = true;
						foreach ($valArr as $val)
						{
							if ($val != -1)
							{
								$rubbish = false;
								break;
							}
						}

						// var_dump($valArr);
						if (!$rubbish){
							$currentDictionary["PX"][$pixelConnectionDic[$elemName][0]][$runNumber] = $valArr;
						}
						
					}
				}
			}

			fclose($handle);
		}
		else {
		    echo "The file: ".$filename." does not exist!";
		} 
	}

	return $currentDictionary;
}

function getMinMaxDataFromFile($thePath, $currentDictionary, $runNumber, $minmaxOptionStr, $minmaxDetIDFilter)
{
	$command = "python ../python/minmaxFileParser.py $thePath $minmaxOptionStr $minmaxDetIDFilter";

	$commandOutput = shell_exec($command);
	$commandOutput = json_decode($commandOutput, true); #SO NOW WE HAVE THE DICTIONARY MADE IN PYTHON

	// var_dump($commandOutput);

	foreach ($commandOutput as $det => $characteristics)
	{
		foreach($characteristics as $name => $val)
		{
			$currentDictionary[$det][$name][$runNumber] = $val;
		}
		// $currentDictionary[$det]["ABC"][$runNumber] = 2;
		// echo $det."\n";
	}

	return $currentDictionary;
}

function getUsfulJSON($dbJSON)
{
	// echo $dbJSON;

	$commandOutput = str_replace("u'data'", "\"data\"", $dbJSON);
	// echo $commandOutput;

	// CLEAN STRING

	// This will remove unwanted characters.
	// Check http://www.php.net/chr for details

	$commandOutput = str_replace("None", 0, $commandOutput);

	for ($i = 0; $i <= 31; ++$i) { 
	    $commandOutput = str_replace(chr($i), "", $commandOutput); 
	}
	$commandOutput = str_replace(chr(127), "", $commandOutput);

	// This is the most common part
	// Some file begins with 'efbbbf' to mark the beginning of the file. (binary level)
	// here we detect it and we remove it, basically it's the first 3 characters 
	if (0 === strpos(bin2hex($commandOutput), 'efbbbf')) {
	   $commandOutput = substr($commandOutput, 3);
	}

	// !!!CLEAN STRING


	$commandOutput = json_decode($commandOutput, true);
	// echo "\n\n".var_dump($commandOutput)."\n\n";
	// echo gettype($commandOutput);
	
	switch (json_last_error()) {
        case JSON_ERROR_NONE:
            // echo ' - No errors\n';
        break;
        case JSON_ERROR_DEPTH:
            echo ' - Maximum stack depth exceeded\n';
        break;
        case JSON_ERROR_STATE_MISMATCH:
            echo ' - Underflow or the modes mismatch\n';
        break;
        case JSON_ERROR_CTRL_CHAR:
            echo ' - Unexpected control character found\n';
        break;
        case JSON_ERROR_SYNTAX:
            echo ' - Syntax error, malformed JSON\n';
        break;
        case JSON_ERROR_UTF8:
            echo ' - Malformed UTF-8 characters, possibly incorrectly encoded\n';
        break;
        default:
            echo ' - Unknown error\n';
        break;
    }
    // echo "\n\n";

    return $commandOutput;
}

function getMaxYear(){
	$command = "python ../python/rhapi.py \"select max(r.starttime) as maxDate from runreg_tracker.runs r where r.runnumber > 300000\" --all -f json";

	$commandOutput = shell_exec($command);


	$commandOutput = str_replace("u", "", $commandOutput);
	$commandOutput = str_replace("'", "\"", $commandOutput);

	$commandOutput = json_decode($commandOutput, true);

	return intval($commandOutput["data"][0][0]);
}


//look
function traverseDirectories($query, $modulesToMonitor, $options,
							 		 $minmaxOptionStr, $minmaxDetIDFilter,
							 		 $beamDataOn)
{
	$dataDic = array(
					"STR" => array(),
					"PX" => array());

	$runDic = array();

	$BASEPATH = "/data/users/event_display/";

	$YEARLOW = 2016;
	$YEARHIGH = getMaxYear();

	$searchingYearStart = $YEARLOW;

	$COMMANDBASE = "python ../python/rhapi.py \"select r.runnumber, r.duration from runreg_tracker.runs r ";
	$COMMANDAPPENDIX = "\" --all -f json";

	$currCommand = $COMMANDBASE.$query.$COMMANDAPPENDIX;
	// echo $currCommand."\n";
	$commandOutput = getUsfulJSON(shell_exec($currCommand));


	// echo "This DB Data:\n".var_dump($commandOutput);
	// echo json_encode($commandOutput);
	// return;

	$pixelConnectionDic = array(
						"L1" => array("Barrel Layer 1", 58),
						"L2" => array("Barrel Layer 2", 57),
						"L3" => array("Barrel Layer 3", 56),
						"L4" => array("Barrel Layer 4", 55),
						"tot0" => array("Barrel Total", 59),

						"R1DM3" => array("Ring 1 Disk- 3", 51),
						"R1DM2" => array("Ring 1 Disk- 2", 52),
						"R1DM1" => array("Ring 1 Disk- 1", 53),

						"R1DP1" => array("Ring 1 Disk 1", 50),
						"R1DP2" => array("Ring 1 Disk 2", 49),
						"R1DP3" => array("Ring 1 Disk 3", 48),

						"R2DM3" => array("Ring 2 Disk- 3", 45),
						"R2DM2" => array("Ring 2 Disk- 2", 46),
						"R2DM1" => array("Ring 2 Disk- 1", 47),

						"R2DP1" => array("Ring 2 Disk 1", 44),
						"R2DP2" => array("Ring 2 Disk 2", 43),
						"R2DP3" => array("Ring 2 Disk 3", 42),

						"tot1" => array("Endcap Total", 54),

						"of" => array("Pixel", 60),
						);
	$pixelConnectionDicForInefficiencyAndNoisyness = array(
						"B1" => array("Barrel Layer 1", 58),
						"B2" => array("Barrel Layer 2", 57),
						"B3" => array("Barrel Layer 3", 56),
						"B4" => array("Barrel Layer 4", 55),
						// "tot0" => array("Barrel Total", 59),

						"F-3" => array("Disk- 3", 51),
						"F-2" => array("Disk- 2", 52),
						"F-1" => array("Disk- 1", 53),

						"F1" => array("Disk 1", 50),
						"F2" => array("Disk 2", 49),
						"F3" => array("Disk 3", 48),

						// "F-3" => array("Ring 2 Disk- 3", 45),
						// "F-2" => array("Ring 2 Disk- 2", 46),
						// "F-1" => array("Ring 2 Disk- 1", 47),

						// "F1" => array("Ring 2 Disk 1", 44),
						// "F2" => array("Ring 2 Disk 2", 43),
						// "F3" => array("Ring 2 Disk 3", 42),

						// "tot1" => array("Endcap Total", 54),

						// "of" => array("Pixel", 60),
						);

	$pixelInefficientDColsFile = "inefficientDPixelColumns.txt";
	$pixelNoisyColumnsFile = "noisyPixelColumns.txt";

	foreach ($commandOutput["data"] as $run)
	{

		//DB STUFF DEPNDENT
		$runNum = $run[0];
		$runLength = ceil($run[1] / 1000.0);
		$lumiLength = 2;
		// echo $runNum."\t".$runLength."\n";

		////////////////////

		$runHigh = intval($runNum / 1000);

		for ($year = $searchingYearStart; $year <= $YEARHIGH; $year++)
		{
			$stripFile = "MergedBadComponents_run".$runNum.".txt";
			$pixelMainFile = "PixZeroOccROCs_run".$runNum.".txt";

			if ($beamDataOn)
			{
				$currPath = $BASEPATH."Data".$year."/Beam/".$runHigh."/".$runNum."/StreamExpress/";
			
				// echo $currPath."\n";

				if (file_exists($currPath))
				{
					// echo $currPath."\n";
					if (file_exists($currPath.$stripFile))
						$dataDic = getStripDataFromFile($currPath.$stripFile, $dataDic, $runNum, $modulesToMonitor, $options);

					if (file_exists($currPath.$pixelMainFile))
						$dataDic = getPixelDataFromFile($currPath.$pixelMainFile, $dataDic, $runNum, $modulesToMonitor, $options, $pixelConnectionDic);

					if (file_exists($currPath.$pixelInefficientDColsFile))
						$dataDic = getPixelInefficiencyAndNoisynessFromFile($currPath.$pixelInefficientDColsFile, $dataDic, $runNum, $modulesToMonitor, $options, $pixelConnectionDicForInefficiencyAndNoisyness, true);

					if (file_exists($currPath.$pixelNoisyColumnsFile))
						$dataDic = getPixelInefficiencyAndNoisynessFromFile($currPath.$pixelNoisyColumnsFile, $dataDic, $runNum, $modulesToMonitor, $options, $pixelConnectionDicForInefficiencyAndNoisyness, false);

					#MINMAX TREND DATA
					if ($minmaxOptionStr !== "")
						$dataDic = getMinMaxDataFromFile($currPath, $dataDic, $runNum, $minmaxOptionStr, $minmaxDetIDFilter);

					$searchingYearStart = $year;

					$runDic[$runNum] = array(
									"runLength" => $runLength, 
									"lumiLength" => $lumiLength, 
									"lbs" => ceil(floatval($runLength) / floatval($lumiLength)));
				}
			}
			else
			{
				$currPath = $BASEPATH."Data".$year."/Cosmics/".$runHigh."/".$runNum."/StreamExpressCosmics/";
				
				if (file_exists($currPath))
				{
					// echo $currPath."\n";
					if (file_exists($currPath.$stripFile))
						$dataDic = getStripDataFromFile($currPath.$stripFile, $dataDic, $runNum, $modulesToMonitor, $options);

					if (file_exists($currPath.$pixelMainFile))
						$dataDic = getPixelDataFromFile($currPath.$pixelMainFile, $dataDic, $runNum, $modulesToMonitor, $options, $pixelConnectionDic);

					if (file_exists($currPath.$pixelInefficientDColsFile))
						$dataDic = getPixelInefficiencyAndNoisynessFromFile($currPath.$pixelInefficientDColsFile, $dataDic, $runNum, $modulesToMonitor, $options, $pixelConnectionDicForInefficiencyAndNoisyness, true);

					if (file_exists($currPath.$pixelNoisyColumnsFile))
						$dataDic = getPixelInefficiencyAndNoisynessFromFile($currPath.$pixelNoisyColumnsFile, $dataDic, $runNum, $modulesToMonitor, $options, $pixelConnectionDicForInefficiencyAndNoisyness, false);

					#MINMAX TREND DATA
					if ($minmaxOptionStr !== "")
						$dataDic = getMinMaxDataFromFile($currPath, $dataDic, $runNum, $minmaxOptionStr, $minmaxDetIDFilter);

					$searchingYearStart = $year;

					$runDic[$runNum] = array(
									"runLength" => $runLength, 
									"lumiLength" => $lumiLength, 
									"lbs" => ceil(floatval($runLength) / floatval($lumiLength)));
				}
			}
		}
	}
	return array(
			"data" => $dataDic,
			"runInfo" => $runDic);
	return $dataDic;
}

function bitsToInt($arr)
{
	$outVal = 0;
	for ($i = 0; $i < sizeof($arr); $i++)
	{
		if ($arr[$i] == "") continue;

		$num = intval($arr[$i]);
		// echo $num."\n";

		$outVal += (1 << $num);
	}	
	return $outVal;
}

//DEBUG MODE ON
// $MODULESTR = "38/09/";
// $OPTIONSTR = "3/0";
// $QUERY = "where r.runnumber between 299700 and 300000 ";

// $MODULESTR = "";
// $OPTIONSTR = "";

// $MINMAXOPTIONSTR = "NumberOfCluster-max/NumberOfOfffTrackCluster-max/size-max";
// $MINMAXDETIDFILTER = "-1";

$MODULESTR = urldecode($_POST['moduleStr']);
$OPTIONSTR = urldecode($_POST['optionStr']);
$QUERY = urldecode($_POST['query']);

$MINMAXOPTIONSTR =  urldecode($_POST['minmaxOptionStr']);
$MINMAXDETIDFILTER = urldecode($_POST['minmaxDetIDFilter']);

$BEAMDATAON = intval(urldecode($_POST['beamDataOn']));

if (($MODULESTR != "" && $OPTIONSTR != "") || $MINMAXOPTIONSTR != "")
{
	$modulesExploded = explode("/", $MODULESTR);
	$optionsExploded = explode("/", $OPTIONSTR);

	$modulesToMonitor = bitsToInt($modulesExploded);
	$optionsToMonitor = bitsToInt($optionsExploded);

	$minmaxDetIDFilter = -1;
	if ($MINMAXDETIDFILTER !== "") $minmaxDetIDFilter = intval($MINMAXDETIDFILTER);

	// echo $modulesToMonitor."\n".$optionsToMonitor."\n";

	$dataOut = traverseDirectories($QUERY, $modulesToMonitor, $optionsToMonitor,
											$MINMAXOPTIONSTR, $minmaxDetIDFilter,
											$BEAMDATAON );

	// var_dump($dataOut);
	echo json_encode($dataOut);

	// echo shell_exec("python ../python/rhapi.py");
	// echo "SOME TEXT...\n";
	// echo readfile("http://vocms00169:2113/table/hcal/cond_loader_table_cols")."\n";

	// echo shell_exec("ping http://vocms00169:2113/table/hcal/cond_loader_table_cols");
	// // echo shell_exec("wget http://vocms00169:2113/table/hcal/cond_loader_table_cols -O -");
	// echo shell_exec("wget http://vocms00169:2113/table/hcal/cond_loader_table_cols");
	// echo readfile("cond_loader_table_cols")."\n\n";

}
else{
	echo json_encode(NULL);
}

?>