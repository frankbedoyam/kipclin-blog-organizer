import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { articles } from "../data/articles";

const ClustersGraph = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 900;
    const height = 1800; // 👈 layout vertical

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    svg.selectAll("*").remove();

    if (!articles || articles.length === 0) return;

    const categorias = [...new Set(articles.map(a => a.category))];

    const nodes = [
      ...categorias.map(c => ({ id: c, group: "pilar" })),
      ...articles.map(a => ({
        id: a.title,
        group: "cluster",
        hits: a.hits,
        author: a.author,
        date: a.date,
        category: a.category
      }))
    ];

    const links = articles.map(a => ({
      source: a.category,
      target: a.title
    }));

    const sizeScale = d3.scaleSqrt()
      .domain([d3.min(articles, d => d.hits), d3.max(articles, d => d.hits)])
      .range([10, 40]); // 👈 más contraste

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-80))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .alphaDecay(0.03);

    const link = svg.append("g")
      .attr("stroke", "#bbb")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.group === "pilar" ? 28 : sizeScale(d.hits))
      .attr("fill", d => d.group === "pilar" ? "#1f2937" : "#f472b6")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .call(drag(simulation));

    // Etiquetas externas (3 palabras)
    const labels = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.group === "pilar" ? d.id : d.id.split(" ").slice(0, 3).join(" "))
      .attr("font-size", d => d.group === "pilar" ? 14 : 10)
      .attr("fill", "#333")
      .attr("text-anchor", "middle")
      .attr("dy", d => d.group === "pilar" ? -35 : -20);

    // Visitas dentro del nodo
    const hitsLabel = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.group === "cluster" ? d.hits : "")
      .attr("font-size", 10)
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("dy", 4);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);

      hitsLabel
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

  }, []);

  return (
    <div style={{ overflowY: "scroll", height: "100vh" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ClustersGraph;