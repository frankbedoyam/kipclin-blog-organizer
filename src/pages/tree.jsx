import React from "react";
import Navbar from "../components/Navbar";
import VerticalTree from "../components/VerticalTree";
import data from "../data/articlesTree.json";

export default function TreePage() {
  return (
    <div>
      <Navbar />
      <h1 className="p-4 text-xl font-bold">Árbol Jerárquico de Artículos</h1>
      <VerticalTree data={data} width={1200} height={800} />
    </div>
  );
}