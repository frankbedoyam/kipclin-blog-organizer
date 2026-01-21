import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function VerticalTree({ data, width = 1200, height = 800 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("class", "content");

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([width, height]);
    treeLayout(root);

    const linkGen = d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y);

    g.selectAll("path.link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("d", d => linkGen({ source: d.source, target: d.target }))
      .attr("stroke", "#999")
      .attr("fill", "none");

    const node = g.selectAll("g.node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
      .attr("r", 6)
      .attr("fill", d => d.children ? "#2ca02c" : "#ff7f0e")
      .attr("stroke", "#333");

    node.append("text")
      .attr("dy", -10)
      .attr("text-anchor", "middle")
      .style("font", "12px sans-serif")
      .text(d => d.data.name || d.data.title);

    const zoom = d3.zoom().scaleExtent([0.5, 3]).on("zoom", (event) => {
      g.attr("transform", event.transform);
    });
    svg.call(zoom);

  }, [data, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ border: "1px solid #ddd" }}
    />
  );
}