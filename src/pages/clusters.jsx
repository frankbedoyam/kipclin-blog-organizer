import React from "react";
import ClustersGraph from "../components/ClustersGraph";
import Navbar from "../components/Navbar"; // 👈 importa el Navbar

const ClustersPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar /> {/* 👈 aparece en todas las páginas */}
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          Mapa de Pilares y Clusters
        </h1>
        <p className="mb-6 text-gray-600">
          Visualización interactiva de artículos agrupados por categorías (pilares) y sus clusters.
        </p>

        <div className="border rounded-lg shadow-lg bg-white p-4">
          <ClustersGraph />
        </div>
      </div>
    </div>
  );
};

export default ClustersPage;