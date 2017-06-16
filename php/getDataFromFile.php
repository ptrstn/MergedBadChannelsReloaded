<?php

$TRACKER = 1 << 38;

$TIB = 1 << 37;
$TID = 1 << 36;
$TOB = 1 << 35;
$TEC = 1 << 34;

$TIB1 = 1 << 33;
$TIB2 = 1 << 32;
$TIB3 = 1 << 31;
$TIB4 = 1 << 30;

$TID1 = 1 << 29;
$TID2 = 1 << 28;
$TID3 = 1 << 27;
$TID1M = 1 << 26;
$TID2M = 1 << 25;
$TID3M = 1 << 24;

$TOB1 = 1 << 23;
$TOB2 = 1 << 22;
$TOB3 = 1 << 21;
$TOB4 = 1 << 20;
$TOB5 = 1 << 19;
$TOB6 = 1 << 18;

$TEC1 = 1 << 17;
$TEC2 = 1 << 16;
$TEC3 = 1 << 15;
$TEC4 = 1 << 14;
$TEC5 = 1 << 13;
$TEC6 = 1 << 12;
$TEC7 = 1 << 11;
$TEC8 = 1 << 10;
$TEC9 = 1 << 9;
$TEC1M = 1 << 8;
$TEC2M = 1 << 7;
$TEC3M = 1 << 6;
$TEC4M = 1 << 5;
$TEC5M = 1 << 4;
$TEC6M = 1 << 3;
$TEC7M = 1 << 2;
$TEC8M = 1 << 1;
$TEC9M = 1 << 0;

$MODULES = 1 << 3;
$FIBERS = 1 << 2;
$APVS = 1 << 1;
$STRIPS = 1 << 0;


function getDataFromFile($filename, $currentDictionary, $modulesToMonitor, $options)
{
	$handle = fopen($filename, "r");

	if ($handle) {
		$i = 0;

		$runNumber = intval(substr($filename, -10, 6));
		// echo $runNumber."\n\n".$options."\n";
	    while (($line = fgets($handle)) !== false && $i < 39) 
	    {
	    	if (substr($line, 0, 1) === "T")
	    	{
	    		$line = trim($line);

	    		$components = explode(":", $line);

	    		$elemName = trim($components[0]);

	    		if ($options & (1 << (38 - $i)))
	    		{
	    			// echo $elemName."\n";

	    			$badElements;
	    			preg_match_all('!\d+!', trim($components[1]), $badElements);

	    			// var_dump($badElements);
	    			$valArr = array();
	    			for ($j = 0; $j < sizeof($badElements[0]); $j++)
	    			{
	    				if ($modulesToMonitor & (1 << (3 - $j)))
	    				{
	    					array_push($valArr, intval($badElements[0][$j]));
	    				}else{
	    					array_push($valArr, -1);
	    				}
	    			}
	    			// var_dump($valArr);
    				$currentDictionary[$elemName][$runNumber] = $valArr;

	    		}
		    	$i++;
	    	}
	    }

	    fclose($handle);
	} else {
	    echo "The file: ".$filename." does not exist!";
	} 
	return $currentDictionary;
}

function traverseDirectories($runStart, $runStop, $modulesToMonitor, $options)
{
	$dataDic = NULL;
	$BASEPATH = "/data/users/event_display/";

	for($run = $runStart; $run <= $runStop; $run++)
	{
		$runHigh = intval($run / 1000);

		for ($year = 2016; $year <= 2017; $year++)
		{
			$currPath = $BASEPATH."Data".$year."/Beam/".$runHigh."/".$run."/StreamExpress/MergedBadComponents_run".$run.".txt";
			
			if (file_exists($currPath))
			{
				// echo $currPath."\n";

				$dataDic = getDataFromFile($currPath, $dataDic, $modulesToMonitor, $options);

				break;
			}

			$currPath = $BASEPATH."Data".$year."/Cosmics/".$runHigh."/".$run."/StreamExpressCosmics/MergedBadComponents_run".$run.".txt";
			
			if (file_exists($currPath))
			{
				// echo $currPath."\n";

				$dataDic = getDataFromFile($currPath, $dataDic, $modulesToMonitor, $options);

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

// $STARTRUN = 295643;//intval(urldecode($_POST['startRun']));
// $ENDRUN = 295660;//intval(urldecode($_POST['endRun']));
// $MODULESTR = "38/09/";//urldecode($_POST['moduleStr']);
// $OPTIONSTR = "3/0";//urldecode($_POST['optionStr']);

$STARTRUN = intval(urldecode($_POST['startRun']));
$ENDRUN = intval(urldecode($_POST['endRun']));
$MODULESTR = urldecode($_POST['moduleStr']);
$OPTIONSTR = urldecode($_POST['optionStr']);

if ($MODULESTR != "" && $OPTIONSTR != "")
{
	$modulesExploded = explode("/", $MODULESTR);
	$optionsExploded = explode("/", $OPTIONSTR);

	$modulesToMonitor = bitsToInt($modulesExploded);
	$optionsToMonitor = bitsToInt($optionsExploded);

	// echo $modulesToMonitor."\n".$optionsToMonitor."\n";

	$dataOut = traverseDirectories($STARTRUN, $ENDRUN, $optionsToMonitor, $modulesToMonitor );

	// var_dump($dataOut);
	echo json_encode($dataOut);
}
else{
	echo json_encode(NULL);
}



?>