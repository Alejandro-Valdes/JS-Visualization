/**
*
*
*
BAR CHART
*
*
*
**/
var dataBarChart = [40,50,10,30,21,12,38,123,124, 200, 150, 165, 180, 200, 220, 240, 270, 300];

var margin = {top:30, right:10, bottom: 30, left:50};

//the dimensions of the svg barchart
var height = 325 - margin.top - margin.bottom, 
	width = 500 - margin.left - margin.right;

//width and offset of each bar
var barWidth = 40;//, barOffset = 6;
var eventColor;

//scale along the y axis scale.linear
var yScale = d3.scale.linear()
	.domain([0, d3.max(dataBarChart)])
	.range([0,height]);

//scale along the x axis scale.ordinal
var xScale = d3.scale.ordinal()
	.domain(d3.range(0,dataBarChart.length))
	.rangeBands([0,width]);

var barChart = d3.select("#barChart").append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  //.style('background', color)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
  .selectAll('rect').data(dataBarChart)
  .enter().append('rect')
    .style({'fill': '#1ABC9C', 'stroke': '#3498DB', 'stroke-width': '4'})
    .attr('width', xScale.rangeBand())
    .attr('height', 0) //important for the animation
    .attr('x', function(d,i){
    	return xScale(i);
    })
    .attr('y', height)//animation
    .on('mouseover', function(d) {
    	eventColor = this.style.fill; //save it for later
    	d3.select(this)
    		.style('fill', '#E74C3C')
    })
    .on('mouseout', function(d) {
    	d3.select(this)
    		.style('fill', eventColor)
    });

barChart.transition()
	.attr('height', function(d){
		return yScale(d);
	})
	.attr('y', function(d){
    	return height-yScale(d);
    })
    .delay(function(d,i) {
    	return i*10;
    })
    .duration(1000)
    //.ease('elastic');

//visual legend

var verticalLegendScale = d3.scale.linear()
	.domain([0, d3.max(dataBarChart)])
	.range([height, 0]);

var yAxis = d3.svg.axis()
	.scale(verticalLegendScale)
	.orient('left')
	.ticks(10);

var verticalLegend = d3.select('svg').append('g');
yAxis(verticalLegend)
verticalLegend.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
verticalLegend.selectAll('path')
    .style({fill: 'none', stroke: "#fff"})
verticalLegend.selectAll('line')
    .style({stroke: "#fff"})
verticalLegend.selectAll('text')
    .style({stroke: "#fff"});
 
var xAvis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(dataBarChart.size)
 
var horizontalLegend = d3.select('svg').append('g')
xAvis(horizontalLegend)
horizontalLegend.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
horizontalLegend.selectAll('path')
    .style({fill: 'none', stroke: "#fff"})
horizontalLegend.selectAll('line')
    .style({stroke: "#fff"});
horizontalLegend.selectAll('text')
    .style({stroke: "#fff"});


