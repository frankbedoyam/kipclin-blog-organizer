import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo o título */}
      <h1 className="text-lg font-bold">KipClin Blog Organizer</h1>

      {/* Botones de navegación */}
      <div className="space-x-4">
        <Link to="/">
          <button className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700">
            Home
          </button>
        </Link>
        <Link to="/clusters">
          <button className="px-3 py-2 bg-green-600 rounded hover:bg-green-700">
            Clusters
          </button>
        </Link>
        <Link to="/tree">
          <button className="px-3 py-2 bg-purple-600 rounded hover:bg-purple-700">
            Árbol
          </button>
        </Link>
      </div>
    </nav>
  );
}