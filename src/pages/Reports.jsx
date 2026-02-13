import React, { useState } from "react";
import DateRangePicker from "../components/DateRangePicker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DateRangeCombobox from "../components/DateRangeCombobox";
const crops = [
  {
    name: "Eggplant",
    temperature: [25, 32],
    humidity: [70, 85],
    soilMoisture: [60, 70],
    npk: [4.2, 185],
  },
  {
    name: "Sweet Potatoes",
    temperature: [21, 28],
    humidity: [70, 85],
    soilMoisture: [60, 70],
    npk: [4.2, 185],
  },
  {
    name: "Okra",
    temperature: [25, 35],
    humidity: [70, 90],
    soilMoisture: [60, 70],
    npk: [4.2, 185],
  },
  {
    name: "Ampalaya",
    temperature: [24, 30],
    humidity: [70, 85],
    soilMoisture: [60, 70],
    npk: [4.2, 185],
  },
  {
    name: "String Beans",
    temperature: [22, 30],
    humidity: [70, 80],
    soilMoisture: [55, 65],
    npk: [4.2, 185],
  },
  {
    name: "Potatoes",
    temperature: [18, 25],
    humidity: [70, 80],
    soilMoisture: [65, 75],
    npk: [8.5, 185],
  },
  {
    name: "Corn",
    temperature: [24, 30],
    humidity: [70, 80],
    soilMoisture: [65, 75],
    npk: [4.2, 185],
  },
  {
    name: "Rice",
    temperature: [24, 35],
    humidity: [80, 90],
    soilMoisture: [80, 90],
    npk: [4.2, 185],
  },
  {
    name: "Tomatoes",
    temperature: [21, 27],
    humidity: [70, 85],
    soilMoisture: [60, 70],
    npk: [4.2, 185],
  },
  {
    name: "Mung Beans",
    temperature: [25, 30],
    humidity: [70, 85],
    soilMoisture: [50, 60],
    npk: [4.2, 185],
  },
];
const Reports = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const now = new Date();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(now.setHours(0, 0, 0, 0)),
    endDate: new Date(now.setHours(23, 59, 59, 999)),
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
      ];

      // const computeOverallLabel = (row) => {
      //   if (row.soil_moisture > 7 && row.humidity > 70) {
      //     return "Most Suitable Crop";
      //   }
      //   return "Average Conditions";
      // };
      const inRange = (val, [min, max]) => val >= min && val <= max;
      function cropForecast(sensorData) {
        const {temperature, humidity, soil_moisture, npk } = sensorData;
      
        let bestMatch = null;
        let highestScore = 80;
        let cropPredictions = [];
      
        crops.forEach(async (crop) => {
          let score = 0;
          if (inRange(temperature, crop.temperature)) score += 25;
          if (inRange(humidity, crop.humidity)) score += 25;
          if (inRange(soil_moisture, crop.soilMoisture)) score += 25;
          if (inRange(npk, crop.npk)) score += 25;
      
          if (score > highestScore) {
            highestScore = score;
            bestMatch = crop.name;
            cropPredictions.push(crop.name);
      
          }
        });
        return bestMatch
            ? { crop: bestMatch, crops:cropPredictions, matchPercent: highestScore }
            : { crop: "No suitable crop found", matchPercent: 0 };
      }

      const tableRows = data.map((row) => {
        let extraLabel = "";
      
        if (row.row_type === "OVERALL_AVG") {
          extraLabel = `Most suitable crop/s: ${cropForecast(row)?.crop}`;
        }
      
        return {
          cells: [
            extraLabel || row.crop_name || "",
            row.temperature,
            row.humidity,
            row.soil_moisture,
            row.npk,
            row.created_at ? new Date(row.created_at).toLocaleString() : "",
          ],
          rowType: row.row_type,
          extraLabel, // 👈 stored if you need it later
        };
      });

      autoTable(doc, {
        startY: 40,
        head: [tableColumn],
        body: tableRows.map(r => r.cells),
      
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [34, 197, 94] },
      
        didParseCell: function (data) {
          const rowIndex = data.row.index;
          const rowType = tableRows[rowIndex]?.rowType;
      
          // 🟨 Crop Average
          if (rowType === "CROP_AVG") {
            data.cell.styles.fillColor = [253, 224, 71];
            data.cell.styles.fontStyle = "bold";
          }
      
          // 🟩 Overall Average
          if (rowType === "OVERALL_AVG") {
            data.cell.styles.fillColor = [134, 239, 172];
            data.cell.styles.fontStyle = "bold";
          }
        },
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
