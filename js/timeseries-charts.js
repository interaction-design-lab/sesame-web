// Time Series Charts
// Phil Adams (http://philadams.net)
// Cornell Interaction Design Lab (http://idl.cornell.edu)
// Reusable elements built with D3 (http://d3js.org)
// Based on http://bost.ocks.org/mike/chart/

// insert entries into data for start/finish of day (d3 axes hack)
//var insertDayStartAndEnd = function(data) {
//    var start = {},
//        tmp = data[0];
//        w = tmp.when;
//    start.when = new Date(w.getFullYear(), w.getMonth(), w.getDate());
//    start.pam_pa = 0; start.stress = 0;
//    start.note = ''; start.user_id = tmp.user_id;
//    var end = {},
//        w = data[0].when;
//    end.when = new Date(w.getFullYear(), w.getMonth(), w.getDate(), 23, 59);
//    end.pam_pa = 0; end.stress = 0; end.note = '';
//    end.user_id = tmp.user_id;
//    data.splice(0, 0, start);
//    data.splice(data.length, 0, end);
//    return data;
//}

function timeSeriesLine() {
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

function timeSeriesCategorical() {
    var w = 860,
        h = 70,
        margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;
    var xValue = function(d) { return d[0]; },
        yValue = function(d) { return d[1]; };
    var yDomain = null;
    var xScale = d3.time.scale()
        .range([0, width]);
    var yScale = d3.scale.category20();
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSubdivide(1)
        .tickSize(-height)
        .orient('bottom');
    var binwidth = 20;

    function chart(selection) {
        selection.each(function(data) {

            // convert data to standard representation
            data = data.map(function(d, i) {
                return [xValue.call(data, d, i), yValue.call(data, d, i)];
            });

            // scale the x and y domains based on the actual data
            //xScale.domain(d3.extent(data, function(d) { return d[0]; }));
            // TODO fix this hack setting domain to full day
            var td = data[0][0];
            dayStart = new Date(td.getFullYear(), td.getMonth(), td.getDate());
            dayEnd = new Date(td.getFullYear(), td.getMonth(), td.getDate(),
                              23, 59, 59, 999);
            xScale.domain([dayStart, dayEnd]);
            if (!yDomain) {
                yScale.domain(d3.extent(data, function(d) { return d[1]; }));
            } else {
                yScale.domain(yDomain);
            }

            // compute binwidths for TODO better comment
            // d looks like {timestamp, category}
            data.forEach(function(d, i) {
                if (data[i+1]) {
                    w_current = xScale(data[i][0]);
                    w_next = xScale(data[i+1][0]);
                    binwidth = w_next - w_current;
                }
                d.binwidth = binwidth;
            });

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

            // bars
            var bars = svg.append('g');
            bars.selectAll('rect')
                .data(data)
              .enter().append('rect')
                .attr('x', function(d, i) { return xScale(d[0]); })
                .attr('width', function(d, i) { return d.binwidth; })
                .attr('height', height)
                .attr('fill', function(d, i) { return yScale(d[1]); })
                .attr('stroke', function(d, i) { return yScale(d[1]); });

            // bars legend
            var legendData = [],
                legendFields = {};
            data.forEach(function(d) {
                if (!(d[1] in legendFields)) {
                    legendData.push([d[1], yScale(d[1])]);
                    legendFields[d[1]] = 1;
                }
            });
            var legend = svg.append('g')
                .attr('class', 'legend')
                .attr('height', 10)
                .attr('width', w)
                .attr('transform', 'translate(-30, -30)')
                .style('background', 'black');
            legend.selectAll('rect')
                .data(legendData)
              .enter().append('rect')
                .attr('x', function(d, i) { return i * 150; })
                .attr('y', 10)
                .attr('width', 10)
                .attr('height', 10)
                .style('fill', function(d) { return d[1]; });
            legend.selectAll('text')
                .data(legendData)
              .enter().append('text')
                .attr('x', function(d, i) { return i * 150 + 20; })
                .attr('y', 20)
                .text(function(d) { return d[0]; });

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

function timeSeriesBar() {
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
        .rangeRound([height, 0])
        .clamp(true);
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSubdivide(1)
        .tickSize(-height)
        .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(5)
        .orient('left');
    var binwidth = 10;

    function chart(selection) {
        selection.each(function(data) {

            // convert data to standard representation
            data = data.map(function(d, i) {
                return [xValue.call(data, d, i), yValue.call(data, d, i)];
            });

            // scale the x and y domains based on the actual data
            //xScale.domain(d3.extent(data, function(d) { return d[0]; }));
            // TODO: fix this hack (explicitly setting range to one day)
            var td = data[0][0];
            dayStart = new Date(td.getFullYear(), td.getMonth(), td.getDate());
            dayEnd = new Date(td.getFullYear(), td.getMonth(), td.getDate(),
                              23, 59, 59, 999);
            xScale.domain([dayStart, dayEnd]);
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

            // bars
            var bars = svg.append('g');
            bars.selectAll('rect')
                .data(data)
              .enter().append('rect')
                .attr('x', function(d, i) { return xScale(d[0]) - .5; })
                //.attr('y', function(d) { return height - yScale(d[1]) - .5; })
                .attr('y', function(d) { return yScale(d[1]) - .5; })
                //.attr('y', 10)
                .attr('width', binwidth)
                .attr('height', function(d) { return height - yScale(d[1]); })
                .attr('fill', 'steelblue')
                .attr('stroke', 'white');

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
