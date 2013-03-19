var getParams = function() {
    params = {};
    paramstr = window.location.search.substr(1);
    if (paramstr == '') {
        alert('required GET params: uid, day');
    }
    paramstr.split('&').forEach(function(param) {
        bits = param.split('=');
        params[bits[0]] = bits[1];
    });
    return params;
};

var params = getParams();
fnamebase = './data/uid'+params.uid+'-day'+params.day+'.';

d3.csv(fnamebase + 'selfreport.5min.csv', function(data) {

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

    // set user and date strings
    theDate = moment(data[0].when);
    $('#the-date').text(theDate.format('dddd, MMMM Do'));
    $('#the-user').text('userID ' + data[0].user_id);

});

d3.csv(fnamebase + 'accel.5min.csv', function(data) {

    // finesse data
    var parseDate = d3.time.format('%Y-%m-%d %H:%M:%S').parse;
    data.forEach(function(d, i) {
        d.when = parseDate(d.when);  // in local time
    });

    // self-report stress
    var chartActivity = timeSeriesCategorical()
        .x(function(d) { return d.when; })
        .y(function(d) { return d.activity; })
        .yDomain([0, 1]);
      d3.select('#chart-activity')
        .datum(data)
        .call(chartActivity);

});

d3.csv(fnamebase + 'audio.5min.csv', function(data) {

    // finesse data
    var parseDate = d3.time.format('%Y-%m-%d %H:%M:%S').parse;
    data.forEach(function(d, i) {
        d.when = parseDate(d.when);  // in local time
    });

    // self-report stress
    var chartAudio = timeSeriesCategorical()
        .x(function(d) { return d.when; })
        .y(function(d) { return d.audio; })
        .yDomain([0, 1]);
      d3.select('#chart-audio')
        .datum(data)
        .call(chartAudio);

});

// map!
var map = L.map('map').setView([42.44, -76.515], 14);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
             {attribution: 'Map data &copy; OpenStreetMap contributors',
              minZoom: 8,
              maxZoom: 18}).addTo(map);
d3.csv(fnamebase + 'loc.5min.csv', function(data) {
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
