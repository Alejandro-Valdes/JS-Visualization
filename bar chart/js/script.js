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

/**
*
*
*
PIE CHART
*
*
*
**/

var width = 500,
	height = 350,
	radius = Math.min(width, height)/2.2 - 20;

var data = [{name:"water", value:70}, 
			{name:"air", value:128}, 
			{name:"earth", value:16},
			{name:"fire", value:32},
			{name:"metal", value:64},
			{name:"blood", value:42},
			{name:"plant", value:8}];

// pie chart layout, will be used by d3's .data() function
// all d values accessed via d that are descendents of .data(pie(data))
// have an additional attribute .data
var pie = d3.layout.pie()
	.value(converter)  // function that extracts the value that define the pie chart
	.padAngle(0.02);

var arc = d3.svg.arc()
	.innerRadius(radius/2)
	.padRadius(radius); // use pad radius for correct scaling via animation

var svg = d3.select("#chart").append('svg')
	.attr("width", width)
	.attr("height", height);

var chart = svg.append("g")
		.attr("id", "pie-chart")
    	.attr("transform", "translate(" + width/2 + "," + height/2 + ")");

var infoText = chart.append("text")
	.attr("class", "info-text")
	.attr("dx", -(data[0].value).toString().length/4 + "em") // centers the text indepentend of the world length
	.attr("dy", "+0.5em") // vertical centering 
	.text(data[0].value); // only start value

var sections = chart.selectAll(".section")
		.data(pie(data)) // get the data from the pie chart layout created from our data
	.enter().append("g")
		.attr("class", "section");

// mapping function which maps the given domain onto a range by a specified hsl interpolation method
var colorScale = d3.scale.linear()
	//.domain([d3.min(data.value, function(d) { return d.value; }), d3.max(data.value, function(d) { return d.value; })])
	.domain([0, data.length])
	.range(["hsl(-180,50%,50%)", "hsl(180,50%,50%)"])
	.interpolate(interpolateHsl); // set interpolation function

// add our arcs
sections.append("path")
	.each(function(d,i) { // add outer radius var to data and save original color for transitions
		d.fillColor = colorScale(i);
		return d.outerRadius = radius;
	})
	.attr("d", arc) // arc as path attribute
	.style("fill", function(d) { return d.fillColor; })
	.on("mouseover", arcTweenOut(radius+20, 0))
	.on("mouseout", arcTweenIn(radius, 150));

//--- legend ---//
var btnLegend = svg.append("text")
	.attr("id", "btnLegend")
	.attr("transform", "translate(" + 20 + "," + 20 +")")
	.attr("cursor", "pointer")
	.text("Legend")
	.on("click", legendClicked);

var legend = svg.append("g")
	.attr("id", "legend")
	.attr("transform", "translate(" + 20 + "," + 40 +")");

var entries = legend.selectAll("g")
		.data(data)
	.enter().append("g")
		.attr("transform", function(d,i) { return "translate(" + 20 + "," + i*20 +")"; });

entries.append("text")
	.attr("dx", 5)
	.text(function(d)  { return d.name; });
entries.append("rect")
	.attr("x", -10)
	.attr("y", -10)
	.attr("width", 10)
	.attr("height", 10)
	.attr("rx", 2)
	.attr("ry", 2)
	.attr("fill", function(d,i) { return colorScale(i); });

//--- functions ---//
// arc in and arc out tween due to different color changes
function arcTweenOut(outerR, delay) {
	return function(d) {
		infoText.text(d.data.value)
			.attr("dx", -(d.data.value).toString().length/4 + "em");

		section = d3.select(this);

		section.style("fill", function(d) { return d.fillColor.darker(2); })
			.style("stroke", "#EEE")
			.style("stroke-width", "2.5px");

		section.transition()
			.delay(delay)
			.duration(500)
			.ease("bounce", "in-out")
			.attrTween("d", function(d) {
	      		var i = d3.interpolate(d.outerRadius, outerR);
	      		return function(t) { d.outerRadius = i(t); return arc(d); };
	      	});
	};
}

function arcTweenIn(outerR, delay) {
	return function(d) {
		infoText.text("");

		section = d3.select(this);

		section.style("fill", d.fillColor)
			.style("stroke", "#333")
			.style("stroke-width", "1.5px");

		section.transition()
			.delay(delay)
			.duration(500)
			.ease("bounce", "in-out")
			.attrTween("d", function(d) {
	      		var i = d3.interpolate(d.outerRadius, outerR);
	      		return function(t) { d.outerRadius = i(t); return arc(d); };
	      	});
	};
}

// special interpolation method for hsl values to avoiding shortest-path interpolation
function interpolateHsl(a, b) {
  var i = d3.interpolateString(a, b);
  return function(t) {
    return d3.hsl(i(t));
  };
}

// pie chart converter so that the layout extracts the right values
function converter(d) {
	return +d.value; // force cast to number value, just in case
}

function legendClicked() {
	var x = d3.transform(entries.attr("transform")).translate[0];

	if(x <= 0) {
		entries.each(function(d,i) {
			var entry = d3.select(this);

			entry.transition()
				.delay(i*100)
				.duration(500)
				.ease("elastic")
				.attr("transform", "translate(" + 20 + "," + d3.transform(entry.attr("transform")).translate[1] + ")");
		});
	} else {
		entries.each(function(d,i) {
			var entry = d3.select(this);

			entry.transition()
				.delay(i*100)
				.duration(500)
				.ease("elastic")
				.attr("transform", "translate(" + -200 + "," + d3.transform(entry.attr("transform")).translate[1] + ")");
		});
	}
}

