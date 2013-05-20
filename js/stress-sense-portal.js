// hackish... resolve!
var notes= new Array(); //self report notes array
var times= new Array(); //self report notes/time array
var circles= new Array();

var urlExists = function(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
};

var getParams = function() {
    params = {};
    paramstr = window.location.search.substr(1);
    paramstr.split('&').forEach(function(param) {
        bits = param.split('=');
        params[bits[0]] = bits[1];
    });
    return params;
};

var params = getParams();
var fnamebase = './data/uid'+params.uid+'-day'+params.day+'.';
var fname = null;

// set user and date strings, and next/prev links
if (params.uid && params.day) {
    //theDate = moment();
    //$('#the-date').text(theDate.format('dddd, MMMM Do'));
    $('#the-date').text('study day ' + params.day);
    $('#the-user').text(params.uid);
    var dayi = parseInt(params.day);
    $('#prev-day').attr('href', './?uid='+params.uid+'&day='+(dayi-1));
    $('#next-day').attr('href', './?uid='+params.uid+'&day='+(dayi+1));
} else {
    alert('required GET params uid, day');
}

// self report data
fname = fnamebase + 'selfreport.5min.csv';
d3.csv(fname, function(data) {

    if (data.length >= 1) {

        // massage data
        var parseDate = d3.time.format('%Y-%m-%d %H:%M:%S').parse;
        data.forEach(function(d, i) {
            d.stress = parseInt(d.stress);
            d.pam_pa = parseInt(d.pam_pa);
            d.when = parseDate(d.when);  // in local time
        });

        // self-report stress
        var chartStress = timeSeriesBar()
            .x(function(d) { return d.when; })
            .y(function(d) { return parseInt(d.stress); })
            .yDomain([0, 5]);
          d3.select('#chart-stress')
            .datum(data)
            .call(chartStress);
        
        // pam-pa
        var chartAffect = timeSeriesBar()
            .x(function(d) { return d.when; })
            .y(function(d) {
                var hms = ""+d.when;
                hms= hms.substring(16,24);
                var a = hms.split(':'); // split it at the colons
                var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                //storing times and content of notes to paste later.
                times.push(seconds);
                notes.push(d.note); 
                return parseInt(d.pam_pa);
                })
            .yDomain([1,16]);
          d3.select('#chart-affect')
            .datum(data)
            .call(chartAffect);
            
        var zerotime= 3600; //the earliest time in seconds
        var maxtime= 79200; //the largest time in seconds
        var scaletime= 610/(maxtime-zerotime);  //scale factor
        
        //pasting note hovers in both self report charts
        for(var i=0; i<notes.length; i++)
        {
            if(notes[i]!='')
            {
                $('#notescolumn1').append('<div onmouseover="showNote($(this));" onmouseout="hideNote();" note="'+notes[i]+'" style="pointer-events:auto;cursor:pointer;position:absolute;margin-left:'+(scaletime*(times[i]-zerotime))+'px;width:9px;height:70px;z-index:4;background-color:#DDD;"></div>');
                $('#notescolumn2').append('<div onmouseover="showNote($(this));" onmouseout="hideNote();" note="'+notes[i]+'" style="pointer-events:auto;cursor:pointer;position:absolute;margin-left:'+(scaletime*(times[i]-zerotime))+'px;width:9px;height:70px;z-index:4;background-color:#DDD;"></div>');
            }    
        }
       
    }

});

/*
    functions for showing the tooltip (when you hover over a note) 
*/

window.mouseX= 0;
window.mouseY= 0;

jQuery(document).ready(function(){
   $(document).mousemove(function(e){
      //$('#status').html(e.pageX +', '+ e.pageY);
      window.mouseX= e.pageX-115;
      window.mouseY= e.pageY-100;
   }); 
})

function showNote(object)
{
    $('#tooltip').html('<p id="tooltiptext">'+object.attr('note')+'</p>');
    $('#tooltip').css('height',$('#tooltiptext').css('height'));
    var newHeight = ($('#tooltiptext').css('height')+"").replace("px","");
    window.mouseY = window.mouseY-newHeight;
    $('#tooltip').css('left',window.mouseX+'px');
    $('#tooltip').css('top',window.mouseY+'px');
    $('#tooltip').fadeTo(0,1);
    
}

function hideNote()
{
    $('#tooltip').fadeTo(0,0);
}

// accelerometer data
fname = fnamebase + 'accel.5min.csv';

var accel_graph;

d3.csv(fname, function(data) {

    if (data.length >= 1) {

        // finesse data
        var parseDate = d3.time.format('%Y-%m-%d %H:%M:%S').parse;
        data.forEach(function(d, i) {
            d.when = parseDate(d.when);  // in local time
        });

        // self-report stress
        var chartActivity = timeSeriesCategorical()
            .x(function(d) { return d.when; })
            .y(function(d) { return d.activity; })
            .yDomain(['stationary', 'walking', 'running', 'cycling', 'driving']);
          d3.select('#chart-activity')
            .datum(data)
            .call(chartActivity);
            
        accel_graph = chartActivity;

    }

});

// audio data
fname = fnamebase + 'audio.5min.csv';
d3.csv(fname, function(data) {

    if (data.length >= 1) {

        // finesse data
        var parseDate = d3.time.format('%Y-%m-%d %H:%M:%S').parse;
        data.forEach(function(d, i) {
            d.when = parseDate(d.when);  // in local time
        });

        // self-report stress
        var chartAudio = timeSeriesCategorical()
            .x(function(d) { return d.when; })
            .y(function(d) { return d.audio; })
            .yDomain(['silence', 'Voice Stressed', 'Voice Not-Stressed', 'noise'])
            .yRange(d3.scale.category20().range().slice(5,9));
          d3.select('#chart-audio')
            .datum(data)
            .call(chartAudio);

    }

});

// gsr (eda) data
fname = fnamebase + 'gsr.csv';
d3.csv(fname, function(data) {

    if (data.length >= 1) {

        // finesse data
        var parseDate = d3.time.format('%Y-%m-%d %H:%M:%S').parse;
        var w = null;
        data.forEach(function(d, i) {
            w = d.when.substr(0, 18) + '0';
            d.when = parseDate(w);  // in local time
        });

        // self-report stress
        var chartEDA = timeSeriesCategorical()
            .x(function(d) { return d.when; })
            .y(function(d) {
                $('#gsrdump').append('<p>'+d.when+'</p>');
                return d.isStressed; })
            .yDomain([0, 1]);
          d3.select('#chart-eda')
            .datum(data)
            .call(chartEDA);

    }

});

//building our spectrum array of every color, very hackish.
var fullSpectrum = new Array();
for(var i=0; i<=256; i++)
{
fullSpectrum.push("rgb(256,"+i+",0)");
}
for(var i=256; i>=0; i--)
{
fullSpectrum.push("rgb("+i+",256,0)");
}
for(var i=0; i<=256; i++)
{
fullSpectrum.push("rgb(0,256,"+i+")");
}
for(var i=256; i>=0; i--)
{
fullSpectrum.push("rgb(0,"+i+",256)");
}
for(var i=0; i<=256; i++)
{
fullSpectrum.push("rgb("+i+",0,256)");
}
//alert(fullSpectrum[300]);

//print out color bars
var zerotime= 3600; //the earliest time in seconds
var maxtime= 79200; //the largest time in seconds
var scaletime= 610/(maxtime-zerotime);  //scale factor
for(var i=12; i<264; i++)
{
    var hours= parseInt(i/12);
    
    // i = 18
    var minutes=(i*5)-(hours*60);
    
    if(hours<10)
    hours = "0"+hours;
    if(minutes<10)
    minutes = "0"+minutes;
    var numPoints= 264;
    
    var pointColor = getSpectrum(i,numPoints);
    
    $('#colorbars').append('<div id="colorbar'+i+'" onclick="addNote($(this));" circlenum="" linenum="2013-03-10 '+hours+':'+minutes+':00" onmousedown="startSelecting($(this));" onmouseup="doneSelecting($(this));" flagged="false" onmouseover="highlightTime($(this),'+i+',\''+pointColor+'\');" onmouseout="unhighlightTime($(this), '+i+',\''+pointColor+'\');" color="'+getSpectrum(i, numPoints)+'" style="cursor:pointer;position:fixed;z-index:7;margin-left:'+(scaletime*((i*5*60)-zerotime))+'px;width:7px;height:100%;opacity:0;background-color:'+getSpectrum(i, numPoints)+';"></div>');
}

//initializing our leaflet map
var map = L.map('map').setView([42.444, -76.468], 15);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
             {attribution: 'Map data &copy; OpenStreetMap contributors',
              minZoom: 8,
              maxZoom: 18
              }).addTo(map);
fname = fnamebase + 'loc.5min.csv';
if (!urlExists(fname)) {
    console.log('no location data');
} else {
    d3.csv(fname, function(data) {
        var circle = null,
            lat = null,
            lon = null;
        var numPoints= 0;
        data.forEach(function(d, i) {
            numPoints++;
        });
        data.forEach(function(d, i) {
        var zerotime= 3600; //the earliest time in seconds
        var maxtime= 79200; //the largest time in seconds
        var scaletime= 610/(maxtime-zerotime);  //scale factor
            lat = parseFloat(d.lat);
            lon = parseFloat(d.lon);
            circle = L.circleMarker([lat, lon]).addTo(map);
            circle.setRadius(5);
            var pointColor = getSpectrum(i, numPoints);
            circle.setStyle({
                color: pointColor,
                fill: true,
                fillOpacity: 0.2
            });
            circles.push(circle);
            var done= false;
            for(var k=0; k<264; k++)
            {
                if(!done)
                {
                var this_seconds = k*5*60;
                var hms = ""+d.when;
                hms= hms.substring(11,19);
                var a = hms.split(':'); 
                var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                    if(seconds<this_seconds)
                    {
                        $('#colorbar'+k).attr('circlenum',i);
                        circles[circles.length-1].setStyle({
                        color: $('#colorbar'+k).attr('color'),
                        fill: true,
                        fillOpacity: 0.2
                        });
                        done= true;
                    }
                }
            }
        });
    });
}

function deleteRegion()
{
    var firstLine= $('#deleteButton').attr('first');//.attr('linenum');
    var lastLine= $('#deleteButton').attr('last');//.attr('linenum');
    
    //if user highlighted by moving right -> left, need to switch to points
    var firstSeconds = firstLine;
    firstSeconds = firstSeconds.substring(11,19);
    var a = firstSeconds.split(':'); 
    firstSeconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    
    var lastSeconds = lastLine;
    lastSeconds = lastSeconds.substring(11,19);
    var b = lastSeconds.split(':'); 
    lastSeconds = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);
    
    if(firstSeconds > lastSeconds)
    {
        var temp= firstLine;
        firstLine = lastLine;
        LastLine = temp;
    }
    
    //$_GET means getting rid of spaces in url
    firstLine= firstLine.replace(" ","%20");
    lastLine= lastLine.replace(" ","%20");
    
    //here we call the delete script for each possible file that could exist.
    var fileUrl = "data/uid"+params.uid+"-day"+params.day+".accel.5min.csv";
    $('#selectRegion').load('./deleteRegion.php?uid='+params.uid+'&day='+params.day+'&first=\''+firstLine+'\'&last=\''+lastLine+'\'&filename='+fileUrl);
    
    fileUrl = "data/uid"+params.uid+"-day"+params.day+".audio.5min.csv";
    $('#selectRegion').load('./deleteRegion.php?uid='+params.uid+'&day='+params.day+'&first=\''+firstLine+'\'&last=\''+lastLine+'\'&filename='+fileUrl);
    
    fileUrl = "data/uid"+params.uid+"-day"+params.day+".gsr.5min.csv";
    $('#selectRegion').load('./deleteRegion.php?uid='+params.uid+'&day='+params.day+'&first=\''+firstLine+'\'&last=\''+lastLine+'\'&filename='+fileUrl);
        
    fileUrl = "data/uid"+params.uid+"-day"+params.day+".loc.5min.csv";
    $('#selectRegion').load('./deleteRegion.php?uid='+params.uid+'&day='+params.day+'&first=\''+firstLine+'\'&last=\''+lastLine+'\'&filename='+fileUrl);
          
    fileUrl = "data/uid"+params.uid+"-day"+params.day+".accel.csv";
    $('#selectRegion').load('./deleteRegion.php?uid='+params.uid+'&day='+params.day+'&first=\''+firstLine+'\'&last=\''+lastLine+'\'&filename='+fileUrl);
    
    fileUrl = "data/uid"+params.uid+"-day"+params.day+".audio.csv";
    $('#selectRegion').load('./deleteRegion.php?uid='+params.uid+'&day='+params.day+'&first=\''+firstLine+'\'&last=\''+lastLine+'\'&filename='+fileUrl);
    
    fileUrl = "data/uid"+params.uid+"-day"+params.day+".gsr.csv";
    $('#selectRegion').load('./deleteRegion.php?uid='+params.uid+'&day='+params.day+'&first=\''+firstLine+'\'&last=\''+lastLine+'\'&filename='+fileUrl);

    fileUrl = "data/uid"+params.uid+"-day"+params.day+".loc.csv";
    $('#selectRegion').load('./deleteRegion.php?uid='+params.uid+'&day='+params.day+'&first=\''+firstLine+'\'&last=\''+lastLine+'\'&filename='+fileUrl);
    
    fileUrl = "data/uid"+params.uid+"-day"+params.day+".selfreport.csv";
    $('#selectRegion').load('./deleteRegion.php?uid='+params.uid+'&day='+params.day+'&first=\''+firstLine+'\'&last=\''+lastLine+'\'&filename='+fileUrl);

    fileUrl = "data/uid"+params.uid+"-day"+params.day+".selfreport.5min.csv";
    $('#selectRegion').load('./deleteRegion.php?uid='+params.uid+'&day='+params.day+'&first=\''+firstLine+'\'&last=\''+lastLine+'\'&filename='+fileUrl);

    //disable delete button because we're done
    disableDelete();
    
    //erase points -- really hackish. If we could reload the d3 graphs instead that'd be terrific.
    var erasureWidth = $('#selectRegion').css('width');
    var erasureLeft = $('#selectRegion').css('marginLeft');
    $('#accel_erase').append('<div style="position:absolute;z-index:0;margin-left:'+erasureLeft+';width:'+erasureWidth+';height:23px;background-color:#FFF;"></div>');
    $('#audio_erase').append('<div style="position:absolute;z-index:0;margin-left:'+erasureLeft+';width:'+erasureWidth+';height:23px;background-color:#FFF;"></div>');
    $('#self_erase').append('<div style="position:absolute;z-index:0;margin-left:'+erasureLeft+';width:'+erasureWidth+';height:71px;background-color:#FFF;"></div>');
    $('#affect_erase').append('<div style="position:absolute;z-index:0;margin-left:'+erasureLeft+';width:'+erasureWidth+';height:71px;background-color:#FFF;"></div>');
    $('#gsr_erase').append('<div style="position:absolute;z-index:0;margin-left:'+erasureLeft+';width:'+erasureWidth+';height:23px;background-color:#FFF;"></div>');
    
    //unhighlight region because we're done
    $('#selectRegion').css('width','0px');
    }

//we check every possible file that could exist and call "delete" on it.
function fileExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function disableDelete()
{
    $('#deleteButton').css('opacity','0.3');
}

function enableDelete()
{
    $('#deleteButton').css('opacity','1');
    $('#deleteButton').attr('first',window.firstBar.attr('linenum'));
    $('#deleteButton').attr('last',window.lastBar.attr('linenum'));
}

//functions for drag + select region
function startSelecting(object)
{
    disableDelete(); 
    window.selecting= true;
    $('#selectRegion').css('width','0px');
    $('#selectRegion').css('marginLeft',object.css('marginLeft'));
    window.firstBar= object;
}

function doneSelecting(object)
{
   window.selecting= false;
   if($('#selectRegion').css('width')!='0px')
   enableDelete();
}

//hover for color bar
function highlightTime(object, i, pointColor)
{
    if(window.selecting)
    {
        var leftDiff= object.css('marginLeft').replace("px","")-$('#selectRegion').css('marginLeft').replace("px","");
        
        if(leftDiff<0)
        {
            console.log(Math.abs(leftDiff)+$('#selectRegion').css('width'));
            $('#selectRegion').css('width',$(window.firstBar).css('marginLeft').replace("px","")-object.css('marginLeft').replace("px",""));//Math.abs(leftDiff)+$('#selectRegion').css('width').replace("px","")+'px');
            $('#selectRegion').css('marginLeft',object.css('marginLeft'));
        }
        else{
        console.log(object.css('marginLeft').replace("px","")-$('#selectRegion').css('marginLeft').replace("px",""));
        $('#selectRegion').css('width',object.css('marginLeft').replace("px","")-$('#selectRegion').css('marginLeft').replace("px","")+'px');
        $('#selectRegion').css('backgroundColor','#1E76B3');
        }
    }
    i = object.attr('circlenum');
    object.css('opacity', '0.3');
    
    circles[i].setRadius(10);
    circles[i].setStyle({
                color: pointColor,
                fill: true,
                fillOpacity: 1
            });
}

function unhighlightTime(object, i, pointColor)
{
    if(window.selecting)
    {
        window.lastBar= object;
    }
    object.fadeTo(0,0);
    i = object.attr('circlenum');
    circles[i].setRadius(5);
    circles[i].setStyle({
                color: pointColor,
                fill: true,
                fillOpacity: 0.2
            });
}



function getSpectrum(d, numPoints)
{
    var spectrumIndex = parseInt(d/numPoints*fullSpectrum.length);
    //alert(spectrumIndex);
    return fullSpectrum[spectrumIndex];
}

/*
    Adding a self-report functions
*/

function addNote(object)
{
    $('#gridPick').css('opacity','0');
    $('#grid').css('opacity','0');
    $('#notesMsg').css('opacity','0');
    $('#typeSelfreport').css('opacity','0');
    $('#submitSelfreport').css('opacity','0');
    
    $('#addselfreport').css('opacity','0');
    $('#addselfreport').css('pointerEvents','none');
    
    var posX = window.mouseX-30;
    var posY = window.mouseY-140;
    //click on self-report region
    if(window.mouseY>356 && window.mouseY<425)
    {
        $('#addselfreport').css('pointerEvents','auto');
        $('#addselfreport').css('left',posX);
        $('#addselfreport').css('top', posY);
        $('#bulletPick').css('opacity','1');
        $('#selfreportoptions').css('opacity','1');
        $('#selfreportoptions').css('pointerEvents','auto');
        $('#typeSelfreport').css('pointerEvents','none');
        $('#submitSelfreport').css('opacity','0');
        $('#addselfreport').css('opacity','1');
        $('#typeSelfreport').val('');
        $('#submitSelfreport').attr('first',object.attr('linenum'));
    }
    
    //click on self-report affect region
    if(window.mouseY>543 && window.mouseY<611)
    {
        $('#addselfreport').css('pointerEvents','auto');
        $('#addselfreport').css('left',posX);
        $('#addselfreport').css('top', posY);
        $('#bulletPick').css('opacity','1');
        $('#selfreportoptions').css('opacity','1');
        $('#selfreportoptions').css('pointerEvents','auto');
        $('#typeSelfreport').css('pointerEvents','none');
        $('#submitSelfreport').css('opacity','0');
        $('#addselfreport').css('opacity','1');
        $('#typeSelfreport').val('');
        $('#submitSelfreport').attr('first',object.attr('linenum'));
    }
}

function initialSelfReport(object)
{
    //embed the "report" score in the 1-5 element's "report" attribute.
    var report= object.attr('report');
        $('#bulletPick').css('opacity','0');
        $('#selfreportoptions').css('opacity','0');
        $('#selfreportoptions').css('pointerEvents','none');
    
    $('#gridPick').css('opacity','1');
    $('#grid').css('opacity','1');
    $('#grid').css('pointerEvents','auto');
    $('#submitSelfreport').attr('report',report);
}

function prepareSelfReport(object)
{
    //embed the score in the grid element's "score" attribute!
    var score= object.attr('score');
    
    $('#gridPick').css('opacity','0');
    $('#grid').css('opacity','0');
    $('#submitSelfreport').attr('score',score);
    $('#grid').css('pointerEvents','none');
    
    $('#notesMsg').css('opacity','1');
    $('#typeSelfreport').css('opacity','1');
    $('#submitSelfreport').css('opacity','1');
    $('#typeSelfreport').css('pointerEvents','auto');
}

function addSelfReport(object)
{
    var score= object.attr('score');
    var report= $('#submitSelfreport').attr('report');
    var this_note= $('#typeSelfreport').val();
    var firstLine= $('#submitSelfreport').attr('first');
    firstLine= firstLine.replace(" ","%20");
    $('#selectRegion').load('addSelfReport.php?uid='+params.uid+'&day='+params.day+'&score='+score+'&report='+report+'&note='+this_note+'&time='+firstLine);
   
    $('#gridPick').css('opacity','0');
    $('#grid').css('opacity','0');
    $('#notesMsg').css('opacity','0');
    $('#typeSelfreport').css('opacity','0');
    $('#submitSelfreport').css('opacity','0');
    
    $('#addselfreport').css('opacity','0');
    $('#addselfreport').css('pointerEvents','none');
}