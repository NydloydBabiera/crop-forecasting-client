import React, { useState } from "react";
import DateRangePicker from "../components/DateRangePicker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DateRangeCombobox from "../components/DateRangeCombobox";

const Reports = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  // 🔹 Called when date range changes
  const handleDateChange = (start, end) => {
    setDateRange({
      startDate: start,
      endDate: end,
    });
  };

  const formatDate = (date) => {
    if (!date) return null;
  
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  };

  const generateReport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Please select a date range first.");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Send dates to API
      const query = new URLSearchParams({
        start: formatDate(dateRange.startDate),
        end: formatDate(dateRange.endDate),
      }).toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/filterCropForecastByDate?${query}`
      );

      const data = await res.json();

      const doc = new jsPDF();

      // 🧾 Header
      doc.setFontSize(18);
      doc.text("Sensor Reading Report", 14, 20);

      doc.setFontSize(11);
      doc.text(
        `Date Range: ${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(
          dateRange.endDate
        ).toLocaleDateString()}`,
        14,
        28
      );

      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);

      const tableColumn = [
        "Crop",
        "Temperature (°C)",
        "Humidity (%)",
        "Soil Moisture",
        "NPK",
        "Timestamp",
      ];

      const tableRows = data.map((row) => [
        row.crop_name,
        row.temperature,
        row.humidity,
        row.soil_moisture,
        row.npk,
        new Date(row.created_at).toLocaleString(),
      ]);

      autoTable(doc, {
        startY: 40,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [34, 197, 94] },
      });

      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

    } catch (err) {
      console.error("Report generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mt-24">
      <p className="text-3xl uppercase font-bold mb-4">Reports</p>

      {/* Pass handler to DateRangePicker */}
      <DateRangePicker onDateRangeChange={handleDateChange} />
      <DateRangeCombobox setDateRange={setDateRange} />

      <button
        onClick={generateReport}
        className="mt-6 bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
      >
        {loading ? "Generating..." : "Generate PDF Report"}
      </button>

      {pdfUrl && (
        <div className="mt-6">
          <p className="font-semibold mb-2">Preview</p>
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            className="w-full h-[600px] border rounded-lg"
          />
          <a
            href={pdfUrl}
            download="sensor_report.pdf"
            className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default Reports;
