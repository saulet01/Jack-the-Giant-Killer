let svg = d3.select('#character1');
let rad2 = 70;
//Adapted from: http://bl.ocks.org/SpaceActuary/raw/25e72aadac28f2c87667816e82c609db/
let defs = svg.append("defs")
let imgFrame = defs.selectAll("pattern")
                   .data(charactersConnection.nodes)
                   .enter()
                   .append("pattern")
                   .attr("id", d => {return "img_" + d.id} )
                   .attr("width", 1)
                   .attr("height", 1)
                   .append("image")
                   .attr("x", -5)
                   .attr("y", -10)
                   .attr("width", 100)
                   .attr("height", 100)
                   .attr("xlink:href", d => { return d.img } )

let simulation2 = d3.forceSimulation()
                   .force("charge", d3.forceManyBody())
                   .force("link", d3.forceLink().id(d => d.id).distance(300))
                   .force("collide",d3.forceCollide(100))
                   .force("center", d3.forceCenter(width/1.8, height/2))

simulation2.nodes(charactersConnection.nodes).on("tick", ticked)
simulation2.force("link").links(charactersConnection.links)

let link = svg.selectAll(".link")
              .data(charactersConnection.links)
              .enter()
              .append("line")
              .attr("class", "link")
              .attr("stroke", "#E7905F")
              .attr("stroke-width", 1)

let node = svg.selectAll(".node")
              .data(charactersConnection.nodes)
              .enter()
              .append("circle")
              .attr("r", 40)
              .attr("fill", d => {return "url(#img_" + d.id + ")"; })
              .attr("stroke", "#E7905F")
              .attr("stroke-width", 3)

function ticked(){
  node.attr("cx", d => d.x = Math.max(rad2, Math.min(width - rad2, d.x)))
      .attr("cy", d => d.y = Math.max(rad2, Math.min(height - rad2, d.y)))

  let textElement2 = svg.selectAll("text")
                        .data(charactersConnection.nodes)

  textElement2.enter()
              .append("text")
              .merge(textElement2)
              .attr("x", d => d.x)
              .attr("y", d => d.y-50)
              .text(d => d.name)
              .attr("class", "textInside")
              .attr("fill", "#7E4628")
              .attr("font-weight", "bold")

  link.attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)

      node.call(d3.drag()
      .on("start", dragStarted)
      .on("drag", dragging)
      .on("end", dragEnded));

      // Adapted from: Interactive Data Visualization for the Web, 2nd Edition: Chapter 13. 08_force_draggable.html
      function dragStarted(d) {
        if (!d3.event.active) simulation2.alphaTarget(0.2).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragging(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragEnded(d) {
        if (!d3.event.active){
          simulation2.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      }
};

new WOW().init();
