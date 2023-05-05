// Create a dataset
var dataset = [5, 10, 15, 20, 25];

// Create an SVG element
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", 500)
  .attr("height", 300);

// Create bars
svg
  .selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", function (d, i) {
    return i * 50;
  })
  .attr("y", function (d) {
    return 300 - d * 10;
  })
  .attr("width", 40)
  .attr("height", function (d) {
    return d * 10;
  });
