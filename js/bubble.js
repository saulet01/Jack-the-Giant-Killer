let width = 800;
let height = 700;
let rad3 = 70;

let radScale = d3.scaleLog().domain(d3.extent(cloudData, d => d.value)).range([30, 70])
let textScale = d3.scaleLog().domain(d3.extent(cloudData, d => d.value)).range([13, 30])

cloudData.forEach(function(d){
  d.radius = radScale(d.value)
});

let simulation = d3.forceSimulation(cloudData)
                   .force('charge', d3.forceManyBody().strength(70))
                   .force('center', d3.forceCenter(width / 2.2, height / 2))
                   .force('collision', d3.forceCollide().radius(d => d.radius))
                   .on('tick', ticked);

function ticked(){
  // Adapted from: https://d3indepth.com/force-layout/
  let bubbleChart = d3.select("#bubble1")
                      .selectAll("circle")
                      .data(cloudData)
  bubbleChart.enter()
             .append("circle")
             .attr("r", d => d.radius)
             .merge(bubbleChart)
             .attr("cx", d => d.x = Math.max(rad3, Math.min(width - rad3, d.x)))
             .attr("cy", d => d.y = Math.max(rad3, Math.min(height - rad3, d.y)))
             .attr("class", "bubble2")
             .call(d3.drag()
             // Adapted from: Interactive Data Visualization for the Web, 2nd Edition: Chapter 13. 08_force_draggable.html
             .on('start', (d) => {
               if (!d3.event.active) simulation.alphaTarget(0.2).restart();
               d.fx = d.x;
               d.fy = d.y;
             })
             .on('drag', (d) => {
               d.fx = d3.event.x;
               d.fy = d3.event.y;
             })
             .on('end', (d) => {
               if (!d3.event.active) simulation.alphaTarget(0);
               d.fx = null;
               d.fy = null;
             }));

 let circleTooltip = d3.select("#bubble1")
            .selectAll("circle")
            .attr("data-toggle", "tooltip")
            .attr("data-placement", "top")
            .attr("title", d => `Count: ${d.value}`);

  $(function (){
    $('[data-toggle="tooltip"]').tooltip()
  });

  let textElements = d3.select("#bubble1")
                       .selectAll("text")
                       .data(cloudData)

  textElements.enter()
              .append("text")
              .merge(textElements)
              .attr("x", d => d.x)
              .attr("y", d => d.y)
              .text(d => d.word)
              .attr("class", "textInside")
              .style("font-size", d => textScale(d.value))
              .attr("fill", "#7D4628")
}
