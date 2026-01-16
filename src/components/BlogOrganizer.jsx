import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import SortIcon from "./SortIcon";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const BlogOrganizer = () => {
  // Estado
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Datos (lista completa)
  const articles = [
    { id: 192, title: "4 áreas donde los hoteles pierden dinero en limpieza y cómo evitarlo", author: "Frank Bedoya", date: "2026-01-15", hits: 53, category: "Alojamientos" },
    { id: 191, title: "Cuando la limpieza vale más que una buena vista", author: "Frank Bedoya", date: "2025-12-17", hits: 320, category: "Alojamientos" },
    { id: 190, title: "Rapifloc PQP Profesional: el secreto para piscinas impecables en vacaciones", author: "Frank Bedoya", date: "2025-12-02", hits: 371, category: "Piscinas" },
    { id: 189, title: "¿Por qué el Detergente Líquido Ultrex Floral rinde más por su densidad?", author: "Frank Bedoya", date: "2025-11-21", hits: 624, category: "Productos" },
    { id: 186, title: "Restaurantes preparados: Cómo asegurar una cocina impecable durante la Feria de las Flores", author: "Super User", date: "2025-07-21", hits: 2722, category: "Restaurantes" },
    { id: 185, title: "Cómo preparar tu alojamiento turístico para la Feria de las Flores: Higiene y desinfección premium", author: "Super User", date: "2025-07-21", hits: 1641, category: "Alojamientos" },
    { id: 184, title: "Protocolos de limpieza exprés para eventos masivos: Guía práctica Feria de las Flores", author: "Super User", date: "2025-07-21", hits: 1506, category: "General" },
    { id: 180, title: "Descubre los mejores productos de lavandería en KipClin", author: "Super User", date: "2025-05-23", hits: 2301, category: "Lavanderías" },
    { id: 179, title: "Limpieza y desinfección en plantas de alimentos: ¿cómo lograr ambientes seguros y libres de grasa?", author: "Super User", date: "2025-05-14", hits: 2008, category: "Restaurantes" },
    { id: 178, title: "¿Cómo hacer el mantenimiento de mi piscina? Guía práctica para mantener el agua limpia y cristalina", author: "Super User", date: "2025-04-10", hits: 2162, category: "Piscinas" },
    { id: 177, title: "¿Qué son los productos biodegradables y cuál es su impacto en el medio ambiente?", author: "Super User", date: "2025-03-07", hits: 4861, category: "General" },
    { id: 176, title: "¿Usas los mismos productos de limpieza para tu negocio y para tu casa?", author: "Super User", date: "2025-02-04", hits: 1563, category: "General" },
    { id: 174, title: "Cómo Limpiar y Desinfectar el Inodoro con Blanqueador Desinfectante Blancox", author: "Super User", date: "2025-01-13", hits: 1657, category: "Hogar" },
    { id: 172, title: "¿Cómo limpiar y desinfectar tus adornos navideños esta temporada?", author: "Super User", date: "2024-12-10", hits: 2255, category: "Hogar" },
    { id: 171, title: "Cómo Desinfectar con el Desinfectante PQP Profesional al 10%: Una Guía Sencilla para Uso Seguro y Eficiente", author: "Super User", date: "2024-11-05", hits: 1536, category: "Productos" },
    { id: 170, title: "Cómo Blanquear la Ropa Blanca y Zapatos Blancos: Guía Completa", author: "Super User", date: "2024-09-30", hits: 6401, category: "Hogar" },
    { id: 169, title: "KipClin: Tu aliado en limpieza y desinfección", author: "Super User", date: "2024-09-09", hits: 1991, category: "KipClin" },
    { id: 168, title: "Soluciones de limpieza inteligentes para negocios inteligentes", author: "Super User", date: "2024-08-16", hits: 2077, category: "General" },
    { id: 167, title: "Impulsa la sostenibilidad a través de la reutilización de envases en la limpieza", author: "Anderson Martinez Restrepo", date: "2024-06-13", hits: 3909, category: "General" },
    { id: 166, title: "La limpieza no debe ser un desafío, gestiona Inteligentemente tu Inventario.", author: "Anderson Martinez Restrepo", date: "2024-04-15", hits: 6372, category: "General" },
    { id: 165, title: "Tu nuevo aliado en productos de aseo y limpieza para empresas", author: "Anderson Martinez Restrepo", date: "2024-04-15", hits: 6084, category: "KipClin" },
    { id: 164, title: "Amor por la limpieza: productos especializados para tu negocio", author: "Super User", date: "2024-03-12", hits: 7727, category: "General" },
    { id: 161, title: "Inicia el año con limpieza inteligente en tu negocio", author: "Super User", date: "2024-02-06", hits: 8677, category: "General" },
    { id: 158, title: "Revolucionando la limpieza profesional: KipClin, tu aliado inteligente", author: "Super User", date: "2024-01-03", hits: 8075, category: "KipClin" },
    { id: 157, title: "Renueva tu hogar y tu energía: Ritual de limpieza de fin de año con KipClin.com", author: "Super User", date: "2023-12-04", hits: 7484, category: "Hogar" },
    { id: 155, title: "Estrategias de compra inteligente de productos de limpieza para empresas", author: "David Vasquez Pino", date: "2023-11-08", hits: 9773, category: "General" },
    { id: 154, title: "Limpieza inteligente: Lanza tu hogar hacia el futuro del aseo con KipClin.com", author: "David Vasquez Pino", date: "2023-10-03", hits: 6993, category: "Hogar" },
    { id: 153, title: "Productos Esenciales para Abrir una Lavandería: Todo lo que Necesitas para un Negocio Exitoso", author: "David Vasquez Pino", date: "2023-09-05", hits: 6022, category: "Lavanderías" },
    { id: 152, title: "2 tips para limpiar tu Airfryer en casa", author: "David Vasquez Pino", date: "2023-08-04", hits: 3030, category: "Hogar" },
    { id: 151, title: "El secreto mejor guardado del sector turístico, Tres Pasos para una Temporada Turística Exitosa en Medellín", author: "David Vasquez Pino", date: "2023-07-17", hits: 2369, category: "Alojamientos" },
    { id: 150, title: "Lo más valorado de las experiencias en los hoteles", author: "David Vasquez Pino", date: "2023-05-17", hits: 1350, category: "Alojamientos" },
    { id: 149, title: "Secretos de limpieza para el hogar", author: "David Vasquez Pino", date: "2023-04-28", hits: 1372, category: "Hogar" },
    { id: 148, title: "3 productos de limpieza infaltables para restaurantes.", author: "David Vasquez Pino", date: "2023-04-20", hits: 3075, category: "Restaurantes" },
    { id: 146, title: "Calor más piscina combinación perfecta", author: "David Vasquez Pino", date: "2023-03-10", hits: 1825, category: "Piscinas" },
    { id: 145, title: "Cuidarte a ti es cuidar los espacios que habitas", author: "David Vasquez Pino", date: "2023-03-01", hits: 1605, category: "General" },
    { id: 140, title: "Hablemos de cosas que no combinan", author: "David Vasquez Pino", date: "2022-12-20", hits: 5844, category: "General" },
    { id: 139, title: "¿Limpiar la casa en vacaciones?", author: "David Vasquez Pino", date: "2022-11-30", hits: 1765, category: "Hogar" },
    { id: 136, title: "¿Cómo limpiar un hogar con mascotas?", author: "Super User", date: "2022-10-12", hits: "2016", category: "Hogar" },
    { id: 135, title: "¿Cómo limpiar las juntas de los pisos y azulejos?", author: "David Vasquez Pino", date: "2022-09-19", hits: 2919, category: "Hogar" },
    { id: 133, title: "Reconciliémonos con el lavado del baño", author: "David Vasquez Pino", date: "2022-08-22", hits: 2124, category: "Hogar" },
    { id: 131, title: "¿Cómo se lava la ropa?", author: "David Vasquez Pino", date: "2022-07-26", hits: 4810, category: "Hogar" },
    { id: 129, title: "Hablemos de los tiempos en la limpieza del hogar", author: "David Vasquez Pino", date: "2022-06-24", hits: 4703, category: "Hogar" },
    { id: 128, title: "Solo por esta vez, 10 no es la calificación ideal", author: "David Vasquez Pino", date: "2022-06-13", hits: 1556, category: "Productos" },
    { id: 124, title: "¡Sí es posible limpiar los vidrios!", author: "David Vasquez Pino", date: "2022-05-31", hits: 1825, category: "Hogar" },
    { id: 120, title: "Reciclaje de envases de productos de limpieza con KipClin", author: "David Vasquez Pino", date: "2022-04-18", hits: 10556, category: "General" },
    { id: 114, title: "Haz REFill, dosifica y ahorra en productos de aseo para tu empresa", author: "Natalia Villa", date: "2022-02-27", hits: 2203, category: "General" },
    { id: 113, title: "Mejora la economía familiar ahorrando en productos de aseo", author: "Natalia Villa", date: "2022-02-07", hits: 3519, category: "Hogar" },
    { id: 110, title: "10 consejos para conservar y cuidar tus pisos de madera", author: "Natalia Villa", date: "2022-01-02", hits: 28753, category: "Hogar" },
    { id: 109, title: "Es hora de decirle adiós a ese sofá mugroso", author: "Natalia Villa", date: "2021-12-23", hits: 1655, category: "Hogar" },
    { id: 107, title: "Cómo limpiar las juntas y dejar tus pisos como nuevos", author: "Natalia Villa", date: "2021-12-06", hits: 6329, category: "Hogar" },
    { id: 106, title: "Tips para que la ropa del armario huela bien", author: "Natalia Villa", date: "2021-11-21", hits: 3950, category: "Hogar" },
    { id: 105, title: "Cómo limpiar el baño sin sufrir", author: "Natalia Villa", date: "2021-11-08", hits: 2515, category: "Hogar" },
    { id: 104, title: "8 errores que cometes al limpiar", author: "Natalia Villa", date: "2021-10-20", hits: 1759, category: "Hogar" },
    { id: 102, title: "No, no tiene que ser una tortura lavar los platos", author: "Natalia Villa", date: "2021-09-13", hits: 1968, category: "Hogar" },
    { id: 98, title: "Cómo desengrasar parqueaderos y talleres mecánicos", author: "Natalia Villa", date: "2021-05-22", hits: 8282, category: "General" },
    { id: 97, title: "7 tips para que tu trapero tenga larga vida", author: "Natalia Villa", date: "2021-04-12", hits: 25705, category: "Hogar" },
    { id: 96, title: "Cómo recuperar un piso o superficie manchada de óxido", author: "Natalia Villa", date: "2021-04-06", hits: 10808, category: "Hogar" },
    { id: 95, title: "Limpia y desengrasa tus pisos en un dos por tres", author: "Natalia Villa", date: "2021-03-30", hits: 4755, category: "Hogar" },
    { id: 92, title: "Nuevo código de colores para la separación de residuos en Colombia", author: "Natalia Villa", date: "2020-12-23", hits: 20421, category: "General" },
    { id: 91, title: "Hipoclorito, cloro y lejía: Todo lo que necesitas saber sobre el desinfectante universal", author: "Natalia Villa", date: "2020-12-11", hits: 37582, category: "Productos" },
    { id: 90, title: "Cómo limpiar tu casa de manera segura si tienes mascotas", author: "Natalia Villa", date: "2020-11-20", hits: 2567, category: "Hogar" },
    { id: 85, title: "Aspectos indispensables para la reapertura de restaurantes en la nueva normalidad", author: "Natalia Villa", date: "2020-09-09", hits: 1467, category: "Restaurantes" },
    { id: 82, title: "Limpieza y desinfección de alimentos", author: "Natalia Villa", date: "2020-08-18", hits: 10360, category: "Restaurantes" },
    { id: 81, title: "Productos ideales para limpiar y desinfectar establecimientos abiertos al público", author: "Natalia Villa", date: "2020-08-05", hits: 10308, category: "General" },
    { id: 80, title: "Limpieza y desinfección en establecimientos y espacios de trabajo", author: "Natalia Villa", date: "2020-05-29", hits: 5293, category: "General" },
    { id: 79, title: "Prepárate para abrir tu negocio tras el confinamiento", author: "Natalia Villa", date: "2020-05-20", hits: 1490, category: "General" },
    { id: 78, title: "Limpieza y desinfección de ropa en tiempos de Coronavirus", author: "Natalia Villa", date: "2020-05-18", hits: 2430, category: "Hogar" },
    { id: 77, title: "3 cosas básicas para limpiar y desinfectar bien los pisos", author: "Natalia Villa", date: "2020-05-11", hits: 5028, category: "Hogar" },
    { id: 76, title: "Conoce la diferencia entre desinfectar y sanitizar", author: "Natalia Villa", date: "2020-05-04", hits: 15090, category: "General" }
  ];

  // Derivados para filtros
  const authors = [...new Set(articles.map(a => a.author))].sort();
  const categories = [...new Set(articles.map(a => a.category))].sort();

  // Filtrado y ordenamiento
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles.filter(article => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.id.toString().includes(searchTerm);
      const matchesAuthor = !filterAuthor || article.author === filterAuthor;
      const matchesCategory = !filterCategory || article.category === filterCategory;
      return matchesSearch && matchesAuthor && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (sortConfig.key === "date") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [articles, searchTerm, sortConfig, filterAuthor, filterCategory]);

  // Ordenamiento por columna
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  // Gráficas (pie y bar) proporcionadas al contenedor
  useEffect(() => {
    const categoryCounts = {};
    const categoryHits = {};

    articles.forEach(({ category, hits }) => {
      const safeHits = Number(hits) || 0;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      categoryHits[category] = (categoryHits[category] || 0) + safeHits;
    });

    const pieCtx = document.getElementById("categoryPieChart");
    const barCtx = document.getElementById("categoryBarChart");

    Chart.getChart(pieCtx)?.destroy();
    Chart.getChart(barCtx)?.destroy();

    if (pieCtx) {
      new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: Object.keys(categoryCounts),
          datasets: [
            {
              data: Object.values(categoryCounts),
              backgroundColor: [
                "#60A5FA", "#F87171", "#34D399", "#FBBF24",
                "#A78BFA", "#F97316", "#9CA3AF", "#06B6D4",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    if (barCtx) {
      new Chart(barCtx, {
        type: "bar",
        data: {
          labels: Object.keys(categoryHits),
          datasets: [
            {
              label: "Visitas",
              data: Object.values(categoryHits),
              backgroundColor: "#3B82F6",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }
  }, [articles]);

  // JSX
  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Título principal */}
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        BLOG de KipClin
      </h1>

      {/* Bloque de gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pie */}
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col" style={{ height: "500px" }}>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Artículos por Categoría</h2>
          <div className="flex-1">
            <canvas id="categoryPieChart" className="w-full h-full"></canvas>
          </div>
        </div>
        {/* Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col" style={{ height: "500px" }}>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total de Visitas por Categoría</h2>
          <div className="flex-1">
            <canvas id="categoryBarChart" className="w-full h-full"></canvas>
          </div>
        </div>
      </div>

      {/* Buscador y filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Buscador */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por título o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-4">
            <select
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los autores</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contador */}
        <div className="text-sm text-gray-600 mb-4">
          Mostrando {filteredAndSortedArticles.length} de {articles.length} artículos
        </div>
      </div>

      {/* Tabla */}
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
              <tr key={article.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{article.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-[400px] truncate">{article.title}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      article.category === "Alojamientos"
                        ? "bg-blue-100 text-blue-800"
                        : article.category === "Restaurantes"
                        ? "bg-red-100 text-red-800"
                        : article.category === "Hogar"
                        ? "bg-green-100 text-green-800"
                        : article.category === "Piscinas"
                        ? "bg-cyan-100 text-cyan-800"
                        : article.category === "Lavanderías"
                        ? "bg-purple-100 text-purple-800"
                        : article.category === "KipClin"
                        ? "bg-orange-100 text-orange-800"
                        : article.category === "Productos"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {article.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{article.author}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{article.date}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {Number(article.hits).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogOrganizer;