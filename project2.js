var updateData; 
(function x() {
var margin = {top: 20, right: 120, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var margin2 = {top: 20, right: 120, bottom: 30, left: 50},
    width2 = 960 - margin.left - margin.right,
    height2 = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;
    //formatPercent = d3.format(".0%");

var x = d3.time.scale()
//var x = d3.scale.linear()

    .domain([1985, 2015]) //Need to redefine this after loading the data
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0,100]) //Need to redfine this after loading the data
    .range([height, 0]);


var color = d3.scale.category20();

var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
    var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; });


   //Add zoom
    var zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([0, 100])
    .on("zoom", zoomed);
    
    

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
     .call(zoom); 


var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    var browser ;
d3.csv("depttwocopy.csv", function(error, data) {
    
    
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
  data.forEach(function(d) {
  	d.date = parseDate(d.date);
  });
    
    

  var browsers = stack(color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, y: d[name] * 1};
      })
    };
  }));

    var vals =0;
  // Find the value of the day with highest total value
  var maxDateVal = d3.max(data, function(d){
      vals = d3.keys(d).map(function(key){ return key !== "date" ? d[key] : 0 });
    //var yt = d3.sum(vals);, 
    return d3.sum(vals);
  });

  // Set domains for axes
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.sum(vals)])
 ""
  var presidents = {
    years:[1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
     party:["regan","regan","regan","regan","G.H.W. Bush","G.H.W. Bush","G.H.W. Bush","G.H.W. Bush", "Clinton","Clinton","Clinton","Clinton","Clinton","Clinton","Clinton","Clinton","G.W. Bush","G.W. Bush","G.W. Bush","G.W. Bush","G.W. Bush","G.W. Bush","G.W. Bush","G.W. Bush","Obama","Obama","Obama","Obama","Obama","Obama","Obama",]
}
  
  var unused=["Legislative Branch","Judicial Branch", "Department of Agriculture", "Department of Commerce", "Department of Veterans Affairs","Department of Education","Department of Energy"]

   browser = svg.selectAll(".browser")
      .data(browsers)
    .enter().append("g")
      .attr("class", "browser")
    .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
        }).on("mousemove", function(d) {
          tooltip .html(d["name"] + "<br>" + "1985: " + d["values"][0].y + "%" + "<br>" + "2000: " + d["values"][14].y + "%" + "<br>" + "1985: " + d["values"][29].y + "%" )
               .style("left", ((d3.mouse(this))[0]) + "px")
               .style("top", ((d3.mouse(this))[1]) + "px");
        })
        .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
        });
    
   // var =["a", "b", "c","d","e","f","g","h", "i", "j","k"]


  browser.append("path")
      .attr("class", "area")
      .attr("d", function(d) { return area(d.values); })
      /*.on("click", function(){
         var newpath = browser.append("path")
                        .attr("class", "line")
                    .attr("d", function(d) { return line(d.values); })
                    .style("stroke", function(d) { return color(d.name);
                                                 })
         })*/
      .style("fill", function(d) { return color(d.name); });
      

    //append text to the graph
  browser.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
      .attr("x", 10)
      .text(function(d) {/* 
      if(unused.indexOf(return d.name)==-1){
          return " "
      }
      else{     */   
        return d.name; 
      //}
  });

 //x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 30)
        .attr("x", 380)
        .style("text-anchor", "end")
        .attr("font-size", "16px")
        .text("Year");

    
    //Y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -100)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "16px")
        .text("Department's Share of Overall US Budget");
});

    /*function returnNames(function(d)){
        if d.name.length==1{
            return " ";
        }
        else{
            return d.name;
        }
    }*/

    
    updateData = function () {
        console.log("updated_called");
            //    browser.exit().remove();

    // Get the data again
        d3.csv("deptsmall.csv", function(error, data) {
            
            color.domain(d3.keys(data[0]).filter(function(key) { return     key !== "date"; }));
                data.forEach(function(d) {
                    d.date = parseDate(d.date);
                    });

            var browsers = stack(color.domain().map(function(name) {
            return {
                name: name,
                    values: data.map(function(d) {
                        return {date: d.date, y: d[name] * 1};})
                        };
                    }));

            //had to change this function around so that 
            //it would only find highest value and not sum them up. 
            var vals =0;
            // Find the value of the branch with highest total value
            var maxDateVal = d3.max(data, function(d){
                vals = d3.keys(d).map(function(key){ return key !== "date" ? d[key] : 0 });
            //var yt = d3.sum(vals);
            return d3.sum(vals);
                });

  // Set domains for axes
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([0, d3.sum(vals)])
     
           // var svg = d3.select("body").transition();
            browser.data(browsers).select("path").transition().duration(550).attr("d", function(d) { return area(d.values); });
            
    // Make the changes
        /*browser.select(".browser") 
            .transition()  // change the line
            .duration(750)
            .attr("d", function(d) { return area(d.values); })*/
            //.attr("d", stack(data))
        ;
       
        svg.select(".y.axis") // change the y axis
           // .duration(750)
            .call(yAxis);
            
    
            
            
    });   
}
    //return(updateData());

        //Zoom function 
       function zoomed() {
         svg.select(".x.axis").call(xAxis);
         svg.select(".y.axis").call(yAxis);
         //browser.select("text")
         svg.selectAll("path")
         .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
           //browser.select("text")
       }

})();

x();


/*
function arrangeLabels() {
  var move = 1;
  while(move > 0) {
    move = 0;
    svg.selectAll(".place-label")
       .each(function() {
         var that = this,
             a = this.getBoundingClientRect();
         svg.selectAll(".place-label")
            .each(function() {
              if(this != that) {
                var b = this.getBoundingClientRect();
                if((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) &&
                   (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {
                  // overlap, move labels
                  var dx = (Math.max(0, a.right - b.left) +
                           Math.min(0, a.left - b.right)) * 0.01,
                      dy = (Math.max(0, a.bottom - b.top) +
                           Math.min(0, a.top - b.bottom)) * 0.02,
                      tt = d3.transform(d3.select(this).attr("transform")),
                      to = d3.transform(d3.select(that).attr("transform"));
                  move += Math.abs(dx) + Math.abs(dy);
                
                  to.translate = [ to.translate[0] + dx, to.translate[1] + dy ];
                  tt.translate = [ tt.translate[0] - dx, tt.translate[1] - dy ];
                  d3.select(this).attr("transform", "translate(" + tt.translate + ")");
                  d3.select(that).attr("transform", "translate(" + to.translate + ")");
                  a = this.getBoundingClientRect();
                }
              }
            });
       });
  }
}
*/