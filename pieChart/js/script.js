var width = 840,
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

var svg = d3.select(".chart")
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