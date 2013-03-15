<script type="text/javascript">
var latList = new Array();
var longList = new Array();
<?php
$latList= array();
$longList= array();
$counter= 0;
$file_handle = fopen("data/data.csv", "r");
while (!feof($file_handle)) {
   $line = fgets($file_handle);
   if($counter>0)
   {
   $temp_lat = substr($line,strpos($line,",\"")+2,strlen($line));
   //echo $temp_lat;
   $temp= $temp_lat;
   $temp_lat = substr($temp_lat,0,strpos($temp_lat,"\""));
   //echo $temp_lat." ";
   
   $temp_long = substr($temp,strpos($temp,",\"")+2,strlen($temp));
   $temp_long = substr($temp_long,0,strpos($temp_long,"\""));
   
   if($temp_long=="")
   $temp_long = "\"null\"";
   if($temp_lat=="")
   $temp_lat = "\"null\"";
   
 // echo $temp_long;
	$latList[$counter]= $temp_lat;
	$longList[$counter]= $temp_long;
	echo " latList[".$counter."] = ".$temp_lat."; ";
	echo " longList[".$counter."] = ".$temp_long."; ";
   }
   $counter++;
}
fclose($file_handle);
?>
</script>
<!DOCTYPE html>
<html lang="en">

  <head>
    <title>StressSense Portal</title>
    <link href="./css/bootstrap.min.css" rel="stylesheet">
    <link href="./css/stress-sense-portal.css" rel="stylesheet">
    <link href="./css/time-series-charts.css" rel="stylesheet">
		<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?sensor=false"></script>
		<script src="js/h5utils.js"></script>
  </head>

  <body style="width:800px;">

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container" style="margin-left:110px;">
          <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="brand" href="#">stressSense portal</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li class="active"><a href="#">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container" style="left:250px;position:relative">
	<div id="bgcolor" style="left:250px;box-shadow: 0px 0px 5px #888;position:fixed;padding-left:20px;margin-left:-165px;margin-top:-20px;z-index:0;width:810px;height:1060px;background-color:#FFF;"></div>
<div id="bg" style="box-shadow: 0px 0px 5px #888;position:absolute;padding-left:20px;margin-left:-165px;margin-top:-20px;z-index:0;width:810px;height:100%;background-color:#FFF;">

      <h2>Welcome, Phil</h2>
      <p>You can see below your sensed stress, affect, activity, and more.</p>
      <br/>

      <div style="position:absolute;margin-left:-20px;margin-top:0px;width:830px;height:180px;z-index:-1;background-color:#F6F9F6;"></div>
      <div id="chart-stress-mellin">
        <h3>Stress</h3>
      </div>
      <div id="chart-pam-pa">
        <h3>PAM-PA</h3>
      </div>
      <div style="position:absolute;margin-left:-20px;margin-top:0px;width:830px;height:130px;z-index:-1;background-color:#F6F9F6;"></div>
       <div id="chart-sensed-stress">
        <h3>Sensed Stress</h3>
	
       </div>
       <div style="position:relative;margin-left:50px;height:110px;">
	<div style="position:absolute;margin-left:140px;width:20px;height:20px;background-color:#FF7F0E"></div><p style="margin-top:-115px;margin-left:170px;">Silent</p>
	<div style="position:absolute;margin-top:-30px;margin-left:230px;width:20px;height:20px;background-color:#FFBB78"></div><p style="margin-top:-30px;margin-left:260px;">Noise</p>
	<div style="position:absolute;margin-top:-30px;margin-left:320px;width:20px;height:20px;background-color:#2CA02C"></div><p style="margin-top:-30px;margin-left:350px;">Voice, Stressed</p>
	<div style="position:absolute;margin-top:-30px;margin-left:475px;width:20px;height:20px;background-color:#98DF8A"></div><p style="margin-top:-30px;margin-left:505px;">Voice, Not-Stressed</p>
	 </div>
      <div id="chart-activity" style="margin-top:0px">
        <h3>Activity</h3>
      </div>
      <div style="position:relative;margin-left:50px;height:110px;">
	<div style="position:absolute;margin-left:140px;width:20px;height:20px;background-color:#FF7F0E"></div><p style="margin-top:-115px;margin-left:170px;">Walk</p>
	<div style="position:absolute;margin-left:230px;margin-top:-30px;width:20px;height:20px;background-color:#FFBB78"></div><p style="margin-top:-30px;margin-left:260px;">Run</p>
	<div style="position:absolute;margin-left:320px;margin-top:-30px;width:20px;height:20px;background-color:#2CA02C"></div><p style="margin-top:-30px;margin-left:350px;">Sit</p>
	 </div>
      <div style="position:absolute;margin-left:-20px;margin-top:0px;width:830px;height:130px;z-index:-1;background-color:#F6F9F6;"></div>
      <div id="chart-notes">
        <h3>Notes</h3>
      </div>
      <div id="test-hover" onmouseover="$('#note-popup').css('opacity','1');" onmouseout="$('#note-popup').css('opacity','0');" style="cursor:pointer;position:absolute;margin-top:-55px;margin-left:146px;width:15px;height:20px;background:url('img/notebubble.png');background-repeat:no-repeat;background-size:15px 15px;">
      </div>
      <div id="note-popup" style="pointer-events:none;position:absolute;padding-top:10px;padding-left:15px;margin-top:-160px;margin-left:55px;opacity:0;width:200px;height:110px;background:url('img/notepopup.png');background-repeat:no-repeat;background-size:200px 110px;">
	I had three meals today.
      </div>
    </div>
</div>

<div id="mapcont" style="position: fixed;z-index:-2;top:0px;width:100%;height:100%;">
<div id="map-canvas" style="left:0px; width: 100%; height: 100%; position: fixed"></div>
</div>

    <script type="text/javascript">
    //<?php
    //echo "var code = "+$_SESSION['code'];
    //?>
var eventArr = new Array();
var localShowArr = new Array();
		
function getLocation()
{
	
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{x.innerHTML="Geolocation is not supported by this browser.";}
}
  
  var map;
  var markers = [];

  var nidList= new Array();
  var nklatList= new Array();
  var nklongList= new Array();
  showPosition();
function showPosition(position)
  {
  //window.lat= position.coords.latitude;
  //window.long= position.coords.longitude;
 window.lat= '42.4406';
 window.long= '-76.5231';
  //alert(window.lat);
  //getLocationId();
  //showResults();
  nklatList[0]= window.lat;
  nklongList[0]= window.long;
	

  var haightAshbury;

  haightAshbury = new google.maps.LatLng(window.lat, parseFloat(window.long)-0.002);
  var mapOptions = {
  zoom: 14,
  scrollwheel: false,
  center: haightAshbury,
  mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
  mapOptions);

  google.maps.event.addListener(map, 'click', function(event) {
  //addMarker(event.latLng, 0);
  });

  //placeMarkers();
  //labelHome();

 //google.maps.event.addDomListener(window, 'load', initialize);
  }
  
   // Add a marker to the map and push to the array.
function addMarker(location, pop) {
//according to the number in npop, we print that number here
//var image = new google.maps.MarkerImage('http://www.wockytalk.com/wt/images/bubble_w.png');

//if(location.lat()==42.447384890294906 && location.lng()==-76.48225880546607)
//image = new google.maps.MarkerImage('http://www.wockytalk.com/wt/images/nonexist.png');

marker = new google.maps.Marker({
position: location,
map: map
//icon: image
});


google.maps.event.addListener(marker, 'click', function(event){
//search for Klat and Klong that match location. Load JS that does this.
//alert(location.lng());
var a= ''+location.lat();
var b= ''+location.lng();
//alert(a);
//alert(b);
//switchNet(a,b);
map.panTo(new google.maps.LatLng(location.lat(), (location.lng()-0.02)));
//harmless();
});

//alert(location.toString());
markers.push(marker);
}


function placeMarkers(offset){
//for(var i=offset; i<nklatList.length; i++)
//{
	//alert("adding "+nklatList[i]);
var locus= new google.maps.LatLng(nklatList[offset], nklongList[offset]);//nklongList[i], false);
console.log("gm"+offset);

addMarker(locus, 0);
//}
}

function labelHome(){
	/*
    for(i=0; i<markers.length; i++)
    {
        //alert(markers[i].getPosition());
        //alert(haightAshbury);
        if((markers[i].getPosition()).lat()==(haightAshbury.lat()))
        {
        //alert("LOL");
        (markers[i]).openInfoWindowHtml('You are here!');
        }
    }
	*/
}

function resetMarkers()
{
	for(var i=1; i<nklatList.length; i++)
	{
		markers[i].setIcon("images/marker.png");
	}
}

// Sets the map on all markers in the array.
function setAllMap(map) {
for (var i = 0; i < markers.length; i++) {
markers[i].setMap(map);
}
}

// Removes the overlays from the map, but keeps them in the array.
function clearOverlays() {
setAllMap(null);
}

// Shows any overlays currently in the array.
function showOverlays() {
setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteOverlays() {
clearOverlays();
markers = [];
}
  
   var a= window.innerWidth;
    var b= window.innerHeight;
    b= b;
    a= a-15;
    //alert(a);
    
    var c= document.getElementById("map-canvas");
    var d= document.getElementById("map-canvas");
    //alert(c);
    
    c.style.height= b+"px";
    d.style.width= a+"px";
    
    var d= document.getElementById("map-canvas");
    d.style.position= "fixed";
  
  var totalPoints= <?php echo $counter; ?>;
  for(var i=1; i<totalPoints; i++)
  {
	
	if(latList[i]!="null")
	{
		alert(latList[i]);
	  var locus= new google.maps.LatLng(latList[i], longList[i]);//nklongList[i], false);
	
	  addMarker(locus, 0);
	}
  }
  
  
  
  
    </script>


  </body>
  <script src="./js/jquery-1.8.0.min.js"></script>
  <script src="./js/bootstrap.min.js"></script>
  <script src="./js/d3.v2.min.js"></script>
  <script src="./js/stress-sense-portal.js"></script>
  <script type="text/javascript">
	
  </script>

</html>
