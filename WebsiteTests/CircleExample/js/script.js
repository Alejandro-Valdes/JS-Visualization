var svg = d3.select("#example").append('svg')
	.attr("width", 600)
	.attr("height", 600);

var data=[{"x": 100, "y": 100, "r": 20, "f":"red"}, 
	{"x": 20, "y": 25, "r":10, "f":"orange"},
	{"x": 400, "y": 55, "r":50, "f":"yellow"},
	{"x": 270, "y": 300, "r":40, "f":"purple"},
	{"x": 140, "y": 213, "r":12, "f":"pink"},]

svg.selectAll("circle")
    .data(data)
  .enter().append("circle")
    .attr("cx", function(d) { return d.x;})
    .attr("cy", function(d) { return d.y;})
    .attr("r", function(d) {return d.r;})
    .attr("fill", function(d) {return d.f;});

d3.select(".foo")

d3.selectAll(".foo")