// hackish... resolve!
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
            .y(function(d) { return parseInt(d.pam_pa); })
            .yDomain([1,16]);
          d3.select('#chart-affect')
            .datum(data)
            .call(chartAffect);
    }

});

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
            .y(function(d) { return d.audio; })
            .yDomain(['silence', 'noise', 'Voice Not-Stressed', 'Voice Stressed']);
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
var map = L.map('map').setView([42.44, -76.515], 14);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
             {attribution: 'Map data &copy; OpenStreetMap contributors',
              minZoom: 8,
              maxZoom: 18}).addTo(map);
fname = fnamebase + 'loc.5min.csv';
if (!urlExists(fname)) {
    console.log('no location data');
} else {
    d3.csv(fname, function(data) {
        var circle = null,
            lat = null,
            lon = null;
        data.forEach(function(d, i) {
            lat = parseFloat(d.lat);
            lon = parseFloat(d.lon);
            circle = L.circleMarker([lat, lon]).addTo(map);
            circle.setRadius(5);
            circle.setStyle({
                color: 'red',
                fill: true,
                fillColor: '#f03',
                fillOpacity: 0.2,
            });
        });
    });
}
