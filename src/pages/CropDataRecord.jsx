import React, { useState } from "react";

const CropDataRecord = () => {
  // Example dummy data (50 rows)
  const data = Array.from({ length: 15 }, (_, i) => ({
    crop: `Crop ${i}`,
    temp: `${(Math.random() * 35).toFixed(2)} °C`,
    humidity: `${(Math.random() * 85).toFixed(2)} %`,
    moisture: `${(Math.random() * 100).toFixed(2)} %`,
    NPK: `${(Math.random() * 185).toFixed(2)} %`,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="p-4 mt-24">
      <p className="text-2xl uppercase">Crop Data Forecast</p>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="text-center bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="py-3 px-4 border-b">Crop</th>
              <th className="py-3 px-4 border-b">Temperature</th>
              <th className="py-3 px-4 border-b">Humidity</th>
              <th className="py-3 px-4 border-b">Soil Moisture</th>
              <th className="py-3 px-4 border-b">NPK</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{row.crop}</td>
                <td className="py-2 px-4 border-b">{row.temp}</td>
                <td className="py-2 px-4 border-b">{row.humidity}</td>
                <td className="py-2 px-4 border-b">{row.moisture}</td>
                <td className="py-2 px-4 border-b">{row.NPK}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CropDataRecord;
