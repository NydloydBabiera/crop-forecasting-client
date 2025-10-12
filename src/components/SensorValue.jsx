import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SensorValue = () => {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    soil_moisture: 0,
    npk: 0,
  });
  const socketRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(apiUrl, {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current.id);
      });

      socketRef.current.on("sensor-update", (data) => {
        console.log("Received data:", data);
        setSensorData(data);
      });
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [apiUrl]);

  const cards = [
    {
      title: "Temperature",
      value: `${sensorData.temperature}°C`,
      color: "bg-blue-500",
    },
    {
      title: "Humidity",
      value: `${sensorData.humidity}%`,
      color: "bg-green-500",
    },
    // {
    //   title: "Soil Moisture",
    //   value: `${sensorData.soil_moisture}%`,
    //   color: "bg-purple-500",
    // },
    // { title: "NPK", value: `${sensorData.npk} mg/kg`, color: "bg-red-500" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Crop Name</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`rounded-2xl shadow-md p-6 text-white ${card.color}`}
          >
            <h2 className="text-lg font-medium">{card.title}</h2>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorValue;
