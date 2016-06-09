(function() {var width = 420,
    height = 420,
    // find the min of width and height and devided by 2
    radius = (Math.min(width, height) / 2.2 ) -40; 


var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#d0743c", "#ff8c00"]); 
//var color = d3.scale.category20();

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);
             
var labelArc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius );

// Constructs a new pie function
var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.smallf; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("pie2.csv", function(error, data) {

  // convert all population to integer
  data.forEach(function(d) {
    //d.late = +d.late;
    d.smallf= +d.smallf;
  });

  // append a group
  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  // append path, the pie for each age
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.branch2); });

  // add text
  g.append("text")
      .attr("transform", function(d) { 
      return "translate(" + labelArc.centroid(d) + ")"; })
      //.attr("dy", ".35em")
        .style("text-anchor", "middle")

      .text(function(d) { return d.data.branch2 + "    " + (d.data.smallf/ 773463*100).toFixed(4) + "%" ; });
    
    // d3.selectAll("input")
      //.on("change", change);

});


})();
