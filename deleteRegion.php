<?php

$first= str_replace("%20"," ", $_GET['first']);
$last= str_replace("%20", " ", $_GET['last']);
$uid= $_GET['uid'];
$day= $_GET['day'];
$filename= $_GET['filename'];
//echo "starting";
//echo "<script type=\"text/javascript\">alert(".substr($filename,10,5).");</script>";
if (file_exists($filename))
{
//echo "in an if statement";
$lines = file($filename);
//echo count($lines);
$finalLines[0]= $lines[0];
$finalCSV= "";

for($i=1; $i<count($lines); $i++)
{
    $this_time= substr($lines[$i],2,19);
    //echo $this_time;
    $hour = substr($lines[$i],13,8);
    $parse = array();
    $hour= str_replace(".","0",$hour);
    
    if (!preg_match ('#^(?<hours>[\d]{2}):(?<mins>[\d]{2}):(?<secs>[\d]{2})$#',$hour,$parse)) {
         // Throw error, exception, etc
         throw new RuntimeException ("orig Hour Format not valid");
    }
    $this_time = (int) $parse['hours'] * 3600 + (int) $parse['mins'] * 60 + (int) $parse['secs'];
    
    $hour = substr($first,13,8);
    
    $parse = array();
    //echo $hour." ";
    //echo $hour;
    if (!preg_match ('#^(?<hours>[\d]{2}):(?<mins>[\d]{2}):(?<secs>[\d]{2})$#',$hour,$parse)) {
         // Throw error, exception, etc
         throw new RuntimeException ("first Hour Format not valid");
    }
    $first_time = (int) $parse['hours'] * 3600 + (int) $parse['mins'] * 60 + (int) $parse['secs'];
    
    $hour = substr($last,13,8);
    $parse = array();
    
    if (!preg_match ('#^(?<hours>[\d]{2}):(?<mins>[\d]{2}):(?<secs>[\d]{2})$#',$hour,$parse)) {
         // Throw error, exception, etc
         throw new RuntimeException ("last Hour Format not valid");
    }
    $last_time = (int) $parse['hours'] * 3600 + (int) $parse['mins'] * 60 + (int) $parse['secs'];
    
    if(intval($this_time)<intval($first_time))
    array_push($finalLines, $lines[$i]);
    if(intval($this_time)>intval($last_time))
    array_push($finalLines, $lines[$i]);
}
file_put_contents($filename,"");

$fp=fopen($filename,"w+");
foreach($finalLines as $key => $value){
fwrite($fp,$value);
}

}

?>