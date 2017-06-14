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
	$i = 0;

	$runNumber = intval(substr($filename, -10, 6));
	// echo $runNumber."\n\n";

	if ($handle) {
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
	    echo "WTF";
	} 
	return $currentDictionary;
}

$filename = "/data/users/event_display/Data2017/Beam/296/296168/StreamExpress/MergedBadComponents_run296168.txt";

$filename2 = "/data/users//event_display/Data2017/Beam/296/296172/StreamExpress/MergedBadComponents_run296172.txt";

$outDic = getDataFromFile($filename, NULL, $STRIPS, $TRACKER + $TEC7M);
$outDic = getDataFromFile($filename2, $outDic, $STRIPS, $TRACKER + $TEC7M);

// var_dump($outDic);

// echo PHP_INT_SIZE."\n";
// echo PHP_INT_MAX

$BASEPATH = "/data/users/event_display/";

function traverseDirectories($runStart, $runStop)
{
	for($run = $runStart; $run <= $runStop; $run++)
	{
		$runHigh = intval($run / 1000);

		for ($year = 2016; $year <= 2017; $year++)
		{
			$currPath = $BASEPATH."DATA".$year."/Beam/".$runHigh."/".$run."/StreamExpress/";
			if (file_exists($currPath))
			{
				echo "T\n";
				break;
			}

			$currPath = $BASEPATH."DATA".$year."/Beam/".$runHigh."/".$run."/StreamExpress/";
			if (file_exists($currPath))
			{
				echo "T\n";
				break;
			}
		}
	}

}

traverseDirectories(295643, 300000);

?>