// hackish... resolve!
var notes= new Array(); //self report notes array
var times= new Array(); //self report notes/time array
var offsets= new Array();   //positioning of datapoint offsets
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
                console.log();
                var hms = ""+d.when;
                hms= hms.substring(16,24);
                console.log(hms);
                var a = hms.split(':'); // split it at the colons
                console.log(a);
                // minutes are worth 60 seconds. Hours are worth 60 minutes.
                var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
                times.push(seconds);
                console.log(+a[0]);
                console.log(+a[1]);
                console.log(+a[2]);
                console.log(seconds);
                //$('#notescolumn').append('<div style="width:20px;height:800px;background-color:#DDD;"></div>');
                //$('#chart-notes').append('<p>'+d.note+'</p>');
                notes.push(d.note); 
                console.log(d.note);
                return parseInt(d.pam_pa);
                })
            .yDomain([1,16]);
          d3.select('#chart-affect')
            .datum(data)
            .call(chartAffect);
            
        var zerotime= 0;//3600;//times[0];
        var maxtime= 81000;//79200;//86400-7200;//24*60*60;//times[times.length-1];
        var scaletime= 629/(maxtime-zerotime);
        console.log(scaletime);
        //$('#notescolumn1').append('<div onmouseover="showNote($(this));" onmouseout="hideNote();" note="" style="cursor:pointer;position:absolute;margin-left:'+(scaletime*(times[i]-zerotime))+'px;width:10px;height:70px;background-color:#DDD;"></div>');
                
        for(var i=0; i<notes.length; i++)
        {
            //$('#notescolumn').append('<div onmouseover="showNote($(this));" onmouseout="hideNote();" note="'+notes[i]+'" style="cursor:pointer;position:absolute;margin-left:'+(scaletime*((i/100)*79200))+'px;width:1px;height:235px;background-color:#DDD;"></div>');
            //alert(times[i]);
            if(notes[i]!='')
            {
                $('#notescolumn1').append('<div onmouseover="showNote($(this));" onmouseout="hideNote();" note="'+notes[i]+'" style="cursor:pointer;position:absolute;margin-left:'+(scaletime*(times[i]-zerotime))+'px;width:9px;height:70px;z-index:4;background-color:#DDD;"></div>');
                $('#notescolumn2').append('<div onmouseover="showNote($(this));" onmouseout="hideNote();" note="'+notes[i]+'" style="cursor:pointer;position:absolute;margin-left:'+(scaletime*(times[i]-zerotime))+'px;width:9px;height:70px;z-index:4;background-color:#DDD;"></div>');
            }    
            //if(i==0)
            //$('#notescolumn').append('<div onmouseover="showNote($(this));" onmouseout="hideNote();" note="'+notes[i]+'" style="cursor:pointer;position:absolute;margin-left:'+(scaletime*79200)+'px;width:1px;height:235px;background-color:#DDD;"></div>');
            
        }
       
    }

});

window.mouseX= 0;
window.mouseY= 0;

jQuery(document).ready(function(){
   $(document).mousemove(function(e){
      //$('#status').html(e.pageX +', '+ e.pageY);
      window.mouseX= e.pageX-330;
      window.mouseY= e.pageY-80;
   }); 
})

function showNote(object)
{
    //alert(object);
    //alert(object.attr('note'));
    $('#tooltip').html('<p>'+object.attr('note')+'</p>');
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
            .y(function(d) {
                var hms = ""+d.when;
                hms= hms.substring(16,24);
                console.log(hms);
                var a = hms.split(':'); // split it at the colons
                console.log(a);
                // minutes are worth 60 seconds. Hours are worth 60 minutes.
                var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
                offsets.push(seconds);
                console.log(+a[0]);
                console.log(+a[1]);
                console.log(+a[2]);
                console.log(seconds);
                //$('#notescolumn').append('<div style="width:20px;height:800px;background-color:#DDD;"></div>');
                //$('#chart-notes').append('<p>'+d.note+'</p>');
                //offsets.push(d.note); 
                //console.log(d.note);                
                return d.audio;
               })
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
            .y(function(d) { return d.isStressed; })
            .yDomain([0, 1]);
          d3.select('#chart-eda')
            .datum(data)
            .call(chartEDA);

    }

});

// location data
//spectrum array
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

var map = L.map('map').setView([42.44, -76.515], 14);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
             {attribution: 'Map data &copy; OpenStreetMap contributors',
              minZoom: 8,
              maxZoom: 18,
              
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
        var zerotime= 3600;//times[0];
        var maxtime= 79200;//86400-7200;//24*60*60;//times[times.length-1];
        var scaletime= 680/(maxtime-zerotime);
            lat = parseFloat(d.lat);
            lon = parseFloat(d.lon);
            circle = L.circleMarker([lat, lon]).addTo(map);
            circle.setRadius(5);
            var pointColor = getSpectrum(i, numPoints);
            circle.setStyle({
                color: pointColor,//'red',
                fill: true,
                //fillColor: '#f03',
                fillOpacity: 0.2,
            });
            circles.push(circle);
            $('#colorbars').append('<div id="colorbar'+i+'" onmouseover="highlightTime($(this),'+i+',\''+pointColor+'\');" onmouseout="unhighlightTime($(this), '+i+',\''+pointColor+'\');" color="'+getSpectrum(i, numPoints)+'" style="cursor:pointer;position:absolute;z-index:0;margin-left:'+(scaletime*(offsets[i]-zerotime))+'px;width:7px;height:775px;opacity:0;background-color:'+getSpectrum(i, numPoints)+';"></div>');
            
        });
    });
}

function highlightTime(object, i, pointColor)
{
    object.css('opacity', '0.3');
    //circles[i].bindPopup("hi").openPopup();
    circles[i].setRadius(10);
    circles[i].setStyle({
                color: pointColor,//'red',
                fill: true,
                //fillColor: '#f03',
                fillOpacity: 1,
            });
}

function unhighlightTime(object, i, pointColor)
{
    object.fadeTo(0,0);//('opacity', '0');
    circles[i].setRadius(5);
    circles[i].setStyle({
                color: pointColor,//'red',
                fill: true,
                //fillColor: '#f03',
                fillOpacity: 0.2,
            });
}



function getSpectrum(d, numPoints)
{
    var spectrumIndex = parseInt(d/numPoints*fullSpectrum.length);
    //alert(spectrumIndex);
    return fullSpectrum[spectrumIndex];
}
