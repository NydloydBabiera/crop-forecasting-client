import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import DateRangePicker from "../components/DateRangePicker";
import { format, toZonedTime } from "date-fns-tz";

const SensorReadings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to hold the selected date range
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/getSensorReadings`);
      setData(response.data); // Set the fetched data
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Error fetching data", err.message);
      setLoading(false);
      setData([]);
    }
  };

  // Fetch data from the API
  useEffect(() => {
    fetchData();
  }, []);

  // Conditional rendering for loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Function to update the date filter state, passed to DateRangePicker
  const handleDateRangeChange = (startDate, endDate) => {
    // We set the end date to the end of the day to include all records on that day
    const endOfDay = endDate ? moment(endDate).endOf("day").toDate() : null;
    setDateFilter({ startDate, endDate: endOfDay });
  };
  const filteredData = data.filter((item) => {
    const recordMoment = moment(item.created_at).local();

    if (!dateFilter.startDate || !dateFilter.endDate) {
      return true; // If no filter is applied, return all data
    }

    const startMoment = moment(dateFilter.startDate).startOf("day");
    const endMoment = moment(dateFilter.endDate).endOf("day");

    return (
      recordMoment.isSameOrAfter(startMoment, "day") &&
      recordMoment.isSameOrBefore(endMoment, "day")
    );
  });

  // Pagination logic (use filtered data for pagination)
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  return (
    <div className="p-4 mt-24">
      <p className="text-2xl uppercase">Sensor Readings</p>
      <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="text-center bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="py-3 px-4 border-b">Temperature</th>
              <th className="py-3 px-4 border-b">Humidity</th>
              <th className="py-3 px-4 border-b">Soil Moisture</th>
              <th className="py-3 px-4 border-b">NPK</th>
            <th className="py-3 px-4 border-b">Record Date</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row) => (
              <tr key={row.crop_id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{row.temperature}</td>
                <td className="py-2 px-4 border-b">{row.humidity}</td>
                <td className="py-2 px-4 border-b">{row.soil_moisture}</td>
                <td className="py-2 px-4 border-b">{row.npk}</td>
                <td className="py-2 px-4 border-b">
                  {format(
                    toZonedTime(row.created_at, "Asia/Manila"),
                    "MMM dd, yyyy HH:mm:ss"
                  )}
                </td>
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

export default SensorReadings;
