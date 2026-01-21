import React, { useState, useEffect, useMemo, useRef } from "react";
import NavBar from "../components/NavBar";
import SortIcon from "./SortIcon";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const BlogOrganizer = ({ articles = [] }) => {
  // Estado UI
  const [activeTab, setActiveTab] = useState("home");

  // Estado de filtros/orden
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  // Referencias para destruir gráficos al actualizar
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  // Manejo de ordenamiento (click en encabezados)
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Lógica de filtrado y ordenamiento
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;

    // Búsqueda por título o ID
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          (a.title ?? "").toLowerCase().includes(term) ||
          String(a.id ?? "").toLowerCase().includes(term)
      );
    }

    // Filtro por autor
    if (filterAuthor) {
      filtered = filtered.filter((a) => a.author === filterAuthor);
    }

    // Filtro por categoría
    if (filterCategory) {
      filtered = filtered.filter((a) => a.category === filterCategory);
    }

    // Ordenamiento
    if (sortConfig?.key) {
      const { key, direction } = sortConfig;
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        // Normaliza fechas si vienen como string
        const normalize = (val) => {
          if (val == null) return "";
          if (key === "date") return new Date(val).getTime();
          return typeof val === "string" ? val.toLowerCase() : val;
        };

        const A = normalize(aVal);
        const B = normalize(bVal);

        if (A < B) return direction === "asc" ? -1 : 1;
        if (A > B) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [articles, searchTerm, filterAuthor, filterCategory, sortConfig]);

  // Gráficos (con limpieza para no duplicar instancias)
  useEffect(() => {
    if (!articles || articles.length === 0) return;

    const categories = [...new Set(articles.map((a) => a.category))];

    // Datos Pie: cantidad por categoría
    const pieData = categories.map(
      (cat) => articles.filter((a) => a.category === cat).length
    );

    // Datos Bar: visitas por categoría
    const barData = categories.map((cat) =>
      articles
        .filter((a) => a.category === cat)
        .reduce((sum, item) => sum + Number(item.hits ?? 0), 0)
    );

    // Destruye instancias previas
    if (pieChartRef.current) {
      pieChartRef.current.destroy();
      pieChartRef.current = null;
    }
    if (barChartRef.current) {
      barChartRef.current.destroy();
      barChartRef.current = null;
    }

    const pieCtx = document.getElementById("categoryPieChart");
    const barCtx = document.getElementById("categoryBarChart");

    if (pieCtx) {
      pieChartRef.current = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: categories,
          datasets: [
            {
              data: pieData,
              backgroundColor: [
                "#1F77B4", // azul
                "#FF7F0E", // naranja
                "#2CA02C", // verde
                "#D62728", // rojo
                "#9467BD", // púrpura
                "#8C564B", // marrón
                "#E377C2", // rosa
                "#7F7F7F", // gris
                "#BCBD22", // amarillo verdoso
                "#17BECF", // celeste
                 "#F5B041", // dorado
                "#A569BD", // violeta],
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // evita que se salga del contenedor
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
    }

    if (barCtx) {
      barChartRef.current = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: categories,
          datasets: [
            {
              label: "Visitas",
              data: barData,
              backgroundColor: "#3B82F6",
              borderRadius: 4,
              maxBarThickness: 48,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // evita overflow
          scales: {
            x: { grid: { display: false } },
            y: {
              beginAtZero: true,
              grid: { color: "rgba(0,0,0,0.05)" },
            },
          },
          plugins: {
            legend: { display: false },
          },
        },
      });
    }

    // Limpieza al desmontar o actualizar
    return () => {
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
        pieChartRef.current = null;
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
        barChartRef.current = null;
      }
    };
  }, [articles]);

  return (
    <div>
      {/* Barra de navegación */}
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Título */}
      <h1 className="p-4 text-xl font-bold">Organizador del Blog</h1>

      {/* Contenido por pestañas */}
      {activeTab === "home" && (
        <div className="space-y-6">
          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div
              className="relative overflow-hidden bg-white rounded-lg shadow-md p-4 flex flex-col"
              style={{ height: "500px" }}
            >
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Artículos por Categoría
              </h2>
              <div className="flex-1 chart-container">
                <canvas id="categoryPieChart"></canvas>
              </div>
            </div>

            {/* Bar Chart */}
            <div
              className="relative overflow-hidden bg-white rounded-lg shadow-md p-4 flex flex-col"
              style={{ height: "500px" }}
            >
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Visitas por Categoría
              </h2>
              <div className="flex-1 chart-container">
                <canvas id="categoryBarChart"></canvas>
              </div>
            </div>
          </div>

          {/* Buscador y filtros */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            {/* Búsqueda */}
            <input
              type="text"
              placeholder="Buscar por título o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Filtro de autor */}
            <select
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos los autores</option>
              {[...new Set(articles.map((a) => a.author))].map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>

            {/* Filtro de categoría */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todas las categorías</option>
              {[...new Set(articles.map((a) => a.category))].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Contador de resultados */}
          <p className="text-sm text-gray-600 mb-2">
            Mostrando {filteredAndSortedArticles.length} de {articles.length} artículos
          </p>

          {/* Tabla */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                  <tr className="text-left">
                    {["id", "title", "category", "author", "date", "hits"].map((key) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          {key === "id"
                            ? "ID"
                            : key === "title"
                            ? "Título"
                            : key === "category"
                            ? "Categoría"
                            : key === "author"
                            ? "Autor"
                            : key === "date"
                            ? "Fecha"
                            : "Visitas"}
                          <SortIcon columnKey={key} sortConfig={sortConfig} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedArticles.map((article, index) => (
                    <tr
                      key={article.id ?? `${article.title}-${index}`}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {article.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-[500px]">
                        {article.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {article.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {article.author}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {article.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {Number(article.hits ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {filteredAndSortedArticles.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-6 text-center text-sm text-gray-500"
                      >
                        No hay artículos que coincidan con los filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "clusters" && <div className="p-4">{"(Vista de clusters aquí)"}</div>}
      {activeTab === "tree" && <div className="p-4">{"(Vista de árbol aquí)"}</div>}
    </div>
  );
};

export default BlogOrganizer;