function timeSeriesChart() {
    var w = 860,
        h = 150,
        margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;
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
        .x(function(d) { return xScale(d.when); })
        .y(function(d) { return yScale(d.stress_mellin); })
        .interpolate('linear');

    function chart(selection) {
        selection.each(function(data) {

            // TODO: parameterize the scale domains and the line() .y
            xScale.domain(d3.extent(data, function(d) { return d.when; }));
            yScale.domain([1, 5]);

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

    return chart;
}

//var chart = d3.select('#chart-stress-mellin').append('svg')
//    .attr('width', w)
//    .attr('height', h)
//  .append('g')
//    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.csv('./data/data.csv', function(data) {

    // finesse data
    var parseDate = d3.time.format.utc('%Y-%m-%d %H:%M:%S').parse;
    data.forEach(function(d, i) {
        d.stress = parseInt(d.stress);
        d.healthiness = parseInt(d.healthiness);
        d.utc = d.when;
        d.when = parseDate(d.when);  // in local time
    });

    // stress-mellin
    var chartStressMellin = timeSeriesChart()
    d3.select('#chart-stress-mellin')
        .datum(data)
        .call(chartStressMellin);

    //x.domain(d3.extent(data, function(d) { return d.when; }));
    //y.domain([1, 5]);

    //chart.append('g')
    //    .attr('class', 'x axis')
    //    .attr('transform', 'translate(0,' + height + ')')
    //    .call(xAxis);
    //chart.append('g')
    //    .attr('class', 'y axis')
    //    .call(yAxis);

    //chart.append('path')
    //    .data(data)
    //    .attr('class', 'dataline')
    //    .attr('d', line(data));

});
