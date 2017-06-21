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

					$components =  preg_split("/[\s,]+/", $line);

					$elemName = trim($components[1]);

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
						}
						
						// var_dump($valArr);
						$currentDictionary["PX"][$pixelConnectionDic[$elemName][0]][$runNumber] = $valArr;
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


//look
function traverseDirectories($start, $end, $is_searchbyrun, $modulesToMonitor, $options)
{
	$dataDic = array(
					"STR" => array(),
					"PX" => array());

	$BASEPATH = "/data/users/event_display/";

	$YEARLOW = 2016;
	$YEARHIGH = 2017;

	$searchingYearStart = $YEARLOW;

	$COMMANDBASE = "python ../python/rhapi.py \"select r.runnumber, r.duration from runreg_tracker.runs r ";
	$COMMANDAPPENDIX = " -f json";
	$currCommand = "";

	if ($is_searchbyrun)
	{
		$currCommand = $COMMANDBASE."where r.runnumber between $start and $end\"".$COMMANDAPPENDIX;
	}
	else
	{
		$currCommand = $COMMANDBASE."where r.starttime between to_date('$start', 'dd/mm/yyyy') and to_date('$end', 'dd/mm/yyyy')\"".$COMMANDAPPENDIX;
	}

	// echo $currCommand."\n";
	$commandOutput = shell_exec($currCommand);
	$commandOutput = str_replace("u'data'", "\"data\"", $commandOutput);
	$commandOutput = json_decode($commandOutput, true);

	// echo var_dump($commandOutput);
	// echo var_dump($commandOutput);
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

	// echo var_dump($commandOutput);

	for($runNum = intval($start); $runNum <= intval($end); $runNum++)
	// foreach ($commandOutput["data"] as $run)
	{
		// $runNum = $run[0];
		$runHigh = intval($runNum / 1000);
		
		for ($year = $searchingYearStart; $year <= $YEARHIGH; $year++)
		{
			$currPath = $BASEPATH."Data".$year."/Beam/".$runHigh."/".$runNum."/StreamExpress/";
			
			$stripFile = "MergedBadComponents_run".$runNum.".txt";
			$pixelFile = "PixZeroOccROCs_run".$runNum.".txt";

			if (file_exists($currPath))
			{
				// echo $currPath."\n";
				if (file_exists($currPath.$stripFile))
					$dataDic = getStripDataFromFile($currPath.$stripFile, $dataDic, $runNum, $modulesToMonitor, $options);

				if (file_exists($currPath.$pixelFile))
					$dataDic = getPixelDataFromFile($currPath.$pixelFile, $dataDic, $runNum, $modulesToMonitor, $options, $pixelConnectionDic);

				$searchingYearStart = $year;

				break;
			}

			$currPath = $BASEPATH."Data".$year."/Cosmics/".$runHigh."/".$runNum."/StreamExpressCosmics/";
			
			if (file_exists($currPath))
			{
				// echo $currPath."\n";
				if (file_exists($currPath.$stripFile))
					$dataDic = getStripDataFromFile($currPath.$stripFile, $dataDic, $runNum, $modulesToMonitor, $options);

				if (file_exists($currPath.$pixelFile))
					$dataDic = getPixelDataFromFile($currPath.$pixelFile, $dataDic, $runNum, $modulesToMonitor, $options, $pixelConnectionDic);

				$searchingYearStart = $year;

				break;
			}
		}
	}
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

// $dataDic = traverseDirectories(295643, 295660, $STRIPS, $TRACKER + $TEC3M + $TOB);

//DEBUG MODE ON
// $START = "15/06/2017";
// $END = "16/06/2017";
// $IS_SEARCHBYRUN = false;
// $MODULESTR = "38/09/";
// $OPTIONSTR = "3/0";

// $START = "297000";
// $END = "297010";
// $IS_SEARCHBYRUN = true;
// $MODULESTR = "58/45/";
// $OPTIONSTR = "4/";

$START = urldecode($_POST['start']);
$END = urldecode($_POST['end']);
$MODULESTR = urldecode($_POST['moduleStr']);
$OPTIONSTR = urldecode($_POST['optionStr']);
$IS_SEARCHBYRUN = ($_POST['is_searchbyrun'] === 'true');

if ($MODULESTR != "" && $OPTIONSTR != "")
{
	$modulesExploded = explode("/", $MODULESTR);
	$optionsExploded = explode("/", $OPTIONSTR);

	$modulesToMonitor = bitsToInt($modulesExploded);
	$optionsToMonitor = bitsToInt($optionsExploded);

	// echo $modulesToMonitor."\n".$optionsToMonitor."\n";

	$dataOut = traverseDirectories($START, $END, $IS_SEARCHBYRUN, $modulesToMonitor, $optionsToMonitor );

	// var_dump($dataOut);
	echo json_encode($dataOut);

	// echo shell_exec("python ../python/rhapi.py");
	// echo "SOME TEXT...\n";
	// echo readfile("http://vocms00169:2113/table/hcal/cond_loader_table_cols")."\n";
}
else{
	echo json_encode(NULL);
}



?>