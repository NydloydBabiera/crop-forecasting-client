import React, { useState } from "react";
import DateRangePicker from "../components/DateRangePicker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DateRangeCombobox from "../components/DateRangeCombobox";
import FarmerInformation from "../components/FarmerInformation";
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

  const [selectedFarmer, setSelectedFarmer] = useState(null);

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

      const query = new URLSearchParams({
        start: formatDate(dateRange.startDate),
        end: formatDate(
          new Date(
            new Date(dateRange.endDate).setDate(
              new Date(dateRange.endDate).getDate() + 1
            )
          )
        ),
        farmerId: selectedFarmer?.farmer_information_id || "",
      }).toString();

      // 🔥 CALL BOTH APIs
      const [res1, res2] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/getCropForecastReport?${query}`),
        fetch(
          `${import.meta.env.VITE_API_URL}/getSensorReadingsReport?${query}`
        ),
      ]);

      const data1 = await res1.json(); // detailed
      const data2 = await res2.json(); // summary / grouped
      console.log("🚀 ~ generateReport ~ data2:", data2);

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // =========================
      // 📄 PAGE 1 - DETAILED DATA
      // =========================
      doc.setFontSize(18);
      doc.text("Sensor Reading Report", 14, 20);

      doc.setFontSize(11);
      doc.text(
        `Date Range: ${new Date(
          dateRange.startDate
        ).toLocaleDateString()} - ${new Date(
          dateRange.endDate
        ).toLocaleDateString()}`,
        14,
        28
      );

      if (selectedFarmer) {
        let y = 20; // starting Y position

        doc.setFontSize(11);
        doc.setFont(undefined, "bold");
        doc.text("Farmer Information", pageWidth - 14, y, { align: "right" });

        doc.setFont(undefined, "normal");
        doc.setFontSize(10);

        y += 6;
        doc.text(
          `Name: ${selectedFarmer.full_name || "-"}`,
          pageWidth - 35,
          y,
          {
            align: "right",
          }
        );

        y += 4;
        doc.text(
          `Address: ${selectedFarmer.address || "-"}`,
          pageWidth - 35,
          y,
          {
            align: "right",
          }
        );

        y += 4;
        doc.text(
          `Contact: ${selectedFarmer.contact_information || "-"}`,
          pageWidth - 35,
          y,
          { align: "right" }
        );
      }

      const tableColumn = [
        "Crop",
        "Temperature (°C)",
        "Humidity (%)",
        "Soil Moisture",
        "NPK",
      ];

      const inRange = (val, [min, max]) => val >= min && val <= max;
      function cropForecast(sensorData) {
        const { temperature, humidity, soil_moisture, npk } = sensorData;

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
            bestMatch = crop.name;
            cropPredictions.push(crop.name);
          }
        });
        return bestMatch
          ? {
              crop: cropPredictions.length ? cropPredictions.join(", ") : "",
              crops: cropPredictions,
              matchPercent: highestScore,
            }
          : { crop: "No suitable crop found", matchPercent: 0 };
      }

      const tableRows = data1.map((row) => {
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

      // =========================
      // 🎨 LEGEND SECTION
      // =========================
      let legendY = 40; // adjust if needed (same as table start)

      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.text("Legend:", 14, legendY);

      doc.setFont(undefined, "normal");
      doc.setFontSize(9);

      legendY += 6;

      // 🟡 Average Row
      doc.setFillColor(255, 255, 0); // yellow
      doc.rect(14, legendY - 4, 5, 5, "F"); // small color box
      doc.text("Average / Overall Row", 22, legendY);

      legendY += 6;

      // // 🟢 Header Row
      // doc.setFillColor(34, 197, 94); // green
      // doc.rect(14, legendY - 4, 5, 5, "F");
      // doc.text("Table Header", 22, legendY);

      // legendY += 6;

      // // ⚪ Normal Row
      // doc.setFillColor(255, 255, 255); // white
      // doc.rect(14, legendY - 4, 5, 5, "F");
      // doc.text("Regular Data Row", 22, legendY);

      autoTable(doc, {
        startY: legendY,
        head: [tableColumn],
        body: tableRows.map((r) => r.cells),
        styles: {
          fontSize: 9,
        },
        headStyles: { fillColor: [34, 197, 94] },
        didParseCell: function (data) {
          const rowIndex = data.row.index;
          const row = data1[rowIndex];

          const isAverage = !row.crop_name && !row.created_at; // 👈 detect avg row

          if (isAverage) {
            data.cell.styles.fillColor = [255, 255, 0]; // yellow
            data.cell.styles.fontStyle = "bold";
          }
        },
      });

      // =========================
      // 📄 PAGE 2 - SUMMARY
      // =========================
      doc.addPage();

      doc.setFontSize(18);
      doc.text("Summary Report", 14, 20);

      autoTable(doc, {
        startY: 30,
        head: [
          [
            "Date Recorded",
            "Temperature (°C)",
            "Humidity (%)",
            "Soil Moisture",
            "NPK",
          ],
        ],
        body: data2.map((row) => [
          row.created_at ? new Date(row.created_at).toLocaleString() : "",
          row.temperature,
          row.humidity,
          row.soil_moisture,
          row.npk,
        ]),
      });

      // =========================
      // 📄 PAGE 3 - MATRIX TABLE
      // =========================
      doc.addPage();

      doc.setFontSize(18);
      doc.text("Crop Suitability Matrix", 14, 20);

      autoTable(doc, {
        startY: 30,
        head: [tableColumn],
        body: crops.map((crop) => [
          crop.name,
          `${crop.temperature[0]} - ${crop.temperature[1]}`,
          `${crop.humidity[0]} - ${crop.humidity[1]}`,
          `${crop.soilMoisture[0]} - ${crop.soilMoisture[1]}`,
          `${crop.npk[0]} - ${crop.npk[1]}`,
        ]),
      });

      const pageCount = doc.getNumberOfPages();

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        doc.setFontSize(9);
        doc.setTextColor(150);

        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      // =========================
      // FINAL OUTPUT
      // =========================
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
    <div className="p-4 mt-24 ">
      <p className="text-3xl uppercase font-bold mb-4">Reports</p>

      {/* Wrap both components */}
      <div className="flex gap-4 items-center">
        <DateRangePicker onDateRangeChange={handleDateChange} />
        <DateRangeCombobox setDateRange={setDateRange} />
        <div className="w-64">
          <FarmerInformation
            isReport={false}
            onSelectedFarmer={setSelectedFarmer}
          />
        </div>
      </div>

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
