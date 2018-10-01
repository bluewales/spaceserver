<!DOCTYPE HTML>
<html>
<head>
  <title>Economy</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
<div id="main">
<h1>Economy Graphs</h1>

<ul id="cities"> </ul>
<ul id="resolutions"> </ul>
<ul id="options"> </ul>
<ul id="column_1"> </ul>
<ul id="column_2"> </ul>
<svg ></svg>
<p style="clear:left">&copy 2018</p>
</div>

<script src='https://d3js.org/d3.v5.min.js'></script>

<script>


  var data = <?php echo file_get_contents("history.json");?>;

  var cities = Object.keys(data).sort();
  var active_city = cities[0];

  var resolutions = Object.keys(data[active_city]).sort();
  var active_resolution = resolutions[0];

  var options = ["goods", "recipes", "money", "starving"];
  var active_option = "goods";

  var goods = Object.keys(data[active_city][active_resolution][0].goods).sort();
  var active_good = "<?php if(isset($_GET['good'])) {echo $_GET['good'];} else {echo "food";}?>";

  var details = Object.keys(data[active_city][active_resolution][0].goods[active_good]).sort();
  var active_details = {};
  for(detail of details) {
    active_details[detail] = true;
  }


  var recipes = Object.keys(data[active_city][active_resolution][0].recipes).sort();
  var active_recipe = recipes[0];

  var recipe_details = Object.keys(data[active_city][active_resolution][0].recipes[active_recipe]).sort()
  var active_recipe_details = {};
  for(detail of recipe_details) {
    active_recipe_details[detail] = true;
  }



  var svg_width = 1000;
  var svg_height = 750;

  var colors = ["blue", "green", "red", "purple", "darkblue", "orange", "darkred"];

  function draw_graphs(datas, colors) {

    var svg = d3.select('svg')
      .attr('width', svg_width+'px')  
      .attr('height', svg_height+'px')  
      .style('float', 'left')
      .style('background-color','#eee')
      .style('margin','1px 0px');
    
    var max_value = d3.max(datas, function(d){
        return d3.max(d);
    });

    var data_length = d3.max(datas, function(d){
        return d.length;
    });

    for(var i = 0; i < datas.length; i++) {

      let data = datas[i];
      let color = colors[i];

      let margin = {top: 20, right: 20, bottom: 30, left: 50};
      let width = svg_width - margin.left - margin.right;
      let height = svg_height - margin.top - margin.bottom;
      let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // 5. X scale will use the index of our data
      var xScale = d3.scaleLinear()
          .domain([0, data_length]) // input
          .range([0, width]); // output

      // 6. Y scale will use the randomly generate number 
      var yScale = d3.scaleLinear()
          .domain([0, max_value]) // input 
          .range([height, 0]); // output 

      // 7. d3's line generator
      var line = d3.line()
          .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
          .y(function(d) { return yScale(d); }) // set the y values for the line generator 
          .curve(d3.curveMonotoneX) // apply smoothing to the line

      

      // 9. Append the path, bind the data, and call the line generator 
      g.append("path")
          .style('fill','none')
          .style('stroke', color)
          .style('stroke-width','1')
          .datum(data) // 10. Binds data to the line 
          .attr("class", "line") // Assign a class for styling 
          .attr("d", line); // 11. Calls the line generator

      // 12. Appends a circle for each datapoint 
      g.selectAll(".dot")
          .data(data)
        .enter().append("circle") // Uses the enter().append() method
          .style('fill', color)
          .attr("class", "dot") // Assign a class for styling
          .attr("cx", function(d, i) { return xScale(i) })
          .attr("cy", function(d) { return yScale(d) })
          .attr("r", '1');

      g.append("g")
          .attr("transform", "translate(0," + (height-10) + ")")
          .call(d3.axisBottom(xScale))
        .select(".domain")
          .remove();

      g.append("g")
          .call(d3.axisLeft(yScale))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end");
    }
  }

  function render_money() {
    d = data[active_city][active_resolution]
    let money_data = []
    for(let ix = 0; ix < d.length; ix++) {
      money_data.push(d[ix]['money'])
    }
    draw_graphs([money_data], ["black"]);
  }

  function render_starving() {
    d = data[active_city][active_resolution]
    let starving_data = []
    for(let ix = 0; ix < d.length; ix++) {
      starving_data.push(d[ix]['starving'])
    }
    draw_graphs([starving_data], ["black"]);
  }

  function render_recipes() {

    recipes = Object.keys(data[active_city][active_resolution][0].recipes).sort();
    recipe_details = Object.keys(data[active_city][active_resolution][0].recipes[active_recipe]).sort()

    d3.select('#column_1')
      .style('list-style-type', 'none')
      .style('clear', 'left')
      .style('float', 'left')
      .style('padding','6px 6px')
      .style('width','100px')
      .selectAll('li')
        .data(recipes)
        .enter()
        .append('li')
        .style('display', 'block')
        .style('background-color',function(d) { return d == active_recipe ? 'blue' : '#333'; })
        .style('color','white')
        .style('padding','0px 6px')
        .style('margin','1px 0px')
        .style('cursor','pointer')
        .text(function(d) { return d; })
        .on("click", function(d){
          active_recipe = d;
          render();
        });

    var index = 0;

    d3.select('#column_2')
      .style('list-style-type', 'none')
      .style('float', 'left')
      .style('padding','6px 6px')
      .style('width','100px')
      .selectAll('li')
        .data(recipe_details)
        .enter()
        .append('li')
        .style('display', 'block')
        .style('background-color',function(d, i) { 
          if(active_recipe_details[d]) {
            return colors[i % colors.length];
          }
          return '#333';
        })
        .style('color','white')
        .style('padding','0px 6px')
        .style('margin','1px 0px')
        .style('cursor','pointer')
        
        .text(function(d) { return d; })
        .on("click", function(d){
          active_recipe_details[d] = !active_recipe_details[d];
          render();
        });

    index = -1;

    let datas = [];
    let draw_colors = [];

    for (let detail of recipe_details) {
      index = (index + 1) % colors.length;
      if(active_recipe_details[detail]) {

        d = data[active_city][active_resolution]
        let detail_data = []
        for(let ix = 0; ix < d.length; ix++) {
          detail_data.push(d[ix].recipes[active_recipe][detail])
        }
        datas.push(detail_data);
        draw_colors.push(colors[index]);
      }
    }
    
    draw_graphs(datas, draw_colors);
  }

  function render_goods() {

    goods = Object.keys(data[active_city][active_resolution][0].goods).sort();

    details = Object.keys(data[active_city][active_resolution][0].goods[active_good]).sort();

    d3.select('#column_1')
      .style('list-style-type', 'none')
      .style('clear', 'left')
      .style('float', 'left')
      .style('padding','6px 6px')
      .style('width','100px')
      .selectAll('li')
        .data(goods)
        .enter()
        .append('li')
        .style('display', 'block')
        .style('background-color',function(d) { return d == active_good ? 'blue' : '#333'; })
        .style('color','white')
        .style('padding','0px 6px')
        .style('margin','1px 0px')
        .style('cursor','pointer')
        .text(function(d) { return d; })
        .on("click", function(d){
          active_good = d;
          render();
        });

    var index = 0;

    d3.select('#column_2')
      .style('list-style-type', 'none')
      .style('float', 'left')
      .style('padding','6px 6px')
      .style('width','100px')
      .selectAll('li')
        .data(details)
        .enter()
        .append('li')
        .style('display', 'block')
        .style('background-color',function(d, i) { 
          if(active_details[d]) {
            return colors[i % colors.length];
          }
          return '#333';
        })
        .style('color','white')
        .style('padding','0px 6px')
        .style('margin','1px 0px')
        .style('cursor','pointer')
        
        .text(function(d) { return d; })
        .on("click", function(d){
          active_details[d] = !active_details[d];
          render();
        });

    index = -1;

    let datas = [];
    let draw_colors = [];

    for (let detail of details) {
      index = (index + 1) % colors.length;
      if(active_details[detail]) {

        d = data[active_city][active_resolution]
        let detail_data = []
        for(let ix = 0; ix < d.length; ix++) {
          detail_data.push(d[ix].goods[active_good][detail])
        }
        datas.push(detail_data);
        draw_colors.push(colors[index]);
      }
    }
    
    draw_graphs(datas, draw_colors);
  }

  function render() {

    d3.select('#main')
      .style('width', '1300px')
    
    d3.selectAll('ul').selectAll('li').remove();
    d3.selectAll('svg').selectAll('*').remove();

    d3.select('#cities')
      .style('list-style-type', 'none')
      .style('clear', 'left')
      .selectAll('li')
        .data(cities)
        .enter()
        .append('li')
        .style('float', 'left')
        .style('display', 'block')
        .style('background-color',function(d) { return d == active_city ? 'blue' : '#333'; })
        .style('color','white')
        .style('padding','14px 16px')
        .style('margin','1px 1px')
        .style('cursor','pointer')
        .text(function(d) { return d; })
        .on("click", function(d){
          active_city = d;
          render();
        });

    resolutions = Object.keys(data[active_city]).sort();

    d3.select('#resolutions')
      .style('list-style-type', 'none')
      .style('clear', 'left')
      .selectAll('li')
        .data(resolutions)
        .enter()
        .append('li')
        .style('float', 'left')
        .style('display', 'block')
        .style('background-color',function(d) { return d == active_resolution ? 'blue' : '#333'; })
        .style('color','white')
        .style('padding','14px 16px')
        .style('margin','1px 1px')
        .style('cursor','pointer')
        .text(function(d) { return d; })
        .on("click", function(d){
          active_resolution = d;
          render();
        });

    d3.select('#options')
      .style('list-style-type', 'none')
      .style('clear', 'left')
      .selectAll('li')
        .data(options)
        .enter()
        .append('li')
        .style('float', 'left')
        .style('display', 'block')
        .style('background-color',function(d) { return d == active_option ? 'blue' : '#333'; })
        .style('color','white')
        .style('padding','14px 16px')
        .style('margin','1px 1px')
        .style('cursor','pointer')
        .text(function(d) { return d; })
        .on("click", function(d){
          active_option = d;
          render();
        });



    if(active_option == "goods") {
      render_goods();
    }
    
    if(active_option == "recipes") {
      render_recipes();
    }
    if(active_option == "money") {
      render_money();
    }
    if(active_option == "starving") {
      render_starving();
    }
    
    



  }
  window.onload = render;
</script>



</body>
</html>