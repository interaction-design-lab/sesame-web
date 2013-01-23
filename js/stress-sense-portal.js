// chart
var chart = timeSeriesChart()
    .x(function(d) { return d.when; })
    .y(function(d) { return d.stress; });

// load data and bind to chart
d3.csv('./data/data.csv', function(data) {

    // vars setup
    var format = d3.time.format.utc('%Y-%m-%d %H:%M:%S'),
        w = 815,
        h = 500;

    // finesse data
    data.forEach(function(d, i) {
        d.stress = parseInt(d.stress);
        d.healthiness = parseInt(d.healthiness);
        d.utc = d.when;
        d.when = format.parse(d.when);  // in local time
        console.log(d);
    });

    d3.select('#chart-stress svg')
        .datum(data)
        .call(chart);


});





//var data = [4, 8, 15, 16, 23, 42]
//
//var chart = d3.select('svg')
//    .attr('class', 'chart')
//    .attr('width', 440)
//    .attr('height', 20 * (data.length+1))
//  .append('g')
//    .attr('transform', 'translate(10,15)');
//
//var x = d3.scale.linear()
//    .domain([0, d3.max(data)])
//    .range([0, 420]);
//var y = d3.scale.ordinal()
//    .domain(data)
//    .rangeBands([0, 120]);
//
//chart.selectAll('line')
//    .data(x.ticks(10))
//    .enter().append('line')
//    .attr('x1', x)
//    .attr('y1', 0)
//    .attr('x2', x)
//    .attr('y2', 120)
//    .style('stroke', '#ccc');
//
//chart.selectAll('rect')
//    .data(data)
//    .enter().append('rect')
//    .attr('y', function(d, i) { return i * 20; })
//    .attr('width', x)
//    .attr('height', y.rangeBand());
//
//chart.selectAll('text')
//    .data(data)
//    .enter().append('text')
//    .attr('x', x)
//    .attr('y', function(d) { return y(d) + y.rangeBand() / 2; })
//    .attr('dx', -3)  // padding-right
//    .attr('dy', '.35em')  // vertical-align: middle
//    .attr('text-anchor', 'end')  // text-align: right
//    .text(String);
//
//chart.append('line')
//    .attr('y1', 0)
//    .attr('y2', 120)
//    .style('stroke', 'black');
//chart.selectAll('.rule')
//    .data(x.ticks(10))
//    .enter().append('text')
//    .attr('class', 'rule')
//    .attr('x', x)
//    .attr('y', 0)
//    .attr('dy', -3)
//    .attr('text-anchor', 'middle')
//    .text(String);
