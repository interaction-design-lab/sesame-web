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

    // finesse data
    var parseDate = d3.time.format('%Y-%m-%d %H:%M:%S').parse;
    data.forEach(function(d, i) {
        d.stress = parseInt(d.stress);
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
