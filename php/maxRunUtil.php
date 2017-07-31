<?php

$command = "python ../python/rhapi.py \"select max(r.runnumber) as runMax from runreg_tracker.runs r where r.runnumber > 300000\" --all -f json";

$commandOutput = shell_exec($command);
$commandOutput = str_replace("u'data'", "\"data\"", $commandOutput);
$commandOutput = json_decode($commandOutput, true);

$currRunMax = $commandOutput["data"][0][0];

// echo var_dump($currRunMax);

echo json_encode($currRunMax);

?>