<?php
/*
	FOR FILLS: 5837 - 5849
	RUNS: 296963 - 297219
*/
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


//look
function traverseDirectories($start, $end, $is_searchbyrun, $query, $modulesToMonitor, $options)
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

	$customRunArr = array(296963, 296964, 296965, 296966, 296967, 296968, 296969, 296970, 296971, 296972, 296976, 296977, 296978, 296979, 296980, 296982, 297001, 297002, 297003, 297004, 297005, 297006, 297007, 297009, 297010, 297011, 297012, 297013, 297014, 297015, 297016, 297017, 297018, 297019, 297020, 297047, 297048, 297049, 297050, 297051, 297052, 297053, 297054, 297055, 297056, 297057, 297070, 297071, 297072, 297096, 297098, 297099, 297100, 297101, 297102, 297103, 297104, 297106, 297107, 297108, 297109, 297110, 297111, 297112, 297113, 297114, 297119, 297120, 297155, 297156, 297160, 297161, 297162, 297163, 297164, 297166, 297167, 297168, 297169, 297170, 297171, 297172, 297173, 297174, 297175, 297176, 297177, 297178, 297179, 297180, 297181, 297211, 297215, 297218, 297219);

	// foreach ($customRunArr as $runNum) 
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

// $START = "280000";
// $END = "285010";
// $IS_SEARCHBYRUN = true;
// $MODULESTR = "59/";
// $OPTIONSTR = "6/";

$START = urldecode($_POST['start']);
$END = urldecode($_POST['end']);
$MODULESTR = urldecode($_POST['moduleStr']);
$OPTIONSTR = urldecode($_POST['optionStr']);
$IS_SEARCHBYRUN = urldecode($_POST['is_searchbyrun'] === 'true');

$QUERY = urldecode($_POST['query']);

if ($MODULESTR != "" && $OPTIONSTR != "")
{
	$modulesExploded = explode("/", $MODULESTR);
	$optionsExploded = explode("/", $OPTIONSTR);

	$modulesToMonitor = bitsToInt($modulesExploded);
	$optionsToMonitor = bitsToInt($optionsExploded);

	// echo $modulesToMonitor."\n".$optionsToMonitor."\n";

	$dataOut = traverseDirectories($START, $END, $IS_SEARCHBYRUN, $QUERY, $modulesToMonitor, $optionsToMonitor );

	// var_dump($dataOut);
	echo json_encode($dataOut);

	// echo shell_exec("python ../python/rhapi.py");
	// echo "SOME TEXT...\n";
	// echo readfile("http://vocms00169:2113/table/hcal/cond_loader_table_cols")."\n";

	// $ch = curl_init();
	// curl_setopt($ch, CURLOPT_URL, "http://vocms00169:2113/table/hcal/cond_loader_table_cols");
	// curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)');
	// curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	// curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
	// curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	// $data = curl_exec($ch);
	// $retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	// curl_close($ch);

	// echo $retcode."\n\n\n\n".$data;
	// // echo readfile("array.py")."\n";

	// /////

	// $ch = curl_init();
	// curl_setopt($ch, CURLOPT_URL, "http://www.ftj.agh.edu.pl/~Lankosz/");
	// curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)');
	// curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	// curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
	// curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	// $data = curl_exec($ch);
	// $retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	// curl_close($ch);

	// echo $retcode."\n\n\n\n".$data;




}
else{
	echo json_encode(NULL);
}



?>