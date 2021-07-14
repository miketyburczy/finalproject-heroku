console.log("this is where it begins")


d3.csv("./static/data/bitcoin.csv", function (data) {
    console.log(data)

    var dates = [];
    var openPrice = [];
    var closePrice = [];
    var high = [];
    var low = [];
    var volume = [];

    for (var i = 0; i < data.length; i++) {
        // console.log(data[i]);
        dates.push(data[i].Date);
        openPrice.push(parseInt(data[i].Mid));
        closePrice.push(parseInt(data[i].Last));
        high.push(parseInt(data[i].High));
        low.push(parseInt(data[i].Low));
        volume.push(parseInt(data[i].Volume));

    };

    // console.log(Math.min.apply(null, closePrice));

    // console.log(dates);
    // console.log(openPrice);
    // console.log(closePrice);
    // console.log(high);
    // console.log(low);
    // console.log(volume);

    var trace1 = {
        type: "candlestick",
        x: dates,
        high: high,
        low: low,
        open: openPrice,
        close: closePrice
    };

    var trace2 = {
        type: "line",
        x: dates,
        y: closePrice,
        line:{color:"#ffbd00"},
    };



    data = [trace1, trace2];


    var updatemenus = [{
        buttons: [{
            args: [{ 'visible': [true, false] }],
            label: 'OHLC',
            method: 'update'
        }, {
            args: [{ 'visible': [false, true] }],
            label: 'Line',
            method: 'update',
            showgrid:false
        }],
        direction: "left",
        pad: { 'r': 10, 't': 10 },
        showactive: true,
        type: 'buttons',
        x: 0,
        xanchor: 'left',
        y: 1.38,
        yanchor: 'top'
    }]

    layout = {
        dragmode: "zoom",
        showlegend: false,
        autosize: true,
        height: 550,
        margin:{l:40,r:80,t:200,b:35},
        paper_bgcolor:"#121b27",
        plot_bgcolor: "#121b27",
        updatemenus: updatemenus,
        title:{
            text:`Bitcoin (BTC) - Price<br>$${closePrice[0]}`,
            font:{color:"#ffbd00", size:24},
            x:0.03,
            y:0.93,
        },
        
        yaxis: {
            range: [Math.min.apply(null, closePrice), Math.max.apply(null, closePrice)],
            gridcolor: "#C0C0C0",
            gridwidth: 1.2,
            showline:true,
            color: "#C0C0C0",
        },
        xaxis: {
            range: ["2021-06-01", "2021-07-01"],
            autorange: "true",
            showline:true,
            color: "#C0C0C0",
            rangeslider: {
                visible: false
            },
            gridcolor: "#C0C0C0",
            gridwidth: 1.2,
            rangeselector: {
                x: 0,
                y: 1.11,
                xanchor: 'left',
                font: { size: 14 },
                buttons: [{
                    step: 'day',
                    stepmode: 'backward',
                    count: 5,
                    label: '5 Day',
                }, {
                    step: 'month',
                    stepmode: 'backward',
                    count: 1,
                    label: '1 Month'
                }, {
                    step: 'month',
                    stepmode: 'backward',
                    count: 3,
                    label: '3 Month'
                }, {
                    step: 'month',
                    stepmode: 'backward',
                    count: 6,
                    label: '6 Months'
                }, {
                    step: 'month',
                    stepmode: 'backward',
                    count: 12,
                    label: '1  Year'
                }, {
                    step: 'year',
                    stepmode: 'backward',
                    count: 5,
                    label: '5 Year'
                }, {
                    step: 'all',
                    label: 'All'
                }]
            },
        },

    };





    var config = { responsive: true }

    Plotly.newPlot("graph", data, layout);



});

d3.csv("./static/data/average_volume.csv", function (d) {
    console.log(d);

    var year = [];
    var year_vol = [];

    for (var j = 0; j<d.length; j++){
        year.push(d[j].Year);
        year_vol.push(parseInt(d[j].Average_Volume))
    }

    console.log(year);
    console.log(year_vol)

    var trace3 = {
        values: year_vol,
        labels: year,
        type: 'pie',
        textinfo:"label+value",
        textposition:"outside"
    };

    data2=[trace3]

    var pie_layout = {
        autosize: true,
        height: 550,
        paper_bgcolor:"#121b27",
        plot_bgcolor: "#121b27",
        showlegend: false,
        title:{
            text:"Average Volume<br>Traded per Year",
            font:{
                size:22,
                color:"#ffbd00"
            },
            x:0.5,
            y:1.1
        },
        font:{
            size:18,
            color:"#C0C0C0",
        },
    };

    data2 = [trace3];

    var config = { responsive: true }

    Plotly.newPlot("graph2", data2, pie_layout)
});

// Mike Tyburczy Graph //


var m = [70, 70, 100, 70],
    w = 960 - m[1] - m[3],
    h = 500 - m[0] - m[2];
    padding = 100;

var x,
    y,
    duration = 4000,
    delay = 500;

var color = d3.scale.category10();

var svg = d3.select("#graph3").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

var stocks,
    symbols;

// A line generator, for the dark stroke.
var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

// A line generator, for the dark stroke.
var axis = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(h);

// A area generator, for the dark stroke.
var area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y1(function(d) { return y(d.price); });

d3.csv("./static/data/combined2.csv", function(data) {
  var parse = d3.time.format("%b %Y").parse;
  console.log(data);

  // Nest stock values by symbol.
  symbols = d3.nest()
      .key(function(d) { return d.symbol; })
      .entries(stocks = data);

  // Parse dates and numbers. We assume values are sorted by date.
  // Also compute the max price per symbol, needed for the y-domain.
  symbols.forEach(function(s) {
    s.values.forEach(function(d) { d.date = parse(d.date); d.price = +d.price; });
    s.maxPrice = d3.max(s.values, function(d) { return d.price; });
    s.sumPrice = d3.sum(s.values, function(d) { return d.price; });
  });

  // Sort by max price, descending.
  symbols.sort(function(a, b) { return b.maxPrice - a.maxPrice; });

  var g = svg.selectAll("g")
      .data(symbols)
    .enter().append("g")
      .attr("class", "symbol");

  setTimeout(lines, duration);
});

function lines() {
  x = d3.time.scale().range([0, w - 60]);
  y = d3.scale.linear().range([h / 4 - 20, 0]);

  // Compute the minimum and maximum date across symbols.
  x.domain([
    d3.min(symbols, function(d) { return d.values[0].date; }),
    d3.max(symbols, function(d) { return d.values[d.values.length - 1].date; })
  ]);

  var  date_format = d3.time.format("%m/%y");

  var x_axis = d3.svg.axis()
    .orient("bottom")
    .scale(x)
    .tickFormat(date_format)
    

  svg.append("g")
    .attr("transform", "translate(0," + (h + 100 - padding) + ")")
    .text("Dates")
    .style("font", "10px times")
    .style({ 'stroke': 'white', 'fill': 'white', 'stroke-width': '0.5px'})
    .call(x_axis);

  svg.append("text")
    .attr("text-anchor", "middle") 
    .attr("transform", "translate(" + (padding-125) + "," + (h / 2) + ")rotate(-90)") 
    .text("Price");

  svg.append("text")
    .attr("text-anchor", "middle") 
    .attr("transform", "translate(" + (w / 2) + "," + (h + 80 - (padding / 3)) + ")")
    .text("Time")

  svg.append("text")
    .attr("x", (w / 2))             
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Price Over Previous 5 Years");

  var g = svg.selectAll(".symbol")
      .attr("transform", function(d, i) { return "translate(0," + (i * h / 4 + 10) + ")"; });


  g.each(function(d) {
    var e = d3.select(this);

    e.append("path")
        .attr("class", "line");

    e.append("circle")
        .attr("r", 5)
        .style("fill", function(d) { return color(d.key); })
        .style("stroke", "#000")
        .style("stroke-width", "2px");

    e.append("text")
        .attr("x", 12)
        .attr("dy", ".31em")
        .text(d.key);
  });

  function draw(k) {
    g.each(function(d) {
      var e = d3.select(this);
      y.domain([0, d.maxPrice]);

      e.select("path")
          .attr("d", function(d) { return line(d.values.slice(0, k + 1)); });

      e.selectAll("circle, text")
          .data(function(d) { return [d.values[k], d.values[k]]; })
          .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.price) + ")"; });
    });
  }

  var k = 1, n = symbols[0].values.length;
  d3.timer(function() {
    draw(k);
    if ((k += 2) >= n - 1) {
      draw(n - 1);
      setTimeout(horizons, 500);
      return true;
    }
  });
}

function horizons() {
  svg.insert("defs", ".symbol")
    .append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", w)
      .attr("height", h / 4 - 20);

  var color = d3.scale.ordinal()
      .range(["#c6dbef", "#9ecae1", "#6baed6"]);

  var g = svg.selectAll(".symbol")
      .attr("clip-path", "url(#clip)");

  area
      .y0(h / 4 - 20);

  g.select("circle").transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + (w - 60) + "," + (-h / 4) + ")"; })
      .remove();

  g.select("text").transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + (w - 60) + "," + (h / 4 - 20) + ")"; })
      .attr("dy", "0em");

  g.each(function(d) {
    y.domain([0, d.maxPrice]);

    d3.select(this).selectAll(".area")
        .data(d3.range(3))
      .enter().insert("path", ".line")
        .attr("class", "area")
        .attr("transform", function(d) { return "translate(0," + (d * (h / 4 - 20)) + ")"; })
        .attr("d", area(d.values))
        .style("fill", function(d, i) { return color(i); })
        .style("fill-opacity", 1e-6);

    y.domain([0, d.maxPrice / 3]);

    d3.select(this).selectAll(".line").transition()
        .duration(duration)
        .attr("d", line(d.values))
        .style("stroke-opacity", 1e-6);

    d3.select(this).selectAll(".area").transition()
        .duration(duration)
        .style("fill-opacity", 1)
        .attr("d", area(d.values))
        .each("end", function() { d3.select(this).style("fill-opacity", null); });
  });

  setTimeout(areas, duration + delay);
}

function areas() {
  var g = svg.selectAll(".symbol");

  axis
      .y(h / 4 - 21);

  g.select(".line")
      .attr("d", function(d) { return axis(d.values); });

  g.each(function(d) {
    y.domain([0, d.maxPrice]);

    d3.select(this).select(".line").transition()
        .duration(duration)
        .style("stroke-opacity", 1)
        .each("end", function() { d3.select(this).style("stroke-opacity", null); });

    d3.select(this).selectAll(".area")
        .filter(function(d, i) { return i; })
      .transition()
        .duration(duration)
        .style("fill-opacity", 1e-6)
        .attr("d", area(d.values))
        .remove();

    d3.select(this).selectAll(".area")
        .filter(function(d, i) { return !i; })
      .transition()
        .duration(duration)
        .style("fill", color(d.key))
        .attr("d", area(d.values));
  });

  svg.select("defs").transition()
      .duration(duration)
      .remove();

  g.transition()
      .duration(duration)
      .each("end", function() { d3.select(this).attr("clip-path", null); });

  setTimeout(stackedArea, duration + delay);
}

function stackedArea() {
  var stack = d3.layout.stack()
      .values(function(d) { return d.values; })
      .x(function(d) { return d.date; })
      .y(function(d) { return d.price; })
      .out(function(d, y0, y) { d.price0 = y0; })
      .order("reverse");

  stack(symbols);

  y
      .domain([0, d3.max(symbols[0].values.map(function(d) { return d.price + d.price0; }))])
      .range([h, 0]);

  line
      .y(function(d) { return y(d.price0); });

  area
      .y0(function(d) { return y(d.price0); })
      .y1(function(d) { return y(d.price0 + d.price); });

  var t = svg.selectAll(".symbol").transition()
      .duration(duration)
      .attr("transform", "translate(0,0)")
      .each("end", function() { d3.select(this).attr("transform", null); });

  t.select("path.area")
      .attr("d", function(d) { return area(d.values); });

  t.select("path.line")
      .style("stroke-opacity", function(d, i) { return i < 3 ? 1e-6 : 1; })
      .attr("d", function(d) { return line(d.values); });

  t.select("text")
      .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price / 2 + d.price0) + ")"; });

  setTimeout(overlappingArea, duration + delay);
}

function overlappingArea() {
  var g = svg.selectAll(".symbol");

  line
      .y(function(d) { return y(d.price0 + d.price); });

  g.select(".line")
      .attr("d", function(d) { return line(d.values); });

  y
      .domain([0, d3.max(symbols.map(function(d) { return d.maxPrice; }))])
      .range([h, 0]);

  area
      .y0(h)
      .y1(function(d) { return y(d.price); });

  line
      .y(function(d) { return y(d.price); });

  var t = g.transition()
      .duration(duration);

  t.select(".line")
      .style("stroke-opacity", 1)
      .attr("d", function(d) { return line(d.values); });

  t.select(".area")
      .style("fill-opacity", .5)
      .attr("d", function(d) { return area(d.values); });

  t.select("text")
      .attr("dy", ".31em")
      .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price) + ")"; });

  svg.append("line")
      .attr("class", "line")
      .attr("x1", 0)
      .attr("x2", w - 60)
      .attr("y1", h)
      .attr("y2", h)
      .style("stroke-opacity", 1e-6)
    .transition()
      .duration(duration)
      .style("stroke-opacity", 1);

  setTimeout(groupedBar, duration + delay);
}

function groupedBar() {
  x = d3.scale.ordinal()
      .domain(symbols[0].values.map(function(d) { return d.date; }))
      .rangeBands([0, w - 60], .1);

  var x1 = d3.scale.ordinal()
      .domain(symbols.map(function(d) { return d.key; }))
      .rangeBands([0, x.rangeBand()]);

  var g = svg.selectAll(".symbol");

  var t = g.transition()
      .duration(duration);

  t.select(".line")
      .style("stroke-opacity", 1e-6)
      .remove();

  t.select(".area")
      .style("fill-opacity", 1e-6)
      .remove();

  g.each(function(p, j) {
    d3.select(this).selectAll("rect")
        .data(function(d) { return d.values; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.date) + x1(p.key); })
        .attr("y", function(d) { return y(d.price); })
        .attr("width", x1.rangeBand())
        .attr("height", function(d) { return h - y(d.price); })
        .style("fill", color(p.key))
        .style("fill-opacity", 1e-6)
      .transition()
        .duration(duration)
        .style("fill-opacity", 1);
  });

  setTimeout(stackedBar, duration + delay);
}

function stackedBar() {
  x.rangeRoundBands([0, w - 60], .1);

  var stack = d3.layout.stack()
      .values(function(d) { return d.values; })
      .x(function(d) { return d.date; })
      .y(function(d) { return d.price; })
      .out(function(d, y0, y) { d.price0 = y0; })
      .order("reverse");

  var g = svg.selectAll(".symbol");

  stack(symbols);

  y
      .domain([0, d3.max(symbols[0].values.map(function(d) { return d.price + d.price0; }))])
      .range([h, 0]);

  var t = g.transition()
      .duration(duration / 2);

  t.select("text")
      .delay(symbols[0].values.length * 10)
      .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price / 2 + d.price0) + ")"; });

  t.selectAll("rect")
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.price0 + d.price); })
      .attr("height", function(d) { return h - y(d.price); })
      .each("end", function() {
        d3.select(this)
            .style("stroke", "#fff")
            .style("stroke-opacity", 1e-6)
          .transition()
            .duration(duration / 2)
            .attr("x", function(d) { return x(d.date); })
            .attr("width", x.rangeBand())
            .style("stroke-opacity", 1);
      });
}