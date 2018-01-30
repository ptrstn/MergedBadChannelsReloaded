# MergedBadChannelsReloaded

## How to use?
The detailed description of how the tool works can be found in ```HELP/UserGuide.pdf``` or accessed directly from the tool - the link is located in the very bottom of the ```Options``` tab.

## Maintenance

The tool requires a bit knowledge of:
*  HTML,
*  Javascript ([jQuery](https://jquery.com/)),
*  CSS ([Bootstrap](https://getbootstrap.com/)),
*  php,
*  python,
*  databases.

When the user clicks on ```Start plotting``` button JS grabs all pieces of information from the user controlable area, packs it and runs asynchronously ```getDataFromFile.php```. Appropriate list of runs to be processed is obtained by using ```rhapi.py```. ```getDataFromFile.php``` searches then for all required data from files located on vocms061. NOTE: Data structure on the server should be kept the same to maintain compatibility. 

Then data processing comes back to the application - it fills the chart accordingly (```plot.js```). We are using [chartjs](http://www.chartjs.org/) as the plotting tool since it is free yet quite powerful.

## Emergency mode has been fired/ I am waiting longer than usual for data - what to do now?

There are two main reasons:
1. Too long data searching period (especially when calling min/max trends - see Final notes).
2. There are some problems with the access to the Run Registry. To check whether this is the case try to run ```maxRunUtil.php```. This script should output the currently maximum run number. If not send email to [Valdas.Rapsevicius@cern.ch](Valdas.Rapsevicius@cern.ch) stating that the Run Registry can not be accessed using ```rhapi.py```.
3. The configuration of the web server has changed and it is not able to run external scripts on the server machine. Then and only then you can ask [Viktor.Veszpremi@cern.ch](Viktor.Veszpremi@cern.ch) for help.

## Final notes
The ```minmaxFileParser.py``` (for easiness of implementation) has been created as the external plugin for the main ```getDataFromFile.php```. However it is called for every run in range potentially killing performance. If you want to speed things up convert it into php function.
