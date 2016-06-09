var updateData; 
(function x() {
var margin = {top: 20, right: 180, bottom: 30, left: 50},
    width = 1080 - margin.left - margin.right,
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


var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#d0743c", "#ff8c00"]); 

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
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 


var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    var browser ;
d3.csv("depttwocopy.csv", function(error, data) {
    
    
  color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "date"&& key !== "pres"); }));
  
data.forEach(function(d) {
  	d.date = parseDate(d.date);
    d.pres = d.pres
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
          tooltip .html(d["name"] + "<br> <div style=\"display: inline-block; text-align: left;\">" + "1985: " + d["values"][0].y.toFixed(3) + "%" + "<br>" + "2000: " + d["values"][14].y.toFixed(3) + "%" + "<br>" + "2015: " + d["values"][29].y.toFixed(3) + "%" + "</div>")
               .style("left", ((d3.mouse(this))[0] + 50) + "px")
               .style("top", ((d3.mouse(this))[1] + 150) + "px");
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
      


    browser.filter(function(d){return(d.name != "Legislative" && d.name !="Judicial" && d.name != "Agriculture" && d.name != " Commerce" && d.name!="Energy" && d.name !="Homeland Security"&&
        d.name != "Housing and Urban Development" && d.name!="Interior"
        && d.name!="Justice"&& d.name!="Labor"&& d.name!="State"&& d.name!="Transportation"&& d.name!="Corps of Engineers--Civil Works"&& d.name!="Other Defense Civil Programs"&& d.name!="Executive Office of the President"  && d.name!="General Services Administration" && d.name!="International Assistance Programs" && d.name!="Office of Personnel Management" && d.name!="Small Business Administration" && d.name!="National Science Foundation")})
        .append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
      .attr("x", 10)
      .text(function(d) { return d.name; 
      //}
  });
    
    
      
    var myLine = browser.append("svg:line")
    .attr("x1", 2)
    .attr("y1", 0)
    .attr("x2", 2)
    .attr("y2", 450)
    .style("stroke", "rgb(240,40,0)");
    
     var myLine = browser.append("svg:line")
    .attr("x1", 100)
    .attr("y1", 0)
    .attr("x2", 100)
    .attr("y2", 450)
    .style("stroke", "rgb(240,40,0)");
    
     var myLine = browser.append("svg:line")
    .attr("x1", 198)
    .attr("y1", 0)
    .attr("x2", 198)
    .attr("y2", 450)
    .style("stroke", "rgb(240,40,0)");

    var myLine = browser.append("svg:line")
    .attr("x1", 200)
    .attr("y1", 0)
    .attr("x2", 200)
    .attr("y2", 450)
    .style("stroke", "rgb(0,40,240)");
    
    var myLine = browser.append("svg:line")
    .attr("x1", 320)
    .attr("y1", 0)
    .attr("x2", 320)
    .attr("y2", 450)
    .style("stroke", "rgb(0,40,240)");
    
    var myLine = browser.append("svg:line")
    .attr("x1", 450)
    .attr("y1", 0)
    .attr("x2", 450)
    .attr("y2", 450)
    .style("stroke", "rgb(0,40,240)");
    
    var myLine = browser.append("svg:line")
    .attr("x1", 452)
    .attr("y1", 0)
    .attr("x2", 452)
    .attr("y2", 450)
    .style("stroke", "rgb(240,40,0)");

    var myLine = browser.append("svg:line")
    .attr("x1", 553)
    .attr("y1", 0)
    .attr("x2", 553)
    .attr("y2", 450)
    .style("stroke", "rgb(240,40,0)");

    var myLine = browser.append("svg:line")
    .attr("x1", 655)
    .attr("y1", 0)
    .attr("x2", 654)
    .attr("y2", 450)
    .style("stroke", "rgb(240,40,0)");


    
    var myLine = browser.append("svg:line")
    .attr("x1", 656)
    .attr("y1", 0)
    .attr("x2", 656)
    .attr("y2", 450)
    .style("stroke", "rgb(0,40,240)");
    
     var myLine = browser.append("svg:line")
    .attr("x1", 755)
    .attr("y1", 0)
    .attr("x2", 755)
    .attr("y2", 450)
    .style("stroke", "rgb(0,40,240)");

    var myLine = browser.append("svg:line")
    .attr("x1", 848)
    .attr("y1", 0)
    .attr("x2", 848)
    .attr("y2", 450)
    .style("stroke", "rgb(0,40,240)");

  
    
    

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
           
        //this.browser.exit().remove();
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
        
       // var = 
            
        //browser.exit().transition(); 
    //   d3.selectAll("path") 
        browser.data(browsers).select("path").transition(40).duration(550).attr("d", function(d) { return area(d.values); });
        
        browser.data(browsers).select("text").transition(40).duration(550).attr("d", function(d) { return area(d.values); });
        
        

        //this line is supposed to remove the previous chart data
        /*browser.exit()
        .attr("class", "exit")
        .transition()
        .duration(750)
        //.attr("y", 60)
        //.style("fill-opacity", 1e-6)
        .remove();
        */
       // var k = 
       
        svg.select(".y.axis") // change the y axis
           // .duration(750)
            .call(yAxis);    
            
    }); 
}
    
    
    reloadData = function () {
        console.log("updated_called");
           
        //this.browser.exit().remove();
    // Get the data again
    d3.csv("depttwocopy.csv", function(error, data) {
         color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "date"&& key !== "pres"); }));
  
        data.forEach(function(d) {
  	     d.date = parseDate(d.date);
            d.pres = d.pres
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

       // var svg = d3.select("body").transition();
        
       // browser.exit().transition().remove();
        browser.data(browsers).select("path").transition().duration(550).attr("d", function(d) { return area(d.values); });

        //this line is supposed to remove the previous chart data
        /*browser.exit()
        .attr("class", "exit")
        .transition()
        .duration(750)
        //.attr("y", 60)
        //.style("fill-opacity", 1e-6)
        .remove();
        */
       // var k = 
       
        svg.select(".y.axis") // change the y axis
           // .duration(750)
            .call(yAxis);    
            
    }); 
}
    
    
    
    
    
    
    
    
    

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



