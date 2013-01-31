function timeSeriesChart() {
    var w = 860,
        h = 120,
        margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;
    var xValue = function(d) { return d[0]; },
        yValue = function(d) { return d[1]; };
    var yDomain = null;
    var xScale = d3.time.scale()
        .range([0, width]);
    var yScale = d3.scale.linear()
        .rangeRound([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSubdivide(1)
        .tickSize(-height)
        .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(5)
        .orient('left');
    var line = d3.svg.line()
        .x(function(d) { return xScale(d[0]); })
        .y(function(d) { return yScale(d[1]); })
        .interpolate('linear');

    function chart(selection) {
        selection.each(function(data) {

            // convert data to standard representation
            data = data.map(function(d, i) {
                return [xValue.call(data, d, i), yValue.call(data, d, i)];
                //return d;
            });

            // scale the x and y domains based on the actual data
            xScale.domain(d3.extent(data, function(d) { return d[0]; }));
            if (!yDomain) {
                yScale.domain(d3.extent(data, function(d) { return d[1]; }));
            } else {
                yScale.domain(yDomain);
            }

            // create chart space as svg
            // note: 'this' el should not contain svg already
            var svg = d3.select(this).append('svg').data(data);

            // external dimensions
            svg.attr('width', w)
                .attr('height', h);

            // internal dimensions
            svg = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // x axis
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            // y axis
            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis);

            // data path
            svg.append('path')
                .data(data)
                .attr('class', 'dataline')
                .attr('d', line(data));

        });
    }

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };

    chart.yDomain = function(_) {
        if (!arguments.length) return yDomain;
        yDomain = _;
        return chart;
    };

    return chart;
}

d3.csv('./data/data.csv', function(data) {

    // finesse data
    var parseDate = d3.time.format.utc('%Y-%m-%d %H:%M:%S').parse;
    data.forEach(function(d, i) {
        d.stress_mellin = parseInt(d.stress_mellin);
        d.healthiness = parseInt(d.healthiness);
        d.utc = d.when;
        d.when = parseDate(d.when);  // in local time
    });

    // stress-mellin
    var chartStressMellin = timeSeriesChart()
        .x(function(d) { return d.when; })
        .y(function(d) { return d.stress_mellin; })
        .yDomain([1, 5]);
    d3.select('#chart-stress-mellin')
        .datum(data)
        .call(chartStressMellin);

    // pam-pa
    var chartPAM = timeSeriesChart()
        .x(function(d) { return d.when; })
        .y(function(d) { return d.pam_pa; })
        .yDomain([1,16]);
    d3.select('#chart-pam-pa')
        .datum(data)
        .call(chartPAM);

    // healthiness
    var chartHealthiness = timeSeriesChart()
        .x(function(d) { return d.when; })
        .y(function(d) { return d.healthiness; })
        .yDomain([-3,3]);
    d3.select('#chart-healthiness')
        .datum(data)
        .call(chartHealthiness);

});
